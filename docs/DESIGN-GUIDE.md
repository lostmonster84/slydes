# Slydes Design Guide

> **"NO AI SLOP"** - Every element earns its place.
>
> This guide documents our design journey and the principles we learned the hard way.
> Reference this before building ANY UI.

---

## The Journey

### Phase 1: Apple 1.0
- Clean but boring
- White backgrounds, basic layout
- No animations, no life
- **Problem**: Felt like a template

### Phase 2: AI Slop (The Mistake)
- Added floating bubbles everywhere
- Gradient colored blocks (01, 02, 03)
- 6 feature cards with icons
- Multiple scroll indicators
- Everything animated
- **Problem**: Looked like every AI-generated website

### Phase 3: Refined (Where We Are)
- Gradient TEXT only (not blocks)
- Subtle background breathing
- Scroll-triggered animations
- Minimal, considered elements
- **Result**: Premium, not template

---

## Golden Rules

### 1. Gradient Text = YES, Gradient Blocks = NO
```css
/* GOOD - Gradient on text */
.gradient-text {
  background: linear-gradient(135deg, #0A0E27 0%, #2563EB 50%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* BAD - Gradient colored squares */
<div className="bg-gradient-to-br from-blue-500 to-cyan-500">01</div>
```

### 2. Subtle Background = YES, Floating Shapes = NO
```tsx
/* GOOD - Subtle gradient background */
<section className="bg-gradient-to-br from-white via-blue-50/40 to-purple-50/30">

/* BAD - Floating bubbles */
<div className="absolute animate-float-slow rounded-full bg-blue-500/10" />
```

### 3. One Scroll Indicator Maximum
If the phone mockup has a scroll indicator inside it, don't add another one below.

### 4. If You Need 6 Icons, You Need 0
**UPDATE: NO ICONS AT ALL. PERIOD. BANNED.**
- No emoji (👋 🚗 📱)
- No SVG icons  
- No icon fonts
- ZERO icons
- Text only, or nothing

Use words instead. Words are clear. Icons are generic AI bullshit.

### 5. Center Things That Should Be Centered
Phone mockup content, section headlines, form elements - check alignment.

### 6. Every Element Must Earn Its Place
Before adding anything, ask: "Does this help the user convert?"
If not, remove it.

---

## What Works

### Animations (Approved)

**Scroll-triggered fade-in:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.3 }}
>
```

**Staggered children:**
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
```

**Button pulse glow (primary CTA only):**
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
  50% { box-shadow: 0 0 20px 5px rgba(37, 99, 235, 0.2); }
}
```

**Subtle breathing (phone mockup):**
```css
@keyframes breathe {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
```

**Background gradient shift:**
```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Visual Elements (Approved)

- Gradient text on key headlines
- Subtle background gradients (white → blue-50 → purple-50)
- Grid pattern overlay at very low opacity (0.015)
- Phone mockups showing real product
- Dark section for contrast (Founders Club)
- Pulsing dot on badges/status indicators

---

## What Doesn't Work

### Animations (Banned)

- Floating shapes/bubbles
- Multiple scroll indicators
- Parallax on everything
- Hover animations on every element
- Auto-playing carousels

### Visual Elements (Banned)

- Gradient colored number blocks (01, 02, 03)
- Icon grids (6+ icons)
- Floating decorative shapes
- Multiple competing CTAs
- Stock photo vibes
- Generic "Everything you need" sections with icons

### Copy (Banned)

- "Everything you need" with icon grid
- Generic feature lists
- Marketing fluff without specifics
- Multiple headlines competing for attention

---

## AIDA Quick Check

Before shipping any page, score each section:

### Attention (Hero)
- [ ] Clear headline with gradient text
- [ ] One primary CTA
- [ ] Product visible (phone mockup)
- [ ] No competing elements
- [ ] Score: __/10

### Interest (Features/How It Works)
- [ ] Specific, not generic copy
- [ ] Minimal icons (0-2 max)
- [ ] Clean layout, breathing room
- [ ] Scroll animations working
- [ ] Score: __/10

### Desire (Social Proof/Benefits)
- [ ] Real testimonials (not generic)
- [ ] Specific numbers/stats
- [ ] Addresses objections
- [ ] Builds trust
- [ ] Score: __/10

### Action (CTA/Pricing)
- [ ] Clear price
- [ ] Urgency element (spots remaining)
- [ ] Trust indicators
- [ ] Single focused CTA
- [ ] Score: __/10

**Target**: 7+/10 on each section before shipping.

---

## Color Reference

```
Future Black:  #0A0E27
Leader Blue:   #2563EB
Electric Cyan: #06B6D4
Pure White:    #FFFFFF

Backgrounds:
- White sections: bg-white
- Subtle blue: bg-blue-50/30 or via-blue-50/40
- Subtle purple: bg-purple-50/20
- Dark sections: bg-future-black
```

---

## Typography

- Headlines: Bold, gradient text on key words
- Body: Gray-600, relaxed leading
- Small text: Gray-500
- Links: Leader Blue with underline on hover

---

## Spacing

- Section padding: py-24 (desktop), py-16 (mobile)
- Max width: max-w-6xl for content
- Gap between elements: gap-8 to gap-12
- Don't over-space - whitespace is earned, not default

---

## Mobile Considerations

- Center text on mobile, left-align on desktop (lg:text-left)
- Scale down phone mockups (scale-75 md:scale-90 lg:scale-100)
- Full-width buttons on mobile (w-full sm:w-auto)
- Hide decorative elements on mobile if they crowd
- Test at 390px width (iPhone 14)

---

## Pre-Ship Checklist

1. [ ] AIDA scored 7+ on all sections
2. [ ] No floating bubbles/shapes
3. [ ] No gradient blocks (only gradient text)
4. [ ] Maximum 2 icons on the page
5. [ ] One scroll indicator only
6. [ ] All elements centered that should be
7. [ ] Scroll animations trigger correctly
8. [ ] Mobile layout tested
9. [ ] Copy is specific, not generic
10. [ ] Would I say "fuck, this is cool"?

---

*Last updated: December 11, 2025*
*Rule #1: NO AI SLOP*

