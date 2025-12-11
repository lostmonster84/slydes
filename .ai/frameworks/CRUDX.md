# CRUDX Framework

> **CRUD eXtended - Full-Stack Content Management System**
>
> Automatic trigger for complete backend + frontend CRUD systems. Never use Sanity Studio—always build custom admin interfaces.

---

## What is CRUDX?

**CRUDX** is a framework that automatically triggers full-stack thinking whenever content or data needs to be managed. When you mention adding any content to a page (slides, testimonials, routes, offers, etc.), the AI immediately knows to build a complete 6-layer system.

### The Problem CRUDX Solves

**Without CRUDX:**
- AI might build frontend only
- Forget database schema
- Miss API routes
- No admin interface
- Content can't be changed

**With CRUDX:**
- One word ("CRUDX") → Complete system
- Database, API, types, admin UI, all built
- Content is fully manageable
- Custom admin (never Sanity Studio)

---

## When to Use CRUDX

### Automatic Triggers (AI should detect)

✅ **Use CRUDX when:**
- Adding content that will need to change (testimonials, team members, routes, offers)
- Building features where content is dynamic
- Creating collections of items (blog posts, case studies, products)
- Any time content needs Create, Read, Update, Delete operations
- User says "we need to manage [X]"
- User says "let's add [content] to this page"

❌ **Don't use CRUDX when:**
- Hardcoded content (footer text, static pages)
- One-time style changes (button colors, spacing)
- Bug fixes
- Simple text updates that won't change again

### Explicit Trigger

User says: **"CRUDX"** → Build complete 6-layer system immediately

---

## The 6-Layer CRUDX Stack

### Layer 1: Database Schema (Supabase PostgreSQL)

**Location:** `supabase/migrations/[timestamp]_create_[resource]_table.sql`

```sql
-- Example: Routes table
create table public.routes (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  subtitle text,
  description text not null,
  background_image text,
  background_video text,
  background_position text default 'center center',
  overlay_intensity integer default 65,
  ken_burns boolean default true,
  duration integer not null,
  distance integer not null,
  difficulty text not null,
  region text,
  highlights text[],
  route_tags text[],
  featured boolean default false,
  enabled boolean default true,
  display_order integer default 0,
  content_position text default 'bottom',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

-- Indexes for performance
create index routes_slug_idx on public.routes(slug);
create index routes_enabled_idx on public.routes(enabled);
create index routes_featured_idx on public.routes(featured);
create index routes_display_order_idx on public.routes(display_order);

-- Enable Row Level Security
alter table public.routes enable row level security;

-- Policies (adjust based on needs)
create policy "Public routes are viewable by everyone"
  on public.routes for select
  using (enabled = true);

create policy "Admin users can manage routes"
  on public.routes for all
  using (auth.role() = 'authenticated');
```

**Key Rules:**
- Use `snake_case` for column names (database convention)
- Always include: `id`, `created_at`, `updated_at`, `created_by`, `updated_by`
- Add `enabled` boolean for soft visibility control
- Add `display_order` integer for manual sorting
- Use `text[]` for arrays (highlights, tags)
- Add indexes for frequently queried columns
- Enable RLS (Row Level Security)

---

### Layer 2: Type Definitions

**Location:** `src/types/[resource].ts`

```typescript
// Example: Routes types
export interface Route {
  id: string
  slug: string
  name: string
  subtitle?: string
  description: string
  backgroundImage?: string
  backgroundVideo?: string
  backgroundPosition?: string
  overlayIntensity?: number
  kenBurns?: boolean
  duration: number
  distance: number
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert'
  region?: string
  highlights?: string[]
  routeTags?: string[]
  featured?: boolean
  enabled?: boolean
  displayOrder?: number
  contentPosition?: 'top' | 'center' | 'bottom'
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

export interface CreateRouteInput {
  slug: string
  name: string
  subtitle?: string
  description: string
  backgroundImage?: string
  backgroundVideo?: string
  backgroundPosition?: string
  overlayIntensity?: number
  kenBurns?: boolean
  duration: number
  distance: number
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert'
  region?: string
  highlights?: string[]
  routeTags?: string[]
  featured?: boolean
  enabled?: boolean
  displayOrder?: number
  contentPosition?: 'top' | 'center' | 'bottom'
}

export interface UpdateRouteInput extends Partial<CreateRouteInput> {}

export interface RouteFilters {
  enabled?: boolean
  featured?: boolean
  region?: string
  difficulty?: string
}
```

