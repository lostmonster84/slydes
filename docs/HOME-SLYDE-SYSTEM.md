# Slydes – Home Slyde System Overview

> **The Immersive Entry Point**
>
> This document defines the Home Slyde as a core structural concept in Slydes.
> It explains why it exists, how it works, and how it changes the product.
>
> **Created**: December 14, 2025
> **Updated**: December 15, 2025 (Video-first immersive model)
> **Status**: Canonical

---

## What Problem the Home Slyde Solves

Slydes is a link-first, mobile-first format.

People will paste links when intent is:
- broad ("check these guys out")
- exploratory ("what do they offer?")
- social ("you should see this")

Without a Home Slyde, these links have no natural destination.

The Home Slyde solves:
**"Where does attention start when intent is unclear?"**

---

## Core Definition

The Home Slyde is:
> An immersive, video-first entry point that captures attention and routes it into deeper experiences.

It is:
- the brand's first impression
- an experience with decision baked in
- a "wow" moment that makes users want to explore
- the front door that sets the tone

It is not:
- a static menu
- a homepage in the traditional sense
- a list of links
- boring

---

## Core Product Belief

**Every screen in Slydes should be immersive.**

The Home Slyde is no exception. It's the FIRST thing users see – it must be the best thing they see.

If a business can't create compelling video content, Slydes isn't for them. That's the filter. That's the positioning.

**Slydes is for visual businesses.**

---

## The Philosophy Shift

**Old thinking**: "The Home Slyde is a decision, not an experience."

**New thinking**: "The Home Slyde is an experience WITH decision baked in."

Immersion first. Decision follows naturally.

---

## Structural Rule (Non-Negotiable)

Every brand has:
- exactly **one Home Slyde**
- consisting of **one immersive video** + **category drawer**

No exceptions.

---

## Mental Model

Think of Slydes as a system, not a collection of pages.

- Home Slyde = front door (immersive video + navigation drawer)
- Child Slydes = rooms (immersive experiences)
- Links decide where you enter the flow

You can:
- enter through the front door (Home Slyde)
- or deep-link directly into a room (Child Slyde)

Once inside, everything feels like the same premium experience.

---

## The User Journey

```
1. LAND
   User arrives at slydes.io/americancrew

2. WOW
   Full-screen brand video plays
   "Holy shit, this looks premium"
   "What do these guys do?"

3. EXPLORE
   User swipes up (or taps)
   Category drawer slides up
   Video continues playing (dimmed)

4. DECIDE
   User sees categories
   Taps one to dive deeper

5. IMMERSE
   Category Slyde → Grid → Item Slyde
   The full journey begins
```

**Canonical data model** (Home → Categories → Category Slyde → Inventory → Item Slyde) is defined in:
- [CATEGORY-INVENTORY-FLOW.md](./CATEGORY-INVENTORY-FLOW.md)

---

## How Links Work

### Brand-level link
`slydes.io/americancrew`

Opens the **Home Slyde** (immersive video + drawer)

Used for:
- bio links
- generic shares
- recommendations
- "our site" links
- QR codes with broad intent

---

### Deep links
`slydes.io/americancrew/styling`
`slydes.io/americancrew/shampoo`

Opens directly into the relevant Child Slyde

Used for:
- ads
- campaigns
- specific offers
- targeted messages

Users can still navigate sideways or back into the wider flow.

---

## Why the Home Slyde Is Mandatory

Every brand must have exactly **one Home Slyde**.

This constraint:
- creates clarity
- prevents fragmentation
- gives the system a root
- makes analytics meaningful
- ensures every brand has a "wow" moment

Optional Home Slydes create confusion.
One root creates flow.

---

## Why Video Is Mandatory

If a business can't create a compelling 10-15 second video, they can't create compelling Slydes.

The Home Slyde video is the **quality gate**:
- It filters out businesses that aren't visual-first
- It sets the standard for the entire platform
- It ensures every Slydes experience starts with impact

**No video = no Slydes presence.**

This is intentional. Slydes is not for everyone. It's for businesses that understand visual storytelling.

---

## How This Changes the Product

With the video-first Home Slyde:
- First impressions are always premium
- The platform feels cohesive and intentional
- Every brand entry point has impact
- Users immediately understand "this is different"

Without it:
- Some brands look cheap
- Platform quality is inconsistent
- The TikTok-style promise feels broken
- Users question the value

---

## One-Line Rule

**The Home Slyde is an experience with decision baked in.**

Capture attention first. Route it second.

---

## Related Documents

- [HOME-SLYDE-BUILD-SPEC.md](./HOME-SLYDE-BUILD-SPEC.md) - How to build a Home Slyde (video + drawer architecture)
- [STRUCTURE.md](./STRUCTURE.md) - The canonical platform hierarchy
- [CATEGORY-INVENTORY-FLOW.md](./CATEGORY-INVENTORY-FLOW.md) - How categories and inventory work
