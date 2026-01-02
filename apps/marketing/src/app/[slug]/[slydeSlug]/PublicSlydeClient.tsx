'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SlydeScreen } from '@/components/slyde-demo'
import { DesktopSlydeWrapper } from '@/components/DesktopSlydeWrapper'
import {
  campingFrames,
  campingFAQs,
  justDriveFrames,
  justDriveFAQs,
  wildtraxBusiness,
  type BusinessInfo,
  type FrameData,
} from '@/lib/demo-data'
import { useDemoBrand, demoBrandGradient } from '@/lib/demoBrand'

export type FrameMedia = {
  frameIndex: number
  mediaType: 'video' | 'image' | null
  videoUid: string | null
  imageUrl: string | null
  imageId: string | null
  imageVariant: string | null
  videoStatus: string | null
}

export type SlydeInfo = {
  id: string
  publicId: string
  title: string
  description: string
  icon: string
}

export type DBFrame = {
  id: string
  publicId: string
  frameIndex: number
  templateType: string | null
  title: string | null
  subtitle: string | null
  mediaType: 'video' | 'image' | null
  videoUid: string | null
  videoPosterUrl: string | null
  videoStatus: string | null
  imageUrl: string | null
  imageId: string | null
  imageVariant: string | null
  ctaText: string | null
  ctaAction: string | null
  ctaIcon: string | null
  ctaType: string | null
  accentColor: string | null
  demoVideoUrl: string | null
  backgroundType: 'video' | 'image' | 'gradient' | 'color' | null
  backgroundGradient: string | null
  backgroundColor: string | null
  videoFilter: string | null
  videoVignette: boolean | null
  videoSpeed: string | null
}

function isStreamPlaceholder(src: string) {
  return src.startsWith('stream:')
}

function isStreamProcessingPlaceholder(src: string) {
  return src.startsWith('stream-processing:')
}

