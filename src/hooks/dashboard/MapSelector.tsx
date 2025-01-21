import { MapContainer, TileLayer, Marker } from "react-leaflet"
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
        className="w-full h-52"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {position && <Pointer position={position} />}
      </MapContainer>
    </div>
  )
}

export default MapSelector

function Pointer({ position }: any) {
  return <Marker position={position} icon={IconMarker}></Marker>
}
