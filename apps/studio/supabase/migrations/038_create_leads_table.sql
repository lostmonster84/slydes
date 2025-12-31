-- ============================================
-- Migration: Create leads table for early email capture
-- Purpose: Capture emails at Step 1 of onboarding before auth
-- ============================================

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT DEFAULT 'onboarding', -- where the lead came from
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ DEFAULT NULL, -- set when they complete signup
  user_id UUID DEFAULT NULL REFERENCES auth.users(id) ON DELETE SET NULL -- linked after conversion
);

-- Unique constraint on email to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_unique ON public.leads (email);

-- Index for querying unconverted leads
CREATE INDEX IF NOT EXISTS leads_unconverted ON public.leads (converted_at) WHERE converted_at IS NULL;

-- Allow insert from anonymous users (no auth required)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a lead (public endpoint)
CREATE POLICY "Anyone can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Only service role can read/update leads (for admin/follow-up)
CREATE POLICY "Service role can manage leads" ON public.leads
  FOR ALL USING (auth.role() = 'service_role');

COMMENT ON TABLE public.leads IS 'Captures emails from onboarding Step 1 for lead follow-up';
COMMENT ON COLUMN public.leads.converted_at IS 'Set when user completes signup, NULL means unconverted lead';
