-- Social Stack Config at Slyde Level
-- Each slyde (property listing) gets its own contact/location/config
-- This allows managing 20 properties with unique addresses

-- =========================================
-- 1. Social Stack Configuration (per-slyde)
-- =========================================

ALTER TABLE public.slydes
  ADD COLUMN IF NOT EXISTS social_stack_config jsonb DEFAULT '{
    "buttons": {
      "location": true,
      "info": true,
      "contact": true,
      "share": true,
      "heart": false,
      "connect": true
    },
    "order": ["location", "info", "contact", "share", "heart", "connect"]
  }'::jsonb;

-- =========================================
-- 2. Contact Methods (per-slyde)
-- =========================================

ALTER TABLE public.slydes
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;

-- =========================================
-- 3. Location Data (per-slyde)
-- =========================================

ALTER TABLE public.slydes
  ADD COLUMN IF NOT EXISTS location_address TEXT,
  ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8);

-- =========================================
-- 4. Comments
-- =========================================

COMMENT ON COLUMN public.slydes.social_stack_config IS 'JSONB config for social stack buttons (enabled + order) - per slyde';
COMMENT ON COLUMN public.slydes.contact_phone IS 'Phone number for this slyde ContactSheet';
COMMENT ON COLUMN public.slydes.contact_email IS 'Email address for this slyde ContactSheet';
COMMENT ON COLUMN public.slydes.contact_whatsapp IS 'WhatsApp number for this slyde ContactSheet';
COMMENT ON COLUMN public.slydes.location_address IS 'Full address for this slyde LocationSheet';
COMMENT ON COLUMN public.slydes.location_lat IS 'Latitude for map display';
COMMENT ON COLUMN public.slydes.location_lng IS 'Longitude for map display';
