'use client'

import { useReducer, useCallback, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HomeSlydeOverlay } from './HomeSlydeOverlay'
import { SlydeCover } from '@/components/slyde-demo'
import { CategorySlydeView } from './CategorySlydeView'
import { InventoryGridView } from './InventoryGridView'
import { ItemSlydeView } from './ItemSlydeView'
import { FloatingCartButton } from './FloatingCartButton'
import { emptyHomeSlydeData, type HomeSlydeData, type CategoryData, type FrameData as ViewerFrameData, type InventoryItem } from './data/highlandMotorsData'
import { useDemoHomeSlyde } from '@/lib/demoHomeSlyde'
import { useHomeSlyde } from '@/hooks/useHomeSlyde'
import { useOrganization } from '@/hooks/useOrganization'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'
import { BackgroundAudioPlayer } from '@/components/audio/BackgroundAudioPlayer'
import { useCart } from '@/lib/useCart'
import { useDemoCheckout } from '@/lib/useCheckout'
import type { FrameData as EditorFrameData, ListData } from '@/components/slyde-demo'
import { parseVideoUrl } from '@/components/VideoMediaInput'
import { getFilterStyle, VIGNETTE_STYLE, type VideoFilterPreset } from '@slydes/slyde-viewer'

// ============================================
// STATE MACHINE
// ============================================

// Navigation flow: home → cover → frames → inventory → item
// Cover is the landing page for each Slyde (shows name, description, location)
// Frames are the content inside the Slyde
type Level = 'home' | 'cover' | 'frames' | 'inventory' | 'item'

interface NavState {
  level: Level
  categoryId: string | null
  itemId: string | null
  frameIndex: number
}

type NavAction =
  | { type: 'TAP_CATEGORY'; categoryId: string }
  | { type: 'EXPLORE_FRAMES' }  // From cover → frames
  | { type: 'VIEW_ALL' }
  | { type: 'TAP_ITEM'; itemId: string }
  | { type: 'GO_BACK' }
  | { type: 'GO_HOME' }
  | { type: 'SET_FRAME'; index: number }
  | { type: 'NEXT_FRAME' }
  | { type: 'PREV_FRAME' }

const initialState: NavState = {
  level: 'home',
  categoryId: null,
  itemId: null,
  frameIndex: 0,
}

function navReducer(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case 'TAP_CATEGORY':
      // Tapping a category now goes to Cover first
      return {
        level: 'cover',
        categoryId: action.categoryId,
        itemId: null,
        frameIndex: 0,
      }

    case 'EXPLORE_FRAMES':
      // From cover, swipe up goes to frames
      return {
        ...state,
        level: 'frames',
        frameIndex: 0,
      }

    case 'VIEW_ALL':
      return {
        ...state,
        level: 'inventory',
        frameIndex: 0,
      }

    case 'TAP_ITEM':
      return {
        ...state,
        level: 'item',
        itemId: action.itemId,
        frameIndex: 0,
      }

    case 'GO_BACK':
      switch (state.level) {
        case 'item':
          return { ...state, level: 'inventory', itemId: null, frameIndex: 0 }
        case 'inventory':
          return { ...state, level: 'frames', frameIndex: 0 }
        case 'frames':
          return { ...state, level: 'cover', frameIndex: 0 }
        case 'cover':
          return { level: 'home', categoryId: null, itemId: null, frameIndex: 0 }
        default:
          return state
      }

    case 'GO_HOME':
      return initialState

    case 'SET_FRAME':
      return { ...state, frameIndex: action.index }

    case 'NEXT_FRAME':
      return { ...state, frameIndex: state.frameIndex + 1 }

    case 'PREV_FRAME':
      return { ...state, frameIndex: Math.max(0, state.frameIndex - 1) }

    default:
      return state
  }
}

// ============================================
// TRANSITIONS
// ============================================

const fadeScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
}

const slideFromBottom = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
}

const transition = { type: 'spring', stiffness: 300, damping: 30 }

// ============================================
// MAIN COMPONENT
// ============================================

interface HomeSlydeViewerProps {
  videoSrc?: string
  videoFilter?: VideoFilterPreset
  videoVignette?: boolean
}

/**
 * HomeSlydeViewer - Consumer-facing viewer with cart integration
 *
 * This component renders the full Home Slyde experience with:
 * - Navigation state machine (home -> category -> inventory -> item)
 * - Shopping cart with sticky checkout bar
 * - Commerce callbacks (add to cart, buy now, enquire)
 */
