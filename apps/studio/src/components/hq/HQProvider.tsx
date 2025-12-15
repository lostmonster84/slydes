'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useOrganization, Organization } from '@/hooks/useOrganization'
import { useSlydes, Slyde } from '@/hooks/useSlydes'

interface HQContextValue {
  // Organization
  organization: Organization | null
  organizations: Organization[]
  isLoadingOrg: boolean
  switchOrganization: (orgId: string) => Promise<void>
  updateOrganization: (updates: Partial<Organization>) => Promise<void>

  // Slydes
  slydes: Slyde[]
  slydeCount: number
  isLoadingSlydes: boolean

  // Plan (derived from profile, demo toggle for now)
  plan: 'free' | 'creator'
  setPlan: (plan: 'free' | 'creator') => void
  isCreator: boolean
}

const HQContext = createContext<HQContextValue | null>(null)

export function useHQ() {
  const context = useContext(HQContext)
  if (!context) {
    throw new Error('useHQ must be used within HQProvider')
  }
  return context
}

interface HQProviderProps {
  children: ReactNode
}

export function HQProvider({ children }: HQProviderProps) {
  const {
    organization,
    organizations,
    isLoading: isLoadingOrg,
    switchOrganization,
    updateOrganization,
  } = useOrganization()

  const { slydes, isLoading: isLoadingSlydes } = useSlydes()

  // Plan state (for demo purposes - will come from Stripe later)
  const [plan, setPlan] = useState<'free' | 'creator'>('free')

  // Persist plan preference (demo)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('slydes_demo_plan')
      if (stored === 'free' || stored === 'creator') {
        setPlan(stored)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('slydes_demo_plan', plan)
    } catch {
      // ignore
    }
  }, [plan])

  const value: HQContextValue = {
    organization,
    organizations,
    isLoadingOrg,
    switchOrganization,
    updateOrganization,
    slydes,
    slydeCount: slydes.length,
    isLoadingSlydes,
    plan,
    setPlan,
    isCreator: plan === 'creator',
  }

  return (
    <HQContext.Provider value={value}>
      {children}
    </HQContext.Provider>
  )
}
