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
| Creator | 6 |
| Pro | Unlimited |

### What Is Inventory?

Inventory is an **optional paid feature** that lets categories contain a list of items.

**Without Inventory** (Free):
- Category Slyde ends with a CTA (e.g., "Book Service")
- User completes action externally

**With Inventory** (Creator+):
- Category Slyde has "View All" button on final frame
- Opens Inventory Grid showing all items
- Each item links to an Item Slyde

### Inventory vs Commerce (Canonical)

**Inventory** is the *browsing model* (grid/list → tap → Item Slyde).
**Commerce** is the *action model* attached to inventory items (what the CTA does).

Inventory is how we show items (cars, products, properties). Commerce is what happens next (enquire, buy, cart).

#### Commerce Modes (per Inventory Item)

Each inventory item chooses exactly **one primary CTA mode**:

- **Enquire / Book** (Creator+)
  - CTA opens an external link, phone call, enquiry form, or message action
- **Buy now** (Pro only)
  - CTA creates a Stripe Checkout Session and redirects to Stripe
- **Add to cart** (Pro only)
  - CTA adds item to cart; checkout uses Stripe Checkout with multiple line items

#### Paid Feature Gating (Studio UI)

We gate at three levels:

| Feature | Free | Creator | Pro |
|---------|------|---------|-----|
| Inventory browsing | ✗ | ✓ | ✓ |
| Enquire / Book CTA | ✗ | ✓ | ✓ |
| Buy Now | ✗ | ✗ | ✓ |
| Cart + Checkout | ✗ | ✗ | ✓ |

1) **Organization entitlement** (plan feature):
- Free: No inventory, no commerce
- Creator: Inventory + Enquire/Book CTAs
- Pro: Full commerce (Buy Now, Cart, Checkout)

2) **Category toggle**: `has_inventory`
- `false` → category ends with CTA (no grid)
- `true` → category can show "View All" → Inventory Grid → Item Slydes

3) **Commerce mode** (Pro only): `commerce_mode`
- `enquire` → external link, phone, form (Creator default)
- `buy_now` → Stripe Checkout (Pro)
- `cart` → Add to cart + Checkout (Pro)

### Cart UX Pattern (Add to cart + Checkout CTA)

When **Cart** is enabled (Pro tier), we support *two* "add" entry points and *one* consistent checkout CTA.

> **⚠️ PAID FEATURE**: Commerce features (Cart, Buy Now, Checkout) require Pro tier and Stripe Connect.
> When commerce is disabled, all commerce UI elements are hidden - no buttons, no cart, no checkout.

#### 1) Inventory Grid: iOS App Store-style Quick-add Button

Each item row has a circular add button (iOS HIG compliant):

```
┌────────────────────────────────────────────────────┐
│ [Thumb]  Title                              [+]    │
│          £18.50                                    │
├────────────────────────────────────────────────────┤
```

- **Layout**: Thumbnail + Title (2 lines max) + Price only. **No subtitle** (removed for scanability)
- **Default state**: Accent-colored circle with `+` icon (`w-8 h-8 rounded-full`)
- **Added state**: Green circle (`#22c55e`) with `✓` checkmark for 800ms
- **Animation**: `scale: 0 → 1` with `duration: 0.15s`

Implementation (`CommerceButton` in `InventoryGridView.tsx`):
```tsx
// iOS App Store style - circle button with + or ✓
<motion.button
  onClick={handleClick}
  animate={{ backgroundColor: showSuccess ? '#22c55e' : accentColor }}
  transition={{ duration: 0.15 }}
  className="w-8 h-8 rounded-full flex items-center justify-center"
>
  {showSuccess ? <Check /> : <Plus />}
</motion.button>
```

Rules:
- The item row remains tappable to open the Item Slyde (deep dive).
- The quick-add button intercepts its own tap (`e.stopPropagation()`).
- Success feedback is local to the button (no toast, no cart drawer auto-open).

#### 2) Item Slyde: Full-width Commerce CTA

On the Item Slyde, the commerce button is full-width at the bottom:
- `add_to_cart`: "Add to Cart • £19.00" with ShoppingCart icon
- `buy_now`: "Buy Now • £19.00" with Zap icon
- `enquire`: "Enquire Now" with MessageCircle icon

#### 3) Floating Cart Button (Non-intrusive)

When cart has ≥ 1 item, show a floating cart button:

```
┌─────────────────────────────────────────┐
│                                   [🛒7] │  ← Floating cart (top-right)
│                                         │
│           INVENTORY GRID                │
│                                         │
└─────────────────────────────────────────┘
```

- **Position**: `absolute top-4 right-4 z-40`
- **Size**: `w-11 h-11 rounded-full`
- **Badge**: `w-5 h-5` positioned at `-top-1 -right-1`
- **Color**: White badge with accent text on accent background

Behavior:
- Tap opens cart sheet (not intrusive auto-open on add)
- Cart sheet has iOS-style handle bar, swipe-to-delete items
- Checkout button at bottom of cart sheet

