import { motion, useReducedMotion } from 'motion/react';
import { Section, SectionInner } from '../Section';
import { FounderResearchPanel } from './FounderResearchPanel';

const FOUNDERS = [
  {
    name: 'Saranya Dharshini',
    role: 'Co-founder',
    bio: 'Saranya is an architect trained in conservation with over fifteen years of experience working across India and the UK. Her research on the kulam water network along the Thamirabarani informs this atlas. Her expertise spans UNESCO World Heritage Sites, historic and sacred architecture, museum design, and architectural conservation. As Vice President of ICOMOS International Scientific Committee on Water and Heritage, she works at the intersection of policy, place, and people. Guided by a philosophy of giving back to society, she advocates for people-centred conservation practices anchored in traditional knowledge systems and community engagement.',
  },
  {
    name: 'K. Porchelvi',
    role: 'Co-founder',
    bio: 'Porchelvi brings forty years of experience as an educator, retiring as a headmistress after a career devoted to working with communities and children. She carries within her a living archive of Tamil literature, oral histories, and the stories that pass between generations. She knows what was handed down and understands, with quiet urgency, why it cannot stop here.',
  },
] as const;

export function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="about" className="!min-h-0 py-32">
      <SectionInner>
        <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">About</span>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
          It begins with a river.
        </h2>

        <p className="mt-10 border-y border-border py-6 font-serif text-xl leading-relaxed text-water italic md:text-2xl">
          The Tamiraparani flows through the Porunai basin, through Tirunelveli and Thoothukudi, through the memory
          of every family that has ever lived on its banks.
        </p>

        <motion.div
          className="mt-12 grid items-start gap-16 lg:grid-cols-[1fr_1.1fr]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="space-y-6 font-body text-lg leading-relaxed text-dim">
            <p>
              For our founders, that is not geography. That is ancestry.
            </p>
            <p>
              This project grew from that intimacy. From the understanding that water systems are
              not merely ecological. They are the shape of a civilisation. The record of how people
              organised themselves, fed themselves, and made meaning together across centuries.
            </p>
            <p>
              Tamil Nadu&apos;s water heritage is vast and so much of it exists outside the
              boundaries of what we have been taught to call heritage. Just structures and systems that have quietly held communities together for
              generations, now facing encroachment, neglect, and a climate that is changing faster
              than we can keep up.
            </p>
          </div>

          <motion.div className="relative flex min-h-[320px] items-center justify-center">
            <img
              src="/assets/Tamil_Nadu_outline_map.svg"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-contain opacity-[0.3]"
              loading="lazy"
              draggable={false}
            />
            <blockquote className="relative z-10 px-6 text-center font-serif text-xl leading-relaxed text-ink italic md:text-2xl">
              &ldquo;My ancestors are from the Porunai basin, the valley of the Tamiraparani River
              in Tirunelveli and Thoothukudi.&rdquo;
            </blockquote>
          </motion.div>
        </motion.div>

        <div className="mt-24">
          <h3 className="text-xs font-bold tracking-[0.35em] text-dim uppercase">Our founders</h3>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {FOUNDERS.map((founder, i) => (
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
                <p className="mt-1 text-xs tracking-[0.2em] text-accent uppercase">{founder.role}</p>
                <p className="mt-4 font-body text-sm leading-relaxed text-dim">{founder.bio}</p>
              </motion.article>
            ))}
          </div>
          <FounderResearchPanel />
        </div>
      </SectionInner>
    </Section>
  );
}
