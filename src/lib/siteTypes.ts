import type { Locale } from '../i18n/types';

export type SiteTypeOption = {
  value: string;
  labelEn: string;
  labelTa: string;
};

/** Stored in DB as English `value`; shown in UI by locale. */
export const SITE_TYPES: SiteTypeOption[] = [
  { value: 'River', labelEn: 'River', labelTa: 'ஆறு' },
  { value: 'Tank', labelEn: 'Tank', labelTa: 'குளம்' },
  { value: 'Sacred Pond', labelEn: 'Sacred Pond', labelTa: 'திருக்குளம்' },
  { value: 'Spring', labelEn: 'Spring', labelTa: 'நீரூற்று' },
  { value: 'Channel', labelEn: 'Channel', labelTa: 'கால்வாய்' },
  { value: 'Other', labelEn: 'Other', labelTa: 'மற்றவை' },
];

export function formatSiteTypeLabel(option: SiteTypeOption, locale: Locale = 'en'): string {
  return locale === 'ta' ? option.labelTa : option.labelEn;
}