**Key Rules:**
- Use `camelCase` for property names (TypeScript convention)
- Main interface matches database columns (transformed)
- `CreateInput` = required fields for creation
- `UpdateInput` = partial of CreateInput (all optional)
- `Filters` interface for query params
- Optional fields use `?:`
- Timestamp fields are `string` (ISO format)

---

### Layer 3: API Routes (REST Endpoints)

**Location:** `src/app/api/admin/[resource]/route.ts` and `src/app/api/admin/[resource]/[id]/route.ts`

#### 3.1: Collection Route (`/api/admin/routes/route.ts`)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { Route, CreateRouteInput } from '@/types/route'

/**
 * GET /api/admin/routes
 * Fetch all routes with optional filters
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Build query
    let query = supabase
      .from('routes')
      .select('*')
      .order('display_order', { ascending: true })

    // Apply filters
    const enabled = searchParams.get('enabled')
    if (enabled !== null) {
      query = query.eq('enabled', enabled === 'true')
    }

    const featured = searchParams.get('featured')
    if (featured !== null) {
      query = query.eq('featured', featured === 'true')
    }

    const region = searchParams.get('region')
    if (region) {
      query = query.eq('region', region)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching routes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch routes', details: error.message },
        { status: 500 }
      )
    }

    // Transform snake_case to camelCase
    const routes: Route[] = (data || []).map(transformRoute)

    return NextResponse.json({ routes })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/routes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/routes
 * Create a new route
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body: CreateRouteInput = await request.json()

    // Validate required fields
    const requiredFields = ['slug', 'name', 'description', 'duration', 'distance', 'difficulty']
    for (const field of requiredFields) {
      if (!body[field as keyof CreateRouteInput]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Transform camelCase to snake_case for database
    const dbData = {
      slug: body.slug,
      name: body.name,
      subtitle: body.subtitle,
      description: body.description,
      background_image: body.backgroundImage,
      background_video: body.backgroundVideo,
      background_position: body.backgroundPosition || 'center center',
      overlay_intensity: body.overlayIntensity ?? 65,
      ken_burns: body.kenBurns ?? true,
      duration: body.duration,
      distance: body.distance,
      difficulty: body.difficulty,
      region: body.region,
      highlights: body.highlights || [],
      route_tags: body.routeTags || [],
      featured: body.featured ?? false,
      enabled: body.enabled ?? true,
      display_order: body.displayOrder ?? 0,
      content_position: body.contentPosition || 'bottom',
    }

    const { data, error } = await supabase
      .from('routes')
      .insert([dbData])
      .select()
      .single()

    if (error) {
      console.error('Error creating route:', error)
      return NextResponse.json(
        { error: 'Failed to create route', details: error.message },
        { status: 500 }
      )
    }

    const route = transformRoute(data)

    return NextResponse.json({ route }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/routes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Helper: Transform database row (snake_case) to Route type (camelCase)
 */
