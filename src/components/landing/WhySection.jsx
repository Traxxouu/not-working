import { Container } from '../ui/Container'

const reasons = [
  {
    title: 'Accessibilité PMR',
    description:
      'Permettre aux personnes à mobilité réduite de planifier leurs déplacements en toute sérénité.',
  },
  {
    title: 'Parents avec poussettes',
    description:
      'Eviter les mauvaises surprises et trouver des itinéraires adaptés aux familles.',
  },
  {
    title: 'Personnes âgées',
    description:
      'Faciliter la mobilité quotidienne des seniors dans la ville.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80',
  },
  {
    title: 'Tous les citoyens',
    description:
      'Construire collectivement une ville qui fonctionne pour tout le monde.',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=80',
  },
]

export const WhySection = () => (
  <section className="py-24 md:py-32 bg-white">
    <Container>
      <h2 className="font-serif text-4xl md:text-5xl text-center mb-16">
        Pourquoi Not Working ?
      </h2>

      <div className="space-y-px">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="flex items-center gap-6 py-8 border-t border-ink-900/10 hover:bg-cream/50 transition-col"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={reason.image}
                alt={reason.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-serif text-2xl md:text-3xl mb-2">
                {reason.title}
              </h3>
              <p className="text-ink-700">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
)