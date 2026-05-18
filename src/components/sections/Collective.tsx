import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Section, SectionInner } from '../Section';

const NETWORK_ITEMS = [
  'Researchers & conservationists',
  'Historians & teachers',
  'Writers & farmers',
  'Field notes & oral histories',
] as const;

export function Collective() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="collective" className="bg-surface/40 !min-h-0 py-32">
      <SectionInner>
        <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Collective</span>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
          No river runs alone.
        </h2>
        <p className="mt-6 max-w-3xl font-body text-lg leading-relaxed text-dim">
          Behind Project Neer is a wider circle. Researchers and conservationists. Historians and
          teachers. Writers and farmers. People who grew up near water and never quite left it
          behind.
        </p>
        <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-dim">
          We bring different knowledge and ask each other hard questions. We share what we find and
          sit with what we don&apos;t understand.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="water-panel border-l-4 border-accent p-8 md:p-10"
          >
            <p className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">
              Philosophy
            </p>
            <p className="mt-4 font-serif text-2xl leading-relaxed text-ink italic">
              Collaborative and non-hierarchical engagement — where ecology, history, and living
              culture intersect.
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <h3 className="font-serif text-2xl text-ink">The circle</h3>
            <ul className="mt-8 space-y-4" role="list">
              {NETWORK_ITEMS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="group flex items-center justify-between border-b border-border pb-4 text-sm tracking-wide text-dim"
                >
                  {item}
                  <ArrowRight
                    className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    aria-hidden
                  />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </SectionInner>
    </Section>
  );
}
