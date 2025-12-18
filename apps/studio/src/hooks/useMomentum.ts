'use client'

import { useEffect, useState, useCallback } from 'react'
import { useOrganization } from './useOrganization'

/**
 * Momentum Hook - Powers the Dashboard with real analytics data
 *
 * Fetches from /api/analytics/momentum and provides:
 * - Hero metrics (CTA clicks, completion rate, trends)
 * - Ranked slydes by performance
 * - AI-free coaching suggestions
 * - Next action to take
 */

export interface MomentumHero {
  totalClicks: number
  clicksDelta: number
  avgCompletion: number
  completionDelta: number
}

export interface RankedSlyde {
  rank: number
  id: string
  name: string
  views: number
  completion: number
  completionDelta: number
  ctaClicks: number
  dropFrame: string
  dropPct: number
}

export interface CoachingSuggestion {
  type: 'drop_off' | 'low_completion' | 'no_cta' | 'good_performance' | 'no_data'
  severity: 'critical' | 'warning' | 'info' | 'success'
  message: string
  action: string
  slydeName?: string
  frameLabel?: string
  metric?: number
}

export interface NextAction {
  slydeName: string
  frameLabel?: string
  leakPct?: number
  suggestion: string
  actionLabel: string
}

export interface LastWin {
  slydeName: string
  improvement: string
}

export interface MomentumData {
  hasData: boolean
  range: string
  hero: MomentumHero
  rankedSlydes: RankedSlyde[]
  coaching: CoachingSuggestion[]
  nextAction: NextAction | null
  lastWin: LastWin | null
}

interface UseMomentum {
  data: MomentumData | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  setRange: (range: '7d' | '30d' | '90d') => void
  range: '7d' | '30d' | '90d'
}

export function useMomentum(): UseMomentum {
  const { organization, isLoading: orgLoading } = useOrganization()
  const [data, setData] = useState<MomentumData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d')

  const fetchMomentum = useCallback(async () => {
    if (!organization?.slug) {
      setData(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch(`/api/analytics/momentum?org=${organization.slug}&range=${range}`)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch momentum data: ${res.status}`)
      }

      const json = await res.json()

      setData({
        hasData: json.hasData,
        range: json.range || `${range}`,
        hero: json.hero,
        rankedSlydes: json.rankedSlydes || [],
        coaching: json.coaching || [],
        nextAction: json.nextAction,
        lastWin: json.lastWin,
      })
    } catch (err) {
      console.error('Error fetching momentum:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch momentum'))
    } finally {
      setIsLoading(false)
    }
  }, [organization?.slug, range])

  useEffect(() => {
    if (!orgLoading) {
      fetchMomentum()
    }
  }, [organization, orgLoading, range, fetchMomentum])

  return {
    data,
    isLoading: orgLoading || isLoading,
    error,
    refetch: fetchMomentum,
    setRange,
    range,
  }
}

/**
 * Hook for single slyde analytics
 */
export interface SlydeAnalytics {
  id: string
  name: string
  views: number
  viewsDelta: number
  completion: number
  completionDelta: number
  swipeDepth: number
  ctaClicks: number
  clicksDelta: number
  ctaRate: number
  shares: number
  hearts: number
  trafficSources: { source: string; pct: number; count: number }[]
  frames: {
    label: string
    title: string | null
    templateType: string | null
    pct: number
    drop: number
    views: number
    ctaClicks: number
  }[]
  biggestDrop: { frame: string; frameIndex: number; drop: number }
  bestCta: { text: string; rate: number; frame: string; frameIndex: number }
  totalFrames: number
}

interface UseSlydeAnalytics {
  data: SlydeAnalytics | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  setRange: (range: '7d' | '30d' | '90d') => void
  range: '7d' | '30d' | '90d'
}

export function useSlydeAnalytics(slydePublicId: string | null): UseSlydeAnalytics {
  const { organization, isLoading: orgLoading } = useOrganization()
  const [data, setData] = useState<SlydeAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d')

  const fetchAnalytics = useCallback(async () => {
    if (!organization?.slug || !slydePublicId) {
      setData(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch(
        `/api/analytics/slyde?org=${organization.slug}&slyde=${slydePublicId}&range=${range}`
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch slyde analytics: ${res.status}`)
      }

      const json = await res.json()
      setData(json.slyde)
    } catch (err) {
      console.error('Error fetching slyde analytics:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
    } finally {
      setIsLoading(false)
    }
  }, [organization?.slug, slydePublicId, range])

  useEffect(() => {
    if (!orgLoading) {
      fetchAnalytics()
    }
  }, [organization, orgLoading, slydePublicId, range, fetchAnalytics])

  return {
    data,
    isLoading: orgLoading || isLoading,
    error,
    refetch: fetchAnalytics,
    setRange,
    range,
  }
}
