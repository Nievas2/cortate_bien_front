import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const MapSelector = () => {
  const [position, setPosition] = useState({
    lat: -34.601106,
    lng: -58.3827662,
  })
  const [error, setError] = useState("")
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)

        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        setError(error.message)
        console.log(error)
      }
    )
  }, [])
  return (
    <div>
      <MapContainer
        center={position}
        zoom={13}
        className="w-full h-52"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
          <Popup>
            A pretty popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {position && <Pointer position={position} />}
      </MapContainer>
      {error == "User denied Geolocation" && (
        <div>
          Si no desea que la app use su ubicación, debere ingresar la longitud y
          latitud manualmente
        </div>
      )}
    </div>
  )
}

export default MapSelector

function Pointer({ position }: any) {
  return <Marker position={position}></Marker>
}
