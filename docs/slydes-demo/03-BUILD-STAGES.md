# Slydes Demo: Build Stages

> **Stage 0 Documentation**
> Step-by-step implementation plan with clear deliverables per stage.
> **Updated**: December 14, 2025 (Canonical Frame terminology per STRUCTURE.md)

---

## Overview

This document breaks down the productization into discrete stages. Each stage is independently testable and shippable.

**Total estimated stages**: 7 (plus optional Stage 8 for admin UI)

**Terminology**: See `STRUCTURE.md` for canonical hierarchy (Home Slyde → Child Slyde → Frame; HQ label = Profile).

---

## Stage 0: Documentation & Contracts ✅

**Status**: Complete

**Deliverables**:
- [x] System map (`00-SYSTEM-MAP.md`)
- [x] API interface contract (`02-API-INTERFACE.md`)
- [x] Build stages document (`03-BUILD-STAGES.md`)
- [x] Structure definition (`STRUCTURE.md`)

**Acceptance**:
- All modules documented
- All data types defined
- Clear implementation path
- Canonical terminology established

---

## Stage 1: Supabase Schema

**Status**: Pending

**Goal**: Create and deploy Supabase tables for Slydes data.

**Tasks**:
1. Create `businesses` table
2. Create `slydes` table (with FK to businesses)
3. Create `frames` table (with FK to slydes)
4. Create `faqs` table (with FK to slydes)
5. Create `reviews` table (with FK to businesses)
6. Create `questions` table (with FK to slydes/businesses)
7. Create RLS policies
8. Create helper functions (`increment_heart`, `decrement_heart`)

**SQL Schema**:
```sql
-- businesses
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  location TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  credentials JSONB DEFAULT '[]',
  about TEXT,
  highlights TEXT[],
  contact JSONB DEFAULT '{}',
  logo_url TEXT,
  accent_color TEXT DEFAULT 'bg-red-600',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- slydes
CREATE TABLE slydes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  accent_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, slug)
);

-- frames
CREATE TABLE frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slyde_id UUID REFERENCES slydes(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL,
  template_type TEXT, -- 'hook', 'how', 'what', 'trust', 'proof', 'action', 'slydes'
  title TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT,
  rating DECIMAL(2,1),
  review_count INTEGER,
  heart_count INTEGER DEFAULT 0,
  faq_count INTEGER DEFAULT 0,
  cta JSONB, -- { text, icon, action }
  background JSONB NOT NULL, -- { type, src, position?, startTime? }
  accent_color TEXT,
  info_content JSONB, -- { headline, description?, items?, highlights? }
  is_promo_frame BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- faqs
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slyde_id UUID REFERENCES slydes(id) ON DELETE CASCADE,
  frame_id UUID REFERENCES frames(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  "order" INTEGER DEFAULT 0,
  is_global BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_location TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  date DATE NOT NULL,
  source TEXT DEFAULT 'manual', -- 'google', 'tripadvisor', 'facebook', 'manual', 'imported'
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- questions (user submissions)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  slyde_id UUID REFERENCES slydes(id) ON DELETE SET NULL,
  frame_id UUID REFERENCES frames(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'answered', 'dismissed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Acceptance**:
- [ ] All tables created
- [ ] RLS policies in place
- [ ] Can create test documents manually
- [ ] Foreign keys work correctly

---

## Stage 2: Seed Script

**Status**: Pending

**Goal**: Migrate `frameData.ts` content into Supabase.

**Tasks**:
1. Create `scripts/seed-slydes-demo.ts`
2. Transform `wildtraxBusiness` → `businesses` row
3. Create `slydes` rows for Camping and Just Drive
4. Transform `campingFrames` → `frames` rows
5. Transform `justDriveFrames` → `frames` rows
6. Transform `campingFAQs` → `faqs` rows
7. Transform `justDriveFAQs` → `faqs` rows
8. Transform `wildtraxReviews` → `reviews` rows
9. Add dry-run mode
10. Add execute mode

**Script usage**:
```bash
# Preview what will be created
npx tsx scripts/seed-slydes-demo.ts --dry-run

