import { motion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageProvider';
import { scrollToSection } from '../lib/utils';

const NAV_IDS = ['home', 'about', 'atlas', 'collective', 'contribute', 'contact'] as const;

export function Navbar() {
  const { t } = useTranslation();

  const navItems = NAV_IDS.map((id) => ({
    id,
    label: t(`nav.${id}`),
  }));

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 1, 0.35, 1] }}
      className="navbar-blur fixed top-0 right-0 left-0 z-50 py-3 sm:py-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="group flex w-full shrink-0 flex-col items-start gap-0.5 text-left sm:w-auto"
          aria-label={`${t('brand.title')}, ${t('nav.home')}`}
        >
          <span className="whitespace-nowrap font-tamil text-sm leading-tight text-ink transition-colors group-hover:text-accent sm:text-base">
            {t('brand.title')}
          </span>
          <span className="whitespace-nowrap font-sans text-[10px] font-semibold tracking-[0.14em] text-dim uppercase sm:text-xs sm:tracking-[0.2em]">
            {t('brand.tagline')}
          </span>
        </button>

        <div className="navbar-links -mx-4 flex w-[calc(100%+2rem)] items-center gap-3 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:w-auto sm:gap-6 sm:px-0 sm:pb-0 lg:gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className="group relative shrink-0 text-[10px] font-semibold tracking-[0.14em] text-dim uppercase transition-colors hover:text-ink sm:text-xs"
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
