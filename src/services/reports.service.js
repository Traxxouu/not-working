import { supabase } from '../lib/supabase'

/**
 * Récupère tous les signalements avec le profil du créateur
 * Possibilité de filtrer par catégorie et statut
 */
export const getAllReports = async ({ category = null, status = null } = {}) => {
  let query = supabase
    .from('reports')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  return { data, error }
}

/**
 * Récupère un signalement par son ID avec le profil du créateur
 */
export const getReportById = async (id) => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        avatar_url
      )
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Récupère tous les signalements d'un utilisateur
 */
export const getReportsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Crée un nouveau signalement
 */
export const createReport = async (report) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([report])
    .select()
    .single()

  return { data, error }
}

/**
 * Met à jour un signalement (RLS s'assure que seul le créateur peut le faire)
 */
export const updateReport = async (id, updates) => {
  const { data, error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Marque un signalement comme résolu
 */
export const markAsResolved = async (id) => {
  const { data, error } = await supabase
    .from('reports')
    .update({
      status: 'resolu',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Marque un signalement comme à nouveau en panne
 */
export const markAsBroken = async (id) => {
  const { data, error } = await supabase
    .from('reports')
    .update({
      status: 'en_panne',
      resolved_at: null,
    })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Supprime un signalement (RLS s'assure que seul le créateur peut le faire)
 */
export const deleteReport = async (id) => {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id)

  return { error }
}

/**
 * Récupère les signalements dans un rayon autour d'un point
 * (calcul côté client, suffisant pour Paris)
 */
export const getReportsNearby = async (latitude, longitude, radiusKm = 2) => {
  const { data, error } = await getAllReports()
  if (error) return { data: null, error }

  const filtered = data.filter((report) => {
    const dx = (report.latitude - latitude) * 111
    const dy = (report.longitude - longitude) * 111 * Math.cos(latitude * Math.PI / 180)
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance <= radiusKm
  })

  return { data: filtered, error: null }
}

/**
 * Récupère les stats globales (pour la landing page)
 */
export const getStats = async () => {
  const { count: totalActive } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'en_panne')

  const { count: totalResolved } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolu')

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  return {
    activeReports: totalActive || 0,
    resolvedReports: totalResolved || 0,
    totalUsers: totalUsers || 0,
  }
}