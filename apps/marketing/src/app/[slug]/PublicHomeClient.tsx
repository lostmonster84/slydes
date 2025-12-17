'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { HomeSlydeScreen } from '@/app/demo/home-slyde/components/HomeSlydeScreen'

type Category = {
  id: string
  icon: string
  name: string
  description: string
  childSlydeId: string
}

interface PublicHomeClientProps {
  businessSlug: string
  businessName: string
  primaryColor: string
  videoSrc: string
  posterSrc?: string
  categories: Category[]
}

export function PublicHomeClient({
  businessSlug,
  businessName,
  primaryColor,
  videoSrc,
  posterSrc,
  categories,
}: PublicHomeClientProps) {
  const router = useRouter()

  // Create gradient from primary color
  const accent = useMemo(() => {
    // Generate a complementary gradient from the primary color
    return `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, 30)} 100%)`
  }, [primaryColor])

  return (
    <main className="min-h-screen bg-black">
      <div className="h-screen w-full">
        <HomeSlydeScreen
          data={{
            businessName,
            tagline: '', // TODO: Add tagline to organization
            accentColor: accent,
            backgroundGradient: 'from-slate-950 via-slate-950 to-black',
            videoSrc,
            posterSrc,
            categories: categories.map((c) => ({
              id: c.id,
              label: c.name,
              icon: c.icon,
              description: c.description,
              frames: [],
            })),
            primaryCta: undefined, // TODO: Add CTA to organization
          }}
          onCategoryTap={(categoryId) => {
            const cat = categories.find((c) => c.id === categoryId)
            const child = cat?.childSlydeId
            if (!child) return
            router.push(`/${encodeURIComponent(businessSlug)}/${encodeURIComponent(child)}`)
          }}
        />
      </div>
    </main>
  )
}

// Helper to adjust hex color brightness
function adjustColor(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, '')

  // Parse RGB
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  // Adjust brightness (shift toward cyan for Slydes brand feel)
  r = Math.min(255, Math.max(0, r - percent))
  g = Math.min(255, Math.max(0, g + percent / 2))
  b = Math.min(255, Math.max(0, b + percent))

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
