-- Add background music fields to organizations
-- Supports: custom upload (R2) OR library selection (mutually exclusive)

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS home_audio_r2_key text,
  ADD COLUMN IF NOT EXISTS home_audio_library_id text,
  ADD COLUMN IF NOT EXISTS home_audio_enabled boolean DEFAULT true;

-- Index for library track lookups
CREATE INDEX IF NOT EXISTS idx_organizations_home_audio_library
  ON public.organizations (home_audio_library_id)
  WHERE home_audio_library_id IS NOT NULL;

COMMENT ON COLUMN public.organizations.home_audio_r2_key IS 'Cloudflare R2 object key for custom uploaded audio';
COMMENT ON COLUMN public.organizations.home_audio_library_id IS 'ID of selected royalty-free track from library';
COMMENT ON COLUMN public.organizations.home_audio_enabled IS 'Whether background music is enabled for this organization';
