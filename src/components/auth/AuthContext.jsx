import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Erreur récupération profile:', error)
    return null
  }
  return data
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Timeout de sécurité : arrête le loading après 3s max
    const safetyTimeout = setTimeout(() => {
      if (isMounted) setLoading(false)
    }, 3000)

    // Récupère la session courante au chargement
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return
      
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id)
        if (isMounted) setProfile(userProfile)
      }
      
      if (isMounted) {
        clearTimeout(safetyTimeout)
        setLoading(false)
      }
    }).catch((err) => {
      console.error('Erreur getSession:', err)
      if (isMounted) setLoading(false)
    })

    // Écoute les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id)
          if (isMounted) setProfile(userProfile)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      isMounted = false
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}