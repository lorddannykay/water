import type { WaterSite } from './siteData';

/** SW and NE corners — Perungulam, Sivagalai, and the Thamirabarani east-channel kulam chain */
export const PORUNAI_REGION_BOUNDS: [[number, number], [number, number]] = [
  [8.618, 77.948],
  [8.662, 78.018],
];

export const PORUNAI_MAP_CENTER: [number, number] = [8.638, 77.985];
export const PORUNAI_DEFAULT_ZOOM = 12;

/**
 * Founder research area along the Thamirabarani east channel.
 * Village coords from OSM/Nominatim; water-body pins placed on mapped channels and tanks.
 */
export const PORUNAI_SITES: WaterSite[] = [
  {
    id: 'perungulam-village',
    name: 'Perungulam',
    coords: [8.64112, 77.99763],
    type: 'Village',
    featured: true,
    story:
      'A panchayat town on the Thamirabarani, at the downstream end of the east-channel kulam chain — the focus of Saranya’s kulam research.',
  },
  {
    id: 'sivagalai-village',
    name: 'Sivagalai',
    coords: [8.63889, 77.97889],
    type: 'Village',
    featured: true,
    story:
      'West of the Perungulam tank, ringed by village kulams and channels that feed the east-channel system.',
  },
  {
    id: 'perungulam-kulam',
    name: 'Perungulam Kulam (Perunkulam)',
    coords: [8.6374, 77.9862],
    type: 'Tank',
    story:
      'The last of sixteen tanks on the Thamirabarani east channel — about 900 acres, fed year-round and shared by Perungulam and Sivagalai.',
  },
  {
    id: 'sivagalai-kulam',
    name: 'Sivagalai Kulam',
    coords: [8.6362, 77.9718],
    type: 'Tank',
    story: 'A village tank on the western side of the chain, part of the kulam landscape around Sivagalai.',
  },
  {
    id: 'thamirabarani-perungulam',
    name: 'Thamirabarani River',
    coords: [8.6468, 78.0025],
    type: 'River',
    story: 'The Porunai / Thamirabarani at Perungulam — the river that feeds the east-channel tanks and kulams.',
  },
  {
    id: 'thamirabarani-east-channel',
    name: 'Thamirabarani East Channel',
    coords: [8.6395, 77.9915],
    type: 'Channel',
    story: 'The Maruthur east canal (Keezhakal) that links sixteen kulams from the river to Perungulam tank.',
  },
  {
    id: 'sivagalai-channel',
    name: 'Sivagalai Feeder Channel',
    coords: [8.6345, 77.9745],
    type: 'Channel',
    story: 'Hand-cut channels still carrying water between village kulams and the east-channel system.',
  },
];
