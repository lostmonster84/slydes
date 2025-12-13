# Slydes - Product Requirements Document (PRD)

> **"Old school websites are OUT. Slydes are IN."**
>
> **Version**: 3.0
> **Date**: December 2025
> **Status**: Pre-Development

---

## 📋 Executive Summary

**Product Name**: Slydes

**Tagline**: "Old school websites are OUT. Slydes are IN."

**One-Liner**: TikTok-style vertical video experiences for businesses—restaurants, hotels, salons, fitness studios, and any business that wants to capture attention on mobile.

**Problem**: Businesses have desktop-first websites that fail on mobile. They're selling experiences, services, and products—but their websites read like brochures from 2015. Mobile visitors bounce. Engagement is dead. Rebuilding is expensive ($5k-$15k) and risky.

**Solution**: A two-sided platform where businesses create immersive vertical video Slydes, and consumers discover amazing local businesses through an addictive swipe-to-explore app.

**Target Market**: Any visual business including:
- **Hospitality**: Restaurants, hotels, vacation rentals, B&Bs
- **Services**: Salons, barbershops, spas, wellness centers
- **Fitness**: Gyms, studios, personal trainers
- **Experiences**: Tours, activities, escape rooms, entertainment
- **Real Estate**: Agents, property listings, rentals
- **Retail**: Boutiques, showrooms, automotive
- **Professional**: Photographers, designers, creatives

**Business Model**: Freemium SaaS (Free + Creator £25/mo - see PAY-TIERS.md) + transaction fees on bookings (Phase 3)

**Competitive Advantage**: Only TikTok-style platform that's both a creation tool for businesses AND a discovery app for consumers

---

## 🎯 Market Opportunity

### Total Addressable Market (TAM)

**US Visual Businesses**:
- Restaurants & Hospitality: 1,050,000+
- Hotels/B&Bs/Vacation Rentals: 1,350,000+
- Salons, Spas & Wellness: 240,000+
- Fitness Studios & Gyms: 115,000+
- Real Estate: 500,000+
- Professional Services: 1,000,000+
- Retail & Automotive: 750,000+
- **Total TAM**: ~5M+ businesses

**Serviceable Addressable Market (SAM)** (5% adoption): 250,000 customers
**At £25/month average**: **£75M ARR potential** (see PAY-TIERS.md for pricing)

---

### Market Trends & Validation

**Mobile-First Imperative**:
- 96% of adults browse on mobile devices
- 70-80% of local searches happen on mobile
- Desktop-first websites lose 50%+ of mobile visitors

**Short-Form Content Dominance**:
- TikTok: 1B+ users, 95 min/day average usage
- Instagram Reels: 500M+ daily active users
- Scrollytelling engagement: 400% higher than static content

**Consumer Behavior Shift**:
- People discover businesses on social media, not Google
- Video converts 86% better than static content
- QR code adoption up 20%+ since 2020

**Customer Pain Points** (validated):
- Current websites poorly optimized for mobile
- Booking systems expensive ($250-$500/month) with transaction fees
- No easy way to create immersive mobile experiences
- Fighting for attention in noisy social feeds

---

## 🔍 Competitive Analysis

### Direct Competitors

| Competitor | Positioning | Pricing | Weakness | Our Advantage |
|------------|-------------|---------|----------|---------------|
| **Linktree** | Link-in-bio | $0-$24/mo | No video, no storytelling | Video-native, immersive |
| **Beacons** | Creator toolkit | $0-$90/mo | Not TikTok-style, 2.3/5 support | True vertical scroll, business focus |
| **Wix** | Website builder | $16-$45/mo | Desktop-first, complex | 5-min setup, mobile-first |
| **Instagram** | Social media | Free | Algorithm dependent, noisy | You own your audience |
| **Yelp** | Discovery | Varies | Photos only, pay-to-play | Video-first, fair discovery |

### Market Gaps (Whitespace)

✅ **No TikTok-style vertical video platform for businesses**
✅ **No two-sided platform** (businesses create + consumers discover)
✅ **No integrated booking** in a video-native experience
✅ **No business-specific templates** with AIDA storytelling
✅ **No consumer discovery app** for local businesses via video

**Competitive Moat**: Two-sided platform with network effects—more businesses = better consumer experience = more consumers = more valuable for businesses.

---

## ⭐ Key Features

### Phase 1: Web Platform (MVP - Q1 2025)

#### 1. Slyde Builder

**The Dream**: Business owner creates a stunning vertical video Slyde in 5 minutes.

