-- Add social media follower tracking to organizations
-- This allows us to track Instagram and TikTok followers for affiliate targeting

alter table public.organizations
  add column if not exists instagram_handle text,
  add column if not exists instagram_followers integer,
  add column if not exists instagram_updated_at timestamp with time zone,
  add column if not exists tiktok_handle text,
  add column if not exists tiktok_followers integer,
  add column if not exists tiktok_updated_at timestamp with time zone;

-- Index for sorting by follower count (affiliate targeting)
create index if not exists idx_organizations_instagram_followers on public.organizations(instagram_followers desc nulls last);
create index if not exists idx_organizations_tiktok_followers on public.organizations(tiktok_followers desc nulls last);

comment on column public.organizations.instagram_handle is 'Instagram username without @ symbol';
comment on column public.organizations.instagram_followers is 'Number of Instagram followers (auto-fetched)';
comment on column public.organizations.instagram_updated_at is 'When the Instagram follower count was last fetched';
comment on column public.organizations.tiktok_handle is 'TikTok username without @ symbol';
comment on column public.organizations.tiktok_followers is 'Number of TikTok followers (auto-fetched)';
comment on column public.organizations.tiktok_updated_at is 'When the TikTok follower count was last fetched';
