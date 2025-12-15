# Slydes Demo System Map

> **Stage 0 Documentation**
> Complete breakdown of the `/demo-slyde` system into discrete modules.
> **Updated**: December 14, 2025 (Canonical Frame terminology per STRUCTURE.md)

---

## Overview

The Slydes Demo (`/demo-slyde`) is a TikTok-style mobile experience built as a proof of concept. This document maps every component, data flow, and interaction point—preparing for productization.

**Goal**: Turn the static demo into a live, CMS-driven, persistence-backed system.

**Terminology**: See `STRUCTURE.md` for canonical hierarchy (Home Slyde → Child Slyde → Frame; HQ label = Profile).

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              /demo-slyde                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       DevicePreview                                  │   │
│  │  ┌───────────────────────────────────────────────────────────────┐  │   │
│  │  │                      SlydeScreen                               │  │   │
│  │  │                                                                │  │   │
│  │  │  ┌─────────────┐    ┌─────────────────────────────────────┐   │  │   │
│  │  │  │   Badge     │    │      Background Media                │   │  │   │
│  │  │  └─────────────┘    │      (video/image)                   │   │  │   │
│  │  │                     └─────────────────────────────────────┘   │  │   │
│  │  │                                                                │  │   │
│  │  │  ┌─────────────────────────────────────────┐  ┌────────────┐  │  │   │
│  │  │  │           Tap/Swipe Zone                │  │  Social    │  │  │   │
│  │  │  │           (navigation)                  │  │  Action    │  │  │   │
│  │  │  │                                         │  │  Stack     │  │  │   │
│  │  │  │                                         │  │  ├─ Heart  │  │  │   │
│  │  │  │                                         │  │  ├─ FAQ    │  │  │   │
│  │  │  │                                         │  │  ├─ Share  │  │  │   │
│  │  │  └─────────────────────────────────────────┘  │  └─ Info   │  │  │   │
│  │  │                                               └────────────┘  │  │   │
│  │  │  ┌─────────────────────────────────────────────────────────┐  │  │   │
│  │  │  │  Bottom Content                                         │  │  │   │
│  │  │  │  ├─ RatingDisplay (clickable → reviews)                 │  │  │   │
│  │  │  │  ├─ Title / Subtitle                                    │  │  │   │
│  │  │  │  ├─ ProfilePill (Frame 1) OR CTAButton (action Frame)   │  │  │   │
│  │  │  │  └─ Swipe Indicator                                     │  │  │   │
│  │  │  └─────────────────────────────────────────────────────────┘  │  │   │
│  │  │                                                                │  │   │
│  │  │  ┌─ Bottom Sheets (overlays) ─────────────────────────────┐   │  │   │
│  │  │  │  FAQSheet | InfoSheet | ShareSheet | AboutSheet         │   │  │   │
│  │  │  └─────────────────────────────────────────────────────────┘   │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Module Breakdown

### 1. Player Module

**Purpose**: Navigation, Frame lifecycle, playback state.

**Components**:
- `SlydeScreen.tsx` (main orchestrator)

**State**:
- `currentFrame: number`
- `autoAdvance: boolean`
- Sheet visibility flags (`showFAQ`, `showInfo`, `showShare`, `showAbout`)

**Inputs**:
- Tap (anywhere in tap zone) → next Frame
- Swipe up → next Frame
- Swipe down → previous Frame
- Keyboard (arrows, space) → navigate

**Outputs**:
- Current Frame index
- Frame data for rendering
- Navigation callbacks for child components

**Current Data Source**: `frameData.ts` (static)

**Target Data Source**: Supabase (`frames` table)

---

### 2. Hearts Module (Engagement)

**Purpose**: Like/save functionality with counts.

**Components**:
- `SocialActionStack.tsx` (heart button)

**State**:
- `isHearted: Record<string, boolean>` (per-Frame liked state)
- `heartCounts: Record<string, number>` (per-Frame counts)

**Interactions**:
- Tap heart → toggle liked state
- Increment/decrement count

**Current Persistence**: None (local state only, resets on refresh)

**Target Persistence**: Supabase (`heart_count` field on `frames` table)

---

### 3. FAQ Module

**Purpose**: Knowledge base with search + question submission.

**Components**:
- `FAQSheet.tsx`

**Features**:
- Search across all FAQs (global)
- Expandable accordion per FAQ
- "Ask [Business]" form → submit question

**State**:
- `searchQuery: string`
- `expandedId: string | null`
- `showAskForm: boolean`
- `submitted: boolean`

**Current Data Source**: `campingFAQs` / `justDriveFAQs` (static)

**Current Submission**: `console.log()` (stub)

**Target Data Source**: Supabase (`faqs` table)

**Target Submission**: Supabase (`questions` table insert)

---

### 4. Reviews Module

**Purpose**: Social proof display.

**Components**:
- `RatingDisplay.tsx` (star rating + count, clickable)
- Info sheet review highlights

**Data**:
- `wildtraxReviews` array
- `wildtraxFeaturedReviews` (IDs of featured)

**Interactions**:
- Tap rating → navigate to "proof" Frame

**Current Data Source**: `frameData.ts` (static)

**Target Data Source**: Supabase (`reviews` table)

---

### 5. Share Module

**Purpose**: Share current Slyde to social platforms.

**Components**:
- `ShareSheet.tsx`

**Platforms** (3×3 grid):
| Row | Platforms |
|-----|-----------|
| 1 | Copy, WhatsApp, iMessage |
| 2 | Instagram, Facebook, X |
| 3 | LinkedIn, Email, Snapchat |

