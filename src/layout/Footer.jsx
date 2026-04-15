import { Container } from '../ui/Container'

export const Footer = () => (
  <footer className="bg-ink-900 text-white py-16">
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-serif text-2xl mb-4">Not Working</h3>
          <p className="text-white/60 text-sm">
            Plateforme citoyenne pour une ville plus accessible.
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-sm">Produit</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Carte</li>
            <li>Signaler</li>
            <li>Catégories</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-sm">Équipe</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Maël Barbe</li>
            <li>Hugo</li>
            <li>Elisei</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-sm">Projet</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>EFREI B2 — 2026</li>
            <li>GitHub</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/40">
        © 2026 Not Working. Projet étudiant EFREI B2.
      </div>
    </Container>
  </footer>
)