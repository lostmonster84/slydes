# Slydes iOS App

Native iOS consumer app for discovering experience-first businesses.

## Overview

This is the consumer-facing iOS app for Slydes - a TikTok-style discovery platform for restaurants, hotels, venues, tours, experiences, and wellness businesses.

**What this app IS:**
- Consumer discovery app (explore & view)
- Share link handler (open Slyde links)
- Location-based feed

**What this app IS NOT:**
- Creator/editor tool (that's Studio web app)
- Admin dashboard

## Architecture

```
SwiftUI + MVVM + Combine

Views (SwiftUI) → ViewModels (@Observable) → Services → Supabase
```

## Project Structure

```
Slydes/
├── App/                    # Entry point
│   ├── SlydesApp.swift     # @main app
│   └── ContentView.swift   # Root navigation
├── Core/
│   ├── Models/             # Swift data models
│   ├── Services/           # Networking, Auth, Analytics
│   └── Utilities/          # Extensions, helpers
├── Features/
│   ├── Discovery/          # Location-based feed
│   ├── Viewer/             # Slyde viewing experience
│   ├── Profile/            # Saved items (future)
│   └── Auth/               # Login flows (future)
└── UI/
    ├── Components/         # Reusable views
    └── Theme/              # Colors, typography
```

## Key Files

| File | Purpose |
|------|---------|
| `Models.swift` | All data models ported from TypeScript |
| `SupabaseService.swift` | Backend API client |
| `AnalyticsService.swift` | Event tracking (matches web) |
| `SlydeView.swift` | Main viewer with gestures |
| `DiscoveryFeedView.swift` | Location-based discovery |

## Dependencies

- **supabase-swift** - Backend client
- **Nuke** - Image loading/caching
- **KeychainAccess** - Secure storage

## Setup

### 1. Configure Supabase

Update `SupabaseService.swift` with your credentials:

```swift
let supabaseUrl = URL(string: "https://your-project.supabase.co")!
let supabaseKey = "your-anon-key"
```

### 2. Open in Xcode

```bash
cd apps/ios
open Package.swift
```

Or create an Xcode project that references the Swift package.

### 3. Configure Signing

1. Set your Team in Signing & Capabilities
2. Update Bundle Identifier (e.g., `io.slydes.app`)
3. Add Associated Domains capability for Universal Links

### 4. Run

Select a simulator or device and run.

## Universal Links

For deep linking to work, you need to:

1. Add `applinks:slydes.io` to Associated Domains (already in entitlements)
2. Host `apple-app-site-association` on your domain

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.io.slydes.app",
        "paths": ["/*"]
      }
    ]
  }
}
```

## Analytics Events

The app tracks the same events as the web:

| Event | When |
|-------|------|
| `sessionStart` | App opens a Slyde |
| `frameView` | User views a frame |
| `ctaClick` | CTA button tapped |
| `shareClick` | Share button tapped |
| `heartTap` | Heart toggled |
| `faqOpen` | FAQ expanded |

## Video Playback

- **Background videos**: AVPlayer with HLS (Cloudflare Stream)
- **Demo videos**: YouTube/Vimeo embeds or direct playback
- **Filters**: Placeholder for Metal shaders (to match web CSS filters)

### Video Filter Values (for Metal)

```swift
// cinematic
contrast(1.1) saturate(0.85) brightness(0.95) sepia(0.05)

// vintage
sepia(0.25) contrast(1.1) brightness(1.05) saturate(1.2)

// moody
contrast(1.3) saturate(0.7) brightness(0.85)

// warm
sepia(0.15) saturate(1.3) brightness(1.05) contrast(1.05)

// cool
hue-rotate(-15deg) saturate(0.9) contrast(1.1)
```

## Roadmap

### Phase 1: MVP ✅
- [x] Project setup
- [x] Core models
- [x] Supabase networking
- [x] SlydeView with gestures
- [x] Video playback (basic)
- [x] CTA handling
- [x] Universal Links config
- [x] Analytics tracking

### Phase 2: Discovery
- [ ] CoreLocation integration
- [ ] PostGIS nearby query
- [ ] Discovery feed
- [ ] Category filters
- [ ] Search
- [ ] Video filters (Metal)

### Phase 3: Engagement
- [ ] Apple Sign In
- [ ] Heart/save with sync
- [ ] Profile view
- [ ] Share sheet
- [ ] Push notifications

### Phase 4: Polish
- [ ] Offline support
- [ ] Error states
- [ ] Accessibility
- [ ] App Store submission

## Brand Colors

```swift
// Future Black
Color(hex: "0A0E27")

// Leader Blue
Color(hex: "2563EB")

// Electric Cyan
Color(hex: "06B6D4")
```

## Contributing

This app is part of the Slydes monorepo. See the root README for contribution guidelines.
