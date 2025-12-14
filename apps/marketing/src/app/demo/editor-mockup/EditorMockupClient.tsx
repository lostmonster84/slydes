'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { DevicePreview } from '@/components/slyde-demo'
import { SlydeScreen } from '@/components/slyde-demo/SlydeScreen'
import type { FrameData, FAQItem, BusinessInfo, CTAIconType, FrameInfoContent } from '@/components/slyde-demo/frameData'
import { demoBrandGradient, readDemoBrandProfile } from '@/lib/demoBrand'
import type { LucideIcon } from 'lucide-react'
import { Settings2, HelpCircle, UploadCloud, GripVertical, CalendarDays, Phone, Eye, ArrowRight, Menu, Video, Image as ImageIcon } from 'lucide-react'

type DemoSlydeId = 'camping' | 'just-drive' | 'new'

export interface EditorMockupClientProps {
  slyde?: string
  name?: string
}

function coerceDemoSlydeId(input: string | undefined): DemoSlydeId {
  if (input === 'camping' || input === 'just-drive' || input === 'new') return input
  return 'camping'
}

function getDemoSlydeLabel(slydeId: DemoSlydeId, nameOverride?: string | null) {
  if (slydeId === 'new') return (nameOverride || 'New Slyde').trim() || 'New Slyde'
  if (slydeId === 'just-drive') return 'Just Drive'
  return 'Camping'
}

function getNextNumericId(frames: FrameData[]) {
  const nums = frames
    .map(f => Number.parseInt(f.id, 10))
    .filter(n => Number.isFinite(n))
  const max = nums.length ? Math.max(...nums) : 0
  return String(max + 1)
}

function buildStarterFrames(opts: { faqCount: number; accentColor: string }): FrameData[] {
  const { faqCount, accentColor } = opts

  return [
    {
      id: '1',
      order: 1,
      templateType: 'hook',
      title: 'Wake Up',
      subtitle: 'Somewhere unreal',
      badge: '⭐ 5-Star Rated',
      rating: 5.0,
      reviewCount: 209,
      heartCount: 2400,
      faqCount,
      background: {
        type: 'video',
        src: 'https://videos.pexels.com/video-files/5309351/5309351-hd_1920_1080_25fps.mp4',
      },
      accentColor,
      infoContent: {
        headline: 'The experience, in one sentence',
        description: 'A premium, self-guided adventure—beautifully packaged.',
      },
    },
    {
      id: '2',
      order: 2,
      templateType: 'how',
      title: 'How it works',
      subtitle: 'Pick • pack • go',
      badge: '⚡ Simple setup',
      heartCount: 1800,
      faqCount,
      cta: { text: 'See the details', icon: 'view', action: 'info' },
      background: {
        type: 'video',
        src: 'https://videos.pexels.com/video-files/5309380/5309380-hd_1920_1080_25fps.mp4',
      },
      accentColor,
      infoContent: {
        headline: '3 steps',
        items: ['Choose dates', 'Confirm in seconds', 'Arrive & go'],
      },
    },
    {
      id: '3',
      order: 3,
      templateType: 'what',
      title: 'What you get',
      subtitle: 'Everything included',
      badge: '✅ Built for comfort',
      heartCount: 1200,
      faqCount,
      background: {
        type: 'video',
        src: 'https://videos.pexels.com/video-files/6394054/6394054-uhd_2560_1440_25fps.mp4',
      },
      accentColor,
      infoContent: {
        headline: 'Included',
        items: ['Premium kit', 'Local guidance', 'Support on standby'],
      },
    },
    {
      id: '4',
      order: 4,
      templateType: 'trust',
      title: 'Why trust us',
      subtitle: 'Proven, insured, reviewed',
      badge: '🛡️ Verified',
      heartCount: 950,
      faqCount,
      cta: { text: "Read what's covered", icon: 'view', action: 'info' },
      background: {
        type: 'video',
        src: 'https://videos.pexels.com/video-files/6394024/6394024-uhd_2560_1440_25fps.mp4',
      },
      accentColor,
      infoContent: {
        headline: 'Trust & safety',
        description: 'Clear policies, transparent pricing, and real-world experience.',
      },
    },
    {
      id: '5',
      order: 5,
      templateType: 'proof',
      title: '209 Reviews',
      subtitle: '"Best trip of our lives"',
      badge: '⭐⭐⭐⭐⭐',
      rating: 5.0,
      reviewCount: 209,
      heartCount: 2100,
      faqCount,
      cta: { text: 'Read Reviews', icon: 'view', action: 'reviews' },
      background: {
        type: 'video',
        src: 'https://videos.pexels.com/video-files/5896379/5896379-uhd_2560_1440_25fps.mp4',
      },
      accentColor,
    },
    {
      id: '6',
      order: 6,
      templateType: 'action',
      title: 'Ready to go?',
      subtitle: 'Check availability',
      badge: '🔥 Book now',
      heartCount: 3200,
      faqCount,
      cta: { text: 'Check Availability', icon: 'book', action: 'https://wildtrax.co.uk/book' },
      background: {
        type: 'video',
        src: 'https://videos.pexels.com/video-files/5309435/5309435-hd_1920_1080_25fps.mp4',
      },
      accentColor,
    },
  ]
}