function extractStreamUid(src: string) {
  if (src.startsWith('stream:')) return src.slice('stream:'.length)
  if (src.startsWith('stream-processing:')) return src.slice('stream-processing:'.length)
  const match = /iframe\.videodelivery\.net\/([^?]+)/.exec(src)
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

function buildStreamIframeUrl(uid: string, token?: string) {
  const sp = new URLSearchParams()
  sp.set('autoplay', 'true')
  sp.set('muted', 'true')
  sp.set('loop', 'true')
  sp.set('controls', 'false')
  sp.set('preload', 'true')
  if (token) sp.set('token', token)
  return `https://iframe.videodelivery.net/${encodeURIComponent(uid)}?${sp.toString()}`
}

export function PublicSlydeClient({
  businessSlug,
  slydeSlug,
  slydeInfo,
  dbFrames,
  frameMedia,
  businessName,
  audioSrc,
  audioEnabled = true,
}: {
  businessSlug: string
  slydeSlug: string
  slydeInfo?: SlydeInfo
  dbFrames?: DBFrame[]
  frameMedia: FrameMedia[]
  businessName: string
  audioSrc?: string
  audioEnabled?: boolean
}) {
  const sp = useSearchParams()
  const brand = useDemoBrand()
  const accent = useMemo(() => demoBrandGradient(brand), [brand])

  // Check if we're in embed mode (inside iframe)
  const isEmbed = sp.get('embed') === 'true'

  // Audio state - managed here so it persists across the experience
  const [isMuted, setIsMuted] = useState(true)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleMuteToggle = useCallback(() => {
    const newMuted = !isMuted
    setIsMuted(newMuted)

    if (audioRef.current && audioSrc && audioEnabled) {
      audioRef.current.muted = newMuted
      // If unmuting for the first time, start playback
      if (!newMuted && !audioUnlocked) {
        setAudioUnlocked(true)
        audioRef.current.play().catch(() => {
          // Autoplay blocked
        })
      }
    }
  }, [isMuted, audioSrc, audioEnabled, audioUnlocked])

  // Convert DBFrame to FrameData format
  const convertDBFrameToFrameData = useCallback((dbFrame: DBFrame, index: number): FrameData => {
    // Build background source
    let backgroundSrc = ''
    if (dbFrame.mediaType === 'video' && dbFrame.videoUid) {
      const isReady = dbFrame.videoStatus === 'ready' || dbFrame.videoStatus === null
      backgroundSrc = isReady ? `stream:${dbFrame.videoUid}` : `stream-processing:${dbFrame.videoUid}`
    } else if (dbFrame.mediaType === 'image' && dbFrame.imageUrl) {
      backgroundSrc = dbFrame.imageUrl
    }

    // Map DB templateType to valid FrameData templateType
    const validTemplateTypes = ['hook', 'how', 'who', 'what', 'proof', 'trust', 'action', 'slydes', 'custom'] as const
    const templateType = validTemplateTypes.includes(dbFrame.templateType as any)
      ? (dbFrame.templateType as typeof validTemplateTypes[number])
      : 'custom'

    // Map DB ctaIcon to valid CTAIconType
    const validCtaIcons = ['book', 'call', 'view', 'arrow', 'menu', 'list'] as const
    const ctaIcon = validCtaIcons.includes(dbFrame.ctaIcon as any)
      ? (dbFrame.ctaIcon as typeof validCtaIcons[number])
      : 'call'

    return {
      id: dbFrame.id,
      order: index + 1, // 1-indexed order
      templateType,
      title: dbFrame.title ?? '',
      subtitle: dbFrame.subtitle ?? '',
      heartCount: 0,
      background: {
        type: (dbFrame.backgroundType ?? dbFrame.mediaType ?? 'video') as 'video' | 'image',
        src: backgroundSrc,
        startTime: 0,
      },
      accentColor: dbFrame.accentColor ?? accent,
      demoVideoUrl: dbFrame.demoVideoUrl ?? undefined,
      cta: dbFrame.ctaText ? {
        text: dbFrame.ctaText,
        icon: ctaIcon,
        action: dbFrame.ctaAction ?? undefined,
      } : undefined,
    }
  }, [accent])

  // Use DB frames if available, otherwise fall back to demo frames
  const { frames, faqs } = useMemo(() => {
    // If we have DB frames, use them
    if (dbFrames && dbFrames.length > 0) {
      const convertedFrames = dbFrames.map((f, i) => convertDBFrameToFrameData(f, i))
      return { frames: convertedFrames, faqs: [] as any[] } // TODO: Load FAQs from DB
    }
    // Fall back to demo frames
    if (slydeSlug === 'just-drive') return { frames: justDriveFrames, faqs: justDriveFAQs }
    return { frames: campingFrames, faqs: campingFAQs }
  }, [slydeSlug, dbFrames, convertDBFrameToFrameData])

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
    name: businessName || brand.businessName,
    tagline: brand.tagline,
    accentColor: accent,
  }))

  // When using DB frames, they already have media baked in (from convertDBFrameToFrameData)
  // When using demo frames, we need to overlay frameMedia
  const hasDBFrames = dbFrames && dbFrames.length > 0

  const baseFrames = useMemo<FrameData[]>(
    () => frames.map((f) => ({ ...f, accentColor: accent })),
    [frames, accent]
  )

  const [renderFrames, setRenderFrames] = useState<FrameData[]>(() => baseFrames)
  const tokenCacheRef = useRef<Map<string, string>>(new Map())

  // Apply DB-provided media onto demo frames (only when NOT using DB frames)
  useEffect(() => {
    // If we have DB frames, they already contain media data from convertDBFrameToFrameData
    if (hasDBFrames) {
      setRenderFrames(baseFrames)
      return
    }

    // For demo frames, overlay the frameMedia
    const byIndex = new Map<number, FrameMedia>()
    for (const m of frameMedia ?? []) {
      if (typeof m?.frameIndex === 'number') byIndex.set(m.frameIndex, m)
    }

    const next: FrameData[] = baseFrames.map((f) => {
      const m = byIndex.get(f.order)
      if (!m || !m.mediaType) return f
      if (m.mediaType === 'image' && m.imageUrl) {
        return {
          ...f,
          background: { ...f.background, type: 'image' as const, src: m.imageUrl },
        }
      }
      if (m.mediaType === 'video' && m.videoUid) {
        const isReady = m.videoStatus === 'ready' || m.videoStatus === null
        return {
          ...f,
          // Don't load the iframe until we have a token (tokenized playback).
          background: {
            ...f.background,
            type: 'video' as const,
            src: isReady ? `stream:${m.videoUid}` : `stream-processing:${m.videoUid}`,
          },
        }
      }
      return f
    })

    setRenderFrames(next)
  }, [baseFrames, frameMedia, hasDBFrames])

  useEffect(() => {
    setBusiness((prev) => ({
      ...prev,
      id: businessSlug,
      name: businessName || brand.businessName,
      tagline: brand.tagline,
      accentColor: accent,
    }))
  }, [brand.businessName, brand.tagline, accent, businessSlug, businessName])

  const ensureVideoToken = useCallback(
    async (videoUid: string) => {
      if (tokenCacheRef.current.has(videoUid)) return tokenCacheRef.current.get(videoUid)!
      const res = await fetch(`/api/media/playback-token?uid=${encodeURIComponent(videoUid)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to mint token')
      const token = String(json.token || '')
      if (!token) throw new Error('Missing token')
      tokenCacheRef.current.set(videoUid, token)
      return token
    },
    []
  )

  const hydrateFrameVideo = useCallback(
    async (frameIndex: number) => {
      const f = renderFrames[frameIndex]
      if (!f || f.background.type !== 'video') return

      const uid = extractStreamUid(f.background.src)
      if (!uid) return

      // Already hydrated
      if (!isStreamPlaceholder(f.background.src) && f.background.src.includes('token=')) return
      // If we're still processing, don't attempt playback yet.
      if (isStreamProcessingPlaceholder(f.background.src)) return

      const token = await ensureVideoToken(uid)
      setRenderFrames((prev) =>
        prev.map((x, idx) =>
          idx === frameIndex
            ? { ...x, background: { ...x.background, type: 'video', src: buildStreamIframeUrl(uid, token) } }
            : x
        )
      )
    },
    [renderFrames, ensureVideoToken]
  )

  const checkIfVideoReady = useCallback(async (videoUid: string) => {
    const res = await fetch(`/api/media/stream-status?uid=${encodeURIComponent(videoUid)}`)
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error || 'Failed to check status')
    return Boolean(json?.readyToStream) || json?.state === 'ready'
  }, [])

  // Hydrate the initial frame (and prefetch the next one) so the first view doesn't flash a broken iframe.
  useEffect(() => {
    const run = async () => {
      const idx = Math.max(0, Math.min(initialFrameIndex, renderFrames.length - 1))
      try {
        // If initial frame is "processing", poll until ready (best effort).
        const first = renderFrames[idx]
        if (first?.background?.type === 'video' && isStreamProcessingPlaceholder(first.background.src)) {
          const uid = extractStreamUid(first.background.src)
          if (uid) {
            for (let i = 0; i < 30; i++) {
              const ready = await checkIfVideoReady(uid)
              if (ready) {
                setRenderFrames((prev) =>
                  prev.map((x, j) =>
                    j === idx ? { ...x, background: { ...x.background, type: 'video', src: `stream:${uid}` } } : x
                  )
                )
                break
              }
              await new Promise((r) => setTimeout(r, 2000))
            }
          }
        }

        await hydrateFrameVideo(idx)
        // Prefetch next frame token (best effort)
        if (idx + 1 < renderFrames.length) await hydrateFrameVideo(idx + 1)
      } catch (e) {
        console.error('[PublicSlydeClient] initial video hydrate failed', e)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderFrames.length])

  const handleFrameChange = useCallback(
    async (index: number) => {
      try {
        // If this frame is still processing, poll until it's ready (best effort).
        const f = renderFrames[index]
        if (f?.background?.type === 'video' && isStreamProcessingPlaceholder(f.background.src)) {
          const uid = extractStreamUid(f.background.src)
          if (uid) {
            for (let i = 0; i < 30; i++) {
              const ready = await checkIfVideoReady(uid)
              if (ready) {
                setRenderFrames((prev) =>
                  prev.map((x, j) =>
                    j === index ? { ...x, background: { ...x.background, type: 'video', src: `stream:${uid}` } } : x
                  )
                )
                break
              }
              await new Promise((r) => setTimeout(r, 2000))
            }
          }
        }

        await hydrateFrameVideo(index)
        // Prefetch next frame token for smoother swipes (best effort)
        if (index + 1 < renderFrames.length) await hydrateFrameVideo(index + 1)
      } catch (e) {
        // Best-effort: keep existing src; viewer may still play if signed URLs are off.
        console.error('[PublicSlydeClient] token fetch failed', e)
      }
    },
    [renderFrames, checkIfVideoReady, hydrateFrameVideo]
  )

  // Shared content for both embed and normal modes
  const slydeContent = (
    <>
      {/* Background Audio (hidden) - managed at this level for persistence */}
      {audioSrc && audioEnabled && (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
          muted={isMuted}
          playsInline
          style={{ display: 'none' }}
        />
      )}

      {/* Minimal top bar (keeps it shareable / debuggable) */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-black/30 backdrop-blur border-b border-white/10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href={`/${encodeURIComponent(businessSlug)}`} className="text-white/80 text-sm hover:text-white">
            ← Home
          </Link>
          <div className="text-white/60 text-xs">
            {businessSlug}/{slydeSlug}
          </div>
        </div>
      </div>

      <div className="h-screen w-full pt-14">
        <SlydeScreen
          frames={renderFrames}
          faqs={faqs}
          business={business}
          autoAdvance={false}
          initialFrameIndex={initialFrameIndex}
          onFrameChange={handleFrameChange}
          analyticsOrgSlug={businessSlug}
          analyticsSlydePublicId={slydeSlug}
          analyticsSource="direct"
          audioSrc={audioSrc}
          audioEnabled={audioEnabled}
          isMuted={isMuted}
          onMuteToggle={handleMuteToggle}
        />
      </div>
    </>
  )

  // Embed mode: render directly (no wrapper, for iframe)
  if (isEmbed) {
    return <main className="min-h-screen bg-black">{slydeContent}</main>
  }

  // Normal mode: render with desktop wrapper
  return (
    <DesktopSlydeWrapper businessName={businessName} slug={`${businessSlug}/${slydeSlug}`}>
      {slydeContent}
    </DesktopSlydeWrapper>
  )
}


