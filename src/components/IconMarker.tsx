import Icon from "../assets/marker.svg"
import L from "leaflet"
const IconMarker = L.icon({
    iconUrl: Icon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
})
export default IconMarker
