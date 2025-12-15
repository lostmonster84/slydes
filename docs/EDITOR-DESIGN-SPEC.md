# Slydes Editor Design Specification

> **"The editor should feel like the product it creates."**
>
> **Version**: 1.0  
> **Date**: December 14, 2025  
> **Last Updated**: December 15, 2025  
> **Status**: Vision Document

---

## Executive Summary

This document defines the visual and functional design of the Slydes editor — the tool businesses use to create their vertical video experiences.

**The editor is NOT:**
- A general-purpose website builder
- A blank canvas with endless options
- A desktop-first tool adapted for mobile

**The editor IS:**
- An opinionated, constrained creation tool
- A vertical-first experience that mirrors the product
- A fast path from idea to published slyde

**North Star**: A business owner should go from zero to published slyde in **under 5 minutes**.

### A Note on “Deeper Conversions”

Slydes is not a social network — but it **can** (and should) use **subtle, purposeful social acceptance signals** to improve conversion.

Example: if a customer sees a heart icon with **3,000** next to it, they naturally infer **popularity** and **reduced risk** (“people like this place”), which increases the likelihood they take action.

In this spec, these are treated as **conversion infrastructure** (“signals”), not social features (“mechanics”).

---

## Core Philosophy

### From the Founder Memo

> "Slydes is not a website builder. Slydes is a **mobile attention format for the open web**."

The editor must embody this. Every design decision should ask:

1. **Does this make creation faster?**
2. **Does this guide users toward better slydes?**
3. **Does this reinforce vertical-first thinking?**

### From What We Will Never Build

The editor must **never** include:

- ❌ Horizontal carousels or galleries
- ❌ Multi-page navigation systems
- ❌ Complex theming with hundreds of options
- ❌ Blog/long-form content tools
- ❌ SEO optimization features
- ❌ "Build anything" flexibility

### Conversion Surfaces (Including Popularity Signals)

Slydes exists to **finish attention**. The editor should help creators place conversion surfaces intentionally:

- **Primary conversion**: CTA button (Book / Call / Directions / View Menu)
- **Secondary conversion**: lightweight **popularity signal** (heart + count)
- **Trust conversion**: rating/reviews, awards, badges

**Rule**: signals are allowed when they help users decide faster. Mechanics are not allowed when they create a social loop.

### The Constraint Principle

> "If everything is allowed, nothing converts."

The editor succeeds by being **opinionated**. Users choose from templates and pre-defined options. They **decide**, not design.

---

## Desktop Editor Layout

