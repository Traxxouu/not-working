import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

const fetchProfile = async (userId) => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    profile: null,
    loading: true,
    isAuthenticated: false,
  })

  // Fonction pour refresh la session manuellement quand on revient sur l'onglet
  const refreshSession = useCallback(async () => {
    try {
      // Tente de récupérer la session existante
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        // Si la session est morte, on essaie de la refresh
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError || !refreshData.session) {
          // Session définitivement morte → user déconnecté
          setState({ user: null, profile: null, loading: false, isAuthenticated: false })
          return
        }
        
        // Refresh réussi
        const u = refreshData.session.user
        const p = await fetchProfile(u.id)
        setState({ user: u, profile: p, loading: false, isAuthenticated: true })
        return
      }

      // Session OK
      const u = session.user
      const p = await fetchProfile(u.id)
      setState({ user: u, profile: p, loading: false, isAuthenticated: true })
    } catch {
      setState({ user: null, profile: null, loading: false, isAuthenticated: false })
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // Force stop loading après 3s quoi qu'il arrive
    const timeout = setTimeout(() => {
      if (mounted) setState(prev => ({ ...prev, loading: false }))
    }, 3000)

    // Init
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        
        const u = session?.user ?? null
        const p = u ? await fetchProfile(u.id) : null
        
        if (mounted) {
          clearTimeout(timeout)
          setState({ user: u, profile: p, loading: false, isAuthenticated: !!u })
        }
      } catch {
        if (mounted) {
          clearTimeout(timeout)
          setState({ user: null, profile: null, loading: false, isAuthenticated: false })
        }
      }
    }

    init()

    // Écoute UNIQUEMENT login et logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        // On ignore TOUT sauf SIGNED_IN et SIGNED_OUT
        if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return

        const u = session?.user ?? null
        const p = u ? await fetchProfile(u.id) : null
        
        if (mounted) {
          setState({ user: u, profile: p, loading: false, isAuthenticated: !!u })
        }
      }
    )

    // LE FIX CLÉ : quand l'onglet redevient visible, on refresh la session
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && mounted) {
        refreshSession()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshSession])

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  )
}