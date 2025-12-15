-- Track Cloudflare Stream processing state for frame videos
-- This lets the UI show "Processing…" until videos are ready.

alter table public.frames
  add column if not exists video_status text check (video_status in ('processing', 'ready', 'failed')),
  add column if not exists video_status_updated_at timestamptz;

create index if not exists frames_video_status_idx
  on public.frames (video_status);


