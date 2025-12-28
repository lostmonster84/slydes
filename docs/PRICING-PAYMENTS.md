# Slydes Pricing & Payments (Canonical)

> **Source of Truth** for all pricing, tiers, and payment handling.
>
> Last updated: December 21, 2025

---

## Plan Pricing

Slydes uses simple, predictable subscription pricing with Slyde caps to ensure sustainable hosting costs.

### Plans

| Tier | Monthly | Annual | Slydes | What You Get |
|------|---------|--------|--------|--------------|
| **Free** | £0 | £0 | 1 | Try the format (watermark required) |
| **Creator** | £25 | £250/yr | 10 | Analytics, no watermark, Enquire/Book CTAs |
| **Pro** | £50 | £500/yr | 25 | Full commerce: Buy Now, Cart, Checkout, Orders |
| **Agency** | £99 | £990/yr | 75 | Client management, white-label, team features |

**Annual discount**: 17% off (2 months free)

**Enterprise**: Custom pricing for 75+ Slydes or franchise/chain requirements.

### What Each Tier Unlocks

#### Free — £0/month
- 1 published Slyde
- Full mobile experience
- Shareable public link
- Core creation tools
- 3 Momentum AI messages/day
- **Slydes watermark required**

#### Creator — £25/month (or £250/year)
- Up to 10 published Slydes
- No watermark
- Basic analytics (views, swipe depth, completion rate)
- Inventory browsing (grids, Item Slydes)
- Enquire / Book CTAs (external links, phone, forms)
- Up to 6 categories

#### Pro — £50/month (or £500/year)
- Up to 25 published Slydes
- Everything in Creator
- **Commerce enabled**: Buy Now, Add to Cart, Checkout
- Order management
- Stripe Connect integration
- Advanced analytics (frame drop-off, traffic sources, revenue)
- Unlimited categories
- Unlimited Momentum AI

#### Agency — £99/month (or £990/year)
- Up to 75 published Slydes
- Everything in Pro
- Client management
- White-label options
- Team collaboration
- Priority support

---

## Feature Gating Summary

| Feature | Free | Creator | Pro | Agency |
|---------|------|---------|-----|--------|
| Published Slydes | 1 | 10 | 25 | 75 |
| Categories | 4 | 6 | Unlimited | Unlimited |
| Watermark | Required | Removed | Removed | Removed |
| Analytics | ✗ | Basic | Advanced | Advanced |
| Inventory (browse) | ✗ | ✓ | ✓ | ✓ |
| Enquire / Book CTA | ✗ | ✓ | ✓ | ✓ |
| Buy Now | ✗ | ✗ | ✓ | ✓ |
| Cart + Checkout | ✗ | ✗ | ✓ | ✓ |
| Order management | ✗ | ✗ | ✓ | ✓ |
| Client management | ✗ | ✗ | ✗ | ✓ |
| White-label | ✗ | ✗ | ✗ | ✓ |
| Team collaboration | ✗ | ✗ | ✗ | ✓ |
| Momentum AI | 3/day | 3/day | Unlimited | Unlimited |

---

## Platform Fees

**Slydes takes 0% of your sales.**

All payments are processed securely by Stripe.
Standard Stripe processing fees apply.

Slydes does not:
- Add transaction fees
- Take a revenue share
- Charge per order
- Charge per customer

You pay Slydes for the software.
Stripe handles payments.

---

## Stripe Fees (How They Work)

Stripe charges payment processing fees directly to the seller's Stripe account.

These fees are set by Stripe, not Slydes.

### Typical Stripe fees (UK Stripe account)

For a UK based Stripe account, Stripe typically charges:
- UK cards: around **1.4% + 20p**
- Non-UK cards: higher rate
- Currency conversion: additional conversion fee if applicable

Exact fees depend on:
- The country of the seller's Stripe account
- The card type used by the customer
- The currency used at checkout

Slydes does not control or modify these fees.

---

## Overseas Customers (US, EU, Australia, etc.)

Slydes supports global customers out of the box via Stripe.

### How this works in practice

- The **seller's Stripe account country** determines the base Stripe pricing
- If you are a UK based seller, Stripe applies **UK Stripe fees**
- When a customer pays from another country:
  - Stripe may apply a higher card processing fee
  - Stripe may apply a currency conversion fee if the charge currency differs

