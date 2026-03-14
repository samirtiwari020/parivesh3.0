import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const defaultIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface LocationPickerMapProps {
  initialPosition?: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ position, setPosition, onLocationSelect }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon}></Marker>
  );
}

function MapUpdater() {
  const map = useMap();
  
  useEffect(() => {
    // This is required when maps are rendered inside conditionally visible containers or animations
    // It forces Leaflet to recalculate its container size once rendered
    const timeoutid = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timeoutid);
  }, [map]);
  
  return null;
}

export default function LocationPickerMap({ initialPosition = null, onLocationSelect }: LocationPickerMapProps) {
  const [position, setPosition] = useState<L.LatLngExpression | null>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : null
  );

  const defaultCenter: L.LatLngExpression = [20.5937, 78.9629]; // Center of India
  const center = position || defaultCenter;

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-inner border border-emerald-200 relative z-0">
      <MapContainer 
        center={center} 
        zoom={position ? 12 : 5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
      </MapContainer>
      
      {!position && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-emerald-100 text-emerald-800 text-sm font-bold pointer-events-none">
          Click anywhere on the map to select a location
        </div>
      )}
    </div>
  );
}
