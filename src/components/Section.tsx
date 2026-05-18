import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../lib/utils';

const sectionRevealEase = [0.2, 1, 0.35, 1] as [number, number, number, number];
const sectionRevealTransition = { duration: 1.2, ease: sectionRevealEase };

/** One shared content column so every section lines up with the navbar and footer. */
export function SectionInner({
  children,
  className,
  narrow,
}: {
  children: React.ReactNode;
  className?: string;
  /** Narrow prose / forms (max ~720px). */
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-3xl' : 'max-w-6xl',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  id,
  className,
  reveal = true,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  reveal?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const animateIn = reveal && prefersReducedMotion === false;

  const viewportOpts = animateIn
    ? { once: true as const, margin: '-5% 0px -15% 0px' as const, amount: 0.05 as const }
    : undefined;

  return (
    <motion.section
      initial={animateIn ? { y: 28, opacity: 0 } : false}
      whileInView={animateIn ? { y: 0, opacity: 1 } : undefined}
      viewport={viewportOpts}
      transition={sectionRevealTransition}
      id={id}
      className={cn(
        'section-shell relative z-10 flex w-full min-h-0 flex-col justify-start py-20 md:py-28',
        className
      )}
    >
      {children}
    </motion.section>
  );
}
