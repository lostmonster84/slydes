# CONSTX — Slydes Consistency Framework

> **Purpose:** A universal checklist to audit any Slydes page for visual and structural consistency.
> **Usage:** Say "run CONSTX on [page/section]" and I will systematically check every item below.
> **Last Updated:** December 15, 2025

---

## Quick Reference: Brand Colors

| Name | Hex | Tailwind | Use |
|------|-----|----------|-----|
| Future Black | `#0A0E27` | Custom | Logo, hero text |
| Leader Blue | `#2563EB` | `blue-600` | Primary actions, gradients |
| Electric Cyan | `#06B6D4` | `cyan-500` | Gradient endpoints, accents |
| Pure White | `#FFFFFF` | `white` | Backgrounds, text on dark |
| Apple Graphite (dark bg) | `#1c1c1e` | Custom | Dark mode page background |
| Apple Graphite (dark card) | `#2c2c2e` | Custom | Dark mode cards/sidebar |

### Banned Colors
These should NEVER appear in Slydes UI (except for external brand avatars):
- `amber-*`
- `orange-*` 
- `purple-*`
- `indigo-*`
- `red-*` (except for destructive actions)
- `yellow-*`

---

## 1. PAGE STRUCTURE

Every HQ page MUST have:

### 1.1 Outer Wrapper
```tsx
<div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
```

### 1.2 Sidebar
```tsx
<aside className="w-72 bg-white border-r border-gray-200 flex flex-col dark:bg-[#2c2c2e] dark:border-white/10">
```

### 1.3 Header Bar
```tsx
<header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
```

### 1.4 Content Area
```tsx
<div className="flex-1 overflow-y-auto p-8">
  <div className="max-w-6xl">
    {/* Content here */}
  </div>
</div>
```

### 1.5 Ambient Glow (REQUIRED)
Must appear before the final closing `</div>`:
```tsx
{/* Ambient glow */}
<div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
<div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
```

---

## 2. TYPOGRAPHY

### 2.1 Font Families
| Purpose | Class | Font |
|---------|-------|------|
| Headlines, titles | `font-display` | Space Grotesk |
| Body, UI | `font-sans` | Inter |
| Numbers, stats, code | `font-mono` | JetBrains Mono |

### 2.2 Type Scale
| Element | Classes |
|---------|---------|
| Page title (h1) | `text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white` |
| Section title | `text-lg font-display font-bold` |
| Card title | `text-base font-display font-bold` |
| Numbers/stats (large) | `text-2xl font-mono font-bold` |
| Numbers/stats (hero) | `text-7xl md:text-8xl font-mono font-bold` |
| Labels (uppercase) | `text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider font-semibold` |
| Body text | `text-sm text-gray-600 dark:text-white/60` |
| Small/meta | `text-xs text-gray-500 dark:text-white/50` |

---

## 3. BUTTONS

### 3.1 Primary CTA (Gradient)
The main action button. Use for: Create, Upgrade, Fix, main page action.
```tsx
<button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15">
  Action
</button>
```

### 3.2 Secondary (Gray)
Supporting actions. Use for: Cancel, Compare, Export, Preview.
```tsx
<button className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
  Secondary
</button>
```

### 3.3 Tertiary (Blue Ghost)
Subtle brand-colored action. Use for: Export, optional actions.
```tsx
<button className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/20 dark:hover:bg-blue-500/20">
  Tertiary
</button>
```

### 3.4 Dark Action
High contrast action. Use for: Reply, Confirm, primary in-card actions.
```tsx
<button className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90">
  Dark Action
</button>
```

### 3.5 Link Button (with arrow)
```tsx
<a className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
  <span>Action</span>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
</a>
```

---

## 4. CARDS

### 4.1 Standard Card
```tsx
<div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
```

### 4.2 Large Card
```tsx
<div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
```

### 4.3 Interactive Card (with hover)
```tsx
<div className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all hover:shadow-xl hover:shadow-blue-500/5 dark:bg-[#2c2c2e] dark:border-white/10 dark:hover:border-white/20 dark:hover:shadow-blue-500/10">
```

### 4.4 Accent Card (with top gradient bar)
```tsx
<div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
  <div className="p-6">
    {/* Content */}
  </div>
</div>
```

### 4.5 Card with Section Header
```tsx
<div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
  <div className="p-6 border-b border-gray-200 dark:border-white/10">
    <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-white/60">Label</div>
    <div className="mt-1 flex items-center gap-2">
      <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* icon path */}
      </svg>
      <div className="text-lg font-display font-bold">Title</div>
    </div>
  </div>
  <div className="p-6">
    {/* Content */}
  </div>
</div>
```

