# Slydes Platform Structure

> **The Canonical Hierarchy**
>
> This document defines the core structure of the Slydes platform.
> All documentation, code, and UI must follow this naming convention.
>
> **Created**: December 14, 2025
> **Updated**: December 14, 2025 (Single-slide Home Slyde model)
> **Status**: Canonical — This is the source of truth

---

## The Hierarchy

```
Home Slyde (video-first entry point + drawer)
   └── Child Slyde (shareable experience)
          └── Frame (vertical screen)
```

| Level | Term | Definition | Shareable? |
|-------|------|------------|------------|
| **0** | **Home Slyde** | **Video-first entry point** (one immersive video) with a **swipe-up category drawer** that routes visitors to Child Slydes | Yes |
| **1** | **Child Slyde** | A single offering, property, product, or experience (multiple Frames) | Yes |
| **2** | **Frame** | One vertical screen inside a Child Slyde (the atomic unit users swipe through) | No (part of sequence) |

**Key distinction**:
- Home Slyde is **one immersive video + drawer** (no Frames)
- Child Slydes are **multi-frame** immersive experiences

---

## Definitions

### Home Slyde

The brand's mandatory entry point. Every brand has exactly one Home Slyde consisting of:
- **one full-screen video** (9:16)
- **a swipe-up category drawer** (3–6 categories max)

- **URL**: `slydes.io/{business-slug}`
- **Example**: `slydes.io/wildtrax`, `slydes.io/jamesestates`
- **Purpose**: Capture attention immediately (video), then route into deeper experiences (drawer)
- **Structure**: Two-state model (Video state → Drawer open state)
- **Contains**: No Frames — the Home Slyde is its own level (video + drawer)

**Key principle**: The Home Slyde is an **experience with decision baked in** (immersion first, decision follows).

See: [HOME-SLYDE-SYSTEM.md](./HOME-SLYDE-SYSTEM.md) and [HOME-SLYDE-BUILD-SPEC.md](./HOME-SLYDE-BUILD-SPEC.md)

### Child Slyde

A shareable, self-contained experience for one offering. This is the unit customers receive deep links to.

- **URL**: `slydes.io/{business-slug}/{slyde-slug}`
- **Example**: `slydes.io/wildtrax/camping`, `slydes.io/jamesestates/beach-house`
- **Purpose**: Immersive storytelling for a specific offering
- **Length**: Typically 4–10 Frames
- **Contains**: Multiple Frames following AIDA pattern

**Key principle**: Child Slydes are where immersion happens.

### Frame

One vertical screen inside a Slyde. Users swipe vertically through Frames.

- **Not directly shareable** — always accessed as part of a Slyde
- **Examples**: "Hero Shot", "Kitchen", "Reviews", "Book Now"
- **Follows AIDA pattern**: Hook → How → What → Trust → Proof → Action

---

## Real-World Examples

### Adventure Hire (WildTrax)

```
Home Slyde: slydes.io/wildtrax (SINGLE SLIDE)
┌─────────────────────────────────────────┐
│  ZONE 1: "WildTrax"                     │
│          Self-drive adventures          │
├─────────────────────────────────────────┤
│  ZONE 2: [Camping] [Just Drive]         │
│          [Vehicles] [Locations]         │
├─────────────────────────────────────────┤
│  ZONE 3: [Check Availability]           │
└─────────────────────────────────────────┘

Child Slyde: slydes.io/wildtrax/camping (MULTIPLE FRAMES)
├── Frame 1: Wake Up Here (Hook)
├── Frame 2: Land Rover Defender (How)
├── Frame 3: The Experience (What)
├── Frame 4: Full Kit Included (Trust)
├── Frame 5: 209 Reviews (Proof)
└── Frame 6: Ready to Explore? (Action)

Child Slyde: slydes.io/wildtrax/just-drive
└── ... 6 Frames
```

**User shares**: "Check out this rental company" → `slydes.io/wildtrax` (Home Slyde — single slide)
**User shares**: "Look at this camping package" → `slydes.io/wildtrax/camping` (Deep link — multi-frame)

---

### Real Estate Agent

```
Home Slyde: slydes.io/jamesestates (SINGLE SLIDE)
┌─────────────────────────────────────────┐
│  ZONE 1: "James Estates"                │
│          Premium Highland Properties    │
├─────────────────────────────────────────┤
│  ZONE 2: [Current Listings] [Sold]      │
│          [About James]                  │
├─────────────────────────────────────────┤
│  ZONE 3: [Book a Valuation]             │
└─────────────────────────────────────────┘

Child Slyde: slydes.io/jamesestates/beach-house (MULTIPLE FRAMES)
├── Frame 1: Hero exterior shot
├── Frame 2: Living room
├── Frame 3: Kitchen
├── Frame 4: Bedrooms
├── Frame 5: Garden
└── Frame 6: Book a viewing (CTA)

Child Slyde: slydes.io/jamesestates/city-apartment
└── ... 6 Frames
```