function transformRoute(row: any): Route {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    description: row.description,
    backgroundImage: row.background_image,
    backgroundVideo: row.background_video,
    backgroundPosition: row.background_position,
    overlayIntensity: row.overlay_intensity,
    kenBurns: row.ken_burns,
    duration: row.duration,
    distance: row.distance,
    difficulty: row.difficulty,
    region: row.region,
    highlights: row.highlights || [],
    routeTags: row.route_tags || [],
    featured: row.featured,
    enabled: row.enabled,
    displayOrder: row.display_order,
    contentPosition: row.content_position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
  }
}
```

#### 3.2: Single Resource Route (`/api/admin/routes/[id]/route.ts`)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { Route, UpdateRouteInput } from '@/types/route'

/**
 * GET /api/admin/routes/[id]
 * Fetch a single route by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Route not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching route:', error)
      return NextResponse.json(
        { error: 'Failed to fetch route', details: error.message },
        { status: 500 }
      )
    }

    const route = transformRoute(data)

    return NextResponse.json({ route })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/routes/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/routes/[id]
 * Update a route
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body: Partial<UpdateRouteInput> = await request.json()

    // Transform camelCase to snake_case for database
    const dbData: any = {}

    if (body.slug !== undefined) dbData.slug = body.slug
    if (body.name !== undefined) dbData.name = body.name
    if (body.subtitle !== undefined) dbData.subtitle = body.subtitle
    if (body.description !== undefined) dbData.description = body.description
    if (body.backgroundImage !== undefined) dbData.background_image = body.backgroundImage
    // ... all other fields

    const { data, error } = await supabase
      .from('routes')
      .update(dbData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Route not found' },
          { status: 404 }
        )
      }
      console.error('Error updating route:', error)
      return NextResponse.json(
        { error: 'Failed to update route', details: error.message },
        { status: 500 }
      )
    }

    const route = transformRoute(data)

    return NextResponse.json({ route })
  } catch (error) {
    console.error('Unexpected error in PUT /api/admin/routes/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/routes/[id]
 * Delete a route
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting route:', error)
      return NextResponse.json(
        { error: 'Failed to delete route', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/routes/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function transformRoute(row: any): Route {
  // Same as above
}
```

**Key Rules:**
- Collection route handles GET (list) and POST (create)
- Single resource route handles GET (read), PUT (update), DELETE (delete)
- Always transform between snake_case (DB) and camelCase (client)
- Validate required fields on POST
- Return proper HTTP status codes (200, 201, 400, 404, 500)
- Include error details in responses
- Use `await params` for Next.js 15

---

### Layer 4: Admin Page UI

