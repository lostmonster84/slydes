# Deployment Checklist (Keys + Env Vars + Setup)

This is the **single source of truth** for everything you need to set up and deploy Slydes (Studio + Marketing), including **all keys**, **all env vars**, and the **exact dashboards** where they live.

---

## TL;DR (do these in order)

1. **Create/confirm accounts**
2. **Create keys (Supabase + Cloudflare)**
3. **Set env vars in Vercel (Studio + Marketing)**
4. **Run Supabase migrations**
5. **Create Cloudflare Images variants**
6. **Upload media in Studio**
7. **Verify playback on Marketing**

---

## 1) Accounts you need

- **Supabase**: database + auth
- **Cloudflare**: Stream (video), Images (image resizing), edge security
- **Vercel**: hosting Studio + Marketing

---

## 2) Supabase (keys + what they’re for)

### Keys you will create/copy
- **`NEXT_PUBLIC_SUPABASE_URL`**
  - **What it is**: your Supabase project URL
  - **Where**: Supabase → Project Settings → API
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
  - **What it is**: public key used by the browser + SSR auth flows
  - **Where**: Supabase → Project Settings → API
- **`SUPABASE_SERVICE_ROLE_KEY`** (**Marketing only**)
  - **What it is**: server-only admin key (bypasses RLS)
  - **Where**: Supabase → Project Settings → API
  - **Important**: never expose this to the client; only set it in server environments.

### Supabase DB tasks you must do
- **Run migrations (Studio migrations folder)**:
  - `apps/studio/supabase/migrations/001_create_profiles.sql`
  - `apps/studio/supabase/migrations/002_create_organizations.sql`
  - `apps/studio/supabase/migrations/003_create_slydes_analytics.sql`
  - `apps/studio/supabase/migrations/004_add_home_slyde_event_types.sql`
  - `apps/studio/supabase/migrations/005_add_organization_home_video.sql`
  - `apps/studio/supabase/migrations/006_add_frame_media.sql`
  - `apps/studio/supabase/migrations/007_add_frame_image_id.sql`
  - `apps/studio/supabase/migrations/008_add_frame_video_status.sql`

---

## 3) Cloudflare (keys + what they’re for)

### Cloudflare Stream (videos)
- **What it does**: you upload a video once → Cloudflare **processes** it → playback is fast and auto-adjusts quality.

#### Keys you will create/copy
- **`CLOUDFLARE_ACCOUNT_ID`**
  - **What it is**: your Cloudflare account id
  - **Where**: Cloudflare Dashboard → (account home / API section)
- **`CLOUDFLARE_STREAM_TOKEN`** (**Studio only**)
  - **What it is**: lets our server create “direct upload links” for video
  - **Where**: Cloudflare Dashboard → API Tokens (create a token)
- **`CLOUDFLARE_STREAM_SIGNING_KEY`** (**Marketing only**)
  - **What it is**: secret used to mint short-lived viewing tokens (prevents hotlinking)
  - **Where**: You generate this yourself (it’s an app secret). Cloudflare does not reliably expose a dashboard UI for it.
  - **How** (example): `openssl rand -base64 32`
- **Optional: `CLOUDFLARE_STREAM_KEY_ID`**
  - **What it is**: key id (“kid”) (only needed if you implement key rotation with multiple keys)

### Cloudflare Images (images)
- **What it does**: upload an image once → Cloudflare serves the right size/format automatically.

#### Keys you will create/copy
- **`CLOUDFLARE_IMAGES_TOKEN`** (**Studio only**)
  - **What it is**: lets our server create “direct upload links” for images
  - **Where**: Cloudflare Dashboard → API Tokens
- **`CLOUDFLARE_IMAGES_ACCOUNT_HASH`** (**Studio + Marketing**)
  - **What it is**: the `imagedelivery.net/...` account hash used to build image URLs
  - **Where**: Cloudflare Images → “Delivery URL” / docs section (shown in your dashboard)
- **`CLOUDFLARE_IMAGES_DEFAULT_VARIANT`** (optional)
  - **What it is**: default variant name used if none is specified
  - **Recommended**: `hero`

### Cloudflare Images variants you must create
Create these variants in Cloudflare:
- `thumb` (small)
- `card` (medium)
- `hero` (full screen)

Exact settings are in: `docs/IMAGE-VARIANTS.md`

---

## 4) Vercel (what to set, and where)

You will have **two Vercel projects** (recommended):
- **Studio**: `apps/studio`
- **Marketing**: `apps/marketing`

Set env vars in **each** project’s Vercel dashboard:

### Option A (recommended): push `.env.local` → Vercel automatically

Because `.env.local` files are typically **gitignored**, we provide a local script that pushes them to Vercel after you link each app.

1) Link each app to its Vercel project (one-time):

```bash
cd apps/marketing && vercel link
cd ../studio && vercel link
```

2) Push env vars for both apps:

```bash
pnpm vercel:env:push --env production
```

Notes:
- This uses `pnpm dlx vercel-env-push` under the hood (downloads on first run).
- You can target a single app: `pnpm vercel:env:push --env preview --apps studio`

### Vercel env vars — Studio (`apps/studio`)
Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_STREAM_TOKEN`
- `CLOUDFLARE_IMAGES_TOKEN`
- `CLOUDFLARE_IMAGES_ACCOUNT_HASH`

Optional:
- `CLOUDFLARE_IMAGES_DEFAULT_VARIANT` (default: `hero`)

### Vercel env vars — Marketing (`apps/marketing`)
Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDFLARE_STREAM_SIGNING_KEY`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_STREAM_TOKEN` (read-only is fine; used to check “processing vs ready”)
- `CLOUDFLARE_IMAGES_ACCOUNT_HASH`

Optional:
- `CLOUDFLARE_STREAM_KEY_ID`
- `CLOUDFLARE_IMAGES_DEFAULT_VARIANT` (default: `hero`)

---

## 5) Smoke tests (quick “did it work?”)

### Test 1 — Studio upload works
1. Log in to Studio
2. Go to **Settings → Media**
3. Use the demo tool to:
   - upload a **video** and attach to a frame
   - upload an **image** and attach to a frame (choose `thumb/card/hero`)

### Test 2 — Marketing playback works
1. Open: `/{businessSlug}/{slydeSlug}`
2. When a frame is video-backed, you should briefly see:
   - “Loading video…” then the Stream player loads
3. Images should render immediately.

---

## Notes / gotchas (so you don’t lose hours)

- **Never** put `SUPABASE_SERVICE_ROLE_KEY` in Studio client code.
- **Tokenized playback** means videos won’t load without `CLOUDFLARE_STREAM_SIGNING_KEY` in Marketing.
- If you see “Loading video…” forever, it’s almost always:
  - missing `CLOUDFLARE_STREAM_SIGNING_KEY`, or
  - the Stream signing key is wrong, or
  - Cloudflare Stream tokenized playback expects a token but you didn’t include one (or it expired).


