# Slydes Design System

> **Copy-Paste Ready** - Override CSS variables and classes to adapt this design language to any project.

---

## What Makes This Homepage Compelling

### The 7 Core Principles

1. **Dark-to-Light Journey** - Hero starts in dramatic darkness (#030712), sections alternate between dark (#0A0E27) and light (gray-50), creating visual rhythm
2. **Depth Without Clutter** - Subtle glows, vignettes, and noise textures add premium feel without distraction
3. **Motion With Purpose** - Every animation serves a function (attention, hierarchy, delight) - never gratuitous
4. **Mobile-Native Thinking** - Designed for thumbs first, looks great on desktop second
5. **High Contrast Text** - White on dark, dark on light - always readable, always bold
6. **Generous Whitespace** - Space = premium; cramped = cheap
7. **Gradient Accents** - Blue-to-cyan gradients signal "special" or "action"

---

## 1. Color System

### CSS Variables (Override These First)

```css
:root {
  /* ===== BRAND COLORS ===== */
  --color-primary: #2563EB;        /* Leader Blue - CTAs, links, accents */
  --color-secondary: #22D3EE;      /* Electric Cyan - Gradient endpoints, highlights */
  --color-dark: #0A0E27;           /* Future Black - Dark sections, text */
  --color-hero-dark: #030712;      /* Deepest black - Hero background */

  /* ===== NEUTRAL SCALE ===== */
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F4F4F5;
  --color-gray-200: #E4E4E7;
  --color-gray-300: #D4D4D8;
  --color-gray-400: #A1A1AA;
  --color-gray-500: #71717A;
  --color-gray-600: #52525B;
  --color-gray-700: #3F3F46;
  --color-gray-800: #27272A;
  --color-gray-900: #18181B;

  /* ===== SEMANTIC COLORS ===== */
  --color-success: #22C55E;        /* Emerald - Live indicators, success states */
  --color-warning: #F59E0B;        /* Amber - Attention, highlights */
  --color-error: #EF4444;          /* Red - Errors, destructive actions */

  /* ===== WINDOW CHROME (macOS-style) ===== */
  --color-window-bg: #1e1e1e;
  --color-window-toolbar: #323232;
  --color-window-border: #3a3a3a;
  --color-window-sidebar: #2d2d2d;
  --color-traffic-red: #ff5f57;
  --color-traffic-yellow: #febc2e;
  --color-traffic-green: #28c840;
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        'future-black': '#0A0E27',
        'leader-blue': '#2563EB',
        'electric-cyan': '#22D3EE',
        'gray-50': '#FAFAFA',
        'gray-100': '#F4F4F5',
        'gray-200': '#E4E4E7',
        'gray-300': '#D4D4D8',
        'gray-400': '#A1A1AA',
        'gray-500': '#71717A',
        'gray-600': '#52525B',
        'gray-700': '#3F3F46',
        'gray-800': '#27272A',
        'gray-900': '#18181B',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
}
```

---

## 2. Typography

### Font Stack

```css
:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;  /* Headlines - geometric, bold */
  --font-sans: 'Inter', system-ui, sans-serif;              /* Body - clean, readable */
  --font-mono: 'JetBrains Mono', monospace;                 /* Code, URLs, stats */
}
```

### Heading Hierarchy

```css
/* Base heading styles */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.025em; /* tracking-tight */
  color: var(--color-dark);
}

/* Responsive sizes */
h1 { @apply text-4xl md:text-5xl lg:text-6xl; }  /* 36px → 48px → 60px */
h2 { @apply text-3xl md:text-4xl; }               /* 30px → 36px */
h3 { @apply text-xl md:text-2xl; }                /* 20px → 24px */

/* Body text */
p { @apply text-gray-600 leading-relaxed; }
```

### Gradient Text (The "Special" Treatment)

```css
.gradient-text {
  background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Usage Pattern:**
```jsx
<h2 className="text-white">
  Share a <span className="gradient-text">Slyde</span>.
</h2>
```

### Text Color Patterns

| Context | Class | Use Case |
|---------|-------|----------|
| Dark BG - Primary | `text-white` | Headlines, emphasis |
| Dark BG - Secondary | `text-white/70` | Body text, descriptions |
| Dark BG - Muted | `text-white/40` | Tertiary info, placeholders |
| Light BG - Primary | `text-future-black` or `text-gray-900` | Headlines |
| Light BG - Secondary | `text-gray-600` | Body text |
| Light BG - Muted | `text-gray-400` | Tertiary info |

---

## 3. Spacing & Layout

### Section Padding

```css
/* Standard vertical rhythm */
.section { @apply py-12 md:py-24; }  /* 48px → 96px */
```

### Container Max-Widths

```css
.container-narrow { @apply max-w-5xl mx-auto px-6; }  /* 1024px - features, text-heavy */
.container-standard { @apply max-w-6xl mx-auto px-6; } /* 1152px - most sections */
.container-wide { @apply max-w-7xl mx-auto px-6; }     /* 1280px - header, full-bleed */
```

### Grid Patterns

```css
/* Phone mockup + content (most common) */
.grid-split { @apply grid lg:grid-cols-2 gap-12 items-center; }

/* Bento-style feature cards */
.grid-bento { @apply grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6; }

/* Stats row */
.grid-stats { @apply grid grid-cols-1 md:grid-cols-3 gap-8; }
```

---

## 4. Background Treatments

### Hero Section (Dark, Dramatic)

```jsx
<section className="relative min-h-screen overflow-hidden bg-[#030712]">
  {/* Layer 1: Soft vignette - darkens edges */}
  <div
    className="absolute inset-0"
    style={{
      background: 'radial-gradient(ellipse 120% 100% at 50% 0%, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
    }}
  />

  {/* Layer 2: Noise texture - adds premium grain */}
  <div
    className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }}
  />

  {/* Layer 3: Spotlight glow behind hero element */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <motion.div
      className="relative w-[500px] h-[500px]"
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%,
            rgba(37, 99, 235, 0.25) 0%,
            rgba(37, 99, 235, 0.12) 30%,
            rgba(37, 99, 235, 0.04) 55%,
            transparent 80%
          )`,
          filter: 'blur(50px)',
        }}
      />
    </motion.div>
  </div>

  {/* Content - MUST be relative z-10 */}
  <div className="relative z-10">
    ...
  </div>
</section>
```

