import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { Section, SectionInner } from '../Section';

gsap.registerPlugin(ScrollTrigger);

const FOUNDERS = [
  {
    name: 'Saranya Dharshini',
    role: 'Co-founder',
    bio: 'Saranya is an architect and conservation specialist with over fifteen years of experience working across India and the UK. As Vice President of ICOMOS International Scientific Committee on Water and Heritage, she works at the intersection of policy, place, and people. Her expertise spans UNESCO World Heritage Sites, historic and sacred architecture, museum design, and architectural conservation. Guided by a philosophy of giving back to society, she advocates for people-centred conservation practices anchored in traditional knowledge systems and community engagement.',
  },
  {
    name: 'K. Porchelvi',
    role: 'Co-founder',
    bio: 'Porchelvi spent her career in education, retiring as a headmistress. She is Vice President of the Tamil Writers Society and carries within her a living archive of Tamil literature, oral histories, and the stories that pass between generations. She knows what was handed down and understands, with quiet urgency, why it cannot stop here.',
  },
] as const;

const MARQUEE_TEXT =
  'The Tamiraparani flows through the Porunai basin, through Tirunelveli, through the memory of every family that has ever lived on its banks. ';

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !marqueeRef.current || !sectionRef.current) return;

      const track = marqueeRef.current;
      gsap.to(track, {
        x: '-50%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <Section id="about" className="!min-h-0 py-32">
      <div ref={sectionRef}>
        <SectionInner>
          <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">About</span>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
            It begins with a river.
          </h2>

          {!prefersReducedMotion && (
            <div className="mt-10 overflow-hidden border-y border-border py-6">
              <div ref={marqueeRef} className="marquee-track">
                <span className="px-8 font-serif text-xl text-water italic md:text-2xl">
                  {MARQUEE_TEXT.repeat(3)}
                </span>
              </div>
            </div>
          )}

          <motion.div
            className="mt-12 grid items-start gap-16 lg:grid-cols-[1fr_1.1fr]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="space-y-6 font-body text-lg leading-relaxed text-dim">
              <p>
                The Tamiraparani flows through the Porunai basin, through Tirunelveli, through the
                memory of every family that has ever lived on its banks. For our founders, that is
                not geography. That is ancestry.
              </p>
              <p>
                This project grew from that intimacy. From the understanding that water systems are
                not merely ecological. They are the shape of a civilisation. The record of how people
                organised themselves, fed themselves, and made meaning together across centuries.
              </p>
              <p>
                Tamil Nadu&apos;s water heritage is vast and so much of it exists outside the
                boundaries of what we have been taught to call heritage. No grand façade. No protected
                status. Just structures and systems that have quietly held communities together for
                generations, now facing encroachment, neglect, and a climate that is changing faster
                than we can keep up.
              </p>
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
                &ldquo;My ancestors are from the Porunai basin—the valley of the Tamiraparani River
                in Tirunelveli.&rdquo;
              </blockquote>
            </div>
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
          </div>
        </SectionInner>
      </div>
    </Section>
  );
}
