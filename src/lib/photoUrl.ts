/** Validate optional HTTPS image URL for contribute form */
export function isValidPhotoUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:') return false;
    if (!url.hostname) return false;
    if (/javascript:/i.test(trimmed)) return false;
    return true;
  } catch {
    return false;
  }
}

export function normalizePhotoUrl(value: string): string {
  return value.trim();
}
