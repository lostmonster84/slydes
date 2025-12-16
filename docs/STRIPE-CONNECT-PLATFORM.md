# Slydes Stripe Connect Platform

> **Last Updated**: December 16, 2025
> **Status**: Active
> **Type**: Platform Implementation Guide

---

## Overview

Slydes uses **Stripe Connect** as a platform to enable our customers (sellers) to accept payments from their customers (buyers). We are not selling products ourselves - we facilitate commerce between businesses and their audiences.

### What This Means

| Role | Who | What They Do |
|------|-----|--------------|
| **Platform** | Slydes | Provides the infrastructure, takes 5% platform fee |
| **Connected Account** | Our customers (Pro tier) | Businesses selling products/services via their Slydes |
| **End Customer** | Their customers | People buying from businesses on Slydes |

---

## Two Distinct Payment Flows

### Flow 1: Platform Billing (B2B)

**What**: Slydes customers paying US for subscriptions

```
Customer → Upgrade to Creator/Pro → Stripe Checkout → Payment to Slydes
```

- **Endpoint**: `/api/billing/create-checkout`
- **Account Type**: Standard Stripe (our platform account)
- **Revenue**: Subscription fees (£25/mo Creator, £50/mo Pro)

### Flow 2: Stripe Connect (B2C)

**What**: End customers paying OUR customers for products/services

```
Buyer → Checkout on Seller's Slyde → Stripe Connect → Payment to Seller (minus 5%)
```

- **Endpoint**: `/api/stripe/checkout`
- **Account Type**: Stripe Connect Express
- **Revenue**: 5% platform fee on every transaction

---

## Stripe Connect Architecture

### Account Type: Express

We use **Express accounts** because:
- Stripe handles all KYC/verification
- Sellers get Stripe-hosted dashboard
- Minimal integration complexity
- Works in 40+ countries

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        SLYDES PLATFORM                          │
│                    (Platform Account)                           │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Seller A   │    │   Seller B   │    │   Seller C   │      │
│  │  (Express)   │    │  (Express)   │    │  (Express)   │      │
│  │  acct_xxx    │    │  acct_yyy    │    │  acct_zzz    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              STRIPE CONNECT PAYMENTS                 │      │
│  │                                                      │      │
│  │  • Buyer pays £100                                   │      │
│  │  • Stripe processes payment                          │      │
│  │  • Platform fee (5%): £5 → Slydes                   │      │
│  │  • Seller receives: £95                              │      │
│  │  • Stripe fees: Paid by seller from their £95       │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

### Required for Stripe Connect

| Variable | Location | Purpose |
|----------|----------|---------|
| `STRIPE_SECRET_KEY` | Server only | API calls to Stripe |
| `STRIPE_WEBHOOK_SECRET` | Server only | Verify webhook signatures |

### Optional (for client-side UI)

| Variable | Location | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client | Stripe.js elements (card inputs, etc.) |

### NOT Needed for Connect

Price IDs (`NEXT_PUBLIC_STRIPE_*_PRICE_ID`) are for **platform subscriptions**, not Connect.

---

## Implementation Reference

### 1. Connect Account Setup

**File**: `apps/studio/src/app/api/stripe/connect/route.ts`

**POST** - Create/onboard a seller:
```typescript
// Creates Express account with capabilities
const account = await stripe.accounts.create({
  type: 'express',
  country: 'GB',
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
  business_type: 'individual',
  metadata: {
    organization_id: organizationId,
    user_id: user.id,
  },
})

// Generate onboarding link
const accountLink = await stripe.accountLinks.create({
  account: stripeAccountId,
  refresh_url: `${APP_URL}/settings/payments`,
  return_url: `${APP_URL}/settings/payments?connected=true`,
  type: 'account_onboarding',
})
```

**GET** - Check account status:
```typescript
const account = await stripe.accounts.retrieve(accountId)
return {
  chargesEnabled: account.charges_enabled,
  payoutsEnabled: account.payouts_enabled,
  detailsSubmitted: account.details_submitted,
  requiresAction: !account.charges_enabled || !account.details_submitted,
}
```

### 2. Creating Checkouts for Sellers

**File**: `apps/studio/src/app/api/stripe/checkout/route.ts`

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: items.map(item => ({
    price_data: {
      currency: 'gbp',
      product_data: { name: item.name },
      unit_amount: item.priceCents,
    },
    quantity: item.quantity,
  })),
  // KEY: Route payment to seller's account
  payment_intent_data: {
    application_fee_amount: calculatePlatformFee(totalCents), // 5%
  },
  success_url: successUrl,
  cancel_url: cancelUrl,
}, {
  stripeAccount: connectedAccountId, // acct_xxx
})
```

### 3. Handling Webhooks

**File**: `apps/studio/src/app/api/stripe/webhook/route.ts`

Events to handle:
- `checkout.session.completed` - Create order record
- `account.updated` - Update seller verification status

### 4. Database Schema

**Organizations table**:
```sql
ALTER TABLE organizations
ADD COLUMN stripe_account_id TEXT;
```

**Orders table** (for transaction records):
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  line_items JSONB,
  subtotal_cents INTEGER,
  platform_fee_cents INTEGER,
  seller_payout_cents INTEGER,
  currency TEXT DEFAULT 'gbp',
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Fee Structure

### Platform Fee: 5%

Defined in `apps/studio/src/lib/stripe/server.ts`:

```typescript
export const PLATFORM_FEE_PERCENT = 5

