import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { useRef } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Section, SectionInner } from '../Section';
import { scrollToSection } from '../../lib/utils';

export function Hero() {
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
      <div
        ref={scrollTargetRef}
        className="relative w-full min-h-[min(100vh,920px)]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div style={{ y: bgY }} className="hero-ripples h-full w-full">
            <div className="hero-ripple" />
            <div className="hero-ripple" />
            <div className="hero-ripple" />
          </motion.div>
        </div>

        <SectionInner>
          <motion.div style={{ opacity }} className="relative pt-2 pb-4 md:pt-4 md:pb-8">
            <p
              className="pointer-events-none absolute top-0 -left-2 max-w-[100vw] overflow-hidden font-tamil text-[clamp(3.5rem,14vw,9rem)] leading-none text-accent/15 select-none md:-left-4"
              aria-hidden
            >
              நீரே வாழ்வு
            </p>

            <motion.div style={{ y: titleY }} className="relative">
              <span className="mb-6 flex items-center gap-3 text-[11px] font-bold tracking-[0.4em] text-accent uppercase">
                <span className="h-px w-10 bg-accent" />
                Project Neer
              </span>

              <h1 className="perspective-text max-w-[18ch] font-serif text-5xl leading-[0.9] font-light tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl">
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className="block text-ink"
                >
                  Water
                </motion.span>
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.25 }}
                  className="block text-accent italic"
                >
                  remembers.
                </motion.span>
              </h1>

              <p className="mt-2 font-sans text-sm tracking-[0.25em] text-dim uppercase">
                Mapping Water Heritage
              </p>

              <div className="mt-10 max-w-2xl space-y-6 font-body text-lg leading-relaxed text-dim md:text-xl">
                <p>
                  Water remembers the fields it fed, the temples it circled, the hands that tended
                  its banks at dawn. It remembers every community that built its life around it,
                  every name it was given, every ritual performed at its edge.
                </p>
                <p>
                  We are mapping that memory. And we are inviting everyone who carries one to add it
                  here.
                </p>
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('atlas')}
                  className="btn-primary btn-ripple"
                >
                  <MapPin className="h-4 w-4" aria-hidden />
                  Explore the Map
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('contribute')}
                  className="btn-secondary btn-ripple"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add Your Site
                </button>
              </div>
            </motion.div>
          </motion.div>
        </SectionInner>
      </div>

      <SectionInner className="mt-12 md:mt-16">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1 }}
        >
          <div className="glass p-8 md:p-10 lg:p-12">
            <h2 className="text-xs font-bold tracking-[0.35em] text-accent uppercase">
              Mapping Water
            </h2>
            <p className="mt-6 font-serif text-2xl leading-snug text-ink md:text-3xl">
              Not all heritage looks like heritage.
            </p>
            <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
              Some of it is grand. Most of it isn&apos;t. A low mud bund holding back a field. A
              tank so familiar to its village that no one thinks to photograph it. A spring with a
              name that lives only in the mouths of elders. A channel, hand-cut, still flowing,
              still feeding.
            </p>
            <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
              These are not lesser places. They are the places that kept people alive. That still
              do.
            </p>
          </div>
        </motion.div>
      </SectionInner>
    </Section>
  );
}
