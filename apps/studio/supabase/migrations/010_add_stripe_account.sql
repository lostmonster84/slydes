-- Add Stripe Connect account ID to organizations
-- This stores the connected Stripe account for receiving payments

alter table public.organizations
add column stripe_account_id text;

-- Index for lookups when processing payments
create index organizations_stripe_account_id_idx
on public.organizations (stripe_account_id)
where stripe_account_id is not null;

-- Comment for documentation
comment on column public.organizations.stripe_account_id is
'Stripe Connect account ID (acct_xxx) for receiving payments via Slydes Commerce';
