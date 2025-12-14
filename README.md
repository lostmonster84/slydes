# Slydes.io Marketing Website

Built for the Future.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Email**: Resend (via `mail.slydes.io`)
- **Payments**: Stripe
- **Hosting**: Vercel

## Getting Started

```bash
npm install
cp .env.example .env  # Then fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `SETUP.md` for full details. Required variables:

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Email sending (contact, investor, partner forms) |
| `NEXT_PUBLIC_SITE_URL` | Site URL for redirects |
| `INVESTOR_PAGE_PASSWORD` | Password for /investors page |
| `STRIPE_SECRET_KEY` | Stripe payments (optional) |

## Email Configuration

All emails sent via Resend using verified domain `mail.slydes.io`:

- **Contact Form** → `contact@mail.slydes.io` → `james@lostmonter.io`
- **Investor Enquiry** → `investors@mail.slydes.io` → `james@lostmonter.io`
- **Partner Application** → `contact@mail.slydes.io` → `james@lostmonter.io`
- **Waitlist** → Adds to Resend Audience (ID: `29817019-d28f-4bbe-8a64-3f4c64d6b8fc`)

## Brand Colors

- Future Black: `#0A0E27`
- Leader Blue: `#2563EB`
- Electric Cyan: `#06B6D4`
- Steel Gray: `#64748B`
- Deep Slate: `#1E293B`

## Build Status

🚀 In development





