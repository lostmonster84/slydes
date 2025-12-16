-- Create orders table to store Stripe checkout sessions
-- Orders are created when checkout.session.completed webhook fires

create table public.orders (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,

  -- Stripe IDs
  stripe_checkout_session_id text unique not null,
  stripe_payment_intent_id text,

  -- Customer info (from Stripe)
  customer_email text,
  customer_name text,

  -- Order details
  line_items jsonb not null default '[]'::jsonb,
  -- Format: [{ id, title, subtitle, price, price_cents, quantity }]

  -- Financials (all in cents)
  subtotal_cents integer not null,
  platform_fee_cents integer not null,
  seller_payout_cents integer not null,
  currency text default 'gbp',

  -- Status
  status text default 'paid' check (status in ('paid', 'fulfilled', 'refunded', 'cancelled')),
  fulfilled_at timestamptz,

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.orders enable row level security;

-- Indexes
create index orders_organization_id_idx on public.orders(organization_id);
create index orders_stripe_checkout_session_id_idx on public.orders(stripe_checkout_session_id);
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);

-- RLS Policies
-- Sellers can view their own orders
create policy "Sellers can view their orders"
  on public.orders for select
  using (
    organization_id in (
      select id from public.organizations where owner_id = auth.uid()
    )
  );

-- Sellers can update fulfillment status
create policy "Sellers can update order status"
  on public.orders for update
  using (
    organization_id in (
      select id from public.organizations where owner_id = auth.uid()
    )
  )
  with check (
    organization_id in (
      select id from public.organizations where owner_id = auth.uid()
    )
  );

-- Service role can insert (webhook)
-- Note: Webhook uses service role key, bypasses RLS

-- Function to update updated_at
create or replace function public.handle_order_updated()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_order_updated
  before update on public.orders
  for each row execute procedure public.handle_order_updated();

-- Comments
comment on table public.orders is 'Orders from Stripe Checkout - created by webhook';
comment on column public.orders.line_items is 'JSONB array of items: [{id, title, subtitle, price, price_cents, quantity}]';
comment on column public.orders.platform_fee_cents is 'Platform fee in cents (currently 0% - Slydes takes no commission)';
comment on column public.orders.seller_payout_cents is 'Amount seller receives after platform fee';
