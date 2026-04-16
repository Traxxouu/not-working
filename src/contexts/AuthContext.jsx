import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

const fetchProfile = async (userId) => {
  try {
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
  } catch (err) {
    console.error('Erreur fetchProfile:', err)
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const safetyTimeout = setTimeout(() => {
      if (isMounted) setLoading(false)
    }, 3000)

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
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
      })
      .catch((err) => {
        console.error('Erreur getSession:', err)
        if (isMounted) setLoading(false)
      })

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