### Dark Section (Standard)

```jsx
<section className="py-12 md:py-24 bg-[#0A0E27] overflow-hidden">
  <div className="max-w-6xl mx-auto px-6">
    ...
  </div>
</section>
```

### Light Section

```jsx
<section className="py-12 md:py-24 bg-gray-50">
  <div className="max-w-5xl mx-auto px-6">
    ...
  </div>
</section>
```

### Section Alternation Pattern

```
Hero        → bg-[#030712] (deepest dark)
Section 1   → bg-gray-50   (light)
Section 2   → bg-[#0A0E27] (dark)
Section 3   → bg-gray-50   (light)
Section 4   → bg-[#0A0E27] (dark)
Section 5   → bg-white     (lightest)
Section 6   → bg-gray-50   (light)
Footer      → bg-[#0A0E27] (dark)
```

---

## 5. Cards & Containers

### Bento Card (Dark Background, Hero Feature)

```jsx
<motion.div
  className="md:row-span-2 bg-[#0A0E27] rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden group"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
  {/* Glow effect - larger, bleeds off edge */}
  <div className="absolute -top-20 -right-20 w-40 h-40 bg-leader-blue/20 rounded-full blur-3xl group-hover:bg-leader-blue/30 transition-all duration-500" />

  <div className="relative z-10">
    {/* Icon */}
    <div className="flex items-center gap-2 mb-4">
      <div className="w-10 h-10 rounded-xl bg-leader-blue/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-leader-blue" />
      </div>
      <span className="text-xs text-white/80 font-medium uppercase tracking-wide">Label</span>
    </div>

    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Headline</h3>
    <p className="text-white/70 mb-6 leading-relaxed">Description text...</p>

    {/* Tags */}
    <div className="flex flex-wrap gap-2">
      {['Tag 1', 'Tag 2', 'Tag 3'].map((tag) => (
        <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
          {tag}
        </span>
      ))}
    </div>
  </div>
</motion.div>
```