### Three-Panel Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                           TOOLBAR                                   │
│  [Logo]     Project Name           [Preview] [Undo] [Publish ▼]    │
├──────────┬─────────────────────────────────────────┬───────────────┤
│          │                                         │               │
│  SLYDES  │                                         │   INSPECTOR   │
│  PANEL   │           CANVAS                        │    PANEL      │
│          │                                         │               │
│  ┌─────┐ │      ┌─────────────────────┐           │  ┌─────────┐  │
│  │  1  │ │      │                     │           │  │ Content │  │
│  └─────┘ │      │                     │           │  ├─────────┤  │
│  ┌─────┐ │      │                     │           │  │ Style   │  │
│  │  2  │◄│      │    PHONE MOCKUP     │           │  ├─────────┤  │
│  └─────┘ │      │    (Live Preview)   │           │  │ Actions │  │
│  ┌─────┐ │      │                     │           │  └─────────┘  │
│  │  3  │ │      │                     │           │               │
│  └─────┘ │      └─────────────────────┘           │  [Fields]     │
│  ┌─────┐ │                                         │               │
│  │  4  │ │      ↑↓ Swipe to navigate              │               │
│  └─────┘ │                                         │               │
│  ┌ ─ ─ ┐ │                                         │               │
│  │ + │ │ │                                         │               │
│  └ ─ ─ ┘ │                                         │               │
│          │                                         │               │
└──────────┴─────────────────────────────────────────┴───────────────┘
```

### Panel Specifications

| Panel | Width | Purpose |
|-------|-------|---------|
| **Slydes Panel** | 280px fixed | Vertical list of all slydes in the flow |
| **Canvas** | Flexible (remaining) | Live phone preview — the star of the show |
| **Inspector** | 320px fixed | Context-aware editing controls |

### Why This Layout Works

1. **Slydes Panel on left** — Mirrors the vertical swipe experience
2. **Phone in center** — Users see exactly what customers will see
3. **Inspector on right** — Standard pattern (Figma, VS Code, etc.)

---

## Apple HIG (macOS) — Desktop Editor Chrome

**Decision**: The editor is a desktop tool. Its chrome should follow **Apple Human Interface Guidelines for macOS** (not iOS).  
This applies to the **editor UI** (panels, lists, inspector, toolbar) — the phone preview remains the canonical Slyde experience.

### What “macOS feel” means in Slydes
- **Spacious density**: cards breathe; avoid compressed list rows.
- **Clear hierarchy**: left list → center preview → right inspector, with calm separators.
- **Translucent materials**: frosted panels, subtle borders, elevated graphite surfaces in dark mode.
- **Controls**:
  - **Segmented control** for inspector tabs (sliding selection pill)
  - **macOS switch** for on/off (solid on-state, smooth thumb)
  - Inputs with **inset depth** + visible focus ring
- **Selection**: solid tint + subtle ring (avoid gradients as selection states).
- **Drag & drop**:
  - “Lift” the dragged card (custom drag preview / shadow)
  - Drop indicator animates smoothly **without** pushing the list (no layout shift)
  - Allow drag from the whole card; grip is optional affordance

### Do / Don’t
- **Do**: make the editor feel like Finder/Notes/Raycast-level polish.
- **Don’t**: turn desktop panels into iOS Settings (tight rows, cramped controls).

## Toolbar

### Structure

```
┌────────────────────────────────────────────────────────────────────┐
│  [Logo]     Highland Bites           [Preview] [Undo] [Publish ▼]  │
└────────────────────────────────────────────────────────────────────┘
```

### Left Section
- **Logo**: Links back to dashboard
- **Project Name**: Editable inline, shows business name

### Center Section
- **Status Indicator**: "All changes saved" / "Saving..." / "Draft"

### Right Section
- **Preview Button**: Opens full-screen preview mode
- **Undo/Redo**: Standard undo functionality
- **Publish Button**: Primary CTA with dropdown
  - Publish Now
  - Schedule
  - Share Preview Link

### Visual Style

```css
/* Toolbar */
background: #323232;
border-bottom: 1px solid #3a3a3a;
padding: 16px 24px;

/* Publish Button */
background: #2563EB; /* Leader Blue */
color: white;
border-radius: 8px;
padding: 8px 16px;
font-weight: 500;
```

---

## Slydes Panel (Left)

### Purpose

The Slydes Panel shows all slydes in the current flow as a **vertical list**. This reinforces the vertical-only mental model.

### Slyde Card Structure

```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │                   │  │
│  │   [Video Frame]   │  │  ← Actual thumbnail preview
│  │                   │  │
│  └───────────────────┘  │
│  Hero Video             │  ← Slyde name
│  Slyde 1 of 6           │  ← Position in flow
└─────────────────────────┘
```

### Card Specifications

| Property | Value |
|----------|-------|
| Width | 100% of panel (with padding) |
| Thumbnail Aspect | 9:16 (matches phone) |
| Thumbnail Height | ~140px |
| Border Radius | 12px |
| Spacing Between | 8px |

### States

**Default State:**
```css
background: transparent;
border: 1px solid transparent;
```

**Hover State:**
```css
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.1);
```

**Selected State:**
```css
background: #2563EB; /* Leader Blue */
color: white;
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
```

### Interactions

1. **Click** — Select slyde, show in canvas, update inspector
2. **Drag** — Reorder slydes vertically
3. **Right-click** — Context menu (Duplicate, Delete, Move Up/Down)

### Add Slyde Button

At the bottom of the list:

```
┌─────────────────────────┐
│                         │
│      + Add Slyde        │
│                         │
└─────────────────────────┘
```

```css
border: 1px dashed rgba(255, 255, 255, 0.2);
color: rgba(255, 255, 255, 0.4);
border-radius: 12px;
padding: 16px;
text-align: center;

/* Hover */
border-color: rgba(255, 255, 255, 0.3);
color: rgba(255, 255, 255, 0.6);
```

### Slyde Type Picker

When clicking "+ Add Slyde", show a modal with template options:

```
┌─────────────────────────────────────────────────────┐
│  Choose Slyde Type                              ✕   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐      │
│  │    🎬     │  │    📖     │  │    🍽️     │      │
│  │   Hero    │  │   About   │  │ Showcase  │      │
│  │           │  │           │  │           │      │
│  │ Grab      │  │ Tell your │  │ Show what │      │
│  │ attention │  │ story     │  │ you offer │      │
│  └───────────┘  └───────────┘  └───────────┘      │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐      │
│  │    ⭐     │  │    📍     │  │    🎯     │      │
│  │  Reviews  │  │ Location  │  │    CTA    │      │
│  │           │  │           │  │           │      │
│  │ Build     │  │ Help them │  │ Drive     │      │
│  │ trust     │  │ find you  │  │ action    │      │
│  └───────────┘  └───────────┘  └───────────┘      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Canvas (Center)

