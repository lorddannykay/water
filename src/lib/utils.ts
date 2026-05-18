import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ScrollToSectionOptions = {
  /** Element to focus after scrolling (e.g. `#contact-name`). */
  focus?: string;
};

export function scrollToSection(id: string, options?: ScrollToSectionOptions) {
  const target = document.getElementById(id);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });

  const hash = `#${id}`;
  if (window.location.hash !== hash) {
    window.history.replaceState(null, '', hash);
  }

  const focusSelector = options?.focus;
  if (!focusSelector) return;

  const focusTarget = () => {
    document.querySelector<HTMLElement>(focusSelector)?.focus({ preventScroll: true });
  };

  if (prefersReducedMotion) {
    focusTarget();
    return;
  }

  window.setTimeout(focusTarget, 500);
}
