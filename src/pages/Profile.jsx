import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES, STATUSES } from '../lib/categories'
import {
  getReportsByUser,
  getUserConfirmationsCount,
  deleteReport,
  markAsResolved,
  markAsBroken,
  signOut
} from '../services'

// Formatter de date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  if (diffHours < 1) return "à l'instant"
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays === 1) return 'hier'
  if (diffDays < 7) return `il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Système de badges
const getBadges = (reportsCount, confirmationsCount, resolvedCount) => {
  const badges = []
  
  if (reportsCount >= 1) badges.push({ icon: '🎯', name: 'Premier signal', desc: 'A créé son premier signalement' })
  if (reportsCount >= 5) badges.push({ icon: '🔥', name: 'Chasseur de pannes', desc: '5 signalements créés' })
  if (reportsCount >= 10) badges.push({ icon: '⚡', name: 'Sentinelle', desc: '10 signalements créés' })
  if (reportsCount >= 20) badges.push({ icon: '👑', name: 'Gardien de Paris', desc: '20 signalements créés' })
  
  if (confirmationsCount >= 1) badges.push({ icon: '👍', name: 'Validateur', desc: 'A confirmé sa première panne' })
  if (confirmationsCount >= 10) badges.push({ icon: '🤝', name: 'Citoyen actif', desc: '10 confirmations données' })
  if (confirmationsCount >= 25) badges.push({ icon: '💪', name: 'Pilier', desc: '25 confirmations données' })
  
  if (resolvedCount >= 1) badges.push({ icon: '🔧', name: 'Réparateur', desc: 'A résolu sa première panne' })
  if (resolvedCount >= 5) badges.push({ icon: '🏆', name: 'Héros urbain', desc: '5 pannes résolues' })
  
  return badges
}

// Calcul du niveau
const getLevel = (points) => {
  if (points < 5) return { level: 1, name: 'Débutant', min: 0, max: 5 }
  if (points < 15) return { level: 2, name: 'Explorateur', min: 5, max: 15 }
  if (points < 30) return { level: 3, name: 'Sentinelle', min: 15, max: 30 }
  if (points < 50) return { level: 4, name: 'Gardien', min: 30, max: 50 }
  return { level: 5, name: 'Légende', min: 50, max: 100 }
}

export const Profile = () => {
  const navigate = useNavigate()
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth()
  const [reports, setReports] = useState([])
  const [confirmationsCount, setConfirmationsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'en_panne', 'resolu'

  const loadData = async () => {
    setLoading(true)
    try {
      const [reportsRes, confirmRes] = await Promise.all([
        getReportsByUser(user.id),
        getUserConfirmationsCount(user.id)
      ])
      setReports(reportsRes.data || [])
      setConfirmationsCount(confirmRes.count)
    } catch (err) {
      console.error('Erreur chargement profil:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login')
      return
    }
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, isAuthenticated])

  const handleDelete = async (reportId) => {
    if (!confirm('Supprimer ce signalement ?')) return
    const { error } = await deleteReport(reportId)
    if (!error) {
      toast.success('Signalement supprimé')
      loadData()
    } else {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleToggleStatus = async (report) => {
    if (report.status === 'en_panne') {
      const { error } = await markAsResolved(report.id)
      if (!error) {
        toast.success('Marqué comme résolu ✅')
        loadData()
      }
    } else {
      const { error } = await markAsBroken(report.id)
      if (!error) {
        toast.success('Marqué comme en panne')
        loadData()
      }
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Erreur logout:', err)
    }
    navigate('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-900" />
      </div>
    )
  }

  // Calculs stats
  const resolvedCount = reports.filter(r => r.status === 'resolu').length
  const activeCount = reports.filter(r => r.status === 'en_panne').length
  const totalConfirmations = reports.reduce((acc, r) => acc + (r.confirmations_count || 0), 0)
  const points = (reports.length * 2) + (confirmationsCount * 1) + (resolvedCount * 3)
  const levelInfo = getLevel(points)
  const progressPercent = Math.min(100, ((points - levelInfo.min) / (levelInfo.max - levelInfo.min)) * 100)
  const badges = getBadges(reports.length, confirmationsCount, resolvedCount)

  // Filtrage par tab
  const filteredReports = activeTab === 'all' 
    ? reports 
    : reports.filter(r => r.status === activeTab)

  // Date d'inscription
  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '...'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream py-8 md:py-12">
      <Container className="max-w-5xl">

        {/* HEADER PROFIL */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-serif text-5xl md:text-6xl shadow-lg">
                {profile?.username?.[0]?.toUpperCase() || '?'}
              </div>
              {/* Badge niveau */}
              <div className="absolute -bottom-2 -right-2 bg-ink-900 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                Niv. {levelInfo.level}
              </div>
            </div>

            {/* Infos */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-serif text-4xl md:text-5xl mb-1">
                {profile?.username || 'Utilisateur'}
              </h1>
              <p className="text-ink-700 mb-1">{profile?.email}</p>
              <p className="text-sm text-ink-700/60 mb-6">
                Membre depuis {memberSince} · {levelInfo.name}
              </p>

              {/* Barre de progression XP */}
              <div className="max-w-md mx-auto md:mx-0">
                <div className="flex items-center justify-between text-xs text-ink-700 mb-2">
                  <span className="font-medium">{points} points</span>
                  <span>{levelInfo.max - points} pts avant niveau {levelInfo.level + 1}</span>
                </div>
                <div className="h-3 bg-ink-900/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bouton déconnexion */}
            <button
              onClick={handleLogout}
              className="text-sm text-ink-700 hover:text-ink-900 px-4 py-2 rounded-full hover:bg-ink-900/5 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="font-serif text-4xl mb-1">{reports.length}</p>
            <p className="text-xs text-ink-700">Signalements</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="font-serif text-4xl mb-1 text-red-500">{activeCount}</p>
            <p className="text-xs text-ink-700">En panne</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="font-serif text-4xl mb-1 text-primary-500">{resolvedCount}</p>
            <p className="text-xs text-ink-700">Résolus</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="font-serif text-4xl mb-1 text-accent-500">{confirmationsCount}</p>
            <p className="text-xs text-ink-700">Confirmations données</p>
          </div>
        </div>

        {/* BADGES */}
        {badges.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
            <h2 className="font-serif text-2xl mb-6">
              Badges débloqués <span className="text-ink-700/40">({badges.length})</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div key={badge.name} className="flex items-center gap-3 p-4 rounded-2xl bg-cream hover:bg-primary-50 transition-colors">
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    <p className="text-xs text-ink-700/60">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMPACT */}
        <div className="bg-ink-900 text-white rounded-3xl p-8 shadow-sm mb-8">
          <h2 className="font-serif text-2xl mb-2">Votre impact</h2>
          <p className="text-white/60 text-sm mb-6">Les chiffres qui comptent.</p>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="font-serif text-3xl md:text-4xl">{totalConfirmations}</p>
              <p className="text-white/60 text-xs mt-1">Confirmations reçues sur vos signalements</p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl">{resolvedCount}</p>
              <p className="text-white/60 text-xs mt-1">Pannes résolues grâce à vous</p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl">{points}</p>
              <p className="text-white/60 text-xs mt-1">Points de contribution</p>
            </div>
          </div>
        </div>

        {/* MES SIGNALEMENTS */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          {/* Header + Tabs */}
          <div className="p-8 pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="font-serif text-2xl">Mes signalements</h2>
              <Link to="/report/new">
                <Button variant="primary" size="sm">+ Nouveau signalement</Button>
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-ink-900/5">
              {[
                { key: 'all', label: `Tous (${reports.length})` },
                { key: 'en_panne', label: `En panne (${activeCount})` },
                { key: 'resolu', label: `Résolus (${resolvedCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-ink-900 text-ink-900'
                      : 'border-transparent text-ink-700 hover:text-ink-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          <div className="divide-y divide-ink-900/5">
            {filteredReports.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-serif text-xl mb-2">
                  {activeTab === 'all' 
                    ? 'Aucun signalement pour le moment'
                    : `Aucun signalement ${activeTab === 'en_panne' ? 'en panne' : 'résolu'}`
                  }
                </p>
                <p className="text-sm text-ink-700 mb-6">
                  Signalez votre première panne pour commencer à gagner des points !
                </p>
                <Link to="/report/new">
                  <Button variant="primary" size="md">Créer mon premier signalement →</Button>
                </Link>
              </div>
            ) : (
              filteredReports.map((report) => {
                const cat = CATEGORIES[report.category]
                const status = STATUSES[report.status]

                return (
                  <div key={report.id} className="flex items-center gap-4 px-8 py-5 hover:bg-cream/50 transition-colors">
                    {/* Icône catégorie */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ backgroundColor: `${cat?.color}15` }}
                    >
                      {cat?.icon}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link 
                          to={`/report/${report.id}`}
                          className="font-medium text-sm text-ink-900 hover:underline truncate"
                        >
                          {report.title}
                        </Link>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                          style={{ backgroundColor: status?.bgColor, color: status?.color }}
                        >
                          {status?.label}
                        </span>
                      </div>
                      <p className="text-xs text-ink-700 truncate">{report.location_name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-ink-700/60">
                        <span>{formatDate(report.created_at)}</span>
                        <span>·</span>
                        <span>👍 {report.confirmations_count}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleStatus(report)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          report.status === 'en_panne'
                            ? 'border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white'
                            : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        {report.status === 'en_panne' ? '✅ Résoudre' : '🔴 En panne'}
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="text-xs px-3 py-1.5 rounded-full border border-ink-900/10 text-ink-700 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* SYSTÈME DE POINTS */}
        <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">
          <h2 className="font-serif text-2xl mb-6">Comment gagner des points ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-cream">
              <span className="text-2xl">📝</span>
              <div>
                <p className="font-medium text-sm">Créer un signalement</p>
                <p className="text-xs text-ink-700 mt-1">+2 points par signalement créé</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-cream">
              <span className="text-2xl">👍</span>
              <div>
                <p className="font-medium text-sm">Confirmer une panne</p>
                <p className="text-xs text-ink-700 mt-1">+1 point par confirmation donnée</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-cream">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium text-sm">Résoudre une panne</p>
                <p className="text-xs text-ink-700 mt-1">+3 points par panne résolue</p>
              </div>
            </div>
          </div>
        </div>

      </Container>
    </div>
  )
}