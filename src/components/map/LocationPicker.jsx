import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})
L.Marker.prototype.options.icon = DefaultIcon

const PARIS_CENTER = [48.8566, 2.3522]

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })
  return position ? <Marker position={position} /> : null
}

// Composant qui bouge la carte quand on change la position programmatique
const MapController = ({ position }) => {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, { duration: 1 })
    }
  }, [position, map])
  return null
}

export const LocationPicker = ({ position, setPosition, onAddressFound }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Recherche avec debounce (attend 400ms après que l'user arrête de taper)
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        // API Nominatim (OpenStreetMap) - gratuit, pas besoin de clé
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=fr&viewbox=2.224,48.902,2.469,48.815&bounded=1`
        )
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(true)
      } catch (err) {
        console.error('Erreur recherche:', err)
        setSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelectSuggestion = (suggestion) => {
    const newPosition = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)]
    setPosition(newPosition)
    setQuery(suggestion.display_name.split(',').slice(0, 2).join(', '))
    setShowSuggestions(false)
    // Remonter le nom du lieu au parent (pour auto-remplir location_name si besoin)
    if (onAddressFound) {
      onAddressFound(suggestion.display_name.split(',').slice(0, 2).join(', '))
    }
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="🔍 Rechercher une adresse, un monument, une station..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-ink-900/10 focus:outline-none focus:border-primary-500 transition-colors bg-white"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-700/50">
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
            ) : (
              '🔍'
            )}
          </div>
        </div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-ink-900/10 rounded-xl shadow-lg overflow-hidden z-[1000] max-h-80 overflow-y-auto">
            {suggestions.map((sug) => (
              <button
                key={sug.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(sug)}
                className="w-full px-4 py-3 text-left hover:bg-cream transition-colors border-b border-ink-900/5 last:border-b-0 text-sm"
              >
                <div className="font-medium text-ink-900 truncate">
                  📍 {sug.display_name.split(',').slice(0, 2).join(', ')}
                </div>
                <div className="text-xs text-ink-700/60 truncate mt-0.5">
                  {sug.display_name.split(',').slice(2).join(',').trim()}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Message si pas de résultats */}
        {showSuggestions && query.length >= 3 && !isSearching && suggestions.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-ink-900/10 rounded-xl shadow-lg p-4 z-[1000] text-sm text-ink-700 text-center">
            Aucun résultat pour "{query}"
          </div>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-ink-700/70 italic">
        💡 Recherchez une adresse ou cliquez directement sur la carte pour placer le signalement
      </p>

      {/* Carte */}
      <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-ink-900/10 shadow-sm">
        <MapContainer
          center={PARIS_CENTER}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <LocationMarker position={position} setPosition={setPosition} />
          <MapController position={position} />
        </MapContainer>
      </div>
    </div>
  )
}