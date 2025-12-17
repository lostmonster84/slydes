'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useOrganization, Organization } from '@/hooks/useOrganization'
import { useSlydes, Slyde } from '@/hooks/useSlydes'
import { usePlan, type PlanType } from '@/hooks/usePlan'

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
  plan: PlanType
  setPlan: (plan: PlanType) => void
  isPaid: boolean // creator or pro
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

  // Use shared plan state from usePlan hook
  const { plan, setPlan, isPaid } = usePlan()

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
    isPaid,
  }

  return (
    <HQContext.Provider value={value}>
      {children}
    </HQContext.Provider>
  )
}
