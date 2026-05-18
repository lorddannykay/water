import { motion, useReducedMotion } from 'motion/react';
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import { Camera, Loader2, Mail, Plus } from 'lucide-react';
import { Section, SectionInner } from '../Section';
import { FormToast } from '../ui/FormToast';
import { LocationField, type LocationFieldValue } from '../contribute/LocationField';
import { scrollToSection } from '../../lib/utils';
import { compressImage, formatSizeKb } from '../../lib/imageUtils';
import { isSupabaseConfigured, SITE_PHOTOS_BUCKET, supabase } from '../../lib/supabase';
import { formatSiteTypeLabel, SITE_TYPES } from '../../lib/siteTypes';

const EMPTY_LOCATION: LocationFieldValue = {
  text: '',
  lat: null,
  lng: null,
  source: null,
  synced: false,
};

export function Contribute() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [location, setLocation] = useState<LocationFieldValue>(EMPTY_LOCATION);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoSizeLabel, setPhotoSizeLabel] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const showToast = useCallback((message: string, ms = 5000) => {
    setToast(message);
    setTimeout(() => setToast(null), ms);
  }, []);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const result = await compressImage(file);
      setPhotoBlob(result.blob);
      setPhotoSizeLabel(
        result.skippedCompression
          ? `Ready to upload (${formatSizeKb(result.sizeKb)})`
          : `Compressed to ${formatSizeKb(result.sizeKb)}`,
      );
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(URL.createObjectURL(result.blob));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not process photo.', 4000);
      e.target.value = '';
    } finally {
      setCompressing(false);
    }
  };

  const resetFormState = () => {
    formRef.current?.reset();
    setLocation(EMPTY_LOCATION);
    setPhotoBlob(null);
    setPhotoSizeLabel(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const siteName = (data.get('siteName') as string)?.trim();
    const locationText =
      ((data.get('location') as string)?.trim() || location.text.trim());
    const siteType = (data.get('siteType') as string) || 'Tank';
    const story = (data.get('story') as string)?.trim() || null;
    const contributorName = (data.get('contributorName') as string)?.trim() || null;

    if (!siteName || !locationText) {
      showToast('Please add at least a site name and location.', 4000);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showToast('Submissions are not configured yet. Please try again later.', 5000);
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl: string | null = null;

      if (photoBlob) {
        const fileName = `${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(SITE_PHOTOS_BUCKET)
          .upload(fileName, photoBlob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from(SITE_PHOTOS_BUCKET).getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('water_sites').insert({
        site_name: siteName,
        site_type: siteType,
        location_text: locationText,
        latitude: location.lat,
        longitude: location.lng,
        story,
        contributor_name: contributorName,
        photo_url: photoUrl,
      });

      if (insertError) throw insertError;

      resetFormState();
      showToast(`Thank you. "${siteName}" has been received. We will review it soon.`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      showToast(msg.includes('relation') ? 'Database not ready — run the setup SQL in Supabase.' : msg, 6000);
    } finally {
      setSubmitting(false);
    }
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
              You may not think of it as expertise, but local knowledge is what this project runs on.
              The atlas is built from small, specific fragments like yours.
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
              <motion.div className="form-field">
                <label htmlFor="photograph" className="form-label">
                  Photograph
                </label>
                <input
                  ref={fileInputRef}
                  id="photograph"
                  name="photograph"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={handlePhotoChange}
                  disabled={compressing || submitting}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={compressing || submitting}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-accent/30 bg-surface/50 px-4 py-8 transition-colors hover:border-accent/50 disabled:opacity-60"
                >
                  {compressing ? (
                    <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden />
                  ) : (
                    <Camera className="h-6 w-6 text-accent" aria-hidden />
                  )}
                  <span className="font-body text-sm text-dim">
                    {compressing ? 'Preparing photo…' : 'Take or choose a photo'}
                  </span>
                </button>
                {photoPreview && (
                  <motion.div
                    className="mt-4 overflow-hidden rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <img
                      src={photoPreview}
                      alt="Preview of your photograph"
                      className="max-h-48 w-full object-cover"
                    />
                    {photoSizeLabel && (
                      <p className="mt-2 font-body text-xs text-dim">{photoSizeLabel}</p>
                    )}
                  </motion.div>
                )}
              </motion.div>

              <LocationField
                value={location}
                onChange={setLocation}
                disabled={submitting}
                onError={(msg) => showToast(msg, 5000)}
              />

              <motion.div className="form-field">
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
                  disabled={submitting}
                />
              </motion.div>

              <motion.div className="form-field">
                <label htmlFor="siteType" className="form-label">
                  Type
                </label>
                <select
                  id="siteType"
                  name="siteType"
                  className="form-select"
                  defaultValue="Tank"
                  disabled={submitting}
                >
                  {SITE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {formatSiteTypeLabel(t)}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div className="form-field">
                <label htmlFor="story" className="form-label">
                  Story / memory
                </label>
                <textarea
                  id="story"
                  name="story"
                  placeholder="One sentence or a lifetime of memory, whatever you have."
                  className="form-textarea"
                  disabled={submitting}
                />
              </motion.div>

              <motion.div className="form-field">
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
                  disabled={submitting}
                />
              </motion.div>

              <button
                type="submit"
                disabled={submitting || compressing}
                className="btn-primary btn-ripple w-full sm:w-auto disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  'Add a Water Site'
                )}
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
