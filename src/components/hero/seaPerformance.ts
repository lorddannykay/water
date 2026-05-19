/** Render scale for internal WebGL buffer (CSS still fills the hero). */
export function getSeaRenderScale(): number {
  if (typeof window === 'undefined') return 0.75;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 1;
  const w = window.innerWidth;
  if (w < 640) return 0.5;
  if (w < 1024) return 0.65;
  return 0.8;
}

export function getSeaMaxDpr(): number {
  if (typeof window === 'undefined') return 1.25;
  return window.innerWidth < 768 ? 1 : 1.25;
}

export function prefersLowPowerSea(): boolean {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = conn?.saveData === true;
  const lowMemory =
    'deviceMemory' in navigator &&
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
    ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) < 4;
  return coarse || saveData || lowMemory;
}
