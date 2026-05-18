import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageProvider';
import type { Locale } from '../i18n/types';

const OPTIONS: { locale: Locale; labelKey: 'language.english' | 'language.tamil' }[] = [
  { locale: 'en', labelKey: 'language.english' },
  { locale: 'ta', labelKey: 'language.tamil' },
];

export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="language-toggle"
      role="group"
      aria-label={t('language.label')}
      layout
    >
      {OPTIONS.map((opt) => {
        const active = locale === opt.locale;
        return (
          <button
            key={opt.locale}
            type="button"
            onClick={() => setLocale(opt.locale)}
            className={`language-toggle__btn ${active ? 'language-toggle__btn--active' : ''}`}
            aria-pressed={active}
          >
            {active && !prefersReducedMotion && (
              <motion.span
                layoutId="language-toggle-pill"
                className="language-toggle__pill"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {active && prefersReducedMotion && <span className="language-toggle__pill" aria-hidden />}
            <motion.span
              className="language-toggle__label relative z-[1]"
              animate={{ opacity: active ? 1 : 0.65 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            >
              {t(opt.labelKey)}
            </motion.span>
          </button>
        );
      })}
    </motion.div>
  );
}
