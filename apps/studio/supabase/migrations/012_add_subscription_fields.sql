-- Migration: Add subscription fields to profiles
-- Supports Stripe subscription tracking for billing

-- Add Stripe subscription fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT CHECK (subscription_status IN ('active', 'cancelled', 'past_due'));

-- Update plan column to use new tier values (free/creator/pro)
-- First, migrate any 'enterprise' values to 'pro'
UPDATE profiles SET plan = 'pro' WHERE plan = 'enterprise';

-- Update the check constraint for plan values
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'creator', 'pro'));

-- Create index for looking up users by Stripe customer ID
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Create index for looking up users by subscription ID (used in webhooks)
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);

COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe Customer ID for billing';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Active Stripe Subscription ID';
COMMENT ON COLUMN profiles.subscription_status IS 'Subscription status: active, cancelled, or past_due';
