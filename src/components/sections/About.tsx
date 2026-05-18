import { motion, useReducedMotion } from 'motion/react';
import { Section, SectionInner } from '../Section';
import { FounderResearchPanel } from './FounderResearchPanel';

const FOUNDERS = [
  {
    name: 'Saranya Dharshini',
    role: 'Co-founder',
    bio: 'Saranya is an architect trained in conservation with over fifteen years of experience across India and the UK. Her research on the kulam network along the Thamirabarani informs this atlas. She has worked on UNESCO World Heritage Sites, historic and sacred architecture, museum design, and conservation projects at every scale. As Vice President of the ICOMOS International Scientific Committee on Water and Heritage, she connects policy with place and community. Her practice is rooted in traditional knowledge and the people who still maintain it.',
  },
  {
    name: 'K. Porchelvi',
    role: 'Co-founder',
    bio: 'Porchelvi spent forty years as an educator and headmistress, working closely with communities and children across Tamil Nadu. She holds a deep store of Tamil literature, oral histories, and the stories families pass on without writing them down. She knows what was handed down, and why it cannot end with her generation.',
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
              Our founders grew up on that river. For them, the Tamiraparani is family history long
              before it is a line on a map.
            </p>
            <p>
              The project began in that closeness: the sense that water systems hold more than
              hydrology. They carry how a civilisation organised food, labour, worship, and daily
              life together over centuries.
            </p>
            <p>
              Tamil Nadu&apos;s water heritage is larger than any single register. Much of it was
              never listed: bunds, kulams, and channels that have served villages for generations,
              now under pressure from encroachment, neglect, and a climate shifting faster than
              repair work can follow.
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
