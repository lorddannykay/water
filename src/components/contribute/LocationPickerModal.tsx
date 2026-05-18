import { useCallback, useEffect, useState } from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import {
  detectLocation,
  geolocationErrorMessage,
  reverseGeocode,
  searchAddresses,
  type AddressSuggestion,
} from '../../lib/geo';
import { useTranslation } from '../../i18n/LanguageProvider';
import { defaultPickerCenter, LocationPickerMap } from './LocationPickerMap';

type LocationPickerModalProps = {
  open: boolean;
  initialLat: number | null;
  initialLng: number | null;
  initialLabel: string;
  onConfirm: (payload: { lat: number; lng: number; label: string }) => void;
  onClose: () => void;
};

export function LocationPickerModal({
  open,
  initialLat,
  initialLng,
  initialLabel,
  onConfirm,
  onClose,
}: LocationPickerModalProps) {
  const { locale, t } = useTranslation();
  const start = defaultPickerCenter(initialLat, initialLng);
  const [pinLat, setPinLat] = useState(start.lat);
  const [pinLng, setPinLng] = useState(start.lng);
  const [addressLabel, setAddressLabel] = useState(initialLabel);
  const [resolving, setResolving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recenterZoom, setRecenterZoom] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const center = defaultPickerCenter(initialLat, initialLng);
    setPinLat(center.lat);
    setPinLng(center.lng);
    setAddressLabel(initialLabel);
    setSearchQuery('');
    setSuggestions([]);
    setError(null);
  }, [open, initialLat, initialLng, initialLabel]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const resolveAddress = useCallback(
    async (lat: number, lng: number) => {
      setResolving(true);
      setError(null);
      try {
        const label = await reverseGeocode(lat, lng, locale);
        setAddressLabel(label);
      } catch {
        setAddressLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } finally {
        setResolving(false);
      }
    },
    [locale],
  );

  const handlePick = useCallback(
    (lat: number, lng: number) => {
      setPinLat(lat);
      setPinLng(lng);
      void resolveAddress(lat, lng);
    },
    [resolveAddress],
  );

  useEffect(() => {
    if (!open) return;
    const q = searchQuery.trim();
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchAddresses(q, locale);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, open, locale]);

  const jumpMapTo = (lat: number, lng: number, label?: string) => {
    setPinLat(lat);
    setPinLng(lng);
    if (label != null) setAddressLabel(label);
    setRecenterZoom(15);
  };

  useEffect(() => {
    if (recenterZoom == null) return;
    const id = window.setTimeout(() => setRecenterZoom(undefined), 50);
    return () => window.clearTimeout(id);
  }, [pinLat, pinLng, recenterZoom]);

  const handleUseMyLocation = async () => {
    setLocating(true);
    setError(null);
    try {
      const { lat, lng, label } = await detectLocation(locale);
      jumpMapTo(lat, lng, label);
    } catch (err) {
      setError(geolocationErrorMessage(err, t));
    } finally {
      setLocating(false);
    }
  };

  const handleSelectSuggestion = (item: AddressSuggestion) => {
    jumpMapTo(item.lat, item.lng, item.label);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleConfirm = () => {
    const label =
      addressLabel.trim() || `${pinLat.toFixed(5)}, ${pinLng.toFixed(5)}`;
    onConfirm({ lat: pinLat, lng: pinLng, label });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="location-picker-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="location-picker-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-picker-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="location-picker-header">
          <h3 id="location-picker-title" className="font-serif text-lg text-ink">
            {t('location.pickerTitle')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="location-picker-icon-btn"
            aria-label={t('location.pickerClose')}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="location-picker-search">
          <Search className="h-4 w-4 shrink-0 text-dim" aria-hidden />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('location.pickerSearchPlaceholder')}
            className="min-w-0 flex-1 bg-transparent font-body text-sm text-ink outline-none placeholder:text-dim"
            autoComplete="off"
          />
          {searching && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" aria-hidden />}
        </div>

        {suggestions.length > 0 && (
          <ul className="location-picker-suggestions" role="listbox">
            {suggestions.map((item) => (
              <li key={item.placeId}>
                <button
                  type="button"
                  role="option"
                  className="location-picker-suggestion"
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <span className="font-body text-sm text-ink">{item.label}</span>
                  {item.subtitle && (
                    <span className="mt-0.5 block font-body text-xs text-dim line-clamp-2">
                      {item.subtitle}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="location-picker-map-wrap">
          <LocationPickerMap
            lat={pinLat}
            lng={pinLng}
            onPick={handlePick}
            recenterZoom={recenterZoom}
          />
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            className="location-picker-fab"
          >
            {locating ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <MapPin className="h-5 w-5" aria-hidden />
            )}
            <span className="sr-only">{t('location.pickerMyLocation')}</span>
          </button>
        </div>

        <p className="location-picker-hint font-body text-xs text-dim">
          {t('location.pickerHint')}
        </p>

        <footer className="location-picker-footer">
          <div className="min-w-0 flex-1">
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-dim">
              {t('location.pickerSelected')}
            </p>
            <p className="mt-1 font-body text-sm leading-snug text-ink">
              {resolving ? (
                <span className="inline-flex items-center gap-2 text-dim">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  {t('location.pickerUpdating')}
                </span>
              ) : (
                addressLabel || t('location.pickerMovePin')
              )}
            </p>
            <p className="mt-1 font-body text-xs text-dim">
              {pinLat.toFixed(5)}, {pinLng.toFixed(5)}
            </p>
            {error && <p className="mt-2 font-body text-xs text-accent">{error}</p>}
          </div>
          <button type="button" onClick={handleConfirm} className="btn-primary btn-ripple shrink-0">
            {t('location.pickerConfirm')}
          </button>
        </footer>
      </div>
    </div>
  );
}