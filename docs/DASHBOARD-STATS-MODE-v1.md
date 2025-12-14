# Slydes Dashboard – Stats Mode (v1.1)

Purpose:
Stats Mode exists to explain **what is happening and why**.
It provides context, patterns, and confidence.
It does not provide recommendations or next actions.

Stats Mode is opt-in and accessed via a lens toggle.
Default dashboard mode remains Momentum.

---

## Core Design Principle

**Stats Mode is GLOBAL-first — aggregate across ALL Slydes.**

All primary metrics show the combined picture.

Allowed: **Contributor context**, if it is clearly labelled and defined (e.g., “Top contributors”).
This exists to answer the user’s next question: “Okay, but which Slyde is causing this?”

Rule: Contributor context must never replace the global metric; it sits underneath it.
This answers: "What is the shape of performance across my Slydes?"

Stats Mode is observational, not directive.

---

## Layout Overview

Stats Mode uses a **2x2 grid** with a top metrics row.
Each panel answers a distinct question.

**Top Metrics Row (4 cards):**
- Total starts
- Completion rate
- CTA clicks
- Bounce rate

**2x2 Grid:**
1. Traffic Sources
2. Drop-off Shape
3. CTA Performance
4. User Flow

The layout remains consistent across devices.
On mobile, frames stack vertically in the same order.

---

## Panel 1: Traffic Sources

### Question Answered
**Where is attention coming from?**

### Metrics Shown (GLOBAL — aggregate across all Slydes)
- Total starts (e.g., "1,240")
- Starts by source with progress bars:
  - QR
  - Bio links
  - Ads
  - Direct
  - Referral
- Source distribution (% of total starts)

### Explicitly Excluded
- Total impressions
- Reach
- Vanity traffic totals
- Per-Slyde source breakdown

### Purpose
Help creators decide where to focus traffic generation efforts.
This panel supports strategic decisions, not optimisation.

---

## Panel 2: Drop-off Shape

### Question Answered
**When do people leave?**

### Metrics Shown (GLOBAL — aggregate across all Slydes)
- Drop-off by journey stage:
  - Early (Frame 1–2): % of all drop-offs
  - Mid (Frame 3–4): % of all drop-offs
  - Late (Frame 5+): % of all drop-offs
- Footer note: "% of all drop-offs that occur at each stage"
 - Optional (recommended): **Top contributors** per stage (by Slyde), with explicit definition:
   - “% of ALL drop-offs that happen in this stage AND in this Slyde”

### Explicitly Excluded
- Specific frame names inside drop-off (too granular / encourages blame-by-frame)
- Time on page
- Funnel charts

### Purpose
Reveal the shape of attention decay across ALL Slydes.
This panel validates content structure and pacing at a system level.

---

## Panel 3: CTA Performance

### Question Answered
**What actions do people take?**

### Metrics Shown
- Clicks by Slyde (list with click count + rate per Slyde)
- Best performing CTA (highlighted card with text, clicks, rate) **and it must include the Slyde + frame label where it lives**
- Click rate by traffic source (which source converts best)

### Explicitly Excluded
- Per-frame CTA breakdown (too granular for global view)
- Revenue
- Leads
- Conversion value unless end-to-end attribution exists

### Purpose
Show where attention converts into intent.
This panel provides proof of value without overclaiming outcomes.

---

## Panel 4: User Flow

### Question Answered
**How is the system actually used?**

### Metrics Shown (GLOBAL — aggregate patterns)
- Top entry Slyde (most common first Slyde viewed)
- Top exit Slyde (most common last Slyde viewed)
- Most skipped position (e.g., "Frame 4" — across all Slydes)
- Most revisited position (e.g., "Frame 5" — across all Slydes)
- Avg frames per session (e.g., "4.3")
- Typical journey path (e.g., Profile → Camping → Availability)

### Explicitly Excluded
- Individual user journeys
- Session replays
- Highly granular path trees
- Per-Slyde flow breakdowns

### Purpose
Reveal behavioural patterns across the whole system.
This panel helps creators understand structural alignment with user intent.

---

## Design & Interaction Rules

- Stats Mode never shows recommendations
- Stats Mode never tells users what to do
- No arrows, deltas, or “improvement” language
- No alerts or warnings
- No dismissible elements
- No filters in v1

Stats Mode is calm, factual, and stable.

---

## Relationship to Momentum Mode

- Momentum Mode = direction and action
- Stats Mode = understanding and context

The two modes share data, not meaning.

---

## Success Criteria

Stats Mode is successful if:
- users spend time understanding patterns
- creators reference it to explain outcomes
- it informs strategy without creating paralysis

If users ask “what should I do next?” while in Stats Mode,
the separation has failed.

---

## One-Line Rule

Stats Mode shows reality.  
Momentum Mode drives change.


