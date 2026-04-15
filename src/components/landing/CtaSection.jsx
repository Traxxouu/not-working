import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'

export const CtaSection = () => (
  <section className="relative py-32 md:py-48 overflow-hidden">
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=2000&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-white/85" />
    </div>

    <Container className="relative z-10 text-center">
      <h2 className="font-serif text-5xl md:text-7xl mb-8">
        Prêt à améliorer Paris ?
      </h2>

      <Link to="/signup">
        <Button variant="primary" size="lg">
          S'inscrire gratuitement →
        </Button>
      </Link>
    </Container>
  </section>
)