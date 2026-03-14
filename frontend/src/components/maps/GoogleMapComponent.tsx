import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Default center coordinates set to India
const defaultCenter: [number, number] = [20.5937, 78.9629];

interface GoogleMapComponentProps {
  className?: string; 
  initialPosition?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Component to handle map clicks in Leaflet
function MapClickHandler({ setClickedPos, onLocationSelect }: any) {
  useMapEvents({
    click(e) {
      setClickedPos({ lat: e.latlng.lat, lng: e.latlng.lng });
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function GoogleMapComponent({ className, initialPosition = null, onLocationSelect }: GoogleMapComponentProps) {
  const [clickedPos, setClickedPos] = useState<{lat: number, lng: number} | null>(
    initialPosition ? { lat: initialPosition.lat, lng: initialPosition.lng } : null
  );

  return (
    <div className={`relative rounded-xl overflow-hidden ${className || 'h-[400px] w-full'}`}>
      <MapContainer 
        center={clickedPos ? [clickedPos.lat, clickedPos.lng] : defaultCenter} 
        zoom={clickedPos ? 12 : 5} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler setClickedPos={setClickedPos} onLocationSelect={onLocationSelect} />
        {clickedPos && (
          <Marker position={[clickedPos.lat, clickedPos.lng]} />
        )}
      </MapContainer>
      
      {/* Temporary visual confirmation of click */}
      {clickedPos && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-emerald-900/50 text-emerald-50 text-xs font-mono">
          Selected: {clickedPos.lat.toFixed(4)}, {clickedPos.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}
