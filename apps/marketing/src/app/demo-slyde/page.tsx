'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { demoBrandGradient, useDemoBrand } from '@/lib/demoBrand'
import { useDemoHomeSlyde } from '@/lib/demoHomeSlyde'
import { HomeSlydeScreen } from '@/app/demo/home-slyde/components/HomeSlydeScreen'

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
  const router = useRouter()
  const slydeId = useMemo(() => {
    const raw = sp.get('slyde')
    if (raw === 'home') return 'home'
    if (raw === 'just-drive') return 'just-drive'
    return 'camping'
  }, [sp])

  const { frames, faqs, title } = useMemo(() => {
    if (slydeId === 'home') {
      return { frames: campingFrames, faqs: campingFAQs, title: 'Home Slyde' }
    }
    if (slydeId === 'just-drive') {
      return { frames: justDriveFrames, faqs: justDriveFAQs, title: 'Just Drive' }
    }
    return { frames: campingFrames, faqs: campingFAQs, title: 'Camping' }
  }, [slydeId])

  // Live brand sync — reacts to changes from Brand settings page (cross-tab + same-tab)
  const brandProfile = useDemoBrand()
  const brandAccent = useMemo(() => demoBrandGradient(brandProfile), [brandProfile])
  const home = useDemoHomeSlyde()

  const [business, setBusiness] = useState<BusinessInfo>(() => ({
    ...wildtraxBusiness,
    name: brandProfile.businessName,
    tagline: brandProfile.tagline,
    accentColor: brandAccent,
  }))
  const [brandedFrames, setBrandedFrames] = useState<FrameData[]>(() =>
    frames.map((f) => ({ ...f, accentColor: brandAccent }))
  )

  // Live brand sync — update business and frames when brand changes
  useEffect(() => {
    setBusiness((prev) => ({
      ...prev,
      name: brandProfile.businessName,
      tagline: brandProfile.tagline,
      accentColor: brandAccent,
    }))
    setBrandedFrames(frames.map((f) => ({ ...f, accentColor: brandAccent })))
  }, [brandProfile, brandAccent, frames])

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
        {slydeId === 'home' ? (
          <HomeSlydeScreen
            data={{
              businessName: brandProfile.businessName,
              tagline: brandProfile.tagline,
              accentColor: brandProfile.secondaryColor,
              backgroundGradient: 'from-slate-900 via-slate-900 to-slate-900',
              rating: business.rating,
              reviewCount: business.reviewCount,
              videoSrc: home.videoSrc,
              posterSrc: home.posterSrc,
              categories: home.categories.map((c) => ({
                id: c.id,
                label: c.label,
                icon: c.icon,
                description: c.description,
                frames: [],
              })),
              primaryCta: home.primaryCta ? { text: home.primaryCta.text, action: home.primaryCta.action } : undefined,
            }}
            onCategoryTap={(categoryId) => {
              const cat = home.categories.find((c) => c.id === categoryId)
              const child = cat?.childSlydeId === 'just-drive' ? 'just-drive' : 'camping'
              router.push(`/demo-slyde?slyde=${encodeURIComponent(child)}`)
            }}
          />
        ) : (
          <SlydeScreen
            frames={brandedFrames}
            faqs={faqs}
            business={business}
            autoAdvance={false}
            analyticsOrgSlug="wildtrax"
            analyticsSlydePublicId={slydeId}
            analyticsSource="direct"
          />
        )}
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
