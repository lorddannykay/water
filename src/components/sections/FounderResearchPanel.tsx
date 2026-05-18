import { motion, useReducedMotion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import {
  SARANYA_LINKEDIN,
  SARANYA_PRESS,
  SARANYA_PUBLICATIONS,
  type ResearchLink,
} from '../../data/saranyaResearch';

function ResearchList({ items }: { items: ResearchLink[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg outline-offset-4 transition-colors hover:text-accent focus-visible:text-accent"
          >
            <span className="flex items-start gap-2 font-body text-sm leading-snug text-ink">
              <span className="flex-1">{item.title}</span>
              <ExternalLink
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-dim opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </span>
            {item.subtitle ? (
              <span className="mt-1 block font-sans text-xs tracking-wide text-dim">
                {item.subtitle}
                {item.year ? ` · ${item.year}` : ''}
              </span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function FounderResearchPanel() {
  const prefersReducedMotion = useReducedMotion();
  const press = SARANYA_PRESS[0];

  return (
    <motion.aside
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
      className="water-panel mt-10 p-8 md:p-10"
      aria-labelledby="saranya-research-heading"
    >
      <span className="text-xs font-bold tracking-[0.35em] text-accent uppercase">
        Research &amp; voice
      </span>
      <h4
        id="saranya-research-heading"
        className="mt-4 font-serif text-2xl leading-snug text-ink md:text-3xl"
      >
        Kulams along the Thamirabarani
      </h4>
      <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
        For over a decade, Saranya has studied the man-made kulam network along the Thamirabarani,
        from Tirunelveli to Thoothukudi. The Pandyas and later rulers built these tanks and canals
        to catch flood water and carry villages through drought. The same system still irrigates
        large parts of the basin today.
      </p>
      <blockquote className="mt-6 border-l-2 border-accent/50 py-1 pl-5 font-serif text-lg leading-relaxed text-ink italic md:text-xl">
        &ldquo;It is a climate-adaptive mechanism which needs to be adapted even now for climate
        resilience.&rdquo;
        <footer className="mt-3 font-sans text-xs not-italic tracking-[0.14em] text-dim uppercase">
          Saranya Dharshini, on the Pandyan kulam network
        </footer>
      </blockquote>
      {press ? (
        <p className="mt-6 font-body text-sm leading-relaxed text-dim">
          Featured in{' '}
          <a
            href={press.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
          >
            {press.subtitle}
          </a>
          {press.year ? ` (${press.year})` : ''}, on reviving kulams as a response to climate
          stress along the Thamirabarani.
        </p>
      ) : null}

      <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
        <div>
          <h5 className="text-xs font-bold tracking-[0.3em] text-dim uppercase">
            Selected publications
          </h5>
          <div className="mt-5">
            <ResearchList items={SARANYA_PUBLICATIONS} />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-8">
          <div>
            <h5 className="text-xs font-bold tracking-[0.3em] text-dim uppercase">Roles</h5>
            <ul className="mt-5 space-y-3 font-body text-sm leading-relaxed text-dim">
              <li>
                Vice President (Europe), ICOMOS International Scientific Committee on Water and
                Heritage
              </li>
              <li>Coordinator, ICOMOS Heritage and Gender Task Team</li>
              <li>Board Trustee, ICOMOS-UK</li>
              <li>Two-time UNESCO Asia-Pacific Awards for Cultural Heritage Conservation</li>
            </ul>
          </div>
          <a
            href={SARANYA_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-ripple inline-flex w-fit items-center gap-2 self-start"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            View profile on LinkedIn
          </a>
        </div>
      </div>
    </motion.aside>
  );
}
