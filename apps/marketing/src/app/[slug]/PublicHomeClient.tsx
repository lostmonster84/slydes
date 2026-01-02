'use client'

import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HomeSlydeScreen } from '@/app/demo/home-slyde/components/HomeSlydeScreen'
import { DesktopSlydeWrapper } from '@/components/DesktopSlydeWrapper'

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
  audioSrc?: string
  audioEnabled?: boolean
}

export function PublicHomeClient({
  businessSlug,
  businessName,
  primaryColor,
  videoSrc,
  posterSrc,
  categories,
  audioSrc,
  audioEnabled = true,
}: PublicHomeClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if we're in embed mode (inside iframe)
  const isEmbed = searchParams.get('embed') === 'true'

  // Audio state management
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const hasMusicTrack = !!audioSrc && audioEnabled

  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev
      if (audioRef.current) {
        audioRef.current.muted = newMuted
        if (!newMuted) {
          audioRef.current.play().catch(() => {})
        }
      }
      return newMuted
    })
  }, [])

  // Create gradient from primary color
  const accent = useMemo(() => {
    // Generate a complementary gradient from the primary color
    return `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, 30)} 100%)`
  }, [primaryColor])

  // Shared HomeSlydeScreen component
  const slydeScreen = (
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
      hasMusicTrack={hasMusicTrack}
      isMusicMuted={isMuted}
      onMusicToggle={handleMuteToggle}
    />
  )

  // Audio element (hidden)
  const audioElement = audioSrc && audioEnabled && (
    <audio ref={audioRef} src={audioSrc} loop muted preload="auto" />
  )

  // Embed mode: render Slyde directly (no wrapper, for iframe)
  if (isEmbed) {
    return (
      <main className="h-screen w-full bg-black">
        {slydeScreen}
        {audioElement}
      </main>
    )
  }

  // Normal mode: render with desktop wrapper
  return (
    <DesktopSlydeWrapper businessName={businessName} slug={businessSlug}>
      {slydeScreen}
      {audioElement}
    </DesktopSlydeWrapper>
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
