import { useEffect, useState, type ReactNode } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import {
  WATERBODIES_GEOJSON_URL,
  WATERBODY_MIN_ZOOM,
  WATERBODY_STYLES,
} from './mapConfig';

type WaterFeatureCollection = GeoJSON.FeatureCollection;

function styleFeature(feature?: GeoJSON.Feature) {
  const geom = feature?.geometry;
  if (geom?.type === 'LineString' || geom?.type === 'MultiLineString') {
    return WATERBODY_STYLES.line;
  }
  return WATERBODY_STYLES.polygon;
}

function WaterbodyGeoJSON({ data }: { data: WaterFeatureCollection }) {
  return (
    <GeoJSON
      key="waterbodies"
      data={data}
      style={styleFeature}
      pane="overlayPane"
    />
  );
}

function ZoomGate({ children }: { children: ReactNode }) {
  const map = useMap();
  const [visible, setVisible] = useState(map.getZoom() >= WATERBODY_MIN_ZOOM);

  useEffect(() => {
    const onZoom = () => setVisible(map.getZoom() >= WATERBODY_MIN_ZOOM);
    map.on('zoomend', onZoom);
    return () => {
      map.off('zoomend', onZoom);
    };
  }, [map]);

  if (!visible) return null;
  return <>{children}</>;
}

export function WaterbodyLayer() {
  const [data, setData] = useState<WaterFeatureCollection | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(WATERBODIES_GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<WaterFeatureCollection>;
      })
      .then((fc) => {
        if (!cancelled) setData(fc);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error || !data?.features?.length) return null;

  return (
    <ZoomGate>
      <WaterbodyGeoJSON data={data} />
    </ZoomGate>
  );
}
