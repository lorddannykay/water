import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Loader2, Map, MapPin, Search } from 'lucide-react';
import {
  detectLocation,
  geocodeAddress,
  geolocationErrorMessage,
  searchAddresses,
  type AddressSuggestion,
  type LocationSource,
} from '../../lib/geo';
import { LocationPickerModal } from './LocationPickerModal';

export type LocationFieldValue = {
  text: string;
  lat: number | null;
  lng: number | null;
  source: LocationSource | null;
  synced: boolean;
};

type LocationFieldProps = {
  value: LocationFieldValue;
  onChange: (value: LocationFieldValue) => void;
  disabled?: boolean;
  onError?: (message: string) => void;
};

export function LocationField({ value, onChange, disabled, onError }: LocationFieldProps) {
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(value.text);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    setQuery(value.text);
  }, [value.text]);

  useEffect(() => {
    if (!listOpen) {
      setSuggestions([]);
      return;
    }
    const q = query.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchAddresses(q);
        if (!cancelled) setSuggestions(results);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, listOpen]);

  const applyLocation = useCallback(
    (lat: number, lng: number, label: string, source: LocationSource) => {
      setQuery(label);
      onChange({ text: label, lat, lng, source, synced: true });
      setListOpen(false);
      setSuggestions([]);
    },
    [onChange],
  );

  const syncText = useCallback(
    (text: string) => {
      const hasCoords = value.lat != null && value.lng != null;
      onChange({
        text,
        lat: value.lat,
        lng: value.lng,
        source: hasCoords ? 'manual' : value.source,
        synced: !hasCoords,
      });
    },
    [onChange, value.lat, value.lng, value.source],
  );

  const handleInputChange = (text: string) => {
    setQuery(text);
    setListOpen(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && wrapperRef.current?.contains(next)) return;
    window.setTimeout(() => {
      if (wrapperRef.current?.contains(document.activeElement)) return;
      setListOpen(false);
      syncText(query);
    }, 120);
  };

  const handleDetectLocation = async () => {
    setListOpen(false);
    setLocating(true);
    try {
      const { lat, lng, label } = await detectLocation();
      applyLocation(lat, lng, label, 'gps');
    } catch (err) {
      onError?.(geolocationErrorMessage(err));
    } finally {
      setLocating(false);
    }
  };

  const handleVerifyAddress = async () => {
    setListOpen(false);
    inputRef.current?.blur();
    const text = query.trim();
    if (text.length < 3) {
      onError?.('Type at least a few characters to verify the address.');
      return;
    }
    setVerifying(true);
    try {
      const result = await geocodeAddress(text);
      if (!result) {
        onError?.('Could not find that place. Try search suggestions or pick on the map.');
        return;
      }
      applyLocation(result.lat, result.lng, result.label, 'verified');
    } catch {
      onError?.('Address lookup failed. Try again or pick on the map.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSelectSuggestion = (item: AddressSuggestion) => {
    applyLocation(item.lat, item.lng, item.label, 'search');
    inputRef.current?.blur();
  };

  const handleOpenMap = () => {
    setListOpen(false);
    syncText(query);
    setMapOpen(true);
  };

  const statusLabel = (() => {
    if (value.synced && value.lat != null) {
      if (value.source === 'map') return 'Pinned on map';
      if (value.source === 'gps') return 'From your device location';
      if (value.source === 'search') return 'From address search';
      if (value.source === 'verified') return 'Address verified';
      return 'Location set';
    }
    if (value.lat != null && !value.synced) {
      return 'Address edited — verify or pick on map to update pin';
    }
    return null;
  })();

  const showList = listOpen && query.trim().length >= 3 && (searching || suggestions.length > 0);

  return (
    <div className="form-field location-field" ref={wrapperRef}>
      <label htmlFor="location" className="form-label">
        Location <span className="text-accent">*</span>
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 z-[1] h-4 w-4 -translate-y-1/2 text-dim"
          aria-hidden
        />
        <input
          ref={inputRef}
          id="location"
          name="location"
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.trim().length >= 3 && setListOpen(true)}
          onBlur={handleInputBlur}
          placeholder="Search or type village, district…"
          className="form-input !pl-10"
          autoComplete="off"
          disabled={disabled}
          role="combobox"
          aria-expanded={showList}
          aria-controls={showList ? listId : undefined}
          aria-autocomplete="list"
        />
        {searching && (
          <Loader2
            className="pointer-events-none absolute top-1/2 right-3 z-[1] h-4 w-4 -translate-y-1/2 animate-spin text-accent"
            aria-hidden
          />
        )}
      </div>

      {showList && (
        <ul id={listId} className="address-suggestions-inline" role="listbox">
          {searching && suggestions.length === 0 && (
            <li className="px-4 py-3 font-body text-sm text-dim">Searching…</li>
          )}
          {suggestions.map((item) => (
            <li key={item.placeId}>
              <button
                type="button"
                role="option"
                className="address-suggestion"
                onClick={() => handleSelectSuggestion(item)}
              >
                <span className="font-body text-sm text-ink">{item.label}</span>
                {item.subtitle && (
                  <span className="mt-0.5 block text-xs text-dim line-clamp-2">{item.subtitle}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={disabled || locating}
          className="btn-secondary btn-ripple gap-2 text-sm"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <MapPin className="h-4 w-4" aria-hidden />
          )}
          {locating ? 'Detecting…' : 'My location'}
        </button>
        <button
          type="button"
          onClick={handleOpenMap}
          disabled={disabled}
          className="btn-secondary btn-ripple gap-2 text-sm"
        >
          <Map className="h-4 w-4" aria-hidden />
          Pick on map
        </button>
        <button
          type="button"
          onClick={handleVerifyAddress}
          disabled={disabled || verifying}
          className="btn-secondary btn-ripple gap-2 text-sm"
        >
          {verifying ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <CheckCircle2 className="h-4 w-4" aria-hidden />
          )}
          {verifying ? 'Checking…' : 'Verify address'}
        </button>
      </div>

      {statusLabel && (
        <p
          className={`mt-2 flex items-start gap-1.5 font-body text-xs ${
            value.synced ? 'text-accent' : 'text-dim'
          }`}
        >
          {value.synced && <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />}
          {statusLabel}
        </p>
      )}

      {value.lat != null && value.lng != null && (
        <p className="mt-1 font-body text-xs text-dim">
          {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      )}

      {mapOpen &&
        createPortal(
          <LocationPickerModal
            open
            initialLat={value.lat}
            initialLng={value.lng}
            initialLabel={query}
            onClose={() => setMapOpen(false)}
            onConfirm={({ lat, lng, label }) => {
              applyLocation(lat, lng, label, 'map');
              setMapOpen(false);
            }}
          />,
          document.body,
        )}
    </div>
  );
}
