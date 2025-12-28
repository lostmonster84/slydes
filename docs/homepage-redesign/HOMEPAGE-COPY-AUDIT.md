# Homepage Copy Audit
### Section-by-section analysis for property/hospitality repositioning

---

## Overview

This document audits every piece of copy on the homepage and identifies what needs to change for the property/hospitality launch focus.

**Legend:**
- KEEP = No change needed
- CHANGE = Needs property/hospitality focus
- REVIEW = May need adjustment depending on context

---

## 1. Hero.tsx

### Current Copy

| Element | Current Text | Action |
|---------|-------------|--------|
| Badge | "Early access open" | KEEP |
| Headline | "Stop sending mobile users to websites. Send them to Slydes." | CHANGE |
| Subhead 1 | "Phones are for swiping, not scrolling. Slydes turns attention into action." | REVIEW |
| Subhead 2 | "Your customers decide in seconds. Slydes wins those seconds." | REVIEW |
| Subhead 3 | "Mobile traffic deserves better than desktop pages. Slydes delivers." | REVIEW |
| Subhead 4 | "Scrolling kills momentum. Swiping builds it." | REVIEW |
| Subhead 5 | "Your website explains. Slydes converts." | REVIEW |
| Subhead 6 | "Mobile-first isn't a breakpoint. It's a format change." | REVIEW |
| CTA | "Create your first Slyde" | CHANGE |
| CTA support | "No credit card. Live in minutes." | KEEP |
| Secondary link | "or view demo" | CHANGE |
| Closer | "Got a mobile-first business? We should talk." | CHANGE |

### Proposed Copy

| Element | Proposed Text |
|---------|--------------|
| Badge | "Early access open" (keep) |
| Headline | **"Sell property the way people actually browse."** |
| Subhead 1 | "Buyers browse on phones. Your listings should too." |
| Subhead 2 | "Guests decide in seconds. Slydes wins those seconds." |
| Subhead 3 | "PDF brochures are dead. Video walkthroughs convert." |
| Subhead 4 | "Your property looks stunning. Your website doesn't." |
| Subhead 5 | "One link. Full-screen tours. Instant enquiries." |
| Subhead 6 | "Holiday lets thrive on atmosphere. Show it, don't describe it." |
| CTA | **"Create your first property Slyde"** |
| CTA support | "No credit card. Live in minutes." (keep) |
| Secondary link | **"or see a property demo"** |
| Closer | **"Selling or letting property? We should talk."** |

### Phone Mockup
- Current: `variant="rentals"` (Villa Serenità)
- Proposed: KEEP (rentals is property/hospitality relevant) or create new property variant

---

## 2. IndustrySelector.tsx

### Current Copy

| Element | Current Text | Action |
|---------|-------------|--------|
| Badge | "Demo Examples" | KEEP |
| Headline | "Built for mobile-first businesses." | CHANGE |
| Subhead | "Slydes works best where decisions are visual, time-sensitive, and made on phones. If mobile traffic matters, this format works." | CHANGE |

### Current Tabs

| Tab | Title | Description | Action |
|-----|-------|-------------|--------|
| Restaurant | "Maison Lumière" | Menu previews, reservations | REMOVE |
| Vacation Rentals | "Villa Serenità" | Property tours, booking | KEEP/RENAME |
| Fitness | "FORM Studio" | Class previews, memberships | REMOVE |
| Car Hire | "Apex Motors" | Vehicle showcases | REMOVE |
| Adventure | "WildTrax 4x4" | Real Slydes project | REMOVE (for now) |

### Proposed Copy

| Element | Proposed Text |
|---------|--------------|
| Badge | "Demo Examples" (keep) |
| Headline | **"Built for property & hospitality."** |
| Subhead | **"Slydes works best where guests and buyers decide visually, quickly, and on their phones. If you're selling or letting spaces, this format works."** |

### Proposed Tabs

| Tab | Title | Description | Features |
|-----|-------|-------------|----------|
| **Estate Agents** | "Prestige Properties" | "Listings that sell themselves. Video walkthroughs, drone footage, and instant viewing requests. Replace PDF brochures with one link that converts." | Video property tours, Instant viewing requests, Replace PDF brochures |
| **Holiday Lets** | "Villa Serenità" | "Let guests experience your property before they book. Immersive video tours, real reviews, and seamless reservations." | Virtual property tours, Direct booking, Guest reviews |
| **Hotels & Lodges** | "Highland Retreat" | "Atmosphere sells. Show the roaring fire, the mountain views, the experience. Not just rooms - the feeling of being there." | Atmosphere-first video, Room showcases, Direct booking |
| **Luxury Rentals** | "Château Lumière" | "Premium properties deserve premium presentation. Cinematic video tours that match the quality of your listing." | Cinematic video tours, Concierge contact, Premium presentation |

---

## 3. DashboardPreview.tsx

### Current Copy

