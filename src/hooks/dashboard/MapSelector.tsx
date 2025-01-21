import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import IconMarker from "@/components/IconMarker";

const MapSelector = ({
  position,
}: {
  position: { lat: number; lng: number };
}) => {
  console.log(position);

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
        <Pointer position={position} />
        <UpdateView position={position} />
      </MapContainer>
    </div>
  );
};

export default MapSelector;

function Pointer({ position }: { position: { lat: number; lng: number } }) {
  return <Marker position={position} icon={IconMarker}></Marker>;
}

function UpdateView({ position }: { position: { lat: number; lng: number } }) {
  const map = useMap();

  // Actualiza la vista cuando la posición cambie
  map.setView([position.lat, position.lng], map.getZoom());

  return null;
}
