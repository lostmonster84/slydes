-- Add feature toggles to organizations
-- This allows per-account feature configuration
-- Default: lists OFF (can be enabled per account), shop OFF (coming soon)

ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS features_enabled JSONB DEFAULT '{"lists": false, "shop": false}'::jsonb;

-- Add comment explaining the structure
COMMENT ON COLUMN organizations.features_enabled IS 'Feature toggles for this organization. Keys: lists (inventory management), shop (commerce/checkout). Users can toggle these on/off in Settings > Features.';

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_organizations_features ON organizations USING GIN (features_enabled);

-- Note: Defaults are OFF for all industries. Users can enable features they need.
-- Property + Hospitality focus means most won't need Lists or Shop initially.
-- Automotive/Dealerships may want Lists for vehicle inventory - they can enable it.
