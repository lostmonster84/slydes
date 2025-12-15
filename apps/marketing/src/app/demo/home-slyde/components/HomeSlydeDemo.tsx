'use client'

import { useReducer, useCallback, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DevicePreview } from '@/components/slyde-demo/DevicePreview'
import { HomeSlydeOverlay } from './HomeSlydeOverlay'
import { CategorySlydeView } from './CategorySlydeView'
import { InventoryGridView } from './InventoryGridView'
import { ItemSlydeView } from './ItemSlydeView'
import { FlowBreadcrumb } from './FlowBreadcrumb'
import { highlandMotorsData, getCategory as getHardcodedCategory, getInventoryItem } from '../data/highlandMotorsData'
import type { HomeSlydeData, CategoryData, FrameData as ViewerFrameData } from '../data/highlandMotorsData'
import { useDemoHomeSlyde } from '@/lib/demoHomeSlyde'
import type { FrameData as EditorFrameData } from '@/components/slyde-demo/frameData'

// ============================================
// STATE MACHINE
// ============================================

type Level = 'home' | 'category' | 'inventory' | 'item'

interface NavState {
  level: Level
  categoryId: string | null
  itemId: string | null
  frameIndex: number
}

type NavAction =
  | { type: 'TAP_CATEGORY'; categoryId: string }
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
      return {
        level: 'category',
        categoryId: action.categoryId,
        itemId: null,
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
          return { ...state, level: 'category', frameIndex: 0 }
        case 'category':
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

const slideFromRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
}

const slideFromBottom = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
}

const fadeScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
}

const transition = { type: 'spring', stiffness: 300, damping: 30 }

// ============================================
// MAIN COMPONENT
// ============================================

