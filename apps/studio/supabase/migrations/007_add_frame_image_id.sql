-- Store Cloudflare Images ids on frames (so we can serve resized variants reliably)

alter table public.frames
  add column if not exists image_id text,
  add column if not exists image_variant text default 'hero';

create index if not exists frames_image_id_idx
  on public.frames (image_id);


