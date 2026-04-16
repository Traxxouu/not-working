import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

// Fix bug d'icones Leaflet avec Vite
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

L.Marker.prototype.options.icon = DefaultIcon

const PARIS_CENTER = [48.8566, 2.3522]

export const Map = ({ reports = [], className = '' }) => {
  return (
    <MapContainer
      center={PARIS_CENTER}
      zoom={13}
      className={`w-full h-full ${className}`}
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      {reports.map((report) => (
        <Marker key={report.id} position={[report.latitude, report.longitude]}>
          <Popup>
            <div className="font-sans">
              <p className="font-semibold">{report.title}</p>
              <p className="text-xs text-gray-600 mt-1">{report.description}</p>
              <p className="text-xs mt-2">
                <span className="font-medium">{report.confirmations_count}</span> confirmations
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
