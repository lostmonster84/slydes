# Slydes - Category & Inventory Flow

> **The Complete Data Architecture**
>
> This document defines how Home Slydes, Categories, Child Slydes, Inventory, and Items
> relate to each other in the database and UI.
>
> **Created**: December 15, 2025
> **Status**: Canonical
>
> **This document supersedes any prior concepts about data relationships.**

---

## The Hierarchy

```
ORGANIZATION (Business)
│
└── HOME SLYDE (1 per organization)
    │   └── Video + Drawer (no frames)
    │
    └── CATEGORIES (many per Home Slyde)
        │   └── Shown in drawer
        │
        └── CHILD SLYDE (1 per category)
            │   └── Multi-frame immersive experience
            │
            └── INVENTORY (optional, paid feature)
                │   └── Grid of items
                │
                └── INVENTORY ITEMS (many per inventory)
                    │
                    └── CHILD SLYDE (1 per item)
                        └── Multi-frame deep dive
```

---

## Key Principles

### 1. Everything is a Slyde

- **Home Slyde** = Special Slyde (video + drawer, no frames)
- **Category Slyde** = Child Slyde linked to a category
- **Item Slyde** = Child Slyde linked to an inventory item

The `slydes` table stores ALL slydes. The `type` field distinguishes them.

### 2. Frames are Universal

All Child Slydes (category or item) use the same `frames` structure:
- Same schema
- Same rendering
- Same editor

### 3. Inventory is Optional (Paid Feature)

Categories can optionally have inventory:
- **Without inventory**: Category Slyde ends with a CTA (e.g., "Book Service")
- **With inventory**: Category Slyde has "View All" button → Inventory Grid → Item Slydes

Inventory is a **paid feature toggle** on the category.

### 4. Immersion First, Lists Earned

Users must experience the Category Slyde before seeing inventory.
No shortcuts to inventory grids. The grid is earned through immersion.

---

## Database Schema

### organizations

The business entity. One organization = one Slydes presence.

```sql
create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,              -- URL slug: slydes.io/{slug}
  name text not null,                     -- Business name
  tagline text,                           -- Brand tagline
  accent_color text default '#2563EB',    -- Brand color (hex)
  logo_url text,                          -- Logo image

  -- Subscription
  plan_type text default 'free',          -- 'free' | 'pro' | 'enterprise'
  stripe_customer_id text,

  -- Metadata
  enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

create index organizations_slug_idx on public.organizations(slug);
```

---

### home_slydes

One per organization. The video-first entry point.

```sql
create table public.home_slydes (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,

  -- Video
  video_url text not null,                -- Main video URL
  video_poster_url text,                  -- Fallback poster image

  -- Content (shown over video)
  brand_name text not null,               -- Display name
  tagline text,                           -- Tagline overlay

  -- Social proof
  rating decimal(2,1),                    -- e.g., 4.9
  review_count integer default 0,

  -- Business info (for Info button)
  about text,
  address text,
  hours text,
  website text,
  phone text,
  email text,

  -- Primary CTA (optional)
  primary_cta_text text,                  -- e.g., "Book Now"
  primary_cta_action text,                -- URL or action type

  -- Metadata
  enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- One home slyde per organization
create unique index home_slydes_organization_idx on public.home_slydes(organization_id);
```

---

### categories

Categories shown in the Home Slyde drawer.

```sql
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  home_slyde_id uuid references public.home_slydes(id) on delete cascade not null,

  -- Display
  name text not null,                     -- e.g., "Vehicles"
  icon text,                              -- Emoji or icon name
  description text,                       -- Brief description

  -- Linked Child Slyde (the category experience)
  child_slyde_id uuid references public.slydes(id) on delete set null,

  -- Inventory settings
  has_inventory boolean default false,    -- PAID FEATURE TOGGLE
  inventory_cta_text text,                -- e.g., "View All 12 Vehicles"

  -- Ordering
  display_order integer default 0,

  -- Metadata
  enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index categories_home_slyde_idx on public.categories(home_slyde_id);
create index categories_display_order_idx on public.categories(display_order);
```

---

### slydes

All slydes (category slydes, item slydes, standalone slydes).