**Location:** `src/app/admin/[resource]/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { AdminButton } from '@/components/admin/AdminButton'
import type { Route, CreateRouteInput } from '@/types/route'
import Image from 'next/image'

export default function RoutesAdminPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadRoutes()
  }, [])

  async function loadRoutes() {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch('/api/admin/routes')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load routes')
      }

      setRoutes(data.routes || [])
    } catch (err: any) {
      console.error('Error loading routes:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteRoute(id: string) {
    if (!confirm('Are you sure you want to delete this route?')) return

    try {
      const res = await fetch(`/api/admin/routes/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete route')
      }

      await loadRoutes()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  async function toggleEnabled(route: Route) {
    try {
      const res = await fetch(`/api/admin/routes/${route.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !route.enabled }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update route')
      }

      await loadRoutes()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading routes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)]">Routes</h1>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1">
            Manage Highland driving routes
          </p>
        </div>
        <AdminButton
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateForm(true)}
        >
          Add Route
        </AdminButton>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {(showCreateForm || editingRoute) && (
        <RouteForm
          route={editingRoute}
          onSave={async () => {
            setShowCreateForm(false)
            setEditingRoute(null)
            await loadRoutes()
          }}
          onCancel={() => {
            setShowCreateForm(false)
            setEditingRoute(null)
          }}
        />
      )}

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            onEdit={() => setEditingRoute(route)}
            onDelete={() => deleteRoute(route.id)}
            onToggleEnabled={() => toggleEnabled(route)}
          />
        ))}
      </div>

      {routes.length === 0 && !error && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No routes yet</p>
          <AdminButton
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateForm(true)}
          >
            Create First Route
          </AdminButton>
        </div>
      )}
    </div>
  )
}

function RouteCard({ route, onEdit, onDelete, onToggleEnabled }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Image */}
      {route.backgroundImage && (
        <div className="relative h-48 bg-gray-100">
          <Image
            src={route.backgroundImage}
            alt={route.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-lg">{route.name}</h3>
            <p className="text-white/80 text-sm">{route.subtitle}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{route.duration}d</span>
          <span>{route.distance}mi</span>
          <span>{route.difficulty}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onToggleEnabled}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={route.enabled ? 'Hide' : 'Show'}
          >
            {route.enabled ? (
              <Eye className="w-4 h-4 text-gray-600" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

function RouteForm({ route, onSave, onCancel }) {
  // Form implementation with all fields
  // See Routes example in codebase
}
```

**Key Rules:**
- Always `'use client'` for interactive admin pages
- Load data on mount with `useEffect`
- Show loading state while fetching
- Show error state if fetch fails
- Grid or table layout for list view
- Cards with image + metadata + actions
- Inline toggles for boolean states (enabled/featured)
- Delete confirmation before destructive actions
- Modal forms (not separate pages)
- Reload data after create/edit/delete

---

### Layer 5: Admin Components

**Location:** `src/components/admin/[Resource]Card.tsx`, `[Resource]Form.tsx`, etc.

Extract reusable components:
- `[Resource]Card` - Display component
- `[Resource]Form` - Create/edit form
- `[Resource]Filters` - Filter UI
- `[Resource]Stats` - Analytics/stats cards

(See Layer 4 example for inline component patterns)

---

### Layer 6: Integration Points

#### 6.1: Add to Admin Navigation

**Location:** `src/app/admin/layout.tsx` or admin nav component

```typescript
const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Routes', href: '/admin/routes', icon: Map }, // NEW
  { name: 'Offers', href: '/admin/offers', icon: Tag },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]
```

#### 6.2: Preview Links

Add preview links to public pages:

```typescript
<a
  href={`/routes/${route.slug}`}
  target="_blank"
  rel="noopener noreferrer"
  className="admin-btn admin-btn-secondary"
>
  <ExternalLink className="w-4 h-4" />
  Preview
</a>
```

#### 6.3: Status Badges

```typescript
<span className={`px-2 py-1 rounded-full text-xs font-medium ${
  route.enabled
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-600'
}`}>
  {route.enabled ? 'Active' : 'Hidden'}
</span>
```

---

## CRUDX Checklist

When implementing CRUDX, verify all layers:

### Database Layer
- [ ] Migration file created
- [ ] Table schema defined (snake_case)
- [ ] Indexes added for common queries
- [ ] RLS policies configured
- [ ] `created_at`, `updated_at`, `enabled`, `display_order` columns included

### Type Definitions
- [ ] Main interface defined (camelCase)
- [ ] `CreateInput` type defined
- [ ] `UpdateInput` type defined (Partial)
- [ ] `Filters` type defined (if applicable)

### API Routes
- [ ] `GET /api/admin/[resource]` - List with filters
- [ ] `POST /api/admin/[resource]` - Create
- [ ] `GET /api/admin/[resource]/[id]` - Read single
- [ ] `PUT /api/admin/[resource]/[id]` - Update
- [ ] `DELETE /api/admin/[resource]/[id]` - Delete
- [ ] Transform functions implemented (snake_case ↔ camelCase)
- [ ] Error handling with proper status codes
- [ ] Required field validation

### Admin Page UI
- [ ] Admin page created (`/admin/[resource]/page.tsx`)
- [ ] List view with cards or table
- [ ] Create button/modal
- [ ] Edit modal/form
- [ ] Delete confirmation
- [ ] Toggle buttons (enabled/featured)
- [ ] Loading state
- [ ] Error state
- [ ] Empty state

### Admin Components
- [ ] `[Resource]Card` component
- [ ] `[Resource]Form` component
- [ ] Filters component (if applicable)
- [ ] Stats cards (if applicable)

### Integration
- [ ] Added to admin navigation
- [ ] Preview links to public pages
- [ ] Status badges
- [ ] Mobile responsive
- [ ] Tested create/edit/delete flows

---

## Architecture Rules

### ❌ Never Do This

**DON'T use Sanity Studio:**
```typescript
// ❌ WRONG - Never use Sanity Studio
import { Studio } from 'sanity'
<Studio />
```

**DON'T skip the admin UI:**
```typescript
// ❌ WRONG - Backend only, no way to manage content
// Just API routes without admin page
```

**DON'T mix naming conventions:**
```typescript
// ❌ WRONG - Inconsistent naming
const dbData = {
  slug: body.slug,
  background_image: body.backgroundImage, // snake_case
  kenBurns: body.kenBurns, // camelCase (WRONG - should be ken_burns)
}
```

### ✅ Always Do This

**DO build custom admin UI:**
```typescript
// ✅ CORRECT - Custom admin interface
<RoutesAdminPage />
```

**DO use transform layer:**
```typescript
// ✅ CORRECT - Transform between DB and client
function transformRoute(row: any): Route {
  return {
    backgroundImage: row.background_image, // DB snake_case → client camelCase
    kenBurns: row.ken_burns,
  }
}
```

**DO use Supabase for storage:**
```typescript
// ✅ CORRECT - Supabase PostgreSQL
const supabase = await createClient()
const { data } = await supabase.from('routes').select('*')
```

---

## Examples from Codebase

### Example 1: Routes System

**Complete CRUDX implementation:**

1. **Database:** `supabase/migrations/20251208_create_routes_table.sql`
2. **Types:** `src/types/route.ts`
3. **API:** `src/app/api/admin/routes/route.ts` + `[id]/route.ts`
4. **Admin UI:** `src/app/admin/routes/page.tsx`
5. **Components:** Inline `RouteCard`, `RouteForm`
6. **Integration:** Nav link, preview links, status badges

**See:** [src/app/admin/routes/page.tsx](../../src/app/admin/routes/page.tsx)

---

### Example 2: Offers System

**CRUDX + AIDA content:**

1. **Database:** Sanity CMS (exception - legacy system)
2. **Types:** Complex AIDA journey types
3. **API:** `src/app/api/admin/offers/route.ts` + `[id]/route.ts`
4. **Admin UI:** `src/app/admin/offers/page.tsx` (extensive form)
5. **Components:** Hero features, package segments, FAQ items
6. **Integration:** Stripe integration, preview links

**See:** [src/app/admin/offers/page.tsx](../../src/app/admin/offers/page.tsx)

---

## Common Patterns

### Pattern 1: Image Uploads

If resource includes images:

```typescript
// Add image upload field to form
<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
/>

// Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from('routes')
  .upload(`${route.id}/${file.name}`, file)
```

---

### Pattern 2: Toggle States

Boolean states should have inline toggles:

```typescript
async function toggleEnabled(route: Route) {
  await fetch(`/api/admin/routes/${route.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled: !route.enabled }),
  })
  loadRoutes()
}
```

---

### Pattern 3: Display Order (Drag-and-Drop)

For manual sorting:

```typescript
// Database column
display_order integer default 0