**Current URL**: `window.location.href`

**Target URL**: Canonical deep-link (`/{businessSlug}/{slydeSlug}?f={frameIndex}`)

---

### 6. Info Module

**Purpose**: Frame-specific context + business details.

**Components**:
- `InfoSheet.tsx`

**Content**:
- Frame headline + description
- Frame items/highlights
- Collapsible business card with contact

**Current Data Source**: `frameContent?.infoContent` (static per Frame)

**Target Data Source**: Supabase (embedded in `frames.info_content`)

---

### 7. About Module

**Purpose**: Business overview.

**Components**:
- `AboutSheet.tsx`
- `ProfilePill.tsx` (trigger on Frame 1)

**Features**:
- Business about section (collapsible)
- Contact buttons

**Current Data Source**: `wildtraxBusiness` (static)

**Target Data Source**: Supabase (`businesses` table)

---

## Data Flow (Current)

```
┌─────────────────┐
│  frameData.ts   │  (static TypeScript)
│  ├─ campingFrames
│  ├─ justDriveFrames
│  ├─ campingFAQs
│  ├─ justDriveFAQs
│  ├─ wildtraxReviews
│  └─ wildtraxBusiness
└────────┬────────┘
         │
         │ import
         ▼
┌─────────────────┐
│  SlydeScreen    │
│  (component)    │
└────────┬────────┘
         │
         │ props
         ▼
┌─────────────────┐
│  Child          │
│  Components     │
└─────────────────┘
```

---

## Data Flow (Target)

```
┌─────────────────┐
│  Supabase       │
│  ├─ businesses
│  ├─ slydes
│  ├─ frames
│  ├─ faqs
│  ├─ reviews
│  └─ questions
└────────┬────────┘
         │
         │ SQL queries
         ▼
┌─────────────────┐
│  SlydesAPI      │  (interface)
│  └─ supabase-impl
└────────┬────────┘
         │
         │ React Context
         ▼
┌─────────────────┐
│  SlydesProvider │
└────────┬────────┘
         │
         │ hooks
         ▼
┌─────────────────┐
│  SlydeScreen    │
│  (component)    │
└────────┬────────┘
         │
         │ props
         ▼
┌─────────────────┐
│  Child          │
│  Components     │
└─────────────────┘
```

---

## File Inventory

### Demo Components (`src/components/slyde-demo/`)

| File | Purpose | Module |
|------|---------|--------|
| `index.ts` | Barrel exports | - |
| `SlydeScreen.tsx` | Main orchestrator | Player |
| `PhoneFrame.tsx` | Device mockup (→ rename to DevicePreview) | Player |
| `SocialActionStack.tsx` | Heart/FAQ/Share/Info buttons | Engagement |
| `Badge.tsx` | Top-left credential | Player |
| `RatingDisplay.tsx` | Star rating | Reviews |
| `ProfilePill.tsx` | Business badge (Frame 1) | About |
| `CTAButton.tsx` | Action button | Player |
| `FAQSheet.tsx` | FAQ bottom sheet | FAQ |
| `InfoSheet.tsx` | Info bottom sheet | Info |
| `ShareSheet.tsx` | Share bottom sheet | Share |
| `AboutSheet.tsx` | About bottom sheet | About |
| `SlydesPromoSlide.tsx` | Slydes.io promo Frame | Player |
| `slideData.ts` | Static data (→ rename to frameData.ts) | Data |
| `worldsData.ts` | *(deprecated - Camping/Just Drive are now separate Slydes)* | - |

### Demo Page (`src/app/demo-slyde/`)

| File | Purpose |
|------|---------|
| `page.tsx` | Demo host page |

---

## Interaction Matrix

| Trigger | Handler | Current Action | Target Action |
|---------|---------|----------------|---------------|
| Tap Frame | `nextFrame()` | Increment index | Same |
| Swipe up | `nextFrame()` | Increment index | Same |
| Swipe down | `prevFrame()` | Decrement index | Same |
| Tap heart | `handleHeartTap()` | Toggle local state | Persist to Supabase |
| Tap FAQ | `setShowFAQ(true)` | Open sheet | Same |
| Tap Share | `setShowShare(true)` | Open sheet | Same |
| Tap Info | `setShowInfo(true)` | Open sheet | Same |
| Tap ProfilePill | `setShowAbout(true)` | Open sheet | Same |
| Tap rating | `setCurrentFrame(proofIndex)` | Jump to reviews | Same |
| Submit question | `console.log()` | Log only | Create Supabase row |
| Share platform | `window.open(url)` | Open platform | Same (with canonical URL) |

---

## Terminology Migration

| Old Term | New Term | Notes |
|----------|----------|-------|
| Slide | Frame | Vertical screen inside a Slyde |
| slides[] | frames[] | Array property |
| slideData.ts | frameData.ts | Data file |
| currentSlide | currentFrame | State variable |
| nextSlide() | nextFrame() | Function name |
| World | Slyde | Camping/Just Drive are now separate Slydes |
| PhoneFrame | DevicePreview | Avoid collision with "Frame" |

---

## Next Steps

1. **Rename files** → `slideData.ts` → `frameData.ts`, `PhoneFrame.tsx` → `DevicePreview.tsx`
2. **Update API interface** → `02-API-INTERFACE.md` ✅
3. **Update build stages** → `03-BUILD-STAGES.md`
4. **Implement Supabase adapter** → `src/lib/slydes/supabase-adapter.ts`

---

*Created: Stage 0 of Slydes Demo Productization*
*Last Updated: December 14, 2025 (Canonical Frame terminology)*
