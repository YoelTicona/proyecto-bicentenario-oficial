'use client'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Arregla los íconos
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function CapturarClick({ setUbicacion }) {
  useMapEvents({
    click(e) {
      setUbicacion({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      })
    },
  })
  return null
}

export default function MapaEvento({ ubicacionMapa, ubicacion, setUbicacion }) {
  return (
    <MapContainer
      center={[ubicacionMapa.lat, ubicacionMapa.lng]}
      zoom={6}
      style={{ width: '100%', height: '300px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CapturarClick setUbicacion={setUbicacion} />
      {ubicacion.lat && (
        <Marker position={[ubicacion.lat, ubicacion.lng]} />
      )}
    </MapContainer>
  )
}
