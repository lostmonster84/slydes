# Analytics TODO (Real Supabase-backed Metrics)

> **Purpose:** Keep us locked on the “real analytics” wavelength.
> This doc lists exactly what’s already built, what needs to be configured, and the next milestones.
>
> **Last updated:** December 15, 2025

---

## 0) What we mean by “real analytics”

Analytics must work for **every business**, for **every newly-created Slyde**, with stable attribution:

- **Organization (business)** → `organizations.slug` (e.g. `wildtrax`)
- **Slyde** → `slydes.public_id` (e.g. `camping`)
- **Frame** → `frames.public_id` (can remain numeric like `"1"`, `"2"`, etc.)

Events are **behaviour-based** (no CRM, no vanity dashboards), aligned with `docs/HQ-DASHBOARD-ANALYTICS-SPEC.md`:

- `sessionStart`
- `frameView`
- `ctaClick`
- `shareClick`
- `heartTap`
- `faqOpen`

---

## 1) What is already implemented (✅ done)

### 1.1 Database schema (Supabase)

- **Migration:** `apps/studio/supabase/migrations/003_create_slydes_analytics.sql`
- Adds:
  - `public.slydes`
  - `public.frames`
  - `public.analytics_events` (append-only)
  - `public.analytics_slyde_daily`, `public.analytics_frame_daily`
  - `public.rollup_analytics_day(target_day date)` (rollup helper)
- RLS:
  - org members can read content + rollups
  - org members can read events
  - **direct writes to `analytics_events` are blocked** (write via server/service role)

### 1.2 Ingest endpoint (server-side)

- `POST /api/analytics/ingest`
- File: `apps/marketing/src/app/api/analytics/ingest/route.ts`
- Behaviour:
  - Validates payload + batch size
  - Resolves org by `organizations.slug`
  - Maps `slydePublicId`/`framePublicId` → UUID rows
  - **Best-effort creates missing Slydes/Frames** (resilient for “new Slyde” flows)
  - Returns **503** if env isn’t configured (no crashes)

### 1.3 Viewer instrumentation (events emitted)

- File: `apps/marketing/src/components/slyde-demo/SlydeScreen.tsx`
- Adds analytics props:
  - `analyticsOrgSlug`
  - `analyticsSlydePublicId`
  - `analyticsSource`
- Emits + batches:
  - `sessionStart`, `frameView`, `ctaClick`, `heartTap`, `faqOpen`, `shareClick` (sheet open)
- Flushes periodically + on pagehide.

### 1.4 Real analytics query endpoints (for HQ)

- `GET /api/analytics/overview?org=...&range=7d|30d|90d`
  - File: `apps/marketing/src/app/api/analytics/overview/route.ts`
- `GET /api/analytics/slyde?org=...&slyde=...&range=7d|30d|90d`
  - File: `apps/marketing/src/app/api/analytics/slyde/route.ts`
- `POST /api/analytics/rollup?day=YYYY-MM-DD` (dev helper)
  - File: `apps/marketing/src/app/api/analytics/rollup/route.ts`

### 1.5 HQ Analytics reads real data (with fallback)

- File: `apps/marketing/src/app/demo/hq-analytics/page.tsx`
- When plan is Creator:
  - Fetches real data from `/api/analytics/overview` + `/api/analytics/slyde`
  - Merges into existing UI model (UI stays stable)
  - Shows “Setup required” card if analytics backend isn’t configured

---

## 2) Turn it on locally (you must do this) ✅

### 2.1 Apply the migration in Supabase

- Run migration: `apps/studio/supabase/migrations/003_create_slydes_analytics.sql`
- Ensure it creates tables + enum + function without errors.

### 2.2 Set env vars for `apps/marketing`

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Notes:
- Service role key is **server-only**; never expose it to client.
- Client-side auth uses anon key elsewhere; analytics ingest uses service role.

### 2.3 Verify traffic is hitting ingest

- Load viewer: `/demo-slyde?slyde=camping`
- Confirm network calls:
  - `POST /api/analytics/ingest` returns 200 (not 503)
- Then open HQ Analytics:
  - `/demo/hq-analytics` should fetch:
    - `/api/analytics/overview?...`
    - `/api/analytics/slyde?...`

---

## 3) Next milestones (the “keep on this wavelength” list)

### 3.1 Publishing creates Slydes + Frames explicitly (MVP critical)

Right now ingest can “best-effort” create missing rows. That’s useful, but publishing should be canonical.

- **Add publish flow** in HQ/editor that:
  - creates `slydes` row (organization_id, public_id, title, published=true)
  - creates `frames` rows with stable UUIDs + numeric `public_id`
  - ensures `frame_index` reflects the current ordering

### 3.2 Replace demo org slug with real organization slug everywhere

Current demos use `demoBusiness.id` as the `org` query param.
When auth is real:
- derive org slug from `profiles.current_organization_id → organizations.slug`

### 3.3 Schedule rollups (production)

Dev helper exists (`POST /api/analytics/rollup?...`), but production needs cron:
- Run `rollup_analytics_day(current_date - 1)` daily (or hourly rollups later)
- Store rollups in `analytics_*_daily` tables
- Update HQ endpoints to prefer rollups over raw events where possible

### 3.4 Hardening (before real traffic)

- Rate limiting / abuse prevention on ingest (Edge Function preferred)
- Strict validation of event payloads (allow-list meta fields)
- Bot filtering (basic heuristics)
- Source/referrer normalization

### 3.5 Dashboard reads real analytics

- Replace mocked dashboard momentum signals with real:
  - completion change vs previous period
  - biggest leak frame (by drop)
  - CTA click volume + rate

### 3.6 Frame identity correctness (important)

We must never lose analytics when frames are reordered:
- `frames.id` (UUID) is identity
- `frames.public_id` may be numeric for UX
- Store `frame_index` for ordering
- Events should include `framePublicId` + `meta.frameIndex` (already done)

---

## 4) Definition of done (for “real analytics v1”)

- [ ] Migration applied in Supabase
- [ ] Ingest returns 200 in production (no 503)
- [ ] Viewer emits events for every session
- [ ] HQ Analytics shows real numbers (overview + single slyde)
- [ ] Publish flow creates slydes/frames explicitly
- [ ] Dashboard uses real signals (Momentum only)
- [ ] Rollups run on schedule









