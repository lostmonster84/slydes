-- Create waitlist table for slydes.io signups
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  industry TEXT,
  source TEXT DEFAULT 'website',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- RLS policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for signups)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" ON waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
