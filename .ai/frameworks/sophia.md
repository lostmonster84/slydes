# SOPHIA Framework

> **Universal Design & UX Assessment Framework**
> Sophisticated Objective Principles for Human Interface Assessment

## What is SOPHIA?

**S**ophisticated **O**bjective **P**rinciples for **H**uman **I**nterface **A**ssessment

A comprehensive design and UX audit framework that evaluates interfaces across 8 key dimensions using objective, measurable criteria.

## SOPHIA Dimensions

### 1. Typography (0-15 points)
**Evaluates:** Font sizing, hierarchy, consistency, readability

**Standards:**
- **Page headings (H1):** 30-48px max (text-3xl to text-5xl)
- **Section headings (H2):** 18-24px (text-lg to text-2xl)
- **Card headings (H3):** 16-20px (text-base to text-xl)
- **Body text:** 14-16px (text-sm to text-base)
- **Metadata/labels:** 10-12px (text-[10px] to text-xs)
- **Stat numbers:** 20-36px (text-xl to text-4xl)

**Scoring:**
- ✅ Perfect sizing: 15/15
- ⚠️ Minor violations: 12-14/15
- ❌ Major violations: 8-11/15

**Common Violations:**
- H1 > 60px (text-6xl+)
- H2 > 30px (text-3xl+)
- Inconsistent sizing across similar elements
- Body text < 14px

### 2. Spacing (0-15 points)
**Evaluates:** Padding, margins, gaps, scroll economy

**Standards:**
- **Section padding:** 24-32px (py-6 to py-8)
- **Card padding:** 12-16px (p-3 to p-4)
- **Gaps between elements:** 16-24px (gap-4 to gap-6)
- **Hero heights:** 500-600px (h-[500px] to h-[600px])
- **8pt grid system:** All spacing multiples of 8px

**Scoring:**
- ✅ Perfect spacing: 15/15
- ⚠️ Minor excess: 13-14/15
- ❌ Excessive padding: 10-12/15

**Common Violations:**
- Section padding > 64px (py-16+)
- Card padding > 24px (p-6+)
- Hero height > 700px
- Inconsistent spacing (not 8pt grid)

### 3. Touch Targets (0-10 points)
**Evaluates:** Button sizes, clickable areas, mobile usability

**Standards:**
- **Minimum touch target:** 44px × 44px (h-11)
- **Buttons:** 44-56px height (h-11 to h-14)
- **Icon buttons:** 44px minimum
- **Form inputs:** 44px+ height
- **Spacing between targets:** 8px minimum

**Scoring:**
- ✅ All targets ≥ 44px: 10/10
- ⚠️ Some < 44px: 7-9/10
- ❌ Many < 44px: 4-6/10

**Common Violations:**
- Buttons < 44px height
- Icon buttons < 44px
- Form inputs < 44px
- Targets too close together (< 8px)

### 4. Information Density (0-15 points)
**Evaluates:** Content organization, scroll economy, screen efficiency

**Standards:**
- **Scroll economy:** 2-3 screens for main content
- **Content per screen:** Appropriate amount (not too sparse, not overwhelming)
- **Visual breathing room:** Balanced whitespace
- **Progressive disclosure:** Complex info revealed gradually

**Scoring:**
- ✅ 2-3 screens, well-organized: 15/15
- ⚠️ 3-4 screens: 13-14/15
- ❌ 4+ screens, poor organization: 10-12/15

**Common Violations:**
- Requires 4+ screens of scrolling
- Too much whitespace (sparse content)
- Too dense (overwhelming)
- Poor content hierarchy

### 5. Visual Hierarchy (0-15 points)
**Evaluates:** Emphasis, color usage, importance indication

**Standards:**
- **Clear primary focus:** One main element per section
- **Color hierarchy:** Primary actions use brand color
- **Size hierarchy:** Important elements larger
- **Contrast:** Sufficient for readability (4.5:1 minimum)
- **Urgency/scarcity:** Visual indicators when appropriate

**Scoring:**
- ✅ Clear hierarchy, good emphasis: 15/15
- ⚠️ Minor hierarchy issues: 12-14/15
- ❌ Unclear hierarchy: 8-11/15

**Common Violations:**
- No clear primary focus
- All elements same size/color
- Missing urgency indicators
- Poor contrast ratios

### 6. Sophistication (0-10 points)
**Evaluates:** Design polish, attention to detail, refinement

**Standards:**
- **Consistent design language:** Unified visual style
- **Subtle animations:** Smooth transitions (200-300ms)
- **Micro-interactions:** Hover states, feedback
- **Visual polish:** Shadows, borders, gradients used appropriately
- **No generic elements:** Custom, branded components

**Scoring:**
- ✅ Highly polished, custom: 9-10/10
- ⚠️ Good polish, minor generic: 7-8/10
- ❌ Generic design, minimal polish: 4-6/10

**Common Violations:**
- Generic stock imagery
- No animations/transitions
- Inconsistent visual style
- Missing hover states
- Overly bold borders (2px+)

### 7. Consistency (0-10 points)
**Evaluates:** Pattern reuse, component consistency, design system adherence

**Standards:**
- **Component reuse:** Same components used consistently
- **Spacing consistency:** Same spacing for similar elements
- **Typography consistency:** Same sizes for same element types
- **Color consistency:** Brand colors used consistently
- **Pattern consistency:** Similar interactions work similarly

