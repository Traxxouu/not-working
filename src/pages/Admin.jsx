import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES, STATUSES } from '../lib/categories'
import { getAllReports, deleteReport, markAsResolved, markAsBroken, getStats } from '../services'
import { supabase } from '../lib/supabase'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  if (diffHours < 1) return "à l'instant"
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays === 1) return 'hier'
  if (diffDays < 7) return `il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export const Admin = () => {
  const navigate = useNavigate()
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth()
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reports')
  const [filterStatus, setFilterStatus] = useState(null)
  const [filterCategory, setFilterCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

    const loadData = async () => {
    setLoading(true)
    try {
        const [reportsRes, statsRes, usersRes] = await Promise.all([
        getAllReports(),
        getStats(),
        supabase.from('profiles').select('*').order('created_at', { ascending: false })
        ])
        setReports(reportsRes.data || [])
        setStats(statsRes)
        setUsers(usersRes.data || [])
    } catch (err) {
        console.error('Erreur chargement admin:', err)
    } finally {
        setLoading(false)
    }
    }

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || profile?.role !== 'admin')) {
      toast.error('Accès réservé aux administrateurs')
      navigate('/')
      return
    }
    if (user && profile?.role === 'admin') loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, isAuthenticated, profile])

  const handleDeleteReport = async (id) => {
    if (!confirm('Supprimer ce signalement ?')) return
    const { error } = await deleteReport(id)
    if (!error) {
      toast.success('Signalement supprimé')
      loadData()
    }
  }

  const handleToggleStatus = async (report) => {
    if (report.status === 'en_panne') {
      await markAsResolved(report.id)
      toast.success('Marqué comme résolu')
    } else {
      await markAsBroken(report.id)
      toast.success('Remis en panne')
    }
    loadData()
  }

  // Filtrage
  const filteredReports = reports.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false
    if (filterCategory && r.category !== filterCategory) return false
    if (searchQuery && !(
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location_name.toLowerCase().includes(searchQuery.toLowerCase())
    )) return false
    return true
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-900" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream py-8 md:py-12">
      <Container className="max-w-6xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-ink-700 mb-2">Administration</p>
            <h1 className="font-serif text-4xl md:text-5xl">Tableau de bord</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              🔐 Admin
            </div>
            <span className="text-sm text-ink-700">{profile?.username}</span>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="font-serif text-4xl mb-1">{reports.length}</p>
              <p className="text-xs text-ink-700">Total signalements</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="font-serif text-4xl mb-1 text-red-500">{stats.activeReports}</p>
              <p className="text-xs text-ink-700">En panne</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="font-serif text-4xl mb-1 text-primary-500">{stats.resolvedReports}</p>
              <p className="text-xs text-ink-700">Résolus</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="font-serif text-4xl mb-1 text-accent-500">{users.length}</p>
              <p className="text-xs text-ink-700">Utilisateurs</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex border-b border-ink-900/5">
            {[
              { key: 'reports', label: `📋 Signalements (${reports.length})` },
              { key: 'users', label: `👥 Utilisateurs (${users.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-ink-900 text-ink-900'
                    : 'border-transparent text-ink-700 hover:text-ink-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB SIGNALEMENTS */}
          {activeTab === 'reports' && (
            <>
              {/* Barre recherche + filtres */}
              <div className="p-6 border-b border-ink-900/5">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="🔍 Rechercher un signalement..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 text-sm"
                  />
                  <div className="flex gap-2 overflow-x-auto">
                    <button
                      onClick={() => setFilterStatus(filterStatus === 'en_panne' ? null : 'en_panne')}
                      className={`flex-shrink-0 text-xs px-3 py-2 rounded-full border transition-colors ${
                        filterStatus === 'en_panne' ? 'bg-red-500 text-white border-red-500' : 'border-ink-900/10 hover:border-ink-900/30'
                      }`}
                    >
                      🔴 En panne
                    </button>
                    <button
                      onClick={() => setFilterStatus(filterStatus === 'resolu' ? null : 'resolu')}
                      className={`flex-shrink-0 text-xs px-3 py-2 rounded-full border transition-colors ${
                        filterStatus === 'resolu' ? 'bg-primary-500 text-white border-primary-500' : 'border-ink-900/10 hover:border-ink-900/30'
                      }`}
                    >
                      ✅ Résolu
                    </button>
                    <select
                      value={filterCategory || ''}
                      onChange={(e) => setFilterCategory(e.target.value || null)}
                      className="text-xs px-3 py-2 rounded-full border border-ink-900/10 bg-white"
                    >
                      <option value="">Toutes catégories</option>
                      {Object.entries(CATEGORIES).map(([key, cat]) => (
                        <option key={key} value={key}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-ink-700/60 mt-3">
                  {filteredReports.length} résultat{filteredReports.length > 1 ? 's' : ''}
                  {(filterStatus || filterCategory || searchQuery) && (
                    <button onClick={() => { setFilterStatus(null); setFilterCategory(null); setSearchQuery('') }} className="ml-2 underline hover:text-ink-900">
                      Réinitialiser
                    </button>
                  )}
                </p>
              </div>

              {/* Liste */}
              <div className="divide-y divide-ink-900/5 max-h-[600px] overflow-y-auto">
                {filteredReports.map((report) => {
                  const cat = CATEGORIES[report.category]
                  const status = STATUSES[report.status]
                  return (
                    <div key={report.id} className="flex items-center gap-4 px-6 py-4 hover:bg-cream/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: `${cat?.color}15` }}>
                        {cat?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Link to={`/report/${report.id}`} className="font-medium text-sm hover:underline truncate">
                            {report.title}
                          </Link>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                            style={{ backgroundColor: status?.bgColor, color: status?.color }}>
                            {status?.label}
                          </span>
                        </div>
                        <p className="text-xs text-ink-700 truncate">
                          {report.location_name} · par @{report.profiles?.username || '?'} · {formatDate(report.created_at)} · 👍 {report.confirmations_count}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleToggleStatus(report)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            report.status === 'en_panne'
                              ? 'border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white'
                              : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                          }`}>
                          {report.status === 'en_panne' ? '✅' : '🔴'}
                        </button>
                        <button onClick={() => handleDeleteReport(report.id)}
                          className="text-xs px-3 py-1.5 rounded-full border border-ink-900/10 text-ink-700 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                          🗑️
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* TAB UTILISATEURS */}
          {activeTab === 'users' && (
            <div className="divide-y divide-ink-900/5">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {u.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{u.username}</p>
                      {u.role === 'admin' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Admin</span>
                      )}
                    </div>
                    <p className="text-xs text-ink-700">{u.email}</p>
                  </div>
                  <div className="text-xs text-ink-700/60">
                    {new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </Container>
    </div>
  )
}