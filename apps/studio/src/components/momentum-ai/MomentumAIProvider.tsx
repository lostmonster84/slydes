'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { MomentumAI, MomentumAITrigger } from './MomentumAI'
import { usePlan } from '@/hooks/usePlan'

interface MomentumAIContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const MomentumAIContext = createContext<MomentumAIContextValue | null>(null)

export function useMomentumAI() {
  const ctx = useContext(MomentumAIContext)
  if (!ctx) {
    throw new Error('useMomentumAI must be used within MomentumAIProvider')
  }
  return ctx
}

/**
 * MomentumAIProvider - Global provider for Momentum AI access
 *
 * Wraps the entire Studio app to provide Momentum AI access on every page.
 * The floating trigger appears on all pages, and Pro users get unlimited access.
 */
export function MomentumAIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const { isPro } = usePlan()

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((v) => !v)

  return (
    <MomentumAIContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}

      {/* Global floating trigger - always visible */}
      <MomentumAITrigger onClick={open} />

      {/* The panel itself */}
      <MomentumAI
        isOpen={isOpen}
        onClose={close}
        isPro={isPro}
      />
    </MomentumAIContext.Provider>
  )
}
