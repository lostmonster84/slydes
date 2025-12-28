-- Social Stack Configuration
-- Adds configurable social action stack buttons, contact methods, and location data

-- =========================================
-- 1. Social Stack Configuration
-- =========================================

-- Full social stack config as JSONB (buttons enabled + order)
ALTER TABLE public.organizations
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
-- 2. Contact Methods
-- =========================================

-- Phone number for contact
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS contact_phone text;

-- Email for contact (separate from owner email)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS contact_email text;

-- WhatsApp number (can be different from phone)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS contact_whatsapp text;

-- =========================================
-- 3. Location Data
-- =========================================

-- Full address text
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS location_address text;

-- Latitude for map
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS location_lat decimal(10, 8);

-- Longitude for map
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS location_lng decimal(11, 8);

-- =========================================
-- 4. Vertical Type
-- =========================================

-- Business vertical for presets (more specific than business_type)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS vertical text DEFAULT 'other'
    CHECK (vertical IN (
      'property-sales',
      'property-lettings',
      'holiday-accommodation',
      'hotels',
      'experiences',
      'restaurants',
      'creators',
      'other'
    ));

-- =========================================
-- 5. Comments
-- =========================================

COMMENT ON COLUMN public.organizations.social_stack_config IS 'JSONB config for social stack buttons (enabled + order)';
COMMENT ON COLUMN public.organizations.contact_phone IS 'Phone number for ContactSheet';
COMMENT ON COLUMN public.organizations.contact_email IS 'Email address for ContactSheet';
COMMENT ON COLUMN public.organizations.contact_whatsapp IS 'WhatsApp number for ContactSheet';
COMMENT ON COLUMN public.organizations.location_address IS 'Full address for LocationSheet';
COMMENT ON COLUMN public.organizations.location_lat IS 'Latitude for map display';
COMMENT ON COLUMN public.organizations.location_lng IS 'Longitude for map display';
COMMENT ON COLUMN public.organizations.vertical IS 'Business vertical for UI presets';
