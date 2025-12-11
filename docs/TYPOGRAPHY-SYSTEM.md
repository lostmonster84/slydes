# Slydes Typography System

> **"Built for 2030"** 
> Our typography is bold, distinctive, and unmistakably modern.

**Last Updated**: December 11, 2025  
**Status**: Production Ready ✅

---

## 🎯 Typography Philosophy

### Why This Matters

Typography is **80% of our brand touchpoints**:
- Website copy
- Product UI
- Marketing materials  
- Documentation
- Email communications
- Social media graphics

**A strong font pairing creates:**
1. **Visual hierarchy** - guides eyes where we want them
2. **Brand recognition** - consistent = professional = trustworthy  
3. **Personality** - Space Grotesk = "future", Inter = "reliable"
4. **Readability** - right font for the right job

**Bad pairing = amateur. Good pairing = "this is a real company".**

---

## 🔤 The Font Pairing Strategy

### Display Font: Space Grotesk
**Use for**: Logo wordmark, headlines, section titles, CTAs, hero text

**Why it wins:**
- Highly distinctive geometric sans-serif
- "Space" in the name literally = "Built for 2030"
- Strong personality without being weird
- Geometric shapes match our Rising Cards logo mark
- Great for grabbing attention

**Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)

---

### Body Font: Inter
**Use for**: Paragraphs, descriptions, UI elements, navigation, forms

**Why it works:**
- Exceptional readability at all sizes
- Designed specifically for screens
- Professional and neutral
- Battle-tested by GitHub, Figma, Raycast
- Great for long-form text

**Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold), 800 (Extra-bold)

---

### Accent Font: JetBrains Mono
**Use for**: Code snippets, stats, labels, technical elements

**Why it completes the system:**
- Monospace = technical precision
- Modern and clean
- Great for numbers and data
- Adds variety without clashing

**Weight**: 500 (Medium)

---

## 📐 Typography Scale

### Hero Section
```
H1 - Hero Title
Font: Space Grotesk Bold (700)
Size: 56px-72px (mobile: 36px-48px)
Line Height: 1.1
Letter Spacing: -0.03em
Color: Future Black (#0A0E27)
Use: Main page headline only
```

### Section Titles
```
H2 - Section Heading
Font: Space Grotesk Bold (700)
Size: 40px-48px (mobile: 32px)
Line Height: 1.2
Letter Spacing: -0.02em
Color: Future Black (#0A0E27)
Use: Major section breaks
```

### Subsection Titles
```
H3 - Subsection Heading
Font: Space Grotesk Semi-bold (600)
Size: 28px-32px (mobile: 24px)
Line Height: 1.3
Letter Spacing: -0.01em
Color: Future Black (#0A0E27)
Use: Feature cards, content blocks
```

### Card/Component Titles
```
H4 - Card Title
Font: Space Grotesk Semi-bold (600)
Size: 20px-24px
Line Height: 1.4
Letter Spacing: -0.01em
Color: Future Black (#0A0E27)
Use: Cards, components, small sections
```

### Body Text
```
Paragraph - Large
Font: Inter Regular (400)
Size: 18px-20px
Line Height: 1.6
Color: Gray 600 (#52525B)
Use: Primary body copy, feature descriptions

Paragraph - Medium
Font: Inter Regular (400)
Size: 16px
Line Height: 1.6
Color: Gray 600 (#52525B)
Use: Standard body text, UI copy

Paragraph - Small
Font: Inter Regular (400)
Size: 14px
Line Height: 1.5
Color: Gray 500 (#71717A)
Use: Captions, helper text, footnotes
```

### UI Elements
```
Button Text
Font: Inter Semi-bold (600)
Size: 16px
Letter Spacing: 0
Use: Primary and secondary CTAs

Navigation Link
Font: Inter Medium (500)
Size: 14px-16px
Letter Spacing: 0
Use: Header navigation, footer links

Label
Font: Inter Medium (500)
Size: 12px-14px
Letter Spacing: 0.02em
Text Transform: Uppercase
Color: Gray 500 (#71717A)
Use: Form labels, tags, metadata
```

### Special Elements
```
Stats/Numbers
Font: JetBrains Mono Medium (500)
Size: Variable
Color: Leader Blue (#2563EB)
Use: Metrics, data points, pricing

Code
Font: JetBrains Mono Regular (400)
Size: 14px
Background: Gray 100 (#F4F4F5)
Color: Gray 800 (#27272A)
Use: API examples, technical docs
```

---

## 🎨 Tailwind CSS Classes

### Apply Typography in Code

```tsx
// Display Font (Space Grotesk) - Headlines
<h1 className="font-display text-6xl font-bold tracking-tight">

// Body Font (Inter) - Default, already applied
<p className="font-sans text-lg text-gray-600">

// Accent Font (JetBrains Mono) - Code/Stats  
<code className="font-mono text-sm bg-gray-100">
```

### Pre-defined Components

```tsx
// Hero Headline
<h1 className="font-display text-6xl md:text-7xl font-bold tracking-tight text-future-black">
  Built for 2030.
</h1>

// Section Title
<h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-future-black mb-4">
  Features
</h2>

// Feature Card Title
<h3 className="font-display text-2xl font-semibold tracking-tight text-future-black mb-2">
  TikTok-Style Scrolling
</h3>

// Body Text
<p className="text-lg text-gray-600 leading-relaxed">
  Mobile-first experiences that actually convert.
</p>

// CTA Button
<button className="font-sans font-semibold text-base px-6 py-3">
  Get Started
</button>
```