export function HomeSlydeViewer({ videoSrc: customVideoSrc, videoFilter = 'original', videoVignette = false }: HomeSlydeViewerProps) {
  const [state, dispatch] = useReducer(navReducer, initialState)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { data: demoHome, hydrated: demoHydrated } = useDemoHomeSlyde()
  const { data: homeSlydeData, isLoading: categoriesLoading } = useHomeSlyde()
  const { organization, isLoading: orgLoading } = useOrganization()
  const cart = useCart()
  const { checkout, isLoading: isCheckingOut } = useDemoCheckout()

  // Background music
  const {
    audioRef,
    isPlaying: isMusicPlaying,
    isMuted: isMusicMuted,
    toggleMute: toggleMusicMute,
    unlockAudio,
    audioSrc: musicSrc,
  } = useBackgroundMusic({
    customUrl: demoHome.musicCustomUrl,
    enabled: demoHome.musicEnabled ?? true,
    autoStart: true,
  })

  // Show loading state while data is hydrating
  const isLoading = orgLoading || !demoHydrated || categoriesLoading

  // Build viewer data from organization + localStorage editor state
  const viewerData: HomeSlydeData = useMemo(() => {
    // Use real organization data
    const businessName = organization?.name || 'Your Business'
    const accentColor = organization?.primary_color || '#2563EB'

    // Build video URL from Cloudflare stream UID if available
    const orgVideoSrc = organization?.home_video_stream_uid
      ? `https://customer-${process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH}.cloudflarestream.com/${organization.home_video_stream_uid}/manifest/video.m3u8`
      : null

    // Categories - merge Supabase data (with cover fields) with localStorage frame data
    const categories: CategoryData[] = (homeSlydeData?.categories || []).map((cat) => {
      const customFrames = demoHome.childFrames?.[cat.id] as EditorFrameData[] | undefined

      // Get list ID from any frame CTA that links to a list
      const listIdFromFrames = customFrames?.find(f => f.cta?.action === 'list')?.listId
      const listForCategory = listIdFromFrames
        ? (demoHome.lists || []).find((l: ListData) => l.id === listIdFromFrames)
        : null

      const frames: ViewerFrameData[] = customFrames && customFrames.length > 0
        ? customFrames.map((f) => ({
            id: f.id,
            title: f.title || 'Untitled',
            subtitle: f.subtitle || '',
            background: f.background?.src
              ? { type: 'image' as const, src: f.background.src }
              : { type: 'gradient' as const, gradient: 'from-slate-800 to-slate-900' },
            cta: f.cta?.text ? { text: f.cta.text, action: f.cta.action || '' } : undefined,
            showViewAll: f.cta?.action === 'list',
          }))
        : [{
            id: `${cat.id}-placeholder`,
            title: cat.name,
            subtitle: cat.description || '',
            background: { type: 'gradient' as const, gradient: 'from-slate-800 to-slate-900' },
          }]

      // Build inventory from connected list
      const inventory: InventoryItem[] | undefined = listForCategory?.items?.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle || '',
        price: item.price || '',
        price_cents: item.price ? parseInt(item.price.replace(/[^0-9]/g, '')) : undefined,
        image: item.image || '',
        commerce_mode: 'add_to_cart' as const,
        frames: (item.frames || []).map(f => ({
          id: f.id,
          title: f.title || 'Untitled',
          subtitle: f.subtitle || '',
          background: f.background?.src
            ? { type: 'image' as const, src: f.background.src }
            : { type: 'gradient' as const, gradient: 'from-slate-800 to-slate-900' },
          cta: f.cta?.text ? { text: f.cta.text, action: f.cta.action || '' } : undefined,
        })),
      }))

      // Build cover video URL from Cloudflare stream UID
      const coverVideoSrc = cat.coverVideoStreamUid
        ? `https://customer-${process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH}.cloudflarestream.com/${cat.coverVideoStreamUid}/manifest/video.m3u8`
        : undefined

      return {
        id: cat.id,
        label: cat.name,
        icon: cat.icon,
        description: cat.description || '',
        frames,
        inventory,
        // Cover background (from Supabase)
        coverBackgroundType: cat.coverBackgroundType,
        coverVideoSrc,
        coverImageUrl: cat.coverImageUrl,
        coverPosterUrl: cat.coverPosterUrl,
        coverVideoFilter: cat.coverVideoFilter,
        coverVideoVignette: cat.coverVideoVignette,
        coverVideoSpeed: cat.coverVideoSpeed,
        // Location (from Supabase)
        locationAddress: cat.locationAddress,
        locationLat: cat.locationLat,
        locationLng: cat.locationLng,
        // Contact (from Supabase)
        contactPhone: cat.contactPhone,
        contactEmail: cat.contactEmail,
        contactWhatsapp: cat.contactWhatsapp,
      }
    })

    return {
      organizationSlug: organization?.slug, // For analytics
      businessName,
      tagline: '', // TODO: Add tagline to organization table
      accentColor,
      backgroundGradient: 'from-slate-900 via-slate-800 to-slate-900',
      videoSrc: customVideoSrc || demoHome.videoSrc || orgVideoSrc || '',
      posterSrc: demoHome.posterSrc || organization?.home_video_poster_url || undefined,
      rating: undefined, // TODO: Add to organization or fetch from reviews
      reviewCount: undefined,
      about: '', // TODO: Add to organization table
      address: '', // TODO: Add to organization table
      hours: '',
      phone: '',
      email: '',
      website: organization?.website || '',
      categories,
      primaryCta: demoHome.primaryCta,
      showCategoryIcons: demoHome.showCategoryIcons,
      showHearts: demoHome.showHearts,
      showShare: demoHome.showShare,
      showSound: demoHome.showSound,
      showReviews: demoHome.showReviews,
    }
  }, [demoHome, customVideoSrc, organization, homeSlydeData])

  const videoSrc = viewerData.videoSrc || '/videos/adventure.mp4'

  // Navigation handlers
  const handleCategoryTap = useCallback((categoryId: string) => {
    setDrawerOpen(false)
    setTimeout(() => {
      dispatch({ type: 'TAP_CATEGORY', categoryId })
    }, 100)
  }, [])

  const handleExploreFrames = useCallback(() => {
    dispatch({ type: 'EXPLORE_FRAMES' })
  }, [])

  const handleViewAll = useCallback(() => {
    dispatch({ type: 'VIEW_ALL' })
  }, [])

  const handleItemTap = useCallback((itemId: string) => {
    dispatch({ type: 'TAP_ITEM', itemId })
  }, [])

  const handleBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' })
  }, [])

  const handleFrameChange = useCallback((index: number) => {
    dispatch({ type: 'SET_FRAME', index })
  }, [])

  // Commerce handlers
  const handleAddToCart = useCallback((item: InventoryItem) => {
    cart.addItem(item)
  }, [cart])

  const handleBuyNow = useCallback((item: InventoryItem) => {
    // Add to cart and open checkout
    cart.addItem(item)
    // TODO: Navigate to checkout
    console.log('Buy now:', item.title)
  }, [cart])

  const handleEnquire = useCallback((item: InventoryItem) => {
    // TODO: Open enquiry modal/sheet
    console.log('Enquire about:', item.title)
  }, [])

  const handleCheckout = useCallback(() => {
    // Start Stripe checkout
    checkout({ items: cart.items })
  }, [checkout, cart.items])

  // Get current data from viewerData (NOT from hardcoded demo data)
  const getCategory = useCallback((categoryId: string) => {
    return viewerData.categories.find(c => c.id === categoryId)
  }, [viewerData.categories])

  const getItem = useCallback((categoryId: string, itemId: string): InventoryItem | undefined => {
    const cat = viewerData.categories.find(c => c.id === categoryId)
    return cat?.inventory?.find(item => item.id === itemId)
  }, [viewerData.categories])

  const category = state.categoryId ? getCategory(state.categoryId) : null
  const item = state.categoryId && state.itemId
    ? getItem(state.categoryId, state.itemId)
    : null

  // Render overlay views
  const renderOverlayView = () => {
    switch (state.level) {
      case 'cover':
        // Slyde Cover - landing page before frames
        if (!category) {
          return (
            <motion.div
              key="no-cover"
              className="absolute inset-0 bg-slate-900 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/60">Slyde not found</p>
            </motion.div>
          )
        }
        return (
          <motion.div
            key={`cover-${state.categoryId}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SlydeCover
              name={category.label}
              description={category.description}
              backgroundType={category.coverBackgroundType}
              videoSrc={category.coverVideoSrc}
              imageSrc={category.coverImageUrl}
              posterSrc={category.coverPosterUrl}
              videoFilter={category.coverVideoFilter as any}
              videoVignette={category.coverVideoVignette}
              videoSpeed={category.coverVideoSpeed as any}
              locationData={category.locationAddress ? {
                address: category.locationAddress,
                lat: category.locationLat,
                lng: category.locationLng,
              } : undefined}
              accentColor={viewerData.accentColor}
              onExplore={handleExploreFrames}
              onBack={handleBack}
              showBack={true}
            />
          </motion.div>
        )

      case 'frames':
        // Frames inside the Slyde
        if (!category) {
          return (
            <motion.div
              key="no-frames"
              className="absolute inset-0 bg-slate-900 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/60">Slyde not found</p>
            </motion.div>
          )
        }
        return (
          <motion.div
            key={`frames-${state.categoryId}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CategorySlydeView
              category={category}
              frameIndex={state.frameIndex}
              onFrameChange={handleFrameChange}
              onViewAll={handleViewAll}
              onBack={handleBack}
              accentColor={viewerData.accentColor}
            />
          </motion.div>
        )

      case 'inventory':
        // Inventory is now a sheet overlay, so we show CategorySlydeView underneath
        if (!category) {
          return (
            <motion.div
              key="no-category-for-inventory"
              className="absolute inset-0 bg-slate-900 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/60">Slyde not found</p>
            </motion.div>
          )
        }
        return (
          <motion.div
            key={`inventory-base-${state.categoryId}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CategorySlydeView
              category={category}
              frameIndex={state.frameIndex}
              onFrameChange={handleFrameChange}
              onViewAll={handleViewAll}
              onBack={handleBack}
              accentColor={viewerData.accentColor}
            />
            {/* Inventory sheet overlay */}
            <InventoryGridView
              isOpen={true}
              categoryName={category.label}
              items={category.inventory || []}
              onItemTap={handleItemTap}
              onClose={handleBack}
              accentColor={viewerData.accentColor}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onEnquire={handleEnquire}
            />
          </motion.div>
        )

      case 'item':
        if (!item) {
          return (
            <motion.div
              key="no-item"
              className="absolute inset-0 bg-slate-900 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/60">Item not found</p>
            </motion.div>
          )
        }
        return (
          <motion.div
            key={`item-${state.itemId}`}
            className="absolute inset-0"
            {...slideFromBottom}
            transition={transition}
          >
            <ItemSlydeView
              item={item}
              frameIndex={state.frameIndex}
              onFrameChange={handleFrameChange}
              onBack={handleBack}
              accentColor={viewerData.accentColor}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onEnquire={handleEnquire}
            />
          </motion.div>
        )

      default:
        return null
    }
  }

  // Show loading skeleton while data hydrates
  if (isLoading) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* PERSISTENT VIDEO LAYER */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: state.level === 'home' ? 1 : 0.15,
          filter: state.level === 'home' ? getFilterStyle(videoFilter) : `${getFilterStyle(videoFilter)} brightness(0.3)`,
        }}
        transition={{ duration: 0.3 }}
      >
        {(() => {
          const parsed = parseVideoUrl(videoSrc)
          // YouTube embed
          if (parsed?.type === 'youtube') {
            return (
              <iframe
                src={parsed.embedUrl}
                className="absolute inset-0 w-full h-full pointer-events-none scale-[1.5] origin-center"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                title="YouTube Video"
                style={{ border: 'none' }}
              />
            )
          }
          // Vimeo embed
          if (parsed?.type === 'vimeo') {
            return (
              <iframe
                src={parsed.embedUrl}
                className="absolute inset-0 w-full h-full pointer-events-none"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                title="Vimeo Video"
                style={{ border: 'none' }}
              />
            )
          }
          // Direct video (mp4, webm, Cloudflare HLS, etc.)
          return (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )
        })()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
      </motion.div>

      {/* Vignette overlay */}
      {videoVignette && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={VIGNETTE_STYLE}
        />
      )}

      {/* HOME UI OVERLAY */}
      <AnimatePresence>
        {state.level === 'home' && (
          <motion.div
            key="home-overlay"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <HomeSlydeOverlay
              data={viewerData}
              drawerOpen={drawerOpen}
              onDrawerOpen={() => setDrawerOpen(true)}
              onDrawerClose={() => setDrawerOpen(false)}
              onCategoryTap={handleCategoryTap}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATEGORY/INVENTORY/ITEM OVERLAY */}
      <AnimatePresence>
        {state.level !== 'home' && renderOverlayView()}
      </AnimatePresence>

      {/* FLOATING CART BUTTON - Top right, opens bottom sheet */}
      <FloatingCartButton
        items={cart.items}
        itemCount={cart.itemCount}
        totalFormatted={cart.totalFormatted}
        isOpen={cart.isOpen}
        onToggle={() => cart.setIsOpen(!cart.isOpen)}
        onCheckout={handleCheckout}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        accentColor={viewerData.accentColor}
      />

      {/* BACKGROUND AUDIO PLAYER - Persistent across navigation */}
      <BackgroundAudioPlayer
        ref={audioRef}
        src={musicSrc}
        muted={isMusicMuted}
      />

      {/* Invisible tap target to unlock audio on first interaction (mobile) */}
      <div
        className="absolute inset-0 z-[1] pointer-events-auto"
        onClick={unlockAudio}
        onTouchStart={unlockAudio}
        style={{ pointerEvents: isMusicPlaying ? 'none' : 'auto' }}
      />

    </div>
  )
}
