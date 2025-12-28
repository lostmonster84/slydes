-- Platform-wide settings for global feature toggles
-- Used by HQ admin to control features across all users

CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (admin access via API)
CREATE POLICY "Service role only" ON platform_settings
  FOR ALL USING (auth.role() = 'service_role');

-- Insert default settings
INSERT INTO platform_settings (key, value) VALUES
  ('features', '{"onboardingPulse": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Helper function to get a platform setting
CREATE OR REPLACE FUNCTION get_platform_setting(setting_key TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT value FROM platform_settings WHERE key = setting_key;
$$;

-- Comment for clarity
COMMENT ON TABLE platform_settings IS 'Global platform settings controlled by HQ admin';
COMMENT ON FUNCTION get_platform_setting IS 'Public function to read platform settings (used by Studio)';