const INITIAL_BUSINESS: BusinessInfo = {
  id: 'wildtrax',
  name: 'WildTrax',
  tagline: 'Highland Adventures',
  location: 'Scottish Highlands',
  rating: 5.0,
  reviewCount: 209,
  credentials: [
    { icon: '⭐', label: '5-Star', value: 'Rated' },
    { icon: '🏆', label: 'Top', value: 'Rated' },
    { icon: '🏴', label: 'Est', value: '2019' }
  ],
  about: 'Land Rover Defender camping experiences in the Scottish Highlands. Full kit included. Wake up anywhere.',
  highlights: [
    '15+ years experience',
    'NC500 specialists',
    'Fully equipped Defenders'
  ],
  contact: {
    phone: '+44 1234 567890',
    email: 'hello@wildtrax.co.uk',
  },
  accentColor: 'bg-red-600'
}

const INITIAL_FAQS: FAQItem[] = [
  { id: '1', question: 'Do you allow dogs?', answer: 'Yes! Dogs are welcome in all our vehicles. We just ask that you bring a blanket for them.' },
  { id: '2', question: "What's included in the camping kit?", answer: 'Full setup: rooftop tent, awning, kitchen with stove and cookware, bedding, chairs, table, and lighting.' },
  { id: '3', question: 'Can I cancel my booking?', answer: 'Yes, free cancellation up to 7 days before. 50% refund within 7 days.' },
  { id: '4', question: 'Where do I pick up?', answer: 'Our base is in Inverness, easily accessible from the A9. Full directions sent on booking.' },
  { id: '5', question: 'Do I need camping experience?', answer: 'Not at all! We provide a full walkthrough and the tent takes 60 seconds to set up.' },
  { id: '6', question: 'What license do I need?', answer: 'A standard UK driving license is fine. The Defenders are all manual transmission.' },
  { id: '7', question: 'Is fuel included?', answer: 'No, fuel is at your own expense. The Defenders average around 25mpg.' },
  { id: '8', question: 'Can I wild camp anywhere?', answer: 'Scotland has right to roam! We provide a guide to the best spots on the NC500.' },
]

const INITIAL_FRAMES_CAMPING: FrameData[] = [
  {
    id: '1',
    order: 1,
    templateType: 'hook',
    title: 'Wake Up',
    subtitle: 'Here',
    badge: '⭐ 5-Star Rated',
    rating: 5.0,
    reviewCount: 209,
    heartCount: 2400,
    faqCount: 8,
    background: { 
      type: 'video', 
      src: 'https://videos.pexels.com/video-files/5309351/5309351-hd_1920_1080_25fps.mp4',
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'The WildTrax Experience',
      description: 'Land Rover Defender camping in the Scottish Highlands.',
    }
  },
  {
    id: '2',
    order: 2,
    templateType: 'how',
    title: 'Land Rover Defender',
    subtitle: 'Roof tent • Full kit included',
    badge: '🏕️ Camp Wild',
    heartCount: 1800,
    faqCount: 8,
    cta: { text: 'See How It Works', icon: 'view', action: 'info' },
    background: { 
      type: 'video', 
      src: 'https://videos.pexels.com/video-files/5309380/5309380-hd_1920_1080_25fps.mp4',
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'Rooftop Tent 101',
      description: 'Pop up in 60 seconds. Sleep under the stars.',
    }
  },
  {
    id: '3',
    order: 3,
    templateType: 'what',
    title: 'The Experience',
    subtitle: 'Couples • Families • Friends',
    badge: '⭐ Unforgettable',
    heartCount: 1200,
    faqCount: 8,
    background: { 
      type: 'video', 
      src: 'https://videos.pexels.com/video-files/6394054/6394054-uhd_2560_1440_25fps.mp4',
    },
    accentColor: 'bg-red-600',
  },
  {
    id: '4',
    order: 4,
    templateType: 'trust',
    title: 'Full Kit Included',
    subtitle: 'Everything you need',
    badge: '✅ All Inclusive',
    heartCount: 950,
    faqCount: 8,
    cta: { text: 'View Gear List', icon: 'view', action: 'info' },
    background: { 
      type: 'video', 
      src: 'https://videos.pexels.com/video-files/6394024/6394024-uhd_2560_1440_25fps.mp4',
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'The Full Kit',
      items: ['Rooftop tent', 'Kitchen setup', 'Bedding', 'Chairs & table', 'Lighting'],
    }
  },
  {
    id: '5',
    order: 5,
    templateType: 'proof',
    title: '209 Reviews',
    subtitle: '"Best trip of our lives"',
    badge: '⭐⭐⭐⭐⭐',
    rating: 5.0,
    reviewCount: 209,
    heartCount: 2100,
    faqCount: 8,
    cta: { text: 'Read Reviews', icon: 'view', action: 'reviews' },
    background: { 
      type: 'video', 
      src: 'https://videos.pexels.com/video-files/5896379/5896379-uhd_2560_1440_25fps.mp4',
    },
    accentColor: 'bg-red-600',
  },
  {
    id: '6',
    order: 6,
    templateType: 'action',
    title: 'Ready to Explore?',
    subtitle: 'From £165/day • NC500 Ready',
    badge: '🔥 Book Now',
    heartCount: 3200,
    faqCount: 8,
    cta: { text: 'Check Availability', icon: 'book', action: 'https://wildtrax.co.uk/book' },
    background: { 
      type: 'video', 
      src: 'https://videos.pexels.com/video-files/5309435/5309435-hd_1920_1080_25fps.mp4',
    },
    accentColor: 'bg-red-600',
  },
]

