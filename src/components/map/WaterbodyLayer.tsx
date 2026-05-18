import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import {
  WATERBODIES_GEOJSON_URL,
  WATERBODY_MIN_ZOOM,
  WATERBODY_POLYGON_STYLE,
} from './mapConfig';

type WaterFeatureCollection = GeoJSON.FeatureCollection;

function polygonFeaturesOnly(fc: WaterFeatureCollection): WaterFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: fc.features.filter((f) => {
      const t = f.geometry?.type;
      return t === 'Polygon' || t === 'MultiPolygon';
    }),
  };
}

function WaterbodyGeoJSON({ data }: { data: WaterFeatureCollection }) {
  return (
    <GeoJSON
      key="waterbodies"
      data={data}
      style={() => WATERBODY_POLYGON_STYLE}
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

  const polygonData = useMemo(
    () => (data ? polygonFeaturesOnly(data) : null),
    [data],
  );

  if (error || !polygonData?.features?.length) return null;

  return (
    <ZoomGate>
      <WaterbodyGeoJSON data={polygonData} />
    </ZoomGate>
  );
}
