# Homepage Redesign Plan
### Property & Hospitality Focus

---

## Strategic Context

Slydes is repositioning for launch to focus on **property & hospitality** - the cluster of niches where:
- Visual/video decisions dominate
- Mobile browsing is standard
- Booking or enquiry is the goal
- PDF brochures and clunky sites are the enemy

This includes:
- Estate agents / property sales
- Holiday lets / vacation rentals
- Lodges / hotels / hospitality
- Short-term rentals
- Resorts / glamping
- Luxury property

**Not included at launch:** Restaurants, Fitness, Automotive, Adventure (these come later)

---

## Current Homepage Structure

```
1. Header
2. Hero (headline, subheads, CTA, phone mockup)
3. IndustrySelector (tabs: Restaurant, Vacation Rentals, Fitness, Car Hire, Adventure)
4. DashboardPreview
5. ShopPreview
6. MomentumAI
7. Features
8. AnalyticsPreview
9. SocialProof
10. WaitlistSignup
11. Footer
```

---

## Components Requiring Changes

### 1. Hero.tsx

**Current:**
```
Headline: "Stop sending mobile users to websites. Send them to Slydes."
Subheads: Generic mobile-first messaging (rotating)
CTA: "Create your first Slyde"
Closer: "Got a mobile-first business? We should talk."
```

**Proposed:**
```
Headline: "Sell property the way people actually browse."
         OR "Your property deserves better than PDF."
         OR "Property presentations, perfected for mobile."

Subheads (rotating - property/hospitality focused):
- "Guests decide in seconds. Slydes wins those seconds."
- "Buyers browse on phones. Your listings should too."
- "PDF brochures are dead. Video walkthroughs convert."
- "Holiday lets thrive on atmosphere. Show it, don't describe it."
- "Your property looks stunning. Your website doesn't."

CTA: "Create your first property Slyde"
     OR "See a property demo"

Closer: "Selling or renting property? We should talk."
```

**File:** `apps/marketing/src/components/sections/Hero.tsx`

---

### 2. IndustrySelector.tsx

**Current:**
```
Heading: "Built for mobile-first businesses"
Subhead: "Slydes works best where decisions are visual, time-sensitive, and made on phones."
Tabs: Restaurant, Vacation Rentals, Fitness, Car Hire, Adventure
```

**Proposed:**
```
Heading: "Built for property & hospitality."
Subhead: "Slydes works best where guests and buyers decide visually, quickly, and on their phones."

Tabs (property/hospitality sub-types):
1. Estate Agents
2. Holiday Lets
3. Hotels & Lodges
4. Luxury Rentals
5. (Optional) New Developments
```

**New industry data:**

```typescript
const industries = [
  {
    id: 'estate-agents',
    label: 'Estate Agents',
    title: 'Prestige Properties',
    variant: 'property' as const, // may need new variant
    description: 'Listings that sell themselves. Video walkthroughs, drone footage, and instant viewing requests. Replace PDF brochures with one link that converts.',
    features: ['Video property tours', 'Instant viewing requests', 'Replace PDF brochures'],
  },
  {
    id: 'holiday-lets',
    label: 'Holiday Lets',
    title: 'Villa Serenità',
    variant: 'rentals' as const,
    description: 'Let guests experience your property before they book. Immersive video tours, real reviews, and seamless reservations. All in one stunning mobile experience.',
    features: ['Virtual property tours', 'Direct booking integration', 'Guest reviews & ratings'],
  },
  {
    id: 'hotels-lodges',
    label: 'Hotels & Lodges',
    title: 'Highland Retreat',
    variant: 'hospitality' as const, // may need new variant
    description: 'Atmosphere sells. Show the roaring fire, the mountain views, the experience. Not just rooms - the feeling of being there.',
    features: ['Atmosphere-first video', 'Room showcases', 'Direct booking'],
  },
  {
    id: 'luxury-rentals',
    label: 'Luxury Rentals',
    title: 'Château Lumière',
    variant: 'luxury' as const, // may need new variant
    description: 'Premium properties deserve premium presentation. Cinematic video tours that match the quality of your listing.',
    features: ['Cinematic video tours', 'Concierge contact', 'Premium presentation'],
  },
]
```

**File:** `apps/marketing/src/components/sections/IndustrySelector.tsx`

---

### 3. PhoneMockup.tsx (if needed)

May need new variants for:
- `property` (estate agent listing)
- `luxury` (high-end rental)

Or repurpose existing variants with new content.

**File:** `apps/marketing/src/components/ui/PhoneMockup.tsx`

---

## Copy Changes Summary

### Headlines

| Location | Current | Proposed |
|----------|---------|----------|
| Hero H1 | "Stop sending mobile users to websites. Send them to Slydes." | "Sell property the way people actually browse." |
| IndustrySelector H2 | "Built for mobile-first businesses." | "Built for property & hospitality." |

### Subheads

| Location | Current | Proposed |
|----------|---------|----------|
| Hero rotating | Generic mobile-first | Property/hospitality specific |
| IndustrySelector | "decisions are visual, time-sensitive, and made on phones" | "guests and buyers decide visually, quickly, and on their phones" |

### CTAs

| Location | Current | Proposed |
|----------|---------|----------|
| Hero primary | "Create your first Slyde" | "Create your first property Slyde" |
| Hero secondary | "view demo" | "See a property demo" |
| Hero closer | "Got a mobile-first business?" | "Selling or renting property?" |

---

## Tabs Mapping

| Current Tab | Action | New Tab |
|-------------|--------|---------|
| Restaurant | REMOVE | - |
| Vacation Rentals | KEEP/RENAME | Holiday Lets |
| Fitness | REMOVE | - |
| Car Hire | REMOVE | - |
| Adventure | REMOVE | - |
| - | ADD | Estate Agents |
| - | ADD | Hotels & Lodges |
| - | ADD | Luxury Rentals |

---

## Visual/Demo Requirements

Before these changes go live, we need:

1. **Property demo Slyde** - A real, impressive property walkthrough
2. **Phone mockup content** - Screenshots/videos for each new tab variant
3. **Consistent quality** - Each tab must have compelling visual content

---

## Implementation Order

1. **Copy changes first** (Hero.tsx, IndustrySelector.tsx) - can be done immediately
2. **Tab restructure** - Update industry data in IndustrySelector.tsx
3. **Phone mockup variants** - Add/update as needed
4. **Demo content** - Create actual property Slydes to showcase

---

## Risk Mitigation

- Keep current homepage as backup (this document serves as the plan)
- Test on staging before production
- Validate messaging with 2-3 property/hospitality contacts before wide launch

---

## Success Criteria

After these changes:
- A property professional lands on the homepage and immediately thinks "this is for me"
- No confusion about what Slydes is for
- Clear path to action (create Slyde or view demo)
- No generic "mobile-first businesses" language remaining

---

## Files to Modify

| File | Changes |
|------|---------|
| `apps/marketing/src/components/sections/Hero.tsx` | Headline, subheads, CTAs, closer |
| `apps/marketing/src/components/sections/IndustrySelector.tsx` | Heading, subhead, tabs, industry data |
| `apps/marketing/src/components/ui/PhoneMockup.tsx` | New variants (if needed) |

---

*Created: December 2025*
*Purpose: Homepage redesign plan for property/hospitality launch focus*
*Related: TARGET-NICHES.md, LAUNCH-PLAN.md, LAUNCH-MESSAGING.md*
