import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { SitePopupContent } from './SitePopup';
import { SEED_SITES, type WaterSite } from './siteData';

const TAMIL_NADU_CENTER: [number, number] = [10.8, 78.5];

function createMarkerIcon() {
  return L.divIcon({
    className: '',
    html: '<div class="water-map-marker" aria-hidden="true"></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function WaterMap({
  onMapClick,
  extraSites = [],
}: {
  onMapClick?: (lat: number, lng: number) => void;
  extraSites?: WaterSite[];
}) {
  const [sites, setSites] = useState<WaterSite[]>(SEED_SITES);
  const [markerIcon, setMarkerIcon] = useState<L.DivIcon | null>(null);

  useEffect(() => {
    setMarkerIcon(createMarkerIcon());
  }, []);

  useEffect(() => {
    setSites([...SEED_SITES, ...extraSites]);
  }, [extraSites]);

  if (!markerIcon) {
    return (
      <div
        className="flex h-[420px] w-full items-center justify-center rounded-2xl bg-surface text-dim md:h-[520px]"
        role="status"
        aria-label="Loading map"
      >
        Loading map…
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
      <MapContainer
        center={TAMIL_NADU_CENTER}
        zoom={7}
        scrollWheelZoom={false}
        className="h-[420px] w-full md:h-[520px]"
        aria-label="Interactive map of Tamil Nadu water heritage sites"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        {sites.map((site) => (
          <Marker key={site.id} position={site.coords} icon={markerIcon}>
            <Popup>
              <SitePopupContent site={site} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {onMapClick && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 text-xs text-dim shadow-sm backdrop-blur-sm">
          Click anywhere on the map to place a pin
        </p>
      )}
    </div>
  );
}
