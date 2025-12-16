# List View Feature Specification

> **The Missing Piece**: Enable users to create list-based slides in the editor
>
> **Created**: December 16, 2025
> **Status**: SPEC - Ready for Implementation
> **Priority**: HIGH - Core feature gap

---

## Executive Summary

The Slydes demo shows a beautiful List View (Inventory Grid) that displays items in an iOS-style list format. However, **users cannot create this themselves** in the Studio editor. This spec defines how to add List View creation to the editor.

### The Gap

| Feature | Demo | Editor |
|---------|------|--------|
| Immersive frames (Hero, About, CTA) | ✅ | ✅ |
| Category navigation | ✅ | ✅ |
| List View (Inventory Grid) | ✅ | ❌ |
| Item Slyde (detail view) | ✅ | ❌ |
| Commerce (cart, checkout) | ✅ | ❌ (Phase 2) |

### Goals

1. **Enable List View creation** - Users can add items to a category and display them in a list
2. **Simple first, commerce later** - Start with display-only lists, add commerce in Phase 2
3. **Maintain immersion-first philosophy** - Lists are earned through Category Slyde, not entry points

---

## User Journey

### Current Flow (Without List View)

```
Home Slyde → Category Drawer → Category Slyde (frames) → CTA (external link)
```

### New Flow (With List View)

```
Home Slyde → Category Drawer → Category Slyde (frames) → "View All" → List View → Item Slyde
```

The List View sits between the Category Slyde and the final action. Users must experience the immersive frames BEFORE seeing the list.

---

## Data Model

### Category Updates

Add `has_inventory` flag to categories:

```typescript
interface DemoHomeSlydeCategory {
  id: string
  name: string
  description: string
  icon: string
  has_inventory?: boolean  // NEW: enables list view
}
```

### Inventory Item Structure

Simple structure for list items (no commerce initially):

```typescript
interface InventoryItem {
  id: string
  title: string           // Required: item name
  subtitle?: string       // Optional: brief description
  price?: string          // Optional: display price (e.g., "£18.50", "From £25")
  image?: string          // Optional: thumbnail URL
  badge?: string          // Optional: "Best Seller", "New", etc.
  frames?: FrameData[]    // Optional: Item Slyde frames (deep dive)
}
```

### Storage

For MVP, store in localStorage alongside existing demo data:

```typescript
interface DemoHomeSlyde {
  // ... existing fields
  inventory?: {
    [categoryId: string]: InventoryItem[]
  }
}
```

---

## Editor UI Changes

### 1. Category Settings Panel

When editing a category in the inspector, add an "Inventory" section:

