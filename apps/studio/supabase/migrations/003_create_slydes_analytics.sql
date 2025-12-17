-- Slydes + Analytics schema (MVP)
-- Purpose:
-- - Stable IDs for Profile → Slyde → Frame
-- - Append-only analytics events (behaviour-based)
-- - Rollups for fast HQ Analytics queries
--
-- Aligned with:
-- - docs/HQ-DASHBOARD-ANALYTICS-SPEC.md (event vocabulary + allowed metrics)
-- - docs/STRUCTURE.md (Profile → Slyde → Frame)

-- Helper: is the current user a member of an organization?
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organizations o
    where o.id = org_id
      and (
        o.owner_id = auth.uid()
        or exists (
          select 1
          from public.organization_members m
          where m.organization_id = org_id
            and m.user_id = auth.uid()
        )
      )
  );
$$;

-- =========================================
-- Core content tables
-- =========================================

create table if not exists public.slydes (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations on delete cascade not null,
  -- Stable public identifier used in URLs and analytics payloads (e.g. "camping", or a slug/shortid)
  public_id text not null,
  title text not null,
  description text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (organization_id, public_id)
);

create index if not exists slydes_org_idx on public.slydes (organization_id);
create index if not exists slydes_org_published_idx on public.slydes (organization_id, published);

alter table public.slydes enable row level security;

create policy "Org members can read slydes"
  on public.slydes for select
  using (public.is_org_member(organization_id));

create policy "Org members can manage slydes"
  on public.slydes for all
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create table if not exists public.frames (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations on delete cascade not null,
  slyde_id uuid references public.slydes on delete cascade not null,
  -- Stable public identifier within a slyde (can be numeric "1", "2"...). Do NOT rely on index for identity.
  public_id text not null,
  frame_index int not null check (frame_index >= 1),
  template_type text,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (slyde_id, public_id)
);

create index if not exists frames_slyde_idx on public.frames (slyde_id);
create index if not exists frames_org_slyde_idx on public.frames (organization_id, slyde_id);

alter table public.frames enable row level security;

create policy "Org members can read frames"
  on public.frames for select
  using (public.is_org_member(organization_id));

create policy "Org members can manage frames"
  on public.frames for all
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

-- =========================================
-- Analytics events (append-only)
-- =========================================

do $$ begin
  create type public.analytics_event_type as enum (
    'sessionStart',
    'frameView',
    'ctaClick',
    'shareClick',
    'heartTap',
    'faqOpen'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations on delete cascade not null,
  slyde_id uuid references public.slydes on delete cascade not null,
  frame_id uuid references public.frames on delete set null,
  event_type public.analytics_event_type not null,
  session_id uuid not null,
  occurred_at timestamp with time zone default timezone('utc'::text, now()) not null,
  source text,
  referrer text,
  meta jsonb default '{}'::jsonb not null
);

create index if not exists analytics_events_org_time_idx on public.analytics_events (organization_id, occurred_at desc);
create index if not exists analytics_events_org_slyde_time_idx on public.analytics_events (organization_id, slyde_id, occurred_at desc);
create index if not exists analytics_events_org_slyde_frame_time_idx on public.analytics_events (organization_id, slyde_id, frame_id, occurred_at desc);
create index if not exists analytics_events_type_time_idx on public.analytics_events (event_type, occurred_at desc);

alter table public.analytics_events enable row level security;

create policy "Org members can read analytics events"
  on public.analytics_events for select
  using (public.is_org_member(organization_id));

-- Important: analytics inserts should be done via service role (Edge Function / server route).
-- Keep direct client inserts disabled under RLS.
create policy "No direct inserts into analytics events"
  on public.analytics_events for insert
  with check (false);

create policy "No direct updates to analytics events"
  on public.analytics_events for update
  using (false);

create policy "No direct deletes from analytics events"
  on public.analytics_events for delete
  using (false);

-- =========================================
-- Rollups (daily) for fast HQ queries
-- =========================================