#### 4) Cart Sheet (iOS-style Bottom Sheet)

```
┌─────────────────────────────────────────┐
│              ═══                        │  ← iOS handle bar
│              Cart                       │
├─────────────────────────────────────────┤
│  Title                        [−][2][+] │  ← Swipeable row
│  Subtitle                       £18.50  │
│  ← swipe to delete                      │
├─────────────────────────────────────────┤
│  Total                          £37.00  │
│  [        Checkout        ]             │
└─────────────────────────────────────────┘
```

Components:
- Handle bar: `w-9 h-[5px] rounded-full bg-white/30`
- Swipe-to-delete: Framer Motion `drag="x"` with `-80px` threshold
- iOS stepper: `w-7 h-6` buttons with `−`/`+` icons
- Checkout button: Full-width, accent-colored, `h-11 rounded-xl`

#### Cart persistence

Cart persists per organization:
- MVP: localStorage (client) + clear on checkout success
- Later: server-backed cart for cross-device continuity

### Inventory Grid (iOS HIG Compliant)

The Inventory Grid displays items in an iOS-style grouped list format. Optimized for scanability.

**Layout**: iOS Settings-style grouped list
- Background: `bg-[#1c1c1e]` (iOS system dark)
- Grouped container: `bg-[#2c2c2e] rounded-xl mx-4`
- Separators: `h-[0.5px] bg-white/10 ml-[76px]` (inset from left)

**Navigation Bar**:
```
┌─────────────────────────────────────────┐
│ < Back                                  │
│ Styling  8                              │  ← Large title + count
└─────────────────────────────────────────┘
```
- Back button: Accent-colored with chevron + "Back" text
- Title: `text-[34px] font-bold tracking-tight` (iOS large title)
- Count: `text-[15px] text-white/40` inline with title