### Feature Card (Dark with Accent Color)

```jsx
<motion.div
  className="bg-[#0A0E27] rounded-3xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group relative overflow-hidden"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  viewport={{ once: true }}
>
  {/* Subtle accent glow */}
  <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />

  <div className="relative z-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">Title</h3>
        <p className="text-xs text-white/50">Subtitle</p>
      </div>
    </div>
    <p className="text-white/70 text-sm">Description...</p>
  </div>
</motion.div>
```

### Quote/Testimonial Card (Light)

```jsx
<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
  <div className="text-base font-semibold text-gray-900 mb-3">
    &ldquo;Quote text here using proper typographic quotes.&rdquo;
  </div>
  <div className="text-sm text-gray-600">
    <span className="font-medium">Company Name</span> &bull; Industry
  </div>
</div>
```

### Case Study Card (Light, Full-Width)

```jsx
<div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm">
  <div className="grid md:grid-cols-2 gap-12 items-center">
    {/* Content side */}
    <div>
      <div className="text-sm text-leader-blue font-semibold mb-4 uppercase tracking-wide">
        Case Study
      </div>
      <h3 className="text-2xl font-bold mb-4">
        Headline with <span className="gradient-text">gradient accent</span>.
      </h3>
      <p className="text-gray-600 mb-6">Description paragraph...</p>

      {/* Checklist */}
      <div className="space-y-3 mb-8">
        {['Feature 1', 'Feature 2', 'Feature 3'].map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Visual side - phone mockup */}
    <div className="flex justify-center">
      <PhoneMockup />
    </div>
  </div>
</div>
```

### macOS-Style Window (Dashboard Preview)

```jsx
<div className="bg-[#1e1e1e] rounded-2xl border border-[#3a3a3a] shadow-2xl shadow-black/50 overflow-hidden">
  {/* Traffic light toolbar */}
  <div className="bg-[#323232] border-b border-[#3a3a3a] px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
    </div>
    <div className="text-sm font-medium text-white/70">Window Title</div>
    <button className="px-4 py-1.5 bg-leader-blue text-white text-sm rounded-lg font-medium">
      Action
    </button>
  </div>

  {/* Content area */}
  <div className="grid md:grid-cols-[240px_1fr] min-h-[400px]">
    {/* Sidebar */}
    <div className="bg-[#2d2d2d] border-r border-[#3a3a3a] p-4">
      ...
    </div>

    {/* Main content */}
    <div className="bg-[#1e1e1e] p-8">
      ...
    </div>
  </div>
</div>
```

---

## 6. Buttons

### Primary CTA

```jsx
<button className="
  bg-leader-blue text-white
  px-7 min-h-[48px] text-base
  rounded-xl font-semibold
  hover:bg-blue-700 hover:shadow-lg hover:shadow-leader-blue/25
  active:scale-[0.98]
  transition-all duration-200 ease-out
  shadow-lg shadow-leader-blue/30
">
  Create your first Slyde
</button>
```

### Inverted CTA (On Dark Backgrounds)

```jsx
<button className="
  bg-white text-future-black
  px-5 min-h-[44px] text-sm
  rounded-xl font-semibold
  hover:bg-gray-100
  active:scale-[0.98]
  transition-all duration-200
">
  Get Started
</button>
```

### Secondary/Ghost

```jsx
<button className="
  border border-gray-300 text-gray-700 bg-white
  px-5 min-h-[44px] text-sm
  rounded-xl font-semibold
  hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
  active:scale-[0.98]
  transition-all duration-200
">
  Learn More
</button>
```

### Pill Tabs (Filter/Category Selection)

