/** Tamil Nadu map defaults */
export const TAMIL_NADU_MAP_CENTER: [number, number] = [10.8, 78.5];
export const TAMIL_NADU_DEFAULT_ZOOM = 7;

export const TAMIL_NADU_BOUNDS: [[number, number], [number, number]] = [
  [8.0, 76.0],
  [13.6, 80.5],
];

/** Standard OpenStreetMap raster tiles */
export const BASEMAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const WATERBODIES_GEOJSON_URL = '/data/tamil-nadu-waterbodies.geojson';

/** Hide dense water polygons when zoomed far out (performance) */
export const WATERBODY_MIN_ZOOM = 8;

/** Fill only (no outlines) for a softer water atlas look */
export const WATERBODY_POLYGON_STYLE = {
  fillColor: '#6eb5d8',
  fillOpacity: 0.28,
  stroke: false,
  weight: 0,
} as const;

/** Soft highlight for the Perungulam-Sivagalai research area */
export const PORUNAI_REGION_STYLE = {
  color: '#c45c26',
  weight: 2,
  opacity: 0.85,
  fillColor: '#e8a87c',
  fillOpacity: 0.12,
  dashArray: '6 4',
} as const;