### Purpose

The canvas displays a **live phone mockup** showing exactly what customers will see. This is the star of the editor.

### Engagement Indicators (Conversion, Not Social)

We can use **subtle social acceptance** signals (e.g., a heart icon + a number like “3,000”) to increase trust and conversion. This is intentional: people use popularity as a shortcut to decide.

**Allowed (conversion intent):**
- **Heart signal** (UI): a lightweight “this is popular / I’m interested” indicator
- **Aggregate count** (optional, configurable): e.g., “3,000” or “2.4k”
- **No identity**: users are not surfaced; no “who hearted this” lists
- **No creator-optimization loop**: it must not become “post for likes”; it must stay a subtle trust cue

**Not allowed (social mechanics):**
- ❌ Comments
- ❌ Followers / following
- ❌ Public profiles
- ❌ Feed-style mechanics inside the destination experience
- ❌ Notifications that create social loops (outside of business utility)

**Guideline**:
- If the heart signal clearly helps users decide faster (“this place is popular”), we keep it and treat it like **ratings** (trust signal).
- If it starts to change creator behavior into “chasing likes,” we remove counts or hide the signal entirely.

### Heart Count Display Modes (Conversion vs Sharing)

The heart signal should be **toggleable** because different businesses will want different outcomes:

- **Auto (recommended default)**: show the heart icon always; show the count only once it crosses a configurable threshold (e.g., 50+). This protects conversion while not penalizing new businesses.
- **Always show count**: show the count even when it’s low. This can encourage sharing/effort (“we need to get this up”), but may reduce conversion for some brands.
- **Hide count**: show the heart icon, but never show the number (pure UI affordance).
- **Off**: remove the heart signal entirely.

This is not “social.” It’s a **conversion/distribution lever**.

### Phone Mockup Specifications

Based on existing `PhoneMockup.tsx`:

| Property | Value |
|----------|-------|
| Frame Width | 280px |
| Frame Height | 580px |
| Border Radius | 3rem (48px) |
| Frame Color | Gradient from gray-800 to gray-900 |
| Padding | 12px (p-3) |
| Screen Border Radius | 2.25rem (36px) |

