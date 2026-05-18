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
          A place becomes water heritage through what people know and do there: how it was built,
          who maintains it, what older residents still remember. Much of that knowledge never
          entered a textbook because nobody thought to write it down.
        </p>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-dim">
          In a warming climate, those memories read less like nostalgia and more like practical
          guidance. This map is being assembled by the people who live beside these sites, not
          only by institutions. By you.
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
            Perhaps it is a kulam you bathed in as a child, a sacred pond beside a temple, a river
            bend where your village still gathers, or a structure so modest it has never been
            photographed.
          </p>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            Drop a pin, give it a name, and add whatever you know: a single sentence or a story
            you have carried for years.
          </p>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            Each pin helps keep a place visible.
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
