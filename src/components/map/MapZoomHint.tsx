import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useMap } from 'react-leaflet';
import { X } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageProvider';
import { WATERBODY_MIN_ZOOM } from './mapConfig';

const DISMISS_KEY = 'whp-map-zoom-hint-dismissed';

export function MapZoomHint() {
  const map = useMap();
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(() => map.getZoom());
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on('zoomend', onZoom);
    return () => {
      map.off('zoomend', onZoom);
    };
  }, [map]);

  if (dismissed || zoom >= WATERBODY_MIN_ZOOM) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div
      className="map-zoom-hint"
      role="status"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span>{t('atlas.mapZoomHint')}</span>
      <button
        type="button"
        className="map-zoom-hint__dismiss"
        onClick={dismiss}
        aria-label={t('atlas.mapZoomHintDismiss')}
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </motion.div>
  );
}