### Phone Frame Elements

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │ ← Frame (gray-900)
│  │         [Notch]             │   │
│  │  ┌───────────────────────┐  │   │
│  │  │                       │  │   │
│  │  │                       │  │   │
│  │  │                       │  │   │
│  │  │      SCREEN           │  │   │ ← Screen content
│  │  │                       │  │   │
│  │  │                       │  │   │
│  │  │                       │  │   │
│  │  │  ───────────────────  │  │   │ ← Home indicator
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
│ ▌                              ▐   │ ← Side buttons
└─────────────────────────────────────┘
```

### Screen Content Structure

Each slyde displays:

1. **Video/Image Background** — Full-screen, auto-playing
2. **Gradient Overlay** — For text readability
3. **Top Section** — Tag/badge (optional)
4. **Right Side Actions** — Heart (with optional count), Share, Info buttons (TikTok-style UI, conversion intent)
5. **Slyde Indicators** — Vertical dots showing position
6. **Bottom Content** — Rating, Title, Subtitle, CTA button
7. **Swipe Indicator** — "Swipe up" hint

### Canvas Background

The canvas area around the phone should have a subtle treatment to indicate "editable area":

```css
/* Subtle spotlight glow behind phone */
background: radial-gradient(
  circle at 50% 50%, 
  rgba(255, 255, 255, 0.03) 0%, 
  transparent 60%
);
```

### Swipe Navigation

Even in the editor, users can **swipe up/down** on the phone to navigate between slydes. This reinforces the mental model.

Show a hint below the phone:
```
↑↓ Swipe to navigate slydes
```

### Clickable Hotspots

When hovering over elements in the phone, show they're editable:

- **Title** — Click to edit in inspector
- **Subtitle** — Click to edit in inspector
- **CTA Button** — Click to edit in inspector
- **Video/Image** — Click to change media

Visual feedback on hover:
```css
/* Editable element hover */
outline: 2px solid #2563EB;
outline-offset: 2px;
cursor: pointer;
```

---

## Inspector Panel (Right)

### Purpose

The Inspector Panel provides **context-aware editing controls** for the selected slyde. It's opinionated — limited options that guide users toward success.

### Tab Structure

Three tabs:

```
┌─────────┬─────────┬─────────┐
│ Content │  Style  │ Actions │
└─────────┴─────────┴─────────┘
```

### Content Tab

```
┌─────────────────────────────────┐
│  Content                        │
├─────────────────────────────────┤
│                                 │
│  MEDIA                          │
│  ┌───────────────────────────┐  │
│  │ 📹 hero-video.mp4         │  │
│  │ 0:12 • 1080x1920          │  │
│  │ [Change] [Remove]         │  │
│  └───────────────────────────┘  │
│                                 │
│  Drag & drop video or image     │
│  MP4, MOV, JPG, PNG • Max 50MB  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  TITLE *                        │
│  ┌───────────────────────────┐  │
│  │ Maison Lumière            │  │
│  └───────────────────────────┘  │
│  Your business or product name  │
│                                 │
│  SUBTITLE                       │
│  ┌───────────────────────────┐  │
│  │ Paris • Fine dining       │  │
│  └───────────────────────────┘  │
│  Location, category, or tagline │
│                                 │
│  TAG (optional)                 │
│  ┌───────────────────────────┐  │
│  │ 🍷 Michelin ⭐⭐           │  │
│  └───────────────────────────┘  │
│  Badge shown at top of slyde    │
│                                 │
└─────────────────────────────────┘
```

### Style Tab

**Intentionally limited** — guardrails for success:

```
┌─────────────────────────────────┐
│  Style                          │
├─────────────────────────────────┤
│                                 │
│  ACCENT COLOR                   │
│                                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │ 🔵 │ │ 🟢 │ │ 🟠 │ │ 🔴 │   │
│  │Blue│ │Emer│ │Amber│ │Rose│   │
│  └────┘ └────┘ └────┘ └────┘   │
│  ┌────┐                         │
│  │ ⚫ │                         │
│  │Slate│                        │
│  └────┘                         │
│                                 │
│  Used for CTA button and        │
│  accent elements                │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  OVERLAY STYLE                  │
│                                 │
│  ○ Dark gradient (recommended)  │
│  ○ Light gradient               │
│  ○ Heavy (for bright videos)    │
│  ○ None                         │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  VIDEO SETTINGS                 │
│                                 │
│  ☑️ Auto-play                   │
│  ☑️ Loop                        │
│  ☐ Show play button             │
│                                 │
└─────────────────────────────────┘
```

**Note**: No custom hex colors. No font pickers. No custom CSS. These constraints ensure every slyde looks professional.

### Actions Tab

```
┌─────────────────────────────────┐
│  Actions                        │
├─────────────────────────────────┤
│                                 │
│  CTA BUTTON                     │
│                                 │
│  Button Text *                  │
│  ┌───────────────────────────┐  │
│  │ Reserve Table             │  │
│  └───────────────────────────┘  │
│                                 │
│  Button Icon                    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │ 📅 │ │ 📞 │ │ 📍 │ │ 👁️ │   │
│  │Book│ │Call│ │Dir │ │View│   │
│  └────┘ └────┘ └────┘ └────┘   │
│  ┌────┐                         │
│  │ ➡️ │                         │
│  │Arrow│                        │
│  └────┘                         │
│                                 │
│  Link To *                      │
│  ┌───────────────────────────┐  │
│  │ https://opentable.com/... │  │
│  └───────────────────────────┘  │
│  URL, phone number, or email    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  SOCIAL ACTIONS                 │
│                                 │
│  Show on this slyde:            │
│  ☑️ Heart (popularity signal)   │
│  Heart display:                 │
│  ( ) Auto (recommended)         │
│  ( ) Always show count          │
│  ( ) Hide count                 │
│  ( ) Off                        │
│  ☑️ Share button                │
│  ☐ Info button                  │
│                                 │
└─────────────────────────────────┘
```

---

## Visual Design System

### Color Palette (Editor)

The editor uses a **dark theme** to make content pop:

```css
/* Backgrounds */
--editor-bg: #1e1e1e;           /* Main canvas area */
--editor-surface: #2d2d2d;      /* Panels, sidebars */
--editor-toolbar: #323232;      /* Top toolbar */