create table if not exists public.analytics_slyde_daily (
  organization_id uuid references public.organizations on delete cascade not null,
  slyde_id uuid references public.slydes on delete cascade not null,
  day date not null,
  starts int default 0 not null,
  completions int default 0 not null,
  cta_clicks int default 0 not null,
  shares int default 0 not null,
  heart_taps int default 0 not null,
  faq_opens int default 0 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (organization_id, slyde_id, day)
);

alter table public.analytics_slyde_daily enable row level security;
create policy "Org members can read slyde rollups"
  on public.analytics_slyde_daily for select
  using (public.is_org_member(organization_id));

create policy "No direct writes to slyde rollups"
  on public.analytics_slyde_daily for all
  using (false)
  with check (false);

create table if not exists public.analytics_frame_daily (
  organization_id uuid references public.organizations on delete cascade not null,
  slyde_id uuid references public.slydes on delete cascade not null,
  frame_id uuid references public.frames on delete cascade not null,
  day date not null,
  frame_views int default 0 not null,
  cta_clicks int default 0 not null,
  shares int default 0 not null,
  heart_taps int default 0 not null,
  faq_opens int default 0 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (organization_id, slyde_id, frame_id, day)
);

alter table public.analytics_frame_daily enable row level security;
create policy "Org members can read frame rollups"
  on public.analytics_frame_daily for select
  using (public.is_org_member(organization_id));

create policy "No direct writes to frame rollups"
  on public.analytics_frame_daily for all
  using (false)
  with check (false);

-- Rollup function (day-level upsert). Intended to be called by a scheduled job.
create or replace function public.rollup_analytics_day(target_day date)
returns void
language plpgsql
security definer
as $$
declare
  start_ts timestamptz;
  end_ts timestamptz;
begin
  start_ts := target_day::timestamptz;
  end_ts := (target_day + 1)::timestamptz;

  -- Slyde daily
  insert into public.analytics_slyde_daily (organization_id, slyde_id, day, starts, completions, cta_clicks, shares, heart_taps, faq_opens, updated_at)
  select
    e.organization_id,
    e.slyde_id,
    target_day as day,
    count(*) filter (where e.event_type = 'sessionStart') as starts,
    -- completion approximation: sessions that view the last frame (computed at query-time later; keep 0 for now)
    0 as completions,
    count(*) filter (where e.event_type = 'ctaClick') as cta_clicks,
    count(*) filter (where e.event_type = 'shareClick') as shares,
    count(*) filter (where e.event_type = 'heartTap') as heart_taps,
    count(*) filter (where e.event_type = 'faqOpen') as faq_opens,
    timezone('utc'::text, now()) as updated_at
  from public.analytics_events e
  where e.occurred_at >= start_ts and e.occurred_at < end_ts
  group by e.organization_id, e.slyde_id
  on conflict (organization_id, slyde_id, day) do update
    set starts = excluded.starts,
        completions = excluded.completions,
        cta_clicks = excluded.cta_clicks,
        shares = excluded.shares,
        heart_taps = excluded.heart_taps,
        faq_opens = excluded.faq_opens,
        updated_at = excluded.updated_at;

  -- Frame daily
  insert into public.analytics_frame_daily (organization_id, slyde_id, frame_id, day, frame_views, cta_clicks, shares, heart_taps, faq_opens, updated_at)
  select
    e.organization_id,
    e.slyde_id,
    e.frame_id,
    target_day as day,
    count(*) filter (where e.event_type = 'frameView') as frame_views,
    count(*) filter (where e.event_type = 'ctaClick') as cta_clicks,
    count(*) filter (where e.event_type = 'shareClick') as shares,
    count(*) filter (where e.event_type = 'heartTap') as heart_taps,
    count(*) filter (where e.event_type = 'faqOpen') as faq_opens,
    timezone('utc'::text, now()) as updated_at
  from public.analytics_events e
  where e.occurred_at >= start_ts and e.occurred_at < end_ts
    and e.frame_id is not null
  group by e.organization_id, e.slyde_id, e.frame_id
  on conflict (organization_id, slyde_id, frame_id, day) do update
    set frame_views = excluded.frame_views,
        cta_clicks = excluded.cta_clicks,
        shares = excluded.shares,
        heart_taps = excluded.heart_taps,
        faq_opens = excluded.faq_opens,
        updated_at = excluded.updated_at;
end;
$$;




