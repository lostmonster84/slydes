export type DemoBrandProfile = {
  businessName: string
  tagline: string
  primaryColor: string // hex
  secondaryColor: string // hex
}

export const DEMO_BRAND_STORAGE_KEY = 'slydes_demo_brand'

export const DEFAULT_DEMO_BRAND: DemoBrandProfile = {
  businessName: 'WildTrax',
  tagline: 'Adventure awaits',
  primaryColor: '#2563EB',
  secondaryColor: '#06B6D4',
}

function isHexColor(input: string) {
  return /^#[0-9a-fA-F]{6}$/.test(input)
}

export function readDemoBrandProfile(): DemoBrandProfile {
  if (typeof window === 'undefined') return DEFAULT_DEMO_BRAND
  try {
    const raw = window.localStorage.getItem(DEMO_BRAND_STORAGE_KEY)
    if (!raw) return DEFAULT_DEMO_BRAND
    const parsed = JSON.parse(raw) as Partial<DemoBrandProfile>
    return {
      businessName: typeof parsed.businessName === 'string' && parsed.businessName.trim() ? parsed.businessName : DEFAULT_DEMO_BRAND.businessName,
      tagline: typeof parsed.tagline === 'string' ? parsed.tagline : DEFAULT_DEMO_BRAND.tagline,
      primaryColor: typeof parsed.primaryColor === 'string' && isHexColor(parsed.primaryColor) ? parsed.primaryColor : DEFAULT_DEMO_BRAND.primaryColor,
      secondaryColor: typeof parsed.secondaryColor === 'string' && isHexColor(parsed.secondaryColor) ? parsed.secondaryColor : DEFAULT_DEMO_BRAND.secondaryColor,
    }
  } catch {
    return DEFAULT_DEMO_BRAND
  }
}

export const DEMO_BRAND_CHANGE_EVENT = 'slydes_demo_brand_change'

export function writeDemoBrandProfile(profile: DemoBrandProfile) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(DEMO_BRAND_STORAGE_KEY, JSON.stringify(profile))
    // Dispatch custom event for same-tab listeners
    window.dispatchEvent(new CustomEvent(DEMO_BRAND_CHANGE_EVENT, { detail: profile }))
  } catch {
    // ignore
  }
}

export function demoBrandGradient(profile: DemoBrandProfile) {
  return `linear-gradient(135deg, ${profile.primaryColor} 0%, ${profile.secondaryColor} 100%)`
}

/**
 * React hook for live brand sync across tabs.
 * Listens for both:
 * - `storage` events (cross-tab updates)
 * - Custom `slydes_demo_brand_change` events (same-tab updates)
 * 
 * Usage:
 * ```tsx
 * const brand = useDemoBrand()
 * ```
 */
import { useState, useEffect, useCallback } from 'react'

export function useDemoBrand(): DemoBrandProfile {
  const [brand, setBrand] = useState<DemoBrandProfile>(DEFAULT_DEMO_BRAND)

  // Initialize from localStorage
  useEffect(() => {
    setBrand(readDemoBrandProfile())
  }, [])

  // Listen for changes
  useEffect(() => {
    // Handler for cross-tab storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DEMO_BRAND_STORAGE_KEY) {
        setBrand(readDemoBrandProfile())
      }
    }

    // Handler for same-tab custom events
    const handleBrandChange = (e: Event) => {
      const customEvent = e as CustomEvent<DemoBrandProfile>
      if (customEvent.detail) {
        setBrand(customEvent.detail)
      } else {
        setBrand(readDemoBrandProfile())
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(DEMO_BRAND_CHANGE_EVENT, handleBrandChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(DEMO_BRAND_CHANGE_EVENT, handleBrandChange)
    }
  }, [])

  return brand
}
