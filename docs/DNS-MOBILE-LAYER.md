# Slydes – Mobile Layer via DNS (Canonical v1)

Status: Canonical
This document defines how Slydes integrates as a mobile-first layer
without affecting an existing desktop website.

This is the **official v1 approach**.

---

## Core Principle

Slydes does not replace websites.

Slydes provides a **mobile entry layer** that can be connected safely,
instantly, and reversibly.

Desktop experiences remain unchanged.

---

## What DNS Is Used For (And What It Is Not)

DNS is used to:
- route a subdomain to the Slydes platform
- provide a clean, first-party mobile link
- avoid modifying existing website infrastructure

DNS is **not** used to:
- detect device type
- switch experiences dynamically
- redirect desktop vs mobile traffic

All device-aware behaviour lives above DNS.

---

## Canonical Setup (v1)

### Mobile Subdomain via CNAME

Customers connect a mobile subdomain to Slydes.

Recommended subdomains:
- `m.yourdomain.com`
- `go.yourdomain.com`
- `mobile.yourdomain.com`

---

### DNS Record

Type: `CNAME`
Host: `m` (or chosen subdomain)
Target: `cname.slydes.io` (example)

This record points the subdomain directly to Slydes.

---

## Resulting Behaviour

- `yourdomain.com`
  → Desktop website (unchanged)

- `m.yourdomain.com`
  → Slydes Home Slyde (video-first entry point + swipe-up drawer)

Users enter directly into the Slydes mobile experience.

---

## Why This Is the Preferred MVP Approach

- Works on all platforms (Squarespace, Wix, WordPress, Shopify)
- Requires no code changes to the existing site
- No edge functions or device logic required
- Zero SEO risk to the main domain
- Easy for non-technical users
- Completely reversible

This enables **true self-serve onboarding**.

---

## How Customers Use This in Practice

Once connected, customers can:

- Use `m.yourdomain.com` as:
  - QR code destination
  - Instagram bio link
  - Ad landing link
  - SMS or WhatsApp link
- Treat it as their official mobile experience

Slydes becomes the default mobile entry point.

---

## Relationship to the Home Slyde

All subdomain traffic resolves to:
- the **single-slide Home Slyde**

The Home Slyde:
- orients the visitor
- presents primary paths
- routes attention into child Slydes

This ensures:
- fast decisions
- clear flow
- consistent behaviour

---

## What This Does NOT Do (By Design)

This setup does not:
- auto-detect mobile on the main domain
- redirect mobile users from `yourdomain.com`
- modify the desktop site in any way

These behaviours require edge or application-layer logic
and are considered **advanced setups**.

---

## Advanced Setups (Future)

Future or concierge options may include:
- Device-aware routing on the root domain
- Edge-level mobile switching
- Same-domain mobile overlays

These are intentionally excluded from v1.

---

## One-Line Rule

DNS connects traffic.
Slydes delivers the mobile experience.

---

## Summary

Slydes v1 integrates as a mobile layer via DNS:

- Safe
- Fast
- Honest
- Self-serve
- Reversible

Desktop stays desktop.
Mobile becomes Slydes.