---

## 5. BADGES & PILLS

### 5.1 Count Badge (Neutral)
```tsx
<span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full dark:bg-white/20 dark:text-white/80">2</span>
```

### 5.2 New/Unread Badge (Brand)
```tsx
<span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 dark:bg-blue-500/15 dark:text-cyan-300 dark:border-blue-500/20">
  3 new
</span>
```

### 5.3 Status: Live
```tsx
<div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full dark:bg-emerald-500/15 dark:border-emerald-500/30">
  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
  <span className="text-[10px] text-emerald-700 font-medium dark:text-emerald-300">Live</span>
</div>
```

### 5.4 Status: Locked
```tsx
<span className="text-[11px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full dark:bg-white/20 dark:text-white/80">
  Locked
</span>
```

### 5.5 Label Pill (Blue)
```tsx
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider dark:bg-blue-500/10 dark:text-cyan-300">
  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400" />
  Label
</span>
```

---

## 6. NAVIGATION

### 6.1 Sidebar Logo
```tsx
<div className="p-5 border-b border-gray-200 dark:border-white/10">
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
      </svg>
    </div>
    <div className="min-w-0">
      <div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Slydes</div>
      <div className="text-xs text-gray-500 dark:text-white/50 -mt-0.5">HQ</div>
    </div>
  </div>
</div>
```

### 6.2 Nav Item (Default)
```tsx
<a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* icon */}
  </svg>
  <span className="text-sm font-medium">Label</span>
</a>
```

### 6.3 Nav Item (Active)
```tsx
<a className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-900 cursor-pointer relative dark:bg-white/10 dark:text-white">
  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full" />
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* icon */}
  </svg>
  <span className="text-sm font-medium">Label</span>
</a>
```

---

## 7. FORM ELEMENTS

### 7.1 Toggle (Segmented Control)
```tsx
<div className="flex items-center gap-1 rounded-xl bg-gray-200 p-1 dark:bg-white/10">
  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-gray-900 shadow-sm dark:bg-[#3a3a3c] dark:text-white">
    Active
  </button>
  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-white/50 dark:hover:text-white">
    Inactive
  </button>
</div>
```

### 7.2 Plan Toggle (Free/Creator)
```tsx
<div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-white/10">
  <button className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
    isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
  } dark:${isActive ? 'bg-[#2c2c2e] text-white' : 'text-white/60 hover:text-white'}`}>
    Option
  </button>
</div>
```

---

## 8. ICONS

### 8.1 Sizes
| Context | Size |
|---------|------|
| Navigation | `w-5 h-5` |
| Section header accent | `w-4 h-4` |
| Button inline | `w-4 h-4` or `w-5 h-5` |
| Info button | `w-4 h-4` |

### 8.2 Section Header Icon Pattern
Always use brand color for section header icons:
```tsx
<svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  {/* path */}
</svg>
```

### 8.3 Info Button
```tsx
<button
  type="button"
  title="Label: Description"
  className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-transparent text-gray-400 hover:text-gray-700 transition-colors dark:text-white/35 dark:hover:text-white/70"
>
  <Info className="w-4 h-4" />
</button>
```

---

## 9. SPECIAL COMPONENTS

### 9.1 Plan Card (Sidebar)
```tsx
<div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 border border-gray-200 shadow-sm dark:from-blue-600/12 dark:via-white/5 dark:to-cyan-600/12 dark:border-white/10">
  <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-1 dark:text-blue-300">Plan</div>
  <div className="text-base font-bold text-gray-900 dark:text-white">{planName}</div>
  <div className="mt-1 text-xs text-gray-600 dark:text-white/60">{planDescription}</div>
  {/* Toggle + Upgrade button if applicable */}
</div>
```

### 9.2 User Profile (Sidebar Footer)
```tsx
<div className="p-3 border-t border-gray-200 dark:border-white/10">
  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer dark:hover:bg-white/10">
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[brand-color-1] to-[brand-color-2] flex items-center justify-center text-white font-bold text-sm">
      {initial}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-900 truncate dark:text-white">{name}</div>
      <div className="text-xs text-gray-500 truncate dark:text-white/50">{url}</div>
    </div>
  </div>
</div>
```

### 9.3 Unread Indicator Dot
```tsx
<span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shrink-0" />
```

### 9.4 Progress Bar
```tsx
<div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-white/10">
  <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" style={{ width: `${percent}%` }} />
