import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { signIn } from '../services'

export const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signIn(form.email, form.password)

    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    // Connexion réussie → redirection vers la carte
    navigate('/map')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center bg-cream">
      <Container className="max-w-md">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <h1 className="font-serif text-4xl mb-2">Bon retour.</h1>
          <p className="text-ink-700 mb-8">Connectez-vous pour signaler des pannes.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="vous@exemple.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <input 
                type="password" 
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter →'}
            </Button>
          </form>

          <p className="text-center text-sm text-ink-700 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-ink-900 font-medium hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </Container>
    </div>
  )
}