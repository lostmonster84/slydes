# Slydes – Home Slyde Build Spec (Single-Slide Architecture)

> **Implementation-Facing Specification**
>
> This document defines exactly how the Home Slyde should be built,
> how it behaves, and how it differs from Child Slydes.
>
> **Created**: December 14, 2025
> **Updated**: December 14, 2025 (Single-slide model)
> **Status**: Canonical
>
> **Override Notice**: This document supersedes any prior Home Slyde concepts
> involving multiple frames. The Home Slyde is now explicitly **one slide only**.

---

## Role of the Home Slyde

The Home Slyde's job is to:
- orient the user
- present clear paths
- get out of the way

It should be faster, clearer, and more assertive than Child Slydes.

---

## Structural Rule (Non-Negotiable)

Every brand has:
- exactly **one Home Slyde**
- consisting of **exactly one slide**

No exceptions in v1.

---

## Purpose

The Home Slyde answers one question:

**"Where should I go next?"**

Once that decision is made, the Home Slyde has done its job.

---

## Canonical Layout (Single Slide)

The Home Slyde is vertically structured into **three zones** on a single screen.

```
┌─────────────────────────┐
│                         │
│   ZONE 1: Orientation   │  ← Brand name + one-line descriptor
│         (Top)           │
│                         │
├─────────────────────────┤
│                         │
│   ZONE 2: Primary Paths │  ← 3-5 large tappable choices
│        (Middle)         │     Each links to a Child Slyde
│                         │
│    [Camping]            │
│    [Just Drive]         │
│    [Vehicles]           │
│    [Locations]          │
│                         │
├─────────────────────────┤
│                         │
│   ZONE 3: Primary CTA   │  ← Optional single action
│        (Bottom)         │     "Book Now" or similar
│                         │
└─────────────────────────┘
```

---

### Zone 1: Orientation (Top)

**Purpose**: Immediate context.

**Contents**:
- Brand or experience name
- One-line descriptor

**Example**:
> **WildTrax**
> Self-drive adventures across the Highlands.

**Rules**:
- No motion-heavy media
- No long copy
- High legibility
- Instant comprehension

---

### Zone 2: Primary Paths (Middle — Core)

**Purpose**: Convert attention into direction.

**Contents**:
- 3–5 large, tappable paths
- Each path deep-links to a Child Slyde

**Examples**:
- Camping
- Just Drive
- Vehicles
- Locations
- Availability

**Rules**:
- No scrolling
- No nested choices
- No ambiguity
- Each option is visually equal
- This is the dominant visual element

**This is the heart of the Home Slyde.**

---

### Zone 3: Optional Primary CTA (Bottom)

**Purpose**: Provide a single escape hatch for high-intent users.

**Examples**:
- Book now
- Check availability
- Start planning

**Rules**:
- Optional
- Only include if one action clearly dominates
- Omit entirely if choices are the primary goal

---

## Interaction Elements

### Heart (Like)

**Included.**

Meaning:
- On Home Slyde: brand-level affinity
- "I like this experience"

Used for:
- brand engagement signals
- future retargeting
- saved destinations

---

### Share

**Included.**

Meaning:
- "Start here"
- The default unit for recommendations, QR codes, bio links, and sharing

---

### Explicitly Excluded Interactions

The Home Slyde must not include:
- comments
- reactions
- swipe affordances
- secondary CTAs
- analytics overlays
- immersive transitions

Absence of swipe cues is intentional.
It reinforces decisiveness.

---

## Behavioural Characteristics

The Home Slyde should feel:
- fast
- confident
- decisive
- minimal

Compared to Child Slydes, it is:
- less immersive
- less emotional
- more directive

Immersion begins only after a path is chosen.

---

## Visual Tone

The Home Slyde should feel:
- bold
- decisive
- clear
- fast

Think: **signpost, not cinema**

If the Home Slyde feels immersive, it is wrong.

---

## Relationship to Child Slydes

- Child Slydes are immersive
- Child Slydes tell stories
- Child Slydes optimise attention

The Home Slyde routes attention.
It does not attempt to hold it.

---

## Analytics Specific to Home Slyde

**Metrics that matter**:
- Home Slyde views
- Path selection distribution
- Exit rate before selection
- Most chosen path

**Metrics that do not matter**:
- swipe depth (there is no swipe)
- completion rate
- time spent

The Home Slyde is about choices, not depth.

---

## Editorial Rules

- The Home Slyde never explains everything
- It never competes with Child Slydes
- It never feels like a website

If the Home Slyde feels immersive, it is doing too much.

---

## One-Line Rule

**The Home Slyde is a decision, not an experience.**

---

## Related Documents

- [HOME-SLYDE-SYSTEM.md](./HOME-SLYDE-SYSTEM.md) - Why the Home Slyde exists
- [STRUCTURE.md](./STRUCTURE.md) - The canonical platform hierarchy
