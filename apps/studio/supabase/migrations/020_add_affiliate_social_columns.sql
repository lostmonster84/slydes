-- Add additional social profile columns to affiliate_applications
-- Supports: YouTube, Twitter/X, and business name

-- Add youtube_handle column
ALTER TABLE affiliate_applications
ADD COLUMN IF NOT EXISTS youtube_handle TEXT;

-- Add twitter_handle column
ALTER TABLE affiliate_applications
ADD COLUMN IF NOT EXISTS twitter_handle TEXT;

-- Add business_name column (separate from applicant name)
ALTER TABLE affiliate_applications
ADD COLUMN IF NOT EXISTS business_name TEXT;

-- Also add to affiliates table for approved affiliates
ALTER TABLE affiliates
ADD COLUMN IF NOT EXISTS youtube_handle TEXT;

ALTER TABLE affiliates
ADD COLUMN IF NOT EXISTS twitter_handle TEXT;

-- Create indexes for handle lookups (useful for duplicate checking)
CREATE INDEX IF NOT EXISTS idx_affiliate_applications_youtube ON affiliate_applications(youtube_handle) WHERE youtube_handle IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_affiliate_applications_twitter ON affiliate_applications(twitter_handle) WHERE twitter_handle IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_affiliates_youtube ON affiliates(youtube_handle) WHERE youtube_handle IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_affiliates_twitter ON affiliates(twitter_handle) WHERE twitter_handle IS NOT NULL;
