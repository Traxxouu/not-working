import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { LocationPicker } from '../components/map/LocationPicker'
import { useAuth } from '../hooks/useAuth'
import { createReport } from '../services'
import { CATEGORIES } from '../lib/categories'

export const ReportNew = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    category: '',
    title: '',
    description: '',
    location_name: '',
    position: null,
  })

  // Redirection si pas connecté
  if (!authLoading && !isAuthenticated) {
    navigate('/login')
    return null
  }

  const canGoNext = () => {
    if (step === 1) return !!form.category
    if (step === 2) return form.title.length >= 3 && form.location_name.length >= 3
    if (step === 3) return !!form.position
    return false
  }

  const handleNext = () => {
    if (canGoNext()) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await createReport({
      user_id: user.id,
      category: form.category,
      title: form.title,
      description: form.description,
      location_name: form.location_name,
      latitude: form.position[0],
      longitude: form.position[1],
    })

    setLoading(false)

    if (error) {
      toast.error('Erreur lors de la création du signalement')
      console.error(error)
      return
    }

    toast.success('Signalement créé ! 🎉')
    navigate('/map')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream py-12">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-ink-700 mb-4">
            Étape {step} sur 3
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            {step === 1 && 'Quel type de panne ?'}
            {step === 2 && 'Décrivez la panne'}
            {step === 3 && 'Où se trouve-t-elle ?'}
          </h1>
          <p className="text-ink-700">
            {step === 1 && 'Choisissez la catégorie qui correspond le mieux.'}
            {step === 2 && 'Soyez précis pour aider les autres citoyens.'}
            {step === 3 && 'Cliquez sur la carte pour placer le signalement.'}
          </p>
        </div>

        {/* Barre de progression */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 w-20 rounded-full transition-colors ${
                s <= step ? 'bg-ink-900' : 'bg-ink-900/10'
              }`}
            />
          ))}
        </div>

        {/* Contenu selon étape */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
          
          {/* ÉTAPE 1 : Catégorie */}
          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm({ ...form, category: key })}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    form.category === key
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-ink-900/10 hover:border-ink-900/30 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="font-serif text-lg">{cat.label}</div>
                </button>
              ))}
            </div>
          )}

          {/* ÉTAPE 2 : Description */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Titre du signalement <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex : Ascenseur en panne depuis 2 jours"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <p className="text-xs text-ink-700/60 mt-1">{form.title.length}/100</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lieu précis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.location_name}
                  onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                  placeholder="Ex : Métro Châtelet, sortie place Sainte-Opportune"
                  className="w-full px-4 py-3 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description détaillée (optionnel)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Plus de détails sur la panne, son impact, depuis quand..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                />
                <p className="text-xs text-ink-700/60 mt-1">{form.description.length}/500</p>
              </div>

              {/* Récap catégorie choisie */}
              <div className="pt-4 border-t border-ink-900/10">
                <p className="text-xs uppercase tracking-wide text-ink-700/60 mb-2">Catégorie choisie</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-white rounded-full text-sm">
                  {CATEGORIES[form.category]?.icon} {CATEGORIES[form.category]?.label}
                </div>
              </div>
            </div>
          )}

            {/* ÉTAPE 3 : Position sur la carte */}
            {step === 3 && (
            <div className="space-y-5">
                <LocationPicker 
                position={form.position} 
                setPosition={(pos) => setForm({ ...form, position: pos })}
                onAddressFound={(address) => {
                    // Si le user n'a pas précisé de lieu à l'étape 2, on auto-remplit
                    if (!form.location_name || form.location_name.length < 3) {
                    setForm(prev => ({ ...prev, location_name: address }))
                    }
                }}
                />

              {form.position ? (
                <div className="bg-primary-50 border border-primary-500/20 rounded-xl px-4 py-3 text-sm">
                  ✅ Position sélectionnée : <span className="font-mono">{form.position[0].toFixed(4)}, {form.position[1].toFixed(4)}</span>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-900">
                  👆 Cliquez sur la carte pour placer le signalement
                </div>
              )}

              {/* Récap complet */}
              <div className="pt-4 border-t border-ink-900/10 space-y-3">
                <p className="text-xs uppercase tracking-wide text-ink-700/60">Récapitulatif</p>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-ink-700">Catégorie :</span>
                    <span className="font-medium">{CATEGORIES[form.category]?.icon} {CATEGORIES[form.category]?.label}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-ink-700">Titre :</span>
                    <span className="font-medium">{form.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-ink-700">Lieu :</span>
                    <span className="font-medium">{form.location_name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="text-sm text-ink-700 hover:text-ink-900 px-4 py-2"
            >
              ← Retour
            </button>
          ) : (
            <button
              onClick={() => navigate('/map')}
              className="text-sm text-ink-700 hover:text-ink-900 px-4 py-2"
            >
              ← Annuler
            </button>
          )}

          {step < 3 ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleNext}
              disabled={!canGoNext()}
              className={!canGoNext() ? 'opacity-40 cursor-not-allowed' : ''}
            >
              Continuer →
            </Button>
          ) : (
            <Button
              variant="accent"
              size="lg"
              onClick={handleSubmit}
              disabled={!canGoNext() || loading}
              className={!canGoNext() || loading ? 'opacity-40 cursor-not-allowed' : ''}
            >
              {loading ? 'Envoi...' : 'Publier le signalement'}
            </Button>
          )}
        </div>
      </Container>
    </div>
  )
}