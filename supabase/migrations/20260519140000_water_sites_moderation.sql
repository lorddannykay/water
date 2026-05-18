-- Moderation for contributed water sites (map shows approved only)

ALTER TABLE public.water_sites
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

ALTER TABLE public.water_sites
  DROP CONSTRAINT IF EXISTS water_sites_status_check;

ALTER TABLE public.water_sites
  ADD CONSTRAINT water_sites_status_check
  CHECK (status IN ('pending', 'approved', 'rejected'));

CREATE POLICY "Public can read approved water sites"
  ON public.water_sites
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');
