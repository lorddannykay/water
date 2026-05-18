import { motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Section, SectionInner } from '../Section';
import { WaterMap } from '../map/WaterMap';
import { scrollToSection } from '../../lib/utils';

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
          our attempt to hold it, built not by institutions but by the people who know these places
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
            Put your water heritage site on the map.
          </h3>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            It might be a Kulam you bathed in as a child. A sacred pond next to a temple or only known
            to the locals. A river bend your village has always gathered at. A structure so humble it has
            never been photographed.
          </p>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            Drop a pin. Give it a name. Add what you know, whether that is one sentence or a lifetime
            of memory.
          </p>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            Every pin is an act of conservation.
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
      </SectionInner>
    </Section>
  );
}
