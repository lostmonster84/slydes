-- Site visits tracking for marketing website (slydes.io)
-- Simple, privacy-friendly visitor tracking

create table if not exists public.site_visits (
  id uuid default gen_random_uuid() primary key,
  -- Hashed fingerprint (IP + UA hash, no PII stored)
  visitor_hash text not null,
  -- Page path (e.g., '/', '/pricing', '/showcase')
  page text not null,
  -- Referrer if available
  referrer text,
  -- Country code from IP (e.g., 'GB', 'US')
  country text,
  -- Timestamp
  visited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for common queries
create index if not exists site_visits_visited_at_idx on public.site_visits (visited_at desc);
create index if not exists site_visits_page_idx on public.site_visits (page, visited_at desc);
create index if not exists site_visits_visitor_hash_idx on public.site_visits (visitor_hash);

-- No RLS needed - this table is only accessed via service role from API routes
-- Keep it simple, no user auth required
