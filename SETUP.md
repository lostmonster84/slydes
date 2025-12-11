# Slydes.io Website - Setup Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env` file in the root directory:

```env
RESEND_API_KEY=re_your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Getting a Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create a new API key
3. Add to `.env` file

---

## Project Structure

```
slydes-website/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── how-it-works/      # How It Works page
│   │   ├── examples/          # Examples gallery
│   │   ├── pricing/           # Pricing page
│   │   ├── signup/            # Signup/waitlist
│   │   ├── dashboard/         # Dashboard (basic)
│   │   └── api/
│   │       └── waitlist/      # Waitlist API endpoint
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── sections/          # Homepage sections
│   │   └── ui/                # Button, etc.
│   └── lib/
│       └── fonts.ts           # Google Fonts config
├── public/                     # Static assets
└── tailwind.config.ts         # Tailwind with brand colors
```

---

## Brand Colors

```css
Future Black: #0A0E27
Leader Blue: #2563EB
Electric Cyan: #06B6D4
Steel Gray: #64748B
Deep Slate: #1E293B
```

---

## Pages

- ✅ Homepage (Hero, Problem, Video Demo, Features, Social Proof, CTA)
- ✅ How It Works (3-step process)
- ✅ Examples (Gallery with filters)
- ✅ Pricing (3 tiers + FAQ)
- ✅ Signup (Waitlist form with validation)
- ✅ Dashboard (Basic empty state)

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables on Vercel

Add these in your Vercel project settings:
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Custom Domain

1. Go to Vercel project settings
2. Add domain: `slydes.io`
3. Update DNS records as instructed

---

## What's Next

### Immediate (Week 1)
- [ ] Get Resend API key
- [ ] Record demo videos (or use placeholders)
- [ ] Deploy to Vercel
- [ ] Add custom domain

### Soon (Week 2-4)
- [ ] Replace placeholder videos with pro versions
- [ ] Add real customer examples
- [ ] Integrate email storage (Airtable/Notion)
- [ ] Add analytics (Plausible)

### Later (Month 2+)
- [ ] A/B test CTAs
- [ ] Add blog
- [ ] Create customer testimonials
- [ ] Advanced animations

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Email**: Resend
- **Hosting**: Vercel

---

## Need Help?

Check the main docs:
- [BRAND-GUIDELINES.md](../docs/BRAND-GUIDELINES.md)
- [WEBSITE-WIREFRAME.md](../docs/WEBSITE-WIREFRAME.md)
- [BUILD-NOW-GUIDE.md](../docs/BUILD-NOW-GUIDE.md)

---

**Status**: 🔥 Ready to deploy!

Built for 2030. Let's go! 🚀

