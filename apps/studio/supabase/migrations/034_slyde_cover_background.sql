-- Slyde Cover Background
-- Each Slyde has its own "cover" screen before frames
-- This adds background fields for the cover (separate from frame backgrounds)

-- =========================================
-- 1. Cover Background Type
-- =========================================

ALTER TABLE public.slydes
  ADD COLUMN IF NOT EXISTS cover_background_type TEXT DEFAULT 'video'
    CHECK (cover_background_type IN ('video', 'image'));

-- =========================================
-- 2. Cover Video Fields
-- =========================================

ALTER TABLE public.slydes
  ADD COLUMN IF NOT EXISTS cover_video_stream_uid TEXT,
  ADD COLUMN IF NOT EXISTS cover_poster_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_video_filter TEXT DEFAULT 'original',
  ADD COLUMN IF NOT EXISTS cover_video_vignette BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cover_video_speed TEXT DEFAULT 'normal';

-- =========================================
-- 3. Cover Image Field
-- =========================================

ALTER TABLE public.slydes
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- =========================================
-- 4. Drop social_stack_config
-- =========================================
-- No longer needed - visibility is content-driven:
-- "Add content → button appears. No content → hidden."

ALTER TABLE public.slydes
  DROP COLUMN IF EXISTS social_stack_config;

-- =========================================
-- 5. Comments
-- =========================================

COMMENT ON COLUMN public.slydes.cover_background_type IS 'Cover screen background type: video or image';
COMMENT ON COLUMN public.slydes.cover_video_stream_uid IS 'Cloudflare Stream UID for cover video';
COMMENT ON COLUMN public.slydes.cover_poster_url IS 'Poster image URL for cover video';
COMMENT ON COLUMN public.slydes.cover_video_filter IS 'Video filter preset for cover';
COMMENT ON COLUMN public.slydes.cover_video_vignette IS 'Enable vignette effect on cover video';
COMMENT ON COLUMN public.slydes.cover_video_speed IS 'Playback speed for cover video';
COMMENT ON COLUMN public.slydes.cover_image_url IS 'Image URL for cover (when type is image)';
