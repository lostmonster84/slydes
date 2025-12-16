# Starter Templates Spec

> When a user selects their business type during onboarding, pre-populate their dashboard with a starter Home Slyde that matches their industry.

**Status:** Planned
**Priority:** High - delivers on "We'll customize your experience" promise

---

## The Problem

Currently:
- User picks business type (e.g. "Accommodation") during onboarding
- We say "We'll customize your experience based on this"
- User lands in dashboard with... an empty editor
- They have to figure out the structure themselves

---

## The Solution

User picks "Accommodation" → lands in dashboard with:
- A pre-built "Your Accommodation" slyde
- Categories: Rooms, Amenities, Location
- 2-3 placeholder frames per category
- Ready to customize immediately

---

## Templates by Business Type

| Type | Home Slyde Title | Categories |
|------|------------------|------------|
| `rentals` | Your Rentals | Equipment, Vehicles, Accessories |
| `tours` | Your Experiences | Tours, Activities, Packages |
| `accommodation` | Your Accommodation | Rooms, Amenities, Location |
| `restaurant` | Your Menu | Starters, Mains, Desserts |
| `retail` | Your Products | Featured, New In, Best Sellers |
| `fitness` | Your Services | Classes, Memberships, Trainers |
| `salon` | Your Services | Hair, Beauty, Treatments |
| `events` | Your Venue | Spaces, Packages, Gallery |
| `real_estate` | Your Properties | For Sale, To Rent, Featured |
| `automotive` | Your Showroom | New, Used, Services |
| `other` | Your Business | Products, Services, About |

---

## Template Structure

Each template contains:

```
Home Slyde
├── title: "Your Accommodation"
├── subtitle: "Edit this to describe your property"
├── background: gradient or placeholder image
└── categories:
    ├── Rooms (icon: 🛏️)
    │   ├── Frame: "Deluxe Room" - "Starting from £XX/night"
    │   └── Frame: "Standard Room" - "Starting from £XX/night"
    ├── Amenities (icon: ✨)
    │   ├── Frame: "Swimming Pool"
    │   └── Frame: "Restaurant"
    └── Location (icon: 📍)
        ├── Frame: "Getting Here"
        └── Frame: "Local Attractions"
```

---

## Implementation Approach

**Option A: Static JSON Templates (Recommended for MVP)**
- Templates stored in `lib/starterTemplates.ts`
- On onboarding completion, copy template to localStorage
- Easy to update, no DB changes needed

**Option B: Database Seeding (Future)**
- Templates in Supabase
- Allows A/B testing different templates
- More complex to maintain

---

## UX Flow

```
Onboarding Step 3
"What type of business?"
         ↓
User selects "Accommodation"
         ↓
Click "Complete Setup"
         ↓
System loads accommodation template
         ↓
Redirect to Dashboard
         ↓
User sees pre-built slyde
ready to customize
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `studio/src/lib/starterTemplates.ts` | CREATE - All 11 templates |
| `studio/src/app/onboarding/page.tsx` | MODIFY - Apply template on submit |
| `studio/src/lib/demoHomeSlyde.ts` | MODIFY - Load from template |

---

## Open Questions

1. **Placeholder images** - Gradients, patterns, or stock photos?
2. **Helper text** - "Replace this with your photo" prompts?
3. **Start fresh** - Option to clear template and start blank?

---

## Success Criteria

- [ ] All 11 business types have templates
- [ ] Template loads immediately after onboarding
- [ ] User can edit/delete any part of the template
- [ ] Templates feel professional, not generic
