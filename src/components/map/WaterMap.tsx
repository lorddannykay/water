import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, Rectangle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from '../../i18n/LanguageProvider';
import { BaseMapLayers } from './BaseMapLayers';
import { MapAttribution } from './MapAttribution';
import { PORUNAI_REGION_STYLE } from './mapConfig';
import {
  PORUNAI_DEFAULT_ZOOM,
  PORUNAI_MAP_CENTER,
  PORUNAI_REGION_BOUNDS,
} from './porunaiRegion';
import { SitePopupContent } from './SitePopup';
import { SEED_SITES, type WaterSite } from './siteData';

function createMarkerIcon(variant: 'default' | 'featured') {
  const cls =
    variant === 'featured' ? 'water-map-marker water-map-marker--featured' : 'water-map-marker';
  const size = variant === 'featured' ? 34 : 28;
  const anchorY = size;
  return L.divIcon({
    className: '',
    html: `<div class="${cls}" aria-hidden="true"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, anchorY],
    popupAnchor: [0, -anchorY],
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

function MapFocusPorunai() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(PORUNAI_REGION_BOUNDS, { padding: [36, 36], maxZoom: 13 });
  }, [map]);
  return null;
}

export function WaterMap({
  onMapClick,
  extraSites = [],
}: {
  onMapClick?: (lat: number, lng: number) => void;
  extraSites?: WaterSite[];
}) {
  const { t } = useTranslation();
  const [markerIcon, setMarkerIcon] = useState<L.DivIcon | null>(null);
  const [featuredIcon, setFeaturedIcon] = useState<L.DivIcon | null>(null);

  const sites = useMemo(() => [...SEED_SITES, ...extraSites], [extraSites]);

  useEffect(() => {
    setMarkerIcon(createMarkerIcon('default'));
    setFeaturedIcon(createMarkerIcon('featured'));
  }, []);

  if (!markerIcon || !featuredIcon) {
    return (
      <div
        className="flex h-[420px] w-full items-center justify-center rounded-2xl bg-surface text-dim md:h-[520px]"
        role="status"
        aria-label={t('atlas.mapLoading')}
      >
        {t('atlas.mapLoading')}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
        <MapContainer
          center={PORUNAI_MAP_CENTER}
          zoom={PORUNAI_DEFAULT_ZOOM}
          scrollWheelZoom={false}
          attributionControl={false}
          className="h-[420px] w-full md:h-[520px]"
          aria-label={t('atlas.mapAria')}
        >
          <BaseMapLayers />
          <MapFocusPorunai />
          <Rectangle bounds={PORUNAI_REGION_BOUNDS} pathOptions={PORUNAI_REGION_STYLE} />
          {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
          {sites.map((site) => (
            <Marker
              key={String(site.id)}
              position={site.coords}
              icon={site.featured ? featuredIcon : markerIcon}
              zIndexOffset={site.featured ? 500 : 0}
            >
              <Popup>
                <SitePopupContent site={site} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <MapAttribution />
        {onMapClick && (
          <p className="absolute bottom-3 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 text-xs text-dim shadow-sm backdrop-blur-sm">
            {t('atlas.mapClickHint')}
          </p>
        )}
      </div>
      <p className="mt-3 text-center font-body text-xs text-dim md:text-sm">{t('atlas.mapPorunaiNote')}</p>
    </div>
  );
}
