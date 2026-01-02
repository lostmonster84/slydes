/**
 * Slyde Demo Components - Studio App
 * Re-exports from @slydes/slyde-viewer shared package.
 *
 * TERMINOLOGY (per STRUCTURE.md):
 * - Profile → Slyde → Frame
 * - Slyde = shareable experience
 * - Frame = vertical screen inside a Slyde
 *
 * @see docs/SLYDESBUILD.md for full documentation
 * @see docs/STRUCTURE.md for hierarchy
 */

// Re-export everything from shared package
export * from '@slydes/slyde-viewer'

// Studio-only components (not in shared package)
export { DemoModeOverlay } from './DemoModeOverlay'
