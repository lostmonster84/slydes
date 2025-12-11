# Slydes.io - Build NOW Guide

> **Everything you need to start building immediately**
>
> **Status**: 100% READY 🚀  
> **Target**: Ship in 2 weeks

---

## ✅ **WE HAVE EVERYTHING**

### **Complete Package**

**Design** ✅:
- Brand guidelines (colors, fonts, voice)
- Website wireframes (6 pages, detailed)
- Button styles, layouts, spacing

**Copy** ✅:
- Word-perfect copy for every page
- Email templates
- CTA buttons
- Tone and style guide

**Tech Spec** ✅:
- Full stack defined (Next.js 15, Tailwind, Framer Motion)
- Project structure mapped
- Components specified
- Deployment plan

**Content Strategy** ✅:
- Placeholder approach (ship MVP, iterate)
- Video strategy (screen recordings → pro videos)
- Asset checklist
- Timeline

---

## 🚀 **BUILD IN 5 STEPS**

### **Step 1: Setup Project** (30 minutes)

```bash
# Create Next.js app
npx create-next-app@latest slydes-website \
  --typescript \
  --tailwind \
  --app \
  --src-dir

cd slydes-website

# Install dependencies
npm install framer-motion react-hook-form resend
```

**Configure Tailwind** (`tailwind.config.ts`):
```typescript
export default {
  theme: {
    extend: {
      colors: {
        'future-black': '#0A0E27',
        'leader-blue': '#2563EB',
        'electric-cyan': '#06B6D4',
        'steel-gray': '#64748B',
        'deep-slate': '#1E293B',
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
      },
    },
  },
}
```

**Add Fonts** (`src/lib/fonts.ts`):
```typescript
import { Inter, JetBrains_Mono } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })
export const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })
```

---

### **Step 2: Build Core Components** (2 hours)

**Button** (`src/components/ui/Button.tsx`):
```typescript
export function Button({ children, variant = 'primary' }) {
  const styles = {
    primary: 'bg-gradient-cta text-white hover:scale-[1.02]',
    secondary: 'border border-leader-blue text-leader-blue',
  }
  return (
    <button className={`px-6 py-3 rounded-lg font-medium transition-all ${styles[variant]}`}>
      {children}
    </button>
  )
}
```

**Header** (`src/components/layout/Header.tsx`):
```typescript
export function Header() {
  return (
    <header className="fixed top-0 w-full bg-future-black/80 backdrop-blur-lg z-50">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-bold">
          <span className="text-leader-blue">Sly</span>
          <span className="text-electric-cyan">des</span>
        </div>
        <div className="hidden md:flex gap-8">
          <a href="/how-it-works">How It Works</a>
          <a href="/examples">Examples</a>
          <a href="/pricing">Pricing</a>
        </div>
        <Button>Join Waitlist</Button>
      </nav>
    </header>
  )
}
```

**Footer** (`src/components/layout/Footer.tsx`):
```typescript
export function Footer() {
  return (
    <footer className="bg-deep-slate border-t border-steel-gray/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Product, Company, Resources, Legal columns */}
        </div>
        <div className="mt-12 pt-8 border-t border-steel-gray/20">
          <p className="text-steel-gray text-sm">
            © 2025 Slydes. Built for 2030.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

---

### **Step 3: Build Homepage** (4 hours)

**Page** (`src/app/page.tsx`):
```typescript
import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { VideoDemo } from '@/components/sections/VideoDemo'
import { Features } from '@/components/sections/Features'
import { SocialProof } from '@/components/sections/SocialProof'
import { FinalCTA } from '@/components/sections/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <VideoDemo />
      <Features />
      <SocialProof />
      <FinalCTA />
    </>
  )
}
```

**Hero Section** (`src/components/sections/Hero.tsx`):
```typescript
export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-future-black to-deep-slate">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          Built for 2030.
        </h1>
        <p className="text-xl md:text-2xl text-steel-gray mb-8 max-w-2xl mx-auto">
          Mobile-first business sites that customers actually engage with.
          Stop building for 2020. Start building Slydes.
        </p>
        <div className="flex gap-4 justify-center">
          <Button>Start Building →</Button>
          <Button variant="secondary">See Examples</Button>
        </div>
      </div>
    </section>
  )
}
```

**Copy all sections from** `WEBSITE-COPY-FINAL.md`

---

### **Step 4: Build Remaining Pages** (6 hours)

**How It Works** (`src/app/how-it-works/page.tsx`):
- 3-step process
- Visuals + copy
- CTA at bottom

**Examples** (`src/app/examples/page.tsx`):
- Grid of example cards
- Filter tabs (optional for MVP)
- Use WildTrax Slydes as examples

**Pricing** (`src/app/pricing/page.tsx`):
- 3 pricing cards (Free, Pro, Agency)
- FAQ section
- CTA

**Signup** (`src/app/signup/page.tsx`):
- Waitlist form (name, email, company, use case)
- Integration with Resend
- Confirmation message

**Dashboard** (`src/app/dashboard/page.tsx`):
- Empty state with "Create Slyde" button
- (Can be basic for MVP)

---

### **Step 5: Polish & Deploy** (2 hours)

**Add Animations**:
```typescript
// Scroll-triggered fade-in
import { motion } from 'framer-motion'

