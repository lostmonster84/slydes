'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { DevicePreview } from '@/components/ui/DevicePreview'
import { Smartphone } from 'lucide-react'
import Link from 'next/link'

interface DesktopSlydeWrapperProps {
  children: React.ReactNode
  businessName: string
  slug: string
}

/**
 * DesktopSlydeWrapper - Shows phone mockup + QR code on desktop
 *
 * On mobile (< md): Renders children directly (full-screen Slyde)
 * On desktop (>= md): Shows iframe in phone frame with QR code and branding
 *
 * Uses iframe so the Slyde gets its own viewport context (256x556, not desktop viewport).
 * The aspect ratio matches iPhone 14 Pro (0.46), so layouts render correctly.
 */
export function DesktopSlydeWrapper({
  children,
  businessName,
  slug,
}: DesktopSlydeWrapperProps) {
  // Use state to avoid hydration mismatch - URL is only known client-side
  const [slydeUrl, setSlydeUrl] = useState(`https://slydes.io/${slug}`)
  // Track if we're on desktop (md breakpoint = 768px)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    // Get current URL without embed param for QR code
    const url = new URL(window.location.href)
    url.searchParams.delete('embed')
    setSlydeUrl(url.toString())

    // Check initial screen size
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
    checkDesktop()

    // Listen for resize
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // SSR: render nothing until we know the screen size
  if (isDesktop === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  // Mobile: Full-screen Slyde (no wrapper)
  if (!isDesktop) {
    return <div className="h-screen w-full">{children}</div>
  }

  // Build iframe URL with embed param
  const iframeUrl = `${slydeUrl}${slydeUrl.includes('?') ? '&' : '?'}embed=true`

  // Desktop: Phone mockup with iframe + info panel
  return (
    <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center gap-16 p-8">
      {/* Phone mockup with iframe */}
      <DevicePreview enableTilt={false}>
        {/*
          iframe creates its own viewport context.
          DevicePreview: 280x580 outer with p-3 (12px) = 256x556 screen area

          The iframe fills the screen at native resolution.
          The Slyde inside adapts to the 256x556 viewport.
        */}
        <iframe
          src={iframeUrl}
          title={`${businessName} Slyde`}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
        />
      </DevicePreview>

      {/* Info panel */}
      <div className="flex flex-col items-center text-center max-w-xs">
        {/* Business name */}
        <h1 className="text-2xl font-bold text-white mb-2">
          {businessName}
        </h1>

        {/* Subtitle */}
        <p className="text-white/60 text-sm mb-8">
          Mobile-first experience
        </p>

        {/* QR Code */}
        <div className="bg-white p-4 rounded-2xl mb-4">
          <QRCodeSVG
            value={slydeUrl}
            size={160}
            level="M"
          />
        </div>

        {/* QR instruction */}
        <div className="flex items-center gap-2 text-white/70 text-sm mb-8">
          <Smartphone className="w-4 h-4" />
          <span>Scan to view on mobile</span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Powered by Slydes */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
        >
          <span>Powered by</span>
          <span className="font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Slydes
          </span>
          <svg
            className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* CTA for potential customers */}
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all text-sm"
        >
          Create your own Slyde
        </Link>
      </div>
    </div>
  )
}
