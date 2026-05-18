export type WaterSite = {
  id: number;
  name: string;
  coords: [number, number];
  type: string;
  story?: string;
};

export const SEED_SITES: WaterSite[] = [
  {
    id: 1,
    name: 'Tamiraparani River',
    coords: [8.65, 77.85],
    type: 'River',
    story: 'Flows through the Porunai basin and Tirunelveli — the ancestral river at the heart of this project.',
  },
  {
    id: 2,
    name: 'Krishneri Tank',
    coords: [12.83, 79.7],
    type: 'Tank',
    story: 'An ancient irrigation tank holding generations of village memory.',
  },
  {
    id: 3,
    name: 'Veera Chozhan Eri',
    coords: [11.35, 79.15],
    type: 'Tank & Eri',
    story: 'A temple water body maintained by community ritual for centuries.',
  },
  {
    id: 4,
    name: 'Adichanallur Sacred Spring',
    coords: [8.7, 77.55],
    type: 'Sacred Pond',
    story: 'A spring with a name that lives only in the mouths of elders.',
  },
  {
    id: 5,
    name: 'Sivagalai Channel',
    coords: [8.55, 78.1],
    type: 'Channel',
    story: 'Hand-cut, still flowing, still feeding — water heritage without a protected status.',
  },
];
