import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { TAMIL_NADU_CENTER } from '../../lib/geo';

const pickerIcon = L.divIcon({
  className: '',
  html: '<div class="location-picker-pin" aria-hidden="true"></div>',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

/** Only recenters when `zoom` is set (search / GPS), not while dragging the pin */
function MapRecenter({ lat, lng, zoom }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (zoom == null) return;
    map.setView([lat, lng], zoom, { animate: true });
  }, [lat, lng, zoom, map]);
  return null;
}

function MapClickToMove({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function DraggablePin({
  lat,
  lng,
  onDragEnd,
}: {
  lat: number;
  lng: number;
  onDragEnd: (lat: number, lng: number) => void;
}) {
  return (
    <Marker
      position={[lat, lng]}
      icon={pickerIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const pos = e.target.getLatLng();
          onDragEnd(pos.lat, pos.lng);
        },
      }}
    />
  );
}

export function LocationPickerMap({
  lat,
  lng,
  onPick,
  recenterZoom,
}: {
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
  recenterZoom?: number;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={recenterZoom ?? 14}
      className="location-picker-map"
      scrollWheelZoom
      aria-label="Pick location on map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapRecenter lat={lat} lng={lng} zoom={recenterZoom} />
      <MapClickToMove onPick={onPick} />
      <DraggablePin lat={lat} lng={lng} onDragEnd={onPick} />
    </MapContainer>
  );
}

export function defaultPickerCenter(
  lat: number | null,
  lng: number | null,
): { lat: number; lng: number } {
  if (lat != null && lng != null) return { lat, lng };
  return TAMIL_NADU_CENTER;
}
