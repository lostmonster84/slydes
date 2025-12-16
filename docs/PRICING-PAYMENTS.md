# Slydes Pricing & Payments (Canonical)

> **Source of Truth** for all pricing, tiers, and payment handling.
>
> Last updated: December 16, 2025

---

## Plan Pricing

Slydes uses simple, predictable subscription pricing.

### Plans

| Tier | Monthly | Annual | What You Get |
|------|---------|--------|--------------|
| **Free** | £0 | £0 | Try the format (1 Slyde, watermark) |
| **Creator** | £25 | £250/yr | Analytics, no watermark, 10 Slydes, Enquire/Book CTAs |
| **Pro** | £50 | £500/yr | Full commerce: Buy Now, Cart, Checkout, Orders |

**Annual discount**: 17% off (2 months free)

### What Each Tier Unlocks

#### Free — £0/month
- 1 published Slyde
- Full mobile experience
- Shareable public link
- Core creation tools
- **Slydes watermark required**

#### Creator — £25/month (or £250/year)
- Up to 10 published Slydes
- No watermark
- Basic analytics (views, swipe depth, completion rate)
- Inventory browsing (grids, Item Slydes)
- Enquire / Book CTAs (external links, phone, forms)
- Up to 6 categories

#### Pro — £50/month (or £500/year)
- Everything in Creator
- **Commerce enabled**: Buy Now, Add to Cart, Checkout
- Order management
- Stripe Connect integration
- Unlimited categories
- Priority support

---

## Feature Gating Summary

| Feature | Free | Creator | Pro |
|---------|------|---------|-----|
| Published Slydes | 1 | 10 | Unlimited |
| Categories | 4 | 6 | Unlimited |
| Watermark | Required | Removed | Removed |
| Analytics | ✗ | ✓ | ✓ |
| Inventory (browse) | ✗ | ✓ | ✓ |
| Enquire / Book CTA | ✗ | ✓ | ✓ |
| Buy Now | ✗ | ✗ | ✓ |
| Cart + Checkout | ✗ | ✗ | ✓ |
| Order management | ✗ | ✗ | ✓ |

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

| Currency | Free | Creator Monthly | Creator Annual | Pro Monthly | Pro Annual |
|----------|------|-----------------|----------------|-------------|------------|
| GBP (£) | £0 | £25 | £250 | £50 | £500 |
| USD ($) | $0 | $29 | $290 | $59 | $590 |
| EUR (€) | €0 | €27 | €270 | €55 | €550 |

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
| Enable Buy Now | Creator | Pro |
| Enable Cart/Checkout | Creator | Pro |
| Need order management | Creator | Pro |

---

## How We Explain This to Users (Approved Copy)

### Short version
> Slydes takes 0% of your sales. Payments are processed by Stripe. Stripe's standard processing fees apply.

### Pricing page headline
> Simple pricing. Pay when attention matters.

### FAQ: Transaction fees
**Are there any transaction fees?**
Slydes does not charge transaction fees or take a cut of your sales. Payments are processed by Stripe, which applies standard processing fees depending on card type and customer location.

### FAQ: What's the difference between Creator and Pro?
**Creator** is for businesses that want analytics and a professional presence. Use Enquire/Book CTAs to drive leads.
**Pro** is for businesses that sell products or services directly. Enable Buy Now, Cart, and Checkout powered by Stripe.

---

## Commission for Partners

Founding Partners earn **25% commission for life** on referred paid subscribers:
- Creator: £25/mo × 25% = **£6.25/month per subscriber**
- Pro: £50/mo × 25% = **£12.50/month per subscriber**

Recurring as long as subscriber stays active.

---

## Notes for Implementation

- Stripe account country determines fee structure
- No additional configuration required for overseas buyers
- All global payment logic handled by Stripe
- Link to Stripe pricing page for transparency
- Feature flags: `has_commerce` (Pro), `has_inventory` (Creator+), `has_analytics` (Creator+)

---

*Document status: Canonical — Source of Truth*
*Tiers: Free £0 / Creator £25 / Pro £50*