**User Flow**:
1. Sign up (email or social)
2. Choose industry template (Restaurant, Hotel, Salon, etc.)
3. Upload images/videos (or use AI to generate from existing content)
4. Customize text, colors, CTAs
5. Publish to `businessname.slydes.io`
6. Share link everywhere

**Technical Specs**:
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase PostgreSQL
- **Storage**: Vercel Blob (images/videos)
- **Forms**: React Hook Form + Zod validation

**Acceptance Criteria**:
- [ ] User can create Slyde in <5 minutes
- [ ] Images upload in <5 seconds
- [ ] Published Slyde loads in <2 seconds (LCP)
- [ ] Works on all mobile devices (iOS Safari, Android Chrome)

---

#### 2. Template Library

**Industry Templates** (MVP - 6 types):

**Restaurant/Bar** (7-9 slides):
1. Hero (signature dish + vibe)
2. Menu Highlights (carousel)
3. Our Story (chef/owner)
4. The Space (ambiance)
5. Reviews (Google stars)
6. Find Us (map + hours)
7. Reserve (CTA)

**Hotel/Rental** (7-9 slides):
1. Hero (property shot)
2. Rooms/Spaces (carousel)
3. Amenities
4. The Area (nearby attractions)
5. Reviews
6. Gallery
7. Book Now (CTA)

**Salon/Spa** (7-9 slides):
1. Hero (transformation shot)
2. Services (carousel)
3. Our Team
4. The Space
5. Reviews
6. Location
7. Book Appointment (CTA)

**Fitness/Studio** (7-9 slides):
1. Hero (class in action)
2. Classes (schedule)
3. Instructors
4. What to Expect
5. Reviews
6. Location
7. Sign Up (CTA)

**Real Estate** (7-9 slides):
1. Hero (property exterior)
2. Interior Tour (carousel)
3. Features & Specs
4. Neighborhood
5. Price & Details
6. Agent Info
7. Schedule Viewing (CTA)

**Generic/Other** (7-9 slides):
1. Hero
2. Services/Products
3. About
4. Gallery
5. Reviews
6. Location
7. Contact (CTA)

**Template Features**:
- Add/remove/reorder slides
- Each slide supports image OR video
- Ken Burns animation (12s scale loop) for images
- Autoplay loop for videos

---

#### 3. One-Click Deployment

**User Flow**:
1. User clicks "Publish"
2. System generates: `businessname.slydes.io`
3. Slyde deploys to Vercel edge network (<30 seconds)
4. SSL certificate auto-provisioned
5. User gets shareable link

**Custom Domain** (Creator tier):
- User can CNAME `m.business.com` → Slydes
- SSL auto-renewed

---

#### 4. Stripe Billing

**Pricing Tiers**:

> **See [PAY-TIERS.md](./PAY-TIERS.md) for source of truth on pricing.**

| Tier | Price | Features |
|------|-------|----------|
| **Free** | £0 | 1 Slyde, watermark, no analytics |
| **Creator** | £25/mo or £250/yr | Up to 10 Slydes, analytics, no watermark |

**Technical Specs**:
- Stripe Checkout (hosted payment page)
- Stripe Billing (automatic renewals)
- Webhooks: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
- 17% discount for annual (£250 vs £300)

---

#### 5. Basic Analytics

**Metrics** (MVP):
- **Views**: Total visits to Slyde
- **Slide Reach**: % of users reaching each slide
- **CTA Clicks**: Clicks on booking/contact buttons
- **Traffic Sources**: Referrers (Instagram, QR code, direct)

**UI**:
- Line chart (views over last 30 days)
- Slide funnel (drop-off visualization)
- Top 5 referrers

---

### Phase 2: Partner App (Q2-Q3 2025)

**Purpose**: Mobile-first content creation for business owners

**Core Features**:

#### Content Creation
- Record videos directly in-app (vertical native)
- Upload from camera roll
- Multi-slide stories
- Basic editing (trim, text overlays)
- Instant publish

#### Profile Management
- Business info (hours, location, contact)
- Slide library (organize, reorder)
- Link sharing (copy URL, generate QR)
- Analytics dashboard

**Platforms**: iOS, Android (React Native)

---

### Phase 3: Consumer App (Q4 2025+)

**Purpose**: Discovery platform for consumers

**Core Features**:

#### Discovery Feed
- Vertical video feed (TikTok-style)
- Location-based (businesses near you)
- Category browse (Restaurants, Hotels, etc.)
- Search
- Algorithm (personalized recommendations)

#### Engagement
- Swipe to explore
- Like (save to favorites)
- Share (Instagram, WhatsApp, text)
- Info button (business details)

