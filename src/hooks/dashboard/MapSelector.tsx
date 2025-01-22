import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import IconMarker from "@/components/IconMarker"

const MapSelector = ({
  position,
}: {
  position: { lat: number; lng: number }
}) => {
  console.log(position)

  return (
    <div>
      <MapContainer
        center={{ lat: position.lat, lng: position.lng }}
        zoom={13}
        className="w-full h-64"
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
          attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Pointer position={position} />
        <UpdateView position={position} />
      </MapContainer>
    </div>
  )
}

export default MapSelector

function Pointer({ position }: { position: { lat: number; lng: number } }) {
  return <Marker position={position} icon={IconMarker}></Marker>
}

function UpdateView({ position }: { position: { lat: number; lng: number } }) {
  const map = useMap()

  // Actualiza la vista cuando la posición cambie
  map.setView([position.lat, position.lng], map.getZoom())

  return null
}
