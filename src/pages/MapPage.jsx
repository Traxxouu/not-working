import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Map } from '../components/map/Map'
import { getAllReports } from '../services'
import { CATEGORIES, STATUSES } from '../lib/categories'

// Formatter de date simple
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  if (diffHours < 1) return 'à l\'instant'
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays === 1) return 'hier'
  if (diffDays < 7) return `il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export const MapPage = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  const [sheetHeight, setSheetHeight] = useState('medium') // 'closed', 'medium', 'full'
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)

  const loadReports = async () => {
    setLoading(true)
    try {
      const { data, error } = await getAllReports()
      if (error) console.error('Erreur chargement reports:', error)
      setReports(data || [])
    } catch (err) {
      console.error('Exception chargement reports:', err)
      setReports([])
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
        loadReports()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

  // Filtrage côté client
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (filterCategory && r.category !== filterCategory) return false
      if (filterStatus && r.status !== filterStatus) return false
      if (search && !(
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.location_name.toLowerCase().includes(search.toLowerCase())
      )) return false
      return true
    })
  }, [reports, filterCategory, filterStatus, search])

  // Hauteur dynamique du bottom sheet
  const sheetHeights = {
    closed: 'translate-y-[calc(100%-4rem)]',
    medium: 'translate-y-[50%]',
    full: 'translate-y-0',
  }

  const handleReportClick = (report) => {
    setSelectedReport(report)
    setSheetHeight('medium')
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-cream">
      
      {/* Carte fullscreen */}
      <div className="absolute inset-0 z-0">
        <Map 
          reports={filteredReports} 
          onMarkerClick={handleReportClick}
          selectedReport={selectedReport}
        />
      </div>

      {/* Barre de recherche flottante en haut */}
      <div className="absolute top-4 left-4 right-4 z-30 md:left-6 md:right-auto md:w-96">
        <div className="bg-white rounded-2xl shadow-lg border border-ink-900/5">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un lieu, une panne..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-transparent"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-700/50">
              🔍
            </div>
          </div>
          
          {/* Chips de filtres */}
          <div className="px-3 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
            {/* Filtre Statut */}
            <button
              onClick={() => setFilterStatus(filterStatus === 'en_panne' ? null : 'en_panne')}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                filterStatus === 'en_panne'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-ink-700 border-ink-900/10 hover:border-ink-900/30'
              }`}
            >
              🔴 En panne
            </button>
            <button
              onClick={() => setFilterStatus(filterStatus === 'resolu' ? null : 'resolu')}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                filterStatus === 'resolu'
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-ink-700 border-ink-900/10 hover:border-ink-900/30'
              }`}
            >
              ✅ Résolu
            </button>

            {/* Séparateur */}
            <div className="w-px bg-ink-900/10 flex-shrink-0" />

            {/* Filtres Catégories */}
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setFilterCategory(filterCategory === key ? null : key)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  filterCategory === key
                    ? 'bg-ink-900 text-white border-ink-900'
                    : 'bg-white text-ink-700 border-ink-900/10 hover:border-ink-900/30'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton flottant "+ Signaler" */}
      <Link
        to="/report/new"
        className="absolute bottom-24 right-6 z-30 md:bottom-8 flex items-center gap-2 bg-ink-900 text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-ink-800 transition-all hover:scale-105 font-medium text-sm"
      >
        <span className="text-lg">+</span>
        <span>Signaler</span>
      </Link>

      {/* Bottom Sheet */}
      <div
        className={`absolute left-0 right-0 bottom-0 z-20 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${sheetHeights[sheetHeight]}`}
        style={{ height: '85vh' }}
      >
        {/* Handle (poignée) */}
        <div 
          className="flex flex-col items-center pt-3 pb-2 cursor-pointer select-none"
          onClick={() => {
            if (sheetHeight === 'closed') setSheetHeight('medium')
            else if (sheetHeight === 'medium') setSheetHeight('full')
            else setSheetHeight('closed')
          }}
        >
          <div className="w-12 h-1.5 bg-ink-900/20 rounded-full mb-3" />
        </div>

        {/* Header sheet */}
        <div className="px-6 pb-4 border-b border-ink-900/5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">
              {filteredReports.length} signalement{filteredReports.length > 1 ? 's' : ''}
            </h2>
            <button
              onClick={() => {
                setFilterCategory(null)
                setFilterStatus(null)
                setSearch('')
              }}
              className="text-xs text-ink-700 hover:text-ink-900 underline"
            >
              {(filterCategory || filterStatus || search) && 'Réinitialiser'}
            </button>
          </div>
          <p className="text-sm text-ink-700 mt-1">
            {filterStatus && `${STATUSES[filterStatus]?.label} · `}
            {filterCategory && `${CATEGORIES[filterCategory]?.label} · `}
            Paris
          </p>
        </div>

        {/* Liste des signalements */}
        <div className="overflow-y-auto pb-20" style={{ height: 'calc(100% - 6rem)' }}>
          {loading ? (
            <div className="p-6 text-center text-ink-700">Chargement...</div>
          ) : filteredReports.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-serif text-xl mb-2">Aucun signalement</p>
              <p className="text-sm text-ink-700">Essayez de modifier vos filtres.</p>
            </div>
          ) : (
            <div className="divide-y divide-ink-900/5">
              {filteredReports.map((report) => {
                const cat = CATEGORIES[report.category]
                const status = STATUSES[report.status]
                const isSelected = selectedReport?.id === report.id

                return (
                  <Link
                    key={report.id}
                    to={`/report/${report.id}`}
                    onClick={(e) => {
                      // Si pas encore sélectionné, juste centrer sur la carte au premier clic
                      if (!isSelected) {
                        e.preventDefault()
                        handleReportClick(report)
                      }
                    }}
                    className={`flex gap-4 px-6 py-4 hover:bg-cream/50 transition-colors ${
                      isSelected ? 'bg-cream' : ''
                    }`}
                  >
                    {/* Icône catégorie */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ 
                        backgroundColor: report.status === 'resolu' ? '#d1fae5' : `${cat?.color}20`,
                      }}
                    >
                      {cat?.icon}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm text-ink-900 truncate">
                          {report.title}
                        </h3>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                          style={{ 
                            backgroundColor: status?.bgColor,
                            color: status?.color,
                          }}
                        >
                          {status?.label}
                        </span>
                      </div>
                      <p className="text-xs text-ink-700 mt-1 truncate">
                        {report.location_name}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-ink-700/60">
                        <span>{formatDate(report.created_at)}</span>
                        <span>·</span>
                        <span>👍 {report.confirmations_count}</span>
                        {isSelected && (
                          <>
                            <span>·</span>
                            <span className="text-ink-900 font-medium">Cliquer pour détails →</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Style pour cacher scrollbar des filtres */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }
      `}</style>
    </div>
  )
}