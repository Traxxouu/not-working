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
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Timeout de sécurité
    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false)
    }, 2000)

    // Init session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const p = await fetchProfile(currentUser.id)
        if (isMounted) setProfile(p)
      }
      clearTimeout(timeout)
      if (isMounted) setLoading(false)
    }).catch(() => {
      if (isMounted) setLoading(false)
    })

    // Listener auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return
        if (event === 'TOKEN_REFRESHED') return

        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          const p = await fetchProfile(currentUser.id)
          if (isMounted) setProfile(p)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      isMounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}