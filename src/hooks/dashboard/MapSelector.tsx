import { MapContainer, TileLayer, Marker, useMap, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import IconMarker from "@/components/IconMarker"
import { Icon } from "@iconify/react";

interface MapSelectorProps {
  position: { lat: number; lng: number }
  onChangePosition?: (lat: number, lng: number) => void
}

const MapSelector = ({ position, onChangePosition }: MapSelectorProps) => {
  return (
    <div>
      <MapContainer
        center={{ lat: position.lat, lng: position.lng }}
        zoom={13}
        className="w-full h-64"
        
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Pointer position={position} onDrag={onChangePosition} />
        <UpdateView position={position} />
      </MapContainer>
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40">
          <Icon icon="tabler:hand-move" className="text-blue-500 dark:text-blue-300 w-4 h-4" />
        </span>
        <span className="text-sm text-blue-700 dark:text-blue-200 font-medium select-none">
          Puedes arrastrar el marcador para ajustar la ubicación
        </span>
      </div>
    </div>
  );
};

export default MapSelector

interface PointerProps {
  position: { lat: number; lng: number };
  onDrag?: (lat: number, lng: number) => void;
}

function Pointer({ position, onDrag }: PointerProps) {
  return (
    <Marker
      position={position}
      icon={IconMarker}
      draggable={!!onDrag}
      eventHandlers={onDrag ? {
        dragend: (e) => {
          const marker = e.target;
          const { lat, lng } = marker.getLatLng();
          onDrag(lat, lng);
        },
      } : undefined}
    >
    </Marker>
  );
}

function UpdateView({ position }: { position: { lat: number; lng: number } }) {
  const map = useMap()

  // Actualiza la vista cuando la posición cambie
  map.setView([position.lat, position.lng], map.getZoom())

  return null
}
