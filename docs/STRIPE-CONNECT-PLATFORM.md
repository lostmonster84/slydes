# Slydes Stripe Connect Platform

> **Last Updated**: December 16, 2025
> **Status**: Active
> **Type**: Platform Implementation Guide

---

## IMPORTANT: We Are The Platform

**Slydes is the PLATFORM, not a connected account.**

We don't "connect" to anything. We enable our CUSTOMERS to connect their Stripe accounts to us. This is a critical distinction:

- ❌ We do NOT have a Stripe Connect account
- ✅ We ARE the platform that hosts Connect accounts
- ✅ Our customers create Express accounts linked to our platform
- ✅ We have platform API keys (secret key, publishable key, webhook secret)

---

## Overview

Slydes uses **Stripe Connect** as a platform to enable our customers (sellers) to accept payments from their customers (buyers). We are not selling products ourselves - we facilitate commerce between businesses and their audiences.

### What This Means

| Role | Who | What They Do |
|------|-----|--------------|
| **Platform** | Slydes | Provides the infrastructure, takes **0% commission** |
| **Connected Account** | Our customers (Pro tier) | Businesses selling products/services via their Slydes |
| **End Customer** | Their customers | People buying from businesses on Slydes |

**Key Point**: Slydes takes 0% of transactions. Sellers keep 100% of their sales (minus Stripe's standard processing fees).

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
Buyer → Checkout on Seller's Slyde → Stripe Connect → Payment to Seller (100%)
```

- **Endpoint**: `/api/stripe/checkout`
- **Account Type**: Stripe Connect Express
- **Platform Fee**: **0%** - Seller receives full amount

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
│  │  • Platform fee: £0 (Slydes takes 0%)               │      │
│  │  • Seller receives: £100                             │      │
│  │  • Stripe processing fees: ~£1.60 (from seller)     │      │
│  │  • Seller net: ~£98.40                               │      │
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
// No application_fee_amount - seller receives 100%
const session = await stripe.checkout.sessions.create(
  {
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  },
  {
    // Process on the connected account
    stripeAccount: connectedAccountId,
  }
)
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
  platform_fee_cents INTEGER,  -- Always 0
  seller_payout_cents INTEGER, -- Equals subtotal_cents
  currency TEXT DEFAULT 'gbp',
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Fee Structure

### Platform Fee: 0%

**Slydes takes no commission on transactions.**

Sellers keep 100% of their sales. The only deduction is Stripe's standard processing fees.

### Example Transaction

| Item | Amount |
|------|--------|
| Customer pays | £100.00 |
| Platform fee | £0.00 (Slydes takes 0%) |
| Seller receives | £100.00 |
| Stripe processing (~1.4% + 20p) | ~£1.60 |
| **Seller net** | ~£98.40 |

### Why 0%?

Slydes monetizes through **subscriptions** (Creator £25/mo, Pro £50/mo), not transaction fees. This is better for sellers:
- Predictable costs
- No surprise deductions
- Keeps 100% of sales revenue

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
| Display products | Yes | Yes | Yes |
| Enquire/Book CTAs | No | Yes | Yes |
| Connect Stripe | No | No | Yes |
| Accept payments | No | No | Yes |
| Order management | No | No | Yes |

---

## Alignment with Slydes Platform

### Fits Our Vision

- **Two-sided marketplace**: Businesses create → Consumers discover → Transactions happen
- **Subscription revenue model**: Pro tier at £50/mo unlocks commerce
- **Seller-friendly**: 0% commission keeps sellers happy
- **Practice what we preach**: Our demo Slydes can showcase real checkout

### Documentation Cross-Reference

| Document | Alignment |
|----------|-----------|
| [PRICING-PAYMENTS.md](./PRICING-PAYMENTS.md) | "Slydes takes 0% of your sales" |
| [BUSINESS-MODEL.md](./BUSINESS-MODEL.md) | Subscription-based revenue |
| [MVP-MONETISATION.md](./MVP-MONETISATION.md) | Connect is Phase 1 commerce |
| [PLATFORM-OVERVIEW.md](./PLATFORM-OVERVIEW.md) | Enables B2C transactions |

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

## Platform Setup Checklist

All platform keys are configured. **No further Stripe setup required.**

- [x] `STRIPE_SECRET_KEY` — Platform secret key
- [x] `STRIPE_WEBHOOK_SECRET` — Webhook verification
- [x] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Client-side key
- [x] Code exports `accounts` and `accountLinks`
- [x] 0% platform fee (sellers keep 100%)
- [x] Webhook endpoint registered

**Ready for customers to connect their accounts.**

---

## Support & Resources

- [Stripe Connect Docs](https://stripe.com/docs/connect)
- [Express Accounts](https://stripe.com/docs/connect/express-accounts)
- [Testing Connect](https://stripe.com/docs/connect/testing)

---

*This document is the source of truth for Stripe Connect implementation on Slydes.*
