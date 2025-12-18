-- Add brand customization fields to organizations
-- Font options: space-grotesk, inter, dm-sans, plus-jakarta, outfit
alter table public.organizations add column if not exists brand_font text default 'space-grotesk';

-- Voice preset options: professional, friendly, bold, minimal
alter table public.organizations add column if not exists brand_voice text default 'bold';
