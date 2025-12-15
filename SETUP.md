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
# Required for all email functionality
RESEND_API_KEY=re_your_api_key_here

# Site URL (used for Stripe redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Override default contact email (defaults to james@lostmonter.io)
CONTACT_EMAIL=james@lostmonter.io

# Optional: Override partner application email (defaults to james@lostmonter.io)
PARTNER_EMAIL=james@lostmonter.io

# Required for investor page password protection
INVESTOR_PAGE_PASSWORD=your_secure_password

# Required for Stripe payments (Founding Member checkout)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Media (Cloudflare)
# - Stream: video upload + processing + playback
# - Images: image upload + resizing/format
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_STREAM_TOKEN=your_stream_api_token
# Tokenized playback signing secret (generate yourself; do not paste into chat)
# Example: `openssl rand -base64 32`
CLOUDFLARE_STREAM_SIGNING_KEY=your_generated_signing_secret
CLOUDFLARE_IMAGES_TOKEN=your_images_api_token
CLOUDFLARE_IMAGES_ACCOUNT_HASH=your_imagedelivery_hash
CLOUDFLARE_IMAGES_DEFAULT_VARIANT=hero
```

### Email Configuration

All emails are sent via **Resend** using the verified domain `mail.slydes.io`:

| Form | From Address | Destination |
|------|--------------|-------------|
| Contact Form | `contact@mail.slydes.io` | `CONTACT_EMAIL` env var |
| Investor Enquiry | `investors@mail.slydes.io` | `CONTACT_EMAIL` env var |
| Partner Application | `contact@mail.slydes.io` | `PARTNER_EMAIL` env var |
| Waitlist | N/A (adds to Resend Audience) | Audience ID: `29817019-d28f-4bbe-8a64-3f4c64d6b8fc` |

### Getting a Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (`mail.slydes.io`)
3. Create a new API key
4. Add to `.env` file

### Getting Stripe Keys

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Copy the Secret Key to `STRIPE_SECRET_KEY`
4. Set up a webhook endpoint and copy the signing secret to `STRIPE_WEBHOOK_SECRET`

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

**Required:**
- `RESEND_API_KEY` - For all email functionality
- `NEXT_PUBLIC_SITE_URL` - Set to `https://slydes.io`
- `INVESTOR_PAGE_PASSWORD` - Password for investor materials access

**For Stripe Payments:**
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

**Optional (have defaults):**
- `CONTACT_EMAIL` - Override contact form destination (default: `james@lostmonter.io`)
- `PARTNER_EMAIL` - Override partner application destination (default: `james@lostmonter.io`)

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
- **Videos**: Cloudflare Stream (uploads + automatic quality/downsize)
- **Images**: Cloudflare Images (uploads + automatic resizing/format)

---

## Need Help?

Check the main docs:
- [BRAND-GUIDELINES.md](../docs/BRAND-GUIDELINES.md)
- [WEBSITE-WIREFRAME.md](../docs/WEBSITE-WIREFRAME.md)
- [BUILD-NOW-GUIDE.md](../docs/BUILD-NOW-GUIDE.md)

---

**Status**: 🔥 Ready to deploy!

Built for the Future. Let's go! 🚀

