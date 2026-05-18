import { useTranslation } from '../i18n/LanguageProvider';
import { scrollToSection } from '../lib/utils';

const NAV_IDS = ['home', 'about', 'atlas', 'collective', 'contribute', 'contact'] as const;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 border-t border-border bg-surface/60 py-12 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-2xl text-ink">{t('brand.title')}</p>
          <p className="mt-1 font-sans text-xs tracking-[0.2em] text-dim uppercase">
            {t('brand.tagline')}
          </p>
          <p className="mt-4 font-body text-sm leading-relaxed text-dim italic">
            {t('brand.motto')}
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col gap-3">
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(id);
              }}
              className="text-sm text-dim transition-colors hover:text-accent"
            >
              {t(`nav.${id}`)}
            </a>
          ))}
        </nav>

        <div className="flex flex-col justify-end gap-2 text-right md:text-left">
          <p className="text-xs text-dim">{t('footer.copyright')}</p>
          <p className="font-body text-sm text-dim italic">{t('footer.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
