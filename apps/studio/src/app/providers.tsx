'use client'

import { ReactNode } from 'react'
import { PlanProvider } from '@/hooks/usePlan'
import { MomentumAIProvider } from '@/components/momentum-ai'

/**
 * Client-side providers wrapper
 *
 * Wraps the app with all client-side context providers.
 * Add new providers here to make them available throughout the app.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <PlanProvider>
      <MomentumAIProvider>
        {children}
      </MomentumAIProvider>
    </PlanProvider>
  )
}
