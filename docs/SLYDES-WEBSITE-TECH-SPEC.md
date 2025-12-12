# Slydes.io Website - Technical Specification

> **Build the slydes.io marketing website**
>
> **Status**: Ready to build NOW  
> **Target**: Ship MVP in 2 weeks

---

## 🎯 **WHAT WE'RE BUILDING**

**Site**: slydes.io marketing website (NOT the Slydes product itself)

**Purpose**: 
- Get signups for waitlist
- Demo the Slydes product
- Establish brand leadership
- Drive conversions

**Pages**: 6 total (see WEBSITE-WIREFRAME.md)
1. Homepage
2. How It Works
3. Examples
4. Pricing
5. Signup
6. Dashboard (basic)

---

## 🔧 **TECH STACK**

### **Framework**: Next.js 15 (App Router)

**Why**:
- ✅ Same stack as WildTrax (proven)
- ✅ Fast, SEO-friendly
- ✅ Easy to add Slydes product integration later
- ✅ Vercel deployment (one command)
- ✅ TypeScript support
- ✅ Server components for performance

### **Styling**: Tailwind CSS

**Why**:
- ✅ Matches brand guidelines perfectly
- ✅ Fast iteration
- ✅ Mobile-first by default
- ✅ Custom color palette easy to implement

### **Animations**: Framer Motion

**Why**:
- ✅ Smooth, professional animations
- ✅ Video player interactions
- ✅ Scroll-triggered effects
- ✅ Mobile-optimized

### **Video**: HTML5 Video + YouTube Embeds

**Strategy**:
- Demo videos: Self-hosted MP4
- Testimonials: YouTube embeds
- Background videos: Self-hosted, optimized

### **Forms**: React Hook Form + Vercel Edge Functions

**For**:
- Waitlist signup
- Contact form
- Demo request

### **Email**: Resend (Vercel-native)

**Why**:
- ✅ Clean, modern
- ✅ Great DX
- ✅ Low cost
- ✅ Built for Next.js

### **Analytics**: Vercel Analytics + Plausible

**Why**:
- Vercel Analytics: Performance tracking
- Plausible: Privacy-friendly, GDPR-compliant

### **Hosting**: Vercel

**Why**:
- ✅ Instant deploys
- ✅ Preview URLs for every branch
- ✅ Edge functions
- ✅ Free tier perfect for launch

---

## 📁 **PROJECT STRUCTURE**

```
slydes.io/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Homepage
│   │   ├── how-it-works/page.tsx   # How It Works
│   │   ├── examples/page.tsx       # Examples gallery
│   │   ├── pricing/page.tsx        # Pricing
│   │   ├── signup/page.tsx         # Signup/waitlist
│   │   └── dashboard/page.tsx      # Basic dashboard
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Site header
│   │   │   ├── Footer.tsx          # Site footer
│   │   │   └── MobileNav.tsx       # Mobile menu
│   │   ├── sections/
│   │   │   ├── Hero.tsx            # Homepage hero
│   │   │   ├── VideoDemo.tsx       # Video section
│   │   │   ├── Features.tsx        # Features grid
│   │   │   ├── SocialProof.tsx     # Testimonials/stats
│   │   │   ├── CTA.tsx             # Call to action
│   │   │   └── Pricing.tsx         # Pricing cards
│   │   └── ui/
│   │       ├── Button.tsx          # Branded button
│   │       ├── VideoPlayer.tsx     # Custom video UI
│   │       └── Card.tsx            # Content cards
│   └── lib/
│       ├── fonts.ts                # Inter + JetBrains Mono
│       └── analytics.ts            # Tracking helpers
├── public/
│   ├── videos/
│   │   └── [demo videos]
│   ├── images/
│   │   └── [screenshots/graphics]
│   └── logo.svg                    # Brand logo
├── tailwind.config.ts              # Brand colors
└── package.json
```

---

## 🎨 **DESIGN SYSTEM IMPLEMENTATION**

### **Colors** (from BRAND-GUIDELINES.md)