# Execute migration
npx tsx scripts/seed-slydes-demo.ts --execute
```

**Files to create**:
```
scripts/
└── seed-slydes-demo.ts
```

**Acceptance**:
- [ ] Dry-run shows correct row count
- [ ] Execute creates all rows
- [ ] Foreign keys reference correctly
- [ ] Data matches `frameData.ts` content
- [ ] Can query via Supabase client

---

## Stage 3: API Layer

**Status**: Pending

**Goal**: Create `SlydesAPI` interface and Supabase adapter.

**Tasks**:
1. Create `src/lib/slydes/types.ts` (types from `02-API-INTERFACE.md`)
2. Create `src/lib/slydes/supabase-adapter.ts`
3. Create `src/lib/slydes/static-adapter.ts` (for testing)
4. Create `src/lib/slydes/index.ts` (barrel exports)
5. Create `src/contexts/SlydesContext.tsx`
6. Create API routes:
   - `src/app/api/slydes/heart/route.ts`
   - `src/app/api/slydes/question/route.ts`

**Files to create**:
```
src/lib/slydes/
├── types.ts
├── supabase-adapter.ts
├── static-adapter.ts
└── index.ts

src/contexts/
└── SlydesContext.tsx

src/app/api/slydes/
├── heart/
│   └── route.ts
└── question/
    └── route.ts
```

**Acceptance**:
- [ ] Types compile without errors
- [ ] Supabase adapter fetches data correctly
- [ ] Static adapter works as fallback
- [ ] Context provider renders without errors
- [ ] API routes respond correctly
- [ ] Can test with `curl` or Postman

---

## Stage 4: Wire SlydeScreen

**Status**: Pending

**Goal**: Connect `SlydeScreen` to `SlydesAPI` instead of static imports.

**Tasks**:
1. Wrap `/demo-slyde` page with `SlydesProvider`
2. Create `useSlydes` hook for data fetching
3. Update `SlydeScreen` to accept data from hook
4. Remove direct imports from `frameData.ts`
5. Implement loading state
6. Implement error state
7. Test with both Supabase and static adapters

**Files to modify**:
```
src/app/demo-slyde/page.tsx
src/components/slyde-demo/SlydeScreen.tsx
```

**Files to create**:
```
src/hooks/useSlydes.ts
```

**Acceptance**:
- [ ] Demo loads data from Supabase
- [ ] Frames render correctly
- [ ] FAQs render correctly
- [ ] Business info renders correctly
- [ ] No imports from `frameData.ts` in demo components
- [ ] Loading state shows while fetching
- [ ] Error state shows on failure

---

## Stage 5: Hearts Persistence

**Status**: Pending

**Goal**: Persist heart counts to Supabase.

**Tasks**:
1. Update `SocialActionStack` to use API
2. Implement optimistic UI update
3. Call `POST /api/slydes/heart` on tap
4. Update local state with response
5. Handle errors gracefully
6. Track analytics event

**Files to modify**:
```
src/components/slyde-demo/SlydeScreen.tsx
src/components/slyde-demo/SocialActionStack.tsx
```

**Acceptance**:
- [ ] Tap heart → count increments
- [ ] Refresh page → count persists
- [ ] Check Supabase → `heart_count` field updated
- [ ] UI feels instant (optimistic update)
- [ ] Analytics event logged

---

## Stage 6: FAQ & Question Submission

**Status**: Pending

**Goal**: Fetch FAQs from Supabase, persist question submissions.

**Tasks**:
1. Update `FAQSheet` to use API for FAQs
2. Implement search via `searchFAQs()`
3. Update "Ask Question" to call API
4. Create `questions` row on submit
5. Show success state
6. Track analytics events

**Files to modify**:
```
src/components/slyde-demo/FAQSheet.tsx
src/components/slyde-demo/SlydeScreen.tsx
```

**Acceptance**:
- [ ] FAQs load from Supabase
- [ ] Search works across all FAQs
- [ ] Submit question → row created in Supabase
- [ ] Success message shows
- [ ] Question visible in admin (future)
- [ ] Analytics events logged

---

## Stage 7: Reviews & Canonical Share URLs

**Status**: Pending

**Goal**: Fetch reviews from Supabase, implement canonical share URLs.

**Tasks**:
1. Update `RatingDisplay` to use API data
2. Update `InfoSheet` review highlights to use API
3. Implement canonical URL builder
4. Update `ShareSheet` to use canonical URLs
5. Add `?f=` deep-link handling
6. Track share analytics

**Canonical URL format**:
```
/{businessSlug}/{slydeSlug}?f={frameIndex}
```

**Files to modify**:
```
src/components/slyde-demo/ShareSheet.tsx
src/components/slyde-demo/SlydeScreen.tsx
src/app/demo-slyde/page.tsx (or mobile routes)
```

**Acceptance**:
- [ ] Reviews load from Supabase
- [ ] Featured reviews display correctly
- [ ] Share URLs are canonical format
- [ ] Deep-link `?f=5` jumps to correct Frame
- [ ] Share to WhatsApp shows correct URL
- [ ] Analytics events logged

---

## Stage 8: Admin UI (Optional/Stretch)

**Status**: Pending

**Goal**: Create admin pages for managing Slydes content.

**Tasks**:
1. Create `/admin/slydes` landing page
2. Create `/admin/slydes/frames` list + editor
3. Create `/admin/slydes/faqs` list + editor
4. Create `/admin/slydes/reviews` list + editor
5. Create `/admin/slydes/questions` inbox
6. Add navigation to admin sidebar

**Files to create**:
```
src/app/admin/slydes/
├── page.tsx
├── frames/
│   └── page.tsx
├── faqs/
│   └── page.tsx
├── reviews/
│   └── page.tsx
└── questions/
    └── page.tsx
