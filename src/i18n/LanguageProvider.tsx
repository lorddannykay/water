import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { en } from './locales/en';
import { ta } from './locales/ta';
import { LOCALE_STORAGE_KEY, type Locale, type Messages } from './types';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
  messages: Messages;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const catalogs: Record<Locale, Messages> = { en, ta };

/** Re-enable with footer LanguageToggle when Tamil copy is reviewed. */
export const LANGUAGE_SWITCH_ENABLED = false;

function getMessage(messages: Messages, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = messages;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, vars?: Record<string, string>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => vars[name] ?? `{${name}}`);
}

function readStoredLocale(): Locale {
  if (!LANGUAGE_SWITCH_ENABLED) return 'en';
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'en' || stored === 'ta') return stored;
  } catch {
    /* ignore */
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());

  const setLocale = useCallback((next: Locale) => {
    if (!LANGUAGE_SWITCH_ENABLED && next !== 'en') return;
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'ta' ? 'ta' : 'en';
    document.documentElement.classList.toggle('lang-ta', locale === 'ta');
    document.documentElement.classList.toggle('lang-en', locale === 'en');
  }, [locale]);

  const messages = catalogs[locale];

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => {
      const value = getMessage(messages, key) ?? getMessage(en, key) ?? key;
      return interpolate(value, vars);
    },
    [messages],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, messages }),
    [locale, setLocale, t, messages],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return ctx;
}