```sql
create table public.slydes (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,

  -- Identity
  slug text not null,                     -- URL slug
  name text not null,                     -- Display name
  description text,

  -- Type
  type text default 'standalone',         -- 'standalone' | 'category' | 'item'

  -- Frames stored as JSONB array
  frames jsonb default '[]'::jsonb,

  -- Publishing
  is_published boolean default false,
  published_at timestamptz,

  -- Analytics
  view_count integer default 0,

  -- Metadata
  enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

create unique index slydes_org_slug_idx on public.slydes(organization_id, slug);
create index slydes_organization_idx on public.slydes(organization_id);
create index slydes_type_idx on public.slydes(type);
```

---

### inventory_items

Items within a category that has inventory enabled.

```sql
create table public.inventory_items (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete cascade not null,

  -- Display (shown in grid)
  title text not null,                    -- e.g., "BMW 320d M Sport"
  subtitle text,                          -- e.g., "2022 - 15,000 miles"
  price text,                             -- e.g., "£28,995" (formatted string)
  price_cents integer,                    -- Price in cents for Stripe (2899500)
  thumbnail_url text,                     -- Square image for grid
  badge text,                             -- e.g., "Featured", "New In"

  -- Commerce (PAID FEATURE - Pro tier only)
  commerce_mode text default 'none',      -- 'none' | 'enquire' | 'buy_now' | 'add_to_cart'

  -- Linked Child Slyde (the item deep-dive)
  item_slyde_id uuid references public.slydes(id) on delete set null,

  -- Ordering
  display_order integer default 0,

  -- Metadata
  enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index inventory_items_category_idx on public.inventory_items(category_id);
create index inventory_items_display_order_idx on public.inventory_items(display_order);
```

**Commerce Mode Values**:
| Mode | Plan | Behavior |
|------|------|----------|
| `none` | All | No commerce button, shows chevron |
| `enquire` | Creator+ | Opens enquiry form/link/phone |
| `buy_now` | Pro | Direct Stripe Checkout |
| `add_to_cart` | Pro | Adds to cart, checkout later |

---

### frames (JSONB structure)

Frames are stored as JSONB in the `slydes.frames` column.

```typescript
interface Frame {
  id: string                              // UUID

  // Content
  title: string
  subtitle?: string
  badge?: string

  // Background
  background: {
    type: 'video' | 'image' | 'gradient'
    src?: string                          // Video/image URL
    gradient?: string                     // Tailwind gradient classes
    position?: string                     // e.g., 'center center'
  }

  // CTA (optional)
  cta?: {
    text: string                          // e.g., "Book Now"
    action: string                        // URL or action type
  }

  // Special flags
  showViewAll?: boolean                   // Triggers inventory grid (category slydes only)

  // Ordering
  order: number
}
```

---

## TypeScript Interfaces

```typescript
// Organization
export interface Organization {
  id: string
  slug: string
  name: string
  tagline?: string
  accentColor: string
  logoUrl?: string
  planType: 'free' | 'pro' | 'enterprise'
  stripeCustomerId?: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

// Home Slyde
export interface HomeSlyde {
  id: string
  organizationId: string
  videoUrl: string
  videoPosterUrl?: string
  brandName: string
  tagline?: string
  rating?: number
  reviewCount: number
  about?: string
  address?: string
  hours?: string
  website?: string
  phone?: string
  email?: string
  primaryCtaText?: string
  primaryCtaAction?: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

// Category
export interface Category {
  id: string
  homeSlydeId: string
  name: string
  icon?: string
  description?: string
  childSlydeId?: string
  hasInventory: boolean                   // PAID FEATURE
  inventoryCtaText?: string
  displayOrder: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

// Slyde (Child Slyde - category or item)
export interface Slyde {
  id: string
  organizationId: string
  slug: string
  name: string
  description?: string
  type: 'standalone' | 'category' | 'item'
  frames: Frame[]
  isPublished: boolean
  publishedAt?: string
  viewCount: number
  enabled: boolean
  createdAt: string
  updatedAt: string
  createdBy?: string
}

// Frame
export interface Frame {
  id: string
  title: string
  subtitle?: string
  badge?: string
  background: {
    type: 'video' | 'image' | 'gradient'
    src?: string
    gradient?: string
    position?: string
  }
  cta?: {
    text: string
    action: string
  }
  showViewAll?: boolean
  order: number
}

// Inventory Item
export interface InventoryItem {
  id: string
  categoryId: string
  title: string
  subtitle?: string
  price?: string
  thumbnailUrl?: string
  badge?: string
  itemSlydeId?: string
  displayOrder: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Relationships Diagram

```
organizations
     │
     │ 1:1
     ▼
home_slydes
     │
     │ 1:many
     ▼
