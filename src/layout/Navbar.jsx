import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'

export const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-900/5">
    <Container className="flex items-center justify-between h-16">
      <Link to="/" className="font-serif text-xl font-semibold">
        Not Working
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm">
        <Link to="/map" className="hover:text-primary-600 transition-colors">
          Carte
        </Link>

        <Link to="/report/new" className="hover:text-primary-600 transition-colors">
          Signaler
        </Link>

        <Link to="/about" className="hover:text-primary-600 transition-colors">
          A propos
        </Link>

        <Link to="/login">
          <Button variant="primary" size="sm">
            Se connecter →
          </Button>
        </Link>
      </div>
    </Container>
  </nav>
)