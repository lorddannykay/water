import { Mail } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageProvider';
import { scrollToSection } from '../../lib/utils';
import { Section, SectionInner } from '../Section';

export function Collective() {
  const { t } = useTranslation();

  return (
    <Section id="collective" className="bg-surface/40 !min-h-0 py-32">
      <SectionInner>
        <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">
          {t('collective.label')}
        </span>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
          {t('collective.title')}
        </h2>
        <p className="mt-6 max-w-3xl font-body text-lg leading-relaxed text-dim">{t('collective.p1')}</p>
        <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-dim">{t('collective.p2')}</p>
        <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-dim">{t('collective.p3')}</p>
        <button
          type="button"
          onClick={() => scrollToSection('contact', { focus: '#contact-name' })}
          className="btn-primary btn-ripple mt-10"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {t('collective.join')}
        </button>
      </SectionInner>
    </Section>
  );
}
