import type { MapContainerProps } from 'react-leaflet';
import { TAMIL_NADU_BOUNDS } from './mapConfig';

export const MAP_MIN_ZOOM = 6;
export const MAP_MAX_ZOOM = 18;

const sharedBounds = {
  maxBounds: TAMIL_NADU_BOUNDS,
  maxBoundsViscosity: 1.0,
  minZoom: MAP_MIN_ZOOM,
  maxZoom: MAP_MAX_ZOOM,
} as const;

/** Atlas section map: pinch/tap zoom, no scroll-wheel hijack on desktop. */
export const atlasMapProps = {
  ...sharedBounds,
  zoomControl: true,
  tap: true,
  touchZoom: true,
  bounceAtZoomLimits: true,
  scrollWheelZoom: false,
  attributionControl: false,
} satisfies Partial<MapContainerProps>;

/** Location picker: map is the focused surface — wheel zoom allowed. */
export const pickerMapProps = {
  ...sharedBounds,
  zoomControl: true,
  tap: true,
  touchZoom: true,
  bounceAtZoomLimits: true,
  scrollWheelZoom: true,
  attributionControl: false,
} satisfies Partial<MapContainerProps>;
