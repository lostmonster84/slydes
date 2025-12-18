# Launch Wizard - Complete Architecture Spec

> **Goal**: Take a business from zero to live Slyde in 5 minutes
> **Philosophy**: Reduce decisions, maximize momentum, ship fast

---

## Table of Contents

1. [User Flow Overview](#1-user-flow-overview)
2. [Entry Points](#2-entry-points)
3. [Wizard Steps](#3-wizard-steps)
4. [Template System](#4-template-system)
5. [Data Model](#5-data-model)
6. [State Management](#6-state-management)
7. [Edge Cases](#7-edge-cases)
8. [UI/UX Patterns](#8-uiux-patterns)
9. [Implementation Phases](#9-implementation-phases)

---

## 1. User Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SIGN UP                                                         │
│     │                                                            │
│     ▼                                                            │
│  HAS ORG? ──No──► WIZARD STEP 1: Business Setup                 │
│     │                    │                                       │
│    Yes                   ▼                                       │
│     │              WIZARD STEP 2: Business Type                  │
│     ▼                    │                                       │
│  HAS SLYDE? ──No──►      ▼                                       │
│     │              WIZARD STEP 3: Hero Content                   │
│    Yes                   │                                       │
│     │                    ▼                                       │
│     │              WIZARD STEP 4: Sections                       │
│     │                    │                                       │
│     │                    ▼                                       │
│     │              WIZARD STEP 5: Contact Info                   │
│     │                    │                                       │
│     │                    ▼                                       │
│     │              WIZARD STEP 6: Preview & Launch               │
│     │                    │                                       │
│     ▼                    ▼                                       │
│  ┌─────────────────────────────────────────┐                    │
│  │           UNIFIED STUDIO EDITOR          │                    │
│  │      (with Slyde ready to customize)     │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Entry Points

### 2.1 New User (No Org)

**Trigger**: User signs up, redirected to `/` (Studio root)
**Detection**: `useOrganization()` returns `organization: null`
**Action**: Show full wizard starting at Step 1

### 2.2 Existing User, New Slyde

**Trigger**: User clicks "+ New Slyde" button OR has org but no slydes
**Detection**: `organization` exists but `useSlydes()` returns empty array
**Action**: Show wizard starting at Step 2 (skip org setup)

### 2.3 Power User Escape Hatch

**Always Available**: "Start from scratch" link at bottom of any wizard step
**Action**: Creates blank Slyde, drops user into editor

---

## 3. Wizard Steps

### Step 1: Business Setup (NEW USERS ONLY)

**Purpose**: Create the organization record

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│     🚀 Let's launch your Slyde                        │
│                                                        │
│     What's your business called?                       │
│     ┌──────────────────────────────────────────────┐  │
│     │ Highland Blooms                               │  │
│     └──────────────────────────────────────────────┘  │
│                                                        │
│     Your Slyde URL                                     │
│     ┌──────────────────────────────────────────────┐  │
│     │ highlandblooms                                │  │
│     └──────────────────────────────────────────────┘  │
│     highlandblooms.slydes.io                          │
│                                                        │
│                              [Continue →]             │
│                                                        │
│     ─────────────────────────────────────────────     │
│     or start from scratch                             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | text | Yes | 2-100 chars |
| `slug` | text | Yes | URL-safe, unique, 3-30 chars |

**Auto-behavior**:
- Slug auto-generates from name (kebab-case)
- Real-time uniqueness check via `/api/account/slug`
- Show availability indicator (green check / red X)

**On Continue**:
1. Call `createOrganization({ name, slug })`
2. Proceed to Step 2

---

### Step 2: Business Type

**Purpose**: Select template & set business_type

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│     What type of business are you?                     │
│                                                        │
│     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│     │   🌸        │  │   🍽️        │  │   💇        │ │
│     │  Florist    │  │ Restaurant  │  │   Salon     │ │
│     └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                        │
│     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│     │   📸        │  │   🏨        │  │   💪        │ │
│     │ Photographer│  │   Hotel     │  │    Gym      │ │
│     └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                        │
│     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│     │   🛍️        │  │   🎉        │  │   ✨        │ │
│     │   Retail    │  │   Events    │  │   Other     │ │
│     └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                        │
│     [← Back]                         [Continue →]     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Options**:
| Type | Icon | Template Key | Suggested Sections |
|------|------|--------------|-------------------|
| Florist | 🌸 | `florist` | Arrangements, Weddings, Delivery, About |
| Restaurant | 🍽️ | `restaurant` | Menu, Reservations, Gallery, Contact |
| Salon | 💇 | `salon` | Services, Stylists, Gallery, Book |
| Photographer | 📸 | `photographer` | Portfolio, Packages, About, Contact |
| Hotel / B&B | 🏨 | `hotel` | Rooms, Amenities, Location, Book |
| Gym / Fitness | 💪 | `gym` | Classes, Memberships, Trainers, Contact |
| Retail | 🛍️ | `retail` | Products, About, Location, Contact |
| Events / Venue | 🎉 | `events` | Spaces, Services, Gallery, Contact |
| Other | ✨ | `generic` | Services, About, Gallery, Contact |

**On Select**:
1. Update `organization.business_type`
2. Load template definition
3. Proceed to Step 3

---

### Step 3: Hero Content

**Purpose**: Set the home screen background (first impression)

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│     Show off your business                             │
│     This is what people see first                      │
│                                                        │
│     ┌──────────────────────────────────────────────┐  │
│     │                                              │  │
│     │                                              │  │
│     │        📹 Upload video or image              │  │
│     │                                              │  │
│     │        Drag & drop or click to browse        │  │
│     │                                              │  │
│     │        ────────────────────────              │  │
│     │        Or paste a URL                        │  │
│     │        ┌────────────────────────────┐       │  │
│     │        │ https://...                 │       │  │
│     │        └────────────────────────────┘       │  │
│     │                                              │  │
│     └──────────────────────────────────────────────┘  │
│                                                        │
│     💡 Don't have content? Use stock for now          │
│        [Browse stock videos →]                        │
│                                                        │
│     [← Back]                         [Continue →]     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Input Options**:
1. **File upload**: Video (MP4, MOV) or Image (JPG, PNG, WebP)
2. **URL paste**: YouTube, Vimeo, direct video/image URL
3. **Stock library**: Industry-specific stock videos (future V2)

**Processing**:
- Videos → Cloudflare Stream upload
- Images → Cloudflare Images upload
- YouTube/Vimeo → Extract and store URL with start time

**On Continue**:
1. Upload media (show progress)
2. Store in wizard state
3. Proceed to Step 4

---

### Step 4: Sections (Categories)

**Purpose**: Define the drawer sections

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│     What do you want to show?                          │
│     These become sections in your Slyde                │
│                                                        │
│     Suggested for Florists:                            │
│                                                        │
│     ┌──────────────────────────────────────────────┐  │
│     │ ☑️  Arrangements    [Rename]  [Remove]       │  │
│     │ ☑️  Weddings        [Rename]  [Remove]       │  │
│     │ ☑️  Delivery        [Rename]  [Remove]       │  │
│     │ ☑️  About Us        [Rename]  [Remove]       │  │
│     └──────────────────────────────────────────────┘  │
│                                                        │
│     [+ Add another section]                           │
│                                                        │
│     💡 You can always add, remove, and reorder        │
│        sections later in the editor                   │
│                                                        │
│     [← Back]                         [Continue →]     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Template Suggestions** (pre-checked based on business type):
```typescript
const TEMPLATE_SECTIONS: Record<BusinessType, Section[]> = {
  florist: [
    { name: 'Arrangements', icon: 'flower', enabled: true },
    { name: 'Weddings', icon: 'heart', enabled: true },
    { name: 'Delivery', icon: 'truck', enabled: true },
    { name: 'About Us', icon: 'info', enabled: true },
  ],
  restaurant: [
    { name: 'Menu', icon: 'utensils', enabled: true },
    { name: 'Reservations', icon: 'calendar', enabled: true },
    { name: 'Gallery', icon: 'image', enabled: true },
    { name: 'Contact', icon: 'phone', enabled: true },
  ],
  // ... etc
}
```

**Interactions**:
- Toggle checkbox to include/exclude
- Inline rename (click name to edit)
- Remove (X button)
- Add custom section (+ button)
- Drag to reorder (future enhancement)

**On Continue**:
1. Store selected sections in wizard state
2. Proceed to Step 5

---

### Step 5: Contact Info

**Purpose**: Collect contact details for CTA and Contact section

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│     How can customers reach you?                       │
│                                                        │
│     Phone (shows Call button)                          │
│     ┌──────────────────────────────────────────────┐  │
│     │ +44 1234 567890                               │  │
│     └──────────────────────────────────────────────┘  │
│                                                        │
│     Email                                              │
│     ┌──────────────────────────────────────────────┐  │
│     │ hello@highlandblooms.com                      │  │
│     └──────────────────────────────────────────────┘  │
│                                                        │
│     Address (shows Directions button)                  │
│     ┌──────────────────────────────────────────────┐  │
│     │ 123 High Street, Inverness, IV1 1AA          │  │
│     └──────────────────────────────────────────────┘  │
│                                                        │
│     ┌─ Social Links (optional) ────────────────────┐  │
│     │ 📷 Instagram  @highlandblooms                │  │
│     │ 🎵 TikTok     @highlandblooms                │  │
│     │ 📘 Facebook   /highlandblooms                │  │
│     └──────────────────────────────────────────────┘  │
│                                                        │
│     [← Back]                         [Continue →]     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Fields**:
| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| `phone` | tel | No | Primary CTA (if provided) |
| `email` | email | No | Contact section |
| `address` | text | No | Directions CTA |
| `instagram` | handle | No | Social links |
| `tiktok` | handle | No | Social links |
| `facebook` | handle | No | Social links |

**Smart Defaults**:
- If phone provided → Primary CTA = "Call Now"
- If no phone but email → Primary CTA = "Email Us"
- If address provided → Add "Directions" CTA

**On Continue**:
1. Store contact info in wizard state
2. Proceed to Step 6

---

### Step 6: Preview & Launch

**Purpose**: Show what they've built, get them to launch

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│     🎉 Your Slyde is ready!                           │
│                                                        │
│     ┌─────────────────────────────────────────────┐   │
│     │                                             │   │
│     │    ┌─────────────────────────┐             │   │
│     │    │                         │             │   │
│     │    │   [LIVE PREVIEW OF      │             │   │
│     │    │    THEIR SLYDE IN       │             │   │
│     │    │    PHONE MOCKUP]        │             │   │
│     │    │                         │             │   │
│     │    │                         │             │   │
│     │    │                         │             │   │
│     │    └─────────────────────────┘             │   │
│     │                                             │   │
│     └─────────────────────────────────────────────┘   │
│                                                        │
│     Your URL: highlandblooms.slydes.io                │
│                                                        │
│     ┌──────────────────────────────────────────────┐  │
│     │          🚀 Launch My Slyde                  │  │
│     └──────────────────────────────────────────────┘  │
│                                                        │
│     ┌──────────────────────────────────────────────┐  │
│     │     Keep editing before launch               │  │
│     └──────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Preview Features**:
- Interactive phone mockup using `<DevicePreview>`
- Swipeable sections preview
- Real content from wizard inputs

**Two Paths**:

**Path A: Launch Now**
1. Create all database records (Slyde + Sections + Frames)
2. Set `published: true`
3. Show success celebration
4. Redirect to editor (with confetti? 🎊)

**Path B: Keep Editing**
1. Create all database records
2. Set `published: false`
3. Redirect to editor
4. Show "Publish when ready" prompt

---

## 4. Template System

### 4.1 Template Definition Schema

```typescript
interface WizardTemplate {
  id: string                    // 'florist', 'restaurant', etc.
  name: string                  // Display name
  icon: string                  // Emoji or Lucide icon

  // Default sections for this business type
  sections: TemplateSection[]

  // Default home screen settings
  homeDefaults: {
    primaryCta: {
      type: CTAType            // 'call', 'link', 'email', etc.
      text: string             // Button text
    }
    showCategoryIcons: boolean
    showHearts: boolean
    showShare: boolean
    showSound: boolean
    showReviews: boolean
  }

  // Placeholder content for preview
  placeholders: {
    heroVideo?: string         // Stock video URL
    heroImage?: string         // Stock image URL
    tagline?: string           // e.g., "Fresh flowers, delivered daily"
  }

  // Frame templates for sections
  frameTemplates: Record<string, FrameTemplate[]>
}

interface TemplateSection {
  name: string
  icon: string                 // Lucide icon name
  enabled: boolean             // Pre-checked by default?
  description?: string         // Help text
}

interface FrameTemplate {
  templateType: FrameData['templateType']
  title: string
  subtitle?: string
  badge?: string
  ctaType?: CTAType
  ctaText?: string
}
```

### 4.2 Example Template: Florist

```typescript
const floristTemplate: WizardTemplate = {
  id: 'florist',
  name: 'Florist',
  icon: '🌸',

  sections: [
    { name: 'Arrangements', icon: 'flower', enabled: true },
    { name: 'Weddings', icon: 'heart', enabled: true },
    { name: 'Delivery', icon: 'truck', enabled: true },
    { name: 'About Us', icon: 'info', enabled: true },
  ],

  homeDefaults: {
    primaryCta: { type: 'call', text: 'Call Now' },
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    heroVideo: '/videos/stock/florist-hero.mp4',
    heroImage: '/images/stock/florist-hero.jpg',
    tagline: 'Beautiful blooms for every occasion',
  },

  frameTemplates: {
    'Arrangements': [
      { templateType: 'hook', title: 'Fresh', subtitle: 'Flowers', badge: '🌸 Handcrafted' },
      { templateType: 'how', title: 'Made', subtitle: 'With Love', ctaText: 'See Our Process' },
      { templateType: 'proof', title: 'Loved', subtitle: 'By Hundreds', ctaText: 'Read Reviews' },
      { templateType: 'action', title: 'Order', subtitle: 'Today', ctaType: 'call', ctaText: 'Call to Order' },
    ],
    'Weddings': [
      { templateType: 'hook', title: 'Your', subtitle: 'Dream Day', badge: '💒 Wedding Specialist' },
      { templateType: 'what', title: 'Full', subtitle: 'Service', ctaText: 'What We Offer' },
      { templateType: 'proof', title: 'Real', subtitle: 'Weddings', ctaText: 'See Our Work' },
      { templateType: 'action', title: 'Book', subtitle: 'Consultation', ctaType: 'call', ctaText: 'Book Now' },
    ],
    // ... etc
  }
}
```

### 4.3 Template Storage Location

```
apps/studio/src/lib/templates/
├── index.ts                   // Export all templates
├── florist.ts
├── restaurant.ts
├── salon.ts
├── photographer.ts
├── hotel.ts
├── gym.ts
├── retail.ts
├── events.ts
└── generic.ts                 // Fallback "Other" template
```

---

## 5. Data Model

### 5.1 What Gets Created

When wizard completes:

```
ORGANIZATION (1)
├── name: "Highland Blooms"
├── slug: "highlandblooms"
├── business_type: "florist"
├── logo_url: null (or uploaded)
├── home_video_stream_uid: "xxx" (if video uploaded)
├── home_video_poster_url: "xxx"
├── primary_color: "#2563EB"
├── secondary_color: "#06B6D4"
└── socialLinks: { instagram, tiktok, facebook }

HOME SLYDE (1)
├── public_id: "home"
├── title: "Home"
├── published: true/false
└── organization_id: [org.id]

SECTION SLYDES (N)
├── public_id: "arrangements" (kebab-case of name)
├── title: "Arrangements"
├── published: true/false
└── organization_id: [org.id]

FRAMES (per section, from template)
├── slyde_id: [section.id]
├── public_id: "1", "2", "3"...
├── frame_index: 1, 2, 3...
├── template_type: "hook", "how", "proof", "action"
└── title, subtitle, etc.
```

### 5.2 Demo Data Sync

**Current State**: Demo data lives in localStorage (`demoHomeSlyde`)

**Wizard Behavior**:
1. Wizard creates REAL database records (Supabase)
2. Also syncs to localStorage for editor compatibility
3. Editor reads from localStorage (current behavior)
4. Future: Editor reads directly from Supabase

**Sync Function**:
```typescript
function syncWizardToDemo(wizardState: WizardState): void {
  const demoData: DemoHomeSlyde = {
    backgroundType: wizardState.heroContent.type,
    videoSrc: wizardState.heroContent.videoUrl || '',
    imageSrc: wizardState.heroContent.imageUrl,
    posterSrc: wizardState.heroContent.posterUrl,
    categories: wizardState.sections.map(s => ({
      id: kebabCase(s.name),
      icon: s.icon,
      name: s.name,
      description: '',
      childSlydeId: kebabCase(s.name),
      hasInventory: false,
    })),
    primaryCta: wizardState.contactInfo.phone
      ? { text: 'Call Now', action: `tel:${wizardState.contactInfo.phone}` }
      : { text: 'Contact Us', action: '#' },
    // ... rest of defaults
  }
  writeDemoHomeSlyde(demoData)
}
```

---

## 6. State Management

### 6.1 Wizard State Schema

```typescript
interface WizardState {
  // Step tracking
  currentStep: 1 | 2 | 3 | 4 | 5 | 6
  completedSteps: number[]

  // Step 1: Business Setup
  businessSetup: {
    name: string
    slug: string
    slugAvailable: boolean | null
  }

  // Step 2: Business Type
  businessType: BusinessType | null
  template: WizardTemplate | null

  // Step 3: Hero Content
  heroContent: {
    type: 'video' | 'image' | null
    file: File | null
    url: string | null
    videoStreamUid: string | null
    posterUrl: string | null
    isUploading: boolean
    uploadProgress: number
  }

  // Step 4: Sections
  sections: Array<{
    id: string
    name: string
    icon: string
    enabled: boolean
  }>

  // Step 5: Contact Info
  contactInfo: {
    phone: string
    email: string
    address: string
    instagram: string
    tiktok: string
    facebook: string
  }

  // Meta
  isSubmitting: boolean
  error: string | null
}
```

### 6.2 Persistence Strategy

**Session Storage** (persists across page refreshes within session):
```typescript
const WIZARD_STATE_KEY = 'slydes_wizard_state'

function saveWizardState(state: WizardState): void {
  sessionStorage.setItem(WIZARD_STATE_KEY, JSON.stringify(state))
}

function loadWizardState(): WizardState | null {
  const raw = sessionStorage.getItem(WIZARD_STATE_KEY)
  return raw ? JSON.parse(raw) : null
}

function clearWizardState(): void {
  sessionStorage.removeItem(WIZARD_STATE_KEY)
}
```

**Why Session Storage**:
- Persists if user accidentally closes tab and reopens
- Clears when session ends (fresh start next time)
- No server round-trips
- Simple recovery: "Continue where you left off?"

### 6.3 Context Provider

```typescript
// apps/studio/src/components/launch-wizard/WizardContext.tsx

interface WizardContextValue {
  state: WizardState
  actions: {
    setBusinessSetup: (data: WizardState['businessSetup']) => void
    setBusinessType: (type: BusinessType) => void
    setHeroContent: (data: Partial<WizardState['heroContent']>) => void
    toggleSection: (sectionId: string) => void
    renameSection: (sectionId: string, newName: string) => void
    addSection: (name: string) => void
    removeSection: (sectionId: string) => void
    setContactInfo: (data: Partial<WizardState['contactInfo']>) => void
    nextStep: () => void
    prevStep: () => void
    goToStep: (step: number) => void
    submit: () => Promise<void>
    reset: () => void
  }
}
```

---

## 7. Edge Cases

### 7.1 User Abandons Mid-Wizard

**Scenario**: User gets to Step 3, closes browser, comes back tomorrow

**Solution**:
- On wizard mount, check `sessionStorage` for saved state
- If found, show "Continue where you left off?" modal
- Options: "Continue" (restore state) or "Start fresh" (clear state)

### 7.2 Slug Already Taken

**Scenario**: User enters "highlandblooms" but it's taken

**Solution**:
- Real-time availability check (debounced 300ms)
- Show suggestions: "highlandblooms-1", "highlandblooms-inverness"
- Cannot proceed until slug is available

### 7.3 Video Upload Fails

**Scenario**: Cloudflare Stream upload fails mid-way

**Solution**:
- Show clear error: "Upload failed. Try again?"
- Retain file reference for retry
- Allow skip: "Continue without video" (use placeholder)

### 7.4 User Has No Media

**Scenario**: User doesn't have video/image ready

**Solution**:
- "Skip for now" option → use template placeholder
- Stock library browse (V2)
- Clear messaging: "You can add this later in the editor"

### 7.5 Organization Already Exists

**Scenario**: User has org from previous attempt, returns to wizard

**Solution**:
- Check `useOrganization()` on wizard mount
- If org exists but no slydes → skip Step 1
- If org + slydes exist → shouldn't see wizard (show empty state instead)

### 7.6 Network Failure During Submit

**Scenario**: Final submit fails (Step 6)

**Solution**:
- Wrap in try/catch
- Show error with retry button
- Preserve all state
- Log to error tracking (Sentry)

### 7.7 Duplicate Tab

**Scenario**: User opens wizard in two tabs

**Solution**:
- Session storage is tab-specific (different sessions)
- Each tab gets its own state
- On submit, second tab fails with "Organization already exists"
- Show: "Looks like you already set this up. Go to editor?"

---

## 8. UI/UX Patterns

### 8.1 Component Structure

```
apps/studio/src/components/launch-wizard/
├── LaunchWizard.tsx           // Main container
├── WizardContext.tsx          // State provider
├── WizardProgress.tsx         // Step indicator
├── steps/
│   ├── BusinessSetupStep.tsx  // Step 1
│   ├── BusinessTypeStep.tsx   // Step 2
│   ├── HeroContentStep.tsx    // Step 3
│   ├── SectionsStep.tsx       // Step 4
│   ├── ContactInfoStep.tsx    // Step 5
│   └── PreviewLaunchStep.tsx  // Step 6
├── components/
│   ├── BusinessTypeCard.tsx   // Selectable type card
│   ├── SectionRow.tsx         // Toggle/rename/remove row
│   ├── MediaUploader.tsx      // Drag & drop + URL input
│   ├── PhonePreview.tsx       // Live preview in phone mockup
│   └── SlugInput.tsx          // URL slug with availability check
└── templates/
    └── index.ts               // Template definitions
```

### 8.2 Visual Design

**Match existing Studio patterns**:
- Dark mode aware (`dark:bg-[#2c2c2e]`)
- Rounded cards (`rounded-xl`)
- Gradient selected states (`from-blue-600 to-cyan-500`)
- Consistent spacing (`space-y-4`, `p-6`)
- Lucide icons, consistent sizing

**Progress Indicator**:
```
○───○───○───○───○───○
1   2   3   4   5   6

○ = incomplete (gray)
● = current (blue gradient)
✓ = complete (green)
```

**Transitions**:
- Slide left/right between steps
- Fade in content
- Smooth 200ms duration

### 8.3 Mobile Considerations

- Full-screen steps on mobile
- Bottom-fixed navigation buttons
- Touch-friendly targets (48px min)
- Keyboard handling for inputs

---

## 9. Implementation Phases

### Phase 1: MVP (1 Session)

**Goal**: Basic wizard that creates a Slyde

**Scope**:
- Steps 1, 2, 3, 6 only (skip 4 & 5)
- 2 templates: Florist, Generic
- Image upload only (no video yet)
- No stock library
- Basic preview

**Creates**:
- Organization
- Home Slyde (unpublished)
- Demo data sync

### Phase 2: Full Flow (2-3 Sessions)

**Goal**: Complete wizard experience

**Scope**:
- All 6 steps
- Video upload (Cloudflare Stream)
- All 9 templates
- Section customization
- Contact info → CTA mapping
- Publish on completion

### Phase 3: Polish (Ongoing)

**Goal**: Delight and optimize

**Scope**:
- Stock video library
- AI tagline suggestions
- Logo upload
- Confetti on launch
- Analytics (wizard completion rate)
- A/B test step order

---

## Appendix: Questions to Resolve

### Design Decisions

1. **Skip Step 1 for existing orgs?**
   - Current plan: Yes, skip to Step 2
   - Alternative: Show Step 1 pre-filled for confirmation

2. **Sections step - how many max?**
   - Current plan: 6 (matches drawer limit)
   - Could allow more with scroll

3. **Frame creation - immediate or on-demand?**
   - Current plan: Create template frames on wizard complete
   - Alternative: Create empty sections, user adds frames in editor

4. **Publish default behavior?**
   - Current plan: Two buttons (Publish Now / Keep Editing)
   - Alternative: Always publish, show "edit" after

### Technical Decisions

1. **Real DB vs Demo Data sync?**
   - Current plan: Create real records + sync to localStorage
   - Future: Remove localStorage, read from Supabase

2. **Video processing wait?**
   - Current plan: Background process, show in editor when ready
   - Alternative: Wait for processing before allowing publish

---

## Summary

The Launch Wizard transforms Slydes onboarding from "blank canvas paralysis" to "guided success in 5 minutes."

**Key Principles**:
- Reduce decisions → templates do heavy lifting
- Progressive disclosure → details come later
- Ship fast → MVP first, iterate

**Success Metrics**:
- Wizard completion rate > 80%
- Time to first publish < 10 minutes
- Activation (published Slyde) within first session

**Let's build it.** 🚀
