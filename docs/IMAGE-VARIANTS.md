# Cloudflare Images – Variants (Slydes Defaults)

## TL;DR
We create **3 named image variants** in Cloudflare Images so the app can request the “right size” automatically:

- **thumb**: small (lists, inventory thumbnails)
- **card**: medium (editor cards, drawers)
- **hero**: large (full-screen 9:16 backgrounds)

## Why variants exist (simple)
We upload an image once, then Cloudflare serves:
- the right size for the device/screen
- a modern format (smaller file when possible)

So pages load fast without you manually resizing images.

## Create these variants in Cloudflare
In Cloudflare Dashboard:

- **Images** → **Variants** → **Create variant**

Create the following:

### 1) `thumb`
- **width**: 320
- **height**: 568
- **fit**: cover

### 2) `card`
- **width**: 540
- **height**: 960
- **fit**: cover

### 3) `hero` (default)
- **width**: 1080
- **height**: 1920
- **fit**: cover

## Notes
- We use **9:16** sizes because Slydes is vertical-first.
- `fit=cover` means “fill the frame; crop edges if needed.”


