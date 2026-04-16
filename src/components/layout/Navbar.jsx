import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../services'

export const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, profile, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Erreur logout:', err)
    }
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-900/5">
      <Container className="flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-xl font-semibold">Not Working</Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/map" className="hover:text-primary-600 transition-colors">Carte</Link>
          <Link to="/report/new" className="hover:text-primary-600 transition-colors">Signaler</Link>
          <Link to="/about" className="hover:text-primary-600 transition-colors">À propos</Link>
          
          {loading ? (
            <div className="w-20 h-8 bg-ink-900/5 rounded-full animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
                  {profile?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="text-sm font-medium">{profile?.username || 'Profil'}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm text-ink-700 hover:text-ink-900 transition-colors px-3 py-1.5 rounded-full hover:bg-ink-900/5"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm">Se connecter →</Button>
            </Link>
          )}
        </div>
      </Container>
    </nav>
  )
}