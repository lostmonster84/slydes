# Slydes Feasibility Analysis: Vertical Video Platform for Visual Businesses

## Executive Summary

**Overall Feasibility: HIGH (8.5/10)**

Slydes occupies a genuine whitespace in the market. No competitor offers true TikTok-style vertical video experiences as a two-sided platform connecting businesses with consumers. The combination of proven technology (validated via WildTrax), clear market need, and favorable unit economics makes this a compelling opportunity.

---

## 1. Market Opportunity Analysis

### The Gap is Real

| What Exists | What's Missing |
|-------------|----------------|
| Link-in-bio tools (Linktree, Beacons) | TikTok-style vertical scroll |
| Website builders (Wix, Squarespace) | Mobile-first video storytelling |
| Discovery platforms (Yelp, Google Maps) | Immersive 100dvh experiences |
| Social media (Instagram, TikTok) | Business-specific templates + booking |

**Key Finding**: After extensive research, **no platform combines all four elements**:
1. TikTok-style vertical video/image scrolling (100dvh, scroll-snap)
2. Mobile-first design (not desktop-adapted)
3. Two-sided platform (businesses create + consumers discover)
4. Industry-specific templates with booking integration

### Market Size Validation

**TAM**: ~5M+ US visual businesses
- Restaurants & Hospitality: 1,050,000+
- Hotels/B&Bs/Vacation Rentals: 1,350,000+
- Salons, Spas & Wellness: 240,000+
- Fitness Studios & Gyms: 115,000+
- Real Estate: 500,000+
- Professional Services: 1,000,000+
- Retail & Automotive: 750,000+

**SAM** (5% adoption): 250,000 customers
**Revenue Potential**: £75M ARR at £25/month Creator tier (see PAY-TIERS.md)

### Consumer Behavior Trends (Favorable)

| Trend | Data Point | Implication |
|-------|-----------|-------------|
| Mobile dominance | 70-80% of searches on mobile | Desktop-first sites losing customers |
| Short-form video | TikTok 1B+ users, 95 min/day | Users expect vertical scroll UX |
| Video conversion | 86% increase in conversions with video | Video-first approach validated |
| QR code adoption | 20% spending increase with QR menus | Customers are mobile-ready |

---

## 2. Competitive Landscape

### Primary Competitors

#### Beacons.ai
**What they do**: All-in-one creator toolkit (link-in-bio, store, email, media kits)
**Pricing**: $0-$90/month + 0-9% transaction fees
**Strengths**:
- Generous free tier
- Built-in monetization
- AI-powered tools
**Weaknesses**:
- POOR customer support (2.3/5 rating)
- Technical glitches (34% of negative reviews)
- NOT TikTok-style (traditional webpage layout)
- NOT business-focused (targets creators)
- 9% transaction fees on lower tiers

**Slydes Advantage**: True vertical scroll UX, business-specific templates, two-sided platform, no transaction fees

#### Linktree
**What they do**: Simple link aggregation (market leader)
**Pricing**: $0-$24/month
**Strengths**: 40M+ users, strong brand recognition
**Weaknesses**: Basic links only, no narrative/storytelling, desktop-first

**Slydes Advantage**: Story-driven AIDA framework, immersive mobile experience, consumer discovery app

#### Instagram / TikTok
**What they do**: Social media with business profiles
**Pricing**: Free (monetized via ads)
**Strengths**: Massive user base, native video
**Weaknesses**: Algorithm dependency, no booking integration, you don't own the audience

**Slydes Advantage**: Business owns their content, direct booking, dedicated discovery for local businesses

#### Website Builders (Wix, Squarespace, GoDaddy)
**What they do**: Traditional multi-page websites
**Weaknesses**: Desktop-first, complex UI, no TikTok-style UX, no discovery

**Slydes Advantage**: 5-minute setup, mobile-first, consumer app drives traffic TO businesses

### Competitive Matrix

| Feature | Beacons | Linktree | Instagram | Wix | **Slydes** |
|---------|---------|----------|-----------|-----|-----------|
| TikTok vertical scroll | No | No | Yes | No | **Yes** |
| Industry templates | No | No | No | Generic | **Yes** |
| 100dvh full-screen | No | No | No | No | **Yes** |
| Ken Burns animations | No | No | No | No | **Yes** |
| Consumer discovery app | No | No | Yes (but noisy) | No | **Yes** |
| 5-min setup | No | Yes | Yes | No | **Yes** |
| Direct booking | Link out | Link out | Link out | Plugin | **Native (planned)** |
| Business owns audience | No | No | No | Yes | **Yes** |

---

## 3. Technical Feasibility

### Existing Codebase (WildTrax)

**~2,000 lines of production-ready code already exists:**

