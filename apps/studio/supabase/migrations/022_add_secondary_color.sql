-- Add secondary_color to organizations for brand customization
alter table public.organizations add column if not exists secondary_color text default '#06B6D4';
