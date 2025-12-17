-- Add username column to profiles for slydes.io/username URLs
-- Username must be unique, URL-safe, and lowercase

-- Add the username column
alter table public.profiles add column username text;

-- Add unique constraint
alter table public.profiles add constraint profiles_username_unique unique (username);

-- Add check constraint for URL-safe usernames (lowercase, alphanumeric, hyphens, underscores)
alter table public.profiles add constraint profiles_username_format
  check (username ~ '^[a-z0-9][a-z0-9_-]*[a-z0-9]$' or username ~ '^[a-z0-9]$');

-- Create index for faster username lookups
create index profiles_username_idx on public.profiles (username);

-- Function to check if username is available
create or replace function public.is_username_available(check_username text)
returns boolean as $$
begin
  return not exists (
    select 1 from public.profiles where lower(username) = lower(check_username)
  );
end;
$$ language plpgsql security definer;
