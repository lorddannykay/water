import { motion, useReducedMotion } from 'motion/react';
import { Droplets, Milestone, Plus, Users, Waves } from 'lucide-react';
import { Section, SectionInner } from '../Section';
import { WaterMap } from '../map/WaterMap';
import { scrollToSection } from '../../lib/utils';

const CATEGORIES = [
  {
    icon: Waves,
    title: 'Rivers',
    desc: 'Lifeblood systems like the Tamiraparani and the rivers that shaped civilisation.',
    count: '01',
  },
  {
    icon: Milestone,
    title: 'Archaeology',
    desc: 'Significant landscapes including Sivagalai and Adichanallur.',
    count: '02',
  },
  {
    icon: Droplets,
    title: 'Tanks & Eri',
    desc: 'Ancient irrigation networks and temple water bodies.',
    count: '03',
  },
  {
    icon: Users,
    title: 'Living Memory',
    desc: 'Local knowledge, oral histories, and sacred rituals.',
    count: '04',
  },
] as const;

export function Atlas() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="atlas" className="!min-h-0 py-32">
      <SectionInner>
        <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Atlas</span>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-6xl">
          A growing, living record of Tamil Nadu&apos;s water heritage
        </h2>
        <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-dim">
          Water heritage is not defined by age or architecture. It is defined by what a place
          carries. The knowledge embedded in how it was built. The community memory wrapped around
          how it was maintained. The ecological wisdom that no textbook recorded because no one
          thought to ask.
        </p>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-dim">
          In a changing climate, all of that is not just history. It is instruction. This map is
          our attempt to hold it — built not by institutions but by the people who know these places
          best. By you.
        </p>

        <motion.div
          className="mt-12"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <WaterMap onMapClick={() => scrollToSection('contribute')} />
        </motion.div>

        <div className="mt-16 border-t border-border pt-12 md:mt-20 md:pt-16">
          <h3 className="font-serif text-2xl text-ink md:text-3xl">
            Put your water site on the map.
          </h3>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            It might be a tank you bathed in as a child. A sacred pond that appears on no official
            record. A river bend your village has always gathered at. A structure so humble it has
            never been photographed.
          </p>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            Drop a pin. Give it a name. Add what you know, whether that is one sentence or a lifetime
            of memory. Every pin is an act of conservation.
          </p>
          <button
            type="button"
            onClick={() => scrollToSection('contribute')}
            className="btn-primary btn-ripple mt-8"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add a Water Site
          </button>
        </div>

        <div className="mt-24">
          <h3 className="text-xs font-bold tracking-[0.35em] text-dim uppercase">
            Layers of memory
          </h3>
          <motion.div
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-5%' }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                }}
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                className="glass group cursor-default p-8 transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface transition-colors group-hover:border-accent group-hover:bg-accent/10">
                    <cat.icon className="h-5 w-5 text-dim transition-colors group-hover:text-accent" />
                  </div>
                  <span className="font-serif text-sm text-accent/40 group-hover:text-accent">
                    {cat.count}
                  </span>
                </div>
                <h4 className="mt-8 font-serif text-2xl text-ink">{cat.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-dim">{cat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionInner>
    </Section>
  );
}
