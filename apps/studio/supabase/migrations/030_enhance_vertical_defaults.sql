-- Enhance vertical_defaults to be the single source of truth for verticals
-- This adds metadata columns so verticals can be managed from HQ without code changes

-- Add metadata columns to vertical_defaults
ALTER TABLE vertical_defaults
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;

-- Update existing rows with metadata
UPDATE vertical_defaults SET
  name = 'Property',
  description = 'Estate agents, lettings, property managers',
  icon = '🏠',
  display_order = 1,
  enabled = true
WHERE vertical_id = 'property';

UPDATE vertical_defaults SET
  name = 'Hospitality',
  description = 'Hotels, holiday lets, glamping, B&Bs',
  icon = '🏨',
  display_order = 2,
  enabled = true
WHERE vertical_id = 'hospitality';

UPDATE vertical_defaults SET
  name = 'Automotive',
  description = 'Car hire, dealerships, vehicle rentals',
  icon = '🚗',
  display_order = 3,
  enabled = true
WHERE vertical_id = 'automotive';

UPDATE vertical_defaults SET
  name = 'Other',
  description = 'Restaurants, fitness, salons, events, and more',
  icon = '✨',
  display_order = 100,
  enabled = true
WHERE vertical_id = 'other';

-- Add NOT NULL constraint to name after populating
ALTER TABLE vertical_defaults
  ALTER COLUMN name SET NOT NULL;

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_vertical_defaults_display_order ON vertical_defaults (display_order);

-- Add comment
COMMENT ON TABLE vertical_defaults IS 'Centralized vertical/industry definitions with feature defaults. Managed from HQ admin. All forms should fetch from this table.';
