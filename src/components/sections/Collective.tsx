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
          Behind The Water Heritage Project is a wider circle. Researchers and conservationists. Historians and
          teachers. Writers and farmers. People who grew up near water and never quite left it
          behind.
        </p>
        <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-dim">
          We bring different knowledge and ask each other hard questions. We share what we find and
          sit with what we don&apos;t understand.
        </p>
      </SectionInner>
    </Section>
  );
}
