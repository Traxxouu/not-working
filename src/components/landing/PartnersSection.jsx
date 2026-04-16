import { Container } from '../ui/Container'

const partners = [
  {
    name: 'RATP',
    description: 'Partenariat stratégique pour synchroniser les pannes des ascenseurs et escalators du métro parisien en temps réel. Nos signalements citoyens remontent directement à leurs équipes techniques.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/RATP_2023.svg/320px-RATP_2023.svg.png',
    align: 'left',
  },
  {
    name: 'SNCF',
    description: 'Intégration avec les gares d\'Île-de-France pour couvrir les RER et Transiliens. Gare du Nord, Gare de Lyon, Saint-Lazare : tous les équipements accessibles référencés sur notre carte.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/SNCF.svg/320px-SNCF.svg.png',
    align: 'right',
  },
  {
    name: 'Île-de-France Mobilités',
    description: 'Autorité organisatrice des transports franciliens. Partenaire clé pour unifier les données d\'accessibilité de tous les opérateurs de transport de la région.',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/a/a5/Logo_%C3%8Ele-de-France_Mobilit%C3%A9s.svg/320px-Logo_%C3%8Ele-de-France_Mobilit%C3%A9s.svg.png',
    align: 'left',
  },
  {
    name: 'Ville de Paris',
    description: 'Collaboration avec la Mairie de Paris pour les équipements municipaux : éclairage public, horodateurs, mobilier urbain. Accès privilégié à l\'open data parisien.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Logo_Paris_2024.svg/320px-Logo_Paris_2024.svg.png',
    align: 'right',
  },
  {
    name: 'APF France Handicap',
    description: 'Association partenaire pour garantir que l\'application réponde aux vrais besoins des personnes à mobilité réduite. Co-construction des fonctionnalités avec les concernés.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Logo_APF_France_handicap.svg/320px-Logo_APF_France_handicap.svg.png',
    align: 'left',
  },
  {
    name: 'Belib\' Paris',
    description: 'Réseau officiel de bornes de recharge électriques parisiennes. Signalement temps réel des bornes en panne pour les conducteurs de véhicules électriques.',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/2/26/Logo_Belib%27.svg/320px-Logo_Belib%27.svg.png',
    align: 'right',
  },
]

export const PartnersSection = () => (
  <section className="py-24 md:py-32 bg-cream">
    <Container>
      <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">
        Nos partenaires
      </h2>
      <p className="text-center text-ink-700 max-w-2xl mx-auto mb-20">
        Pour construire une ville vraiment accessible, on s'associe avec ceux qui connaissent le terrain.
      </p>

      <div className="space-y-8 md:space-y-12">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className={`flex items-center gap-6 md:gap-10 ${
              partner.align === 'right' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Logo rond */}
            <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center shadow-sm border border-ink-900/5 p-4">
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Texte dans une card sombre */}
            <div className="flex-1 bg-ink-900 text-white rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-xl md:text-2xl mb-2">
                {partner.name}
              </h3>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                {partner.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer bas de section */}
      <p className="text-center text-xs text-ink-700/60 mt-16 italic">
        * Partenariats envisagés dans le cadre du déploiement futur de la plateforme.
      </p>
    </Container>
  </section>
)