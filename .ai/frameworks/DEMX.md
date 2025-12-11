# DEMX

> **Demo eXplorer - Rapid Design Variation System**
> One command triggers 5 live variations with AIDA scoring on a demo page.

---

## What is DEMX?

**DEMX** (Demo + eXplorer) is a single-word trigger that instantly generates 5 distinct design variations of any UI element, scores each with AIDA, and builds a live, interactive demo page for comparison.

**The Problem It Solves:**
- Design decisions stall waiting for feedback
- Variations get discussed but never visualized
- Comparing abstract ideas is harder than comparing live implementations
- Picking "the best" design is subjective without scoring criteria

**DEMX solves this by:**
- Creating 5 tangible variations you can see and interact with
- Scoring each objectively using AIDA (0-40 total)
- Building a live demo page at `/demo/[feature]-variations/`
- Recommending the winner with clear reasoning
- Enabling fast, confident design decisions

---

## When to Use DEMX

### Use DEMX When:
- Exploring visual approaches for a UI element
- Redesigning existing components
- Deciding between layout options
- Creating hero sections, cards, navigation, CTAs
- The user wants to "see options" before committing
- Any design decision where multiple approaches are valid

### Don't Use DEMX When:
- Bug fixes (just fix it)
- Copy/content changes only (no visual variation needed)
- Exact specifications already provided (just implement)
- Backend/API work (no visual component)
- Simple color/spacing tweaks (just adjust)

---

## Trigger Syntax

```
DEMX: [target element]
```

**Examples:**
```
DEMX: hero section
DEMX: vehicle card
DEMX: navigation header
DEMX: pricing table
DEMX: testimonial carousel
DEMX: CTA button group
```

---

## The 5-Step DEMX Process

### Step 1: Micro-Context Check
Confirm what I'm creating variations of in 1-2 sentences.

```
"Creating 5 variations of the vehicle card component -
focusing on layout, information hierarchy, and CTA placement."
```

**Purpose:** Prevent wasted effort, ensure alignment before building.

---

### Step 2: Generate 5 Variations
Create 5 **dramatically different** design approaches. Not subtle tweaks - distinct visual and structural explorations.

**Variation Types:**
| # | Approach | Description |
|---|----------|-------------|
| 1 | **Minimal** | Clean, essential elements only |
| 2 | **Rich** | Information-dense, feature-heavy |
| 3 | **Visual** | Image/media-forward, less text |
| 4 | **Interactive** | Animation, hover states, engagement |
| 5 | **Bold** | Strong typography, high contrast, statement |

These are starting points - adapt based on the target element.

---

### Step 3: Score with AIDA
Score each variation using the AIDA framework (0-10 per dimension, 40 total).

| Dimension | What It Measures | Scoring Criteria |
|-----------|------------------|------------------|
| **Attention** | Does it grab attention immediately? | Visual impact, headline strength, first impression |
| **Interest** | Does it build curiosity and engagement? | Information clarity, benefit communication, relevance |
| **Desire** | Does it create emotional want? | Aspirational imagery, social proof, exclusivity |
| **Action** | Is the CTA clear and compelling? | Button prominence, friction reduction, next step clarity |

**Score Interpretation:**
| Score | Rating | Meaning |
|-------|--------|---------|
| 36-40 | Excellent | Ship it |
| 30-35 | Good | Minor refinements |
| 24-29 | Acceptable | Needs iteration |
| <24 | Weak | Reconsider approach |

---

### Step 4: Build Demo Page
Create a live, interactive demo page at `/demo/[feature]-variations/`.

**Required Elements:**

```
┌─────────────────────────────────────────────────────────────────┐
│ FIXED HEADER                                                     │
│ ← Back to Demos    [Title] Variations    [1] [2] [3] [4] [⭐5]  │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────┬────────────────────────────────┐
│                                │                                │
│   LIVE PREVIEW                 │   VARIATION DETAILS            │
│   (600px height)               │   ├─ Name                      │
│                                │   ├─ Description               │
│   [Interactive component       │   └─ Design Reasoning          │
│    renders here]               │                                │
│                                │   AIDA SCORES                  │
│                                │   ├─ Attention: 8/10 ████████  │
│                                │   ├─ Interest:  7/10 ███████   │
│                                │   ├─ Desire:    9/10 █████████ │
│                                │   ├─ Action:    8/10 ████████  │
│                                │   └─ Total: 32/40              │
│                                │                                │
└────────────────────────────────┴────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ QUICK COMPARISON                                                 │
│ [Var 1: 28] [Var 2: 31] [Var 3: 29] [Var 4: 33] [⭐Var 5: 36]   │
└─────────────────────────────────────────────────────────────────┘
```