```
┌─────────────────────────────────────┐
│  📋 CATEGORY SETTINGS               │
├─────────────────────────────────────┤
│                                     │
│  Name                               │
│  ┌───────────────────────────────┐  │
│  │ Styling                       │  │
│  └───────────────────────────────┘  │
│                                     │
│  Description                        │
│  ┌───────────────────────────────┐  │
│  │ Pomades, Clays & Gels         │  │
│  └───────────────────────────────┘  │
│                                     │
│  Icon                               │
│  [✨] [🚗] [🏷️] [📍] [⭐] [❤️]      │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  📦 INVENTORY                       │
│                                     │
│  Enable List View                   │
│  [━━━━━━━━━━●] ON                   │
│                                     │
│  When enabled, add a "View All"     │
│  frame to show items in a list.     │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  + Manage Items (8)           │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### 2. Inventory Manager Modal

When clicking "Manage Items", open a modal to add/edit/delete items:

```
┌─────────────────────────────────────────────────────────────┐
│  Styling Items                                          ✕   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [img] American Crew Pomade              £18.50  [⋮] │   │
│  │       Medium hold • High shine                      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ [img] American Crew Fiber               £19.00  [⋮] │   │
│  │       High hold • Matte finish                      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ [img] Baxter Clay Pomade                £24.00  [⋮] │   │
│  │       Strong hold • Matte finish                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              + Add Item                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Drag items to reorder. Click [⋮] to edit or delete.       │
│                                                             │
│                                    [ Cancel ]  [ Save ]     │
└─────────────────────────────────────────────────────────────┘
```

### 3. Item Editor (Inline or Modal)

When adding/editing an item:

```
┌─────────────────────────────────────────────────────────────┐
│  Edit Item                                              ✕   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  IMAGE                                                      │
│  ┌───────────────┐                                         │
│  │               │  Drag & drop or click to upload         │
│  │   [+ Upload]  │  JPG, PNG • Max 2MB                     │
│  │               │                                         │
│  └───────────────┘                                         │
│                                                             │
│  TITLE *                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ American Crew Pomade                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  SUBTITLE                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Medium hold • High shine                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  PRICE                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ £18.50                                              │   │
│  └─────────────────────────────────────────────────────┘   │
│  Display only. For checkout, upgrade to Pro.               │
│                                                             │
│  BADGE (optional)                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Best Seller                                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ITEM SLYDE (optional)                                      │
│  Add frames for a deep-dive experience when tapped.        │
│                                                             │
│  ☐ Enable Item Slyde                                       │
│                                                             │
│                                    [ Delete ]  [ Save ]     │
└─────────────────────────────────────────────────────────────┘
```

### 4. "View All" Frame Auto-Generation

When `has_inventory` is enabled:
- Automatically add a "View All" frame as the last frame in the Category Slyde
- This frame has `showViewAll: true` which triggers the List View transition

```typescript
// Auto-generated frame when has_inventory is enabled
const viewAllFrame: FrameData = {
  id: `${categoryId}-viewall`,
  title: `Browse All ${categoryName}`,
  subtitle: `${itemCount} items available`,
  background: { type: 'gradient', gradient: category.gradient || 'from-zinc-800 to-zinc-900' },
  showViewAll: true,
  cta: { text: 'View All', action: 'inventory' },
}
```

---

## Preview Integration

### Navigator Panel

When a category has inventory enabled, show item count:

```
┌─────────────────────────────────────┐
│  NAVIGATOR                          │
├─────────────────────────────────────┤
│                                     │
│  🏠 Home Slyde                      │
│                                     │
│  ─── Categories ───                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ✨ Styling              (8) │ ← │ ← Item count badge
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 💧 Hair Care            (4) │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ✂️ Services                 │   │ ← No inventory
│  └─────────────────────────────┘   │
│                                     │
│  [+ Add Category]                   │
│                                     │
└─────────────────────────────────────┘
```

### Device Preview

The preview should show the full flow:
1. Category Slyde frames (swipe through)
2. "View All" frame (last frame)
3. Tap "View All" → List View appears
4. Tap item → Item Slyde appears (if has frames)

---

## Implementation Plan

### Phase 1: Basic List View (MVP)

**Goal**: Users can add items to a category and display them in a list.

1. **Data Layer**
   - Add `has_inventory` to category type
   - Add `inventory` storage to DemoHomeSlyde
   - Helper functions: `getInventoryItems()`, `setInventoryItems()`, `addItem()`, `updateItem()`, `deleteItem()`

2. **Category Settings**
   - Add "Enable List View" toggle to category inspector
   - Add "Manage Items" button when enabled

3. **Inventory Manager**
   - Modal component for managing items
   - Add/edit/delete items
   - Drag-to-reorder
   - Image upload (Cloudflare Images)

4. **View All Frame**
   - Auto-generate when `has_inventory` is true
   - Update item count dynamically

5. **Preview Integration**
   - Wire up InventoryGridView to show items
   - Tap item → show alert or basic detail (no Item Slyde yet)

**Deliverables**:
- Users can toggle inventory on a category
- Users can add items (title, subtitle, price, image, badge)
- Preview shows the list view
- Items are stored in localStorage

### Phase 2: Item Slydes

**Goal**: Users can create a multi-frame deep-dive for each item.

1. **Item Slyde Editor**
   - When editing an item, option to "Add Item Slyde"
   - Frame editor (same as Category Slyde frames)
   - Navigator shows frames within item

2. **Preview Integration**
   - Tap item in list → opens ItemSlydeView
   - Back button returns to list

3. **Storage**
   - `item.frames[]` array for each item

### Phase 3: Commerce Integration

**Goal**: Users can enable commerce (add to cart, buy now) for items.

1. **Commerce Mode**
   - Per-item setting: `none`, `enquire`, `buy_now`, `add_to_cart`
   - Plan gating: Creator gets `enquire`, Pro gets full commerce

2. **Stripe Connect**
   - Connect Stripe account in settings
   - `price_cents` field for actual pricing

3. **Cart Integration**
   - FloatingCartButton
   - CartSheet
   - Checkout flow

---

## Component Structure

```
src/
├── components/
│   └── home-slyde/
│       ├── InventoryGridView.tsx      ✅ EXISTS
│       ├── ItemSlydeView.tsx          ✅ EXISTS
│       ├── InventoryManager.tsx       🆕 NEW - Modal for managing items
│       ├── InventoryItemEditor.tsx    🆕 NEW - Add/edit item form
│       └── data/
│           └── highlandMotorsData.ts  ✅ EXISTS (types)
├── app/
│   └── HomeSlydeEditorClient.tsx      📝 UPDATE - Add inventory section
└── lib/
    └── demoHomeSlyde.ts               📝 UPDATE - Add inventory storage
