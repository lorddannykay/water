import { motion, useReducedMotion } from 'motion/react';
import { FormEvent, useRef, useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { Section, SectionInner } from '../Section';
import { FormToast } from '../ui/FormToast';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const showToast = (message: string, ms = 5000) => {
    setToast(message);
    setTimeout(() => setToast(null), ms);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const name = (data.get('name') as string)?.trim();
    const email = (data.get('email') as string)?.trim();
    const message = (data.get('message') as string)?.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all fields.', 4000);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 4000);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showToast('Submissions are not configured yet. Please try again later.', 5000);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name,
        email,
        message,
      });

      if (error) throw error;

      form.reset();
      showToast('Thank you for reaching out. We will be in touch soon.');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      showToast(
        msg.includes('relation') ? 'Database not ready — run the setup SQL in Supabase.' : msg,
        6000,
      );
    } finally {
      setSubmitting(false);
    }
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
            <motion.div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
              <Mail className="h-7 w-7 text-accent" aria-hidden />
            </motion.div>

            <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Contact</span>
            <h2 className="mt-4 font-serif text-4xl text-ink md:text-6xl">Come find us.</h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-dim">
              Write to us with a site, a story, a question, or an idea for collaboration. If you
              have been holding something you think belongs here, we would like to hear it.
            </p>
            <p className="mt-4 font-body text-lg leading-relaxed text-dim">
              The project grows through what people send in. We would be glad to hear from you.
            </p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass mt-12 space-y-6 rounded-2xl p-8 text-left md:p-10"
              noValidate
              aria-label="Contact form"
            >
              <motion.div className="form-field">
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
                  disabled={submitting}
                />
              </motion.div>

              <motion.div className="form-field">
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
                  disabled={submitting}
                />
              </motion.div>

              <motion.div className="form-field">
                <label htmlFor="contact-message" className="form-label">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  className="form-textarea"
                  placeholder="Your story, question, or idea…"
                  disabled={submitting}
                />
              </motion.div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary btn-ripple w-full disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  'Send Message'
                )}
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
