import { SEA_FRAGMENT_SHADER, SEA_FRAGMENT_SHADER_MOBILE } from './seaShaders';

/** Render scale for internal WebGL buffer (CSS still fills the hero). */
export function getSeaRenderScale(): number {
  if (typeof window === 'undefined') return 0.85;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 1;
  const w = window.innerWidth;
  if (w < 640) return 0.85;
  if (w < 1024) return 0.85;
  return 0.85;
}

export function getSeaMaxDpr(): number {
  if (typeof window === 'undefined') return 1.5;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return coarse || window.innerWidth < 768 ? 1.5 : 1.25;
}

/** Lighter shader on touch-first or narrow viewports; full quality on desktop fine pointer. */
export function shouldUseMobileSeaShader(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(pointer: coarse)').matches) return true;
  return window.innerWidth < 768;
}

export function pickSeaFragmentShader(): string {
  return shouldUseMobileSeaShader() ? SEA_FRAGMENT_SHADER_MOBILE : SEA_FRAGMENT_SHADER;
}

/** @deprecated Use shouldUseMobileSeaShader */
export function isMobileSeaViewport(): boolean {
  return shouldUseMobileSeaShader();
}

/** Only skip animation for explicit data-saver / very low RAM — not touch devices. */
export function prefersLowPowerSea(): boolean {
  if (typeof window === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = conn?.saveData === true;
  const lowMemory =
    'deviceMemory' in navigator &&
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
    ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) < 2;
  return saveData || lowMemory;
}