**Scoring:**
- ✅ Highly consistent: 9-10/10
- ⚠️ Minor inconsistencies: 7-8/10
- ❌ Many inconsistencies: 4-6/10

**Common Violations:**
- Different spacing for similar sections
- Inconsistent heading sizes
- Different border styles
- Inconsistent button styles

### 8. Accessibility (0-10 points)
**Evaluates:** WCAG compliance, keyboard navigation, screen reader support

**Standards:**
- **Keyboard navigation:** All interactive elements accessible
- **Screen readers:** ARIA labels, semantic HTML
- **Color contrast:** 4.5:1 minimum (WCAG AA)
- **Focus indicators:** Visible focus states
- **Alt text:** Images have descriptive alt text

**Scoring:**
- ✅ WCAG AA compliant: 10/10
- ⚠️ Minor issues: 8-9/10
- ❌ Major accessibility gaps: 4-7/10

**Common Violations:**
- Missing ARIA labels
- Poor color contrast
- No keyboard navigation
- Missing focus indicators
- Images without alt text

## SOPHIA Scoring System

**Total Score: 0-100 points**

**Rating Levels:**
- **90-100:** Exceptional (World-class quality)
- **85-89:** Sophisticated (High quality, polished)
- **75-84:** Good (Solid, professional)
- **65-74:** Acceptable (Functional but needs improvement)
- **Below 65:** Needs Work (Significant issues)

**Target Score:** 85+ (Sophisticated quality)

## SOPHIA Audit Process

### Step 1: Component Analysis
1. Identify all major components/sections
2. Score each component individually
3. Note specific violations with line numbers

### Step 2: Page-Level Scoring
1. Calculate weighted average of components
2. Consider page-level issues (navigation, footer)
3. Calculate overall page score

### Step 3: Recommendations
1. Prioritize fixes by impact (points gained)
2. Identify quick wins (high impact, low effort)
3. Create implementation roadmap

### Step 4: Re-audit
1. After fixes, re-score components
2. Track improvement (before/after scores)
3. Verify target score achieved

## Quick Reference: Common Fixes

### Typography Fixes
```tsx
// ❌ TOO LARGE
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">  // 36-72px
<h2 className="text-2xl sm:text-3xl md:text-4xl">  // 24-36px

// ✅ SOPHIA STANDARD
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">  // 30-60px MAX
<h2 className="text-lg md:text-xl">  // 18-20px
```

### Spacing Fixes
```tsx
// ❌ EXCESSIVE
<section className="py-16 md:py-20">  // 64-80px
<div className="p-6 md:p-8">  // 24-32px

// ✅ SOPHIA STANDARD
<section className="py-6 md:py-8">  // 24-32px
<div className="p-4">  // 16px
```

### Border Fixes
```tsx
// ❌ TOO BOLD
<div className="border-2">  // 2px

// ✅ SOPHIA STANDARD
<div className="border">  // 1px
```

## Integration with Other Frameworks

### CODA + SOPHIA
- **CODA:** Plan the feature (Context → Objective → Details → Acceptance)
- **SOPHIA:** Evaluate design quality (8 dimensions, objective scoring)

### AIDA + SOPHIA
- **AIDA:** Structure content (Attention → Interest → Desire → Action)
- **SOPHIA:** Ensure design quality (Typography, Spacing, Hierarchy, etc.)

### Together
- **CODA:** How to build it
- **AIDA:** What content to include
- **SOPHIA:** How good is the design

## SOPHIA Checklist

**For Every Component:**

**Typography:**
- [ ] H1 ≤ 60px (text-6xl max)
- [ ] H2 ≤ 24px (text-2xl max)
- [ ] Body text ≥ 14px
- [ ] Consistent sizing across similar elements

**Spacing:**
- [ ] Section padding ≤ 32px (py-8 max)
- [ ] Card padding ≤ 16px (p-4 max)
- [ ] Follows 8pt grid
- [ ] Hero height ≤ 600px

**Touch Targets:**
- [ ] All buttons ≥ 44px height
- [ ] Form inputs ≥ 44px height
- [ ] Spacing between targets ≥ 8px

**Information Density:**
- [ ] Content fits in 2-3 screens
- [ ] Appropriate whitespace
- [ ] Clear content hierarchy

**Visual Hierarchy:**
- [ ] Clear primary focus
- [ ] Color contrast ≥ 4.5:1
- [ ] Size indicates importance
- [ ] Urgency/scarcity indicators when needed

**Sophistication:**
- [ ] Consistent design language
- [ ] Smooth animations (200-300ms)
- [ ] Hover states present
- [ ] Custom, branded elements

**Consistency:**
- [ ] Same spacing for similar elements
- [ ] Same typography for same element types
- [ ] Consistent component patterns

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Focus indicators visible
- [ ] Images have alt text

## Summary

**SOPHIA = Objective design quality assessment**

Use SOPHIA to:
- Audit design quality objectively
- Identify specific violations
- Prioritize improvements
- Track quality improvements
- Ensure consistent design standards

**Key Philosophy:**
*"Measure design quality objectively across 8 dimensions. Score, fix, re-score. Continuous improvement through data-driven design."*











