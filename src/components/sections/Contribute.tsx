import { motion, useReducedMotion } from 'motion/react';
import { FormEvent, useRef, useState } from 'react';
import { Mail, Plus } from 'lucide-react';
import { Section, SectionInner } from '../Section';
import { FormToast } from '../ui/FormToast';
import { scrollToSection } from '../../lib/utils';

const SITE_TYPES = ['River', 'Tank', 'Sacred Pond', 'Spring', 'Channel', 'Other'] as const;

export function Contribute() {
  const formRef = useRef<HTMLFormElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const name = (data.get('siteName') as string)?.trim();
    const location = (data.get('location') as string)?.trim();

    if (!name || !location) {
      setToast('Please add at least a site name and location.');
      setTimeout(() => setToast(null), 4000);
      return;
    }

    form.reset();
    setToast('Thank you. Your water memory has been received. We will review it soon.');
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <>
      <Section id="contribute" className="!min-h-0 py-32">
        <SectionInner narrow>
          <motion.div
            className="w-full"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
          <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Contribute</span>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
            You know a place this atlas is looking for.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-dim">
            That knowledge is not small. It is exactly what The Water Heritage Project runs on. Water memory is
            made of exactly those fragments.
          </p>
          <button
            type="button"
            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="btn-primary btn-ripple mt-8"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add a Water Site
          </button>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass mt-12 space-y-6 rounded-2xl p-8 md:p-10"
            noValidate
            aria-label="Add a water heritage site"
          >
            <div className="form-field">
              <label htmlFor="location" className="form-label">
                Location <span className="text-accent">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="Village, district, or coordinates"
                className="form-input"
                autoComplete="address-level2"
              />
            </div>

            <div className="form-field">
              <label htmlFor="siteName" className="form-label">
                Site name <span className="text-accent">*</span>
              </label>
              <input
                id="siteName"
                name="siteName"
                type="text"
                required
                placeholder="What is this place called?"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="siteType" className="form-label">
                Type
              </label>
              <select id="siteType" name="siteType" className="form-select" defaultValue="Tank">
                {SITE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="photograph" className="form-label">
                Photograph
              </label>
              <input
                id="photograph"
                name="photograph"
                type="file"
                accept="image/*"
                className="form-input cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-bold file:text-white file:uppercase"
              />
            </div>

            <div className="form-field">
              <label htmlFor="story" className="form-label">
                Story / memory
              </label>
              <textarea
                id="story"
                name="story"
                placeholder="One sentence or a lifetime of memory, whatever you have."
                className="form-textarea"
              />
            </div>

            <div className="form-field">
              <label htmlFor="contributorName" className="form-label">
                Your name <span className="text-dim">(optional)</span>
              </label>
              <input
                id="contributorName"
                name="contributorName"
                type="text"
                placeholder="How should we credit you?"
                className="form-input"
                autoComplete="name"
              />
            </div>

            <button type="submit" className="btn-primary btn-ripple w-full sm:w-auto">
              Add a Water Site
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="font-body text-dim">
              You can also write to us. Point us toward a community whose water knowledge we should
              know about. Share a story that doesn&apos;t fit neatly into a pin on a map.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="btn-secondary btn-ripple mt-6"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Get in Touch
            </button>
          </div>
          </motion.div>
        </SectionInner>
      </Section>

      <FormToast message={toast ?? ''} visible={!!toast} />
    </>
  );
}
