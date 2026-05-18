import { TileLayer } from 'react-leaflet';
import { BASEMAP_TILE_URL } from './mapConfig';
import { WaterbodyLayer } from './WaterbodyLayer';

/** Shared basemap + statewide waterbody overlay for all Leaflet maps */
export function BaseMapLayers() {
  return (
    <>
      <TileLayer url={BASEMAP_TILE_URL} />
      <WaterbodyLayer />
    </>
  );
}