| Element | Current Text | Action |
|---------|-------------|--------|
| Badge | "Slydes Studio" | KEEP |
| Headline | "See exactly what they'll see" | KEEP |
| Subhead | "Build on desktop, preview on phone. What you see is what they get. No guesswork. No surprises." | KEEP |
| Example business | "Bloom Studio" (Florist) | CHANGE |
| Frame names | "Hero Video, About Us, Menu Highlights, Reviews, Find Us, Book Now" | CHANGE |

### Proposed Copy

| Element | Proposed Text |
|---------|--------------|
| Badge | "Slydes Studio" (keep) |
| Headline | "See exactly what they'll see" (keep) |
| Subhead | (keep) |
| Example business | **"Highland Lodge"** or **"Prestige Homes"** |
| Frame names | **"Hero Video, Property Tour, Amenities, Reviews, Location, Book Viewing"** (or "Enquire Now") |

---

## 4. ShopPreview.tsx

### Current Copy

| Element | Current Text | Action |
|---------|-------------|--------|
| Badge | "Commerce" | KEEP |
| Headline | "Sell directly from your Slyde" | KEEP |
| Subhead | "Turn your Slyde into a storefront. Add products to any frame, let customers add to cart, and check out with Stripe." | REVIEW |
| Example products | Hair products (Shampoo, Mask, Serum) | REVIEW |

### Assessment

This section is about commerce/shop functionality. Property/hospitality doesn't typically sell products - they sell bookings/viewings.

**Options:**
1. KEEP as-is (shows platform capability, not core to property pitch)
2. CHANGE example to property-adjacent (e.g., gift shop at a lodge)
3. REMOVE section entirely for property-focused launch
4. REPLACE with "Booking Integration" section

**Recommendation:** KEEP for now - shows platform versatility. Low priority change.

---

## 5. MomentumAI.tsx

### Current Copy

| Element | Current Text | Action |
|---------|-------------|--------|
| Badge | "AI-Powered" | KEEP |
| Headline | "Meet Momentum" | KEEP |
| Subhead | "Your AI business partner that actually understands your Slyde." | KEEP |
| Example insight | "Your completion rate dropped 12% this week. Frame 3 might be the issue." | KEEP |
| Example copy suggestion | "Your CTA could be stronger. Try: 'Book your spot' instead of 'Learn more'." | CHANGE |
| Example growth tip | "Based on your traffic sources, double down on Instagram bio links." | KEEP |

### Proposed Copy

| Element | Proposed Text |
|---------|--------------|
| Example copy suggestion | **"Your CTA could be stronger. Try: 'Book a viewing' instead of 'Learn more'."** |

**Assessment:** Low priority - one small copy change. The AI feature is universal.

---

## 6. Features.tsx

### Current Copy

| Element | Current Text | Action |
|---------|-------------|--------|
| Headline | "Websites are broken on mobile." | KEEP |
| Subhead | "Mobile behaviour has changed. The web hasn't. People swipe, glance, and decide. Pages make them scroll, search, and leave." | KEEP |
| Card 1 title | "Phones aren't desktops." | KEEP |
| Card 1 text | "Swipe-first flows. Thumb-led navigation. Full-screen content. Designed for momentum, not menus." | KEEP |
| Card 1 example | Chef's Table / Omakase restaurant | CHANGE |
| Card 2 title | "Build it exactly as they'll see it" | KEEP |
| Card 2 text | "Create on mobile, preview instantly, publish when it feels right. No code. No guesswork." | KEEP |
| Card 3 title | "Publish is one tap. Sharing is the point." | KEEP |
| Card 3 text | "Get a link instantly. Drop it in your bio, QR, ads, or messages and track what happens." | KEEP |

### Proposed Copy

| Element | Proposed Text |
|---------|--------------|
| Card 1 example | **Replace sushi emoji/Chef's Table with property example** (e.g., luxury bedroom, property exterior) |

**Assessment:** Core messaging is universal and strong. Only the visual example in Card 1 needs to change from restaurant to property.

---

## 7. AnalyticsPreview.tsx

### Current Copy

| Element | Current Text | Action |
|---------|-------------|--------|
| Badge | "Analytics" | KEEP |
| Headline | "Know exactly where they drop off" | KEEP |
| Subhead | "See which frames keep attention and which lose it. Track every swipe, every tap, every conversion. Fix the leaks, double down on what works." | KEEP |
| Frame names in mockup | "Hero, Fleet, Pricing, Reviews, Book Now" | CHANGE |

### Proposed Copy

| Element | Proposed Text |
|---------|--------------|
| Frame names in mockup | **"Hero, Property Tour, Amenities, Reviews, Book Viewing"** |

**Assessment:** Core messaging is universal. Only the example frame names need property context.

---

## 8. SocialProof.tsx

### Current Copy

