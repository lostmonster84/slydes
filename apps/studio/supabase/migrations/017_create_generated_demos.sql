-- Generated Demos Storage
-- Stores AI-generated demo Slydes for sales outreach
-- Dev-only feature for creating personalized demos from business URLs

create table if not exists public.generated_demos (
  id uuid primary key default gen_random_uuid(),

  -- Source info
  source_url text not null,

  -- Business identity (extracted)
  business_name text not null,
  business_tagline text,
  business_location text,
  business_industry text,

  -- Generated content (JSON blobs)
  scraped_data jsonb not null,           -- Raw ScrapedBusiness data
  generated_content jsonb not null,      -- Full GeneratedDemo structure

  -- Quality metrics
  quality text check (quality in ('high', 'medium', 'low')) default 'medium',
  quality_notes text[],

  -- Stats
  images_count integer default 0,
  videos_count integer default 0,
  categories_count integer default 0,
  frames_count integer default 0,

  -- Status
  status text check (status in ('draft', 'ready', 'sent', 'converted')) default 'draft',

  -- Outreach tracking
  sent_to text,                          -- Who it was sent to
  sent_at timestamp with time zone,
  notes text,                            -- Personal notes about this prospect

  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index for listing demos
create index if not exists idx_generated_demos_created_at on public.generated_demos(created_at desc);
create index if not exists idx_generated_demos_status on public.generated_demos(status);
create index if not exists idx_generated_demos_business_name on public.generated_demos(business_name);

-- RLS: For now, no RLS since this is dev-only
-- In production, you'd want to tie this to a user/organization

comment on table public.generated_demos is 'AI-generated demo Slydes for sales outreach';
comment on column public.generated_demos.source_url is 'The business website URL that was scraped';
comment on column public.generated_demos.scraped_data is 'Raw scraped business data (ScrapedBusiness JSON)';
comment on column public.generated_demos.generated_content is 'Full generated demo structure (GeneratedDemo JSON)';
comment on column public.generated_demos.status is 'draft=just created, ready=reviewed, sent=shared with prospect, converted=they signed up';
