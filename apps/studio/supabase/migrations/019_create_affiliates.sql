-- Affiliate System Tables
-- Supports: applications, approved affiliates, referral tracking, earnings

-- 1. Affiliate Applications (people who apply to become affiliates)
CREATE TABLE IF NOT EXISTS affiliate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  instagram_handle TEXT,
  instagram_followers INTEGER,
  tiktok_handle TEXT,
  tiktok_followers INTEGER,
  website TEXT,
  audience_description TEXT,
  why_partner TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_affiliate_applications_status ON affiliate_applications(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_applications_email ON affiliate_applications(email);

-- 2. Approved Affiliates (active partners with referral codes)
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES affiliate_applications(id),
  user_id UUID REFERENCES auth.users(id), -- Optional: if they have a Slydes account
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  commission_rate DECIMAL(5,2) DEFAULT 25.00, -- 25% default
  instagram_handle TEXT,
  tiktok_handle TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'terminated')),
  total_earnings DECIMAL(10,2) DEFAULT 0,
  pending_earnings DECIMAL(10,2) DEFAULT 0,
  paid_earnings DECIMAL(10,2) DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  payout_email TEXT, -- PayPal or payment email
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for referral code lookups (used on every signup)
CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates(email);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);

-- 3. Referral Tracking (who referred whom)
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id),
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id),
  referred_org_id UUID REFERENCES organizations(id),
  status TEXT DEFAULT 'clicked' CHECK (status IN ('clicked', 'signed_up', 'converted', 'churned')),
  -- clicked = visited with referral code
  -- signed_up = created account
  -- converted = became paying customer
  -- churned = cancelled subscription
  conversion_value DECIMAL(10,2), -- Amount of the conversion (subscription value)
  commission_amount DECIMAL(10,2), -- Calculated commission
  commission_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  landing_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for referral lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate ON affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_status ON affiliate_referrals(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred_email ON affiliate_referrals(referred_email);

-- 4. Affiliate Payouts (payment history)
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payout_method TEXT DEFAULT 'paypal', -- paypal, bank_transfer, etc.
  payout_email TEXT,
  transaction_id TEXT, -- External payment reference
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate ON affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_status ON affiliate_payouts(status);

-- RLS Policies
ALTER TABLE affiliate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for applications
CREATE POLICY "Allow public affiliate applications" ON affiliate_applications
  FOR INSERT TO anon WITH CHECK (true);

-- Service role has full access to all tables
CREATE POLICY "Service role full access to applications" ON affiliate_applications
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to affiliates" ON affiliates
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to referrals" ON affiliate_referrals
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to payouts" ON affiliate_payouts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Affiliates can view their own data
CREATE POLICY "Affiliates can view own data" ON affiliates
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Affiliates can view own referrals" ON affiliate_referrals
  FOR SELECT TO authenticated
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Affiliates can view own payouts" ON affiliate_payouts
  FOR SELECT TO authenticated
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code(name_input TEXT)
RETURNS TEXT AS $$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base code from name (first 6 chars, uppercase, alphanumeric only)
  base_code := UPPER(REGEXP_REPLACE(LEFT(name_input, 6), '[^A-Z0-9]', '', 'g'));

  -- If too short, pad with random chars
  IF LENGTH(base_code) < 4 THEN
    base_code := base_code || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR (4 - LENGTH(base_code)));
  END IF;

  -- Try base code first
  final_code := base_code;

  -- Add numbers if code exists
  WHILE EXISTS (SELECT 1 FROM affiliates WHERE referral_code = final_code) LOOP
    counter := counter + 1;
    final_code := base_code || counter::TEXT;
  END LOOP;

  RETURN final_code;
END;
$$ LANGUAGE plpgsql;