#### Booking & Conversion
- In-Slyde CTAs ("Book Now", "Call", "Directions")
- Direct booking (native integration)
- Payment (in-app transactions)

#### Social
- Follow businesses
- Collections ("Weekend Plans", "Date Night")
- Trending (popular Slydes in area)

---

## 👥 Target Customer Profiles

### Primary Persona: "Visual Business Owner"

**Demographics**:
- Age: 25-50
- Role: Business owner/manager
- Tech comfort: High (uses Instagram/TikTok)
- Revenue: $100k-$5M annual
- Team size: 1-50 employees

**Business Types**:
- Restaurants, cafes, bars
- Hotels, vacation rentals, B&Bs
- Salons, barbershops, spas
- Fitness studios, gyms
- Real estate agents
- Photographers, creatives

**Pain Points**:
- Current website doesn't showcase what they do
- Mobile visitors bounce
- Competing for attention on social media
- Can't afford custom development

**Jobs to Be Done**:
- Capture attention on mobile
- Convert visitors to customers
- Look professional without big budget
- Update content easily

---

### Secondary Persona: "Multi-Location Operator"

**Demographics**:
- Age: 35-55
- Role: Regional manager, franchise owner
- Properties: 3-50 locations

**Pain Points**:
- Each location needs unique presence
- Can't afford custom sites per location
- Needs brand consistency + local customization

**Jobs to Be Done**:
- Deploy Slydes for multiple locations quickly
- Maintain brand consistency
- Track performance per-location

---

## 🚀 Product Vision & Strategy

### North Star Metric

**Monthly Active Slydes**: Number of Slydes deployed and receiving traffic

**Supporting Metrics**:
- Free-to-paid conversion: 20% target
- Churn rate: <5% monthly
- Time to first publish: <5 minutes
- NPS: >50

---

### Product Principles

1. **Mobile-First, Always**: Design for 9:16 portrait, never adapt from desktop
2. **Video-Native**: Video is the default, not an add-on
3. **5-Minute Magic**: From signup to published in <5 minutes
4. **Story Over Lists**: Every Slyde tells a narrative (AIDA framework)
5. **Two-Sided Platform**: Value for businesses AND consumers
6. **Network Effect**: More businesses = better consumer experience = more businesses

---

## 📦 Development Roadmap

### Phase 1: MVP Build (Weeks 1-12)

**Week 1-2: Setup & Architecture**
- [ ] Next.js 15 project setup
- [ ] Supabase database + auth
- [ ] Vercel deployment pipeline
- [ ] Design system (Tailwind + shadcn/ui)

**Week 3-4: Slyde Builder**
- [ ] Template selector UI
- [ ] Image/video upload (Vercel Blob)
- [ ] Text editor
- [ ] Color picker
- [ ] Live preview

**Week 5-6: Template Components**
- [ ] 6 industry templates
- [ ] 9-slide AIDA structure
- [ ] Mobile-responsive testing

**Week 7-8: Deployment System**
- [ ] One-click publish
- [ ] Custom subdomains
- [ ] SSL auto-provisioning

**Week 9-10: Billing**
- [ ] Stripe Checkout
- [ ] Subscription management
- [ ] Free tier limits
- [ ] Creator tier features (see PAY-TIERS.md)

**Week 11-12: Analytics + Polish**
- [ ] View tracking
- [ ] Slide funnel analytics
- [ ] Dashboard UI
- [ ] Bug fixes

**Deliverable**: Functional MVP, ready for pilot customers

---

### Phase 2: Partner App (Weeks 13-24)

**Week 13-16: App Foundation**
- [ ] React Native project setup
- [ ] Auth integration (Supabase)
- [ ] API endpoints

**Week 17-20: Content Creation**
- [ ] Camera integration
- [ ] Video recording
- [ ] Upload flow
- [ ] Basic editing

**Week 21-24: Publishing + Analytics**
- [ ] In-app publish
- [ ] Analytics dashboard
- [ ] Push notifications

**Deliverable**: Partner App in App Store / Google Play

---

### Phase 3: Consumer App (Weeks 25-40)

**Week 25-28: Discovery Feed**
- [ ] Vertical video feed
- [ ] Location services
- [ ] Category browsing

**Week 29-32: Engagement**
- [ ] Like/save functionality
- [ ] Share flows
- [ ] Algorithm v1

**Week 33-36: Booking**
- [ ] In-Slyde CTAs
- [ ] Booking integrations
- [ ] Transaction processing

