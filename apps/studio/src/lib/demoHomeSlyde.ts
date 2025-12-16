import { useEffect, useState } from 'react'
import type { FrameData } from '@/components/slyde-demo/frameData'

export type DemoHomeSlydeCategory = {
  id: string
  icon: string
  name: string
  description: string
  /**
   * Links a Home Slyde category to a Child Slyde (shareable experience).
   * This powers Option A: Home Slyde → Category Slyde (child) → (optional) Inventory → Item.
   */
  childSlydeId: string
  /**
   * PAID FEATURE: When true, this category has an inventory grid.
   * The Category Slyde shows "View All" CTA → Inventory Grid → Item Slydes.
   */
  hasInventory?: boolean
  /**
   * CTA text for inventory link, e.g. "View All 12 Vehicles"
   */
  inventoryCtaText?: string
}

export type DemoHomeSlyde = {
  videoSrc: string
  posterSrc?: string
  categories: DemoHomeSlydeCategory[]
  primaryCta?: {
    text: string
    action: string
  }
  // UI Settings - toggles for what appears on the Home Slyde
  showCategoryIcons?: boolean
  showHearts?: boolean
  showShare?: boolean
  showSound?: boolean
  showReviews?: boolean
  // Child Slyde frames keyed by category ID
  childFrames?: Record<string, FrameData[]>
}

export const DEMO_HOME_SLYDE_STORAGE_KEY = 'slydes_demo_home_slyde'
export const DEMO_HOME_SLYDE_CHANGE_EVENT = 'slydes_demo_home_slyde_change'

export const DEFAULT_DEMO_HOME_SLYDE: DemoHomeSlyde = {
  videoSrc: '',
  posterSrc: undefined,
  categories: [],
  primaryCta: { text: 'Contact us', action: '#' },
  // UI Settings defaults
  showCategoryIcons: false,
  showHearts: true,
  showShare: true,
  showSound: true,
  showReviews: true,
  // Empty child frames by default - editor populates these
  childFrames: {},
}

function safeParse(raw: string | null): Partial<DemoHomeSlyde> | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as Partial<DemoHomeSlyde>
  } catch {
    return null
  }
}

export function readDemoHomeSlyde(): DemoHomeSlyde {
  if (typeof window === 'undefined') return DEFAULT_DEMO_HOME_SLYDE
  const parsed = safeParse(window.localStorage.getItem(DEMO_HOME_SLYDE_STORAGE_KEY))
  if (!parsed) return DEFAULT_DEMO_HOME_SLYDE

  const categories = Array.isArray(parsed.categories) ? parsed.categories : DEFAULT_DEMO_HOME_SLYDE.categories

  return {
    videoSrc: typeof parsed.videoSrc === 'string' && parsed.videoSrc.trim() ? parsed.videoSrc : DEFAULT_DEMO_HOME_SLYDE.videoSrc,
    posterSrc: typeof parsed.posterSrc === 'string' && parsed.posterSrc.trim() ? parsed.posterSrc : undefined,
    categories: categories
      .filter(Boolean)
      .slice(0, 6)
      .map((c: any, idx: number) => ({
        id: typeof c?.id === 'string' && c.id.trim() ? c.id : `cat-${idx + 1}`,
        icon: typeof c?.icon === 'string' && c.icon.trim() ? c.icon : '✨',
        // Support both old `label` and new `name` field
        name: typeof c?.name === 'string' && c.name.trim() ? c.name : (typeof c?.label === 'string' && c.label.trim() ? c.label : 'Category'),
        description: typeof c?.description === 'string' ? c.description : '',
        childSlydeId: typeof c?.childSlydeId === 'string' && c.childSlydeId.trim() ? c.childSlydeId : 'camping',
        hasInventory: typeof c?.hasInventory === 'boolean' ? c.hasInventory : false,
        inventoryCtaText: typeof c?.inventoryCtaText === 'string' ? c.inventoryCtaText : undefined,
      })),
    primaryCta: parsed.primaryCta && typeof parsed.primaryCta === 'object'
      ? {
          text: typeof (parsed.primaryCta as any).text === 'string' ? (parsed.primaryCta as any).text : DEFAULT_DEMO_HOME_SLYDE.primaryCta?.text || '',
          action: typeof (parsed.primaryCta as any).action === 'string' ? (parsed.primaryCta as any).action : DEFAULT_DEMO_HOME_SLYDE.primaryCta?.action || '',
        }
      : DEFAULT_DEMO_HOME_SLYDE.primaryCta,
    showCategoryIcons: typeof parsed.showCategoryIcons === 'boolean' ? parsed.showCategoryIcons : false,
    showHearts: typeof parsed.showHearts === 'boolean' ? parsed.showHearts : true,
    showShare: typeof parsed.showShare === 'boolean' ? parsed.showShare : true,
    showSound: typeof parsed.showSound === 'boolean' ? parsed.showSound : true,
    showReviews: typeof parsed.showReviews === 'boolean' ? parsed.showReviews : true,
    // Parse childFrames - stored as Record<string, FrameData[]>
    childFrames: parsed.childFrames && typeof parsed.childFrames === 'object'
      ? (parsed.childFrames as Record<string, FrameData[]>)
      : {},
  }
}

export function writeDemoHomeSlyde(next: DemoHomeSlyde) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(DEMO_HOME_SLYDE_STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent(DEMO_HOME_SLYDE_CHANGE_EVENT, { detail: next }))
  } catch {
    // ignore
  }
}

export interface UseDemoHomeSlydeResult {
  data: DemoHomeSlyde
  hydrated: boolean
}

export function useDemoHomeSlyde(): UseDemoHomeSlydeResult {
  const [home, setHome] = useState<DemoHomeSlyde>(DEFAULT_DEMO_HOME_SLYDE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHome(readDemoHomeSlyde())
    setHydrated(true)
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === DEMO_HOME_SLYDE_STORAGE_KEY) setHome(readDemoHomeSlyde())
    }
    const onSameTab = (e: Event) => {
      const ce = e as CustomEvent<DemoHomeSlyde>
      if (ce.detail) setHome(ce.detail)
      else setHome(readDemoHomeSlyde())
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(DEMO_HOME_SLYDE_CHANGE_EVENT, onSameTab)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(DEMO_HOME_SLYDE_CHANGE_EVENT, onSameTab)
    }
  }, [])

  return { data: home, hydrated }
}

// ============================================
// Child Frames Helpers
// ============================================

/**
 * Read frames for a specific category from localStorage
 */
export function readChildFrames(categoryId: string): FrameData[] | null {
  const current = readDemoHomeSlyde()
  return current.childFrames?.[categoryId] ?? null
}

/**
 * Write frames for a specific category to localStorage
 */
export function writeChildFrames(categoryId: string, frames: FrameData[]) {
  const current = readDemoHomeSlyde()
  writeDemoHomeSlyde({
    ...current,
    childFrames: {
      ...current.childFrames,
      [categoryId]: frames,
    },
  })
}

/**
 * Delete frames for a specific category (e.g., when category is deleted)
 */
export function deleteChildFrames(categoryId: string) {
  const current = readDemoHomeSlyde()
  if (!current.childFrames?.[categoryId]) return
  const { [categoryId]: _, ...rest } = current.childFrames
  writeDemoHomeSlyde({
    ...current,
    childFrames: rest,
  })
}
