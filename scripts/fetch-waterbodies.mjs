/**
 * Regenerate public/data/tamil-nadu-waterbodies.geojson from OpenStreetMap (Overpass API).
 * Run: node scripts/fetch-waterbodies.mjs
 * Keeps major rivers/canals and larger water polygons; simplify further in mapshaper if needed.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'data', 'tamil-nadu-waterbodies.geojson');

const BBOX = '8.0,76.0,13.6,80.5';
const MAX_RING_POINTS = 40;
const MIN_POLYGON_VERTICES = 8;

const query = `
[out:json][timeout:240];
(
  way["waterway"~"^(river|canal)$"](${BBOX});
  way["landuse"="reservoir"](${BBOX});
  way["natural"="water"](${BBOX});
  way["water"="tank"](${BBOX});
);
out geom;
`;

function roundCoord(n) {
  return Math.round(n * 1e3) / 1e3;
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
}

function simplifyRing(ring) {
  if (!ring || ring.length < 3) return ring;
  const step = Math.max(1, Math.ceil(ring.length / MAX_RING_POINTS));
  const out = [];
  for (let i = 0; i < ring.length; i += step) {
    const [lng, lat] = ring[i];
    out.push([roundCoord(lng), roundCoord(lat)]);
  }
  const first = out[0];
  const last = out[out.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) out.push([...first]);
  return out;
}

function wayToFeature(el) {
  const tags = el.tags || {};
  const coords = (el.geometry || []).map((p) => [roundCoord(p.lon), roundCoord(p.lat)]);
  if (coords.length < 2) return null;

  const isWaterway = !!tags.waterway;
  if (isWaterway) {
    if (coords.length < 3) return null;
    const line = simplifyRing(coords);
    if (line.length < 2) return null;
    return {
      type: 'Feature',
      properties: { kind: 'waterway', waterway: tags.waterway },
      geometry: { type: 'LineString', coordinates: line },
    };
  }

  if (coords.length < MIN_POLYGON_VERTICES) return null;
  const ring = simplifyRing(coords);
  if (ring.length < 4) return null;
  if (ringArea(ring) < 0.00002) return null;
  return {
    type: 'Feature',
    properties: {
      kind: 'water',
      natural: tags.natural,
      landuse: tags.landuse,
      water: tags.water,
    },
    geometry: { type: 'Polygon', coordinates: [ring] },
  };
}

async function main() {
  console.log('Querying Overpass API…');
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'User-Agent': 'WaterHeritageAtlas/1.0 (tamil-nadu-water-memory-atlas; educational)',
    },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const features = [];
  for (const el of data.elements || []) {
    if (el.type === 'way' && el.geometry) {
      const f = wayToFeature(el);
      if (f) features.push(f);
    }
  }

  const fc = { type: 'FeatureCollection', features };
  mkdirSync(dirname(OUT), { recursive: true });
  const json = JSON.stringify(fc);
  writeFileSync(OUT, json);
  console.log(`Wrote ${features.length} features (${(Buffer.byteLength(json) / 1024).toFixed(1)} KB) → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