These fees are:
- Charged by Stripe
- Deducted automatically from the seller's payout
- Not charged or collected by Slydes

This is standard behaviour across Stripe powered platforms.

---

## Currency Display

| Currency | Free | Creator Monthly | Creator Annual | Pro Monthly | Pro Annual | Agency Monthly | Agency Annual |
|----------|------|-----------------|----------------|-------------|------------|----------------|---------------|
| GBP (£) | £0 | £25 | £250 | £50 | £500 | £99 | £990 |
| USD ($) | $0 | $29 | $290 | $59 | $590 | $119 | $1,190 |
| EUR (€) | €0 | €27 | €270 | €55 | €550 | €109 | €1,090 |

Implementation: Auto-detect user location, show local currency. Store preference.

---

## Currency and Checkout

- Sellers choose their Stripe account currency
- Checkout is handled entirely by Stripe
- Customers may see prices in their local currency depending on Stripe configuration
- Any conversion is handled by Stripe at checkout

Slydes does not add conversion fees or markups.

---

## Responsibility Split

### Slydes is responsible for
- The platform
- Commerce features
- Checkout flow integration
- Orders and analytics

### Stripe is responsible for
- Payment processing
- Card acceptance worldwide
- Fraud checks
- Currency conversion
- Stripe fees and fee calculation
- Payouts to the seller

### The seller is responsible for
- Their Stripe account
- Understanding Stripe pricing
- Any applicable taxes or reporting

---

## Upgrade Triggers

What makes users upgrade:

| Trigger | From | To |
|---------|------|----|
| Create second Slyde | Free | Creator |
| Access analytics | Free | Creator |
| Remove watermark | Free | Creator |
| Hit media limits | Free | Creator |
| Need more than 10 Slydes | Creator | Pro |
| Enable Buy Now | Creator | Pro |
| Enable Cart/Checkout | Creator | Pro |
| Need order management | Creator | Pro |
| Need more than 25 Slydes | Pro | Agency |
| Managing multiple clients | Pro | Agency |
| Need white-label | Pro | Agency |

---

## How We Explain This to Users (Approved Copy)

### Short version
> Slydes takes 0% of your sales. Payments are processed by Stripe. Stripe's standard processing fees apply.

### Pricing page headline
> Simple pricing. No surprises.

### FAQ: Transaction fees
**Are there any transaction fees?**
Slydes does not charge transaction fees or take a cut of your sales. Payments are processed by Stripe, which applies standard processing fees depending on card type and customer location.

### FAQ: What's the difference between the plans?
**Free** lets you try the format with 1 Slyde.
**Creator** is for single businesses that want analytics and a professional presence (up to 10 Slydes).
**Pro** is for businesses that sell products or services directly, with commerce and up to 25 Slydes.
**Agency** is for teams managing multiple clients, with up to 75 Slydes, white-label, and collaboration features.

---

## Commission for Partners

Founding Partners earn **25% commission for life** on referred paid subscribers:
- Creator: £25/mo × 25% = **£6.25/month per subscriber**
- Pro: £50/mo × 25% = **£12.50/month per subscriber**
- Agency: £99/mo × 25% = **£24.75/month per subscriber**

Recurring as long as subscriber stays active.

---

## Why Slyde Caps?

Slydes includes video hosting (Cloudflare Stream) which has real costs:
- **Storage**: ~$5 per 1,000 minutes stored
- **Streaming**: ~$1 per 1,000 minutes watched

Slyde caps ensure sustainable margins at every tier:

| Tier | Max Slydes | Realistic Max Cost | Revenue | Min Margin |
|------|------------|-------------------|---------|------------|
| Creator | 10 | ~$14/mo | £25 ($31) | 55% |
| Pro | 25 | ~$28/mo | £50 ($63) | 56% |
| Agency | 75 | ~$83/mo | £99 ($125) | 34% |

This keeps pricing simple (no view caps or overages) while protecting margins.

---

## Notes for Implementation

- Stripe account country determines fee structure
- No additional configuration required for overseas buyers
- All global payment logic handled by Stripe
- Link to Stripe pricing page for transparency
- Feature flags: `has_commerce` (Pro+), `has_inventory` (Creator+), `has_analytics` (Creator+), `has_agency` (Agency)
- Slyde limits enforced at publish time, not creation

---

*Document status: Canonical — Source of Truth*
*Tiers: Free £0 / Creator £25 / Pro £50 / Agency £99*
