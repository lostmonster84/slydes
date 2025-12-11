# Slydes Design System

> **"Built for 2030"** 
> Our design is bold, modern, and unmistakably premium.

**Last Updated**: December 11, 2025  
**Status**: Production Ready ✅

---

## 📐 Design Philosophy

### Core Principles

1. **Mobile-First Always** - We sell mobile experiences, we design mobile-first
2. **Show, Don't Tell** - Use real mockups, not screenshots or illustrations
3. **Premium but Approachable** - Clean, modern, confident, not cold
4. **Consistent Visual Language** - Rising Cards logo + Space Grotesk + clean layouts
5. **Built for 2030** - Forward-thinking, not incremental

---

## 🎨 Brand Colors

### Primary Palette

```
FUTURE BLACK (Authority & Premium)
Hex: #0A0E27
RGB: 10, 14, 39
Use: Logo, headlines, primary text
Psychology: Leadership, sophistication, "we're the standard"

LEADER BLUE (Innovation & Trust)
Hex: #2563EB
RGB: 37, 99, 235
Use: Primary CTAs, interactive elements, accents
Psychology: Forward-thinking, trustworthy, "follow us"

PURE WHITE (Clarity)
Hex: #FFFFFF
RGB: 255, 255, 255
Use: Backgrounds, contrast, clean space
Psychology: Clean, modern, "the future is clear"
```

### Secondary Colors

```
ELECTRIC CYAN (Energy & Motion)
Hex: #06B6D4
RGB: 6, 182, 212
Use: Hover states, highlights, progress indicators
Psychology: Dynamic, moving forward, "we're in motion"

STEEL GRAY (Balance)
Hex: #64748B
RGB: 100, 116, 139
Use: Secondary text, borders, subtle UI
Psychology: Professional, clean, not in your face

DEEP SLATE (Depth)
Hex: #1E293B
RGB: 30, 41, 59
Use: Card backgrounds, sections, layering
Psychology: Depth, sophistication, premium
```

### Gradient Usage

**Primary Gradient** (Hero, CTAs):
```css
background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);
```

**Text Gradient** (Headlines):
```css
background: linear-gradient(135deg, #0A0E27 0%, #2563EB 50%, #06B6D4 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 🔤 Typography

See `/docs/TYPOGRAPHY-SYSTEM.md` for complete typography guidelines.

**Quick Reference:**
- **Display** (Headlines): Space Grotesk Bold
- **Body** (Text/UI): Inter Regular
- **Accent** (Code/Stats): JetBrains Mono

---

## 📱 Mobile Mockup Pattern

### The Standard

**When to use:** Showcasing product features, case studies, or examples

**Structure:**
```
┌─────────────────────────────────────┐
│  CONTENT (Left)                     │  MOCKUP (Right)
│  ├─ Small label (uppercase)         │  ┌──────────────┐
│  ├─ H2 Headline                     │  │   Phone      │
│  ├─ Body paragraph                  │  │   Frame      │
│  ├─ Bullet points with checkmarks   │  │   Device     │
│  └─ Quote card (optional)           │  │   Mockup     │
│                                     │  └──────────────┘
└─────────────────────────────────────┘
```

### Implementation Example

**From SocialProof.tsx** (Case Study Section):

```tsx
<div className="grid md:grid-cols-2 gap-12 items-center">
  {/* Left: Content */}
  <div>
    <div className="text-sm text-leader-blue font-semibold mb-4 uppercase tracking-wide">
      Case Study
    </div>
    <h3 className="text-2xl font-bold mb-4">
      WildTrax built their mobile experience in <span className="gradient-text">under an hour</span>
    </h3>
    <p className="text-gray-600 mb-6">
      Instead of spending months on a custom mobile app, WildTrax used Slydes 
      to create an immersive vehicle showcase that works on every phone.
    </p>
    
    {/* Bullet points */}
    <div className="space-y-3 mb-8">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-leader-blue" /* checkmark icon */>
        <span className="text-gray-700">Full-screen video vehicle tours</span>
      </div>
      {/* More bullets... */}
    </div>

    {/* Quote card */}
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
      <div className="text-base font-semibold text-gray-900 mb-3">
        "Our customers love the TikTok-style browsing. Way better than our old mobile site."
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">WildTrax 4x4</span> • Highland vehicle rental company
      </div>
    </div>
  </div>

  {/* Right: Mobile Mockup */}
  <div className="relative flex justify-center">
    <div className="relative w-[280px] h-[570px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
      
      {/* Screen content */}
      <div className="relative w-full h-full bg-gray-100 rounded-[2.5rem] overflow-hidden">
        {/* Your actual mobile UI preview here */}
      </div>
    </div>
  </div>
