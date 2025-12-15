'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { HomeSlydeScreen } from '@/app/demo/home-slyde/components/HomeSlydeScreen'
import { useDemoBrand, demoBrandGradient } from '@/lib/demoBrand'
import { useDemoHomeSlyde } from '@/lib/demoHomeSlyde'

export function PublicHomeClient({ businessSlug }: { businessSlug: string }) {
  const router = useRouter()
  const brand = useDemoBrand()
  const home = useDemoHomeSlyde()
  const accent = useMemo(() => demoBrandGradient(brand), [brand])

  return (
    <main className="min-h-screen bg-black">
      <div className="h-screen w-full">
        <HomeSlydeScreen
          data={{
            businessName: brand.businessName,
            tagline: brand.tagline,
            accentColor: accent,
            backgroundGradient: 'from-slate-950 via-slate-950 to-black',
            videoSrc: home.videoSrc,
            posterSrc: home.posterSrc,
            categories: home.categories.map((c) => ({
              id: c.id,
              label: c.name,
              icon: c.icon,
              description: c.description,
              frames: [],
            })),
            primaryCta: home.primaryCta ? { text: home.primaryCta.text, action: home.primaryCta.action } : undefined,
          }}
          onCategoryTap={(categoryId) => {
            const cat = home.categories.find((c) => c.id === categoryId)
            const child = cat?.childSlydeId === 'just-drive' ? 'just-drive' : 'camping'
            router.push(`/${encodeURIComponent(businessSlug)}/${encodeURIComponent(child)}`)
          }}
        />
      </div>
    </main>
  )
}


