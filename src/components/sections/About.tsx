import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from '../../i18n/LanguageProvider';
import { Section, SectionInner } from '../Section';
import { FounderResearchPanel } from './FounderResearchPanel';

export function About() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const founders = [
    { name: 'Saranya Dharshini', bioKey: 'about.saranyaBio' as const },
    { name: 'K. Porchelvi', bioKey: 'about.porchelviBio' as const },
  ];

  return (
    <Section id="about" className="!min-h-0 py-32">
      <SectionInner>
        <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">{t('about.label')}</span>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">{t('about.title')}</h2>

        <p className="mt-10 border-y border-border py-6 font-serif text-xl leading-relaxed text-water italic md:text-2xl">
          {t('about.riverQuote')}
        </p>

        <motion.div
          className="mt-12 grid items-start gap-16 lg:grid-cols-[1fr_1.1fr]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="space-y-6 font-body text-lg leading-relaxed text-dim">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
          </div>

          <div className="relative flex min-h-[320px] items-center justify-center">
            <img
              src="/assets/Tamil_Nadu_outline_map.svg"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-contain opacity-[0.3]"
              loading="lazy"
              draggable={false}
            />
            <blockquote className="relative z-10 px-6 text-center font-serif text-xl leading-relaxed text-ink italic md:text-2xl">
              &ldquo;{t('about.mapQuote')}&rdquo;
            </blockquote>
          </div>
        </motion.div>

        <div className="mt-24">
          <h3 className="text-xs font-bold tracking-[0.35em] text-dim uppercase">{t('about.foundersTitle')}</h3>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {founders.map((founder, i) => (
              <motion.article
                key={founder.name}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="water-panel p-8 md:p-10"
              >
                <div className="h-1 w-12 rounded-full bg-accent organic-border" />
                <h4 className="mt-6 font-serif text-2xl text-ink">{founder.name}</h4>
                <p className="mt-1 text-xs tracking-[0.2em] text-accent uppercase">{t('about.founderRole')}</p>
                <p className="mt-4 font-body text-sm leading-relaxed text-dim">{t(founder.bioKey)}</p>
              </motion.article>
            ))}
          </div>
          <FounderResearchPanel />
        </div>
      </SectionInner>
    </Section>
  );
}
