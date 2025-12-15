# Slydes – Tech Stack (Simple)

## TL;DR (what we’re using and why)

- **Next.js**: our web apps (Studio + Marketing).
- **Supabase**: login + database (where we store your Slydes data).
- **Cloudflare Stream**: videos (upload → processing → fast streaming playback).
- **Cloudflare Images**: images (upload once → automatic resizing + modern formats).
- **Cloudflare (Edge)**: protection + speed (WAF, bot protection, rate limits).
- **Cloudflare R2**: file storage for things that aren’t “streaming video” (originals/exports/posters).

## Simple definitions (what each thing is for)

### Next.js (Studio + Marketing)
- **What it is**: the framework that runs our websites/apps.
- **What we use it for**: pages, API routes, and server-side logic.

### Supabase (Auth + Postgres)
- **What it is**: hosted Postgres + authentication.
- **What we use it for**:
  - Who is logged in (Studio)
  - Storing slydes/frames + their media ids

### Cloudflare Stream (videos)
- **What it is**: video service that automatically processes big uploads into streamable formats.
- **What we use it for**:
  - Creators upload videos
  - Stream converts them into multiple qualities
  - Viewers get smooth playback (auto adapts to network/device)

### Cloudflare Images (images)
- **What it is**: image hosting that can resize/optimize images automatically.
- **What we use it for**:
  - Upload an image once
  - Serve it at the right size (mobile/desktop)
  - Auto-use modern formats (smaller, faster)

**Our standard sizes**:
- `thumb` (small)
- `card` (medium)
- `hero` (full-screen 9:16)

See `docs/IMAGE-VARIANTS.md` for the exact Cloudflare settings.

### Cloudflare Edge (security + speed)
- **What it is**: Cloudflare’s global edge network.
- **What we use it for**:
  - WAF (blocks obvious attacks)
  - Bot protection (reduces scraping)
  - Rate limiting (prevents abuse)

### Cloudflare R2 (storage)
- **What it is**: object storage (like S3).
- **What we use it for**:
  - “Files we keep” that aren’t served as streaming video (original uploads, exports, posters if needed)


