# Slydes HQ — Dashboard + Analytics Spec (Fact-Checked)

> **Purpose**: Define what “HQ” is, who it serves, what it promotes, and how **Dashboard** and **Analytics** work without turning Slydes into a complex “business suite”.
>
> This spec is intentionally **simple**, **behaviour-led**, and **MVP-tier accurate**.
>
> **Sources of truth** (do not contradict):
> - `PAY-TIERS.md` (Free vs Creator, analytics gating)
> - `MVP-MONETISATION.md` (upgrade triggers + “no interrupting creation”)
> - `WHAT-WE-WILL-BUILD.md` (behaviour-based measurement, “sharing = belief”, allowed signals)
> - `what-we-will-never-build.md` (no CRM, no vanity dashboards, no social mechanics)
> - `SLYDESBUILD.md` (canonical interaction + analytics event vocabulary)
> - `STRUCTURE.md` (Home Slyde → Child Slyde → Frame; HQ label = Profile)

---

## 1) What HQ is (and isn’t)

### HQ is
- **A command centre** for operators who want to **publish**, **share**, and **improve conversion**.
- A “small brain” interface that tells you **what matters now** and gives you **one-click next steps**.
- A home for **enquiry capture + handoff** (inbox/export/webhooks), not “lead management”.

### HQ is not
- ❌ A CRM / pipeline manager / campaigns tool (`what-we-will-never-build.md`)
- ❌ A vanity dashboard (likes, follower graphs, “trending” boards) (`what-we-will-never-build.md`)
- ❌ A complex BI tool (charts everywhere, filters everywhere, jargon everywhere)

---

## 2) Who uses this (personas + computer literacy)

### Primary users (MVP)
- **Owner-operator / SMB** (restaurants, gyms, salons, trades, vehicle hire)
  - **Skills**: comfortable with iPhone + Instagram + basic web apps; low patience for setup; hates spreadsheets.
  - **Goal**: “Does this bring customers today?”
- **Real estate agent / broker**
  - **Skills**: moderate; used to portals + email; wants speed; wants to respond fast.
  - **Goal**: “Which property Slyde is converting? Where do people drop?”
- **Creator/marketer (solo)**
  - **Skills**: higher; understands funnels; wants signal quickly.
  - **Goal**: “What to improve next? What to share more?”

### Implication
- **Default UX assumes low-to-medium technical ability**.
- We bias toward **guided actions**, **plain English**, and **progressive disclosure**.
- We avoid: dashboards requiring interpretation, custom report building, or “analytics expertise”.

---

## 3) The product truth HQ must promote

HQ must reinforce Slydes’ core product principles:
- **Speed is the product**: time to publish, time to share, time to first action (`WHAT-WE-WILL-BUILD.md`)
- **Momentum converts**: drop-off is the enemy (`WHAT-WE-WILL-BUILD.md`)
- **Sharing = belief**: if it’s not being shared, it’s not trusted (`MVP-MONETISATION.md`)
- **Behaviour > vanity**: completion + actions, not social loops (`WHAT-WE-WILL-BUILD.md`, `what-we-will-never-build.md`)
- **Conversion capture is allowed (not CRM)**: enquiries are intake + handoff (`WHAT-WE-WILL-BUILD.md`, `what-we-will-never-build.md`)

---

## 4) Navigation & IA (simple, but correct)

### Sidebar (HQ)
- **Dashboard**: v1 decision surface (one status line + one recommendation + ranked Slydes list)
- **Slydes**: manage Slydes (create/edit/publish) — no analytics here
- **Analytics**: deeper performance (Creator)
- **Inbox**: enquiries capture + handoff (not a CRM)
- **Brand**: logo/colours/voice guardrails (Creator later; can be basic in MVP)
- **Settings**: plan, billing, team (later), integrations (webhooks/export)

### Why Analytics is a separate menu
- Dashboard stays **calm** and **actionable**.
- Analytics is where “depth” lives, **only when requested**.
- This matches `MVP-MONETISATION.md` prompt #2: user clicks analytics → contextual upgrade gate.

---

## 5) Dashboard spec (v1.3 — what’s on it)

### Dashboard job
Answer in <5 seconds:
1) **Is this getting better, and what should I do next?**

### Dashboard sections (in priority order)

#### 1) Momentum header (hero sentence)
One sentence only (no cards, no background):
- “Completion is up 6% since your last change.”
- “One Slyde is leaking attention.”
- “CTA clicks increased this week.”
- “No changes shipped yet. Ship one to start momentum.”

#### 2) Primary focus card (one only)
Section title: **Next improvement**

Card content:
- “Camping is leaking attention at Frame 3”
- Supporting line: “42% leave here. • Last change: 3 days ago.”
- Optional suggestion (one line)
- Primary action: **Improve this Slyde**

Rules:
- Only one card
- No severity labels
- No dismiss button
- This is the dominant visual element

#### 3) Ranked Slydes list (with direction)
Each Slyde row shows only:
- Name
- Completion rate **with direction** (↑ / ↓ / → + delta)
- CTA clicks (absolute)
- Biggest drop-off frame
- Open button

Design: soft separation, vertical rhythm, no “analytics wall”.

#### 4) Progress anchor (quiet)
One small, low-contrast confirmation:
- “Last improvement shipped …”
- or “This week …”

---

## 6) Analytics spec (what goes in the Analytics menu)