---

## 🚀 Implementation Checklist

### Files Updated ✅

- [x] `/src/lib/fonts.ts` - Added Space Grotesk import
- [x] `/src/app/layout.tsx` - Added font variable to HTML
- [x] `/tailwind.config.ts` - Added `font-display` utility
- [x] `/src/components/ui/Logo.tsx` - Using Space Grotesk

### Next Steps

- [ ] Update Hero section to use `font-display`
- [ ] Update all section headings (H2) to use `font-display`
- [ ] Audit all components for typography consistency
- [ ] Create reusable Typography components
- [ ] Add to Storybook/component library

---

## 📊 Usage Guidelines

### DO ✅

**Headlines & Titles** → Space Grotesk Bold (700)
- Hero headlines
- Section titles  
- Feature card titles
- CTA button text

**Body & UI** → Inter Regular (400-600)
- All paragraph text
- Navigation links
- Form inputs
- Descriptions
- UI elements

**Technical** → JetBrains Mono
- Code snippets
- Stats and metrics
- API documentation

### DON'T ❌

- ❌ Don't use Space Grotesk for long paragraphs (hard to read)
- ❌ Don't use Inter for the logo (not distinctive enough)
- ❌ Don't mix font weights randomly (stick to 400, 600, 700)
- ❌ Don't use more than 2 fonts in the same component
- ❌ Don't use decorative/script fonts (off-brand)

---

## 🔍 Real World Examples

### Homepage Hero
```tsx
<section className="py-20">
  <h1 className="font-display text-7xl font-bold tracking-tight text-future-black mb-6">
    Built for 2030.
  </h1>
  <p className="text-xl text-gray-600 max-w-2xl">
    Mobile-first experiences that actually convert. 
    TikTok-style vertical scrolling for businesses.
  </p>
  <button className="mt-8 bg-leader-blue text-white font-sans font-semibold px-8 py-4 rounded-xl">
    Get Started Free
  </button>
</section>
```

### Feature Section
```tsx
<section className="py-16">
  <h2 className="font-display text-5xl font-bold tracking-tight text-future-black mb-4">
    Why Slydes?
  </h2>
  <p className="text-lg text-gray-600 mb-12 max-w-2xl">
    Your customers are on mobile. Your site should be too.
  </p>
  
  <div className="grid grid-cols-3 gap-8">
    <div>
      <h3 className="font-display text-2xl font-semibold tracking-tight text-future-black mb-2">
        TikTok-Style Scrolling
      </h3>
      <p className="text-gray-600">
        Vertical swipe navigation your customers already know.
      </p>
    </div>
    {/* More cards... */}
  </div>
</section>
```

### Pricing Card
```tsx
<div className="bg-white rounded-2xl p-8 border border-gray-200">
  <h3 className="font-display text-2xl font-bold tracking-tight text-future-black mb-2">
    Founding Member
  </h3>
  <div className="flex items-baseline gap-2 mb-4">
    <span className="font-mono text-5xl font-bold text-leader-blue">$49</span>
    <span className="text-gray-500">/month</span>
  </div>
  <p className="text-gray-600 mb-6">
    Lock in lifetime access at launch pricing.
  </p>
  <button className="w-full bg-leader-blue text-white font-sans font-semibold py-3 rounded-lg">
    Join Waitlist
  </button>
</div>
```

---

## 🎯 Brand Consistency

### Typography = Brand Recognition

**Consistent use of Space Grotesk + Inter creates:**
- Professional polish
- Instant brand recognition
- Clear visual hierarchy
- Trust and credibility

**Examples of brands with strong typography:**
- **Stripe** (Söhne custom) - Premium, trustworthy
- **Vercel** (Geist custom) - Clean, modern
- **Linear** (Custom geometric) - Precise, efficient

**We're joining that tier with Space Grotesk.**

---

## 📈 Performance Notes

### Font Loading Strategy

**Current setup** (in `/src/lib/fonts.ts`):
```ts
// Using Next.js font optimization
// Fonts are self-hosted via Google Fonts CDN
// display: 'swap' prevents flash of unstyled text
// Variable fonts reduce file size
```

**Load times:**
- Space Grotesk: ~30KB (4 weights)
- Inter: ~40KB (variable font)
- JetBrains Mono: ~25KB

**Total**: ~95KB for complete typography system (acceptable)

---

## 🔄 Version History

**v1.0** (Dec 11, 2025)
- Initial typography system established
- Space Grotesk + Inter pairing
- Complete scale and guidelines
- Logo updated to Space Grotesk

---

## 🚀 Quick Reference Card

**Copy this for easy reference:**

```
DISPLAY (Headings/Logo):
→ Space Grotesk Bold (700)
→ Use: H1, H2, H3, Logo, CTAs

BODY (Text/UI):
→ Inter Regular (400-600)  
→ Use: Paragraphs, navigation, forms

ACCENT (Code/Stats):
→ JetBrains Mono Medium (500)
→ Use: Numbers, code, labels

COLORS:
→ Headlines: Future Black (#0A0E27)
→ Body: Gray 600 (#52525B)
→ Light: Gray 500 (#71717A)
```

---

**Remember**: Typography is 80% of our visual brand. Use it consistently, use it confidently.

**Built for 2030.** 🚀