**Technical Specs:**
- Dark theme: `bg-wildtrax-black` with `white/5`, `white/10` overlays
- Accent color: British Racing Red `#c41e3a` (`bg-wildtrax-red`)
- Animated score bars: Framer Motion with 0.8s duration, 0.2s stagger
- Recommended indicator: ⭐ badge on highest-scoring variation
- Fixed header with back link, title, variation selector buttons
- Two-column layout: live preview (left) + metadata/scores (right)

---

### Step 5: Recommend Winner
Present the highest-scoring variation with clear reasoning.

```
**Recommendation: Variation 5 (Bold)**
Score: 36/40

Why this wins:
- Attention (9): Strong typographic hierarchy immediately draws eye
- Interest (8): Clear benefit communication without clutter
- Desire (9): Aspirational imagery creates emotional connection
- Action (10): CTA is unmissable, friction-free

Trade-offs:
- Less information density than Variation 2
- Requires strong hero image (won't work with weak photography)
```

---

## Demo Page Code Pattern

Reference implementation: `src/app/demo/timeline-sexy-variations/page.tsx`

**Data Structure:**
```tsx
interface VariationData {
  id: string
  name: string
  description: string
  component: React.ComponentType<any>
  scores: {
    attention: number  // 0-10
    interest: number   // 0-10
    desire: number     // 0-10
    action: number     // 0-10
  }
  reasoning: string
}
```

**AIDA Score Display:**
```tsx
<div className="bg-white/5 rounded-xl p-6 border border-white/10">
  <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">
    AIDA Framework Score
  </h3>
  <div className="space-y-4">
    {Object.entries(variation.scores).map(([key, value]) => (
      <div key={key}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium capitalize">{key}</span>
          <span className="text-sm font-bold text-wildtrax-red">{value}/10</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-wildtrax-red"
            initial={{ width: 0 }}
            animate={{ width: `${value * 10}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>
    ))}
  </div>
  <div className="mt-6 pt-6 border-t border-white/10">
    <div className="flex items-center justify-between">
      <span className="font-bold">Total Score</span>
      <span className="text-2xl font-bold text-wildtrax-red">
        {Object.values(variation.scores).reduce((a, b) => a + b, 0)}/40
      </span>
    </div>
  </div>
</div>
```

---

## Integration with Other Frameworks

### DEMX + CODA
```
CODA: Plan WHAT to build
DEMX: Explore HOW it should look
```
Use CODA first to define the feature, then DEMX to explore visual approaches.

### DEMX + SOPHIA
```
DEMX: Generate 5 variations with AIDA scores
SOPHIA: Deep audit of chosen variation (85+ target)
```
DEMX for rapid exploration, SOPHIA for quality verification of the winner.

### DEMX + AIDA
DEMX uses AIDA scoring internally. If you need deeper content analysis, run full AIDA (0-100 scale) on the chosen variation.

### DEMX + Design Variations
DEMX **replaces** the manual Design Variations workflow. They serve the same purpose - DEMX is the automated, trigger-word version.

---

## Workflow Example

**User Input:**
```
DEMX: vehicle card
```

**My Response:**

1. **Micro-Context Check:**
   "Creating 5 variations of the vehicle card for the fleet page - exploring layout, image treatment, pricing display, and CTA placement."

2. **Build & Score:** [Creates 5 variations, builds demo page]

3. **Output:**
   "Demo page ready at `/demo/vehicle-card-variations/`

   **Recommendation: Variation 3 (Visual)**
   Score: 34/40

   Strongest in Desire (9/10) - full-bleed imagery creates immediate want.
   CTA placement tested best for Action (8/10).

   View all 5 variations and scores at the demo page."

4. **User Reviews:** Visits demo page, interacts with variations, sees scores

5. **User Decides:** "Let's go with Variation 3"

6. **Implementation:** Apply chosen design to production

---

## Summary

**DEMX = One word → 5 variations → AIDA scores → Live demo → Pick winner**

Use DEMX to:
- Rapidly explore design directions
- Make objective design decisions
- See options before committing
- Eliminate design decision paralysis

**Key Philosophy:**
*"Don't discuss designs - build them. Don't guess which is best - score them."*

---

**Framework Status:** Production-ready
**Last Updated:** 2025-12-10
**Version:** 1.0