```

---

## API / Storage Schema

### localStorage Structure (MVP)

```typescript
// Key: 'slydes_demo_home_slyde'
interface DemoHomeSlyde {
  videoSrc: string
  posterSrc?: string
  categories: DemoHomeSlydeCategory[]
  childFrames?: { [categoryId: string]: FrameData[] }
  inventory?: { [categoryId: string]: InventoryItem[] }  // NEW
  primaryCta?: { text: string; action: string }
  showCategoryIcons?: boolean
  showHearts?: boolean
  showShare?: boolean
  showSound?: boolean
  showReviews?: boolean
}
```

### Future: Supabase Schema

```sql
-- inventory_items table
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  price TEXT,
  price_cents INTEGER,
  image_url TEXT,
  badge TEXT,
  commerce_mode TEXT DEFAULT 'none',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- inventory_item_frames table (for Item Slydes)
CREATE TABLE inventory_item_frames (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  frame_data JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## UI/UX Guidelines

### Consistency with Existing Editor

- Use same panel structure (Navigator | Preview | Inspector)
- Same input styling, toggles, collapsible sections
- Same drag-and-drop patterns (GripVertical icon)
- Same modal patterns (rounded-3xl, gradient accent, backdrop blur)

### Mobile Considerations

- Inventory Manager modal should be touch-friendly
- Image upload should support camera on mobile
- List items should have 44pt minimum touch targets

### Empty States

**No items yet:**
```
┌─────────────────────────────────────┐
│                                     │
│         📦                          │
│                                     │
│   No items yet                      │
│                                     │
│   Add your first item to create     │
│   a browseable list for customers.  │
│                                     │
│   [+ Add First Item]                │
│                                     │
└─────────────────────────────────────┘
```

---

## Success Criteria

### Phase 1 Complete When:

- [ ] User can toggle "Enable List View" on a category
- [ ] User can add items with title, subtitle, price, image, badge
- [ ] User can edit and delete items
- [ ] User can reorder items via drag-and-drop
- [ ] Preview shows List View after "View All" frame
- [ ] Items persist in localStorage
- [ ] Item count shows in navigator

### Phase 2 Complete When:

- [ ] User can add frames to an item (Item Slyde)
- [ ] Preview shows Item Slyde when tapping an item
- [ ] Back navigation works correctly

### Phase 3 Complete When:

- [ ] User can set commerce mode per item
- [ ] Cart integration works in preview
- [ ] Stripe Connect integration for Pro users

---

## Open Questions

1. **Image hosting**: Use Cloudflare Images for item thumbnails? Or allow URL input for MVP?
2. **Item limits**: Should Free tier have item limits? (e.g., 5 items max)
3. **Import/export**: Should we support CSV import for bulk item creation?
4. **Variants**: Do we need product variants (size, color) or keep it simple?

---

## References

- [UI-PATTERNS.md](./UI-PATTERNS.md) - Master spec for Slydes behavior
- [CATEGORY-INVENTORY-FLOW.md](./CATEGORY-INVENTORY-FLOW.md) - Data architecture
- [EDITOR-DESIGN-SPEC.md](./EDITOR-DESIGN-SPEC.md) - Editor design patterns
- [InventoryGridView.tsx](../apps/studio/src/components/home-slyde/InventoryGridView.tsx) - Existing component
- [ItemSlydeView.tsx](../apps/studio/src/components/home-slyde/ItemSlydeView.tsx) - Existing component

---

*Document Status: SPEC*
*Last Updated: December 16, 2025*
*Ready for implementation review*
