-- Add per-frame media fields (MVP)
-- Each frame can have its own background video (or image later).
-- We store Cloudflare Stream asset UID (not a raw URL).

alter table public.frames
  add column if not exists video_stream_uid text,
  add column if not exists video_poster_url text,
  add column if not exists media_type text check (media_type in ('video', 'image')),
  add column if not exists image_url text;

create index if not exists frames_video_uid_idx
  on public.frames (video_stream_uid);


