import type { DemoHomeSlyde } from './demoHomeSlyde'

/**
 * Starter Templates - DISABLED
 *
 * New signups now start with a completely blank canvas.
 * No pre-populated categories, frames, or demo content.
 * Users build their Slyde from scratch.
 */

export interface StarterTemplate {
  title: string
  subtitle: string
  backgroundGradient: string
  categories: Array<{
    id: string
    icon: string
    name: string
    description: string
    frames: Array<{
      id: string
      title: string
      subtitle: string
    }>
  }>
}

/**
 * Get the starter template for a business type
 * Returns null - we no longer pre-populate content
 */
export function getStarterTemplate(_businessType: string): StarterTemplate | null {
  return null
}

/**
 * Apply a starter template - returns empty DemoHomeSlyde
 * New users start with a blank canvas
 */
export function applyStarterTemplate(_businessType: string): DemoHomeSlyde | null {
  // Return null - no starter content
  // The default empty state from demoHomeSlyde.ts will be used
  return null
}