categories ──────────────────┐
     │                       │
     │ 1:1                   │ 1:1 (child_slyde_id)
     │                       ▼
     │                    slydes (type='category')
     │                       │
     │                       │ has frames[]
     │
     │ 1:many (if has_inventory=true)
     ▼
inventory_items ─────────────┐
                             │
                             │ 1:1 (item_slyde_id)
                             ▼
                          slydes (type='item')
                             │
                             │ has frames[]
```

---

## Frames Storage Strategy (Important)

This doc shows `slydes.frames` as **JSONB** for clarity and iteration speed. In the real product we have two valid implementation options:

- **Option A (simple v1)**: `slydes.frames` stored as JSONB (easy CRUD, easy drafts)
- **Option B (normalized)**: a `frames` table (better for querying, per-frame analytics, ordering constraints)

**Rule**: Pick one as the canonical storage for product data. If we keep JSONB for editing, we should still materialize frames into a table (or rollup model) for analytics/queries — but the “source of truth” must be explicit.

---

## User Journey

### Flow 1: Category WITHOUT Inventory

```
Home Slyde (video)
    │
    │ tap pill / swipe up
    ▼
Drawer opens (categories visible)
    │
    │ tap "Services"
    ▼
Category Slyde: Services (frames)
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

### Flow 2: Category WITH Inventory

```
Home Slyde (video)
    │
    │ tap pill / swipe up
    ▼
Drawer opens (categories visible)
    │
    │ tap "Vehicles"
    ▼
Category Slyde: Vehicles (frames)
    │
    │ Frame 1: Hero
    │ Frame 2: Quality Pre-Owned
    │ Frame 3: Every Vehicle Inspected
    │ Frame 4: "View All 12 Vehicles" CTA (showViewAll: true)
    │
    │ tap "View All"
    ▼
Inventory Grid (list of vehicles)
    │
    │ tap "BMW 320d"
    ▼
Item Slyde: BMW 320d (frames)
    │
    │ Frame 1: Hero
    │ Frame 2: Premium Interior
    │ Frame 3: Performance
    │ Frame 4: Full History
    │ Frame 5: "Enquire Now" CTA
    │
    │ tap CTA
    ▼
External action (enquiry form)
```

---

## CRUD Operations

### Create Organisation + Home Slyde

```typescript
// 1. Create organisation
const { data: org } = await supabase
  .from('organisations')
  .insert({
    slug: 'highland-motors',
    name: 'Highland Motors',
    tagline: 'Premium Service, Highland Style',
    accent_color: '#22D3EE'
  })
  .select()
  .single()

// 2. Create home slyde
const { data: homeSlyde } = await supabase
  .from('home_slydes')
  .insert({
    organisation_id: org.id,
    video_url: '/videos/highland-motors.mp4',
    brand_name: 'Highland Motors',
    tagline: 'Premium Service, Highland Style',
    rating: 4.9,
    review_count: 847
  })
  .select()
  .single()
```

### Create Category with Child Slyde

```typescript
// 1. Create the category slyde first
const { data: categorySlyde } = await supabase
  .from('slydes')
  .insert({
    organisation_id: org.id,
    slug: 'vehicles',
    name: 'Vehicles',
    type: 'category',
    frames: [
      {
        id: crypto.randomUUID(),
        title: 'Quality Pre-Owned',
        subtitle: 'Hand-picked vehicles. Full history.',
        background: { type: 'gradient', gradient: 'from-slate-800 to-slate-900' },
        order: 0
      },
      {
        id: crypto.randomUUID(),
        title: 'Browse Our Stock',
        subtitle: '12 vehicles ready for viewing.',
        background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
        showViewAll: true,
        cta: { text: 'View All 12 Vehicles', action: 'inventory' },
        order: 1
      }
    ]
  })
  .select()
  .single()

// 2. Create the category linking to the slyde
const { data: category } = await supabase
  .from('categories')
  .insert({
    home_slyde_id: homeSlyde.id,
    name: 'Vehicles',
    icon: '🚗',
    description: 'Quality Used Cars',
    child_slyde_id: categorySlyde.id,
    has_inventory: true,
    inventory_cta_text: 'View All Vehicles',
    display_order: 1
  })
  .select()
  .single()
```

### Create Inventory Item with Item Slyde

