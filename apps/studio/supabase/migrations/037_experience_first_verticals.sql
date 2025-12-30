-- Experience-First Pivot: Update verticals to focus on discovery businesses
-- Removes property/automotive from Tier 1 targets, adds experience-first categories

-- ============================================
-- Step 1: Add new experience-first verticals
-- ============================================

INSERT INTO vertical_defaults (vertical_id, name, description, icon, display_order, enabled, features_enabled) VALUES
  ('restaurant-bar', 'Restaurant / Bar / Cafe', 'Restaurants, bars, cafes, food & drink venues', '🍽️', 1, true, '{"lists": true, "shop": false}'::jsonb),
  ('hotel', 'Hotel / Lodge / Boutique Stay', 'Hotels, lodges, boutique stays, vacation rentals', '🏨', 2, true, '{"lists": true, "shop": false}'::jsonb),
  ('venue', 'Venue / Event Space', 'Wedding venues, event spaces, conference centers', '🎉', 3, true, '{"lists": true, "shop": false}'::jsonb),
  ('adventure', 'Tours / Adventures / Experiences', 'Tours, adventures, outdoor experiences, activities', '⛵', 4, true, '{"lists": true, "shop": false}'::jsonb),
  ('wellness', 'Spa / Wellness / Fitness', 'Spas, wellness centers, gyms, fitness studios', '✨', 5, true, '{"lists": true, "shop": false}'::jsonb)
ON CONFLICT (vertical_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  enabled = EXCLUDED.enabled;

-- ============================================
-- Step 2: Disable old property/automotive verticals
-- (Keep them for existing users, just hide from new onboarding)
-- ============================================

UPDATE vertical_defaults SET
  enabled = false,
  display_order = 900
WHERE vertical_id = 'property';

UPDATE vertical_defaults SET
  enabled = false,
  display_order = 901
WHERE vertical_id = 'automotive';

-- Update hospitality to be disabled (replaced by more specific options)
UPDATE vertical_defaults SET
  enabled = false,
  display_order = 902
WHERE vertical_id = 'hospitality';

-- Move "Other" to the end
UPDATE vertical_defaults SET
  display_order = 99,
  icon = '🌟'
WHERE vertical_id = 'other';

-- ============================================
-- Step 3: Update organizations constraint to allow new verticals
-- ============================================

-- Drop existing constraint
ALTER TABLE public.organizations
  DROP CONSTRAINT IF EXISTS organizations_vertical_check;

-- Add new constraint with all verticals (old + new)
ALTER TABLE public.organizations
  ADD CONSTRAINT organizations_vertical_check
  CHECK (vertical IS NULL OR vertical IN (
    -- New experience-first verticals
    'restaurant-bar',
    'hotel',
    'venue',
    'adventure',
    'wellness',
    -- Legacy verticals (for existing users)
    'property',
    'hospitality',
    'automotive',
    'beauty',
    'food',
    'other'
  ));

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE vertical_defaults IS 'Experience-first vertical/industry definitions. Primary focus: restaurants, hotels, venues, adventures, wellness. Legacy verticals (property, automotive) remain for existing users but are hidden from new onboarding.';
