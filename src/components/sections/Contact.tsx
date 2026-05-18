import { motion, useReducedMotion } from 'motion/react';
import { FormEvent, useRef, useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageProvider';
import { Section, SectionInner } from '../Section';
import { FormToast } from '../ui/FormToast';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

export function Contact() {
  const { t } = useTranslation();
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
      showToast(t('contact.toastMissing'), 4000);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast(t('contact.toastInvalidEmail'), 4000);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showToast(t('contact.toastNotConfigured'), 5000);
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
      showToast(t('contact.toastThanks'));
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('contact.toastError');
      showToast(msg.includes('relation') ? t('contact.toastDbNotReady') : msg, 6000);
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
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
              <Mail className="h-7 w-7 text-accent" aria-hidden />
            </div>

            <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">
              {t('contact.label')}
            </span>
            <h2 className="mt-4 font-serif text-4xl text-ink md:text-6xl">{t('contact.title')}</h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-dim">{t('contact.p1')}</p>
            <p className="mt-4 font-body text-lg leading-relaxed text-dim">{t('contact.p2')}</p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass mt-12 space-y-6 rounded-2xl p-8 text-left md:p-10"
              noValidate
              aria-label={t('contact.formAria')}
            >
              <motion.div className="form-field">
                <label htmlFor="contact-name" className="form-label">
                  {t('contact.name')} <span className="text-accent">*</span>
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
                  {t('contact.email')} <span className="text-accent">*</span>
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
                  {t('contact.message')} <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  className="form-textarea"
                  placeholder={t('contact.messagePlaceholder')}
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
                    {t('contact.sending')}
                  </>
                ) : (
                  t('contact.submit')
                )}
              </button>
            </form>

            <p className="mt-16 font-serif text-xl text-ink italic md:text-2xl">
              {t('contact.closing')}
            </p>
          </motion.div>
        </SectionInner>
      </Section>

      <FormToast message={toast ?? ''} visible={!!toast} />
    </>
  );
}
