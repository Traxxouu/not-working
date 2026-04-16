import { useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Container } from '../ui/Container'

const testimonials = [
  {
    name: 'Elliot Williams',
    role: 'Membre depuis 1 jour',
    quote: 'Une application moderne qui me permet enfin de prévoir mes déplacements.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    name: 'Sophie Martin',
    role: 'Maman de 2 enfants',
    quote: "Avec une poussette, savoir à l'avance si l'ascenseur du métro fonctionne change tout.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  },
  {
    name: 'Karim Benali',
    role: 'Citoyen engagé',
    quote: "Enfin un outil concret pour rendre Paris plus inclusif. J'ai déjà signalé plusieurs pannes.",
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
  },
]

export const TestimonialsSection = () => {
  const [isPaused, setIsPaused] = useState(false)
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ 
      delay: 4000,
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
    <section className="py-24 md:py-32 bg-cream">
      <Container>
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-16">
          Ils en parlent.
        </h2>
      </Container>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((t) => (
            <div key={t.name} className="flex-[0_0_100%] md:flex-[0_0_60%] px-8">
              <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl p-8 md:p-12">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="font-serif text-4xl text-ink-900/20">"</span>
                  <p className="font-serif text-xl md:text-2xl leading-snug mb-6">
                    {t.quote}
                  </p>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-sm text-ink-700">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrôles du carrousel */}
      <Container>
        <div className="flex items-center justify-center gap-3 mt-10">
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