import { motion } from 'motion/react';
import { scrollToSection } from '../lib/utils';

export const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Atlas', id: 'atlas' },
  { label: 'Collective', id: 'collective' },
  { label: 'Contribute', id: 'contribute' },
  { label: 'Contact', id: 'contact' },
] as const;

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 1, 0.35, 1] }}
      className="navbar-blur fixed top-0 right-0 left-0 z-50 py-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="group flex min-w-0 flex-col items-start gap-0.5 text-left"
          aria-label="Project Neer — go to home"
        >
          <span className="font-tamil text-sm leading-tight text-ink transition-colors group-hover:text-accent sm:text-base">
            Project Neer
          </span>
          <span className="font-sans text-[10px] font-semibold tracking-[0.2em] text-dim uppercase sm:text-xs">
            Mapping Water Heritage
          </span>
        </button>

        <div className="navbar-links flex shrink-0 items-center gap-4 overflow-x-auto sm:gap-6 lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className="group relative text-[10px] font-semibold tracking-[0.14em] text-dim uppercase transition-colors hover:text-ink sm:text-xs"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
