import { useEffect, useState } from 'react'
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

  useEffect(() => {
    let mounted = true

    // Force stop loading après 2s quoi qu'il arrive
    const timeout = setTimeout(() => {
      if (mounted) setState(prev => ({ ...prev, loading: false }))
    }, 2000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      clearTimeout(timeout)
      const u = session?.user ?? null
      const p = u ? await fetchProfile(u.id) : null
      if (mounted) {
        setState({ user: u, profile: p, loading: false, isAuthenticated: !!u })
      }
    }).catch(() => {
      if (mounted) {
        clearTimeout(timeout)
        setState({ user: null, profile: null, loading: false, isAuthenticated: false })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        // IGNORER tout sauf login/logout
        if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return

        const u = session?.user ?? null
        const p = u ? await fetchProfile(u.id) : null
        if (mounted) {
          setState({ user: u, profile: p, loading: false, isAuthenticated: !!u })
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  )
}