**Week 37-40: Social + Polish**
- [ ] Following
- [ ] Collections
- [ ] Trending
- [ ] Performance optimization

**Deliverable**: Consumer App in App Store / Google Play

---

## 🏗️ Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Slydes Platform                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Web Platform (Next.js 15)                              │
│  ├─ Marketing Site (/)                                  │
│  ├─ Dashboard (/dashboard)                              │
│  │  ├─ Slyde builder                                    │
│  │  ├─ Analytics                                        │
│  │  └─ Billing                                          │
│  └─ Public Slydes (/:businessSlug)                      │
│                                                          │
│  Partner App (React Native)                             │
│  ├─ Content creation                                    │
│  ├─ Profile management                                  │
│  └─ Analytics                                           │
│                                                          │
│  Consumer App (React Native)                            │
│  ├─ Discovery feed                                      │
│  ├─ Booking                                             │
│  └─ Social features                                     │
│                                                          │
│  Backend (API)                                          │
│  ├─ /api/slydes (CRUD)                                  │
│  ├─ /api/analytics (tracking)                           │
│  └─ /api/webhooks/stripe (billing)                      │
│                                                          │
│  Database (Supabase PostgreSQL)                         │
│  ├─ accounts (multi-tenant)                             │
│  ├─ slydes (design config JSONB)                        │
│  ├─ analytics_events                                    │
│  └─ subscriptions                                       │
│                                                          │
│  Storage                                                │
│  ├─ Vercel Blob (images, videos)                        │
│  └─ Vercel KV (cache)                                   │
│                                                          │
│  Auth (Supabase Auth)                                   │
│  ├─ Email/password                                      │
│  ├─ OAuth (Google, Apple)                               │
│  └─ Row-level security                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### Technology Stack

**Frontend**:
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Components**: shadcn/ui
- **Animations**: Framer Motion

**Backend**:
- **API**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Vercel Blob
- **Billing**: Stripe

**Mobile**:
- **Framework**: React Native
- **Navigation**: React Navigation
- **State**: Zustand

**Infrastructure**:
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Email**: Resend

---

### Database Schema

```sql
-- Accounts (multi-tenant)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscription_tier TEXT DEFAULT 'free', -- free, pro
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Slydes
CREATE TABLE slydes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  template_id TEXT NOT NULL,
  design_config JSONB NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  custom_domain TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  slyde_id UUID NOT NULL REFERENCES slydes(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'view', 'slide_view', 'cta_click'
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row-level security
ALTER TABLE slydes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own slydes"
  ON slydes FOR ALL
  USING (account_id = auth.uid());
```

---

## 💰 Business Model & Pricing

> **See [PAY-TIERS.md](./PAY-TIERS.md) for source of truth on pricing.**

### Revenue Streams

**1. Subscription Revenue** (Primary)

| Tier | Price | Features |
|------|-------|----------|
| Free | £0 | 1 Slyde, watermark, no analytics |
| Creator | £25/mo or £250/yr | Up to 10 Slydes, analytics, no watermark |

**2. Transaction Revenue** (Phase 3)

- 3-5% commission on bookings facilitated through Consumer App
- Alternative to expensive booking systems (OpenTable charges 10-15%)

**3. Featured Listings** (Phase 3)

- Businesses pay for top placement in Consumer App discovery
- $299/mo or CPC model ($1-3/click)

**4. Enterprise** (Phase 3)

- Multi-location management
- White-label solutions
- $500-$5,000/mo based on # locations

---

### Unit Economics

| Metric | Phase 1-2 | Phase 3 |
|--------|-----------|---------|
| ARPU | £25/mo | £69/mo |
| CAC | £100 | £50 |
| LTV | £600 | £2,484 |
| LTV:CAC | 6x | 49.7x |
| Payback | 4 months | 3 weeks |
| Gross Margin | 74% | 90% |

---

### Revenue Projections

| Year | Paid Customers | MRR | ARR |
|------|----------------|-----|-----|
| 2025 | 2,000 | $34K | $410K |
| 2026 | 10,000 | $875K | $10.5M |
| 2027 | 40,000 | $2.4M | $28.8M |

---

## 🚀 Go-to-Market Strategy

### Phase 1: Launch (Q1-Q2 2025)

**Goal**: 500 paid customers

**Primary Channel: Influencer Program**

**Founding Partners** (50 influencers):
- Lifetime Pro Access (free)
- 25% Commission on all referrals (lifetime)
- Early access to features

**Why This Works**:
- Influencers have audience we don't
- Aligned incentives (they earn when we earn)
- Distribution > immediate revenue

