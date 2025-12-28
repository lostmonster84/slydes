-- Create vertical_defaults table for HQ-managed industry feature defaults
-- This controls what features are enabled by default when new organizations are created

CREATE TABLE IF NOT EXISTS vertical_defaults (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vertical_id TEXT NOT NULL UNIQUE,
  features_enabled JSONB DEFAULT '{"lists": false, "shop": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default values for each vertical
INSERT INTO vertical_defaults (vertical_id, features_enabled) VALUES
  ('property', '{"lists": false, "shop": false}'::jsonb),
  ('hospitality', '{"lists": false, "shop": false}'::jsonb),
  ('automotive', '{"lists": true, "shop": false}'::jsonb),
  ('other', '{"lists": false, "shop": false}'::jsonb)
ON CONFLICT (vertical_id) DO NOTHING;

-- Add comment explaining the table
COMMENT ON TABLE vertical_defaults IS 'HQ-managed default feature settings per industry vertical. Applied when new organizations are created.';

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_vertical_defaults_vertical_id ON vertical_defaults (vertical_id);

-- Add RLS policies
ALTER TABLE vertical_defaults ENABLE ROW LEVEL SECURITY;

-- Anyone can read vertical defaults (needed during org creation)
CREATE POLICY "Anyone can read vertical defaults"
  ON vertical_defaults FOR SELECT
  USING (true);

-- Only service role can update (HQ admin uses service role)
-- No user-facing update policy - updates go through API route with admin client