| Element | Current Text | Action |
|---------|-------------|--------|
| Stats | "<5 min from idea to live", "68% average completion rate", "Frame-level drop-off analytics" | KEEP |
| Case study label | "Case Study" | KEEP |
| Case study headline | "From mobile clicks to booked cars." | CHANGE |
| Case study text | "WildTrax replaced traditional mobile pages with Slydes and turned browsing into decisions. Less friction. More bookings." | CHANGE |
| Bullet 1 | "Full-screen video vehicle tours" | CHANGE |
| Bullet 2 | "One-tap booking and inquiries" | KEEP |
| Bullet 3 | "Built and live same day" | KEEP |
| Quote | "Our customers love the TikTok-style browsing. Way better than our old mobile site." | KEEP |
| Quote attribution | "WildTrax 4x4 • Highland vehicle rental company" | CHANGE |
| Phone mockup | `variant="wildtrax"` | CHANGE |

### Proposed Copy

**Option A: Create property case study (ideal)**
| Element | Proposed Text |
|---------|--------------|
| Case study headline | **"From PDF brochures to booked viewings."** |
| Case study text | **"[Property Company] replaced static listings with Slydes and turned browsers into buyers. Video tours. Instant enquiries. More viewings."** |
| Bullet 1 | **"Full-screen video property tours"** |
| Quote | **"Buyers engage way more with video walkthroughs. Our viewing requests doubled."** |
| Quote attribution | **"[Estate Agent] • Property sales"** |

**Option B: Adapt WildTrax (temporary)**

Keep WildTrax but position as "experience-led hospitality" since they rent accommodation too.

**Recommendation:** Need a real property case study. This is high-priority content that requires actual customer.

---

## 9. WaitlistSignup.tsx

### Current Copy

| Element | Current Text | Action |
|---------|-------------|--------|
| Headline | "Stop losing mobile attention." | REVIEW |
| Subhead | "Create a Slyde and see how fast momentum changes everything." | REVIEW |
| Industry dropdown options | Restaurant/Hospitality, Real Estate, Automotive, Salon, Fitness, Travel, Retail, Professional Services, Creative, Other | CHANGE |
| CTA button | "Create your first Slyde" | CHANGE |
| Trust note | "Live in minutes. No credit card required." | KEEP |

### Proposed Copy

| Element | Proposed Text |
|---------|--------------|
| Headline | **"Stop losing buyers to bad mobile pages."** or **"Your property deserves better than PDF."** |
| Subhead | **"Create a Slyde and see how fast your listings convert."** |
| Industry dropdown | **Reorder to lead with property/hospitality:** Estate Agent, Holiday Let, Hotel/Lodge, Property Developer, Luxury Rentals, Other |
| CTA button | **"Create your first property Slyde"** |

---

## Summary: Priority Changes

### HIGH PRIORITY (Must change for launch)

| Section | Change |
|---------|--------|
| **Hero.tsx** | Headline, subheads, CTA, closer - all to property/hospitality |
| **IndustrySelector.tsx** | Headline, subhead, replace all tabs with property sub-types |
| **SocialProof.tsx** | Case study needs to be property-focused (or clearly property-adjacent) |
| **WaitlistSignup.tsx** | Headline, subhead, industry dropdown order, CTA |

### MEDIUM PRIORITY (Should change)

| Section | Change |
|---------|--------|
| **DashboardPreview.tsx** | Change example business from florist to property, update frame names |
| **AnalyticsPreview.tsx** | Update frame names in mockup to property context |
| **Features.tsx** | Change Card 1 visual example from restaurant to property |

### LOW PRIORITY (Nice to have)

| Section | Change |
|---------|--------|
| **MomentumAI.tsx** | One small copy tweak ("Book a viewing" instead of "Book your spot") |
| **ShopPreview.tsx** | Consider relevance, but not blocking |

---

## Files to Modify

```
apps/marketing/src/components/sections/
├── Hero.tsx                 # HIGH - headline, subheads, CTAs
├── IndustrySelector.tsx     # HIGH - headline, tabs, descriptions
├── SocialProof.tsx          # HIGH - case study content
├── WaitlistSignup.tsx       # HIGH - headline, dropdown, CTA
├── DashboardPreview.tsx     # MEDIUM - example business, frame names
├── AnalyticsPreview.tsx     # MEDIUM - frame names in mockup
├── Features.tsx             # MEDIUM - Card 1 visual example
├── MomentumAI.tsx           # LOW - one copy tweak
└── ShopPreview.tsx          # LOW - review relevance
```

---

## Implementation Sequence

1. **Hero.tsx** - First impression, most important
2. **IndustrySelector.tsx** - Demo section, proves the concept
3. **WaitlistSignup.tsx** - Conversion point
4. **SocialProof.tsx** - Trust builder (may need real case study)
5. **DashboardPreview.tsx** - Editor preview context
6. **AnalyticsPreview.tsx** - Frame names only
7. **Features.tsx** - Visual example only
8. **MomentumAI.tsx** - Single word change

---

*Created: December 2025*
*Purpose: Copy audit for property/hospitality repositioning*
