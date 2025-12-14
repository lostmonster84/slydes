-- Create organizations table
-- Each organization has a unique subdomain (wildtrax.slydes.io)

create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users on delete cascade not null,
  name text not null,
  slug text not null unique, -- subdomain: wildtrax.slydes.io
  website text,
  business_type text check (business_type in (
    'rentals',
    'tours',
    'accommodation',
    'restaurant',
    'retail',
    'fitness',
    'salon',
    'events',
    'real_estate',
    'automotive',
    'other'
  )),
  logo_url text,
  primary_color text default '#2563EB',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.organizations enable row level security;

-- Organization members table (for team access later)
create table public.organization_members (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

alter table public.organization_members enable row level security;

-- Add current_organization_id to profiles
alter table public.profiles add column current_organization_id uuid references public.organizations on delete set null;

-- RLS Policies for organizations
create policy "Users can view organizations they belong to"
  on public.organizations for select
  using (
    owner_id = auth.uid() or
    id in (select organization_id from public.organization_members where user_id = auth.uid())
  );

create policy "Owners can update their organizations"
  on public.organizations for update
  using (owner_id = auth.uid());

create policy "Authenticated users can create organizations"
  on public.organizations for insert
  with check (auth.uid() = owner_id);

create policy "Owners can delete their organizations"
  on public.organizations for delete
  using (owner_id = auth.uid());

-- RLS Policies for organization_members
create policy "Members can view their organization memberships"
  on public.organization_members for select
  using (user_id = auth.uid() or organization_id in (
    select id from public.organizations where owner_id = auth.uid()
  ));

create policy "Owners can manage members"
  on public.organization_members for all
  using (organization_id in (
    select id from public.organizations where owner_id = auth.uid()
  ));

-- Function to create org membership when org is created
create or replace function public.handle_new_organization()
returns trigger as $$
begin
  -- Add owner as member with owner role
  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.owner_id, 'owner');

  -- Set as current org for user
  update public.profiles set current_organization_id = new.id where id = new.owner_id;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_organization_created
  after insert on public.organizations
  for each row execute procedure public.handle_new_organization();

-- Indexes for performance
create index organizations_owner_id_idx on public.organizations (owner_id);
create index organizations_slug_idx on public.organizations (slug);
create index organization_members_user_id_idx on public.organization_members (user_id);
create index organization_members_org_id_idx on public.organization_members (organization_id);

-- Function to check slug availability
create or replace function public.is_slug_available(check_slug text)
returns boolean as $$
begin
  return not exists (select 1 from public.organizations where slug = lower(check_slug));
end;
$$ language plpgsql security definer;
