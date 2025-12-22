-- Add vertical field to organizations
-- This links to vertical_defaults and determines which features are available

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS vertical TEXT DEFAULT NULL;

-- Add check constraint to ensure valid vertical values
-- Values must match vertical_defaults.vertical_id or be null
ALTER TABLE public.organizations
  ADD CONSTRAINT organizations_vertical_check
  CHECK (vertical IS NULL OR vertical IN ('property', 'hospitality', 'automotive', 'beauty', 'food', 'other'));

-- Create index for efficient filtering by vertical
CREATE INDEX IF NOT EXISTS idx_organizations_vertical ON public.organizations (vertical);

-- Add comment
COMMENT ON COLUMN public.organizations.vertical IS 'Industry vertical (property, hospitality, automotive, etc). Determines available features and action stack buttons.';
