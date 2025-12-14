# SLYDESBUILD.md - Master Wireframe & Build Specification

> **The Portable Blueprint for Slydes**
>
> This document captures every UI pattern, component, and interaction built in WildTrax.
> Copy this to Slydes.io to build the platform with confidence.
>
> **Created**: December 12, 2025
> **Last Updated**: December 14, 2025 (Updated to canonical Frame terminology)
> **Status**: ✅ Production Ready - All endpoints wired, complete wireframe
> **Demo**: `/demo-slyde` route
> **Structure Reference**: See `STRUCTURE.md` for canonical hierarchy

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Platform Structure](#platform-structure)
3. [Device Preview](#device-preview)
4. [Frame Anatomy](#frame-anatomy)
5. [Social Action Stack](#social-action-stack)
6. [Badge System](#badge-system)
7. [Rating Display](#rating-display)
8. [FAQ Sheet](#faq-sheet)
9. [Info Sheet](#info-sheet)
10. [About Sheet](#about-sheet)
11. [Share Sheet](#share-sheet)
12. [Profile Pill](#profile-pill)
13. [CTA Buttons](#cta-buttons)
14. [Slydes Promo Frame](#slydes-promo-frame)
15. [User Flows](#user-flows)
16. [Animations & Transitions](#animations--transitions)
17. [Data Structures](#data-structures)
18. [Color System](#color-system)
19. [Typography](#typography)
20. [Implementation Checklist](#implementation-checklist)
21. [API & Analytics Layer](#api--analytics-layer)

---

## Philosophy

### Built for the Future

- **Mobile-ONLY**: Not responsive, not adaptive. Mobile native.
- **Vertical Video First**: Full-screen immersive content
- **Social Native**: Heart, Share, FAQ on every Frame
- **Instant Gratification**: FAQ answers questions instantly, no waiting

### The TikTok Pattern

Every Frame follows the TikTok content pattern:
- Full-screen media background
- Gradient overlay for text readability
- Social actions on the right
- Content at the bottom
- Swipe to navigate

### Core Principles

1. **Every element earns its place** - No decoration, only function
2. **Backdrop blur = premium** - Use `backdrop-blur-sm` on interactive elements
3. **White on dark** - Text is always white, backgrounds are dark/media
4. **Rounded everything** - `rounded-full` for buttons, `rounded-3xl` for sheets

---

## Platform Structure

> **See `STRUCTURE.md` for the full canonical hierarchy.**

### Quick Reference

| Level | Term | Definition | Shareable? |
|-------|------|------------|------------|
| **0** | **Profile** | Business home page listing all Slydes | ✅ Yes |
| **1** | **Slyde** | A single offering/property/product | ✅ Yes |
| **2** | **Frame** | One vertical screen inside a Slyde | ❌ No |

### URL Structure

```
slydes.io/{business-slug}                    → Profile
slydes.io/{business-slug}/{slyde-slug}       → Slyde (shareable)
slydes.io/{business-slug}/{slyde-slug}?f=3   → Deep-link to Frame 3
```

### Example: Real Estate Agent

```
Profile: slydes.io/jamesestates
├── Slyde: property-1 (Lochside Cabin)
│   ├── Frame 1: Hero exterior
│   ├── Frame 2: Living room
│   ├── Frame 3: Kitchen
│   ├── Frame 4: Bedrooms
│   ├── Frame 5: Garden
│   └── Frame 6: Book a viewing (CTA)
├── Slyde: property-2
└── Slyde: property-3
```

---

## Device Preview

### Purpose
Container that simulates an iPhone for demo/preview purposes.

> **Note**: Previously called "PhoneFrame". Renamed to avoid collision with "Frame" (vertical screen).

### Wireframe

```
┌──────────────────────────────────────┐
│            ┌─────────┐               │  ← Notch (w-32 h-7)
│            │  ● ●    │               │
│            └─────────┘               │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │                                │  │
│  │                                │  │
│  │        FRAME CONTENT           │  │  ← Screen area
│  │                                │  │
│  │                                │  │
│  │                                │  │
│  │                                │  │
│  │       ━━━━━━━━━━━━━━━         │  │  ← Home indicator
│  └────────────────────────────────┘  │
│  ■                              ■    │  ← Side buttons
└──────────────────────────────────────┘
```

### Specifications

| Property | Value |
|----------|-------|
| Frame Width | 280px |
| Frame Height | 580px |
| Frame Radius | 3rem (48px) |
| Frame Padding | 12px (p-3) |
| Frame Background | `bg-gradient-to-b from-gray-800 to-gray-900` |
| Screen Radius | 2.25rem (36px) |
| Notch Width | 128px (w-32) |
| Notch Height | 28px (h-7) |
| Side Buttons | 1px wide, gray-700 |

### TypeScript Interface

```typescript
interface DevicePreviewProps {
  children: React.ReactNode
  className?: string
  enableTilt?: boolean
}
```

---

## Frame Anatomy

### Purpose
A Frame is one vertical screen inside a Slyde. Users swipe vertically through Frames.

### Wireframe

```
┌────────────────────────────────┐
│ ┌──────────┐                   │
│ │  BADGE   │            ♥ 2.4k │  ← Badge top-left, Social stack top-right
│ └──────────┘            ? 12   │
│                         ↗ Share│
│                         ⓘ 3/9  │
│                                │
│                                │
│        [VIDEO/IMAGE BG]        │  ← Full-screen media
│                                │
│                                │
│  ⭐ 5.0 (209 reviews)          │  ← Rating (clickable → reviews Frame)
│                                │
│  HEADLINE                      │  ← Title
│  Subtitle text here            │  ← Subtitle
│                                │
│  ┌────────────────────────┐    │
│  │ W  Business Name     > │    │  ← Profile Pill (Frame 1 only)
│  └────────────────────────┘    │
│                                │
│  ┌────────────────────────┐    │
│  │    📅  Book Now        │    │  ← CTA Button (when present)
│  └────────────────────────┘    │
│                                │
│            ︿                   │  ← Swipe indicator
│        Swipe up                │
└────────────────────────────────┘
```

### Frame Types (AIDA Pattern)

| Type | Purpose | templateType |
|------|---------|--------------|
| **Hook** | Attention grabber, hero shot | `hook` |
| **How** | How it works, process | `how` |
| **What** | What you get, features | `what` |
| **Trust** | Why trust us, credentials | `trust` |
| **Proof** | Reviews, social proof | `proof` |
| **Action** | CTA, booking, next step | `action` |

---

## Social Action Stack

### Purpose
Vertical stack of action buttons on right side of every Frame. Provides social engagement, FAQ access, sharing, and business info.

### Wireframe

```
┌─────────┐
│    ♥    │  Heart icon (filled when liked)
│  2.4k   │  Like count
├─────────┤
│    ?    │  Question mark icon
│ 12 FAQs │  FAQ count
├─────────┤
│    ↗    │  Share icon
│  Share  │  Label
├─────────┤
│    ⓘ    │  Info icon
│   3/9   │  Frame indicator (subtle, small)
└─────────┘
```

### Specifications

| Element | Size | Style |
|---------|------|-------|
| Container | auto | `flex flex-col items-center gap-5` |
| Button Circle | 40x40px | `w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full` |
| Icon | 20x20px | `w-5 h-5 text-white` |
| Label | 10px | `text-[10px] text-white font-medium` |
| Gap between buttons | 20px | `gap-5` |

### TypeScript Interface

```typescript
interface SocialActionStackProps {
  heartCount: number
  isHearted: boolean
  faqCount: number
  onHeartTap: () => void
  onFAQTap: () => void
  onShareTap: () => void
  onInfoTap: () => void
  frameIndicator: string  // e.g., "3/9" - shown below Info button
}
```

---

## Profile Pill

### Purpose
**Business profile badge** displayed on Frame 1 only. Acts as a tappable business identity card that opens AboutSheet.

### Specifications

| Property | Value |
|----------|-------|
| Width | Full width (`w-full`) |
| Height | `py-1.5` (matches CTA button height) |
| Background | `bg-white/10 backdrop-blur-md border border-white/20` |
| Border Radius | `rounded-full` |
| Padding | `py-1.5 pl-1.5 pr-5` (logo sits in left curve) |
| Profile Circle | `w-9 h-9 rounded-full bg-red-600` (accent color) |
| Business Name | `text-base font-semibold text-white flex-1 text-left ml-3` |
| Chevron | `w-4 h-4 text-white/70` (right-aligned) |

---

## Share Sheet

### Purpose
Bottom sheet for sharing the current Slyde across platforms. **No scrolling** - clean 3x3 grid layout.

### Share Options (3x3 Grid)

| Row | Purpose | Platforms |
|-----|---------|-----------|
| **Row 1** | Direct/Personal | Copy Link, WhatsApp, iMessage |
| **Row 2** | Social | Instagram, Facebook, X/Twitter |
| **Row 3** | Professional/Other | LinkedIn, Email, Snapchat |

---

## Data Structures

### Frame Schema

```typescript
interface FrameData {
  id: string
  order: number
  templateType?: 'hook' | 'how' | 'what' | 'trust' | 'proof' | 'action' | 'slydes'
  title: string
  subtitle?: string
  badge?: string
  rating?: number
  reviewCount?: number
  heartCount: number
  faqCount: number
  cta?: {
    text: string
    icon: 'book' | 'call' | 'view' | 'arrow' | 'menu'
    action?: string
  }
  background: {
    type: 'video' | 'image'
    src: string
    position?: string
  }
  accentColor?: string
  infoContent?: FrameInfoContent
}
```

### FAQ Schema

```typescript
interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
  order: number
}
```

### Business Info Schema

```typescript
interface BusinessInfo {
  id: string
  name: string
  tagline?: string
  location: string
  rating: number
  reviewCount: number
  credentials: Array<{
    icon: string
    label: string
    value: string
  }>
  about: string
  highlights?: string[]
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  logo?: string
  accentColor: string
}
```

### Slyde Schema (Container)

```typescript
interface SlydeData {
  id: string
  slug: string
  name: string
  description?: string
  frames: FrameData[]
  faqs: FAQItem[]
  business: BusinessInfo
  createdAt: string
  updatedAt: string
}
```

---

## Implementation Checklist

### Components

- [x] DevicePreview - Device container (formerly PhoneFrame)
- [x] SlydeScreen - Frame container with navigation
- [x] SocialActionStack - Heart, FAQ, Share, Info buttons + Frame indicator
- [x] Badge - Top-left credential pill
- [x] RatingDisplay - Stars with count, **clickable** → reviews Frame
- [x] FAQSheet - Bottom sheet with accordion
- [x] InfoSheet - **Hybrid sheet** with Frame-specific + business content
- [x] AboutSheet - **Business overview sheet** (opened from ProfilePill)
- [x] ShareSheet - **3x3 grid** with 9 share platforms
- [x] ProfilePill - **Business badge** on Frame 1 (opens AboutSheet)
- [x] CTAButton - Primary action button with **real endpoints**
- [x] SlydesPromoFrame - Final Frame for lead generation

### Features

- [x] Frame navigation (swipe/tap/drag)
- [x] Heart toggle with animation
- [x] FAQ accordion expand/collapse
- [x] FAQ search
- [x] Ask question form
- [x] Share sheet with 9 platforms
- [x] ProfilePill on Frame 1 (opens AboutSheet)
- [x] Frame indicator ("3/9") under Info button
- [x] CTA buttons wired to real actions
- [x] Rating display clickable → navigates to reviews Frame
- [x] Drag-to-close gesture on AboutSheet (iOS-style)

---

## API & Analytics Layer (For Slydes.io with Supabase)

### Data Layer Abstraction

```typescript
interface SlydesAPI {
  // Data fetching
  getSlyde(businessSlug: string, slydeSlug: string): Promise<SlydeData>
  getSlydes(businessSlug: string): Promise<SlydeData[]>
  getBusiness(businessSlug: string): Promise<BusinessInfo>
  
  // User actions
  submitQuestion(slydeId: string, question: string): Promise<void>
  trackHeart(frameId: string, hearted: boolean): Promise<void>
  trackShare(slydeId: string, platform: string): Promise<void>
}
```

### Analytics Events

```typescript
interface AnalyticsEvent {
  frameView: { frameId: string, position: number, slydeId: string }
  sessionStart: { slydeId: string, referrer: string }
  heartTap: { frameId: string, hearted: boolean }
  faqOpen: { frameId: string }
  shareClick: { platform: string, slydeId: string }
  ctaClick: { frameId: string, ctaText: string, action: string }
}
```

---

## Terminology Migration

| Old Term | New Term | Notes |
|----------|----------|-------|
| Slide | Frame | Vertical screen inside a Slyde |
| SlideData | FrameData | Data interface |
| slides[] | frames[] | Array property |
| World | Slyde | Shareable experience (Camping/Just Drive are now separate Slydes) |
| WorldConfig | *(deleted)* | No longer needed |
| PhoneFrame | DevicePreview | Avoids collision with "Frame" |
| slideIndicator | frameIndicator | UI label |

---

*Document Status: ✅ PRODUCTION READY*
*Updated to canonical Frame terminology per STRUCTURE.md*
