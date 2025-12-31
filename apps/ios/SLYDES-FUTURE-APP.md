# Slydes iOS Consumer App - Future Work

> **Status**: PARKED - Future Phase (Q4 2025+)
> **Priority**: Build after Studio & Marketing are production-ready with paying customers
> **Last Updated**: December 30, 2025

---

## Overview

Native iOS app for Slydes consumer discovery - a TikTok-style vertical swipe experience for discovering experience-first businesses.

**What it IS**: Consumer viewer, discovery feed, share link handler
**What it IS NOT**: Creator tool (that's Studio web app)

---

## Current State

### Foundation Built ✅

The iOS project structure exists at `apps/ios/` with:

- **23 Swift files** created
- **Xcode project** configured (`Slydes.xcodeproj`)
- **SPM dependencies** set up (Supabase, Nuke, KeychainAccess)
- **Supabase credentials** configured
- **Core architecture** in place (MVVM + SwiftUI)

### Files Created

```
apps/ios/
├── Package.swift                    # SPM dependencies
├── README.md                        # Setup documentation
├── Slydes.xcodeproj/               # Xcode project
├── SlydesTests/                    # Unit tests
└── Slydes/
    ├── App/
    │   ├── SlydesApp.swift         # Entry point
    │   └── ContentView.swift       # Root navigation + deep links
    ├── Core/
    │   ├── Models/
    │   │   └── Models.swift        # All data types (ported from TS)
    │   ├── Services/
    │   │   ├── SupabaseService.swift    # Backend client
    │   │   └── AnalyticsService.swift   # Event tracking
    │   └── Utilities/
    │       └── Config.swift        # Environment config
    ├── Features/
    │   ├── Discovery/
    │   │   └── DiscoveryFeedView.swift  # Location-based feed
    │   └── Viewer/
    │       ├── SlydeView.swift          # Main viewer
    │       ├── FrameBackgroundView.swift # Video/image backgrounds
    │       ├── VideoPlayerOverlayView.swift # Demo video player
    │       ├── InfoSheetView.swift      # Business info + FAQs
    │       ├── ShareSheetView.swift     # Native sharing
    │       └── ConnectSheetView.swift   # Social links
    ├── UI/
    │   ├── Components/
    │   │   ├── BadgeView.swift
    │   │   ├── CTAButtonView.swift
    │   │   ├── SwipeIndicatorView.swift
    │   │   └── SocialActionStackView.swift
    │   └── Theme/
    │       └── Theme.swift         # Brand colors & typography
    ├── Resources/
    │   └── Assets.xcassets/        # App icons, colors
    ├── Info.plist                  # App configuration
    └── Slydes.entitlements         # Universal Links
```

---

## Known Issues to Fix

Before the app can build/run, these errors need resolution:

1. **Supabase SDK API changes** - The SDK version may have different method signatures
2. **Some type mismatches** - Minor Swift type adjustments needed
3. **Metal shaders not implemented** - Video filters are placeholder only

---

## Implementation Phases

### Phase 1: MVP (4-6 weeks) - NOT STARTED
- [ ] Fix build errors and get app running
- [ ] Test Supabase connection
- [ ] SlydeView with frame navigation (swipe + tap)
- [ ] Video playback (AVPlayer, no filters yet)
- [ ] Basic CTAs (links, phone, email, directions)
- [ ] Universal Links deep linking
- [ ] Basic analytics tracking

**Deliverable**: Open shared Slyde links in iOS app

### Phase 2: Discovery (3-4 weeks) - NOT STARTED
- [ ] CoreLocation integration
- [ ] PostGIS nearby query endpoint (needs backend work)
- [ ] DiscoveryFeedView (vertical scroll)
- [ ] Category filters
- [ ] Search
- [ ] Video filters (Metal shaders)
- [ ] Video speed control

**Deliverable**: Browse nearby experience businesses

### Phase 3: Engagement (2-3 weeks) - NOT STARTED
- [ ] Apple Sign In + Supabase auth
- [ ] Heart/save with backend sync
- [ ] Profile view (saved items)
- [ ] Share sheet (native + Instagram Stories)
- [ ] Push notifications

**Deliverable**: Save favorites, share with friends

### Phase 4: Polish (2 weeks) - NOT STARTED
- [ ] Offline support (SwiftData + video cache)
- [ ] Error states, loading skeletons
- [ ] Accessibility (VoiceOver, Dynamic Type)
- [ ] App Store assets
- [ ] TestFlight beta
- [ ] App Store submission

**Deliverable**: Production-ready for App Store

---

## Backend Work Required

Before iOS app can fully function, these backend pieces are needed:

### New API Endpoints
- [ ] `POST /api/analytics/ingest` - Batch analytics events from iOS
- [ ] `RPC nearby_organizations` - PostGIS function for location queries
- [ ] Public read policies for organizations/slydes/frames (unauthenticated viewing)

### Database
- [ ] Add `location` (geography) column to organizations for PostGIS queries
- [ ] Create indexes for location-based queries

### Server Config
- [ ] Host `apple-app-site-association` file for Universal Links
- [ ] Configure CORS for iOS app requests

---

## Technical Notes

### Architecture
- **SwiftUI + MVVM + Combine**
- **iOS 17+** minimum deployment target
- **Portrait only** (matches web viewer)

### Dependencies (SPM)
- `supabase-swift` 2.0+ - Backend client
- `Nuke` 12.0+ - Image loading/caching
- `KeychainAccess` 4.2+ - Secure storage

### Video Implementation
- AVPlayer for HLS streaming (Cloudflare Stream)
- Metal shaders needed for filters (cinematic, vintage, moody, warm, cool)
- Vignette overlay via radial gradient

### Video Filter Values (for Metal)
```
cinematic: contrast(1.1) saturate(0.85) brightness(0.95) sepia(0.05)
vintage:   sepia(0.25) contrast(1.1) brightness(1.05) saturate(1.2)
moody:     contrast(1.3) saturate(0.7) brightness(0.85)
warm:      sepia(0.15) saturate(1.3) brightness(1.05) contrast(1.05)
cool:      hue-rotate(-15deg) saturate(0.9) contrast(1.1)
```

### Brand Colors
```swift
Future Black: #0A0E27
Leader Blue:  #2563EB
Electric Cyan: #06B6D4
```

---

## Reference Files

When resuming work, reference these web files for parity:

| iOS Feature | Web Reference |
|-------------|---------------|
| Data models | `apps/studio/src/components/slyde-demo/frameData.ts` |
| Slyde viewer | `apps/studio/src/components/slyde-demo/SlydeScreen.tsx` |
| Video filters | `apps/studio/src/lib/videoFilters.ts` |
| Analytics | `apps/studio/supabase/migrations/003_create_slydes_analytics.sql` |
| Types | `packages/types/src/index.ts` |

---

## Prerequisites Before Starting

1. **Studio app production-ready** - Creator tool must be solid
2. **Marketing app production-ready** - Public viewer working well
3. **Paying customers** - Validate the product first
4. **Content to discover** - Need businesses using Slydes
5. **Apple Developer account** - For TestFlight and App Store

---

## To Resume This Work

1. Open Xcode: `open apps/ios/Slydes.xcodeproj`
2. Set your Development Team in Signing & Capabilities
3. Wait for SPM packages to resolve
4. Fix any build errors
5. Run on simulator
6. Work through Phase 1 checklist above

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Dec 30, 2025 | Park iOS development | Focus on web Studio/Marketing first, get paying customers |
| Dec 30, 2025 | Foundation built | 23 files created, architecture in place for future |
| Dec 30, 2025 | iOS 17+ target | Modern SwiftUI features, acceptable for new app |
| Dec 30, 2025 | SwiftUI over UIKit | Declarative, matches React patterns from web |

---

**This is future work. Focus on Studio and Marketing first.**
