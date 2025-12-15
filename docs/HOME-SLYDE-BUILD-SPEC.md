# Slydes – Home Slyde Build Spec (Video + Drawer Architecture)

> **Implementation-Facing Specification**
>
> This document defines exactly how the Home Slyde should be built,
> how it behaves, and how it differs from Child Slydes.
>
> **Created**: December 14, 2025
> **Updated**: December 15, 2025 (Video-first immersive model)
> **Status**: Canonical
>
> **Override Notice**: This document supersedes any prior Home Slyde concepts
> involving static layouts or "decision-not-experience" philosophy.
> The Home Slyde is now explicitly **video-first with swipe-up drawer**.

---

## Role of the Home Slyde

The Home Slyde's job is to:
- capture attention immediately (video)
- create a "wow" moment (immersion)
- enable exploration (drawer)
- route users to deeper experiences (categories)

It should feel premium, cinematic, and intentional.

---

## Structural Rule (Non-Negotiable)

Every brand has:
- exactly **one Home Slyde**
- consisting of **one full-screen video** + **swipe-up category drawer**

No exceptions.

---

## Two-State Architecture

The Home Slyde has two states:

### State 1: Video (Default)

```
┌─────────────────────────────────────────┐
│                                         │
│         [FULL-SCREEN VIDEO]             │
│                                         │
│    Brand video playing (10-30 seconds)  │
│    Looping, muted by default            │
│    Cinematic, aspirational content      │
│                                         │
│         "American Crew"                 │
│         "Be the man you want to be"     │
│                                         │
│            ▲ Swipe up to explore        │
│                                         │
└─────────────────────────────────────────┘
```

**Contents**:
- Full-screen video (9:16 vertical)
- Brand name overlay
- Tagline overlay
- Swipe-up affordance hint
- Heart + Share actions (right side)

---

### State 2: Drawer Open

