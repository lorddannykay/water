import { motion, useReducedMotion } from 'motion/react';
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Mail, Plus } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageProvider';
import { Section, SectionInner } from '../Section';
import { FormToast } from '../ui/FormToast';
import {
  LocationField,
  type LocationFieldHandle,
  type LocationFieldValue,
} from '../contribute/LocationField';
import { useLocationDraft } from '../../context/LocationDraftContext';
import { scrollToSection } from '../../lib/utils';
import { compressImage, formatSizeKb } from '../../lib/imageUtils';
import { isValidPhotoUrl, normalizePhotoUrl } from '../../lib/photoUrl';
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
  const { locale, t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationFieldRef = useRef<LocationFieldHandle>(null);
  const { draft, clearDraft } = useLocationDraft();
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [location, setLocation] = useState<LocationFieldValue>(EMPTY_LOCATION);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoSizeLabel, setPhotoSizeLabel] = useState<string | null>(null);
  const [photoLink, setPhotoLink] = useState('');
  const prefersReducedMotion = useReducedMotion();

  const showToast = useCallback((message: string, ms = 5000) => {
    setToast(message);
    setTimeout(() => setToast(null), ms);
  }, []);

  useEffect(() => {
    if (!draft) return;
    setLocation(draft);
    showToast(t('contribute.toastLocationFromMap'));
    clearDraft();
    requestAnimationFrame(() => {
      locationFieldRef.current?.scrollIntoView();
      locationFieldRef.current?.focus();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apply once per draft
  }, [draft]);

  const clearUploadedPhoto = () => {
    setPhotoBlob(null);
    setPhotoSizeLabel(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLink('');
    setCompressing(true);
    try {
      const result = await compressImage(file);
      setPhotoBlob(result.blob);
      setPhotoLink('');
      setPhotoSizeLabel(
        result.skippedCompression
          ? t('contribute.photoReady', { size: formatSizeKb(result.sizeKb) })
          : t('contribute.photoCompressed', { size: formatSizeKb(result.sizeKb) }),
      );
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(URL.createObjectURL(result.blob));
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('contribute.toastPhotoError'), 4000);
      e.target.value = '';
    } finally {
      setCompressing(false);
    }
  };

  const resetFormState = () => {
    formRef.current?.reset();
    setLocation(EMPTY_LOCATION);
    clearUploadedPhoto();
    setPhotoLink('');
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
      showToast(t('contribute.toastMissing'), 4000);
      return;
    }

    const trimmedPhotoLink = photoLink.trim();
    if (trimmedPhotoLink && !isValidPhotoUrl(trimmedPhotoLink)) {
      showToast(t('contribute.toastInvalidPhotoUrl'), 4000);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showToast(t('contribute.toastNotConfigured'), 5000);
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
      } else if (trimmedPhotoLink) {
        photoUrl = normalizePhotoUrl(trimmedPhotoLink);
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
      showToast(t('contribute.toastThanksModerated', { name: siteName }));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : t('contribute.toastError');
      showToast(
        msg.includes('relation') ? t('contribute.toastDbNotReady') : msg,
        6000,
      );
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
            <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">
              {t('contribute.label')}
            </span>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              {t('contribute.title')}
            </h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-dim">{t('contribute.intro')}</p>
            <button
              type="button"
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="btn-primary btn-ripple mt-8"
            >
              <Plus className="h-4 w-4" aria-hidden />
              {t('contribute.addSite')}
            </button>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass mt-12 space-y-6 rounded-2xl p-8 md:p-10"
              noValidate
              aria-label={t('contribute.formAria')}
            >
              <motion.div className="form-field">
                <label htmlFor="photograph" className="form-label">
                  {t('contribute.photograph')}
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
                  disabled={compressing || submitting || !!photoLink.trim()}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={compressing || submitting || !!photoLink.trim()}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-accent/30 bg-surface/50 px-4 py-8 transition-colors hover:border-accent/50 disabled:opacity-60"
                >
                  {compressing ? (
                    <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden />
                  ) : (
                    <Camera className="h-6 w-6 text-accent" aria-hidden />
                  )}
                  <span className="font-body text-sm text-dim">
                    {compressing ? t('contribute.preparingPhoto') : t('contribute.takePhoto')}
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
                      alt={t('contribute.photoPreviewAlt')}
                      className="max-h-48 w-full object-cover"
                    />
                    {photoSizeLabel && (
                      <p className="mt-2 font-body text-xs text-dim">{photoSizeLabel}</p>
                    )}
                  </motion.div>
                )}
                <p className="mt-3 text-center font-body text-xs text-dim">{t('contribute.photoOr')}</p>
                <label htmlFor="photoLink" className="sr-only">
                  {t('contribute.photoLink')}
                </label>
                <input
                  id="photoLink"
                  name="photoLink"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  placeholder={t('contribute.photoLinkPlaceholder')}
                  className="form-input mt-2"
                  value={photoLink}
                  onChange={(e) => {
                    const next = e.target.value;
                    setPhotoLink(next);
                    if (next.trim()) clearUploadedPhoto();
                  }}
                  disabled={compressing || submitting || !!photoBlob}
                />
              </motion.div>

              <LocationField
                ref={locationFieldRef}
                value={location}
                onChange={setLocation}
                disabled={submitting}
                onError={(msg) => showToast(msg, 5000)}
              />

              <motion.div className="form-field">
                <label htmlFor="siteName" className="form-label">
                  {t('contribute.siteName')} <span className="text-accent">*</span>
                </label>
                <input
                  id="siteName"
                  name="siteName"
                  type="text"
                  required
                  placeholder={t('contribute.siteNamePlaceholder')}
                  className="form-input"
                  disabled={submitting}
                />
              </motion.div>

              <motion.div className="form-field">
                <label htmlFor="siteType" className="form-label">
                  {t('contribute.type')}
                </label>
                <select
                  id="siteType"
                  name="siteType"
                  className="form-select"
                  defaultValue="Tank"
                  disabled={submitting}
                >
                  {SITE_TYPES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {formatSiteTypeLabel(st, locale)}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div className="form-field">
                <label htmlFor="story" className="form-label">
                  {t('contribute.story')}
                </label>
                <textarea
                  id="story"
                  name="story"
                  placeholder={t('contribute.storyPlaceholder')}
                  className="form-textarea"
                  disabled={submitting}
                />
              </motion.div>

              <motion.div className="form-field">
                <label htmlFor="contributorName" className="form-label">
                  {t('contribute.yourName')}{' '}
                  <span className="text-dim">{t('contribute.yourNameOptional')}</span>
                </label>
                <input
                  id="contributorName"
                  name="contributorName"
                  type="text"
                  placeholder={t('contribute.yourNamePlaceholder')}
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
                    {t('contribute.sending')}
                  </>
                ) : (
                  t('contribute.submit')
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="font-body text-dim">{t('contribute.footerP')}</p>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="btn-secondary btn-ripple mt-6"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {t('contribute.getInTouch')}
              </button>
            </div>
          </motion.div>
        </SectionInner>
      </Section>

      <FormToast message={toast ?? ''} visible={!!toast} />
    </>
  );
}
