import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { LocationFieldValue } from '../components/contribute/LocationField';
import { useTranslation } from '../i18n/LanguageProvider';
import { reverseGeocode } from '../lib/geo';
import { scrollToSection } from '../lib/utils';

type DraftPin = { lat: number; lng: number };

type LocationDraftContextValue = {
  draft: LocationFieldValue | null;
  draftPin: DraftPin | null;
  resolving: boolean;
  setDraftFromMap: (lat: number, lng: number) => Promise<void>;
  clearDraft: () => void;
};

const LocationDraftContext = createContext<LocationDraftContextValue | null>(null);

export function LocationDraftProvider({ children }: { children: ReactNode }) {
  const { locale } = useTranslation();
  const [draft, setDraft] = useState<LocationFieldValue | null>(null);
  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);
  const [resolving, setResolving] = useState(false);

  const clearDraft = useCallback(() => {
    setDraft(null);
    setDraftPin(null);
    setResolving(false);
  }, []);

  const setDraftFromMap = useCallback(
    async (lat: number, lng: number) => {
      setDraftPin({ lat, lng });
      setResolving(true);
      scrollToSection('contribute');

      let label: string;
      try {
        label = await reverseGeocode(lat, lng, locale);
      } catch {
        label = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }

      setDraft({
        text: label,
        lat,
        lng,
        source: 'map',
        synced: true,
      });
      setResolving(false);
    },
    [locale],
  );

  const value = useMemo(
    () => ({ draft, draftPin, resolving, setDraftFromMap, clearDraft }),
    [draft, draftPin, resolving, setDraftFromMap, clearDraft],
  );

  return (
    <LocationDraftContext.Provider value={value}>{children}</LocationDraftContext.Provider>
  );
}

export function useLocationDraft() {
  const ctx = useContext(LocationDraftContext);
  if (!ctx) {
    throw new Error('useLocationDraft must be used within LocationDraftProvider');
  }
  return ctx;
}
