/**
 * @slydes/slyde-viewer
 *
 * Shared viewer components for Slydes.
 * Single source of truth for both Studio and Marketing apps.
 *
 * TERMINOLOGY (per STRUCTURE.md):
 * - Profile → Slyde → Frame
 * - Slyde = shareable experience
 * - Frame = vertical screen inside a Slyde
 */

// Core Components
export { DevicePreview, HomeIndicator, PhoneFrame } from './components/DevicePreview'
export { SlydeScreen } from './components/SlydeScreen'
export { SlydeCover } from './components/SlydeCover'

// UI Components
export { Badge } from './components/Badge'
export { RatingDisplay } from './components/RatingDisplay'
export { SocialActionStack } from './components/SocialActionStack'
export { ProfilePill } from './components/ProfilePill'
export { CTAButton } from './components/CTAButton'
export type { CTAButtonProps } from './components/CTAButton'

// Bottom Sheets
export { InfoSheet } from './components/InfoSheet'
export { ShareSheet } from './components/ShareSheet'
export { AboutSheet } from './components/AboutSheet'
export { ConnectSheet } from './components/ConnectSheet'
export { LocationSheet } from './components/LocationSheet'
export { PropertyDetailsSheet } from './components/PropertyDetailsSheet'
export { SheetHandle } from './components/SheetHandle'

// Overlays
export { VideoPlayerOverlay } from './components/VideoPlayerOverlay'

// Special Frames
export { SlydesPromoSlide } from './components/SlydesPromoSlide'

// Types
export type {
  FrameData,
  FrameInfoContent,
  FAQItem,
  FAQInboxItem,
  Review,
  BusinessInfo,
  CTAIconType,
  CTAType,
  SlydeConfig,
  ListItem,
  ListData,
  SocialLinks,
  LocationData,
  // Backwards compatibility (deprecated)
  SlideData,
  SlideInfoContent,
} from './types'

// Helper functions
export { emptyBusinessInfo, createEmptyFrame } from './types'

// Lib utilities
export {
  getFilterStyle,
  getFilterConfig,
  getSpeedRate,
  VIDEO_FILTERS,
  VIDEO_SPEEDS,
  VIGNETTE_STYLE,
  type VideoFilterPreset,
  type VideoFilterConfig,
  type VideoSpeedPreset,
  type VideoSpeedConfig,
} from './lib/videoFilters'

export {
  parseVideoUrl,
  getVideoUrlType,
} from './lib/videoUtils'