export function AnimatedSection({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}
```

**Setup Email** (`app/api/waitlist/route.ts`):
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, name } = await req.json()
  
  await resend.emails.send({
    from: 'waitlist@slydes.io',
    to: email,
    subject: 'Welcome to Slydes—You\'re on the list! 🚀',
    html: `<p>Hey ${name}, you're in!...</p>`,
  })
  
  return Response.json({ success: true })
}
```

**Deploy to Vercel**:
```bash
vercel --prod
```

**Add Custom Domain**:
- Vercel dashboard → Add domain: `slydes.io`
- Update DNS at registrar

---

## 📁 **FILES YOU NEED**

### **Must Read Before Building**

1. **BRAND-GUIDELINES.md** - Colors, fonts, voice
2. **WEBSITE-WIREFRAME.md** - Page layouts and structure
3. **WEBSITE-COPY-FINAL.md** - Word-perfect copy
4. **SLYDES-WEBSITE-TECH-SPEC.md** - Full tech stack and specs

### **Reference As You Build**

1. **PRACTICE-WHAT-WE-PREACH.md** - Philosophy (site must BE a Slyde)
2. **LAUNCH-STRATEGY.md** - What to do after launch

---

## 🎥 **PLACEHOLDER CONTENT STRATEGY**

### **Videos** (MVP Launch)

**Option 1: Screen Recordings** (RECOMMENDED)
```
Tool: QuickTime (Mac) or OBS
Source: WildTrax Slydes (we already have 4 working!)
Process:
1. Open WildTrax Slyde on phone
2. Screen record with QuickTime
3. Edit with iMovie (add text overlay)
4. Export as MP4, optimize for web
5. Upload to public/videos/
```

**Option 2: Animated Mockups**
```
Tool: Figma + export as video
Time: 2-3 hours per video
Quality: Good enough for MVP
```

**Option 3: "Coming Soon"**
```
Use static image with "Demo video coming soon"
Ship faster, add video in Week 2
```

### **Logo** (MVP)

**Text-based temporary**:
```html
<div class="text-2xl font-bold">
  <span class="text-leader-blue">Sly</span>
  <span class="text-electric-cyan">des</span>
</div>
```

Get proper logo designed later (Fiverr, 99designs, or local designer).

### **Graphics**

**Use**:
- Solid color backgrounds (Future Black, gradients)
- Heroicons for icons (free, MIT licensed)
- Simple geometric shapes

**Later**:
- Custom illustrations
- Brand photography
- Product screenshots

---

## ⏱️ **TIMELINE**

### **Week 1: Build**

**Day 1**: Setup + core components (Button, Header, Footer)  
**Day 2-3**: Homepage (all 6 sections)  
**Day 4**: How It Works + Examples pages  
**Day 5**: Pricing + Signup pages  
**Day 6**: Dashboard (basic shell)  
**Day 7**: Polish + animations

### **Week 2: Launch**

**Day 8**: Record demo videos (screen recordings)  
**Day 9**: Test on multiple devices  
**Day 10**: Setup email integration (Resend)  
**Day 11**: Final copy review + SEO  
**Day 12**: Deploy to production  
**Day 13**: Soft launch (share with friends)  
**Day 14**: Public launch! 🚀

---

## 🎯 **MVP vs. FINAL**

### **Ship in Week 2** (MVP)

- ✅ All 6 pages functional
- ✅ Waitlist form working
- ✅ Text-based logo
- ✅ Screen recording demos (or "Coming Soon")
- ✅ Basic animations
- ✅ Mobile responsive

### **Improve in Month 1** (Final)

- ✅ Professional demo videos
- ✅ Custom logo designed
- ✅ Real customer examples (3-5)
- ✅ Polished animations
- ✅ A/B testing on CTAs
- ✅ Advanced analytics

**Philosophy**: Ship MVP fast, iterate based on real feedback.

---

## 🚨 **COMMON MISTAKES TO AVOID**

**❌ Waiting for perfect content**
→ ✅ Ship with placeholders, iterate

**❌ Over-engineering**
→ ✅ Use simple tech, optimize later

**❌ Building desktop-first**
→ ✅ Mobile-first always (practice what we preach!)

**❌ Perfectionism**
→ ✅ Done > perfect

---

## ✅ **FINAL CHECKLIST**

**Before you start**:
- [x] Read BRAND-GUIDELINES.md
- [x] Read WEBSITE-WIREFRAME.md
- [x] Read WEBSITE-COPY-FINAL.md
- [x] Read SLYDES-WEBSITE-TECH-SPEC.md

**Ready to build?**
- [x] Tech stack chosen (Next.js 15)
- [x] Copy finalized (all pages)
- [x] Placeholder strategy defined
- [x] Timeline set (2 weeks)

**Answer: CAN WE BUILD NOW?**

# **YES! LET'S GO!** 🚀

---

## 🔥 **FIRST COMMAND**

```bash
npx create-next-app@latest slydes-website --typescript --tailwind --app
```

**After setup, first task**:

Build the homepage hero section with the gradient CTA button.

**Copy from**: `WEBSITE-COPY-FINAL.md` → Homepage → Hero Section

**Design reference**: `BRAND-GUIDELINES.md` → Buttons → Primary CTA

---

*Slydes.io Build NOW Guide*  
*Status: 100% Ready*  
*Let's ship it! 🚀*