```jsx
{/* Active state */}
<button className="
  px-6 py-2.5 min-h-[44px]
  rounded-full text-sm font-medium
  bg-future-black text-white shadow-lg
  transition-all duration-300
">
  Active Tab
</button>

{/* Inactive state */}
<button className="
  px-6 py-2.5 min-h-[44px]
  rounded-full text-sm font-medium
  bg-white text-gray-600 border border-gray-200
  hover:bg-gray-100
  transition-all duration-300
">
  Inactive Tab
</button>
```

### Selected State (Lists/Navigation)

```jsx
{/* Active - gradient background */}
<button className="
  bg-gradient-to-r from-blue-600 to-cyan-500
  text-white shadow-md
  rounded-lg px-3 py-2.5 min-h-[44px]
  text-sm font-medium
">
  Selected Item
</button>

{/* Inactive */}
<button className="
  bg-white/10 text-white/60
  hover:bg-white/5
  rounded-lg px-3 py-2.5 min-h-[44px]
  text-sm font-medium
  transition-colors
">
  Other Item
</button>
```

---

## 7. Badges & Indicators

### Live Status Badge (Pulsing Dot)

```jsx
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 text-sm font-medium">
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
  </span>
  Built for experiences
</span>
```

### Category Badge (Light Background)

```jsx
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
  <Icon className="w-4 h-4" />
  Demo Examples
</span>
```

### Dark Section Badge

```jsx
<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
  <Icon className="w-4 h-4 text-electric-cyan" />
  <span className="text-sm font-medium text-white/70">Label</span>
</div>
```

### Feature Tags

```jsx
<div className="flex flex-wrap gap-2">
  {['Tag 1', 'Tag 2', 'Tag 3'].map((tag) => (
    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
      {tag}
    </span>
  ))}
</div>
```

---

## 8. Navigation

### Header (Transparent → Solid on Scroll)

```jsx
const [scrolled, setScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

<header className={`
  fixed top-0 left-0 right-0 z-50 transition-all duration-300
  ${scrolled
    ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm'
    : 'bg-transparent'
  }
`}>
```

### Nav Links with Animated Underline

```jsx
<a className="group relative text-sm text-white/80 hover:text-white transition-colors">
  How It Works
  <span className="
    absolute -bottom-1 left-0 w-0 h-0.5
    bg-white
    transition-all duration-300 group-hover:w-full
  " />
</a>
```

### Sidebar Navigation (Dark)

```jsx
<button className={`
  w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px]
  rounded-xl transition-colors relative text-left
  ${isActive
    ? 'bg-white/10 text-white'
    : 'text-white/60 hover:text-white hover:bg-white/5'
  }
`}>
  {/* Active indicator bar */}
  {isActive && (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full" />
  )}
  <Icon className="w-5 h-5 shrink-0" />
  <span className="text-sm font-medium">{label}</span>
</button>
```

---

## 9. Animation System

### CSS Keyframes

```css
/* Phone floating animation */
@keyframes phone-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(0.5deg); }
}

/* Breathing animation for containers */
@keyframes breathe {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Pulse glow for CTAs */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
  50% { box-shadow: 0 0 20px 5px rgba(37, 99, 235, 0.2); }
}

/* Floating shapes */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
}

/* Gradient shift */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Utility Classes

```css
.animate-phone-float { animation: phone-float 5s ease-in-out infinite; }
.animate-breathe { animation: breathe 4s ease-in-out infinite; }
.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-gradient { background-size: 200% 200%; animation: gradient-shift 8s ease infinite; }
```

### Framer Motion Patterns

```jsx
// Standard fade + rise (most common)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>

// Staggered word animation (slot machine effect)
{words.map((word, i) => (
  <motion.span
    key={i}
    className="inline-block"
    style={{ transformStyle: 'preserve-3d' }}
    variants={{
      hidden: { rotateX: 90, opacity: 0, y: 10 },
      visible: { rotateX: 0, opacity: 1, y: 0 },
      exit: { rotateX: -90, opacity: 0, y: -10 }
    }}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{
      duration: 0.4,
      delay: i * 0.05,
      ease: [0.16, 1, 0.3, 1]
    }}
  >
    {word}
  </motion.span>
))}