**Agent shares generic link**: `slydes.io/jamesestates` (Home Slyde — single slide)
**Agent shares specific property**: `slydes.io/jamesestates/beach-house` (Deep link — multi-frame)

---

### Restaurant

```
Home Slyde: slydes.io/bistro-paris (SINGLE SLIDE)
┌─────────────────────────────────────────┐
│  ZONE 1: "Bistro Paris"                 │
│          Modern French dining           │
├─────────────────────────────────────────┤
│  ZONE 2: [Brunch] [Dinner]              │
│          [Drinks] [Private Dining]      │
├─────────────────────────────────────────┤
│  ZONE 3: [Reserve a Table]              │
└─────────────────────────────────────────┘

Child Slyde: slydes.io/bistro-paris/brunch-menu (MULTIPLE FRAMES)
└── ... 5 Frames

Child Slyde: slydes.io/bistro-paris/dinner-menu
└── ... 6 Frames

Child Slyde: slydes.io/bistro-paris/drinks-menu
└── ... 4 Frames
```

---

## URL Structure

```
slydes.io/{business-slug}                    → Home Slyde (entry point)
slydes.io/{business-slug}/{slyde-slug}       → Child Slyde (deep link)
slydes.io/{business-slug}/{slyde-slug}?f=3   → Deep-link to Frame 3 (optional)
```

---

## Editor UI Implications

| UI Element | Label | What it does |
|------------|-------|--------------|
| Dashboard list | "Your Slydes" | Lists Home Slyde + all Child Slydes |
| Home indicator | "Home Slyde" badge | Marks the mandatory entry point |
| Left panel header | "Frames (4)" | Shows Frames in current Slyde |
| Add button | "+ Add Frame" | Adds a new vertical screen |
| Starter flow | "+ Create Home Slyde" | First-time setup (required before Child Slydes) |
| Share button | "Share Slyde" | Copies the Slyde link |

---

## Code Naming Convention

| Concept | Type/Interface Name | Variable Name |
|---------|---------------------|---------------|
| Home Slyde | `HomeSlydeData` | `homeSlyde` |
| Child Slyde | `SlydeData` | `slyde`, `slydes`, `childSlyde` |
| Frame | `FrameData` | `frame`, `frames` |
| Device mockup | `DevicePreview` | `devicePreview` |

### Migration from old terms

| Old Term | New Term |
|----------|----------|
| `Profile` | `Home Slyde` |
| `BusinessProfile` | `HomeSlydeData` |
| `SlideData` | `FrameData` |
| `slides` | `frames` |
| `WorldConfig` | *(deleted — use separate Child Slydes)* |
| `worlds` | *(deleted)* |
| `currentWorldId` | *(deleted)* |
| `PhoneFrame` | `DevicePreview` |

---

## Key Rules

1. **Every brand has exactly one Home Slyde** — it's mandatory, not optional
2. **Home Slyde = exactly one slide** — no Frames, no scrolling, just a decision surface
3. **Home Slyde is the entry point** — `slydes.io/{business-slug}` always opens Home Slyde
4. **Child Slydes are deep-linkable** — specific experiences for specific intent
5. **Frames only exist in Child Slydes** — the Home Slyde has no Frames
6. **Home Slyde = decision** — routes attention, doesn't hold it
7. **Child Slydes = immersion** — longer, narrative, emotional
8. **One Child Slyde = One Offering** — property, product, menu, package, experience
9. **Child Slyde Frames follow AIDA** — Hook → How → What → Trust → Proof → Action

---

## Prohibited Terms

Do **NOT** use these terms in docs, code, or UI:

| Don't use | Use instead |
|-----------|-------------|
| Profile | Home Slyde |
| Slide | Frame |
| World | Child Slyde |
| Deck | Slyde |
| Card | Frame |
| Page | Frame |
| Section (for vertical screens) | Frame |

**Exception**: "Profile" may appear in legacy code during migration, but must be replaced.

---

## Legacy Documentation Note

Some older strategy documents may still use deprecated terms:
- "Profile" → **Home Slyde**
- "slide" → **Frame**
- "world" → **Child Slyde**

When updating those documents, follow this guide.

---

## Related Documents

- [HOME-SLYDE-SYSTEM.md](./HOME-SLYDE-SYSTEM.md) - Why the Home Slyde exists
- [HOME-SLYDE-BUILD-SPEC.md](./HOME-SLYDE-BUILD-SPEC.md) - How to build a Home Slyde

---

*Document Status: CANONICAL*
*This is the source of truth for Slydes platform structure.*
