import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import IconMarker from "@/components/IconMarker"

const MapSelector = ({ setValue }: { setValue: Function }) => {
  const [position, setPosition] = useState({
    lat: -34.601106,
    lng: -58.3827662,
  })
  const [error, setError] = useState("")
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitud", position.coords.latitude)
        setValue("longitud", position.coords.longitude)
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        setError(error.message || "Error al obtener la ubicación")
      }
    )
  }, [])
  return (
    <div>
      <MapContainer center={position} zoom={13} className="w-full h-52">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {position && <Pointer position={position} />}
      </MapContainer>
      {error && (
        <div className="text-red-500 text-sm">
          Si no desea que la app use su ubicación o en los campos siguientes
          aparecen valores en 0, debera ingresar la longitud y latitud
          manualmente.
        </div>
      )}
    </div>
  )
}

export default MapSelector

function Pointer({ position }: any) {
  return <Marker position={position} icon={IconMarker}></Marker>
}
