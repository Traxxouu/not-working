import { supabase } from '../lib/supabase'

/**
 * Inscription d'un nouvel utilisateur
 * @param {string} email
 * @param {string} password
 * @param {string} username
 */
export const signUp = async (email, password, username) => {
  // Vérifier que le username n'existe pas déjà
  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle()

  if (existing) {
    return { data: null, error: { message: 'Ce pseudo est déjà pris' } }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // sera utilisé par le trigger handle_new_user
    },
  })

  return { data, error }
}

/**
 * Connexion d'un utilisateur
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

/**
 * Déconnexion
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Récupérer la session courante
 */
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Récupérer un profile par ID
 */
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

/**
 * Mettre à jour son profile
 */
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}