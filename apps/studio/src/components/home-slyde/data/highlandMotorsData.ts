/**
 * Home Slyde Data Types
 *
 * Type definitions for the Home Slyde data structure.
 * No demo data - just the schema.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface FrameData {
  id: string
  title: string
  subtitle?: string
  badge?: string
  background: {
    type: 'image' | 'gradient'
    src?: string
    gradient?: string
  }
  cta?: {
    text: string
    action: string
  }
  showViewAll?: boolean // Triggers inventory grid transition
}

/**
 * Commerce mode for inventory items:
 * - 'none': No commerce (default) - just view the item
 * - 'enquire': Show "Enquire" button - opens contact form
 * - 'buy_now': Show "Buy Now" button - direct to checkout
 * - 'add_to_cart': Show "Add to Cart" button - adds to global cart
 */
export type CommerceMode = 'none' | 'enquire' | 'buy_now' | 'add_to_cart'

export interface InventoryItem {
  id: string
  title: string
  subtitle: string
  price: string
  price_cents?: number // Price in cents for commerce (e.g., 4500 = £45.00)
  image: string
  badge?: string
  frames: FrameData[] // Item's own slyde frames
  commerce_mode?: CommerceMode // How this item can be purchased
}

export interface CategoryData {
  id: string
  label: string
  icon: string
  description: string
  frames: FrameData[]
  inventory?: InventoryItem[] // Only categories with inventory show "View All"
  // Cover background (landing page for this Slyde)
  coverBackgroundType?: 'video' | 'image'
  coverVideoSrc?: string
  coverImageUrl?: string
  coverPosterUrl?: string
  coverVideoFilter?: string
  coverVideoVignette?: boolean
  coverVideoSpeed?: string
  // Location
  locationAddress?: string
  locationLat?: number
  locationLng?: number
  // Contact
  contactPhone?: string
  contactEmail?: string
  contactWhatsapp?: string
}

export interface HomeSlydeData {
  organizationSlug?: string // For analytics - org slug from Supabase
  businessName: string
  tagline: string
  accentColor: string
  backgroundGradient: string
  videoSrc?: string
  posterSrc?: string
  rating?: number
  reviewCount?: number
  about?: string
  address?: string
  hours?: string
  phone?: string
  email?: string
  website?: string
  categories: CategoryData[]
  primaryCta?: {
    text: string
    action: string
  }
  showCategoryIcons?: boolean
  showHearts?: boolean
  showShare?: boolean
  showSound?: boolean
  showReviews?: boolean
  socialLinks?: {
    instagram?: string
    tiktok?: string
    facebook?: string
    youtube?: string
    twitter?: string
    linkedin?: string
  }
}

// ============================================
// EMPTY / DEFAULT DATA
// ============================================

/**
 * Empty Home Slyde data structure
 * Used as a starting point for new businesses
 */
export const emptyHomeSlydeData: HomeSlydeData = {
  businessName: '',
  tagline: '',
  accentColor: '#2563EB', // Leader Blue
  backgroundGradient: 'from-gray-900 via-gray-800 to-gray-900',
  categories: [],
  primaryCta: {
    text: 'Contact us',
    action: '#',
  },
  showCategoryIcons: false,
  showHearts: true,
  showShare: true,
  showSound: true,
  showReviews: true,
}

// Helper to get category by ID
export function getCategory(data: HomeSlydeData, categoryId: string): CategoryData | undefined {
  return data.categories.find(c => c.id === categoryId)
}

// Helper to get item from category inventory
export function getInventoryItem(data: HomeSlydeData, categoryId: string, itemId: string): InventoryItem | undefined {
  const category = getCategory(data, categoryId)
  return category?.inventory?.find(item => item.id === itemId)
}
