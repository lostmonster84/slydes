import type { DemoHomeSlyde, DemoHomeSlydeCategory } from './demoHomeSlyde'
import type { FrameData } from '@/components/slyde-demo/frameData'

/**
 * Starter Templates for Business Types
 *
 * When a user selects their business type during onboarding,
 * we pre-populate their dashboard with a relevant starter template.
 * This delivers on the "We'll customize your experience" promise.
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

// Generate placeholder frame data with all required fields
function createPlaceholderFrame(id: string, title: string, subtitle: string, order: number): FrameData {
  return {
    id,
    order,
    title,
    subtitle,
    heartCount: 0,
    cta: { text: 'Learn more', icon: 'view' },
    background: {
      type: 'image',
      src: '', // Empty - user will add their own media
    },
    accentColor: 'bg-leader-blue',
  }
}

// Convert a starter template to DemoHomeSlyde format
export function templateToHomeSlyde(template: StarterTemplate): DemoHomeSlyde {
  const categories: DemoHomeSlydeCategory[] = template.categories.map(cat => ({
    id: cat.id,
    icon: cat.icon,
    name: cat.name,
    description: cat.description,
    childSlydeId: cat.id,
    hasInventory: false,
  }))

  const childFrames: Record<string, FrameData[]> = {}
  template.categories.forEach(cat => {
    childFrames[cat.id] = cat.frames.map((f, idx) =>
      createPlaceholderFrame(f.id, f.title, f.subtitle, idx + 1)
    )
  })

  return {
    videoSrc: '', // No video - gradient background instead
    posterSrc: undefined,
    categories,
    primaryCta: { text: 'Contact us', action: '#' },
    showCategoryIcons: false,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
    childFrames,
  }
}

/**
 * All starter templates by business type
 */
