import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

const team = [
  {
    name: 'Maël Barbe',
    role: 'Backend & Architecture',
    description: 'Setup du projet, base de données Supabase, authentification, service layer et intégration frontend-backend.',
    initials: 'MB',
    color: 'bg-primary-500',
  },
  {
    name: 'Hugo Tchen',
    role: 'Routing & Carte',
    description: 'Mise en place de React Router, pages auth, carte interactive avec Leaflet et système de confirmation.',
    initials: 'HT',
    color: 'bg-accent-500',
  },
  {
    name: 'Elisei Jurgiu',
    role: 'Design & UI',
    description: 'Design system complet, composants UI, landing page avec animations et identité visuelle du projet.',
    initials: 'EJ',
    color: 'bg-purple-500',
  },
]

const techStack = [
  { name: 'React 19', category: 'Frontend' },
  { name: 'Vite', category: 'Build' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'React Router v7', category: 'Routing' },
  { name: 'Supabase', category: 'Backend + BDD + Auth' },
  { name: 'PostgreSQL', category: 'Base de données' },
  { name: 'Leaflet', category: 'Cartographie' },
  { name: 'OpenStreetMap', category: 'Tiles' },
]

export const About = () => (
  <div className="bg-cream">
    {/* Hero */}
    <section className="py-24 md:py-32 bg-white">
      <Container className="max-w-4xl text-center">
        <p className="text-sm uppercase tracking-widest text-ink-700 mb-6">
          À propos du projet
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight mb-8">
          Une ville qui fonctionne,<br />
          <span className="italic">c'est notre affaire.</span>
        </h1>
        <p className="text-lg md:text-xl text-ink-700 max-w-2xl mx-auto">
          Not Working est une plateforme collaborative née pendant un hackathon à l'EFREI Paris, 
          pensée pour rendre la ville plus accessible à tous.
        </p>
      </Container>
    </section>

    {/* Problématique */}
    <section className="py-24 md:py-32">
      <Container className="max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-ink-700 mb-4">
              La problématique
            </p>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Paris est une ville magnifique. <span className="italic">Mais pas pour tous.</span>
            </h2>
            <p className="text-ink-700 leading-relaxed">
              Les ascenseurs du métro tombent en panne sans prévenir. Les escalators sont hors service pendant des semaines. 
              Les horodateurs refusent les paiements. Chaque équipement cassé devient un obstacle, particulièrement pour 
              les personnes à mobilité réduite, les parents avec poussettes et les personnes âgées.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl">20%</span>
              <span className="text-sm text-ink-700">des ascenseurs du métro parisien sont hors service à un moment donné</span>
            </div>
            <div className="flex items-baseline gap-3 pt-4 border-t border-ink-900/10">
              <span className="font-serif text-4xl">3j</span>
              <span className="text-sm text-ink-700">temps moyen de réparation d'un équipement en panne</span>
            </div>
            <div className="flex items-baseline gap-3 pt-4 border-t border-ink-900/10">
              <span className="font-serif text-4xl">12%</span>
              <span className="text-sm text-ink-700">des parisiens concernés directement par ces pannes</span>
            </div>
          </div>
        </div>
      </Container>
    </section>

    {/* Solution */}
    <section className="py-24 md:py-32 bg-ink-900 text-white">
      <Container className="max-w-4xl text-center">
        <p className="text-sm uppercase tracking-widest text-white/60 mb-6">
          Notre solution
        </p>
        <h2 className="font-serif text-4xl md:text-6xl mb-8">
          Signaler. Confirmer. <span className="italic">Améliorer.</span>
        </h2>
        <p className="text-white/70 text-lg leading-relaxed mb-12">
          Une plateforme collaborative où chaque citoyen peut signaler une panne en quelques secondes, 
          et où la communauté valide en temps réel l'état des équipements publics.
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div>
            <p className="text-sm text-white/60 mb-2">01</p>
            <h3 className="font-serif text-2xl mb-2">Signaler</h3>
            <p className="text-white/70 text-sm">En 30 secondes, indique la panne et sa localisation précise.</p>
          </div>
          <div>
            <p className="text-sm text-white/60 mb-2">02</p>
            <h3 className="font-serif text-2xl mb-2">Confirmer</h3>
            <p className="text-white/70 text-sm">Les autres utilisateurs confirment ou infirment le signalement.</p>
          </div>
          <div>
            <p className="text-sm text-white/60 mb-2">03</p>
            <h3 className="font-serif text-2xl mb-2">Améliorer</h3>
            <p className="text-white/70 text-sm">Les autorités sont alertées des pannes les plus confirmées.</p>
          </div>
        </div>
      </Container>
    </section>

    {/* Équipe */}
    <section className="py-24 md:py-32 bg-white">
      <Container className="max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-ink-700 mb-4">
            L'équipe
          </p>
          <h2 className="font-serif text-4xl md:text-6xl">
            Trois étudiants, <span className="italic">une idée.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className={`w-24 h-24 rounded-full ${member.color} text-white flex items-center justify-center font-serif text-3xl mx-auto mb-6`}>
                {member.initials}
              </div>
              <h3 className="font-serif text-2xl mb-1">{member.name}</h3>
              <p className="text-sm text-ink-700 mb-4">{member.role}</p>
              <p className="text-sm text-ink-700 leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>

    {/* Stack */}
    <section className="py-24 md:py-32 bg-cream">
      <Container className="max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-ink-700 mb-4">
            Technologies
          </p>
          <h2 className="font-serif text-4xl md:text-6xl">
            Stack <span className="italic">technique.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techStack.map((tech) => (
            <div key={tech.name} className="bg-white rounded-2xl p-5 border border-ink-900/5">
              <p className="text-xs uppercase tracking-wide text-ink-700/60 mb-1">{tech.category}</p>
              <p className="font-serif text-lg">{tech.name}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>

    {/* CTA */}
    <section className="py-24 md:py-32 bg-white">
      <Container className="max-w-2xl text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-8">
          Rejoignez le mouvement.
        </h2>
        <p className="text-ink-700 mb-10">
          Chaque signalement compte. Aidez-nous à rendre Paris accessible à tous.
        </p>
        <Link to="/signup">
          <Button variant="primary" size="lg">S'inscrire gratuitement →</Button>
        </Link>
      </Container>
    </section>
  </div>
)