/* Borders */
--editor-border: #3a3a3a;       /* Subtle separation */
--editor-border-hover: #4a4a4a; /* Hover states */

/* Text */
--editor-text-primary: rgba(255, 255, 255, 0.9);
--editor-text-secondary: rgba(255, 255, 255, 0.6);
--editor-text-muted: rgba(255, 255, 255, 0.4);

/* Accent */
--editor-accent: #2563EB;       /* Leader Blue */
--editor-accent-hover: #1d4ed8;
```

### Typography

```css
/* Panel headers */
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
color: var(--editor-text-muted);

/* Field labels */
font-size: 12px;
font-weight: 500;
color: var(--editor-text-secondary);

/* Input fields */
font-size: 14px;
color: var(--editor-text-primary);
background: var(--editor-bg);
border: 1px solid var(--editor-border);
border-radius: 8px;
padding: 10px 12px;
```

### Component Styles

**Input Fields:**
```css
.editor-input {
  background: #1e1e1e;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  padding: 10px 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  width: 100%;
  transition: border-color 0.2s;
}

.editor-input:focus {
  border-color: #2563EB;
  outline: none;
}

.editor-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
```

**Color Swatches:**
```css
.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.color-swatch:hover {
  transform: scale(1.05);
}

.color-swatch.selected {
  border-color: white;
  box-shadow: 0 0 0 2px #2563EB;
}
```

**Tabs:**
```css
.editor-tab {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.editor-tab:hover {
  color: rgba(255, 255, 255, 0.8);
}

.editor-tab.active {
  color: white;
  border-bottom-color: #2563EB;
}
```

---

## Slyde Types & Templates

### The Six Core Slyde Types

Each slyde type has a specific purpose in the AIDA (Attention, Interest, Desire, Action) framework:

| Type | Purpose | AIDA Stage | Default Elements |
|------|---------|------------|------------------|
| **Hero** | Grab attention | Attention | Video, Title, Subtitle, Tag |
| **About** | Tell your story | Interest | Video/Image, Story text |
| **Showcase** | Show what you offer | Interest/Desire | Video, Product/service name |
| **Reviews** | Build trust | Desire | Rating, Review quotes |
| **Location** | Help them find you | Desire | Map, Hours, Address |
| **CTA** | Drive action | Action | Strong CTA, Contact options |

### Template: Restaurant (6 Slydes)

```
1. HERO
   - Video: Signature dish being plated
   - Title: "Restaurant Name"
   - Subtitle: "City • Cuisine Type"
   - Tag: "🍷 Award or distinction"

2. ABOUT
   - Video: Chef in kitchen
   - Title: "Our Story"
   - Subtitle: "Meet Chef [Name]"

3. SHOWCASE (Menu)
   - Video: Food montage
   - Title: "The Menu"
   - Subtitle: "Seasonal ingredients, crafted daily"

4. REVIEWS
   - Image: Restaurant interior
   - Title: "What People Say"
   - Rating: 4.9 stars
   - Review: "Best meal I've had..."

5. LOCATION
   - Image: Exterior or neighborhood
   - Title: "Find Us"
   - Subtitle: "123 Main St, City"
   - Hours: "Tue-Sun, 5pm-11pm"

6. CTA
   - Video: Ambiance shot
   - Title: "Ready?"
   - CTA: "Reserve Table"
```

### Template: Hotel/Rental (6 Slydes)

```
1. HERO
   - Video: Property exterior/drone shot
   - Title: "Property Name"
   - Subtitle: "Location"
   - Tag: "🏆 Award or rating"

2. SHOWCASE (Rooms)
   - Video: Room tour
   - Title: "The Suites"
   - Subtitle: "Luxury meets comfort"

3. SHOWCASE (Amenities)
   - Video: Pool, spa, restaurant
   - Title: "Amenities"
   - Subtitle: "Everything you need"

4. REVIEWS
   - Image: Guest enjoying property
   - Title: "Guest Reviews"
   - Rating: 4.9 stars

5. LOCATION
   - Video: Area highlights
   - Title: "The Area"
   - Subtitle: "Things to do nearby"

6. CTA
   - Video: Sunset/beautiful moment
   - Title: "Book Your Stay"
   - CTA: "Check Availability"
```

### Template: Vehicle Rental (6 Slydes)

```
1. HERO
   - Video: Vehicle in action
   - Title: "Company Name"
   - Subtitle: "Location • Vehicle type"
   - Tag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Adventure awaits"

2. SHOWCASE (Fleet)
   - Video: Vehicle walkaround
   - Title: "The Fleet"
   - Subtitle: "Land Rover Defender"

3. SHOWCASE (Features)
   - Video: Interior/equipment
   - Title: "Fully Equipped"
   - Subtitle: "Roof tent • Full kit"

4. REVIEWS
   - Image: Happy customers
   - Title: "Adventures"
   - Rating: 5.0 stars

5. ABOUT
   - Video: Team/location
   - Title: "About Us"
   - Subtitle: "Family-run since 2015"

6. CTA
   - Video: Driving footage
   - Title: "Ready to Explore?"
   - CTA: "Check Availability"
```

---

## Mobile Editor (Partner App)

### Design Philosophy

The mobile editor should be **even simpler** than desktop. Business owners create on their phones, where they work.

### Layout

```
┌────────────────────────────┐
│  ◄  Highland Bites      ⋮  │  ← Header
├────────────────────────────┤
│                            │
│    ┌──────────────────┐    │
│    │                  │    │
│    │                  │    │
│    │   PHONE PREVIEW  │    │  ← 60% of screen
│    │                  │    │
│    │                  │    │
│    │                  │    │
│    └──────────────────┘    │
│                            │
├────────────────────────────┤
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ │  ← Slyde thumbnails
│  │1 │ │2 │ │3 │ │4 │ │+ │ │    (vertical scroll)
│  └──┘ └──┘ └──┘ └──┘ └──┘ │
├────────────────────────────┤
│                            │
│  ┌────────────────────┐    │
│  │   Edit Content     │    │  ← Expandable sections
│  └────────────────────┘    │
│  ┌────────────────────┐    │
│  │   Change Style     │    │
│  └────────────────────┘    │
│  ┌────────────────────┐    │
│  │   Set CTA          │    │
│  └────────────────────┘    │
│                            │
│  ┌────────────────────┐    │
│  │     Publish        │    │  ← Always visible
│  └────────────────────┘    │
│                            │
└────────────────────────────┘
```

### Key Principles

1. **Phone preview dominates** — It's the star
2. **Slyde thumbnails scroll vertically** — Not horizontally
3. **Expandable edit sections** — Tap to expand, tap to collapse
4. **Publish always visible** — Speed to publish matters
5. **Camera integration** — Record video directly in-app

### Mobile-Specific Features

**Quick Record:**
- Tap camera icon to record video
- Vertical recording only (locked orientation)
- Auto-trim to 15 seconds max
- Instant upload

**Swipe to Preview:**
- Swipe up/down on preview to navigate slydes
- Full-screen preview mode available

---

## User Flows

### Flow 1: Create Home Slyde (First-Time Setup)

Every brand must create their Home Slyde first. This is mandatory before creating Child Slydes.

**The Home Slyde is exactly ONE immersive video + swipe-up drawer** — no frames.

See [HOME-SLYDE-BUILD-SPEC.md](./HOME-SLYDE-BUILD-SPEC.md) for full specification.

```
1. User lands on empty editor
   → Show "Create your Home Slyde" prompt
   → Explain: "This is your brand’s entry experience — one video + a category drawer"

2. User clicks "Create Home Slyde"
   → Home Slyde template created:
     - Upload/select a 9:16 hero video (10–30s, muted by default)
     - Brand name + tagline overlay
     - Category drawer (3–6 categories max)
     - Optional single primary CTA (only if dominant)

3. User uploads/sets the video
   → Autoplay muted (sound toggle available if audio exists)
   → Poster fallback if autoplay blocked

4. User configures categories (drawer)
   → Add 3–6 categories (icon + label; optional description)
   → Each category routes to a **Category Slyde** (a Child Slyde of type `category`)
   → Categories may optionally have **Inventory** (paid feature): Category Slyde can include a “View all” CTA that opens the inventory list

5. User optionally adds a primary CTA
   → "Book Now", "Check Availability", etc. (only if truly dominant)

6. User clicks "Publish"
   → Confirmation: "Your Home Slyde is live!"
   → Show shareable link: slydes.io/{business-slug}
   → Prompt: "Now create your first Child Slyde"
```

**Home Slyde constraints enforced in editor:**
- Exactly 1 Home Slyde (no frames)
- Must include at least one category (drawer)
- Cannot be deleted (only edited)
- Always appears first in dashboard with "Home" badge
- Drawer open/close must remain smooth (no layout shift)

### Flow 2: Create Child Slyde

After creating the Home Slyde, users create Child Slydes for specific offerings.

```
1. User clicks "+ Add Child Slyde" in panel
   → Show slyde type picker (immersive templates)

2. User selects type (e.g., "Product", "Property", "Menu")
   → New Child Slyde created with AIDA template frames:
     - Hook → How → What → Trust → Proof → Action
   → Child Slyde selected in dashboard

3. User fills in content
   → Preview updates in real-time
   → Can add/remove frames (4-10 typical)

4. User publishes Child Slyde
   → Deep link created: slydes.io/{business-slug}/{slyde-slug}
   → Prompt: "Link this to your Home Slyde navigation?"

5. User links Child Slyde to Home Slyde
   → The Home Slyde drawer category now points to this Child Slyde (Category Slyde)
   → Flow connected
```

### Flow 2b: Add Inventory + Item Slydes (Optional)

Inventory is optional and category-specific.

```
1. User enables Inventory on a Category
   → Category now has an “Inventory list” underneath it

2. User adds Inventory Items (title, subtitle, price, thumbnail)
   → Each Inventory Item automatically gets an Item Slyde (Child Slyde type='item')

3. User edits the Item Slyde frames (deep dive)
   → Same editor + same frame system

4. In the Category Slyde, user adds/uses a “View all” CTA (showViewAll: true)
   → Customer flow becomes:
     Home Slyde → Category Slyde → (View all) Inventory → Item Slyde
```

See [CATEGORY-INVENTORY-FLOW.md](./CATEGORY-INVENTORY-FLOW.md) for the canonical entity relationships and CRUD model.

**Child Slyde vs Home Slyde:**
- Home Slyde = video-first entry + drawer (no frames)
- Child Slydes = multiple frames, immersive, narrative pacing
- See [HOME-SLYDE-SYSTEM.md](./HOME-SLYDE-SYSTEM.md) for the distinction

### Flow 3: Preview Full Flow

```
1. User clicks "Preview" in toolbar
   → Editor chrome fades out
   → Phone preview goes full-screen

2. User swipes up/down to navigate
   → Experience exactly like customer

3. User clicks anywhere or presses Escape
   → Return to editor
```

### Flow 4: Publish Updates

```
1. User makes changes to published slyde
   → Status shows "Unpublished changes"

2. User clicks "Publish"
   → Changes go live immediately
   → Status shows "All changes published"
```

---

## Analytics Integration

### In-Editor Analytics

Show performance data directly in the editor to help users improve:

```
┌─────────────────────────────────┐
│  📊 Performance (Last 30 days)  │
├─────────────────────────────────┤
│                                 │
│  Total Views: 1,234             │
│  Completion Rate: 68%           │
│  CTA Clicks: 156 (12.6%)        │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  SLYDE PERFORMANCE              │
│                                 │
│  1. Hero         100% ████████  │
│  2. About         85% ███████   │
│  3. Menu          72% ██████    │ ⚠️
│  4. Reviews       68% █████     │
│  5. Location      65% █████     │
│  6. CTA           62% █████     │
│                                 │
│  💡 Tip: Slyde 3 has high       │
│  drop-off. Try a shorter video. │
│                                 │
└─────────────────────────────────┘
```

### Metrics to Track

Based on the philosophy ("behaviour-based measurement"):

| Metric | Definition | Why It Matters |
|--------|------------|----------------|
| **Swipe Depth** | % of users reaching each slyde | Shows where attention drops |
| **Completion Rate** | % reaching final slyde | Measures flow effectiveness |
| **CTA Clicks** | Clicks on action buttons | Direct conversion metric |
| **Hearts (Interest Signals)** | Aggregate hearts per slyde/flow | Measures “I want this” intent (trust + desirability) |
| **Time per Slyde** | Average viewing time | Indicates engagement |
| **Drop-off Points** | Where users leave | Identifies weak slydes |

### Analytics Panel Location

Show analytics in a collapsible panel at the bottom of the Inspector, or as a separate tab.

---

## What NOT to Build

### Explicit Constraints

The following features should **never** be added to the editor:

| Feature | Why Not |
|---------|---------|
| **Horizontal carousels** | Slydes is vertical only |
| **Custom fonts** | Guardrails for success |
| **Custom colors (hex)** | Pre-selected palette ensures quality |
| **Multi-page navigation** | Slydes is a flow, not a site |
| **Blog/text editor** | Slydes is video-first |
| **SEO tools** | Slydes is mobile-first, not SEO-first |
| **Complex animations** | Keep it simple, keep it fast |
| **Desktop preview** | Mobile is the product |
| **Code injection** | Constraint creates clarity |
| **Third-party widgets** | We're a layer, not a platform |

### Clarification: Signals vs Mechanics

**Allowed signals (conversion aids):**
- ✅ Heart + aggregate count (popularity signal)
- ✅ Ratings/reviews/awards

**Not allowed mechanics (social network):**
- ❌ Comments
- ❌ Followers
- ❌ Public profiles
- ❌ “Who liked this” lists
- ❌ Feed features inside the destination that compete for attention

### The Test

Before adding any feature, ask:

1. Does this make slydes **faster to create**?
2. Does this make attention **flow more naturally**?
3. Does this make action **more likely**?

If not, don't build it.

---

## Implementation Notes

### Tech Stack

Based on existing codebase:

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: React state (useState, useContext)
- **Database**: Supabase PostgreSQL
- **Storage**: Vercel Blob (videos/images)

### Component Structure

```
src/
├── app/
│   └── editor/
│       └── [slydeId]/
│           └── page.tsx        # Editor page
├── components/
│   └── editor/
│       ├── EditorLayout.tsx    # Three-panel layout
│       ├── SlydesPanel.tsx     # Left panel
│       ├── Canvas.tsx          # Center with phone
│       ├── Inspector.tsx       # Right panel
│       ├── Toolbar.tsx         # Top toolbar
│       ├── SlydeCard.tsx       # Slyde thumbnail
│       ├── PhonePreview.tsx    # Phone mockup
│       ├── ContentTab.tsx      # Inspector tab
│       ├── StyleTab.tsx        # Inspector tab
│       ├── ActionsTab.tsx      # Inspector tab
│       └── SlydeTypePicker.tsx # Modal for adding slydes
└── lib/
    └── editor/
        ├── types.ts            # TypeScript types
        ├── context.tsx         # Editor state context
        └── hooks.ts            # Custom hooks
```

### Data Model

```typescript
interface Slyde {
  id: string;
  type: 'hero' | 'about' | 'showcase' | 'reviews' | 'location' | 'cta';
  order: number;
  content: {
    mediaUrl?: string;
    mediaType?: 'video' | 'image';
    title?: string;
    subtitle?: string;
    tag?: string;
    rating?: number;
    reviewCount?: number;
  };
  style: {
    accentColor: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
    overlayStyle: 'dark' | 'light' | 'heavy' | 'none';
  };
  actions: {
    ctaText?: string;
    ctaIcon?: 'book' | 'call' | 'directions' | 'view' | 'arrow';
    ctaUrl?: string;
    // Popularity signal (conversion aid):
    // - UI can use a heart icon and show an aggregate count (e.g., “3,000”)
    // - No identity: no “who hearted this”
    // - No social network mechanics (comments/followers/profiles/feed loops)
    showHeart: boolean;
    heartCountMode: 'auto' | 'always' | 'hidden' | 'off';
    heartCountThreshold?: number; // used when heartCountMode = 'auto' (e.g., 50)
    showShare: boolean;
    showInfo: boolean;
  };
}

interface SlydeFlow {
  id: string;
  name: string;
  slug: string;
  slydes: Slyde[];
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Next Steps

### Phase 1: Core Editor (MVP)

1. Build three-panel layout
2. Implement slyde panel with thumbnails
3. Create phone preview component
4. Build inspector with Content tab
5. Add slyde type picker
6. Implement drag-to-reorder
7. Add publish flow

### Phase 2: Polish

1. Add Style and Actions tabs
2. Implement real-time preview updates
3. Add swipe navigation in canvas
4. Build analytics panel
5. Add keyboard shortcuts
6. Implement undo/redo

### Phase 3: Mobile Editor

1. Design mobile-specific layout
2. Implement camera integration
3. Build touch-optimized controls
4. Add offline support

---

## Summary

The Slydes editor should feel like **the product it creates** — vertical, fast, opinionated, and focused on one thing: helping businesses create mobile experiences that convert.

**Key principles:**
- Vertical only, always
- Phone preview is the star
- Opinionated controls, not flexibility
- Speed to publish matters
- Guardrails for success

**Remember:**
> "If everything is allowed, nothing converts."

---

**Document Version**: 1.0  
**Last Updated**: December 14, 2025  
**Author**: Slydes Team

🔥 **Built for the Future.**

