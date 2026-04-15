import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'

export const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden">
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=2000&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white" />
    </div>

    <Container className="relative z-10 text-center pt-20">
      <p className="text-sm uppercase tracking-widest text-ink-700 mb-6 animate-fade-in">
        Plateforme citoyenne · Paris
      </p>

      <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-8 animate-slide-up">
        Signalez. Confirmez.<br />
        <span className="italic">Améliorons Paris</span> ensemble.
      </h1>

      <p className="text-lg md:text-xl text-ink-700 max-w-2xl mx-auto mb-10 animate-slide-up">
        La plateforme collaborative qui répare la ville, un signalement à la fois.
        Pour une mobilité accessible à tous.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
        <Link to="/signup"><Button variant="primary" size="lg">S'inscrire →</Button></Link>
        <Link to="/map"><Button variant="secondary" size="lg">Voir la carte</Button></Link>
      </div>
    </Container>
  </section>
)