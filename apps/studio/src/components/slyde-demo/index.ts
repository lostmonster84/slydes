/**
 * Slyde Demo Components
 *
 * Portable components for building Slyde experiences.
 *
 * TERMINOLOGY (per STRUCTURE.md):
 * - Profile → Slyde → Frame
 * - Slyde = shareable experience
 * - Frame = vertical screen inside a Slyde
 *
 * @see docs/SLYDESBUILD.md for full documentation
 * @see docs/STRUCTURE.md for hierarchy
 */

// Core Components
export { DevicePreview, HomeIndicator, PhoneFrame } from './DevicePreview'
export { SlydeScreen } from './SlydeScreen'

// UI Components
export { Badge } from './Badge'
export { RatingDisplay } from './RatingDisplay'
export { SocialActionStack } from './SocialActionStack'
export { ProfilePill } from './ProfilePill'
export { CTAButton } from './CTAButton'

// Bottom Sheets
export { InfoSheet } from './InfoSheet'
export { ShareSheet } from './ShareSheet'
export { AboutSheet } from './AboutSheet'
export { ConnectSheet } from './ConnectSheet'
export { SheetHandle } from './SheetHandle'

// Special Frames
export { SlydesPromoSlide } from './SlydesPromoSlide'

// Types - no demo data
export {
  type FrameData,
  type FrameInfoContent,
  type FAQItem,
  type FAQInboxItem,
  type Review,
  type BusinessInfo,
  type CTAIconType,
  type CTAType,
  type SlydeConfig,
  type ListItem,
  type ListData,
  type SocialLinks,
  // Helpers
  emptyBusinessInfo,
  createEmptyFrame,
  // Backwards compatibility (deprecated)
  type SlideData,
  type SlideInfoContent,
} from './frameData'
