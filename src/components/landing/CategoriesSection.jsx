import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useState } from 'react'
import { Container } from '../ui/Container'

const categories = [
  { 
    name: 'Ascenseurs', 
    description: 'Pannes dans le métro et bâtiments publics',
    image: '/categories/ascenseur.png',
    color: 'from-blue-500 to-blue-700',
  },
  { 
    name: 'Escalators', 
    description: 'Escalators mécaniques hors service',
    image: '/categories/escalator.png',
    color: 'from-purple-500 to-purple-700',
  },
  { 
    name: 'Portes auto', 
    description: 'Portes automatiques bloquées',
    image: '/categories/porte.png',
    color: 'from-indigo-500 to-indigo-700',
  },
  { 
    name: 'Distributeurs', 
    description: 'Distributeurs de billets en panne',
    image: '/categories/distributeur.png',
    color: 'from-emerald-500 to-emerald-700',
  },
  { 
    name: 'Bornes recharge', 
    description: 'Bornes pour véhicules électriques',
    image: '/categories/borne-recharge.png',
    color: 'from-amber-500 to-amber-700',
  },
  { 
    name: 'Horodateurs', 
    description: 'Bornes de paiement stationnement',
    image: '/categories/horodateur.png',
    color: 'from-red-500 to-red-700',
  },
  { 
    name: 'Éclairage', 
    description: 'Lampadaires et éclairage urbain',
    image: '/categories/eclairage.png',
    color: 'from-yellow-400 to-yellow-600',
  },
  { 
    name: 'Interphones', 
    description: 'Interphones et accès immeubles',
    image: '/categories/interphone.png',
    color: 'from-cyan-500 to-cyan-700',
  },
  { 
    name: 'Bornes info', 
    description: 'Bornes d\'information touristique',
    image: '/categories/borne-info.png',
    color: 'from-slate-500 to-slate-700',
  },
]

export const CategoriesSection = () => {
  const [isPaused, setIsPaused] = useState(false)
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [Autoplay({ 
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      playOnInit: true,
    })]
  )

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
    const autoplay = emblaApi.plugins().autoplay
    if (autoplay && !isPaused) autoplay.reset()
  }, [emblaApi, isPaused])

  const scrollNext = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
    const autoplay = emblaApi.plugins().autoplay
    if (autoplay && !isPaused) autoplay.reset()
  }, [emblaApi, isPaused])

  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return
    const autoplay = emblaApi.plugins().autoplay
    if (!autoplay) return
    if (isPaused) {
      autoplay.play()
      setIsPaused(false)
    } else {
      autoplay.stop()
      setIsPaused(true)
    }
  }, [emblaApi, isPaused])

  return (
    <section className="py-24 md:py-32 bg-cream overflow-hidden">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-widest text-ink-700 mb-4">
              9 catégories · Paris
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mb-4">
              Tous les équipements <span className="italic">publics.</span>
            </h2>
            <p className="text-ink-700 text-lg">
              Du métro au mobilier urbain, signalez n'importe quelle panne en quelques secondes.
            </p>
          </div>
        </div>
      </Container>

      {/* Carrousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 px-4 sm:px-6 lg:px-8 pb-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex-[0_0_320px] md:flex-[0_0_360px] group cursor-pointer"
            >
              <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br ${cat.color} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
                
                {/* Pattern de fond subtil */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }} />

                {/* Zone image 3D (quand tu les auras) */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>

                {/* Overlay gradient bas pour lisibilité texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Texte */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-2xl md:text-3xl mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-white/80 text-sm leading-snug">
                    {cat.description}
                  </p>
                </div>

                {/* Petit indicateur "en coin" */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-lg group-hover:bg-white group-hover:text-ink-900 transition-colors">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrôles du carrousel */}
      <Container>
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full bg-white border border-ink-900/10 hover:bg-ink-900 hover:text-white hover:border-ink-900 transition-colors flex items-center justify-center"
            aria-label="Précédent"
          >
            ←
          </button>
          <button
            onClick={toggleAutoplay}
            className="px-5 h-12 rounded-full bg-white border border-ink-900/10 hover:bg-ink-900 hover:text-white hover:border-ink-900 transition-colors text-sm font-medium flex items-center gap-2"
            aria-label={isPaused ? 'Reprendre' : 'Pause'}
          >
            {isPaused ? '▶ Reprendre' : '⏸ Pause'}
          </button>
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full bg-white border border-ink-900/10 hover:bg-ink-900 hover:text-white hover:border-ink-900 transition-colors flex items-center justify-center"
            aria-label="Suivant"
          >
            →
          </button>
        </div>
      </Container>
    </section>
  )
}