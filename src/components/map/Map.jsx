import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import { CATEGORIES, STATUSES } from '../../lib/categories'

// Fix pour les icones Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl

// Crée un icon custom coloré par catégorie et statut
const createCustomIcon = (category, status) => {
  const cat = CATEGORIES[category]
  const color = status === 'resolu' ? '#10b981' : cat?.color || '#ef4444'
  const icon = cat?.icon || '📍'

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 18px;">${icon}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

const PARIS_CENTER = [48.8566, 2.3522]

// Composant interne pour bouger la carte quand on sélectionne un report
const MapController = ({ selectedReport }) => {
  const map = useMap()
  useEffect(() => {
    if (selectedReport) {
      map.flyTo([selectedReport.latitude, selectedReport.longitude], 16, { duration: 0.8 })
    }
  }, [selectedReport, map])
  return null
}

export const Map = ({ reports = [], onMarkerClick, selectedReport }) => {
  return (
    <MapContainer
      center={PARIS_CENTER}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      <MapController selectedReport={selectedReport} />
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={createCustomIcon(report.category, report.status)}
          eventHandlers={{
            click: () => onMarkerClick?.(report),
          }}
        >
          <Popup>
            <div className="font-sans p-1">
              <p className="font-semibold text-sm mb-1">{report.title}</p>
              <p className="text-xs text-gray-600">{report.location_name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span 
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ 
                    backgroundColor: STATUSES[report.status]?.bgColor,
                    color: STATUSES[report.status]?.color,
                  }}
                >
                  {STATUSES[report.status]?.label}
                </span>
                <span className="text-xs text-gray-500">
                  {report.confirmations_count} confirmations
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}