export const starterTemplates: Record<string, StarterTemplate> = {
  rentals: {
    title: 'Your Rentals',
    subtitle: 'Edit this to describe your rental business',
    backgroundGradient: 'from-emerald-600 to-teal-800',
    categories: [
      {
        id: 'equipment',
        icon: '🔧',
        name: 'Equipment',
        description: 'Tools and equipment for hire',
        frames: [
          { id: 'equipment-1', title: 'Premium Equipment', subtitle: 'From £XX/day' },
          { id: 'equipment-2', title: 'Popular Choice', subtitle: 'From £XX/day' },
        ],
      },
      {
        id: 'vehicles',
        icon: '🚗',
        name: 'Vehicles',
        description: 'Cars, vans, and more',
        frames: [
          { id: 'vehicles-1', title: 'Standard Vehicle', subtitle: 'From £XX/day' },
          { id: 'vehicles-2', title: 'Premium Vehicle', subtitle: 'From £XX/day' },
        ],
      },
      {
        id: 'accessories',
        icon: '🎒',
        name: 'Accessories',
        description: 'Add-ons and extras',
        frames: [
          { id: 'accessories-1', title: 'Essential Kit', subtitle: 'From £XX' },
          { id: 'accessories-2', title: 'Premium Add-on', subtitle: 'From £XX' },
        ],
      },
    ],
  },

  tours: {
    title: 'Your Experiences',
    subtitle: 'Edit this to describe your tours and activities',
    backgroundGradient: 'from-orange-500 to-rose-600',
    categories: [
      {
        id: 'tours',
        icon: '🗺️',
        name: 'Tours',
        description: 'Guided experiences',
        frames: [
          { id: 'tours-1', title: 'Signature Tour', subtitle: 'From £XX/person' },
          { id: 'tours-2', title: 'Half-Day Tour', subtitle: 'From £XX/person' },
        ],
      },
      {
        id: 'activities',
        icon: '🎯',
        name: 'Activities',
        description: 'Hands-on adventures',
        frames: [
          { id: 'activities-1', title: 'Popular Activity', subtitle: 'From £XX/person' },
          { id: 'activities-2', title: 'Group Activity', subtitle: 'From £XX/person' },
        ],
      },
      {
        id: 'packages',
        icon: '📦',
        name: 'Packages',
        description: 'Bundled experiences',
        frames: [
          { id: 'packages-1', title: 'Day Package', subtitle: 'From £XX' },
          { id: 'packages-2', title: 'Weekend Package', subtitle: 'From £XX' },
        ],
      },
    ],
  },

  accommodation: {
    title: 'Your Accommodation',
    subtitle: 'Edit this to describe your property',
    backgroundGradient: 'from-amber-500 to-orange-700',
    categories: [
      {
        id: 'rooms',
        icon: '🛏️',
        name: 'Rooms',
        description: 'Places to stay',
        frames: [
          { id: 'rooms-1', title: 'Deluxe Room', subtitle: 'From £XX/night' },
          { id: 'rooms-2', title: 'Standard Room', subtitle: 'From £XX/night' },
        ],
      },
      {
        id: 'amenities',
        icon: '✨',
        name: 'Amenities',
        description: 'What we offer',
        frames: [
          { id: 'amenities-1', title: 'Swimming Pool', subtitle: 'Open daily' },
          { id: 'amenities-2', title: 'Restaurant', subtitle: 'Breakfast & dinner' },
        ],
      },
      {
        id: 'location',
        icon: '📍',
        name: 'Location',
        description: 'Where to find us',
        frames: [
          { id: 'location-1', title: 'Getting Here', subtitle: 'Directions & parking' },
          { id: 'location-2', title: 'Local Attractions', subtitle: 'Things to do nearby' },
        ],
      },
    ],
  },

  restaurant: {
    title: 'Your Menu',
    subtitle: 'Edit this to showcase your dishes',
    backgroundGradient: 'from-red-500 to-pink-600',
    categories: [
      {
        id: 'starters',
        icon: '🥗',
        name: 'Starters',
        description: 'Begin your meal',
        frames: [
          { id: 'starters-1', title: "Chef's Special", subtitle: '£XX' },
          { id: 'starters-2', title: 'House Favourite', subtitle: '£XX' },
        ],
      },
      {
        id: 'mains',
        icon: '🍽️',
        name: 'Mains',
        description: 'Main courses',
        frames: [
          { id: 'mains-1', title: 'Signature Dish', subtitle: '£XX' },
          { id: 'mains-2', title: 'Seasonal Special', subtitle: '£XX' },
        ],
      },
      {
        id: 'desserts',
        icon: '🍰',
        name: 'Desserts',
        description: 'Sweet endings',
        frames: [
          { id: 'desserts-1', title: 'House Dessert', subtitle: '£XX' },
          { id: 'desserts-2', title: 'Ice Cream Selection', subtitle: '£XX' },
        ],
      },
    ],
  },

  retail: {
    title: 'Your Products',
    subtitle: 'Edit this to showcase your store',
    backgroundGradient: 'from-violet-500 to-purple-700',
    categories: [
      {
        id: 'featured',
        icon: '⭐',
        name: 'Featured',
        description: 'Our top picks',
        frames: [
          { id: 'featured-1', title: 'Featured Item', subtitle: '£XX' },
          { id: 'featured-2', title: 'Staff Pick', subtitle: '£XX' },
        ],
      },
      {
        id: 'new-in',
        icon: '🆕',
        name: 'New In',
        description: 'Latest arrivals',
        frames: [
          { id: 'new-in-1', title: 'New Arrival', subtitle: '£XX' },
          { id: 'new-in-2', title: 'Just Landed', subtitle: '£XX' },
        ],
      },
      {
        id: 'best-sellers',
        icon: '🔥',
        name: 'Best Sellers',
        description: 'Customer favourites',
        frames: [
          { id: 'best-sellers-1', title: 'Top Seller', subtitle: '£XX' },
          { id: 'best-sellers-2', title: 'Popular Choice', subtitle: '£XX' },
        ],
      },
    ],
  },

  fitness: {
    title: 'Your Services',
    subtitle: 'Edit this to showcase your fitness offerings',
    backgroundGradient: 'from-green-500 to-emerald-700',
    categories: [
      {
        id: 'classes',
        icon: '🏋️',
        name: 'Classes',
        description: 'Group fitness sessions',
        frames: [
          { id: 'classes-1', title: 'Group Class', subtitle: '£XX/session' },
          { id: 'classes-2', title: 'Signature Class', subtitle: '£XX/session' },
        ],
      },
      {
        id: 'memberships',
        icon: '💳',
        name: 'Memberships',
        description: 'Join our community',
        frames: [
          { id: 'memberships-1', title: 'Monthly Pass', subtitle: '£XX/month' },
          { id: 'memberships-2', title: 'Annual Membership', subtitle: '£XX/year' },
        ],
      },
      {
        id: 'trainers',
        icon: '💪',
        name: 'Trainers',
        description: '1-on-1 sessions',
        frames: [
          { id: 'trainers-1', title: 'PT Session', subtitle: '£XX/hour' },
          { id: 'trainers-2', title: 'Package Deal', subtitle: '£XX for 10 sessions' },
        ],
      },
    ],
  },

  salon: {
    title: 'Your Services',
    subtitle: 'Edit this to showcase your salon',
    backgroundGradient: 'from-pink-400 to-rose-600',
    categories: [
      {
        id: 'hair',
        icon: '💇',
        name: 'Hair',
        description: 'Cuts, colour & styling',
        frames: [
          { id: 'hair-1', title: 'Signature Cut', subtitle: 'From £XX' },
          { id: 'hair-2', title: 'Colour Treatment', subtitle: 'From £XX' },
        ],
      },
      {
        id: 'beauty',
        icon: '💅',
        name: 'Beauty',
        description: 'Nails & makeup',
        frames: [
          { id: 'beauty-1', title: 'Manicure', subtitle: 'From £XX' },
          { id: 'beauty-2', title: 'Full Makeover', subtitle: 'From £XX' },
        ],
      },
      {
        id: 'treatments',
        icon: '🧖',
        name: 'Treatments',
        description: 'Relaxation & wellness',
        frames: [
          { id: 'treatments-1', title: 'Facial Treatment', subtitle: 'From £XX' },
          { id: 'treatments-2', title: 'Express Service', subtitle: 'From £XX' },
        ],
      },
    ],
  },

  events: {
    title: 'Your Venue',
    subtitle: 'Edit this to showcase your event spaces',
    backgroundGradient: 'from-indigo-500 to-purple-700',
    categories: [
      {
        id: 'spaces',
        icon: '🏛️',
        name: 'Spaces',
        description: 'Event venues',
        frames: [
          { id: 'spaces-1', title: 'Main Hall', subtitle: 'Up to XX guests' },
          { id: 'spaces-2', title: 'Intimate Room', subtitle: 'Up to XX guests' },
        ],
      },
      {
        id: 'packages',
        icon: '📦',
        name: 'Packages',
        description: 'All-inclusive options',
        frames: [
          { id: 'packages-1', title: 'Wedding Package', subtitle: 'From £XX' },
          { id: 'packages-2', title: 'Corporate Package', subtitle: 'From £XX' },
        ],
      },
      {
        id: 'gallery',
        icon: '📸',
        name: 'Gallery',
        description: 'Past events',
        frames: [
          { id: 'gallery-1', title: 'Recent Wedding', subtitle: 'See the photos' },
          { id: 'gallery-2', title: 'Corporate Event', subtitle: 'See the photos' },
        ],
      },
    ],
  },

  real_estate: {
    title: 'Your Properties',
    subtitle: 'Edit this to showcase your listings',
    backgroundGradient: 'from-slate-600 to-gray-800',
    categories: [
      {
        id: 'for-sale',
        icon: '🏠',
        name: 'For Sale',
        description: 'Properties to buy',
        frames: [
          { id: 'for-sale-1', title: 'Premium Listing', subtitle: '£XXX,XXX' },
          { id: 'for-sale-2', title: 'New on Market', subtitle: '£XXX,XXX' },
        ],
      },
      {
        id: 'to-rent',
        icon: '🔑',
        name: 'To Rent',
        description: 'Properties to let',
        frames: [
          { id: 'to-rent-1', title: 'City Apartment', subtitle: '£X,XXX/month' },
          { id: 'to-rent-2', title: 'Family Home', subtitle: '£X,XXX/month' },
        ],
      },
      {
        id: 'featured',
        icon: '⭐',
        name: 'Featured',
        description: 'Highlighted properties',
        frames: [
          { id: 'featured-1', title: 'Price Reduced', subtitle: 'Now £XXX,XXX' },
          { id: 'featured-2', title: 'Investment Opportunity', subtitle: 'High yield' },
        ],
      },
    ],
  },

  automotive: {
    title: 'Your Showroom',
    subtitle: 'Edit this to showcase your vehicles',
    backgroundGradient: 'from-zinc-700 to-neutral-900',
    categories: [
      {
        id: 'new',
        icon: '✨',
        name: 'New',
        description: 'Brand new vehicles',
        frames: [
          { id: 'new-1', title: 'Latest Model', subtitle: 'From £XX,XXX' },
          { id: 'new-2', title: 'Special Edition', subtitle: 'From £XX,XXX' },
        ],
      },
      {
        id: 'used',
        icon: '🚗',
        name: 'Used',
        description: 'Pre-owned vehicles',
        frames: [
          { id: 'used-1', title: 'Certified Pre-Owned', subtitle: 'From £XX,XXX' },
          { id: 'used-2', title: 'Budget Friendly', subtitle: 'From £X,XXX' },
        ],
      },
      {
        id: 'services',
        icon: '🔧',
        name: 'Services',
        description: 'Maintenance & repairs',
        frames: [
          { id: 'services-1', title: 'Full Service', subtitle: 'From £XX' },
          { id: 'services-2', title: 'MOT & Inspection', subtitle: 'From £XX' },
        ],
      },
    ],
  },

  other: {
    title: 'Your Business',
    subtitle: 'Edit this to describe what you do',
    backgroundGradient: 'from-blue-500 to-cyan-600',
    categories: [
      {
        id: 'products',
        icon: '📦',
        name: 'Products',
        description: 'What we sell',
        frames: [
          { id: 'products-1', title: 'Featured Product', subtitle: 'From £XX' },
          { id: 'products-2', title: 'Popular Item', subtitle: 'From £XX' },
        ],
      },
      {
        id: 'services',
        icon: '🛠️',
        name: 'Services',
        description: 'What we offer',
        frames: [
          { id: 'services-1', title: 'Main Service', subtitle: 'From £XX' },
          { id: 'services-2', title: 'Premium Service', subtitle: 'From £XX' },
        ],
      },
      {
        id: 'about',
        icon: 'ℹ️',
        name: 'About',
        description: 'Who we are',
        frames: [
          { id: 'about-1', title: 'Our Story', subtitle: 'Learn about us' },
          { id: 'about-2', title: 'Contact', subtitle: 'Get in touch' },
        ],
      },
    ],
  },
}

/**
 * Get the starter template for a business type
 */
export function getStarterTemplate(businessType: string): StarterTemplate | null {
  return starterTemplates[businessType] || starterTemplates['other']
}

/**
 * Apply a starter template - converts to DemoHomeSlyde and saves to localStorage
 */
export function applyStarterTemplate(businessType: string): DemoHomeSlyde | null {
  const template = getStarterTemplate(businessType)
  if (!template) return null

  const homeSlyde = templateToHomeSlyde(template)
  return homeSlyde
}
