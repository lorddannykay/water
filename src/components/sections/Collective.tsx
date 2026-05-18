import { Section, SectionInner } from '../Section';

export function Collective() {
  return (
    <Section id="collective" className="bg-surface/40 !min-h-0 py-32">
      <SectionInner>
        <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Collective</span>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
          No river runs alone.
        </h2>
        <p className="mt-6 max-w-3xl font-body text-lg leading-relaxed text-dim">
          The project draws on a wider circle of researchers, conservationists, historians,
          teachers, writers, and farmers, including many who grew up near water and still think about
          it daily.
        </p>
        <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-dim">
          We work across different disciplines, share findings as we go, and stay honest about what
          we do not yet know.
        </p>
      </SectionInner>
    </Section>
  );
}
