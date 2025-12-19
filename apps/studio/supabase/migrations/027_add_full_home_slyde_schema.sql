-- Full Home Slyde Schema
-- Migrate from localStorage (useDemoHomeSlyde) to Supabase
-- This adds all missing columns to support the full editor experience

-- =========================================
-- 1. Organization Home Settings
-- =========================================

-- Background type (video or image)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS home_background_type text DEFAULT 'video'
    CHECK (home_background_type IN ('video', 'image'));

-- Image background (when not using video)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS home_image_src text,
  ADD COLUMN IF NOT EXISTS home_image_id text;

-- Video effects
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS home_video_filter text DEFAULT 'original'
    CHECK (home_video_filter IN ('original', 'cinematic', 'vintage', 'moody', 'warm', 'cool')),
  ADD COLUMN IF NOT EXISTS home_video_vignette boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS home_video_speed text DEFAULT 'normal'
    CHECK (home_video_speed IN ('normal', 'slow', 'slower', 'cinematic')),
  ADD COLUMN IF NOT EXISTS home_video_start_time integer DEFAULT 0;

-- UI Display Settings
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS home_show_category_icons boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS home_show_hearts boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS home_show_share boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS home_show_sound boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS home_show_reviews boolean DEFAULT true;

-- Primary CTA (Call-to-Action)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS home_primary_cta_text text,
  ADD COLUMN IF NOT EXISTS home_primary_cta_action text;

-- Social Links (JSONB for flexibility)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS home_social_links jsonb DEFAULT '{}'::jsonb;

-- Home-level FAQs (JSONB array)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS home_faqs jsonb DEFAULT '[]'::jsonb;

-- FAQ Inbox - unanswered questions (JSONB array)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS home_faq_inbox jsonb DEFAULT '[]'::jsonb;

-- =========================================
-- 2. Slyde (Category) Metadata
-- =========================================

-- Add metadata columns to slydes table for categories
ALTER TABLE public.slydes
  ADD COLUMN IF NOT EXISTS icon text DEFAULT '✨',
  ADD COLUMN IF NOT EXISTS order_index integer,
  ADD COLUMN IF NOT EXISTS has_inventory boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS inventory_cta_text text;

CREATE INDEX IF NOT EXISTS slydes_order_idx ON public.slydes (organization_id, order_index);

-- =========================================
-- 3. Frame Content
-- =========================================

-- Frame content fields (title, subtitle, CTA data)
ALTER TABLE public.frames
  ADD COLUMN IF NOT EXISTS subtitle text,
  ADD COLUMN IF NOT EXISTS cta_text text,
  ADD COLUMN IF NOT EXISTS cta_action text,
  ADD COLUMN IF NOT EXISTS cta_icon text,
  ADD COLUMN IF NOT EXISTS cta_type text DEFAULT 'link'
    CHECK (cta_type IN ('link', 'phone', 'email', 'list', 'call', 'message', 'book', 'shop', 'menu', 'instagram', 'tiktok', 'youtube', 'facebook', 'twitter', 'whatsapp', 'website')),
  ADD COLUMN IF NOT EXISTS accent_color text,
  ADD COLUMN IF NOT EXISTS demo_video_url text;

-- Background settings for frames
ALTER TABLE public.frames
  ADD COLUMN IF NOT EXISTS background_type text DEFAULT 'video'
    CHECK (background_type IN ('video', 'image', 'gradient', 'color')),
  ADD COLUMN IF NOT EXISTS background_gradient text,
  ADD COLUMN IF NOT EXISTS background_color text,
  ADD COLUMN IF NOT EXISTS video_filter text DEFAULT 'original'
    CHECK (video_filter IN ('original', 'cinematic', 'vintage', 'moody', 'warm', 'cool')),
  ADD COLUMN IF NOT EXISTS video_vignette boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS video_speed text DEFAULT 'normal'
    CHECK (video_speed IN ('normal', 'slow', 'slower', 'cinematic'));

-- =========================================
-- 4. FAQs Table (per-slyde)
-- =========================================

CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
  slyde_id uuid REFERENCES public.slydes ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  published boolean DEFAULT true,
  faq_type text DEFAULT 'child' CHECK (faq_type IN ('home', 'child')),
  faq_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS faqs_org_slyde_idx ON public.faqs (organization_id, slyde_id);
CREATE INDEX IF NOT EXISTS faqs_published_idx ON public.faqs (published);
CREATE INDEX IF NOT EXISTS faqs_type_idx ON public.faqs (faq_type);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can read FAQs"
  ON public.faqs FOR SELECT
  USING (public.is_org_member(organization_id));

CREATE POLICY "Org members can manage FAQs"
  ON public.faqs FOR ALL
  USING (public.is_org_member(organization_id))
  WITH CHECK (public.is_org_member(organization_id));

-- =========================================
-- 5. Lists Table
-- =========================================

CREATE TABLE IF NOT EXISTS public.lists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  list_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS lists_org_idx ON public.lists (organization_id);

ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can read lists"
  ON public.lists FOR SELECT
  USING (public.is_org_member(organization_id));

CREATE POLICY "Org members can manage lists"
  ON public.lists FOR ALL
  USING (public.is_org_member(organization_id))
  WITH CHECK (public.is_org_member(organization_id));

-- =========================================
-- 6. List Items Table
-- =========================================

CREATE TABLE IF NOT EXISTS public.list_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id uuid REFERENCES public.lists ON DELETE CASCADE NOT NULL,
  organization_id uuid REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  subtitle text,
  image_url text,
  price text,
  badge text,
  item_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS list_items_list_idx ON public.list_items (list_id);
CREATE INDEX IF NOT EXISTS list_items_org_idx ON public.list_items (organization_id);

ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can read list items"
  ON public.list_items FOR SELECT
  USING (public.is_org_member(organization_id));

CREATE POLICY "Org members can manage list items"
  ON public.list_items FOR ALL
  USING (public.is_org_member(organization_id))
  WITH CHECK (public.is_org_member(organization_id));

-- =========================================
-- 7. Link frames to list items (optional deep-dive)
-- =========================================

ALTER TABLE public.frames
  ADD COLUMN IF NOT EXISTS list_id uuid REFERENCES public.lists ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS list_item_id uuid REFERENCES public.list_items ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS frames_list_item_idx ON public.frames (list_item_id);

-- =========================================
-- Comments for documentation
-- =========================================

COMMENT ON COLUMN public.organizations.home_background_type IS 'Type of background: video or image';
COMMENT ON COLUMN public.organizations.home_video_filter IS 'Video filter preset: original, cinematic, vintage, moody, warm, cool';
COMMENT ON COLUMN public.organizations.home_social_links IS 'JSON object with social platform URLs';
COMMENT ON COLUMN public.organizations.home_faqs IS 'JSON array of home-level FAQ items';
COMMENT ON COLUMN public.organizations.home_faq_inbox IS 'JSON array of unanswered customer questions';

COMMENT ON COLUMN public.slydes.icon IS 'Emoji icon for the category/slyde';
COMMENT ON COLUMN public.slydes.order_index IS 'Order of slyde in the navigation';
COMMENT ON COLUMN public.slydes.has_inventory IS 'Whether this slyde has an inventory/list attached';

COMMENT ON COLUMN public.frames.cta_type IS 'Type of CTA button action';
COMMENT ON COLUMN public.frames.demo_video_url IS 'URL for optional demo video overlay';