// Scale + fade for overlays/modals
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.25 }}
>

// Spotlight breathing
<motion.div
  animate={{ scale: [1, 1.03, 1] }}
  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
>
```

### Hover Lift Effect

```css
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -15px rgba(37, 99, 235, 0.15);
}
```

---

## 10. Mobile Patterns

### Touch-Friendly Sizing

```css
/* Minimum touch target: 44x44px (Apple HIG) */
button, a { min-height: 44px; }

/* Remove tap delay */
.touch-manipulation { touch-action: manipulation; }

/* Form inputs - prevent iOS zoom */
input, textarea, select {
  min-height: 48px;
  font-size: 16px; /* Prevents auto-zoom on iOS */
}
```

### Horizontal Scroll (Mobile Tabs)

```jsx
<div className="overflow-x-auto -mx-6 px-6 scrollbar-hide">
  <div className="flex gap-2 pb-2" style={{ scrollbarWidth: 'none' }}>
    {items.map((item) => (
      <button
        key={item.id}
        className="flex-shrink-0 min-h-[44px] px-4 py-2.5 rounded-full text-sm font-medium touch-manipulation"
        style={{ touchAction: 'manipulation' }}
      >
        {item.label}
      </button>
    ))}
  </div>
</div>
```

### Hidden Scrollbar

```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

---

## 11. Quick Reference: Class Combos

### Dark Section

```
Background: bg-[#0A0E27] or bg-[#030712]
Headlines: text-white
Body: text-white/70
Muted: text-white/40
Borders: border-white/10
Cards: bg-white/5 or bg-[#1e1e1e]
```

### Light Section

```
Background: bg-gray-50 or bg-white
Headlines: text-future-black or text-gray-900
Body: text-gray-600
Muted: text-gray-400
Borders: border-gray-200
Cards: bg-white border-gray-200
```

### Primary Gradient

```css
/* Button/accent backgrounds */
bg-gradient-to-r from-leader-blue to-electric-cyan

/* Or explicit hex */
bg-gradient-to-r from-blue-600 to-cyan-500
```

### Shadow Patterns

```css
/* CTA buttons */
shadow-lg shadow-leader-blue/30

/* Elevated cards */
shadow-2xl shadow-black/50

/* Subtle hover */
hover:shadow-md
```

---

## 12. Adaptation Checklist

When applying this design to another project:

- [ ] Replace `--color-primary` (#2563EB) with your brand blue
- [ ] Replace `--color-secondary` (#22D3EE) with your accent color
- [ ] Replace `--color-dark` (#0A0E27) with your dark background
- [ ] Update font families (Space Grotesk → your display font)
- [ ] Swap hero imagery/mockups
- [ ] Update gradient angle/direction if needed (currently 135deg)
- [ ] Test all buttons meet 44px touch target
- [ ] Verify contrast ratios (WCAG AA minimum)
- [ ] Test dark/light section alternation rhythm

---

## 13. Why It Works (Design Psychology)

| Principle | Implementation | Effect |
|-----------|----------------|--------|
| **Contrast = Drama** | Dark hero with glowing spotlight | Immediate visual impact, premium feel |
| **Rhythm = Flow** | Dark/light section alternation | Prevents monotony, creates natural breaks |
| **Depth = Premium** | Vignettes, noise, glows | Perceived quality without clutter |
| **Motion = Life** | Subtle floating, word animations | Page feels alive, not static |
| **Hierarchy = Clarity** | Large headlines, medium body, small details | Clear information architecture |
| **Color = Meaning** | Blue=action, Green=success, Gradients=special | Intuitive UI understanding |
| **Space = Value** | Generous padding, breathing room | Premium feel; cramped=cheap |
| **Consistency = Trust** | Same patterns everywhere | Professional, reliable brand |

---

*Design system extracted from slydes.io homepage - January 2026*
*Last Updated: January 3, 2026*