### Analytics job
Answer:
1) **Where do people drop?**
2) **What drives actions?**
3) **What should I change next?**

### Time controls (simple)
Required:
- Range presets: **7d / 30d / 90d**
- Compare toggle: “vs previous period”

Avoid:
- complex date pickers and filter builders (can be phase 2)

### Analytics sections (progressive disclosure)

#### A) Overview (top)
- Views
- Completion rate
- Swipe depth (average frame reached or distribution)
- CTA clicks
- Shares
- Hearts (optional)

#### B) Per-Slyde breakdown
List + small bars, sortable by:
- Completion
- CTA clicks
- Shares

#### C) Frame drop-off (“the one chart that matters”)
For a selected Slyde:
- Frame-by-frame reach %
- “Biggest drop” highlight
- Suggested fix copy (plain English)

#### D) Action insights (not fancy)
Examples:
- “Your CTA frame is last, but most users drop at Frame 3 — shorten Frame 3.”
- “Shares up, completion down — hook is working, mid-frames are heavy.”

---

## 7) Metrics (allowed + aligned with docs)

### MVP Creator analytics (must match docs)
From `PAY-TIERS.md` + `MVP-MONETISATION.md`:
- **Views**
- **Swipe depth**
- **Completion rate**

### Additional behaviour metrics (allowed, keep simple)
From editor spec + build philosophy:
- **CTA clicks**
- **Drop-off points**
- **Shares per Slyde** (“sharing = belief”)
- **Hearts** as an **interest / reduced-risk signal**, not a social mechanic

### Not allowed / avoid
- Trending boards
- Social graphs (“who liked this”)
- “Top creators” / feeds
- CRM-style “leads pipeline”

---

## 8) Events & data vocabulary (implementation-aligned)

Use the event vocabulary already defined in `SLYDESBUILD.md`:
- `sessionStart` (slydeId, referrer)
- `frameView` (frameId, position, slydeId)
- `heartTap` (frameId, hearted)
- `faqOpen` (frameId)
- `shareClick` (platform, slydeId)
- `ctaClick` (frameId, ctaText, action)

Principle:
- **Track what users do**, not who they are.
- Keep it aggregatable and cheap.

---

## 9) Upgrade gating rules (Free vs Creator)

### Free plan
- Can see HQ nav including **Analytics**, but it is **locked**.
- Clicking Analytics triggers the **Analytics Access prompt**:
  - “Analytics are available on Creator… see swipe depth, drop-off, what works.” (align copy with `MVP-MONETISATION.md`)
  - CTA: **Unlock analytics**
  - Secondary: “Continue without analytics”

Inbox is not gated; it’s an allowed **enquiry capture + handoff** surface (not CRM).

### Creator plan
- Full Analytics access.
- No watermark (not an HQ feature, but must be consistently messaged).

Critical rule:
- Do **not** interrupt creation — gating happens at **intent moments** (clicking Analytics, creating a 2nd Slyde, etc.).

---

## 10) Design principles for “simple but special”

### The dashboard should feel:
- **Calm** (few blocks, big hierarchy)
- **Guided** (Action Center is the hero)
- **Fast** (no deep reading required)
- **Premium** (subtle depth, clean typography, light-first, Apple-style dark)

### Anti-patterns to avoid
- Too many cards
- Dense tables without clear “what now”
- Big chart walls
- Jargon (CPC, cohort, funnel stages) unless it’s hidden behind “Advanced”

---

## 11) Fact-check matrix (feature → doc alignment)

| Feature / Claim | Allowed? | Source |
|---|---:|---|
| Free vs Creator only | ✅ | `PAY-TIERS.md` |
| Analytics locked on Free | ✅ | `PAY-TIERS.md`, `MVP-MONETISATION.md` |
| Upgrade prompt when clicking Analytics | ✅ | `MVP-MONETISATION.md` Prompt #2 |
| Enquiry capture + inbox + export/webhooks | ✅ | `WHAT-WE-WILL-BUILD.md`, `what-we-will-never-build.md` |
| “Not a CRM” boundaries | ✅ | `what-we-will-never-build.md` |
| Hearts allowed as conversion signal (non-social) | ✅ | `WHAT-WE-WILL-BUILD.md`, `what-we-will-never-build.md` |
| “Sharing = belief” treated as key metric | ✅ | `MVP-MONETISATION.md` |
| Event names / analytics layer vocabulary | ✅ | `SLYDESBUILD.md` |
| Naming: Slyde/Frame/Profile | ✅ | `STRUCTURE.md` |

---

## 12) Rollout plan (HQ mock → product)

### Phase 0 — Mock polish (now)
- Add **Analytics** to HQ sidebar (locked on Free)
- Create `/hq-analytics` mock page:
  - Creator: shows simple, readable analytics
  - Free: blurred/locked with contextual upgrade

### Phase 1 — Event instrumentation (viewer)
- Implement `AnalyticsEvent` tracking in the Slyde experience (`SLYDESBUILD.md` vocabulary)
- Store aggregated daily metrics per Slyde/Frame (Supabase)

### Phase 2 — Read-only analytics UI (HQ)
- Analytics page reads aggregated tables
- Dashboard shows snapshot + Action Center suggestions

### Phase 3 — Insight + action loops (still simple)
- Auto-suggest “Fix drop-off” with direct deep-link into the editor at the weak Frame
- Keep suggestions limited and plain-English