// Reorder endpoint
export async function PATCH(request: Request) {
  const { routeIds } = await request.json()

  const updates = routeIds.map((id, index) => ({
    id,
    display_order: index + 1,
  }))

  await supabase.from('routes').upsert(updates)
}

// UI with drag-and-drop (use react-beautiful-dnd or similar)
```

---

### Pattern 4: Status Workflows

For content with approval workflows:

```typescript
status: 'draft' | 'active' | 'archived' | 'pending-approval'

// Status-specific endpoints
POST /api/admin/routes/:id/publish
POST /api/admin/routes/:id/archive
POST /api/admin/routes/:id/approve
```

---

### Pattern 5: Filters and Search

```typescript
// API route
const search = searchParams.get('search')
if (search) {
  query = query.ilike('name', `%${search}%`)
}

// UI
<input
  type="search"
  placeholder="Search routes..."
  onChange={(e) => setSearch(e.target.value)}
/>
```

---

## Integration with Other Frameworks

### CRUDX + CODA

**Workflow:**
1. **CODA** plans the feature (Context → Objective → Details → Acceptance)
2. **CRUDX** builds the complete management system

**Example:**
- User: "Let's add testimonials to the homepage"
- CODA: Plan testimonials feature, placement, design
- CRUDX: Build testimonials database, API, admin UI

---

### CRUDX + AIDA

**Workflow:**
1. **AIDA** structures the public-facing content (Attention → Interest → Desire → Action)
2. **CRUDX** provides the admin interface to manage that content

**Example:**
- AIDA: Structure the offers page journey
- CRUDX: Build offers admin to manage hero, segments, FAQs, gallery

---

### CRUDX + SOPHIA

**Workflow:**
1. **CRUDX** builds the admin UI
2. **SOPHIA** audits the admin UX quality

**Example:**
- CRUDX: Build routes admin page
- SOPHIA: Score the admin UI (typography, spacing, touch targets, etc.)

---

### CRUDX + Design Variations

**Workflow:**
1. **Design Variations** creates the public UI (5 variations, AIDA scoring)
2. **CRUDX** creates the admin interface to populate that UI

**Example:**
- Design Variations: Create 5 route card designs, user picks one
- CRUDX: Build routes admin to create/edit routes that render in chosen design

---

## Quick Reference Decision Tree

```
Is this content that will need to change?
├─ YES → Trigger CRUDX
│   ├─ Build database schema
│   ├─ Define types
│   ├─ Create API routes
│   ├─ Build admin UI
│   ├─ Create components
│   └─ Integrate with admin
└─ NO → Standard implementation
    └─ Hardcoded content or one-time change
