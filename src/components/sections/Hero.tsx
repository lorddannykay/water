import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { lazy, Suspense, useRef } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageProvider';
import { Section, SectionInner } from '../Section';
import { scrollToSection } from '../../lib/utils';

const HeroSeaBackdrop = lazy(() =>
  import('../hero/HeroSeaBackdrop').then((m) => ({ default: m.HeroSeaBackdrop }))
);

export function Hero() {
  const { t } = useTranslation();
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ['start start', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
  });

  const titleY = useTransform(smooth, [0, 1], [0, prefersReducedMotion ? 0 : -120]);
  const bgY = useTransform(smooth, [0, 1], [0, prefersReducedMotion ? 0 : 80]);
  const opacity = useTransform(smooth, [0, 0.8], [1, 0.6]);

  return (
    <Section
      id="home"
      reveal={false}
      className="relative min-h-[110vh] overflow-hidden pt-28 md:min-h-screen"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{ y: bgY }}
        aria-hidden
      >
        <div className="hero-sea-layer">
          <Suspense fallback={null}>
            <HeroSeaBackdrop reducedMotion={prefersReducedMotion} />
          </Suspense>
        </div>
        <div className="hero-sea-bottom-fade" />
      </motion.div>

      <div
        ref={scrollTargetRef}
        className="relative w-full min-h-[min(100vh,920px)]"
      >
        <SectionInner>
          <motion.div style={{ opacity }} className="relative pt-2 pb-20 md:pt-4 md:pb-28">
            <p
              className="pointer-events-none absolute top-0 -left-2 max-w-[100vw] font-tamil text-[clamp(3.5rem,14vw,9rem)] leading-[1.35] text-accent/15 select-none md:-left-4 [padding-block:0.12em]"
              aria-hidden
            >
              நீரே வாழ்வு
            </p>

            <motion.div style={{ y: titleY }} className="relative">
              <span className="mb-6 flex items-center gap-3 text-[11px] font-bold tracking-[0.4em] text-accent uppercase">
                <span className="h-px w-10 bg-accent" />
                {t('hero.eyebrow')}
              </span>

              <h1 className="perspective-text max-w-[18ch] font-serif text-5xl leading-[0.9] font-light tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl">
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className="block text-ink"
                >
                  {t('hero.titleWater')}
                </motion.span>
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.25 }}
                  className="block text-accent italic"
                >
                  {t('hero.titleRemembers')}
                </motion.span>
              </h1>

              <p className="mt-2 font-sans text-sm tracking-[0.25em] text-dim uppercase">
                {t('hero.tagline')}
              </p>

              <div className="mt-10 max-w-2xl space-y-6 font-body text-lg leading-relaxed text-dim md:text-xl">
                <p>{t('hero.p1')}</p>
                <p>{t('hero.p2')}</p>
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('atlas')}
                  className="btn-primary btn-ripple"
                >
                  <MapPin className="h-4 w-4" aria-hidden />
                  {t('hero.exploreMap')}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('contribute')}
                  className="btn-secondary btn-ripple"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  {t('hero.addSite')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </SectionInner>

      </div>

      <SectionInner className="relative mt-8 md:mt-12">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1 }}
        >
          <div className="glass p-8 md:p-10 lg:p-12">
            <h2 className="text-xs font-bold tracking-[0.35em] text-accent uppercase">
              {t('hero.mappingTitle')}
            </h2>
            <p className="mt-6 font-serif text-2xl leading-snug text-ink md:text-3xl">
              {t('hero.mappingHeadline')}
            </p>
            <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
              {t('hero.mappingP1')}
            </p>
            <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
              {t('hero.mappingP2')}
            </p>
          </div>
        </motion.div>
      </SectionInner>
    </Section>
  );
}
