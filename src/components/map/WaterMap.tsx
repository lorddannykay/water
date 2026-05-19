import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, Rectangle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageProvider';
import { BaseMapLayers } from './BaseMapLayers';
import { MapAttribution } from './MapAttribution';
import { MapGestureGuard } from './MapGestureGuard';
import { MapZoomHint } from './MapZoomHint';
import { MAJOR_WATER_GUIDE_SITES } from './majorWaterBodies';
import { atlasMapProps } from './mapLeafletOptions';
import {
  PORUNAI_REGION_STYLE,
  TAMIL_NADU_DEFAULT_ZOOM,
  TAMIL_NADU_MAP_CENTER,
} from './mapConfig';
import { PORUNAI_REGION_BOUNDS } from './porunaiRegion';
import { SitePopupContent } from './SitePopup';
import { SEED_SITES, type WaterSite } from './siteData';

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

function createMarkerIcon(variant: 'default' | 'featured' | 'guide' | 'draft') {
  const coarse = isCoarsePointer();
  const scale = coarse ? 1.15 : 1;
  const cls =
    variant === 'featured'
      ? 'water-map-marker water-map-marker--featured'
      : variant === 'guide'
        ? 'water-map-marker water-map-marker--guide'
        : variant === 'draft'
          ? 'water-map-marker water-map-marker--draft'
          : 'water-map-marker';
  const baseSize =
    variant === 'featured' ? 34 : variant === 'guide' ? 20 : variant === 'draft' ? 32 : 28;
  const size = Math.round(baseSize * scale);
  const anchorY = size;
  const tag = 'div';
  return L.divIcon({
    className: '',
    html: `<${tag} class="${cls}" aria-hidden="true"></${tag}>`,
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

export function WaterMap({
  onMapClick,
  extraSites = [],
  draftPin = null,
  resolving = false,
}: {
  onMapClick?: (lat: number, lng: number) => void;
  extraSites?: WaterSite[];
  draftPin?: { lat: number; lng: number } | null;
  resolving?: boolean;
}) {
  const { t } = useTranslation();
  const [markerIcon, setMarkerIcon] = useState<L.DivIcon | null>(null);
  const [featuredIcon, setFeaturedIcon] = useState<L.DivIcon | null>(null);
  const [guideIcon, setGuideIcon] = useState<L.DivIcon | null>(null);
  const [draftIcon, setDraftIcon] = useState<L.DivIcon | null>(null);

  const heritageSites = useMemo(() => [...SEED_SITES, ...extraSites], [extraSites]);

  useEffect(() => {
    setMarkerIcon(createMarkerIcon('default'));
    setFeaturedIcon(createMarkerIcon('featured'));
    setGuideIcon(createMarkerIcon('guide'));
    setDraftIcon(createMarkerIcon('draft'));
  }, []);

  if (!markerIcon || !featuredIcon || !guideIcon || !draftIcon) {
    return (
      <div
        className="water-atlas-map water-atlas-map--loading flex w-full items-center justify-center rounded-2xl bg-surface text-dim"
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
          center={TAMIL_NADU_MAP_CENTER}
          zoom={TAMIL_NADU_DEFAULT_ZOOM}
          className="water-atlas-map w-full"
          aria-label={t('atlas.mapAria')}
          {...atlasMapProps}
        >
          <BaseMapLayers />
          <Rectangle bounds={PORUNAI_REGION_BOUNDS} pathOptions={PORUNAI_REGION_STYLE} />
          <MapGestureGuard />
          <MapZoomHint />
          {MAJOR_WATER_GUIDE_SITES.map((site) => (
            <Marker
              key={String(site.id)}
              position={site.coords}
              icon={guideIcon}
              zIndexOffset={100}
            >
              <Popup>
                <SitePopupContent site={site} />
              </Popup>
            </Marker>
          ))}
          {heritageSites.map((site) => (
            <Marker
              key={String(site.id)}
              position={site.coords}
              icon={site.featured ? featuredIcon : markerIcon}
              zIndexOffset={site.featured ? 500 : 200}
            >
              <Popup>
                <SitePopupContent site={site} />
              </Popup>
            </Marker>
          ))}
          {draftPin && (
            <Marker
              position={[draftPin.lat, draftPin.lng]}
              icon={draftIcon}
              zIndexOffset={2000}
            />
          )}
          {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        </MapContainer>
        <MapAttribution />
        {resolving && (
          <div
            className="absolute top-3 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs text-dim shadow-sm backdrop-blur-sm"
            role="status"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" aria-hidden />
            {t('atlas.resolvingLocation')}
          </div>
        )}
        {onMapClick && !resolving && (
          <p className="absolute bottom-14 left-1/2 z-[1000] max-w-[90%] -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 text-center text-xs text-dim shadow-sm backdrop-blur-sm sm:bottom-3">
            {t('atlas.mapClickHint')}
          </p>
        )}
      </div>
      <p className="mt-3 text-center font-body text-xs text-dim md:text-sm">{t('atlas.mapLegendNote')}</p>
    </div>
  );
}