const INITIAL_FRAMES_JUST_DRIVE: FrameData[] = INITIAL_FRAMES_CAMPING.map((f) => {
  const base: FrameData = { ...f, accentColor: 'bg-amber-600' }

  if (f.id === '1') {
    return { ...base, title: 'Just', subtitle: 'Drive', badge: '⭐ 5-Star Rated', heartCount: 1800 }
  }
  if (f.id === '2') {
    return { ...base, title: 'Pick Up', subtitle: 'Drive. Return.', badge: '🚗 Simple Process' }
  }
  if (f.id === '6') {
    return { ...base, title: 'Book Your', subtitle: 'Drive', badge: '💰 From £125/day' }
  }
  return base
})

function getInitialFramesForSlyde(slydeId: DemoSlydeId): FrameData[] {
  if (slydeId === 'just-drive') return INITIAL_FRAMES_JUST_DRIVE
  if (slydeId === 'new') {
    return buildStarterFrames({ faqCount: INITIAL_FAQS.length, accentColor: INITIAL_BUSINESS.accentColor || 'bg-red-600' })
  }
  return INITIAL_FRAMES_CAMPING
}

const CTA_ICONS: { value: CTAIconType; label: string; Icon: LucideIcon }[] = [
  { value: 'book', label: 'Book', Icon: CalendarDays },
  { value: 'call', label: 'Call', Icon: Phone },
  { value: 'view', label: 'View', Icon: Eye },
  { value: 'arrow', label: 'Arrow', Icon: ArrowRight },
  { value: 'menu', label: 'Menu', Icon: Menu },
]

