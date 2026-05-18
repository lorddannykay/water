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

const NOMINATIM_HEADERS = {
  Accept: 'application/json',
  'Accept-Language': 'en, ta',
};

let lastNominatimCall = 0;

async function nominatimFetch(url: string): Promise<Response> {
  const elapsed = Date.now() - lastNominatimCall;
  if (elapsed < 1100) {
    await new Promise((r) => setTimeout(r, 1100 - elapsed));
  }
  lastNominatimCall = Date.now();
  return fetch(url, { headers: NOMINATIM_HEADERS });
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

function formatAddressFromParts(address?: NominatimAddress, fallback?: string): string {
  if (!address) return fallback ?? '';
  const locality = address.village ?? address.town ?? address.city;
  const district = address.state_district ?? address.county;
  const parts = [locality, district, address.state].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return fallback ?? '';
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    zoom: '16',
    addressdetails: '1',
  });

  const res = await nominatimFetch(`https://nominatim.openstreetmap.org/reverse?${params}`);

  if (!res.ok) {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }

  const data = (await res.json()) as {
    display_name?: string;
    address?: NominatimAddress;
  };

  return formatAddressFromParts(data.address, data.display_name) || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export async function searchAddresses(query: string): Promise<AddressSuggestion[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const params = new URLSearchParams({
    q: `${q}, Tamil Nadu, India`,
    format: 'json',
    addressdetails: '1',
    limit: '7',
    countrycodes: 'in',
    viewbox: TN_VIEWBOX,
    bounded: '0',
  });

  const res = await nominatimFetch(`https://nominatim.openstreetmap.org/search?${params}`);
  if (!res.ok) return [];

  const results = (await res.json()) as Array<{
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address?: NominatimAddress;
  }>;

  return results.map((item) => {
    const short = formatAddressFromParts(item.address, item.display_name);
    const subtitle =
      item.display_name !== short && item.display_name.length > short.length
        ? item.display_name
        : undefined;

    return {
      placeId: String(item.place_id),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      label: short,
      subtitle,
    };
  });
}

/** Forward-geocode free-text address to coordinates (first best match in TN). */
export async function geocodeAddress(text: string): Promise<DetectedLocation | null> {
  const suggestions = await searchAddresses(text);
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

export async function detectLocation(): Promise<DetectedLocation> {
  const position = await getCurrentPosition();
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const label = await reverseGeocode(lat, lng);
  return { lat, lng, label };
}

export function geolocationErrorMessage(error: unknown): string {
  if (error instanceof GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission was denied. You can search for a place or pick it on the map.';
      case error.POSITION_UNAVAILABLE:
        return 'Could not determine your location. Try search or the map picker.';
      case error.TIMEOUT:
        return 'Location request timed out. Try again.';
      default:
        break;
    }
  }
  if (error instanceof Error) return error.message;
  return 'Could not detect location.';
}

export const TAMIL_NADU_CENTER = { lat: 10.8, lng: 78.5 } as const;