export function calculatePlatformFee(amountCents: number): number {
  return Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100))
}
```

### Example Transaction

| Item | Amount |
|------|--------|
| Customer pays | £100.00 |
| Platform fee (5%) | £5.00 → Slydes |
| Seller receives | £95.00 |
| Stripe processing (~1.4% + 20p) | ~£1.60 (from seller's £95) |
| **Seller net** | ~£93.40 |

---

## User Journey

### Seller Onboarding

1. Seller upgrades to **Pro tier** (required for commerce)
2. Goes to **Settings → Payments**
3. Clicks **"Connect Stripe"**
4. Redirected to Stripe's hosted onboarding
5. Completes KYC (ID verification, bank details)
6. Returns to Slydes with `?connected=true`
7. `stripe_account_id` saved to their organization
8. Ready to accept payments

### Buyer Checkout

1. Buyer browses seller's Slyde
2. Adds items to cart
3. Clicks "Checkout"
4. Redirected to Stripe Checkout (hosted)
5. Enters payment details
6. Payment processed
7. Redirected to success page
8. Order created in database
9. Seller sees order in dashboard

---

## Feature Gating by Plan

| Feature | Free | Creator | Pro |
|---------|------|---------|-----|
| Display products | ✅ | ✅ | ✅ |
| Enquire/Book CTAs | ❌ | ✅ | ✅ |
| Connect Stripe | ❌ | ❌ | ✅ |
| Accept payments | ❌ | ❌ | ✅ |
| Order management | ❌ | ❌ | ✅ |

---

## Alignment with Slydes Platform

### Fits Our Vision

✅ **Two-sided marketplace**: Businesses create → Consumers discover → Transactions happen
✅ **Platform revenue model**: 5% cut aligns with documented business model
✅ **Pro tier value**: Commerce is the premium feature worth £50/mo
✅ **Practice what we preach**: Our demo Slydes can showcase real checkout

### Documentation Cross-Reference

| Document | Alignment |
|----------|-----------|
| [PRICING-PAYMENTS.md](./PRICING-PAYMENTS.md) | ✅ Pro tier = commerce features |
| [BUSINESS-MODEL.md](./BUSINESS-MODEL.md) | ✅ 5% transaction fee documented |
| [MVP-MONETISATION.md](./MVP-MONETISATION.md) | ✅ Connect is Phase 1 commerce |
| [PLATFORM-OVERVIEW.md](./PLATFORM-OVERVIEW.md) | ✅ Enables B2C transactions |

---

## Testing Stripe Connect

### Test Mode

Use test API keys (starts with `sk_test_` and `pk_test_`):
- No real money moves
- Use test card numbers (4242 4242 4242 4242)
- Instant account verification in test mode

### Going Live

1. Switch to live keys (`sk_live_`, `pk_live_`)
2. Ensure webhook endpoint is registered in Stripe Dashboard
3. Sellers go through real KYC
4. Real payments flow

---

## Key Files

| Purpose | File |
|---------|------|
| Stripe server client | `apps/studio/src/lib/stripe/server.ts` |
| Stripe client (browser) | `apps/studio/src/lib/stripe/client.ts` |
| Connect API | `apps/studio/src/app/api/stripe/connect/route.ts` |
| Checkout API | `apps/studio/src/app/api/stripe/checkout/route.ts` |
| Webhook handler | `apps/studio/src/app/api/stripe/webhook/route.ts` |
| Payments settings UI | `apps/studio/src/app/settings/payments/page.tsx` |
| Database migration | `apps/studio/supabase/migrations/010_add_stripe_account.sql` |
| Orders migration | `apps/studio/supabase/migrations/011_create_orders.sql` |

---

## Next Steps

1. ✅ `STRIPE_SECRET_KEY` configured
2. ✅ `STRIPE_WEBHOOK_SECRET` configured
3. ✅ Code exports `accounts` and `accountLinks`
4. ⬜ Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (for client-side UI)
5. ⬜ Register webhook endpoint in Stripe Dashboard
6. ⬜ Test Connect onboarding flow
7. ⬜ Test end-to-end checkout

---

## Support & Resources

- [Stripe Connect Docs](https://stripe.com/docs/connect)
- [Express Accounts](https://stripe.com/docs/connect/express-accounts)
- [Testing Connect](https://stripe.com/docs/connect/testing)
- [Platform Fee Collection](https://stripe.com/docs/connect/direct-charges#collect-fees)

---

*This document is the source of truth for Stripe Connect implementation on Slydes.*
