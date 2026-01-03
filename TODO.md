# Slydes TODO

> **Last updated**: January 3, 2026

---

## In Progress

_Nothing currently in progress_

---

## Up Next (Dev)

### Analytics v1 (Real Data)
- [x] Apply migration `003_create_slydes_analytics.sql` in production Supabase
- [x] Verify ingest returns 200 in production (not 503)
- [x] Publish flow creates slydes/frames explicitly (not best-effort)
- [x] Dashboard uses real signals (Momentum)
- [x] Schedule daily rollups (cron) - vercel.json + GET handler

### Dev Launch Prep
- [x] Set up Plausible analytics (added to layout.tsx)
- [x] Test payment flow end-to-end (webhook wired to update profiles)

---

## Pre-Launch (James)

### Content Creation
- [ ] Record 15-sec hero demo video
- [ ] Record 90-sec explainer video
- [ ] Create 3 best-in-class demo Slydes (restaurant, hotel, tour)

### Social Proof
- [ ] Get 3 customer testimonials (30-sec each)

### Product Hunt
- [ ] Prepare screenshots
- [ ] Prepare demo video
- [ ] Write launch copy

---

## Icebox (Post-MVP / On Hold)

### Consumer App (Q4 2025+)
- [ ] Consumer App spec & strategy
- [ ] Discovery feed (TikTok-style)
- [ ] Location-based discovery
- [ ] Category filtering
- [ ] Like/share/save buttons

### Partner App (Q2-Q3 2025)
- [ ] Native app spec & design
- [ ] In-app video recording
- [ ] Video upload from camera roll
- [ ] Push notifications
- [ ] App Store submission

### Advanced Features
- [ ] In-app booking integration (OpenTable, Calendly)
- [ ] API for embedding Slydes on external sites
- [ ] White-label options for agencies
- [ ] AI content creation (auto-generate from text)
- [ ] A/B testing for frames
- [ ] Heatmaps visualization

### Analytics Hardening
- [ ] Rate limiting on ingest endpoint
- [ ] Bot filtering
- [ ] Source/referrer normalization
- [ ] Strict event payload validation

### Integrations
- [ ] Zapier integration
- [ ] HubSpot integration
- [ ] WordPress plugin
- [ ] Mailchimp connection

### Spin-off Research (Parked at £5M+ ARR)
- [ ] PropertySlyde - agent branding + luxury discovery
- [ ] AutoSlyde - enthusiast vehicle platform

---

## Completed This Session

- [x] Fixed SlydeWizard modal centering (flexbox pattern)
- [x] Added vertical-specific template filtering (hotels see hotel templates, etc.)
- [x] Created new Wellness Experience template for spa/gym/wellness verticals
- [x] Made Organization Type editable in Settings (dropdown selector)
- [x] Fixed contact icons not showing in browser (`transpilePackages: ['@slydes/slyde-viewer']`)
- [x] Change "Categories" → "Slydes" in CategoryDrawer (already done)
- [x] Deploy Marketing app to production
- [x] Verify slydes.io/lostmonster shows published content

---

## Previously Completed

- [x] Created `@slydes/slyde-viewer` shared package (17 components)
- [x] Updated all imports in Studio and Marketing apps
- [x] Fixed deep import paths
- [x] Committed and pushed (c497daf)
