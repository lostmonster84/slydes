'use client'

import { useMemo } from 'react'
import { useDemoHomeSlyde } from './demoHomeSlyde'

/**
 * Business State Hook
 *
 * Returns derived state based on actual user data (from localStorage/demoHomeSlyde).
 * No hardcoded demo data - reflects the real state of the user's Slyde.
 */

export type DemoBusinessState = {
  id: string
  name: string
  domain: string
  hasSlydes: boolean
  slydesCount: number
  framesTotal: number
  hasEnquiries: boolean
  enquiriesCount: number
  hasAnalyticsData: boolean
}

export function useDemoBusiness(): DemoBusinessState {
  const { data: homeSlyde, hydrated } = useDemoHomeSlyde()

  return useMemo(() => {
    // Count categories (sections) and frames
    const slydesCount = homeSlyde.categories.length
    const framesTotal = Object.values(homeSlyde.childFrames || {}).reduce(
      (sum, frames) => sum + (frames?.length ?? 0),
      0
    )

    // Derive state from actual data
    const hasSlydes = slydesCount > 0
    const hasAnalyticsData = hasSlydes && framesTotal > 0 // Only show analytics when there's content

    return {
      id: 'user-business', // Generic ID for API calls
      name: 'Your Business', // Will be replaced by org name from Supabase
      domain: 'yourbusiness.slydes.io',
      hasSlydes,
      slydesCount,
      framesTotal,
      hasEnquiries: false, // No demo enquiries - real ones come from DB
      enquiriesCount: 0,
      hasAnalyticsData,
    }
  }, [homeSlyde.categories, homeSlyde.childFrames])
}
