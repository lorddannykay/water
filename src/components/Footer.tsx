import { scrollToSection } from '../lib/utils';
import { NAV_ITEMS } from './Navbar';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-surface/60 py-12 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-2xl text-ink">The Water Heritage Project</p>
          <p className="mt-1 font-sans text-xs tracking-[0.2em] text-dim uppercase">
            Mapping Water Heritage
          </p>
          <p className="mt-4 font-body text-sm leading-relaxed text-dim italic">
            Water remembers.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className="text-sm text-dim transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col justify-end gap-2 text-right md:text-left">
          <p className="text-xs text-dim">&copy; 2026 The Water Heritage Project</p>
          <p className="font-body text-sm text-dim italic">
            Documentation in progress. Always will be.
          </p>
        </div>
      </div>
    </footer>
  );
}