```typescript
// tailwind.config.ts
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

### **Typography**

```typescript
// src/lib/fonts.ts
import { Inter, JetBrains_Mono } from 'next/font/google'

export const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})
```

### **Button Component**

```typescript
// src/components/ui/Button.tsx
export function Button({ children, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-gradient-cta text-white hover:shadow-lg hover:scale-[1.02]',
    secondary: 'border border-leader-blue text-leader-blue hover:bg-leader-blue/10',
    ghost: 'text-steel-gray hover:text-leader-blue',
  }
  
  return (
    <button 
      className={`px-6 py-3 rounded-lg font-medium transition-all ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

---

## 🚀 **BUILD PHASES**

### **Phase 1: Foundation** (Day 1-2)

**Setup**:
```bash
npx create-next-app@latest slydes-website --typescript --tailwind --app
cd slydes-website
npm install framer-motion react-hook-form
```

**Configure**:
- Tailwind with brand colors
- Fonts (Inter + JetBrains Mono)
- Basic layout (Header + Footer)

**Deliverable**: Empty shell with brand styling

---

### **Phase 2: Core Pages** (Day 3-7)

**Build in order**:
1. Homepage (Hero + Video + Features + CTA)
2. How It Works (3-step process)
3. Examples (Gallery with filter)
4. Pricing (3 tiers)

**Focus**: Structure + copy + basic styling

**Deliverable**: 4 main pages functional

---

### **Phase 3: Conversion** (Day 8-10)

**Build**:
- Signup page (waitlist form)
- Email integration (Resend)
- Thank you flow
- Basic dashboard shell

**Focus**: Conversion funnel working

**Deliverable**: Can collect signups

---

### **Phase 4: Polish** (Day 11-14)

**Add**:
- Animations (scroll effects, video interactions)
- Mobile optimization
- Performance tuning
- SEO metadata
- Analytics

**Focus**: Production-ready quality

**Deliverable**: Ready to launch

---

## 📝 **CONTENT STRATEGY**

### **Placeholder Content → Final**

**Phase 1 Launch** (MVP):
- ✅ Use example copy from wireframes
- ✅ Placeholder demo videos (screen recordings)
- ✅ Simple logo (text-based temporary)
- ✅ Stock photos OR solid color backgrounds
- ✅ "Coming soon" for examples page

**Phase 2 Launch** (2 weeks later):
- ✅ Finalized copy (polish messaging)
- ✅ Professional demo videos
- ✅ Real customer examples
- ✅ Custom graphics
- ✅ Proper logo designed

**Strategy**: Ship MVP fast, iterate based on real feedback.

---

## 🎥 **VIDEO STRATEGY**

### **Required Videos**

**1. Hero Demo** (30 seconds):
- Screen recording of Slydes editor
- Show: Create frame → Add content → Preview on phone → Publish
- Format: MP4, 1920x1080, optimized for web
- Location: Homepage hero

**2. How It Works** (3 x 15 seconds):
- Three separate videos, one per step
- Step 1: Sign up + create project
- Step 2: Build frames (drag-and-drop)
- Step 3: Publish + share link
- Format: MP4, 1280x720

**3. Example Slydes** (3-5 examples):
- Actual Slydes in action
- Mobile phone mockup OR live embed
- Show: Business card, restaurant menu, event promo
- Format: MP4 OR iframe embed

### **Placeholder Videos** (Launch Day)

**Option 1**: Screen recordings
- Record actual Slydes editor
- Use WildTrax Slydes as examples
- Add simple text overlays
- Tool: QuickTime (Mac) or OBS

**Option 2**: Animated mockups
- Use Figma to create mockups
- Export as video
- Add to site

**Option 3**: Static with "Coming Soon"
- Use animated GIF or static image
- "Demo video coming soon" overlay
- Launch faster, add video later

**Recommendation**: Option 1 (screen recordings of WildTrax)

---

## 🖼️ **ASSETS CHECKLIST**

### **Logo**

**MVP**:
```html
<!-- Text-based temporary logo -->
<div class="text-2xl font-bold">
  <span class="text-leader-blue">Sly</span><span class="text-electric-cyan">des</span>
</div>
```

**Final** (get designed later):
- SVG logo (light + dark versions)
- Favicon
- Social media preview image

### **Graphics**

**MVP**:
- Solid color backgrounds (Future Black, Leader Blue gradients)
- Simple geometric shapes
- Icons from Heroicons (free)

**Final**:
- Custom illustrations
- Product screenshots
- Brand photography

### **Demo Content**

**MVP**:
- WildTrax Slydes as examples
- Screen recordings as demos
- Basic mockups

**Final**:
- Diverse industry examples
- Professional demo videos
- Customer testimonials

---

## 🔌 **INTEGRATIONS**

### **Email (Waitlist)**

**Service**: Resend

**Setup**:
```bash
npm install resend
```

**API Route** (`app/api/waitlist/route.ts`):
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, name } = await req.json()
  
  // Send to Resend
  await resend.emails.send({
    from: 'waitlist@slydes.io',
    to: email,
    subject: 'Welcome to Slydes Waitlist',
    html: '<p>Thanks for signing up...</p>',
  })
  
  return Response.json({ success: true })
}
```

**Store signups**: Airtable OR Notion OR simple Google Sheet (via Zapier)

### **Analytics**

**Vercel Analytics** (built-in):
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Plausible** (optional, privacy-friendly):
```html
<!-- app/layout.tsx -->
<Script src="https://plausible.io/js/script.js" data-domain="slydes.io" />
```

---

## 🚀 **DEPLOYMENT**

### **Vercel Setup**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Deploy
vercel --prod
```

**Environment Variables** (add via Vercel dashboard):
```
RESEND_API_KEY=re_...
NEXT_PUBLIC_SITE_URL=https://slydes.io
```

### **Custom Domain**

**In Vercel**:
1. Go to project settings
2. Add domain: `slydes.io`
3. Add DNS records as instructed

**DNS Settings** (at domain registrar):
```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

---

## 📊 **SUCCESS METRICS**

### **Week 1 Goals**

- [ ] Site live at slydes.io
- [ ] All 6 pages functional
- [ ] Waitlist form working
- [ ] 10 signups

### **Month 1 Goals**

- [ ] 100 waitlist signups
- [ ] Demo videos replaced with pro versions
- [ ] 3+ customer examples live
- [ ] <2s page load time

### **Month 3 Goals**

- [ ] 1,000 signups
- [ ] Conversion rate >5%
- [ ] All content finalized
- [ ] Ready for Product Hunt launch

---

## 🔥 **QUICK START COMMAND**

```bash
# Clone starter (or create fresh)
npx create-next-app@latest slydes-website \
  --typescript \
  --tailwind \
  --app \
  --src-dir

cd slydes-website

# Install deps
npm install framer-motion react-hook-form resend

# Copy brand config
# (tailwind.config.ts with colors)

# Start building
npm run dev
```

**First task**: Build homepage hero section with gradient CTA button.

---

## ✅ **CHECKLIST: READY TO BUILD?**

**Tech Stack**: ✅ Defined (Next.js 15 + Tailwind + Framer Motion)

**Design System**: ✅ Colors, fonts, components specified

**Content**: ✅ Wireframes + copy framework (iterate as we build)

**Assets**: ✅ Placeholder strategy defined (text logo, screen recordings)

**Hosting**: ✅ Vercel (one command deploy)

**Integrations**: ✅ Resend for email, Vercel Analytics

**Build Plan**: ✅ 14-day phased approach

---

## 🎉 **ANSWER: CAN WE BUILD NOW?**

# **YES! 100%** 🚀

**We have everything to start building RIGHT NOW.**

**Strategy**:
1. Ship MVP in 2 weeks (placeholder content)
2. Iterate based on real feedback
3. Polish as we go

**That's the "ship it" mentality.**

---

*Slydes.io Website Technical Specification*  
*Ready to build: YES*  
*Let's go! 🔥*