```typescript
// 1. Create the item slyde first
const { data: itemSlyde } = await supabase
  .from('slydes')
  .insert({
    organisation_id: org.id,
    slug: 'bmw-320d',
    name: 'BMW 320d M Sport',
    type: 'item',
    frames: [
      {
        id: crypto.randomUUID(),
        title: 'BMW 320d M Sport',
        subtitle: '2022 - 15,000 miles - Automatic - Diesel',
        badge: 'GBP28,995',
        background: { type: 'gradient', gradient: 'from-blue-900 to-slate-900' },
        order: 0
      },
      {
        id: crypto.randomUUID(),
        title: 'Interested?',
        subtitle: 'Book a test drive or reserve with GBP500 deposit.',
        background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
        cta: { text: 'Enquire Now', action: 'enquire' },
        order: 1
      }
    ]
  })
  .select()
  .single()

// 2. Create the inventory item linking to the slyde
const { data: item } = await supabase
  .from('inventory_items')
  .insert({
    category_id: category.id,
    title: 'BMW 320d M Sport',
    subtitle: '2022 - 15,000 miles',
    price: 'GBP28,995',
    thumbnail_url: '/images/bmw-320d.jpg',
    badge: 'Featured',
    item_slyde_id: itemSlyde.id,
    display_order: 0
  })
  .select()
  .single()
```

---

## API Endpoints

### Public (Viewer)

```
GET /api/v1/{org-slug}                    → Home Slyde + Categories
GET /api/v1/{org-slug}/{slyde-slug}       → Child Slyde (any type)
GET /api/v1/{org-slug}/category/{id}/inventory → Inventory items
```

### Admin (Editor)

```
# Organisations
GET    /api/admin/organisations
POST   /api/admin/organisations
GET    /api/admin/organisations/{id}
PUT    /api/admin/organisations/{id}
DELETE /api/admin/organisations/{id}

# Home Slydes
GET    /api/admin/home-slydes/{org-id}
PUT    /api/admin/home-slydes/{id}

# Categories
GET    /api/admin/categories?home_slyde_id={id}
POST   /api/admin/categories
GET    /api/admin/categories/{id}
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
PATCH  /api/admin/categories/reorder

# Slydes (Child Slydes)
GET    /api/admin/slydes?organisation_id={id}
POST   /api/admin/slydes
GET    /api/admin/slydes/{id}
PUT    /api/admin/slydes/{id}
DELETE /api/admin/slydes/{id}

# Inventory Items
GET    /api/admin/inventory-items?category_id={id}
POST   /api/admin/inventory-items
GET    /api/admin/inventory-items/{id}
PUT    /api/admin/inventory-items/{id}
DELETE /api/admin/inventory-items/{id}
PATCH  /api/admin/inventory-items/reorder
```

---

## Business Rules

### Category Limits

| Plan | Max Categories |
|------|----------------|
| Free | 4 |
| Pro | 6 |
| Enterprise | Unlimited |

### Inventory (Paid Feature)

- **Free plan**: No inventory (categories end with CTA only)
- **Pro plan**: Inventory enabled (has_inventory toggle available)
- **Enterprise**: Inventory + advanced features

### Frame Limits

| Slyde Type | Min Frames | Max Frames |
|------------|------------|------------|
| Category | 2 | 6 |
| Item | 2 | 10 |
| Standalone | 1 | 10 |

### Display Order

- Categories: 0-indexed, shown in drawer in order
- Inventory items: 0-indexed, shown in grid in order
- Frames: 0-indexed, swiped through in order

---

## Migration Path

### From Current Demo Data

The `highlandMotorsData.ts` demo file maps to this schema:

```typescript
// Demo → Database mapping
highlandMotorsData.businessName → organisations.name
highlandMotorsData.tagline → home_slydes.tagline
highlandMotorsData.categories → categories table
highlandMotorsData.categories[].frames → slydes.frames (type='category')
highlandMotorsData.categories[].inventory → inventory_items table
highlandMotorsData.categories[].inventory[].frames → slydes.frames (type='item')
```

---

## Related Documents

- [STRUCTURE.md](./STRUCTURE.md) - Platform hierarchy overview
- [HOME-SLYDE-SYSTEM.md](./HOME-SLYDE-SYSTEM.md) - Why Home Slyde exists
- [HOME-SLYDE-BUILD-SPEC.md](./HOME-SLYDE-BUILD-SPEC.md) - How to build Home Slyde
- [CRUDX.md](../.ai/frameworks/CRUDX.md) - CRUD implementation framework

---

*Document Status: CANONICAL*
*This is the source of truth for Slydes data architecture.*
