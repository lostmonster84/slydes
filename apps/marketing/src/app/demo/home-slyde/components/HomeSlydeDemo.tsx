'use client'

import { useReducer, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DevicePreview } from '@/components/slyde-demo/DevicePreview'
import { HomeSlydeScreen } from './HomeSlydeScreen'
import { CategorySlydeView } from './CategorySlydeView'
import { InventoryGridView } from './InventoryGridView'
import { ItemSlydeView } from './ItemSlydeView'
import { FlowBreadcrumb } from './FlowBreadcrumb'
import { highlandMotorsData, getCategory, getInventoryItem } from '../data/highlandMotorsData'

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

  // Handlers
  const handleCategoryTap = useCallback((categoryId: string) => {
    dispatch({ type: 'TAP_CATEGORY', categoryId })
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

  // Get current data
  const category = state.categoryId ? getCategory(state.categoryId) : null
  const item = state.categoryId && state.itemId
    ? getInventoryItem(state.categoryId, state.itemId)
    : null

  // Determine which view to render
  const renderView = () => {
    switch (state.level) {
      case 'home':
        return (
          <motion.div
            key="home"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={slideFromRight.exit}
            transition={transition}
          >
            <HomeSlydeScreen
              data={highlandMotorsData}
              onCategoryTap={handleCategoryTap}
            />
          </motion.div>
        )

      case 'category':
        if (!category) {
          return (
            <div key="no-category" className="absolute inset-0 bg-red-900 flex items-center justify-center">
              <p className="text-white">No category found: {state.categoryId}</p>
            </div>
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
              accentColor={highlandMotorsData.accentColor}
            />
          </motion.div>
        )

      case 'inventory':
        return (
          <motion.div
            key={`inventory-${state.categoryId}`}
            className="absolute inset-0"
            {...fadeScale}
            transition={transition}
          >
            {category?.inventory && (
              <InventoryGridView
                categoryName={category.label}
                items={category.inventory}
                onItemTap={handleItemTap}
                onBack={handleBack}
                accentColor={highlandMotorsData.accentColor}
              />
            )}
          </motion.div>
        )

      case 'item':
        return (
          <motion.div
            key={`item-${state.itemId}`}
            className="absolute inset-0"
            {...slideFromBottom}
            transition={transition}
          >
            {item && (
              <ItemSlydeView
                item={item}
                frameIndex={state.frameIndex}
                onFrameChange={handleFrameChange}
                onBack={handleBack}
                accentColor={highlandMotorsData.accentColor}
              />
            )}
          </motion.div>
        )
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
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </div>
      </DevicePreview>
    </div>
  )
}
