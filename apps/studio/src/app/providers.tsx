'use client'

import { ReactNode } from 'react'
import { PlanProvider } from '@/hooks/usePlan'

/**
 * Client-side providers wrapper
 *
 * Wraps the app with all client-side context providers.
 * Add new providers here to make them available throughout the app.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <PlanProvider>
      {children}
    </PlanProvider>
  )
}
