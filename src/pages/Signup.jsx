import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

export const Signup = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO : Mael connectera à Supabase
    console.log('Signup submit')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center bg-cream py-12">
      <Container className="max-w-md">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <h1 className="font-serif text-4xl mb-2">Rejoignez-nous.</h1>
          <p className="text-ink-700 mb-8">Créez votre compte en 30 secondes.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Pseudo</label>
              <input
                type="text"
                required
                minLength={3}
                className="w-full px-4 py-3 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 transition"
                placeholder="votre_pseudo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 transition"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 transition"
                placeholder="6 caracteres minimum"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
              Creer mon compte →
            </Button>
          </form>

          <p className="text-center text-sm text-ink-700 mt-6">
            Deja un compte ?{' '}
            <Link to="/login" className="text-ink-900 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </Container>
    </div>
  )
}