```

### Examples

| User Request | CRUDX? | Reason |
|--------------|--------|--------|
| "Add testimonials to homepage" | ✅ YES | Testimonials are content that needs management |
| "Change button color to red" | ❌ NO | Hardcoded style change |
| "Add route cards to routes page" | ✅ YES | Routes are content that needs management |
| "Fix typo in footer" | ❌ NO | One-time text fix |
| "Add team members page" | ✅ YES | Team members are content that needs management |
| "Update hero image" | ❌ NO | One-time image swap (unless building image library) |
| "Add blog posts" | ✅ YES | Blog posts need full CRUD |
| "Adjust spacing on cards" | ❌ NO | CSS/styling adjustment |

---

## Summary

**CRUDX = Complete Content Management System**

### The 6 Layers
1. **Database** - Supabase PostgreSQL schema (snake_case)
2. **Types** - TypeScript interfaces (camelCase)
3. **API** - REST endpoints with transform layer
4. **Admin UI** - Custom admin page (never Sanity Studio)
5. **Components** - Reusable admin components
6. **Integration** - Nav, preview links, status badges

### Trigger Words
- **"CRUDX"** - Explicit trigger
- **"Add [content] to page"** - Implicit trigger
- **"Manage [resource]"** - Implicit trigger
- **"We need to change [X]"** - Implicit trigger

### Key Rules
- ❌ Never use Sanity Studio
- ✅ Always build custom admin UI
- ✅ Supabase for storage
- ✅ Transform layer required (snake_case ↔ camelCase)
- ✅ Complete CRUD operations (Create, Read, Update, Delete)

### Quality Gates
- All 6 layers implemented
- Mobile responsive
- Loading/error/empty states
- Delete confirmations
- Preview links functional

---

**When in doubt, CRUDX it. If content might change, it needs a management system.**

---

**Framework Status:** Production-ready
**Last Updated:** 2025-12-08
**Version:** 1.0