```

**Acceptance**:
- [ ] Can view all Frames
- [ ] Can edit Frame content
- [ ] Can add/edit FAQs
- [ ] Can add/edit reviews
- [ ] Can view question inbox
- [ ] Changes reflect in demo immediately

---

## Progress Tracker

| Stage | Name | Status | Deliverables |
|-------|------|--------|--------------|
| 0 | Documentation | ✅ Complete | Docs + STRUCTURE.md |
| 1 | Supabase Schema | ⬜ Pending | 6 tables |
| 2 | Seed Script | ⬜ Pending | 1 script file |
| 3 | API Layer | ⬜ Pending | Types, adapters, context, routes |
| 4 | Wire SlydeScreen | ⬜ Pending | Hook, component updates |
| 5 | Hearts Persistence | ⬜ Pending | API integration |
| 6 | FAQ & Questions | ⬜ Pending | API integration |
| 7 | Reviews & Share URLs | ⬜ Pending | API + URL handling |
| 8 | Admin UI | ⬜ Optional | Admin pages |

---

## Definition of Done (Full Project)

When all stages are complete:

- [ ] Demo loads all content from Supabase
- [ ] No imports from `frameData.ts` in production code
- [ ] Hearts persist across page refreshes
- [ ] Questions create Supabase rows
- [ ] Share URLs are canonical and deep-linkable
- [ ] Analytics events fire for all interactions
- [ ] `SlydesAPI` interface is portable (can swap adapters)
- [ ] Documentation is complete and accurate
- [ ] All terminology follows STRUCTURE.md

---

## Terminology Migration Checklist

Before Stage 4, rename these in code:

| Old | New |
|-----|-----|
| `SlideData` | `FrameData` |
| `slides` | `frames` |
| `slideData.ts` | `frameData.ts` |
| `currentSlide` | `currentFrame` |
| `slideIndicator` | `frameIndicator` |
| `PhoneFrame` | `DevicePreview` |
| `WorldConfig` | *(delete)* |
| `worlds` | *(delete — Camping/Just Drive are separate Slydes)* |

---

## Commands Reference

```bash
# Stage 1: Schema (run in Supabase SQL editor)
# See SQL above

# Stage 2: Seed
npx tsx scripts/seed-slydes-demo.ts --dry-run
npx tsx scripts/seed-slydes-demo.ts --execute

# Development
npm run dev

# Testing API routes
curl -X POST http://localhost:3000/api/slydes/heart \
  -H "Content-Type: application/json" \
  -d '{"frameId": "abc123", "action": "increment"}'

curl -X POST http://localhost:3000/api/slydes/question \
  -H "Content-Type: application/json" \
  -d '{"question": "Test question", "businessId": "wildtrax"}'
```

---

*Created: Stage 0 of Slydes Demo Productization*
*Last Updated: December 14, 2025 (Canonical Frame terminology)*