</div>
```

### Mobile Mockup Specs

**Device Frame:**
- Width: 280px
- Height: 570px
- Border radius: 3rem (48px)
- Background: Gray 900 (#18181B)
- Padding: 12px (0.75rem)
- Shadow: `shadow-2xl`

**Notch:**
- Width: 128px (8rem)
- Height: 24px (1.5rem)
- Position: Absolute top center
- Border radius bottom: 2xl (1rem)
- Z-index: 10

**Screen:**
- Width: 100%
- Height: 100%
- Border radius: 2.5rem (40px)
- Overflow: hidden
- Background: Content dependent

**Screen Content Guidelines:**
1. Use real content, not "lorem ipsum"
2. Full-screen vertical layout (TikTok-style)
3. Dark overlay on images for text readability
4. Clear CTA button at bottom
5. Swipe indicator if showing vertical scroll

---

## 🎯 Case Study Card Pattern

### Quote Card Design

**Used for:** Customer testimonials, case study quotes

**Styling:**
```tsx
<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
  <div className="text-base font-semibold text-gray-900 mb-3">
    "Quote text here in proper typographic quotes."
  </div>
  <div className="text-sm text-gray-600">
    <span className="font-medium">Company Name</span> • Industry/descriptor
  </div>
</div>
```

**Key Details:**
- Gradient background: `from-blue-50 to-purple-50`
- Quote in proper typographic quotes: `&ldquo;` and `&rdquo;`
- Quote text: `text-base font-semibold text-gray-900`
- Attribution: Company name bold, separator `•`, descriptor light
- Border: `border-gray-200`
- Padding: `p-6`
- Border radius: `rounded-xl`

---

## ✅ Checkmark Bullet Pattern

### For Feature Lists

**Standard implementation:**
```tsx
<div className="flex items-center gap-3">
  <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
  <span className="text-gray-700">Feature description</span>
</div>
```

**Key Details:**
- Icon size: `w-5 h-5` (20px)
- Icon color: `text-leader-blue` (#2563EB)
- Icon must be `flex-shrink-0` (prevents squishing)
- Gap between icon and text: `gap-3` (12px)
- Text color: `text-gray-700` (readable but not harsh)
- Use in `space-y-3` container for vertical spacing

---

## 🏷️ Label Pattern

### Section Labels (Uppercase)

**Used for:** Section identifiers, category tags

**Styling:**
```tsx
<div className="text-sm text-leader-blue font-semibold mb-4 uppercase tracking-wide">
  Case Study
</div>
```

**Key Details:**
- Size: `text-sm` (14px)
- Color: `text-leader-blue`
- Weight: `font-semibold` (600)
- Transform: `uppercase`
- Letter spacing: `tracking-wide`
- Margin bottom: `mb-4` (16px before headline)

---

## 📐 Layout Patterns

### Two-Column Grid (Content + Visual)

**Standard:**
```tsx
<div className="grid md:grid-cols-2 gap-12 items-center">
  <div>{/* Content */}</div>
  <div>{/* Visual (mockup, image, etc) */}</div>
