import useEmblaCarousel from 'embla-carousel-react'
import { Container } from '../ui/Container'

const testimonials = [
  {
    name: 'Elliot Williams',
    role: 'Membre depuis 1 jour',
    quote:
      'Une application moderne qui me permet enfin de prévoir mes déplacements.',
  },
  {
    name: 'Sophie Martin',
    role: 'Maman de 2 enfants',
    quote:
      "Avec une poussette, savoir à l'avance si l'ascenseur du métro fonctionne change tout.",
  },
  {
    name: 'Karim Benali',
    role: 'Citoyen engagé',
    quote:
      "Enfin un outil concret pour rendre Paris plus inclusif. J'ai déjà signalé plusieurs pannes.",
  },
]

export const TestimonialsSection = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'center' })

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
                    style={{
                      filter: 'sepia(0.3) hue-rotate(190deg)',
                    }}
                  />
                </div>

                <div>
                  <span className="font-serif text-4xl text-ink-900/20">
                    "
                  </span>

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
    </section>
  )
}