```
┌─────────────────────────────────────────┐
│                                         │
│    [VIDEO CONTINUES - dimmed 40%]       │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │      CATEGORY DRAWER            │    │
│  │      (slides up from bottom)    │    │
│  │                                 │    │
│  │   [🧴 Styling]   [🧴 Shampoo]   │    │
│  │   [✂️ Grooming]  [🎁 Gift Sets] │    │
│  │                                 │    │
│  │   [Find a Barber]               │    │
│  │                                 │    │
│  │      ▼ Swipe down to close      │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**Contents**:
- Video continues playing (dimmed)
- Semi-transparent drawer background
- 3-6 category cards
- Optional primary CTA
- Swipe-down to dismiss

---

## Video Requirements

### Duration
- **Minimum**: 10 seconds
- **Recommended**: 15-20 seconds
- **Maximum**: 30 seconds

Shorter is better. The video should intrigue, not inform.

### Technical Specs
- **Aspect ratio**: 9:16 (vertical)
- **Resolution**: 1080x1920 minimum
- **Format**: H.264 (MP4) with HLS fallback
- **File size**: Target under 15MB
- **Audio**: Optional (muted by default)

### Content Guidelines
- Cinematic, aspirational content
- Show the brand essence, not product details
- Movement and energy preferred
- No text-heavy frames
- Should work without sound

### Fallback
- Static poster image (high-quality)
- Categories visible immediately
- Graceful degradation, not broken experience

---

## Drawer Specifications

### Trigger
- **Swipe up** from bottom 20% of screen
- **Tap** on "Explore" hint text
- **Auto-reveal** after video plays once (optional setting)

### Dismiss
- **Swipe down** on drawer
- **Tap** outside drawer area
- **Tap** category (navigates away)

### Visual Style
- Semi-transparent background (black 70% opacity)
- Backdrop blur (8-12px)
- Rounded top corners (24px radius)
- Smooth spring animation (300ms)

### Category Cards
- 3-6 categories maximum
- 2-column grid layout
- Icon + label + optional description
- Equal visual weight
- Tappable → navigates to Category Slyde (a Child Slyde of type `category`)

### Primary CTA (Optional)
- Single full-width button at bottom
- Only if one action dominates (e.g., "Book Now")
- Accent color background

---

## Interaction Elements

### Video State (Drawer Closed)

**Heart (Like)** - Included
- Brand-level affinity
- "I like this business"

**Share** - Included
- Share the Home Slyde link
- Default share destination

**Info (ⓘ)** - Included
- Opens **AboutSheet** (organization info)
- Shows: business name, location, about text, contact options (phone, email, message)
- Does NOT open the drawer

**Sound Toggle** - Included (if video has audio)
- Muted by default
- Tap to unmute

**Swipe-Up Hint** - Included
- Text: "Swipe up to explore" or "↑ Explore"
- Animated pulse after 2-3 seconds
- Disappears when drawer opens

**ProfilePill** - Included (bottom of screen)
- Shows business name
- Tap → Opens category drawer (NOT AboutSheet)
- This is the "explore" affordance

### Drawer State

**Category Cards** - Required
- Each links to a Category Child Slyde
- Icon + label minimum
- Optional: brief description

**Primary CTA** - Optional
- "Book Now", "Shop Now", etc.
- Only if clearly dominant action

**Close Affordance** - Required
- Drag handle at top of drawer
- "Swipe down" hint on first visit

---

## Behaviour Rules

### On Load
1. Video starts playing immediately (muted)
2. Brand name + tagline overlay visible
3. Swipe-up hint appears after 2 seconds
4. Heart + Share buttons visible

### On Swipe Up
1. Drawer slides up (spring animation)
2. Video dims to 40% brightness
3. Video continues playing
4. Categories become interactive

### On Swipe Down
1. Drawer slides down
2. Video returns to full brightness
3. User returns to video state

### On Category Tap
1. Navigate to Category Child Slyde
2. Standard slide-from-right transition
3. Back button returns to Home Slyde

### On Video Loop
1. Video loops seamlessly
2. Optional: Auto-reveal drawer after first complete loop
3. Optional: Dim video slightly on subsequent loops

---

## Analytics

**Metrics that matter**:
- Home Slyde views
- Video completion rate (full loop)
- Drawer open rate
- Time to drawer open
- Category selection distribution
- Exit rate before category selection

**Key insight**: Drawer open rate indicates engagement quality. Low drawer open = video isn't driving curiosity.

---

## Accessibility

### Reduced Motion
- If `prefers-reduced-motion`: Show poster image + categories visible
- No autoplay video
- Static, functional experience

### Screen Readers
- Video has descriptive alt text
- Categories are properly labeled buttons
- Drawer state announced

### Autoplay Restrictions
- Video must be muted for autoplay
- Sound-on requires user interaction
- Fallback to poster if autoplay blocked

---

## Example: American Crew

### Video Content
- 15-second cinematic loop
- Man styling hair in mirror
- Slow-motion product shots
- Urban lifestyle B-roll
- No text overlays in video

### Overlay
- "American Crew"
- "Be the man you want to be"

### Categories (Drawer)
- [🧴 Styling Products]
- [🧴 Hair Care]
- [✂️ Grooming]
- [🎁 Gift Sets]

### Primary CTA
- [Find a Barber]

---

## Example: Highland Motors

### Video Content
- 20-second showreel
- Cars on Highland roads
- Workshop footage
- Happy customers
- Team shots

### Overlay
- "Highland Motors"
- "Premium Service, Highland Style"

### Categories (Drawer)
- [🔧 Services]
- [🚗 Vehicles]
- [💰 Offers]
- [📍 About Us]

### Primary CTA
- [Book Service]

---

## Technical Implementation Notes

### Video Loading
1. Show blurred poster immediately
2. Stream low-quality version first
3. Progressive enhancement to full quality
4. Cache aggressively for return visits

### Drawer Animation
```css
/* Drawer transition */
transform: translateY(100%); /* closed */
transform: translateY(0);    /* open */
transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
```

### Video Dimming
```css
/* When drawer is open */
filter: brightness(0.4);
transition: filter 300ms ease;
```

### Gesture Detection
- Swipe up: `deltaY < -50px` from bottom 20%
- Swipe down: `deltaY > 50px` on drawer
- Use touch events on mobile, mouse on desktop

---

## One-Line Rule

**The Home Slyde is an immersive video that invites exploration.**

Capture attention. Reveal navigation. Route to experiences.

---

## Related Documents

- [HOME-SLYDE-SYSTEM.md](./HOME-SLYDE-SYSTEM.md) - Why the Home Slyde exists
- [STRUCTURE.md](./STRUCTURE.md) - The canonical platform hierarchy
- [CATEGORY-INVENTORY-FLOW.md](./CATEGORY-INVENTORY-FLOW.md) - Categories, inventory, and data architecture (canonical CRUD model)
