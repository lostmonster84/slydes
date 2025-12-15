'use client'

import { useEffect, useMemo, useState } from 'react'

export type DemoBusinessId = 'wildtrax' | 'northshore' | 'cafeluna'

export type DemoBusinessState = {
  id: DemoBusinessId
  name: string
  domain: string
  hasSlydes: boolean
  slydesCount: number
  framesTotal: number
  hasEnquiries: boolean
  enquiriesCount: number
  hasAnalyticsData: boolean
}

const STORAGE_KEY = 'slydes_demo_business'

const DEMO_BUSINESS_STATE: Record<DemoBusinessId, DemoBusinessState> = {
  wildtrax: {
    id: 'wildtrax',
    name: 'WildTrax',
    domain: 'wildtrax.slydes.io',
    hasSlydes: true,
    slydesCount: 2,
    framesTotal: 12,
    hasEnquiries: true,
    enquiriesCount: 3,
    hasAnalyticsData: true,
  },
  // “New signup” business: empty across the board
  northshore: {
    id: 'northshore',
    name: 'Northshore Realty',
    domain: 'northshore.slydes.io',
    hasSlydes: false,
    slydesCount: 0,
    framesTotal: 0,
    hasEnquiries: false,
    enquiriesCount: 0,
    hasAnalyticsData: false,
  },
  // Has a Slyde but no volume yet (shows “no data yet” analytics)
  cafeluna: {
    id: 'cafeluna',
    name: 'Cafe Luna',
    domain: 'cafeluna.slydes.io',
    hasSlydes: true,
    slydesCount: 1,
    framesTotal: 6,
    hasEnquiries: false,
    enquiriesCount: 0,
    hasAnalyticsData: false,
  },
}

function coerceDemoBusinessId(input: string | null): DemoBusinessId {
  if (input === 'wildtrax' || input === 'northshore' || input === 'cafeluna') return input
  return 'wildtrax'
}

export function useDemoBusiness() {
  const [businessId, setBusinessId] = useState<DemoBusinessId>('wildtrax')

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        setBusinessId(coerceDemoBusinessId(stored))
      } catch {
        // ignore
      }
    }

    syncFromStorage()

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) syncFromStorage()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener('slydes_demo_business_change', syncFromStorage as EventListener)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('slydes_demo_business_change', syncFromStorage as EventListener)
    }
  }, [])

  const state = useMemo(() => DEMO_BUSINESS_STATE[businessId], [businessId])
  return state
}


