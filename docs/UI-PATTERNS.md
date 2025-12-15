# Slydes Master Specification

> **The Single Source of Truth**
>
> This document consolidates everything about how Slydes works:
> structure, UI patterns, button behaviors, sheets, navigation, and frames.
>
> **Created**: December 15, 2025
> **Status**: CANONICAL - Master Reference

---

## Table of Contents

1. [Platform Structure](#platform-structure)
2. [Content Hierarchy](#content-hierarchy)
3. [Home Slyde](#home-slyde)
4. [Child Slydes](#child-slydes)
5. [Frames](#frames)
6. [Categories & Inventory](#categories--inventory)
7. [Button Behavior](#button-behavior)
8. [Sheet Components](#sheet-components)
9. [Navigation Patterns](#navigation-patterns)
10. [URL Structure](#url-structure)
11. [Editor Modes](#editor-modes)

---

## Platform Structure

### The Core Hierarchy

```
Home Slyde (video-first entry point + drawer)
   └── Child Slyde (shareable multi-frame experience)
          └── Frame (one vertical screen)
```

### With Categories & Inventory

```
Home Slyde (video + drawer)
   └── Categories (shown in drawer)
          └── Category Slyde (Child Slyde, type='category')
                 └── Inventory Grid (if has_inventory=true)
                        └── Item Slyde (Child Slyde, type='item')
```

### Quick Reference Table

| Level | Term | What It Is | Shareable? |
|-------|------|------------|------------|
| **0** | **Home Slyde** | Video-first entry point with category drawer | Yes |
| **1** | **Child Slyde** | Multi-frame immersive experience | Yes |
| **2** | **Frame** | One vertical screen inside a Child Slyde | No (part of sequence) |

---

## Content Hierarchy

### Home Slyde (Level 0)

**Definition**: The brand's mandatory entry point. One per brand.

**Structure**:
- One full-screen video (9:16 aspect ratio)
- Swipe-up category drawer (3-6 categories max)
- Brand overlay (name, tagline, rating)

**Key Rule**: No frames. The Home Slyde is its own level.

### Child Slyde (Level 1)

**Definition**: A shareable, self-contained experience for one offering.

**Types**:
- **Category Slyde**: Linked to a category (e.g., "Camping", "Just Drive")
- **Item Slyde**: Linked to an inventory item (e.g., specific vehicle, property)

**Structure**:
- Multiple frames (typically 4-10)
- Follows AIDA pattern: Hook → How → What → Trust → Proof → Action

### Frame (Level 2)

**Definition**: One vertical screen inside a Child Slyde.

**Key Rule**: Not directly shareable - always accessed as part of a Slyde sequence.

**Examples**: "Hero Shot", "Features", "Reviews", "Book Now"

---

## Home Slyde

### Visual Layout

```
┌─────────────────────────────────────────┐
│ [Sound]                                 │  ← Sound toggle (top-left)
│                                         │
│           FULL-SCREEN VIDEO             │
│                                         │
│                                   [♥]   │  ← Heart
│                                   [↗]   │  ← Share
│                                   [ⓘ]   │  ← Info → AboutSheet
│                                         │
│ ★ 4.9 (847 reviews)                     │  ← Rating (optional)
│ Business Name                           │
│ Tagline goes here                       │
│                                         │
│ [    WildTrax    ]                      │  ← ProfilePill → opens drawer
│         ∧                               │
│   Swipe up to explore                   │  ← Hint animation
└─────────────────────────────────────────┘
```

### State Model

**State 1: Video Playing**
- Full-screen video loops
- Social actions visible on right
- ProfilePill at bottom

**State 2: Drawer Open**
- Video dims (brightness 0.4)
- Category cards appear
- Swipe down to dismiss

### Interactions

| Element | Action | Result |
|---------|--------|--------|
| Sound toggle | Tap | Toggle video mute |
| Heart | Tap | Brand-level like |
| Share | Tap | Opens ShareSheet |
| Info (ⓘ) | Tap | Opens **AboutSheet** (org info) |
| ProfilePill | Tap | Opens category drawer |
| Swipe up | Gesture | Opens category drawer |
| Category card | Tap | Navigate to Category Slyde |

---

## Child Slydes

### Visual Layout (Category Context)

```
┌─────────────────────────────────────────┐
│  [<]  [⭐ Featured]                     │  ← Back button + Badge
│                                         │
│           FRAME CONTENT                 │
│                                         │
│                                   [♥]   │  ← Heart (frame-level)
│                                   [?]   │  ← FAQ → FAQSheet
│                                   [↗]   │  ← Share → ShareSheet
│                                   [ⓘ]   │  ← Info → InfoSheet
│                                   1/3   │  ← Frame indicator
│                                         │
│ Frame Title                             │
│ Frame subtitle or description           │
│                                         │
│ [      Primary CTA      ]               │  ← Frame-specific CTA
│         ∧                               │
│      Swipe up                           │
└─────────────────────────────────────────┘
```

### Key Differences from Home Slyde

| Element | Home Slyde | Child Slyde |
|---------|------------|-------------|
| Back button | N/A | Shows in top-left |
| Badge | N/A | Shows next to back button |
| ProfilePill | Visible | **Hidden** |
| FAQ button | Hidden | Visible |
| Info button | Opens AboutSheet | Opens InfoSheet |
| Heart | Brand-level | Frame-level |

### Navigation

- **Tap left side**: Previous frame
- **Tap right side**: Next frame
- **Swipe up**: Go to first frame
- **Back button**: Return to Home Slyde

---

## Frames

### What Is a Frame?

A Frame is one vertical screen in a Child Slyde. Users swipe through frames to experience the story.

### Frame Data Structure

Each frame contains:
- **Background**: Image, video, or gradient
- **Badge**: Optional label (e.g., "⭐ Featured", "🔥 Limited")
- **Title**: Main headline
- **Subtitle**: Supporting text
- **CTA**: Optional action button
- **Info**: Headline, description, bullet points (shown in InfoSheet)

### AIDA Pattern

Frames typically follow this sequence:

1. **Hook** (Attention): Eye-catching hero shot
2. **How** (Interest): How the experience works
3. **What** (Desire): What's included
4. **Trust** (Trust): Credentials, guarantees
5. **Proof** (Social): Reviews, testimonials
6. **Action** (Action): Book now, contact, learn more

---

## Categories & Inventory

### What Are Categories?

Categories are the items shown in the Home Slyde drawer. Each category links to a Category Slyde.

**Limits by Plan**:
| Plan | Max Categories |
|------|----------------|
| Free | 4 |
| Pro | 6 |
| Enterprise | Unlimited |

### What Is Inventory?

Inventory is an **optional paid feature** that lets categories contain a list of items.

**Without Inventory** (default):
- Category Slyde ends with a CTA (e.g., "Book Service")
- User completes action externally

**With Inventory** (Pro/Enterprise):
- Category Slyde has "View All" button on final frame
- Opens Inventory Grid showing all items
- Each item links to an Item Slyde

### Inventory Grid

The Inventory Grid displays items in a scrollable list/grid format.

**Each item shows**:
- Thumbnail image
- Title (e.g., "BMW 320d M Sport")
- Subtitle (e.g., "2022 - 15,000 miles")
- Price (e.g., "£28,995")
- Badge (optional, e.g., "Featured", "New In")

**Tap item** → Opens that item's Item Slyde

### User Journey: Without Inventory

```
Home Slyde (video)
    │
    │ swipe up / tap pill
    ▼
Category Drawer
    │
    │ tap "Services"
    ▼
Category Slyde: Services
    │
    │ Frame 1: Hero
    │ Frame 2: MOT Testing
    │ Frame 3: Full Servicing
    │ Frame 4: Repairs
    │ Frame 5: "Book Service" CTA
    │
    │ tap CTA
    ▼
External action (booking page)
```

### User Journey: With Inventory

```
Home Slyde (video)
    │
    │ swipe up / tap pill
    ▼
Category Drawer
    │
    │ tap "Vehicles"
    ▼
Category Slyde: Vehicles
    │
    │ Frame 1: Hero
    │ Frame 2: Quality Pre-Owned
    │ Frame 3: Every Vehicle Inspected
    │ Frame 4: "View All 12 Vehicles" CTA
    │
    │ tap "View All"
    ▼
Inventory Grid (list of vehicles)
    │
    │ tap "BMW 320d"
    ▼
Item Slyde: BMW 320d
    │
    │ Frame 1: Hero shot
    │ Frame 2: Interior
    │ Frame 3: Performance
    │ Frame 4: Full History
    │ Frame 5: "Enquire Now" CTA
    │
    │ tap CTA
    ▼
External action (enquiry form)
```

### Key Principle: Immersion First, Lists Earned

Users must experience the Category Slyde **before** seeing the inventory grid.
No shortcuts to inventory. The grid is earned through immersion.

### Frame Limits

| Slyde Type | Min Frames | Max Frames |
|------------|------------|------------|
| Category | 2 | 6 |
| Item | 2 | 10 |
| Standalone | 1 | 10 |

---

## Button Behavior

### Quick Reference by Context

| Button | Home Slyde | Child Slyde (Category) |
|--------|------------|------------------------|
| **Info (ⓘ)** | Opens **AboutSheet** (org info) | Opens **InfoSheet** (frame info) |
| **Share** | Opens ShareSheet (home link) | Opens ShareSheet (slyde link) |
| **Heart** | Brand-level like | Frame-level like |
| **FAQ** | **Hidden** | Opens FAQSheet |
| **Back (<)** | N/A | Returns to Home Slyde |
| **ProfilePill** | Opens category drawer | **Hidden** |

### Info Button Logic

**Home Slyde**: Shows organization-level information
- Business name & logo
- Location
- About text / highlights
- Contact options (Phone, Email, Message)

**Why?** The Home Slyde represents the entire business.

**Child Slyde**: Shows frame-specific information
- Frame headline (e.g., "Hook Frame")
- Frame description
- Frame items (bullet points)
- Collapsible business contact at bottom

**Why?** Inside a Child Slyde, each frame has its own story.

### ProfilePill Logic

**Home Slyde**: Visible - primary "explore" affordance
- Tap opens category drawer
- Shows business name with accent color

**Child Slyde**: Hidden
- You're already inside the business context
- Back button provides navigation instead

---

## Sheet Components

### AboutSheet

**Triggered by**: Info button on Home Slyde

**Contents**:
1. Header: Business logo, name, location
2. About section: Expandable text + highlights
3. Contact buttons: Phone, Email, Message

**Use case**: "Tell me about this business"

### InfoSheet

**Triggered by**: Info button on Child Slyde frames

**Contents**:
1. Header: "Frame X of Y" + frame title
2. Frame headline & description
3. Frame items (bullet points)
4. Collapsible business contact (bottom)

**Use case**: "Tell me more about what I'm looking at"

### ShareSheet

**Triggered by**: Share button (any context)

**Contents**:
- Share options: Instagram, WhatsApp, Copy Link
- Context-aware URL:
  - Home Slyde: `slydes.io/{business-slug}`
  - Child Slyde: `slydes.io/{business-slug}/{slyde-slug}`

### FAQSheet

**Triggered by**: FAQ button on Child Slyde frames

**Contents**:
- Existing FAQs for this frame
- "Ask a question" input
- Business contact quick-access

**Note**: Not available on Home Slyde (FAQ is frame-specific).

### CategoryDrawer

**Triggered by**: ProfilePill tap, Swipe up, or Hint tap on Home Slyde

**Contents**:
- 3-6 category cards
- Optional: Primary CTA button
- Swipe down to dismiss

**Not triggered by**: Info button (Info → AboutSheet, not drawer)

---

## Navigation Patterns

### From Home Slyde

```
Home Slyde
    │
    ├── ProfilePill tap ──→ Category Drawer
    ├── Swipe up ─────────→ Category Drawer
    ├── Info button ──────→ AboutSheet
    ├── Share button ─────→ ShareSheet
    └── Heart button ─────→ Toggle brand like
```

### From Child Slyde

```
Child Slyde (Frame N)
    │
    ├── Back button ──────→ Home Slyde
    ├── Tap left ─────────→ Previous Frame
    ├── Tap right ────────→ Next Frame
    ├── Info button ──────→ InfoSheet (frame info)
    ├── FAQ button ───────→ FAQSheet
    ├── Share button ─────→ ShareSheet
    └── Heart button ─────→ Toggle frame like
```

### Back Navigation

| From | To | Trigger |
|------|-----|---------|
| Child Slyde | Home Slyde | Back button (top-left) |
| Category Drawer | Home Slyde (video) | Swipe down |
| Any Sheet | Previous view | Sheet close |

---

## URL Structure

```
slydes.io/{business-slug}                  → Home Slyde
slydes.io/{business-slug}/{slyde-slug}     → Child Slyde
slydes.io/{business-slug}/{slyde-slug}?f=3 → Child Slyde at Frame 3
```

### Examples

| URL | Opens |
|-----|-------|
| `slydes.io/wildtrax` | WildTrax Home Slyde |
| `slydes.io/wildtrax/camping` | Camping Child Slyde |
| `slydes.io/wildtrax/camping?f=3` | Camping Slyde, Frame 3 |

---

## Editor Modes

### Home Slyde Editing

The unified editor shows:
- **Navigator**: Category list, category settings
- **Preview**: HomeSlydeScreen (video + drawer preview)
- **Inspector**: Brand, Video, Categories, CTA, Settings

### Child Slyde Editing

When editing a Child Slyde's frames:
- **Navigator**: "← Back to Home", Frame list (draggable)
- **Preview**: SlydeScreen with `context="category"` (back button visible)
- **Inspector**: Content, CTA, Info, Style panels

### Breadcrumb Pattern

```
Home Slyde > {Category Name}
```

Example: `Home Slyde > Services`

Click "Home Slyde" to return to Home level editing.

---

## Implementation Checklist

### SlydeScreen.tsx
- [x] `context` prop: `'standalone' | 'category'`
- [x] `onBack` prop: callback for back button
- [x] Back button: shows when `context === 'category'`
- [x] Badge position: `ml-10` when `context === 'category'`
- [x] ProfilePill: hidden when `context === 'category'`

### HomeSlydeScreen.tsx
- [x] Info button → `setAboutOpen(true)` (not drawer)
- [x] ProfilePill → `setDrawerOpen(true)`
- [x] AboutSheet with business info
- [x] Sound toggle (optional via `showSound`)

### CategorySlydeView.tsx
- [x] Back button in top-left
- [x] SocialActionStack with FAQ visible
- [x] Frame navigation (tap left/right)

### Editor (HomeSlydeEditorClient.tsx)
- [x] `context="category"` passed to SlydeScreen preview
- [x] `onBack` handler returns to Home level
- [x] Breadcrumb navigation

---

## Terminology Reference

### Approved Terms

| Term | Definition |
|------|------------|
| Home Slyde | Video-first entry point with drawer |
| Child Slyde | Multi-frame shareable experience |
| Category Slyde | Child Slyde linked to a category |
| Item Slyde | Child Slyde linked to inventory item |
| Frame | One vertical screen in a Child Slyde |
| ProfilePill | Bottom pill that opens drawer (Home only) |

### Prohibited Terms

| Don't Use | Use Instead |
|-----------|-------------|
| Profile (for public entry) | Home Slyde |
| Slide | Frame |
| World | Child Slyde |
| Deck | Slyde |
| Card | Frame |
| Page | Frame |

---

## Related Documents

For deep dives into specific topics:

- [STRUCTURE.md](./STRUCTURE.md) - Platform hierarchy (summary)
- [HOME-SLYDE-SYSTEM.md](./HOME-SLYDE-SYSTEM.md) - Why Home Slyde exists
- [HOME-SLYDE-BUILD-SPEC.md](./HOME-SLYDE-BUILD-SPEC.md) - Home Slyde technical spec
- [CATEGORY-INVENTORY-FLOW.md](./CATEGORY-INVENTORY-FLOW.md) - Data architecture + DB schemas
- [SLYDESBUILD.md](./SLYDESBUILD.md) - Original wireframe spec

---

*Document Status: CANONICAL*
*This is the master reference for Slydes platform behavior.*
