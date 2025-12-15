-- Add Home Slyde video fields to organizations (MVP)
-- We store Cloudflare Stream asset UID (not a raw URL).

alter table public.organizations
  add column if not exists home_video_stream_uid text,
  add column if not exists home_video_poster_url text;

create index if not exists organizations_home_video_uid_idx
  on public.organizations (home_video_stream_uid);