**Secondary Channels**:
- Product Hunt launch (Top 5 target)
- Direct outreach to visual businesses
- Content marketing (SEO)

---

### Phase 2: Partner App Launch (Q2-Q3 2025)

**Goal**: 5,000 customers

**Channels**:
- App Store optimization
- Referral program
- Social media presence
- Industry partnerships

---

### Phase 3: Consumer App Launch (Q4 2025+)

**Goal**: 40,000 businesses, 1M+ consumers

**The Flywheel**:
1. More businesses → More content for consumers
2. More consumers → More views for businesses
3. More views → More bookings → More revenue
4. More revenue → More businesses join
5. **Network effect accelerates**

---

## 📊 Case Study: WildTrax - Proof of Concept

> The Slydes framework was built and validated inside WildTrax, a Highland adventure marketplace.

### The Challenge

WildTrax needed mobile experiences for adventure products that could compete with TikTok/Instagram for user attention. Traditional responsive design wasn't working—mobile bounce rates were high.

### The Solution

Built a complete 9-slide TikTok-style experience using the AIDA framework:

| Slide | Purpose | Media Type |
|-------|---------|------------|
| 1. Hook | Grab attention | Image/Video |
| 2. Social Proof | Build trust | Carousel |
| 3. How It Works | Educate | Video |
| 4. Who (Personas) | Self-identify | Carousel |
| 5. What (Features) | Show value | Grid |
| 6. Choose | Select product | Carousel |
| 7. Cinematic | Emotional break | Video |
| 8. Trust (FAQs) | Handle objections | Accordion |
| 9. Action (CTA) | Convert | Button |

### Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| AIDA Score | 23% | 100% | +343% |
| Section Completion | 60% | 95% | +58% |
| Time on Page | 45s | 2m 40s | +253% |
| Bounce Rate | 50% | 20% | -60% |

### Code Assets

~2,000 lines of production code reusable for Slydes:
- 9-slide TikTok components (1,152 lines)
- Content management context (227 lines)
- Auto-save hook (~50 lines)
- Undo/redo hook (~80 lines)
- CSS utilities (~50 lines)

**Estimated MVP code reusability: 60%**

---

## 🎨 Design System

### Brand Identity

**Name**: Slydes

**Tagline**: "Old school websites are OUT. Slydes are IN."

**Colors**:
- **Future Black**: #0A0E27 (primary background)
- **Leader Blue**: #2563EB (primary accent)
- **Electric Cyan**: #06B6D4 (secondary accent)
- **Pure White**: #FFFFFF (text, contrast)

**Typography**:
- **Headings**: Inter (700, 800)
- **Body**: Inter (400, 500)

**Voice**:
- Bold, confident, unapologetic
- "Built for the future"
- No hedging, no "maybe"

---

## 🔐 Security & Compliance

### Security Measures

- **Encryption**: TLS 1.3 in transit, PostgreSQL encryption at rest
- **Authentication**: JWT-based (Supabase Auth)
- **Authorization**: Row-level security (RLS)
- **Rate Limiting**: 100 req/min per IP

### Compliance

- **GDPR**: Data export, deletion requests, cookie consent
- **PCI DSS**: Stripe handles all card data
- **Privacy**: No PII in analytics, hashed IPs only

---

## 📝 Open Questions & Risks

### Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Big tech launches competitor | Medium | High | First-mover advantage, network effect moat |
| Low free-to-paid conversion | Medium | High | Mandatory branding = viral growth regardless |
| Consumer App doesn't get traction | Medium | High | Business value exists without consumer app |
| Technical scalability | Low | Medium | Vercel + Supabase scale well |

### Key Success Factors

1. **Distribution via Influencers** - 50 Founding Partners
2. **Free tier virality** - Mandatory branding
3. **Speed to market** - First TikTok-style business platform
4. **Network effect** - Consumer app creates stickiness

---

## 📖 Appendix

### Glossary

**AIDA**: Attention, Interest, Desire, Action (conversion framework)
**ARPU**: Average Revenue Per User
**CAC**: Customer Acquisition Cost
**LTV**: Lifetime Value
**MRR**: Monthly Recurring Revenue
**NRR**: Net Revenue Retention
**RLS**: Row-Level Security
**Slyde**: A vertical video experience created on the Slydes platform

---

**Document Status**: v3.0
**Last Updated**: December 2025
**Next Review**: After MVP launch

---

*This PRD is a living document. Updated to reflect current Slydes positioning as a two-sided platform with Free + Creator (£25/mo) pricing model. See PAY-TIERS.md for source of truth.*
