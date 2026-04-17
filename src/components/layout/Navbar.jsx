import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../services'

export const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, profile, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try { await signOut() } catch (error) {
      console.error('Logout failed:', error)
    }
    setMobileOpen(false)
    navigate('/')
  }

  const handleNavClick = () => setMobileOpen(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-900/5">
        <Container className="flex items-center justify-between h-16">
          <Link to="/" className="font-serif text-xl font-semibold" onClick={handleNavClick}>
            Not Working
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link to="/map" className="hover:text-primary-600 transition-colors">Carte</Link>
            <Link to="/report/new" className="hover:text-primary-600 transition-colors">Signaler</Link>
            {profile?.role === 'admin' && (
              <Link to="/admin" className="text-red-500 hover:text-red-600 transition-colors font-medium">Admin</Link>
            )}
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
                <button onClick={handleLogout} className="text-sm text-ink-700 hover:text-ink-900 transition-colors px-3 py-1.5 rounded-full hover:bg-ink-900/5">
                  Se déconnecter
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">Se connecter →</Button>
              </Link>
            )}
          </div>

          {/* Burger Button (mobile) */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-ink-900 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-ink-900 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-ink-900 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </Container>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm" />
          
          {/* Menu Panel */}
          <div 
            className="absolute top-16 right-0 w-80 max-w-[calc(100vw-2rem)] m-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User info (si connecté) */}
            {isAuthenticated && profile && (
              <div className="p-6 bg-cream border-b border-ink-900/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-serif text-xl">
                    {profile.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-medium">{profile.username}</p>
                    <p className="text-xs text-ink-700">{profile.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="p-4">
              <Link to="/map" onClick={handleNavClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors text-sm font-medium">
                🗺️ Carte
              </Link>
              <Link to="/report/new" onClick={handleNavClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors text-sm font-medium">
                📝 Signaler une panne
              </Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" onClick={handleNavClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium text-red-500">
                  🔐 Administration
                </Link>
              )}
              <Link to="/about" onClick={handleNavClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors text-sm font-medium">
                ℹ️ À propos
              </Link>

              {isAuthenticated && (
                <>
                  <div className="h-px bg-ink-900/5 my-2" />
                  <Link to="/profile" onClick={handleNavClick} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors text-sm font-medium">
                    👤 Mon profil
                  </Link>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 pt-0">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  🚪 Se déconnecter
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={handleNavClick}>
                    <Button variant="primary" size="md" className="w-full justify-center">
                      Se connecter →
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={handleNavClick}>
                    <Button variant="secondary" size="md" className="w-full justify-center">
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}