/**
 * Frame Data Type Definitions
 *
 * This file contains type definitions for Slydes, Frames, FAQs, Reviews, etc.
 * No demo data - just the schema for the application.
 */

export type CTAIconType = 'book' | 'call' | 'view' | 'arrow' | 'menu' | 'list'

// New 1:1 mapped CTA types (icon + action bundled)
export type CTAType = 'call' | 'link' | 'email' | 'directions' | 'info' | 'faq' | 'reviews' | 'frame' | 'list'

/**
 * ListItem - An item in a List View
 * Used when CTA action is 'list' to display a browseable list of items
 */
export interface ListItem {
  id: string
  title: string
  subtitle?: string
  image?: string           // URL to thumbnail image
  price?: string           // Display price (e.g., "£18.50", "From £25")
  badge?: string           // Optional badge ("Best Seller", "New")
  frames?: FrameData[]     // Item Slyde frames for deep-dive
}

/**
 * ListData - An independent list that can be connected to via CTA
 * Lists are created separately and then referenced by frames via CTA action 'list'
 * Examples: "Our Cars", "Hair Products", "Services", "Menu Items"
 */
export interface ListData {
  id: string
  name: string             // Display name (e.g., "Our Vehicles", "Hair Products")
  items: ListItem[]        // The items in this list
}

export interface FrameInfoContent {
  headline: string
  description?: string
  items?: string[]
  highlights?: Array<{
    icon: string
    label: string
    value: string
  }>
}

export interface FrameData {
  id: string
  order: number
  /**
   * Template role for this Frame (editor/runtime semantics).
   * - Keep `id` simple (e.g. "1", "2", "3"...)
   * - Use `templateType` to drive behavior like Proof navigation and Action CTAs.
   */
  templateType?: 'hook' | 'how' | 'who' | 'what' | 'proof' | 'trust' | 'action' | 'slydes' | 'custom'
  title: string
  subtitle?: string
  badge?: string
  rating?: number
  reviewCount?: number
  heartCount: number
  cta?: {
    text: string
    // New unified type (1:1 icon-to-action mapping)
    type?: CTAType
    value?: string // Phone number, URL, email, or frame index depending on type
    // Legacy fields (kept for backward compatibility)
    icon?: CTAIconType
    action?: string // URL or action identifier (e.g., 'book', 'faq', 'reviews', 'list')
    listId?: string // Reference to a ListData.id when action is 'list'
  }
  background: {
    type: 'video' | 'image'
    src: string
    position?: string
    startTime?: number  // Video start time in seconds
    filter?: 'original' | 'cinematic' | 'vintage' | 'moody' | 'warm' | 'cool'  // VideoFilterPreset
    vignette?: boolean
    speed?: 'normal' | 'slow' | 'slower' | 'cinematic'  // VideoSpeedPreset
  }
  accentColor: string
  // Frame-specific info content for the Info sheet
  infoContent?: FrameInfoContent
  // URL-safe slug for deep-linking
  slug?: string
  // List items for when CTA action is 'list'
  listItems?: ListItem[]
  // Direct inventory connection (shows grid overlay on frame)
  listId?: string              // Reference to a ListData.id
  inventoryCtaText?: string    // CTA text for inventory (e.g., "View All 12 Vehicles")
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  // Stats (tracked when FAQ is displayed/clicked)
  views?: number        // Times this FAQ was shown
  clicks?: number       // Times this FAQ was expanded/clicked
  createdAt?: string    // ISO timestamp
  updatedAt?: string    // ISO timestamp
  // Status
  published?: boolean   // Whether FAQ is visible to customers (default: true)
}

/**
 * Unanswered question from a customer (FAQ Inbox)
 * When answered, can be converted to FAQItem
 */
export interface FAQInboxItem {
  id: string
  question: string
  categoryId: string    // Which Slyde it came from
  askedAt: string       // ISO timestamp
  // Optional metadata
  searchQuery?: string  // What they searched before asking (if any)
  frameId?: string      // Which frame they were viewing when they asked
}

export interface Review {
  id: string
  author: string
  authorLocation?: string
  rating: number
  text: string
  date: string
  source: 'google' | 'tripadvisor' | 'facebook' | 'manual' | 'imported'
  featured: boolean
  verified: boolean
}

export interface SocialLinks {
  instagram?: string
  tiktok?: string
  facebook?: string
  youtube?: string
  twitter?: string
  linkedin?: string
}

export interface BusinessInfo {
  id: string
  name: string
  tagline?: string
  location: string
  rating: number
  reviewCount: number
  credentials: Array<{
    icon: string
    label: string
    value: string
  }>
  about: string
  highlights?: string[]
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  social?: SocialLinks
  image?: string
  accentColor: string
}

/**
 * Slyde - A shareable experience containing Frames
 * Per STRUCTURE.md: Profile → Slyde → Frame
 */
export interface SlydeConfig {
  id: string
  slug: string
  name: string
  description?: string
  icon?: string
  accentColor?: string
}

// ============================================
// PLACEHOLDER / EMPTY DATA
// ============================================

/**
 * Empty business info template
 * Used as a starting point for new businesses
 */
export const emptyBusinessInfo: BusinessInfo = {
  id: '',
  name: '',
  tagline: '',
  location: '',
  rating: 0,
  reviewCount: 0,
  credentials: [],
  about: '',
  highlights: [],
  contact: {},
  accentColor: 'bg-blue-600'
}

/**
 * Empty frame template
 * Used when creating a new frame
 */
export function createEmptyFrame(id: string, order: number): FrameData {
  return {
    id,
    order,
    title: '',
    subtitle: '',
    heartCount: 0,
    background: {
      type: 'image',
      src: '',
    },
    accentColor: 'bg-blue-600',
  }
}

// ============================================
// BACKWARDS COMPATIBILITY EXPORTS
// ============================================

/** @deprecated Use FrameData instead */
export type SlideData = FrameData
/** @deprecated Use FrameInfoContent instead */
export type SlideInfoContent = FrameInfoContent
