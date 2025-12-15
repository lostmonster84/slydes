'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SlydeScreen } from '@/components/slyde-demo/SlydeScreen'
import {
  campingFrames,
  campingFAQs,
  justDriveFrames,
  justDriveFAQs,
  wildtraxBusiness,
  type BusinessInfo,
  type FrameData,
} from '@/components/slyde-demo/frameData'
import { useDemoBrand, demoBrandGradient } from '@/lib/demoBrand'

type DemoSlydeSlug = 'camping' | 'just-drive'

function coerceSlydeSlug(raw: string): DemoSlydeSlug | null {
  if (raw === 'camping' || raw === 'just-drive') return raw
  return null
}

export function PublicSlydeClient({ businessSlug, slydeSlug }: { businessSlug: string; slydeSlug: string }) {
  const sp = useSearchParams()
  const brand = useDemoBrand()
  const accent = useMemo(() => demoBrandGradient(brand), [brand])

  const id = coerceSlydeSlug(slydeSlug)
  if (!id) return null

  const { frames, faqs } = useMemo(() => {
    if (id === 'just-drive') return { frames: justDriveFrames, faqs: justDriveFAQs }
    return { frames: campingFrames, faqs: campingFAQs }
  }, [id])

  const initialFrameIndex = useMemo(() => {
    const raw = sp.get('f')
    const n = raw ? Number.parseInt(raw, 10) : NaN
    if (!Number.isFinite(n)) return 0
    // `?f=3` means “Frame 3” (1-indexed)
    return Math.max(0, n - 1)
  }, [sp])

  const [business, setBusiness] = useState<BusinessInfo>(() => ({
    ...wildtraxBusiness,
    id: businessSlug,
    name: brand.businessName,
    tagline: brand.tagline,
    accentColor: accent,
  }))

  const [brandedFrames, setBrandedFrames] = useState<FrameData[]>(() =>
    frames.map((f) => ({ ...f, accentColor: accent }))
  )

  useEffect(() => {
    setBusiness((prev) => ({
      ...prev,
      id: businessSlug,
      name: brand.businessName,
      tagline: brand.tagline,
      accentColor: accent,
    }))
    setBrandedFrames(frames.map((f) => ({ ...f, accentColor: accent })))
  }, [brand.businessName, brand.tagline, accent, frames, businessSlug])

  return (
    <main className="min-h-screen bg-black">
      {/* Minimal top bar (keeps it shareable / debuggable) */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-black/30 backdrop-blur border-b border-white/10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href={`/${encodeURIComponent(businessSlug)}`} className="text-white/80 text-sm hover:text-white">
            ← Home
          </Link>
          <div className="text-white/60 text-xs">
            {businessSlug}/{id}
          </div>
        </div>
      </div>

      <div className="h-screen w-full pt-14">
        <SlydeScreen
          frames={brandedFrames}
          faqs={faqs}
          business={business}
          autoAdvance={false}
          initialFrameIndex={initialFrameIndex}
          analyticsOrgSlug={businessSlug}
          analyticsSlydePublicId={id}
          analyticsSource="direct"
        />
      </div>
    </main>
  )
}


