import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useTranslation } from '../../i18n/LanguageProvider';

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/** On touch devices, require one tap before the map captures pan/zoom (page scroll stays natural). */
export function MapGestureGuard() {
  const map = useMap();
  const { t } = useTranslation();
  const [armed, setArmed] = useState(() => !isCoarsePointer());

  useEffect(() => {
    if (armed) return;
    map.dragging.disable();
    map.touchZoom.disable();
    return () => {
      map.dragging.enable();
      map.touchZoom.enable();
    };
  }, [map, armed]);

  const activate = () => {
    map.dragging.enable();
    map.touchZoom.enable();
    setArmed(true);
  };

  if (armed) return null;

  return (
    <button
      type="button"
      className="map-gesture-guard"
      onClick={activate}
      aria-label={t('atlas.mapActivateHint')}
    >
      {t('atlas.mapActivateHint')}
    </button>
  );
}
