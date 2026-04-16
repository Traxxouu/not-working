import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

export const NotFound = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center bg-cream">
    <Container className="text-center max-w-2xl">
      <p className="font-serif text-9xl md:text-[12rem] leading-none mb-4">404</p>
      <h1 className="font-serif text-3xl md:text-4xl mb-4">Cette page semble etre en panne</h1>
      <p className="text-ink-700 mb-8">Pas de panique, on s'occupe de la signaler.</p>
      <Link to="/">
        <Button variant="primary" size="lg">Retour a l'accueil</Button>
      </Link>
    </Container>
  </div>
)
