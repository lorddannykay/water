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
                The Water Heritage Project
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
        {/* Animated wave separator */}
        <div className="hero-waves" aria-hidden>
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="wave-path wave-path--1"
            d="M0 45 C180 10 360 80 540 45 C720 10 900 80 1080 45 C1260 10 1440 80 1620 45 C1800 10 1980 80 2160 45 C2340 10 2520 80 2700 45 C2880 10 2880 80 2880 45 L2880 90 L0 90 Z"
            fill="rgba(127,182,154,0.07)"
          />
          <path
            className="wave-path wave-path--2"
            d="M0 55 C160 25 320 75 480 55 C640 25 800 75 960 55 C1120 25 1280 75 1440 55 C1600 25 1760 75 1920 55 C2080 25 2240 75 2400 55 C2560 25 2720 75 2880 55 L2880 90 L0 90 Z"
            fill="rgba(139,184,212,0.07)"
          />
          <path
            className="wave-path wave-path--3"
            d="M0 60 C200 35 400 78 600 60 C800 35 1000 78 1200 60 C1400 35 1600 78 1800 60 C2000 35 2200 78 2400 60 C2600 35 2800 78 2880 60 L2880 90 L0 90 Z"
            fill="rgba(127,182,154,0.05)"
          />
        </svg>
        </div>
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