</div>
```

---

## 10. DARK MODE RULES

### 10.1 Color Mappings
| Light | Dark |
|-------|------|
| `bg-gray-50` | `dark:bg-[#1c1c1e]` |
| `bg-white` | `dark:bg-[#2c2c2e]` |
| `border-gray-200` | `dark:border-white/10` |
| `text-gray-900` | `dark:text-white` |
| `text-gray-600` | `dark:text-white/60` |
| `text-gray-500` | `dark:text-white/50` |
| `text-gray-400` | `dark:text-white/40` |
| `text-blue-600` | `dark:text-cyan-400` |
| `text-blue-700` | `dark:text-cyan-300` or `dark:text-blue-300` |
| `bg-blue-50` | `dark:bg-blue-500/15` |
| `border-blue-100` | `dark:border-blue-500/20` |
| `bg-gray-100` | `dark:bg-white/10` |
| `hover:bg-gray-100` | `dark:hover:bg-white/10` |
| `hover:bg-gray-200` | `dark:hover:bg-white/15` |

### 10.2 Dark Mode Toggle Background
Active state in dark mode uses `dark:bg-[#3a3a3c]` for elevated surfaces.

---

## 11. AUDIT CHECKLIST

When running CONSTX, check each item:

### Structure
- [ ] Outer wrapper has correct classes
- [ ] Sidebar has correct classes
- [ ] Header has correct classes  
- [ ] Content has `max-w-6xl` wrapper
- [ ] Ambient glow divs present

### Colors
- [ ] No banned colors (amber, orange, purple, indigo)
- [ ] Primary CTAs use `from-blue-600 to-cyan-500`
- [ ] Dark mode uses `#1c1c1e` and `#2c2c2e`
- [ ] Section icons use `text-blue-600 dark:text-cyan-400`

### Typography
- [ ] Page title uses `font-display`
- [ ] Section titles use `font-display`
- [ ] Numbers use `font-mono`
- [ ] Labels use uppercase tracking-wider

### Buttons
- [ ] Primary CTAs have gradient + shadow
- [ ] Secondary buttons have gray bg
- [ ] All buttons have rounded-xl
- [ ] Button styles are consistent with type

### Cards
- [ ] Cards have correct border radius (2xl or 3xl)
- [ ] Cards have shadow-sm
- [ ] Dark mode cards use `#2c2c2e`

### Navigation
- [ ] Active nav has left gradient bar
- [ ] Nav items have correct hover states
- [ ] Badges use brand colors (not amber)

### Special
- [ ] Plan card has gradient background
- [ ] Unread indicators use brand gradient dot
- [ ] Info buttons are transparent with hover

---

## 12. RUNNING CONSTX

To audit a page, I will:

1. **Read the file** completely
2. **Check each section** of this framework
3. **Report findings** in a table:

| Issue | File | Line | Expected | Found | Severity |
|-------|------|------|----------|-------|----------|
| Missing ambient glow | hq-inbox | - | 2 glow divs | 0 | HIGH |
| Wrong button style | hq-inbox | 297 | Primary gradient | Dark action | MEDIUM |

4. **Propose fixes** for each issue
5. **Apply fixes** if approved

---

## 13. EDITOR — Apple HIG (macOS Desktop Feel)

**Goal**: The editor chrome should feel like a native macOS app (Finder/Notes/Raycast), **not** iOS Settings.

### 13.1 Non-negotiables
- **Density**: roomy; avoid cramped list rows on desktop.
- **Materials**: translucent panels (frosted glass) + graphite dark surfaces (not pure black).
- **Controls**: segmented controls, macOS-sized switches, inset inputs.
- **Selection**: solid tint + subtle ring (avoid gradients as selection states).
- **Drag & drop**: “lift” preview + smooth indicator; **no layout shift**.
- **Inspector labels**: sentence case for form labels (macOS convention).

### 13.2 Checklist (Editor screens)
- [ ] Inspector uses macOS segmented control (sliding selection pill)
- [ ] Form labels are sentence case, ~13px, not all-caps
- [ ] Inputs are inset (subtle inner shadow) with visible focus ring
- [ ] Switches are macOS-sized (~51×31) with solid active color
- [ ] Selected frame uses solid accent tint (≈8–10% opacity) + subtle ring
- [ ] Reorder supports drag from the whole card (grip is optional affordance)
- [ ] Drag preview “lifts” (custom drag image) and drop indicator animates without pushing items

---

## Version History

- **v1.0** (Dec 14, 2025): Initial framework created after consistency audit failures