export default function EditorMockupClient({ slyde, name }: EditorMockupClientProps) {
  const brandAccent = useMemo(() => {
    const profile = readDemoBrandProfile()
    return demoBrandGradient(profile)
  }, [])

  const brandProfile = useMemo(() => readDemoBrandProfile(), [])
  const businessInitial = useMemo(() => {
    const n = (brandProfile.businessName || 'S').trim()
    return (n[0] || 'S').toUpperCase()
  }, [brandProfile.businessName])

  // HQ skin tokens (chrome only — phone preview stays canonical)
  const HQ_PRIMARY_GRADIENT = 'bg-gradient-to-r from-blue-600 to-cyan-500'
  const HQ_PRIMARY_SHADOW = 'shadow-lg shadow-blue-500/15'
  const activeSlydeId = coerceDemoSlydeId(slyde)
  const activeSlydeLabel = getDemoSlydeLabel(activeSlydeId, name)

  // State
  const [frames, setFrames] = useState<FrameData[]>(() =>
    getInitialFramesForSlyde(activeSlydeId).map((f) => ({ ...f, accentColor: brandAccent }))
  )
  const [business, setBusiness] = useState<BusinessInfo>(() => ({
    ...INITIAL_BUSINESS,
    name: brandProfile.businessName,
    tagline: brandProfile.tagline,
    accentColor: brandAccent,
  }))
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS)
  const [selectedFrameId, setSelectedFrameId] = useState<string>('1')
  const [activeTab, setActiveTab] = useState<'content' | 'cta' | 'info' | 'style'>('content')
  const [showBusinessModal, setShowBusinessModal] = useState(false)
  const [showFaqModal, setShowFaqModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [previewFrameIndex, setPreviewFrameIndex] = useState(0)
  const [draggingFrameId, setDraggingFrameId] = useState<string | null>(null)
  const [dragOverTarget, setDragOverTarget] = useState<{ id: string; position: 'above' | 'below' } | null>(null)

  // Refs for custom drag image
  const frameCardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const dragGhostRef = useRef<HTMLDivElement | null>(null)

  // When the user switches Slydes from the Profile (editor-home), reset the editor to that Slyde's seed.
  // This is a demo — we prefer correctness over preserving unsaved edits across Slydes.
  useEffect(() => {
    // Re-apply brand accent every time (prevents drifting back to seed colors like red/amber)
    setFrames(getInitialFramesForSlyde(activeSlydeId).map((f) => ({ ...f, accentColor: brandAccent })))
    setSelectedFrameId('1')
    setPreviewFrameIndex(0)
    setActiveTab('content')
  }, [activeSlydeId, brandAccent])

  // Derived state
  const selectedFrame = useMemo(() => 
    frames.find(f => f.id === selectedFrameId) || frames[0],
    [frames, selectedFrameId]
  )

  // Update frame field
  const updateFrame = useCallback((id: string, updates: Partial<FrameData>) => {
    setFrames(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }, [])

  // Update business field
  const updateBusiness = useCallback((updates: Partial<BusinessInfo>) => {
    setBusiness(prev => ({ ...prev, ...updates }))
  }, [])

  // Demo brand is applied synchronously above; no effect needed.

  // Add new frame
  const addFrame = useCallback(() => {
    const newId = getNextNumericId(frames)
    const newFrame: FrameData = {
      id: newId,
      order: frames.length + 1,
      templateType: 'custom',
      title: 'New Frame',
      subtitle: 'Add your content',
      heartCount: 0,
      faqCount: faqs.length,
      background: { 
        type: 'image', 
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      },
      accentColor: business.accentColor || 'bg-red-600',
    }
    setFrames(prev => [...prev, newFrame])
    setSelectedFrameId(newId)
    setPreviewFrameIndex(frames.length)
  }, [frames, faqs.length, business.accentColor])

  const moveFrameNear = useCallback((fromId: string, targetId: string, position: 'above' | 'below') => {
    if (fromId === targetId) return
    const fromIndex = frames.findIndex((f) => f.id === fromId)
    if (fromIndex < 0) return

    const next = [...frames]
    const [moved] = next.splice(fromIndex, 1)
    const targetIndex = next.findIndex((f) => f.id === targetId)
    if (targetIndex < 0) {
      next.push(moved)
    } else {
      const insertIndex = position === 'below' ? targetIndex + 1 : targetIndex
      next.splice(insertIndex, 0, moved)
    }

    const normalized = next.map((f, i) => ({ ...f, order: i + 1 }))
    setFrames(normalized)

    const selectedNextIndex = normalized.findIndex((f) => f.id === selectedFrameId)
    if (selectedNextIndex >= 0) setPreviewFrameIndex(selectedNextIndex)
  }, [frames, selectedFrameId])

  const createNewSlyde = useCallback(() => {
    const starter = buildStarterFrames({
      faqCount: faqs.length,
      accentColor: business.accentColor || 'bg-red-600',
    })

    setFrames(starter)
    setSelectedFrameId('1')
    setPreviewFrameIndex(0)
    setActiveTab('content')
    setShowCreateModal(false)
  }, [faqs.length, business.accentColor])

  // Delete frame
  const deleteFrame = useCallback((id: string) => {
    if (frames.length <= 1) return
    setFrames(prev => prev.filter(f => f.id !== id))
    if (selectedFrameId === id) {
      setSelectedFrameId(frames[0].id)
    }
  }, [frames, selectedFrameId])

  // Sync preview with selected frame
  const handleFrameSelect = useCallback((id: string) => {
    setSelectedFrameId(id)
    const index = frames.findIndex(f => f.id === id)
    if (index >= 0) setPreviewFrameIndex(index)
  }, [frames])

  // Sync selection with preview navigation
  const handlePreviewFrameChange = useCallback((index: number) => {
    setPreviewFrameIndex(index)
    if (frames[index]) {
      setSelectedFrameId(frames[index].id)
    }
  }, [frames])

  // Update FAQ count on all frames when FAQs change
  const updateFaqCount = useCallback(() => {
    setFrames(prev => prev.map(f => ({ ...f, faqCount: faqs.length })))
  }, [faqs.length])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden flex flex-col">
      {/* Toolbar */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/demo" className="flex items-center gap-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
            <span className="text-sm font-semibold">Back</span>
        </Link>
        
        <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />
        
        <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
              style={{ background: brandAccent }}
              aria-hidden="true"
            >
              {businessInitial}
            </div>
            <span className="font-display font-bold tracking-tight text-gray-900 dark:text-white truncate">{business.name}</span>
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Slyde</span>
          <span className="text-sm text-gray-700 dark:text-white/80 truncate max-w-[220px]">{activeSlydeLabel}</span>
        </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBusinessModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            <Settings2 className="w-4 h-4" aria-hidden="true" />
            Business
          </button>

          <button
            onClick={() => setShowFaqModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            FAQs <span className="font-mono text-xs text-gray-600 dark:text-white/70">({faqs.length})</span>
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />

          <button
            type="button"
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity ${HQ_PRIMARY_SHADOW} ${HQ_PRIMARY_GRADIENT}`}
          >
            <UploadCloud className="w-4 h-4" aria-hidden="true" />
            Publish
          </button>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Frames Panel */}
        <aside className="w-72 border-r border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
              Frames ({frames.length})
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 relative">
            {frames.map((frame, index) => {
              const isDropTarget = draggingFrameId && dragOverTarget?.id === frame.id
              const showIndicatorAbove = isDropTarget && dragOverTarget?.position === 'above'
              const showIndicatorBelow = isDropTarget && dragOverTarget?.position === 'below'

              return (
                <div key={frame.id} className="relative">
                  {/* Drop indicator ABOVE — sits in the gap, no layout shift */}
                  <div
                    className={`absolute -top-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-150 ease-out ${
                      showIndicatorAbove ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                    }`}
                    style={{ transformOrigin: 'center' }}
                  />

                  <div
                    ref={(el) => {
                      if (el) frameCardRefs.current.set(frame.id, el)
                      else frameCardRefs.current.delete(frame.id)
                    }}
                    draggable
                    onDragStart={(e) => {
                      setDraggingFrameId(frame.id)
                      setDragOverTarget(null)

                      // Create custom drag image (clone the card)
                      const cardEl = frameCardRefs.current.get(frame.id)
                      if (cardEl) {
                        const clone = cardEl.cloneNode(true) as HTMLDivElement
                        clone.style.position = 'absolute'
                        clone.style.top = '-9999px'
                        clone.style.left = '-9999px'
                        clone.style.width = `${cardEl.offsetWidth}px`
                        clone.style.transform = 'rotate(1.5deg) scale(1.03)'
                        clone.style.boxShadow = '0 16px 48px -12px rgba(0,0,0,0.35), 0 6px 16px -6px rgba(0,0,0,0.2)'
                        clone.style.opacity = '1'
                        clone.style.pointerEvents = 'none'
                        clone.style.borderRadius = '1rem'
                        document.body.appendChild(clone)
                        dragGhostRef.current = clone
                        e.dataTransfer.setDragImage(clone, cardEl.offsetWidth / 2, 24)
                      }

                      try {
                        e.dataTransfer.setData('text/plain', frame.id)
                        e.dataTransfer.effectAllowed = 'move'
                      } catch {
                        // ignore
                      }
                    }}
                    onDragEnd={() => {
                      setDraggingFrameId(null)
                      setDragOverTarget(null)
                      // Clean up ghost
                      if (dragGhostRef.current) {
                        dragGhostRef.current.remove()
                        dragGhostRef.current = null
                      }
                    }}
                    onDragOver={(e) => {
                      if (!draggingFrameId || draggingFrameId === frame.id) return
                      e.preventDefault()
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                      const relY = e.clientY - rect.top
                      const position: 'above' | 'below' = relY < rect.height / 2 ? 'above' : 'below'
                      setDragOverTarget({ id: frame.id, position })
                    }}
                    onDragLeave={() => {
                      setDragOverTarget((prev) => (prev?.id === frame.id ? null : prev))
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (draggingFrameId) {
                        const pos = dragOverTarget?.id === frame.id ? dragOverTarget.position : 'above'
                        moveFrameNear(draggingFrameId, frame.id, pos)
                      }
                      setDraggingFrameId(null)
                      setDragOverTarget(null)
                      // Clean up ghost
                      if (dragGhostRef.current) {
                        dragGhostRef.current.remove()
                        dragGhostRef.current = null
                      }
                    }}
                    onClick={() => handleFrameSelect(frame.id)}
                    className={`group relative p-3 rounded-2xl border transition-all duration-150 cursor-grab active:cursor-grabbing ${
                      selectedFrameId === frame.id
                        ? 'border-blue-500/30 bg-blue-500/[0.08] ring-1 ring-blue-500/10 dark:border-blue-400/30 dark:bg-blue-500/10 dark:ring-blue-400/10'
                        : 'border-gray-200/60 hover:border-gray-300 bg-white/70 backdrop-blur-sm shadow-sm dark:bg-[#2c2c2e]/70 dark:border-white/10 dark:hover:border-white/20'
                    } ${draggingFrameId === frame.id ? 'opacity-30 scale-[0.96]' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Drag handle (visual hint only) */}
                      <div
                        className={`mt-0.5 p-0.5 rounded transition-opacity ${
                          selectedFrameId === frame.id
                            ? 'opacity-60 text-gray-500 dark:text-white/50'
                            : 'opacity-0 group-hover:opacity-50 text-gray-400 dark:text-white/35'
                        }`}
                        aria-hidden="true"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Frame number badge (macOS sidebar style) */}
                      <div className="w-8 h-8 shrink-0 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-sm font-mono font-semibold text-gray-600 dark:text-white/70">
                        {index + 1}
                      </div>

                      {/* Content area */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-display font-bold text-gray-900 dark:text-white truncate">
                          {frame.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-white/50 truncate">
                          {frame.subtitle || 'No subtitle'}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-mono text-gray-400 dark:text-white/40">
                            ❤️ {frame.heartCount.toLocaleString()}
                          </span>
                          {frame.cta && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-500/15 dark:text-cyan-300 dark:border-blue-500/20">
                              CTA
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drop indicator BELOW — for last item or below position */}
                  <div
                    className={`absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-150 ease-out ${
                      showIndicatorBelow ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                    }`}
                    style={{ transformOrigin: 'center' }}
                  />
                </div>
              )
            })}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={() => setShowCreateModal(true)}
              className={`w-full py-2.5 mb-2 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity ${HQ_PRIMARY_SHADOW} ${HQ_PRIMARY_GRADIENT}`}
            >
              + Create new Slyde (starter)
            </button>
            <button
              onClick={addFrame}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] rounded-xl text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
            >
              + Add Frame
            </button>
          </div>
        </aside>

        {/* Canvas (Device Preview) */}
        <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#1c1c1e] p-8 overflow-hidden">
          <div className="flex flex-col items-center">
            <DevicePreview enableTilt={false}>
              <SlydeScreen
                frames={frames}
                faqs={faqs}
                business={business}
                autoAdvance={false}
                initialFrameIndex={previewFrameIndex}
                onFrameChange={handlePreviewFrameChange}
              />
            </DevicePreview>
            <p className="mt-4 text-sm text-gray-500 dark:text-white/50 font-mono">
              Editing: Frame {previewFrameIndex + 1} of {frames.length}
            </p>
          </div>
        </main>

        {/* Inspector Panel */}
        <aside className="w-[360px] border-l border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80 flex flex-col shrink-0">
          {/* macOS-style Segmented Control */}
          <div className="p-4 border-b border-gray-200/80 dark:border-white/10">
            <div className="relative flex items-center h-8 rounded-lg bg-gray-100 p-0.5 dark:bg-white/[0.08] shadow-inner">
              {/* Sliding selection indicator */}
              <div
                className="absolute top-0.5 bottom-0.5 rounded-md bg-white shadow-sm transition-all duration-200 ease-out dark:bg-[#3a3a3c]"
                style={{
                  width: `calc(25% - 2px)`,
                  left: `calc(${(['content', 'cta', 'info', 'style'] as const).indexOf(activeTab) * 25}% + 2px)`,
                }}
              />
              {(['content', 'cta', 'info', 'style'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative z-10 flex-1 h-full text-[13px] font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/70'
                  }`}
                >
                  {tab === 'cta' ? 'CTA' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {activeTab === 'content' && (
              <>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={selectedFrame.title}
                    onChange={e => updateFrame(selectedFrame.id, { title: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={selectedFrame.subtitle || ''}
                    onChange={e => updateFrame(selectedFrame.id, { subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={selectedFrame.badge || ''}
                    onChange={e => updateFrame(selectedFrame.id, { badge: e.target.value })}
                    placeholder="e.g. ⭐ 5-Star Rated"
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Background media
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => updateFrame(selectedFrame.id, { background: { ...selectedFrame.background, type: 'video' } })}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                        selectedFrame.background.type === 'video'
                          ? 'border-blue-200 bg-blue-50 dark:border-blue-500/25 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300'
                          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <Video className="w-4 h-4" aria-hidden="true" />
                        <span className="font-semibold">Video</span>
                      </span>
                    </button>
                    <button
                      onClick={() => updateFrame(selectedFrame.id, { background: { ...selectedFrame.background, type: 'image' } })}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                        selectedFrame.background.type === 'image'
                          ? 'border-blue-200 bg-blue-50 dark:border-blue-500/25 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300'
                          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <ImageIcon className="w-4 h-4" aria-hidden="true" />
                        <span className="font-semibold">Image</span>
                      </span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={selectedFrame.background.src}
                    onChange={e => updateFrame(selectedFrame.id, { background: { ...selectedFrame.background, src: e.target.value } })}
                    placeholder="URL or upload..."
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Heart count
                  </label>
                  <input
                    type="number"
                    value={selectedFrame.heartCount}
                    onChange={e => updateFrame(selectedFrame.id, { heartCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                  />
                  <p className="mt-1.5 text-[12px] text-gray-500 dark:text-white/40">
                    Popularity signal shown on the frame
                  </p>
                </div>

                {(selectedFrame.rating !== undefined) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                        Rating
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={selectedFrame.rating || 0}
                        onChange={e => updateFrame(selectedFrame.id, { rating: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                        Reviews
                      </label>
                      <input
                        type="number"
                        value={selectedFrame.reviewCount || 0}
                        onChange={e => updateFrame(selectedFrame.id, { reviewCount: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'cta' && (
              <>
                {/* macOS-style toggle row */}
                <div className="flex items-center justify-between py-1">
                  <label className="text-[13px] font-medium text-gray-700 dark:text-white/70">
                    Enable CTA button
                  </label>
                  <button
                    onClick={() => {
                      if (selectedFrame.cta) {
                        updateFrame(selectedFrame.id, { cta: undefined })
                      } else {
                        updateFrame(selectedFrame.id, { cta: { text: 'Book Now', icon: 'book', action: '' } })
                      }
                    }}
                    className={`relative w-[51px] h-[31px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#2c2c2e] ${
                      selectedFrame.cta ? 'bg-blue-500' : 'bg-gray-300 dark:bg-white/20'
                    }`}
                    aria-pressed={!!selectedFrame.cta}
                    role="switch"
                  >
                    <div
                      className={`absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-md transition-transform duration-200 ease-out ${
                        selectedFrame.cta ? 'translate-x-[22px]' : 'translate-x-[2px]'
                      }`}
                    />
                  </button>
                </div>

                {selectedFrame.cta && (
                  <>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                        Button text
                      </label>
                      <input
                        type="text"
                        value={selectedFrame.cta.text}
                        onChange={e => updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, text: e.target.value } })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                        Icon
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {CTA_ICONS.map(({ value, label, Icon }) => (
                          <button
                            key={value}
                            onClick={() => updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, icon: value } })}
                            className={`py-2.5 rounded-lg border text-center transition-all ${
                              selectedFrame.cta?.icon === value
                                ? 'border-blue-500 bg-blue-500/10 dark:border-blue-400 dark:bg-blue-500/15 ring-1 ring-blue-500/20'
                                : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                            title={label}
                          >
                            <Icon className={`w-4 h-4 mx-auto ${selectedFrame.cta?.icon === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-white/70'}`} aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                        Action
                      </label>
                      <select
                        value={selectedFrame.cta.action?.startsWith('http') ? 'url' : selectedFrame.cta.action || 'url'}
                        onChange={e => {
                          const val = e.target.value
                          if (val === 'url') {
                            updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, action: '' } })
                          } else {
                            updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, action: val } })
                          }
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                      >
                        <option value="url">External URL</option>
                        <option value="info">Open Info Sheet</option>
                        <option value="faq">Open FAQ Sheet</option>
                        <option value="reviews">Go to Reviews</option>
                      </select>
                      {(selectedFrame.cta.action === '' || selectedFrame.cta.action?.startsWith('http')) && (
                        <input
                          type="url"
                          value={selectedFrame.cta.action || ''}
                          onChange={e => updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, action: e.target.value } })}
                          placeholder="https://..."
                          className="w-full mt-2 px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                        />
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'info' && (
              <>
                <p className="text-xs text-gray-500 dark:text-white/50 mb-4">
                  Content shown when users tap the ⓘ Info button on this frame.
                </p>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={selectedFrame.infoContent?.headline || ''}
                    onChange={e => updateFrame(selectedFrame.id, { 
                      infoContent: { ...selectedFrame.infoContent, headline: e.target.value } as FrameInfoContent
                    })}
                    placeholder="e.g. The Full Experience"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={selectedFrame.infoContent?.description || ''}
                    onChange={e => updateFrame(selectedFrame.id, { 
                      infoContent: { ...selectedFrame.infoContent, headline: selectedFrame.infoContent?.headline || '', description: e.target.value }
                    })}
                    rows={3}
                    placeholder="Detailed description for this frame..."
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                    List Items (one per line)
                  </label>
                  <textarea
                    value={selectedFrame.infoContent?.items?.join('\n') || ''}
                    onChange={e => updateFrame(selectedFrame.id, { 
                      infoContent: { 
                        ...selectedFrame.infoContent, 
                        headline: selectedFrame.infoContent?.headline || '',
                        items: e.target.value.split('\n').filter(Boolean)
                      }
                    })}
                    rows={4}
                    placeholder="Rooftop tent&#10;Kitchen setup&#10;Bedding&#10;Chairs & table"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30 resize-none font-mono text-sm"
                  />
                </div>
              </>
            )}

            {activeTab === 'style' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                    Accent Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {['bg-blue-600', 'bg-cyan-500', 'bg-slate-900', 'bg-emerald-600', 'bg-slate-600', 'bg-blue-700'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateFrame(selectedFrame.id, { accentColor: color })}
                        className={`w-full aspect-square rounded-lg ${color} ${
                          selectedFrame.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-[#2c2c2e]' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <button
                    onClick={() => deleteFrame(selectedFrame.id)}
                    disabled={frames.length <= 1}
                    className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete This Frame
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Business Settings Modal */}
      <AnimatePresence>
        {showBusinessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBusinessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#2c2c2e] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col border border-gray-200 dark:border-white/10 shadow-2xl"
            >
              <div className={`h-1 w-full ${HQ_PRIMARY_GRADIENT}`} />
              <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Business Settings</h2>
                <button
                  onClick={() => setShowBusinessModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white/50"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={business.name}
                    onChange={e => updateBusiness({ name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={business.tagline || ''}
                    onChange={e => updateBusiness({ tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={business.location}
                    onChange={e => updateBusiness({ location: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                    About
                  </label>
                  <textarea
                    value={business.about}
                    onChange={e => updateBusiness({ about: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={business.contact.phone || ''}
                      onChange={e => updateBusiness({ contact: { ...business.contact, phone: e.target.value } })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={business.contact.email || ''}
                      onChange={e => updateBusiness({ contact: { ...business.contact, email: e.target.value } })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={business.rating}
                      onChange={e => updateBusiness({ rating: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                      Review Count
                    </label>
                    <input
                      type="number"
                      value={business.reviewCount}
                      onChange={e => updateBusiness({ reviewCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-cyan-400/30"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-white/10">
                <button
                  onClick={() => setShowBusinessModal(false)}
                  className={`w-full py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity ${HQ_PRIMARY_SHADOW} ${HQ_PRIMARY_GRADIENT}`}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Management Modal */}
      <AnimatePresence>
        {showFaqModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFaqModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#2c2c2e] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col border border-gray-200 dark:border-white/10 shadow-2xl"
            >
              <div className={`h-1 w-full ${HQ_PRIMARY_GRADIENT}`} />
              <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">FAQs ({faqs.length})</h2>
                <button
                  onClick={() => setShowFaqModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white/50"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {faqs.map((faq, index) => (
                  <div key={faq.id} className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{index + 1}.</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={e => {
                            setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, question: e.target.value } : f))
                          }}
                          className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-white focus:outline-none"
                          placeholder="Question..."
                        />
                        <textarea
                          value={faq.answer}
                          onChange={e => {
                            setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, answer: e.target.value } : f))
                          }}
                          rows={2}
                          className="w-full mt-1 bg-transparent text-xs text-gray-600 dark:text-white/60 focus:outline-none resize-none"
                          placeholder="Answer..."
                        />
                      </div>
                      <button
                        onClick={() => setFaqs(prev => prev.filter(f => f.id !== faq.id))}
                        className="text-gray-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                <button
                  onClick={() => {
                    const newFaq: FAQItem = {
                      id: String(Date.now()),
                      question: '',
                      answer: '',
                    }
                    setFaqs(prev => [...prev, newFaq])
                  }}
                  className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg text-gray-600 dark:text-white/60 hover:border-blue-400 hover:text-blue-700 dark:hover:border-cyan-400 dark:hover:text-cyan-300 transition-colors text-sm font-semibold"
                >
                  + Add FAQ
                </button>
                <button
                  onClick={() => {
                    updateFaqCount()
                    setShowFaqModal(false)
                  }}
                  className={`w-full py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity ${HQ_PRIMARY_SHADOW} ${HQ_PRIMARY_GRADIENT}`}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create New Slyde Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#2c2c2e] rounded-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl"
            >
              <div className={`h-1 w-full ${HQ_PRIMARY_GRADIENT}`} />
              <div className="p-4 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create new Slyde</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
                  This overwrites your current frames with a 6-frame starter flow (Hook/How/What/Trust/Proof/Action).
                </p>
              </div>
              <div className="p-4 flex gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewSlyde}
                  className={`flex-1 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity ${HQ_PRIMARY_SHADOW} ${HQ_PRIMARY_GRADIENT}`}
                >
                  Create starter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient glow (match HQ shell) */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
    </div>
  )
}