| Asset | Lines | Status |
|-------|-------|--------|
| 9-section TikTok components | 1,152 | Production-ready |
| Content management context | 227 | Production-ready |
| Auto-save hook | ~50 | Production-ready |
| Undo/redo hook | ~80 | Production-ready |
| CSS utilities (scroll-snap) | ~50 | Production-ready |

**Estimated MVP code reusability: 60%**

### Technical Stack (Validated)

- **Framework**: Next.js 15 (App Router) - Industry standard
- **Database**: Supabase PostgreSQL - Scales well, RLS for multi-tenancy
- **Hosting**: Vercel - Auto-scaling, global CDN
- **Payments**: Stripe - Industry standard
- **AI**: Claude API - Already integrated for content generation
- **Email**: Resend - Transactional emails + Audiences

### Key Technical Patterns (Proven)

```css
/* TikTok-style scroll - WORKING */
.slyde-section {
  height: 100dvh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

**Risk Assessment**: LOW - Core technology is proven, not experimental.

### Current Development State

**What's Built**:
- Core 9-section component library
- Website scraper (Cheerio)
- AI content generator (Claude API)
- Onboarding wizard UI
- Site publisher
- TikTok-style rendering
- Basic analytics tracking
- Waitlist system (Resend Audiences)

**What's Missing**:
- Full authentication system
- Stripe billing integration
- Partner App (mobile content creation)
- Consumer App (discovery platform)
- Custom domain setup
- Advanced analytics

**Estimated time to MVP**: 8-12 weeks (not starting from zero)

---

## 4. Business Model Viability

### Pricing Strategy

> See [PAY-TIERS.md](./PAY-TIERS.md) for current pricing and full tier breakdown.

| Tier | Price | Target |
|------|-------|--------|
| Free | £0 | Testing, early creators |
| Creator | £25/mo or £250/yr | Most businesses |

**Blended ARPU**: £25/month

### Distribution Strategy: Influencer Program

**Founding Partners** (50 influencers):
- Lifetime Pro Access (free forever)
- 25% Commission on every Pro subscriber they refer, for life
- Early access to new features

**Why This Works**:
- Influencers have audience reach we don't have
- Commission = aligned incentives
- Distribution > immediate revenue at this stage

### Unit Economics (Excellent)

> See [PAY-TIERS.md](./PAY-TIERS.md) for current pricing.

| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| CAC (Phase 2) | £80 | Varies | Reasonable |
| LTV | £600 | >3x CAC | Good |
| LTV/CAC | 7.5x | >3x | Excellent |
| Payback Period | 4 months | <12 months | Good |
| Gross Margin | 80% | 70-80% | On benchmark |

**With Transaction Revenue (Phase 3)**:

| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| LTV | £2,340 | >3x CAC | Exceptional |
| LTV/CAC | 58.5x | >3x | Outstanding |
| Payback Period | 3 weeks | <12 months | Exceptional |
| Gross Margin | 89% | 70-80% | Above benchmark |

### Revenue Projections

> See [PAY-TIERS.md](./PAY-TIERS.md) for current pricing.

| Timeline | Customers | MRR | ARR |
|----------|-----------|-----|-----|
| End 2025 | 2,000 paid + 8,000 free | £45,000 | £540K |
| End 2026 | 10,000 paid | £700K | £8.4M |
| End 2027 | 40,000 paid | £2M | £24M |

**Break-even**: Q4 2026 (with transaction revenue)

### Cost Structure

**Fixed Costs**: ~$24K/month (Phase 1)
- Team: $20K
- Hosting/Infrastructure: $2K
- Software/Tools: $1K
- Office/Admin: $1K

**Variable Costs**: ~$18/customer
- Video hosting: $5
- Customer success: $10
- Payment processing: $3

---

## 5. Go-to-Market Strategy

### Phase 1: Launch (Q1-Q2 2025)

**Goal**: 500 paid customers

**Channels**:
1. **Influencer Program** (Primary)
   - Recruit 50 Founding Partners
   - Each brings 10+ referrals = 500+ customers
   - 25% lifetime commission = aligned incentives

2. **Direct Outreach** (Secondary)
   - Target: Visual businesses in major cities
   - Offer: Free tier + easy upgrade path
   - Expected: 20% conversion

3. **Product Hunt Launch**
   - Goal: Top 5 product of the day
   - Expected: 1,000+ signups

### Phase 2: Partner App Launch (Q2-Q3 2025)

**Goal**: 5,000 customers

**Channels**:
- App Store optimization
- Referral program (existing customers)
- Content marketing (SEO)
- Social media presence

### Phase 3: Consumer App & Network Effect (Q4 2025+)

**Goal**: 40,000+ businesses, 1M+ consumers

**Channels**:
- Consumer app virality (share Slydes)
- Featured listings (businesses pay for top placement)
- Transaction fees (3-5% on bookings)
- Network effect flywheel

---

## 6. Risk Assessment

### High-Impact Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Big tech launches competing feature | Medium (6-12mo) | High | First-mover advantage, two-sided platform moat |
| Low free-to-paid conversion (<10%) | Medium | High | Mandatory branding on free tier = viral growth even if they don't convert |
| Partner App adoption slower than expected | Medium | Medium | Web platform works standalone, app is enhancement |
| Consumer App doesn't get traction | Medium | High | Business value exists without consumer app (link-in-bio use case) |

### Competitive Response Timeline

**Instagram/TikTok**: Could add business booking in 12-24 months
- **Mitigation**: Two-sided platform with dedicated discovery, not fighting algorithm for attention

**Linktree/Beacons**: Could add video in 6-12 months
- **Mitigation**: Video-native from day one, not bolted on

### Key Success Factors

1. **Distribution via Influencers** - 50 Founding Partners with audience reach
2. **Free tier virality** - Mandatory branding = organic growth
3. **Speed to market** - First true TikTok-style business platform
4. **Network effect** - Consumer app makes platform stickier over time

---

## 7. Validation Evidence

### WildTrax Case Study Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| AIDA Score | 23% | 100% | +343% |
| Section Completion | 60% | 95% | +58% |
| Time on Page | 45s | 2m 40s | +253% |
| Bounce Rate | 50% | 20% | -60% |

### Industry Benchmarks (Favorable)

- Video on landing pages: **86% increase in conversions**
- QR code menus: **20% increase in customer spending**
- Video menus specifically: **15% spending increase**
- Short-form video engagement: **400% higher than static content**

---

## 8. Strategic Recommendations

### DO

1. **Launch Influencer Program first** - Distribution is everything
2. **Keep free tier viral** - Mandatory branding = organic growth
3. **Position as "the future"** - Bold messaging, not incremental improvement
4. **Build for mobile-first always** - No desktop compromises
5. **Launch Consumer App in 2025** - Network effect is the moat
6. **Document case studies early** - WildTrax results + pilot customers

### DON'T

1. **Don't add complexity** - Free + Pro only, keep it simple
2. **Don't compete on price** - £25/mo is already accessible (see PAY-TIERS.md)
3. **Don't build for desktop first** - Mobile-native always
4. **Don't skip the influencer program** - Distribution > immediate revenue

### Messaging Framework

**Positioning Statement**:
> "Old school websites are OUT. Slydes are IN. TikTok-style vertical video experiences for businesses that want to capture attention and convert mobile traffic into bookings."

**Key Messages**:
- "Your website is stuck in 2015. Slydes is built for the future."
- "Static websites are dead. You just haven't buried yours yet."
- "If you're not using Slydes, you're losing customers."

---

## 9. Feasibility Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| Market Opportunity | 9/10 | Clear whitespace, massive TAM |
| Technical Feasibility | 9/10 | 60% of MVP code exists |
| Competitive Position | 8/10 | First-mover, but watch for fast-followers |
| Business Model | 9/10 | Strong unit economics, network effect potential |
| Go-to-Market | 8/10 | Influencer program is key differentiator |
| Risk Profile | 7/10 | Manageable risks, no showstoppers |

**Overall Feasibility: 8.3/10 - HIGHLY FEASIBLE**

---

## 10. Conclusion

**Should you launch Slydes?** YES.

**Why?**
1. **Genuine market whitespace** - No TikTok-style vertical video platform for businesses
2. **Validated technology** - WildTrax proves the UX works (+343% AIDA improvement)
3. **Strong unit economics** - 4.6x LTV/CAC (Phase 2), 49.7x (Phase 3)
4. **Weak competitors** - Beacons has 2.3/5 support rating, others aren't video-native
5. **Two-sided platform moat** - Network effect creates defensibility
6. **Distribution strategy** - Influencer program > direct sales

**Key Success Metrics (End of 2025)**:
- 2,000 paid customers
- 8,000 free users (viral growth engine)
- $34K MRR
- 50 Founding Partners active
- <5 minutes time to first publish
- Partner App launched

**Recommended Next Steps**:
1. Complete authentication system (Supabase Auth)
2. Integrate Stripe billing
3. Recruit 50 Founding Partners (influencer program)
4. Build Partner App (mobile content creation)
5. Launch on Product Hunt
6. Begin Consumer App development

---

*Analysis updated December 2025. Reflects current Slydes positioning as two-sided platform with Free + Creator pricing model (see PAY-TIERS.md for current pricing).*
