import { useEffect, useState } from 'react'

export type DemoHomeSlydeCategory = {
  id: string
  icon: string
  label: string
  description: string
  /**
   * Links a Home Slyde category to a Child Slyde (shareable experience).
   * This powers Option A: Home Slyde → Category Slyde (child) → (optional) Inventory → Item.
   */
  childSlydeId: string
}

export type DemoHomeSlyde = {
  videoSrc: string
  posterSrc?: string
  categories: DemoHomeSlydeCategory[]
  primaryCta?: {
    text: string
    action: string
  }
}

export const DEMO_HOME_SLYDE_STORAGE_KEY = 'slydes_demo_home_slyde'
export const DEMO_HOME_SLYDE_CHANGE_EVENT = 'slydes_demo_home_slyde_change'

export const DEFAULT_DEMO_HOME_SLYDE: DemoHomeSlyde = {
  videoSrc: '/videos/adventure.mp4',
  posterSrc: undefined,
  categories: [
    { id: 'camping', icon: '🏕️', label: 'Camping', description: 'Land Rover + rooftop tent', childSlydeId: 'camping' },
    { id: 'just-drive', icon: '🚗', label: 'Just Drive', description: 'Day hire, freedom to roam', childSlydeId: 'just-drive' },
  ],
  primaryCta: { text: 'Check availability', action: 'https://wildtrax.co.uk/book' },
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
        label: typeof c?.label === 'string' && c.label.trim() ? c.label : 'Category',
        description: typeof c?.description === 'string' ? c.description : '',
        childSlydeId: typeof c?.childSlydeId === 'string' && c.childSlydeId.trim() ? c.childSlydeId : 'camping',
      })),
    primaryCta: parsed.primaryCta && typeof parsed.primaryCta === 'object'
      ? {
          text: typeof (parsed.primaryCta as any).text === 'string' ? (parsed.primaryCta as any).text : DEFAULT_DEMO_HOME_SLYDE.primaryCta?.text || '',
          action: typeof (parsed.primaryCta as any).action === 'string' ? (parsed.primaryCta as any).action : DEFAULT_DEMO_HOME_SLYDE.primaryCta?.action || '',
        }
      : DEFAULT_DEMO_HOME_SLYDE.primaryCta,
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

export function useDemoHomeSlyde(): DemoHomeSlyde {
  const [home, setHome] = useState<DemoHomeSlyde>(DEFAULT_DEMO_HOME_SLYDE)

  useEffect(() => {
    setHome(readDemoHomeSlyde())
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

  return home
}