**Each item row** (simplified for scanability):
```
┌────────────────────────────────────────────────────┐
│ [12x12]  Product Title                       [+]   │
│  thumb   £18.50                                    │
├────────────────────────────────────────────────────┤
```
- **Thumbnail**: `w-12 h-12 rounded-lg` with product image (fallback: gradient placeholder)
- **Title**: `text-[15px] font-medium text-white line-clamp-2` (allows 2 lines)
- **Price**: `text-[15px] font-semibold` in accent color
- **NO subtitle** - removed for scanability (AIDA: don't block Interest with noise)
- Commerce button OR chevron (mutually exclusive)

**Why no subtitle?**
- Subtitles caused truncation issues ("AC Dail...", "Condit...ner")
- Grid is for quick scanning → Title + Price is enough
- Details live in the Item Slyde (tap to see full info)

**Tap item row** → Opens that item's Item Slyde
**Tap commerce button** → Adds to cart (with green tick feedback)

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
3. Contact buttons: Call, Email, Message (iOS 17+ style)

**Use case**: "Tell me about this business"

### InfoSheet

**Triggered by**: Info button on Child Slyde frames

**Contents**:
1. Header: "Frame X of Y" + frame title
2. Frame headline & description
3. Frame items (bullet points)
4. Collapsible business contact (bottom) with iOS 17+ contact pills

**Use case**: "Tell me more about what I'm looking at"

### Contact Buttons (iOS 17+ Style)

Modern contact actions use horizontal pill buttons with iOS system colors:

```
┌────────────────────────────────────────────────────┐
│ [📞 Call]  [✉️ Email]  [💬 Message]                  │
└────────────────────────────────────────────────────┘
```

**Styling**:
- Layout: `flex items-center gap-2` (horizontal row)
- Each button: `flex-1 h-11 rounded-xl` (pill shape)
- Icon: `w-[18px] h-[18px]` + label `text-[15px] font-semibold`

**iOS System Colors**:
| Action | Background | Active State |
|--------|------------|--------------|
| Call | `#30d158` (green) | `#28b84d` |
| Email | `#0a84ff` (blue) | `#0070e0` |
| Message | `#5856d6` (purple) | `#4b49c0` |

**Why this design?**
- OLD: Circular icons with text labels below (iOS 10 era)
- NEW: Colored pill buttons inline (iOS 17+ Contact Card style)
- Benefits: Larger touch targets, clearer affordance, premium feel

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

## iOS Human Interface Guidelines (HIG) Compliance

All mobile UI components follow Apple's iOS Human Interface Guidelines. This is the gold standard as we will be releasing on Apple phones.

### System Colors (Dark Mode)

| Color | Hex | Usage |
|-------|-----|-------|
| System Background | `#1c1c1e` | Main screen background |
| Secondary Background | `#2c2c2e` | Grouped containers, cards |
| Tertiary Background | `#3a3a3c` | Thumbnails, placeholders |
| Separator | `white/10` | List dividers (0.5px) |
| Label | `white` | Primary text |
| Secondary Label | `white/50` | Subtitles, descriptions |
| Tertiary Label | `white/40` | Counts, metadata |

### Component Patterns

#### Back Buttons

**In immersive views** (CategorySlydeView, ItemSlydeView):
```tsx
<button className="absolute top-12 left-3 z-30 flex items-center gap-0.5 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
  <ChevronLeft className="w-5 h-5 text-white" />
  <span className="text-white text-[15px] font-medium pr-1">Back</span>
</button>
```

**In list views** (InventoryGridView):
```tsx
<button className="flex items-center gap-0.5 -ml-1" style={{ color: accentColor }}>
  <ChevronLeft className="w-5 h-5" />
  <span className="text-[17px]">Back</span>
</button>
```

#### Bottom Sheets

All sheets use the iOS spring animation and handle bar:
```tsx
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 28, stiffness: 320 }}
  className="bg-[#1c1c1e] rounded-t-[20px]"
>
  {/* Handle bar */}
  <div className="flex justify-center pt-2 pb-3">
    <div className="w-9 h-[5px] rounded-full bg-white/30" />
  </div>
</motion.div>
```

#### Grouped Lists

iOS Settings-style grouped list:
```tsx
<div className="mx-4 bg-[#2c2c2e] rounded-xl overflow-hidden">
  {items.map((item, i) => (
    <>
      <button className="w-full flex items-center gap-3 px-4 py-3">
        {/* content */}
      </button>
      {i < items.length - 1 && (
        <div className="ml-[76px] h-[0.5px] bg-white/10" />
      )}
    </>
  ))}
</div>
```

#### Large Titles

iOS navigation bar with large title:
```tsx
<div className="pt-12 pb-2 px-4 bg-[#1c1c1e]">
  <button>{/* Back */}</button>
  <h1 className="text-white text-[34px] font-bold tracking-tight mt-1">
    {title}
  </h1>
</div>
```

### Animation Standards

| Animation | Duration | Easing |
|-----------|----------|--------|
| Sheet slide | spring | `damping: 28, stiffness: 320` |
| Success tick | 0.15s | ease-out |
| Content fade | 0.3s | ease-out |
| Button press | 0.1s | ease-out |

### Touch Targets

- Minimum touch target: 44x44pt (iOS standard)
- Stepper buttons: `w-7 h-6` minimum
- Circle buttons: `w-8 h-8` (commerce) or `w-11 h-11` (cart FAB)

### Dashed Affordance Pattern

We use a consistent "dashed affordance" pattern for empty state and add-new actions throughout the Studio editor. This pattern provides clear visual affordance for where users can add new items.

**Key Rule**: The dashed affordance button is **ALWAYS visible** at the bottom of lists, not just when the list is empty. This provides a consistent, discoverable add action.

**Visual Pattern**:
```tsx
<button
  onClick={handleAdd}
  className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
>
  <Plus className="w-4 h-4" />
  <span className="text-[12px] font-medium">Add [thing]</span>
</button>
```

**Where It's Used**:
| Section | Label | Location |
|---------|-------|----------|
| Categories | "Add category" | Home level Navigator |
| Frames | "Add frame" | Child level Navigator |
| Lists | "Add list" | Lists admin page |
| Items | "Add item" | Items panel |
| Item Frames | "Add frame" | Item editor |

**Design Specs**:
- Border: `2px dashed` (not solid)
- Border radius: `rounded-xl` (12px)
- Colors: Gray in default state, accent on hover
- Height: `py-4` for comfortable touch target
- Icon: Plus icon (Lucide `Plus`)
- Text: `12px` semibold

**Why Always Visible?**
- Provides consistent, predictable add location
- Users don't have to wonder "how do I add more?"
- Works for both empty and populated lists
- Better UX than conditional visibility

---

## Commerce Feature Gating

> **CRITICAL**: Commerce is a PAID feature. When disabled, ALL commerce UI must be hidden.

### What Gets Hidden When Commerce is Off

| Component | Visibility |
|-----------|------------|
| `CommerceButton` in InventoryGridView | Hidden (shows chevron instead) |
| `FloatingCartButton` | Hidden completely |
| Commerce CTA in ItemSlydeView | Hidden (shows regular CTA or nothing) |
| Cart sheet | Never opens |
| Checkout flow | Inaccessible |

### Implementation Pattern

```tsx
// In InventoryGridView
{item.commerce_mode && item.commerce_mode !== 'none' ? (
  <CommerceButton mode={item.commerce_mode} ... />
) : (
  <ChevronRight className="w-5 h-5 text-white/20" />
)}

// In HomeSlydeViewer
{commerceEnabled && cart.itemCount > 0 && (
  <FloatingCartButton ... />
)}
```

### Stripe Connect Requirement

Commerce features require:
1. Organization has Pro tier (`plan >= 'pro'`)
2. Organization has connected Stripe account (`stripe_account_id` is set)
3. Stripe account is fully onboarded (`chargesEnabled === true`)

If any condition is false, commerce UI is hidden.

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
*Last Updated: December 16, 2025 - iOS HIG compliance + Commerce patterns + iOS 17+ contact buttons + Inventory grid thumbnails*
*This is the master reference for Slydes platform behavior.*
