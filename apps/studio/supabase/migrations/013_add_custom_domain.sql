-- Add custom domain support to organizations
-- Allows customers to connect m.theirdomain.com via CNAME

alter table public.organizations add column if not exists custom_domain text unique;
alter table public.organizations add column if not exists custom_domain_verified boolean default false;
alter table public.organizations add column if not exists custom_domain_verified_at timestamp with time zone;

-- Index for domain lookups (used by viewer to resolve org from custom domain)
create index if not exists organizations_custom_domain_idx on public.organizations (custom_domain) where custom_domain is not null;

comment on column public.organizations.custom_domain is 'Customer mobile subdomain e.g. m.wildtrax.co.uk';
comment on column public.organizations.custom_domain_verified is 'Whether DNS CNAME is verified pointing to cname.slydes.io';
comment on column public.organizations.custom_domain_verified_at is 'When domain was last verified';