</div>
```

**Key Details:**
- Mobile: Single column (stacks)
- Desktop: Two equal columns
- Gap: `gap-12` (48px) for breathing room
- Vertical align: `items-center`
- Content goes left, visual goes right (standard reading flow)

**When to reverse:**
```tsx
<div className="grid md:grid-cols-2 gap-12 items-center">
  <div className="order-2 md:order-1">{/* Visual */}</div>
  <div className="order-1 md:order-2">{/* Content */}</div>
</div>
```

---

## 🎨 Background Treatments

### Light Gradient Background

**Used for:** Sections that need subtle depth without darkness

**Implementation:**
```tsx
<section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
  {/* Content */}
</section>
```

**Key Details:**
- Base: Gray 50 (very light)
- Accent 1: Blue 50 at 30% opacity
- Accent 2: Purple 50 at 20% opacity
- Direction: Bottom-right diagonal (`bg-gradient-to-br`)

### Dark Premium Background

**Used for:** Pricing, CTAs, premium sections

**Implementation:**
```tsx
<section className="py-24 bg-future-black relative overflow-hidden">
  {/* Animated gradient glow */}
  <div className="absolute inset-0 opacity-20">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-leader-blue rounded-full blur-[200px] animate-gradient"></div>
  </div>
  
  <div className="relative z-10">
    {/* Content */}
  </div>
</section>
```

**Key Details:**
- Background: Future Black (#0A0E27)
- Animated glow: Leader Blue blurred circle
- Glow opacity: 20%
- Glow blur: 200px
- Content positioned with `relative z-10` to sit above glow

---

## 🔲 Card Patterns

### Standard Card

**Used for:** Features, benefits, content blocks

```tsx
<div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300">
  <h3 className="text-xl font-semibold mb-3">Title</h3>
  <p className="text-gray-600 leading-relaxed">Description</p>
</div>
```

**Key Details:**
- Background: `bg-gray-50`
- Border: `border-gray-100` → `hover:border-gray-200`
- Padding: `p-8` (32px)
- Border radius: `rounded-2xl` (16px)
- Shadow on hover: `hover:shadow-sm`
- Smooth transition: `transition-all duration-300`

### Premium Card (Dark)

**Used for:** Pricing, premium offerings

```tsx
<div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
  {/* Content */}
</div>
```

**Key Details:**
- Background: Gray 800 at 50% opacity
- Border: Gray 700 at 50% opacity
- Border radius: `rounded-3xl` (24px - larger for premium feel)
- Backdrop blur: `backdrop-blur-sm`
- Use on dark backgrounds only

---

## 🚀 CTA Button Patterns

### Primary CTA

**Used for:** Main conversion actions

```tsx
<button className="bg-gradient-to-r from-leader-blue to-[#06B6D4] text-white font-semibold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity">
  Get Started Free
</button>
```

**Key Details:**
- Gradient: Leader Blue → Electric Cyan
- Text: White, semibold (600)
- Padding: `px-8 py-4` (32px x 16px)
- Border radius: `rounded-xl`
- Size: `text-lg` for prominence
- Hover: Slight opacity fade

### Secondary CTA

**Used for:** Alternative actions

```tsx
<button className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
  See Showcase
</button>
```

**Key Details:**
- Background: White
- Text: Gray 900 (dark)
- Border: Gray 200
- Hover: Light gray background
- Slightly smaller padding than primary

---

## 📊 Stats Display Pattern

### Three-Column Stats

**Used for:** Key metrics, social proof

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div className="text-center">
    <div className="text-4xl font-bold gradient-text mb-2">10min</div>
    <p className="text-gray-600">Average build time</p>
  </div>
  {/* More stats... */}
</div>
```

**Key Details:**
- Number: `text-4xl font-bold gradient-text`
- Label: `text-gray-600` normal weight
- Center aligned
- Margin between number and label: `mb-2`
- Grid gap: `gap-8` (32px)

---

## 🎭 Animation Guidelines

### Entrance Animations (Framer Motion)

**Standard fade + slide:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

