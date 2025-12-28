# Slyde Cover Architecture

## The Insight

Every Slyde needs a "cover" - a landing screen before frames. This solves multiple UX problems at once.

---

## Current Architecture (Problems)

```
Home → tap Slyde → Frame 1 → Frame 2 → Frame 3...
```

**Problems:**
1. **Where does Info go?** - On every frame? Cluttered. On first frame only? Inconsistent.
2. **Where does Location go?** - Same problem. Separate button? In Info sheet?
3. **What gets shared?** - A frame URL? But frames are internal navigation.
4. **Action stack is confusing** - Too many buttons, unclear what's Slyde-level vs frame-level.
5. **No "landing" experience** - Users jump straight into content without context.
6. **FAQs per-frame vs per-Slyde** - Unclear where they belong.

---

## New Architecture (Slyde Cover Model)

```
Home → tap Slyde → SLYDE COVER → swipe up → Frame 1 → Frame 2...
```

### The Slyde Cover

A dedicated "landing page" for each Slyde that:
- Sets the tone/vibe before diving into frames
- Shows Slyde name, description, background
- Contains ALL the "about this Slyde" info
- Is the shareable URL endpoint

---

## What This Solves

### 1. **Location Problem** ✅
Location lives on the Slyde Cover. Not on frames. Not in a separate button.
- Cover shows address, map link
- Frames are content-only

### 2. **Info Button Problem** ✅
Info button on Cover opens sheet with:
- Business description
- Location/map
- Contact details (phone, email, WhatsApp)
- FAQs for this Slyde

Frames don't need an Info button - you've already seen the info.

### 3. **Sharing Problem** ✅
Share URL = Slyde Cover URL
- `slydes.io/highland-motors/camping` → lands on Camping cover
- User sees the vibe, then swipes into frames
- No confusion about "which frame am I sharing?"

### 4. **Action Stack Clarity** ✅

**On Slyde Cover:**
| Button | Purpose |
|--------|---------|
| Share | Share this Slyde |
| Heart | Like this Slyde |
| Connect | Social links (if exist) |
| Info | Full details sheet |

**On Frames:**
| Button | Purpose |
|--------|---------|
| Heart | Like this frame (or just count) |
| Video | Demo video (if exists) |

Minimal on frames. They're for consuming content, not actions.

### 5. **FAQs Location** ✅
FAQs are per-Slyde, shown in Cover's Info sheet.
Makes sense - "Questions about Camping" not "Questions about Frame 3".

### 6. **Mental Model Clarity** ✅
- **Home** = Business hub (all Slydes)
- **Slyde Cover** = Experience landing page (about this Slyde)
- **Frames** = Content inside the experience

Users understand: "I'm exploring the Camping experience" not "I'm on slide 3 of something".

### 7. **Deep Linking** ✅
One URL per Slyde: `slydes.io/org/slyde-name`
- Always lands on Cover
- Frames are internal navigation (swipe-based)
- No need for `?frame=3` complexity

### 8. **Analytics Clarity** ✅
- Track Slyde views (Cover impressions)
- Track frame engagement (swipe-through rate)
- Track shares (Slyde-level)
- Track hearts (can be Slyde or frame level)

### 9. **Editor UX Clarity** ✅
When editing a Slyde in Studio:
- **Slyde selected** → Edit Cover (background, name, description, location, FAQs)
- **Frame selected** → Edit Frame (content, CTA, demo video)

Clear separation. No confusion about "what am I editing?"

---

## Data Model Changes

### HomeSlydeCategory (Slyde)

```typescript
interface HomeSlydeCategory {
  id: string
  name: string
  description?: string
  icon?: string

  // Cover background
  coverBackgroundType: 'video' | 'image' | 'color'
  coverBackgroundUrl?: string
  coverBackgroundColor?: string

  // Location (Slyde-level)
  locationAddress?: string
  locationLat?: number
  locationLng?: number

  // Contact override (optional - defaults to org)
  contactPhone?: string
  contactEmail?: string
  contactWhatsapp?: string

  // Frames inside this Slyde
  frames: FrameData[]
}
```

### FrameData (simplified)

```typescript
interface FrameData {
  id: string
  title: string
  subtitle?: string

  // Visual
  backgroundType: 'video' | 'image' | 'color'
  backgroundUrl?: string

  // CTA
  cta?: CTA

  // Optional demo video
  demoVideoUrl?: string

  // Hearts are frame-level
  heartCount: number
}
```

Note: No FAQs, no location, no contact on frames. That's all Cover-level.

---

## Navigation Flow

### Public Viewer

```
1. Land on Home (slydes.io/highland-motors)
   - See business name, categories drawer

2. Tap a Slyde (e.g., "Camping")
   - Transition to Slyde Cover
   - See Camping background, name, description
   - Action stack: Share, Heart, Connect, Info

3. Swipe up or tap "Explore"
   - Enter frames carousel
   - Minimal action stack: Heart, Video (if exists)
   - Swipe through frames

4. Swipe down or tap back
   - Return to Slyde Cover

5. Tap back from Cover
   - Return to Home
```

### Studio Editor

```
Navigator:
▼ Home
▼ Slydes
    ▼ Camping (Slyde Cover)
        Frame 1
        Frame 2
        + Add Frame
    ▼ Just Drive (Slyde Cover)
        ...

Clicking "Camping" → Edits Cover (background, location, FAQs)
Clicking "Frame 1" → Edits Frame (content, CTA)
```

---

## URL Structure

| URL | What it shows |
|-----|---------------|
| `slydes.io/highland-motors` | Home |
| `slydes.io/highland-motors/camping` | Camping Slyde Cover |
| `slydes.io/highland-motors/just-drive` | Just Drive Slyde Cover |

No frame URLs. Frames are internal navigation.

---

## Migration Path

1. **Phase 1**: Add Cover data to Slyde model
   - `coverBackgroundType`, `coverBackgroundUrl`
   - Default to first frame's background if not set

2. **Phase 2**: Build SlydeCover component
   - Similar to HomeSlydeScreen but for individual Slyde
   - Has swipe-up to enter frames

3. **Phase 3**: Update navigation
   - Home → tap Slyde → SlydeCover → swipe → Frames
   - Update back button logic

4. **Phase 4**: Simplify frame action stack
   - Remove Info, Connect, Share from frames
   - Keep only Heart, Video

5. **Phase 5**: Update Studio editor
   - Slyde selection = Cover editing
   - Frame selection = Frame editing

---

## Open Questions

1. **Should Cover and Frame 1 be the same?**
   - Option A: Cover is separate, Frame 1 is first content
   - Option B: Cover IS Frame 1, just with extra UI
   - Recommendation: Option A - cleaner separation

2. **Hearts: Slyde-level or Frame-level?**
   - Option A: One heart count for entire Slyde
   - Option B: Heart count per frame
   - Recommendation: Both - aggregate to Slyde, track per-frame

3. **Auto-advance on Cover?**
   - Probably not - Cover is a pause moment
   - Auto-advance starts when entering frames

---

## Summary

The Slyde Cover model creates a clear hierarchy:

| Level | Purpose | Contains |
|-------|---------|----------|
| **Home** | Business identity | All Slydes, business info, social links |
| **Slyde Cover** | Experience landing | Background, name, location, FAQs, contact |
| **Frames** | Content | Visual content, CTAs, demo videos |

This solves: location placement, Info button confusion, sharing clarity, action stack simplification, editor UX, and deep linking.

One insight, many solutions.
