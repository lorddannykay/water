import { motion, useReducedMotion } from 'motion/react';
import { FormEvent, useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import { Section, SectionInner } from '../Section';
import { FormToast } from '../ui/FormToast';

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const name = (data.get('name') as string)?.trim();
    const email = (data.get('email') as string)?.trim();
    const message = (data.get('message') as string)?.trim();

    if (!name || !email || !message) {
      setToast('Please fill in all fields.');
      setTimeout(() => setToast(null), 4000);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast('Please enter a valid email address.');
      setTimeout(() => setToast(null), 4000);
      return;
    }

    form.reset();
    setToast('Thank you for reaching out. We will be in touch soon.');
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <>
      <Section id="contact" className="!min-h-0 py-32">
        <SectionInner narrow>
          <motion.div
            className="w-full text-center"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <Mail className="h-7 w-7 text-accent" aria-hidden />
          </div>

          <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Contact</span>
          <h2 className="mt-4 font-serif text-4xl text-ink md:text-6xl">Come find us.</h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-dim">
            With a site, a story, a question, or an idea. With something you&apos;ve been holding
            that you think belongs here. With a collaboration that could take this further than
            we&apos;ve imagined.
          </p>
          <p className="mt-4 font-body text-lg leading-relaxed text-dim">
            This project is made of what people bring to it. We hope you&apos;ll bring something
            too.
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass mt-12 space-y-6 rounded-2xl p-8 text-left md:p-10"
            noValidate
            aria-label="Contact form"
          >
            <div className="form-field">
              <label htmlFor="contact-name" className="form-label">
                Name <span className="text-accent">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                className="form-input"
                autoComplete="name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email" className="form-label">
                Email <span className="text-accent">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                className="form-input"
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-message" className="form-label">
                Message <span className="text-accent">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                className="form-textarea"
                placeholder="Your story, question, or idea…"
              />
            </div>

            <button type="submit" className="btn-primary btn-ripple w-full">
              Send Message
            </button>
          </form>

          <p className="mt-16 font-serif text-xl text-ink italic md:text-2xl">
            Water remembers.
          </p>
          </motion.div>
        </SectionInner>
      </Section>

      <FormToast message={toast ?? ''} visible={!!toast} />
    </>
  );
}
