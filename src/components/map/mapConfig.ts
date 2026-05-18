/** Tamil Nadu map defaults */
export const TAMIL_NADU_MAP_CENTER: [number, number] = [10.8, 78.5];
export const TAMIL_NADU_DEFAULT_ZOOM = 7;

/** CARTO Voyager — free raster, no API key; good hydrology contrast */
export const BASEMAP_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export const BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const WATERBODIES_GEOJSON_URL = '/data/tamil-nadu-waterbodies.geojson';

/** Hide dense water polygons when zoomed far out (performance) */
export const WATERBODY_MIN_ZOOM = 8;

export const WATERBODY_STYLES = {
  polygon: {
    fillColor: '#4a9fd4',
    fillOpacity: 0.35,
    color: '#2d7aaa',
    opacity: 0.6,
    weight: 1,
  },
  line: {
    color: '#2d7aaa',
    opacity: 0.75,
    weight: 2.5,
  },
} as const;

/** Soft highlight for the Perungulam–Sivagalai research area */
export const PORUNAI_REGION_STYLE = {
  color: '#c45c26',
  weight: 2,
  opacity: 0.85,
  fillColor: '#e8a87c',
  fillOpacity: 0.12,
  dashArray: '6 4',
} as const;
