import { Container } from '../ui/Container'
import { Button } from '../ui/Button'

const steps = [
  { number: '01', text: 'Repère une panne près de toi' },
  { number: '02', text: 'Signale en 30 secondes' },
  { number: '03', text: 'Confirme les pannes des autres' },
]

export const HowItWorksSection = () => (
  <section className="py-24 md:py-32 bg-white">
    <Container>
      <h2 className="font-serif text-4xl md:text-5xl text-center mb-16">
        Comment ça marche ?
      </h2>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] bg-cream rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80"
            alt="Carte de Paris"
            className="w-full h-f"
          />
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="border-t border-ink-900/10 pt-6">
              <div className="flex items-baseline gap-4">
                <span className="text-sm text-ink-700">{step.number}</span>
                <p className="text-xl font-serif">{step.text}</p>
              </div>
            </div>
          ))}

          <Button variant="primary" size="md" className="mt-4">
            Découvrir →
          </Button>
        </div>
      </div>
    </Container>
  </section>
)