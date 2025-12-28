-- Expand features_enabled to include social stack and section toggles
-- This enables vertical-based default configurations for the inspector

-- Update the default value to include all feature flags
-- Existing orgs keep their current values, this just sets the default for new orgs
COMMENT ON COLUMN organizations.features_enabled IS
'Feature toggles for this organization.
Keys:
- lists: Inventory management (boolean)
- shop: Commerce/checkout (boolean)
- socialStack: Action stack buttons { location, info, share, heart, connect } (object of booleans)
- sections: Content sections { contact, faqs, demoVideo } (object of booleans)
Applied from vertical defaults when org is created, can be overridden per-slyde.';

-- Update vertical_defaults to include the expanded feature flags
-- This adds socialStack and sections to the features_enabled JSONB

UPDATE vertical_defaults SET
  features_enabled = jsonb_set(
    jsonb_set(
      COALESCE(features_enabled, '{}'::jsonb),
      '{socialStack}',
      '{"location": true, "info": true, "share": true, "heart": false, "connect": false}'::jsonb
    ),
    '{sections}',
    '{"contact": true, "faqs": true, "demoVideo": true}'::jsonb
  )
WHERE vertical_id = 'property';

UPDATE vertical_defaults SET
  features_enabled = jsonb_set(
    jsonb_set(
      COALESCE(features_enabled, '{}'::jsonb),
      '{socialStack}',
      '{"location": false, "info": true, "share": true, "heart": false, "connect": true}'::jsonb
    ),
    '{sections}',
    '{"contact": true, "faqs": true, "demoVideo": true}'::jsonb
  )
WHERE vertical_id = 'automotive';

UPDATE vertical_defaults SET
  features_enabled = jsonb_set(
    jsonb_set(
      COALESCE(features_enabled, '{}'::jsonb),
      '{socialStack}',
      '{"location": true, "info": true, "share": true, "heart": true, "connect": true}'::jsonb
    ),
    '{sections}',
    '{"contact": true, "faqs": true, "demoVideo": true}'::jsonb
  )
WHERE vertical_id = 'hospitality';

UPDATE vertical_defaults SET
  features_enabled = jsonb_set(
    jsonb_set(
      COALESCE(features_enabled, '{}'::jsonb),
      '{socialStack}',
      '{"location": true, "info": true, "share": true, "heart": false, "connect": true}'::jsonb
    ),
    '{sections}',
    '{"contact": true, "faqs": false, "demoVideo": false}'::jsonb
  )
WHERE vertical_id = 'other';

-- Insert beauty and food verticals if they don't exist
INSERT INTO vertical_defaults (vertical_id, name, description, icon, display_order, enabled, features_enabled)
VALUES
  ('beauty', 'Beauty & Wellness', 'Salons, spas, fitness, wellness', '💅', 4, true,
   '{"lists": false, "shop": false, "socialStack": {"location": true, "info": true, "share": true, "heart": true, "connect": true}, "sections": {"contact": true, "faqs": true, "demoVideo": false}}'::jsonb),
  ('food', 'Food & Drink', 'Restaurants, cafes, bars, catering', '🍽️', 5, true,
   '{"lists": false, "shop": false, "socialStack": {"location": true, "info": true, "share": true, "heart": true, "connect": false}, "sections": {"contact": true, "faqs": true, "demoVideo": false}}'::jsonb)
ON CONFLICT (vertical_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  features_enabled = EXCLUDED.features_enabled;
