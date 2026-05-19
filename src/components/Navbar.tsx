import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageProvider';
import { scrollToSection } from '../lib/utils';

const NAV_IDS = ['home', 'about', 'atlas', 'collective', 'contribute', 'contact'] as const;

type NavId = (typeof NAV_IDS)[number];

function MobileNavDrawer({
  open,
  items,
  onClose,
  onNavigate,
  labels,
}: {
  open: boolean;
  items: { id: NavId; label: string }[];
  onClose: () => void;
  onNavigate: (id: NavId) => void;
  labels: { menuOpen: string; menuClose: string };
}) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="navbar-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label={labels.menuClose}
            onClick={onClose}
          />
          <motion.div
            id="mobile-nav-drawer"
            className="navbar-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            role="dialog"
            aria-modal="true"
            aria-label={labels.menuOpen}
          >
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="navbar-drawer__link"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Navbar() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = NAV_IDS.map((id) => ({
    id,
    label: t(`nav.${id}`),
  }));

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const goTo = (id: NavId) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 1, 0.35, 1] }}
        className="navbar-blur fixed top-0 right-0 left-0 z-50 pb-3 sm:pb-4"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => goTo('home')}
            className="group flex min-w-0 shrink flex-col items-start gap-0.5 text-left"
            aria-label={`${t('brand.title')}, ${t('nav.home')}`}
          >
            <span className="whitespace-nowrap font-tamil text-sm leading-tight text-ink transition-colors group-hover:text-accent sm:text-base">
              {t('brand.title')}
            </span>
            <span className="whitespace-nowrap font-sans text-xs font-semibold tracking-[0.14em] text-dim uppercase sm:tracking-[0.2em]">
              {t('brand.tagline')}
            </span>
          </button>

          <div className="navbar-links hidden items-center gap-6 sm:flex lg:gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item.id);
                }}
                className="group relative shrink-0 text-xs font-semibold tracking-[0.14em] text-dim uppercase transition-colors hover:text-ink"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <button
            type="button"
            className="navbar-menu-btn flex shrink-0 items-center justify-center rounded-full border border-border bg-white/90 p-2.5 text-ink shadow-sm sm:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </motion.nav>

      <MobileNavDrawer
        open={menuOpen}
        items={navItems}
        onClose={() => setMenuOpen(false)}
        onNavigate={goTo}
        labels={{ menuOpen: t('nav.menuOpen'), menuClose: t('nav.menuClose') }}
      />
    </>
  );
}
