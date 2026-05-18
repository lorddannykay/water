import type { Locale } from '../i18n/types';

export type DetectedLocation = {
  lat: number;
  lng: number;
  label: string;
};

export type AddressSuggestion = {
  placeId: string;
  lat: number;
  lng: number;
  label: string;
  subtitle?: string;
};

export type LocationSource = 'gps' | 'map' | 'search' | 'verified' | 'manual';

/** Tamil Nadu approximate bounds for biasing search results */
const TN_VIEWBOX = '76.0,8.0,80.5,13.5';

const TAMIL_SCRIPT_RE = /[\u0B80-\u0BFF]/;

let lastNominatimCall = 0;

function acceptLanguageHeader(locale: Locale): string {
  return locale === 'ta' ? 'ta, en' : 'en, ta';
}

async function nominatimFetch(url: string, locale: Locale): Promise<Response> {
  const elapsed = Date.now() - lastNominatimCall;
  if (elapsed < 1100) {
    await new Promise((r) => setTimeout(r, 1100 - elapsed));
  }
  lastNominatimCall = Date.now();
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': acceptLanguageHeader(locale),
    },
  });
}

type NominatimAddress = {
  village?: string;
  town?: string;
  city?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

type NominatimResult = {
  display_name?: string;
  address?: NominatimAddress;
  namedetails?: Record<string, string>;
};

function hasTamilScript(text: string): boolean {
  return TAMIL_SCRIPT_RE.test(text);
}

function isLatinHeavy(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const latin = (trimmed.match(/[A-Za-z0-9\s,.\-]/g) ?? []).length;
  return latin / trimmed.length > 0.55 && !hasTamilScript(trimmed);
}

function formatAddressFromParts(address?: NominatimAddress, fallback?: string): string {
  if (!address) return fallback ?? '';
  const locality = address.village ?? address.town ?? address.city;
  const district = address.state_district ?? address.county;
  const parts = [locality, district, address.state].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return fallback ?? '';
}

function pickNameFromDetails(
  namedetails: Record<string, string> | undefined,
  locale: Locale,
): string | undefined {
  if (!namedetails) return undefined;
  if (locale === 'en') {
    return (
      namedetails['name:en'] ??
      namedetails['name:latin'] ??
      namedetails['alt_name:en'] ??
      (namedetails.name && isLatinHeavy(namedetails.name) ? namedetails.name : undefined)
    );
  }
  return (
    namedetails['name:ta'] ??
    (namedetails.name && hasTamilScript(namedetails.name) ? namedetails.name : undefined) ??
    namedetails.name
  );
}

function pickAlternateName(
  namedetails: Record<string, string> | undefined,
  primary: string,
  locale: Locale,
): string | undefined {
  if (!namedetails) return undefined;
  const alt =
    locale === 'en'
      ? namedetails['name:ta'] ??
        (namedetails.name && hasTamilScript(namedetails.name) ? namedetails.name : undefined)
      : namedetails['name:en'] ??
        namedetails['name:latin'] ??
        (namedetails.name && isLatinHeavy(namedetails.name) ? namedetails.name : undefined);
  if (!alt || alt === primary) return undefined;
  return alt;
}

function buildPlaceLabels(item: NominatimResult, locale: Locale): { label: string; subtitle?: string } {
  const formatted = formatAddressFromParts(item.address, item.display_name);
  const named = pickNameFromDetails(item.namedetails, locale);
  const displayShort = item.display_name?.split(',')[0]?.trim();

  let primary: string;
  if (locale === 'en') {
    const candidates = [
      named,
      isLatinHeavy(formatted) ? formatted : undefined,
      displayShort && isLatinHeavy(displayShort) ? displayShort : undefined,
      formatted,
      item.display_name,
    ].filter((s): s is string => Boolean(s?.trim()));
    primary = candidates[0] ?? '';
  } else {
    primary = named ?? formatted ?? item.display_name ?? '';
  }

  if (!primary.trim()) {
    primary = item.display_name ?? '';
  }

  let subtitle = pickAlternateName(item.namedetails, primary, locale);

  if (!subtitle && item.display_name && item.display_name !== primary) {
    const displayIsAlt =
      locale === 'en' ? hasTamilScript(item.display_name) : isLatinHeavy(item.display_name);
    if (displayIsAlt && !item.display_name.startsWith(primary)) {
      subtitle = item.display_name;
    }
  }

  if (subtitle === primary) subtitle = undefined;

  return { label: primary.trim(), subtitle: subtitle?.trim() || undefined };
}

export async function reverseGeocode(lat: number, lng: number, locale: Locale = 'en'): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    zoom: '16',
    addressdetails: '1',
    namedetails: '1',
  });

  const res = await nominatimFetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    locale,
  );

  if (!res.ok) {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }

  const data = (await res.json()) as NominatimResult;
  const { label } = buildPlaceLabels(data, locale);
  return label || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export async function searchAddresses(
  query: string,
  locale: Locale = 'en',
): Promise<AddressSuggestion[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const params = new URLSearchParams({
    q: `${q}, Tamil Nadu, India`,
    format: 'json',
    addressdetails: '1',
    namedetails: '1',
    limit: '7',
    countrycodes: 'in',
    viewbox: TN_VIEWBOX,
    bounded: '0',
  });

  const res = await nominatimFetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    locale,
  );
  if (!res.ok) return [];

  const results = (await res.json()) as Array<
    NominatimResult & { place_id: number; lat: string; lon: string; display_name: string }
  >;

  return results.map((item) => {
    const { label, subtitle } = buildPlaceLabels(item, locale);
    return {
      placeId: String(item.place_id),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      label,
      subtitle,
    };
  });
}

/** Forward-geocode free-text address to coordinates (first best match in TN). */
export async function geocodeAddress(
  text: string,
  locale: Locale = 'en',
): Promise<DetectedLocation | null> {
  const suggestions = await searchAddresses(text, locale);
  if (!suggestions.length) return null;
  const best = suggestions[0];
  return { lat: best.lat, lng: best.lng, label: best.label };
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location is not supported on this device.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });
  });
}

export async function detectLocation(locale: Locale = 'en'): Promise<DetectedLocation> {
  const position = await getCurrentPosition();
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const label = await reverseGeocode(lat, lng, locale);
  return { lat, lng, label };
}

export function geolocationErrorMessage(
  error: unknown,
  t: (key: string) => string,
): string {
  if (error instanceof GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return t('location.geoDenied');
      case error.POSITION_UNAVAILABLE:
        return t('location.geoUnavailable');
      case error.TIMEOUT:
        return t('location.geoTimeout');
      default:
        break;
    }
  }
  if (error instanceof Error && error.message.includes('not supported')) {
    return t('location.geoUnsupported');
  }
  if (error instanceof Error) return error.message;
  return t('location.geoGeneric');
}

export const TAMIL_NADU_CENTER = { lat: 10.8, lng: 78.5 } as const;
