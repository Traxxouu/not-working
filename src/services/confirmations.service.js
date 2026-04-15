import { supabase } from '../lib/supabase'

/**
 * Récupère toutes les confirmations d'un signalement avec le profil de l'utilisateur
 */
export const getConfirmationsByReport = async (reportId) => {
  const { data, error } = await supabase
    .from('confirmations')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        avatar_url
      )
    `)
    .eq('report_id', reportId)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Vérifie si un utilisateur a déjà confirmé un signalement
 */
export const hasUserConfirmed = async (reportId, userId) => {
  const { data, error } = await supabase
    .from('confirmations')
    .select('id')
    .eq('report_id', reportId)
    .eq('user_id', userId)
    .maybeSingle()

  return { hasConfirmed: !!data, error }
}

/**
 * Ajoute une confirmation
 * (le compteur confirmations_count est mis à jour automatiquement par un trigger SQL)
 */
export const addConfirmation = async (reportId, userId) => {
  const { data, error } = await supabase
    .from('confirmations')
    .insert([{ report_id: reportId, user_id: userId }])
    .select()
    .single()

  return { data, error }
}

/**
 * Retire une confirmation
 * (le compteur confirmations_count est mis à jour automatiquement par un trigger SQL)
 */
export const removeConfirmation = async (reportId, userId) => {
  const { error } = await supabase
    .from('confirmations')
    .delete()
    .eq('report_id', reportId)
    .eq('user_id', userId)

  return { error }
}

/**
 * Toggle la confirmation : ajoute si pas confirmé, retire si déjà confirmé
 * C'est la fonction principale que Hugo utilisera pour son bouton de confirmation
 */
export const toggleConfirmation = async (reportId, userId) => {
  const { hasConfirmed } = await hasUserConfirmed(reportId, userId)

  if (hasConfirmed) {
    const { error } = await removeConfirmation(reportId, userId)
    return { action: 'removed', error }
  } else {
    const { error } = await addConfirmation(reportId, userId)
    return { action: 'added', error }
  }
}

/**
 * Récupère le nombre de confirmations d'un utilisateur (pour son profil)
 */
export const getUserConfirmationsCount = async (userId) => {
  const { count, error } = await supabase
    .from('confirmations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return { count: count || 0, error }
}