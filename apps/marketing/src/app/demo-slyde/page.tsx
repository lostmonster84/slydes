'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { DevicePreview } from '@/components/slyde-demo'
import { SlydeScreen } from '@/components/slyde-demo/SlydeScreen'
import {
  campingFrames,
  campingFAQs,
  justDriveFrames,
  justDriveFAQs,
  wildtraxBusiness
} from '@/components/slyde-demo/frameData'
import type { BusinessInfo, FrameData } from '@/components/slyde-demo/frameData'
import { demoBrandGradient, readDemoBrandProfile } from '@/lib/demoBrand'

/**
 * Demo Slyde Page
 *
 * Standalone demo showcasing the Slyde experience in a device preview.
 * This is the reference implementation for the Slydes.io platform.
 *
 * TERMINOLOGY (per STRUCTURE.md):
 * - Home Slyde → Child Slyde → Frame
 * - This page shows a single Child Slyde (Camping) with 10 Frames
 *
 * Features:
 * - Device preview (280×580px, exact spec)
 * - Full 10-frame WildTrax Camping Slyde
 * - Social action stack (Heart, FAQ, Share, Info) on every frame
 * - FAQ bottom sheet with accordion + Ask Question
 * - Info bottom sheet with hybrid frame-specific + business content
 * - AboutSheet (opened from ProfilePill)
 * - ShareSheet with 3×3 platform grid
 * - Swipe/tap navigation
 *
 * @see docs/SLYDESBUILD.md for full documentation
 * @see docs/STRUCTURE.md for hierarchy
 */

function DemoSlydeContent() {
  const sp = useSearchParams()
  const slydeId = useMemo(() => {
    const raw = sp.get('slyde')
    if (raw === 'just-drive') return 'just-drive'
    return 'camping'
  }, [sp])

  const { frames, faqs, title } = useMemo(() => {
    if (slydeId === 'just-drive') {
      return { frames: justDriveFrames, faqs: justDriveFAQs, title: 'Just Drive' }
    }
    return { frames: campingFrames, faqs: campingFAQs, title: 'Camping' }
  }, [slydeId])

  const [business, setBusiness] = useState<BusinessInfo>(() => {
    const profile = readDemoBrandProfile()
    const accent = demoBrandGradient(profile)
    return { ...wildtraxBusiness, name: profile.businessName, tagline: profile.tagline, accentColor: accent }
  })
  const [brandedFrames, setBrandedFrames] = useState<FrameData[]>(() => {
    const profile = readDemoBrandProfile()
    const accent = demoBrandGradient(profile)
    return frames.map((f) => ({ ...f, accentColor: accent }))
  })

  // Demo brand → apply to viewer (so Brand page affects the live demo too)
  useEffect(() => {
    const profile = readDemoBrandProfile()
    const accent = demoBrandGradient(profile)
    setBusiness((prev) => ({
      ...prev,
      name: profile.businessName,
      tagline: profile.tagline,
      accentColor: accent,
    }))
    setBrandedFrames(frames.map((f) => ({ ...f, accentColor: accent })))
  }, [frames])

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-white text-3xl font-bold mb-2">
          {title}
        </h1>
        <p className="text-white/60 text-sm max-w-md">
          The mobile-first storytelling experience. Tap to navigate, explore the social features.
        </p>
        <p className="text-cyan-400/80 text-xs mt-2">
          Reference implementation from SLYDESBUILD.md
        </p>
      </div>

      {/* Device Preview */}
      <DevicePreview enableTilt={true}>
        <SlydeScreen
          frames={brandedFrames}
          faqs={faqs}
          business={business}
          autoAdvance={false}
        />
      </DevicePreview>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-white/40 text-xs">
          Built with Slydes.io
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <a
            href="/demo"
            className="text-white/60 text-sm hover:text-white transition-colors"
          >
            Back to Demos
          </a>
          <span className="text-white/20">|</span>
          <a
            href="/"
            className="text-white/60 text-sm hover:text-white transition-colors"
          >
            Slydes.io
          </a>
        </div>
      </div>
    </main>
  )
}

export default function DemoSlydePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <DemoSlydeContent />
    </Suspense>
  )
}
