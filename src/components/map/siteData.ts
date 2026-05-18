import { PORUNAI_SITES } from './porunaiRegion';

export type WaterSite = {
  id: string | number;
  name: string;
  coords: [number, number];
  type: string;
  story?: string;
  photoUrl?: string;
  /** Village anchors in the founder research area (larger map pin) */
  featured?: boolean;
  /** Small blue reference pin for major rivers and lakes */
  guide?: boolean;
};

/** Atlas seed pins: Porunai basin focus plus a few statewide examples */
export const SEED_SITES: WaterSite[] = [
  ...PORUNAI_SITES,
  {
    id: 'tamiraparani-upper',
    name: 'Tamiraparani River (upper basin)',
    coords: [8.72, 77.52],
    type: 'River',
    story: 'Flows through the Porunai basin, Tirunelveli and Thoothukudi, the ancestral river at the heart of this project.',
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tamirabarani_River_Thirunelveli.jpg/640px-Tamirabarani_River_Thirunelveli.jpg',
  },
  {
    id: 'krishneri-tank',
    name: 'Krishneri Tank',
    coords: [12.83, 79.7],
    type: 'Tank',
    story: 'An ancient irrigation tank holding generations of village memory.',
  },
  {
    id: 'veera-chozhan-eri',
    name: 'Veera Chozhan Eri',
    coords: [11.35, 79.15],
    type: 'Tank & Eri',
    story: 'A temple water body maintained by community ritual for centuries.',
  },
  {
    id: 'adichanallur-spring',
    name: 'Adichanallur Sacred Spring',
    coords: [8.7, 77.55],
    type: 'Sacred Pond',
    story: 'A spring with a name that lives only in the mouths of elders.',
  },
];
