import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import toast from 'react-hot-toast'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES, STATUSES } from '../lib/categories'
import {
  getReportById,
  markAsResolved,
  markAsBroken,
  deleteReport,
  toggleConfirmation,
  hasUserConfirmed
} from '../services'

// Fix icone Leaflet
const DefaultIcon = L.icon({
  iconUrl, shadowUrl,
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})
L.Marker.prototype.options.icon = DefaultIcon

// Formatter de date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  if (diffHours < 1) return "à l'instant"
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays === 1) return 'hier'
  if (diffDays < 7) return `il y a ${diffDays} jours`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const ReportDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const loadReport = async () => {
    setLoading(true)
    try {
      const { data, error } = await getReportById(id)
      if (error || !data) {
        console.error('Erreur:', error)
        setReport(null)
      } else {
        setReport(data)
        if (user) {
          const { hasConfirmed: hc } = await hasUserConfirmed(id, user.id)
          setConfirmed(hc)
        }
      }
    } catch (err) {
      console.error('Exception:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  const handleToggleConfirm = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour confirmer')
      return navigate('/login')
    }
    setActionLoading(true)
    const { action, error } = await toggleConfirmation(id, user.id)
    setActionLoading(false)
    if (error) {
      toast.error('Erreur lors de la confirmation')
      return
    }
    toast.success(action === 'added' ? 'Confirmation ajoutée 👍' : 'Confirmation retirée')
    loadReport()
  }

  const handleResolve = async () => {
    setActionLoading(true)
    const { error } = await markAsResolved(id)
    setActionLoading(false)
    if (!error) {
      toast.success('Signalement marqué comme résolu ✅')
      loadReport()
    }
  }

  const handleBroken = async () => {
    setActionLoading(true)
    const { error } = await markAsBroken(id)
    setActionLoading(false)
    if (!error) {
      toast.success('Signalement remis en panne')
      loadReport()
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer définitivement ce signalement ?')) return
    setActionLoading(true)
    const { error } = await deleteReport(id)
    setActionLoading(false)
    if (!error) {
      toast.success('Signalement supprimé')
      navigate('/map')
    }
  }

  // LOADING
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-900" />
      </div>
    )
  }

  // 404
  if (!report) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <p className="font-serif text-3xl mb-2">Signalement introuvable</p>
          <p className="text-ink-700 mb-8">Il a peut-être été supprimé.</p>
          <Link to="/map"><Button variant="primary" size="md">Retour à la carte</Button></Link>
        </div>
      </div>
    )
  }

  const cat = CATEGORIES[report.category]
  const status = STATUSES[report.status]
  const isOwner = user?.id === report.user_id
  const creatorName = report.profiles?.username || 'Anonyme'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream">
      
      {/* Bannière colorée */}
      <div 
        className="h-48 md:h-64 relative"
        style={{ background: `linear-gradient(135deg, ${cat?.color || '#3b82f6'}ee, ${cat?.color || '#3b82f6'}88)` }}
      >
        {/* Retour */}
        <div className="absolute top-6 left-6 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            ← Retour
          </button>
        </div>

        {/* Icône + Catégorie */}
        <div className="absolute bottom-6 left-6 md:left-12 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{cat?.icon}</span>
            <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {cat?.label}
            </span>
          </div>
        </div>

        {/* Badge statut */}
        <div className="absolute top-6 right-6">
          <span 
            className="px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
            style={{ backgroundColor: status?.bgColor, color: status?.color }}
          >
            {report.status === 'en_panne' ? '🔴' : '✅'} {status?.label}
          </span>
        </div>

        {/* Pattern subtil */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
      </div>

      <Container className="max-w-4xl -mt-8 relative z-10 pb-16">
        {/* Card principale */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          
          {/* Titre + méta */}
          <div className="p-8 md:p-12">
            <h1 className="font-serif text-3xl md:text-5xl mb-4 leading-tight">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-700 mb-8">
              <span>📍 {report.location_name}</span>
              <span>·</span>
              <span>Signalé par <span className="font-medium text-ink-900">@{creatorName}</span></span>
              <span>·</span>
              <span>{formatDate(report.created_at)}</span>
            </div>

            {/* Description */}
            {report.description && (
              <div className="mb-8">
                <h3 className="font-serif text-lg mb-3">Description</h3>
                <p className="text-ink-700 leading-relaxed bg-cream rounded-2xl p-6">
                  {report.description}
                </p>
              </div>
            )}

            {/* Mini carte */}
            <div className="mb-8">
              <h3 className="font-serif text-lg mb-3">Localisation</h3>
              <div className="h-[300px] rounded-2xl overflow-hidden border border-ink-900/10">
                <MapContainer
                  center={[report.latitude, report.longitude]}
                  zoom={16}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <Marker position={[report.latitude, report.longitude]} />
                </MapContainer>
              </div>
              <p className="text-xs text-ink-700/60 mt-2 text-center">
                {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Section confirmation */}
          <div className="border-t border-ink-900/5 p-8 md:p-12 bg-cream/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Compteur */}
              <div className="text-center md:text-left">
                <p className="font-serif text-4xl mb-1">
                  {report.confirmations_count}
                </p>
                <p className="text-sm text-ink-700">
                  {report.confirmations_count <= 1 
                    ? 'personne confirme cette panne' 
                    : 'personnes confirment cette panne'
                  }
                </p>
              </div>

              {/* Bouton de confirmation */}
              <button
                onClick={handleToggleConfirm}
                disabled={actionLoading}
                className={`px-8 py-4 rounded-full text-base font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                  confirmed
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-ink-900 text-white hover:bg-ink-800'
                } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {actionLoading 
                  ? '...' 
                  : confirmed 
                    ? '✅ Panne confirmée — Retirer' 
                    : '👍 Je confirme cette panne'
                }
              </button>
            </div>
          </div>

          {/* Actions propriétaire */}
          {isOwner && (
            <div className="border-t border-ink-900/5 p-8 md:p-12">
              <h3 className="font-serif text-lg mb-4">Actions (vous êtes le créateur)</h3>
              <div className="flex flex-wrap gap-3">
                {report.status === 'en_panne' ? (
                  <Button 
                    variant="accent" 
                    size="md"
                    onClick={handleResolve}
                    disabled={actionLoading}
                  >
                    ✅ Marquer comme résolu
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    size="md"
                    onClick={handleBroken}
                    disabled={actionLoading}
                  >
                    🔴 Remettre en panne
                  </Button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-full text-sm font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  🗑️ Supprimer ce signalement
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lien retour carte */}
        <div className="text-center mt-8">
          <Link to="/map" className="text-sm text-ink-700 hover:text-ink-900 hover:underline">
            ← Retour à la carte
          </Link>
        </div>
      </Container>
    </div>
  )
}