**Staggered list:**
```tsx
{items.map((item, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: i * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

**Key Principles:**
- Keep durations short: 0.3s - 0.6s
- Use subtle movements: 20px max
- Stagger delays: 0.1s increments
- Fade + slide feels premium
- Never animate more than necessary

---

## 📱 Responsive Guidelines

### Breakpoints

```
Mobile: < 768px
Tablet: 768px - 1023px
Desktop: ≥ 1024px
```

### Responsive Patterns

**Text sizes:**
```tsx
className="text-4xl md:text-5xl lg:text-6xl"
// Mobile: 36px → Tablet: 48px → Desktop: 60px
```

**Padding:**
```tsx
className="py-16 md:py-20 lg:py-24"
// Mobile: 64px → Tablet: 80px → Desktop: 96px
```

**Grid columns:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
// Mobile: 1 → Tablet: 2 → Desktop: 3
```

### Mobile-First Approach

Always design mobile first, then enhance:
1. Start with single column
2. Add tablet layout at `md:`
3. Add desktop layout at `lg:`
4. Test on real devices

---

## 🎨 Spacing System

### Consistent Spacing

**Section padding (vertical):**
- Small: `py-16` (64px)
- Medium: `py-20` (80px)
- Large: `py-24` (96px)

**Container max width:**
- Standard: `max-w-6xl` (1152px)
- Narrow: `max-w-4xl` (896px)
- Text: `max-w-2xl` (672px)

**Element gaps:**
- Tight: `gap-4` (16px)
- Standard: `gap-8` (32px)
- Loose: `gap-12` (48px)

---

## ✨ Micro-interactions

### Hover States

**Cards:**
```tsx
className="hover:border-gray-200 hover:shadow-sm transition-all duration-300"
```

**Buttons:**
```tsx
className="hover:opacity-90 transition-opacity"
```

**Links:**
```tsx
className="text-gray-600 hover:text-gray-900 transition-colors"
```

**Key Principle:** Every interactive element needs a hover state

---

## 🎯 Brand Consistency Checklist

### Before Publishing a Page

- [ ] All headlines use Space Grotesk (font-display)
- [ ] All body text uses Inter (default)
- [ ] CTAs use gradient or Leader Blue
- [ ] Mobile mockups follow 280x570 frame specs
- [ ] Quote cards use proper typographic quotes
- [ ] Checkmarks are Leader Blue (#2563EB)
- [ ] Spacing follows 4px/8px grid
- [ ] Hover states on all interactive elements
- [ ] Responsive at all breakpoints
- [ ] Animations are subtle (< 0.6s)

---

## 📦 Component Library Status

### Available Components

✅ **Logo** - Rising Cards mark + Space Grotesk wordmark
✅ **Button** - Primary, secondary, variants
✅ **PhoneMockup** - Full device with industry variants
✅ **Header** - Fixed navigation with blur
✅ **Footer** - Standard layout
✅ **Hero** - Full-screen with mockup
✅ **Features** - Grid cards with icons
✅ **SocialProof** - Stats + case study + mockup
✅ **FoundersClub** - Dark premium pricing

### To Build

⏳ Testimonial carousel
⏳ FAQ accordion
⏳ Video modal
⏳ Toast notifications
⏳ Loading states

---

## 🚀 Quick Copy-Paste Patterns

### Case Study Section
```tsx
<section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
  <div className="max-w-6xl mx-auto px-6">
    <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div>
          <div className="text-sm text-leader-blue font-semibold mb-4 uppercase tracking-wide">
            Case Study
          </div>
          <h3 className="text-2xl font-bold mb-4">
            Your headline here
          </h3>
          <p className="text-gray-600 mb-6">
            Your description here.
          </p>
          {/* Bullets, quote, etc */}
        </div>
        
        {/* Mockup */}
        <div className="relative flex justify-center">
          {/* Phone frame code here */}
        </div>
      </div>
    </div>
  </div>
</section>
```

---

**Remember**: Every design decision should ask: "Does this feel like 2030 or 2020?"

**Built for 2030.** 🚀