export function HomeSlydeDemo() {
  const [state, dispatch] = useReducer(navReducer, initialState)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { data: demoHome } = useDemoHomeSlyde()

  // Merge localStorage data with hardcoded fallback
  // Priority: localStorage > hardcoded
  const viewerData: HomeSlydeData = useMemo(() => {
    // If we have localStorage categories with custom frames, use those
    // Otherwise fall back to hardcoded highlandMotorsData
    const hasCustomCategories = demoHome.categories && demoHome.categories.length > 0

    if (!hasCustomCategories) {
      return highlandMotorsData
    }

    // Map localStorage categories to viewer format
    const categories: CategoryData[] = demoHome.categories.map((cat) => {
      // Get custom frames from childFrames, or fall back to hardcoded category frames
      const customFrames = demoHome.childFrames?.[cat.id] as EditorFrameData[] | undefined
      const hardcodedCategory = getHardcodedCategory(cat.id)

      // Convert editor FrameData format to viewer FrameData format
      const frames: ViewerFrameData[] = customFrames && customFrames.length > 0
        ? customFrames.map((f) => ({
            id: f.id,
            title: f.title || 'Untitled',
            subtitle: f.subtitle || '',
            badge: f.badge || undefined,
            background: {
              type: 'gradient' as const,
              // Editor uses background.src for video/image, we convert to gradient for viewer
              gradient: 'from-slate-800 to-slate-900',
            },
            cta: f.cta?.text ? { text: f.cta.text, action: f.cta.action || '' } : undefined,
            // Editor frames don't have showViewAll - that's viewer-specific
          }))
        : hardcodedCategory?.frames || [{
            id: `${cat.id}-placeholder`,
            title: cat.name,
            subtitle: cat.description,
            background: { type: 'gradient' as const, gradient: 'from-slate-800 to-slate-900' },
          }]

      return {
        id: cat.id,
        label: cat.name,
        icon: cat.icon,
        description: cat.description,
        frames,
        // Use hardcoded inventory if available for this category
        inventory: hardcodedCategory?.inventory,
      }
    })

    return {
      businessName: highlandMotorsData.businessName,
      tagline: highlandMotorsData.tagline,
      accentColor: highlandMotorsData.accentColor,
      backgroundGradient: highlandMotorsData.backgroundGradient,
      videoSrc: demoHome.videoSrc || highlandMotorsData.videoSrc,
      posterSrc: demoHome.posterSrc || highlandMotorsData.posterSrc,
      rating: highlandMotorsData.rating,
      reviewCount: highlandMotorsData.reviewCount,
      about: highlandMotorsData.about,
      address: highlandMotorsData.address,
      hours: highlandMotorsData.hours,
      phone: highlandMotorsData.phone,
      email: highlandMotorsData.email,
      website: highlandMotorsData.website,
      categories,
      primaryCta: demoHome.primaryCta || highlandMotorsData.primaryCta,
      showCategoryIcons: demoHome.showCategoryIcons,
      showHearts: demoHome.showHearts,
      showShare: demoHome.showShare,
      showSound: demoHome.showSound,
      showReviews: demoHome.showReviews,
    }
  }, [demoHome])

  // Video source from merged data
  const videoSrc = viewerData.videoSrc || '/videos/adventure.mp4'

  // Handlers
  const handleCategoryTap = useCallback((categoryId: string) => {
    setDrawerOpen(false)
    // Small delay to let drawer close before transitioning
    setTimeout(() => {
      dispatch({ type: 'TAP_CATEGORY', categoryId })
    }, 100)
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

  const handleHome = useCallback(() => {
    dispatch({ type: 'GO_HOME' })
  }, [])

  const handleFrameChange = useCallback((index: number) => {
    dispatch({ type: 'SET_FRAME', index })
  }, [])

  // Get current data from merged viewerData
  const getCategory = useCallback((categoryId: string) => {
    return viewerData.categories.find(c => c.id === categoryId)
  }, [viewerData.categories])

  const category = state.categoryId ? getCategory(state.categoryId) : null
  const item = state.categoryId && state.itemId
    ? getInventoryItem(state.categoryId, state.itemId)
    : null

  // Render overlay views (category, inventory, item) - NOT home
  const renderOverlayView = () => {
    switch (state.level) {
      case 'category':
        if (!category) {
          return (
            <motion.div
              key="no-category"
              className="absolute inset-0 bg-slate-900 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/60">Category not found</p>
            </motion.div>
          )
        }
        return (
          <motion.div
            key={`category-${state.categoryId}`}
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
        // Guard: If category has no inventory, go back
        if (!category?.inventory) {
          return (
            <motion.div
              key="no-inventory"
              className="absolute inset-0 bg-slate-900 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/60">No inventory available</p>
            </motion.div>
          )
        }
        return (
          <motion.div
            key={`inventory-${state.categoryId}`}
            className="absolute inset-0"
            {...fadeScale}
            transition={transition}
          >
            <InventoryGridView
              categoryName={category.label}
              items={category.inventory}
              onItemTap={handleItemTap}
              onBack={handleBack}
              accentColor={viewerData.accentColor}
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
            />
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative">
      {/* Breadcrumb above phone */}
      <div className="mb-4">
        <FlowBreadcrumb
          level={state.level}
          categoryName={category?.label}
          itemName={item?.title}
          onHome={handleHome}
          onCategory={state.level !== 'home' && state.level !== 'category' ? handleBack : undefined}
          onInventory={state.level === 'item' ? handleBack : undefined}
        />
      </div>

      {/* Phone device */}
      <DevicePreview enableTilt={false}>
        <div className="relative w-full h-full overflow-hidden">
          {/* PERSISTENT VIDEO LAYER - Always visible, dims when not on home */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: state.level === 'home' ? 1 : 0.15,
              filter: state.level === 'home' ? 'brightness(1)' : 'brightness(0.3)',
            }}
            transition={{ duration: 0.3 }}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          </motion.div>

          {/* HOME UI OVERLAY - Only when on home level */}
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

          {/* CATEGORY/INVENTORY/ITEM OVERLAY - When not on home */}
          <AnimatePresence>
            {state.level !== 'home' && renderOverlayView()}
          </AnimatePresence>
        </div>
      </DevicePreview>
    </div>
  )
}
