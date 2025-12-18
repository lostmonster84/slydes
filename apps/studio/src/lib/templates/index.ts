/**
 * Launch Wizard Templates
 *
 * Each template defines:
 * - Default sections for the business type
 * - Home screen defaults (CTA, toggles)
 * - Placeholder content for preview
 */

export type BusinessType =
  | 'florist'
  | 'restaurant'
  | 'salon'
  | 'photographer'
  | 'hotel'
  | 'gym'
  | 'retail'
  | 'events'
  | 'car-hire'
  | 'tours'
  | 'generic'

export interface TemplateSection {
  id: string
  name: string
  icon: string       // Lucide icon name
  enabled: boolean   // Pre-checked by default
}

export interface WizardTemplate {
  id: BusinessType
  name: string
  icon: string       // Emoji for display
  description: string

  // Default sections for this business type
  sections: TemplateSection[]

  // Default home screen settings
  homeDefaults: {
    primaryCtaText: string
    primaryCtaType: 'call' | 'link' | 'email'
    showCategoryIcons: boolean
    showHearts: boolean
    showShare: boolean
    showSound: boolean
    showReviews: boolean
  }

  // Placeholder content
  placeholders: {
    tagline: string
  }
}

// ============================================
// TEMPLATE DEFINITIONS
// ============================================

export const floristTemplate: WizardTemplate = {
  id: 'florist',
  name: 'Florist',
  icon: '🌸',
  description: 'Flower shops, garden centers, plant stores',

  sections: [
    { id: 'arrangements', name: 'Arrangements', icon: 'flower', enabled: true },
    { id: 'weddings', name: 'Weddings', icon: 'heart', enabled: true },
    { id: 'delivery', name: 'Delivery', icon: 'truck', enabled: true },
    { id: 'about', name: 'About Us', icon: 'info', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Call Now',
    primaryCtaType: 'call',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Beautiful blooms for every occasion',
  },
}

export const restaurantTemplate: WizardTemplate = {
  id: 'restaurant',
  name: 'Restaurant',
  icon: '🍽️',
  description: 'Restaurants, cafes, bars, food trucks',

  sections: [
    { id: 'menu', name: 'Menu', icon: 'utensils', enabled: true },
    { id: 'reservations', name: 'Reservations', icon: 'calendar', enabled: true },
    { id: 'gallery', name: 'Gallery', icon: 'image', enabled: true },
    { id: 'contact', name: 'Contact', icon: 'phone', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Book a Table',
    primaryCtaType: 'call',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Fresh food, unforgettable experiences',
  },
}

export const salonTemplate: WizardTemplate = {
  id: 'salon',
  name: 'Salon',
  icon: '💇',
  description: 'Hair salons, barbershops, nail bars, spas',

  sections: [
    { id: 'services', name: 'Services', icon: 'scissors', enabled: true },
    { id: 'stylists', name: 'Our Team', icon: 'users', enabled: true },
    { id: 'gallery', name: 'Gallery', icon: 'image', enabled: true },
    { id: 'book', name: 'Book Now', icon: 'calendar', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Book Appointment',
    primaryCtaType: 'call',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Look good, feel amazing',
  },
}

export const photographerTemplate: WizardTemplate = {
  id: 'photographer',
  name: 'Photographer',
  icon: '📸',
  description: 'Photographers, videographers, creative studios',

  sections: [
    { id: 'portfolio', name: 'Portfolio', icon: 'image', enabled: true },
    { id: 'packages', name: 'Packages', icon: 'package', enabled: true },
    { id: 'about', name: 'About', icon: 'user', enabled: true },
    { id: 'contact', name: 'Contact', icon: 'mail', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Get in Touch',
    primaryCtaType: 'email',
    showCategoryIcons: false,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Capturing moments that last forever',
  },
}

export const hotelTemplate: WizardTemplate = {
  id: 'hotel',
  name: 'Hotel / B&B',
  icon: '🏨',
  description: 'Hotels, B&Bs, vacation rentals, hostels',

  sections: [
    { id: 'rooms', name: 'Rooms', icon: 'bed', enabled: true },
    { id: 'amenities', name: 'Amenities', icon: 'coffee', enabled: true },
    { id: 'location', name: 'Location', icon: 'map-pin', enabled: true },
    { id: 'book', name: 'Book', icon: 'calendar', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Check Availability',
    primaryCtaType: 'link',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Your home away from home',
  },
}

export const gymTemplate: WizardTemplate = {
  id: 'gym',
  name: 'Gym / Fitness',
  icon: '💪',
  description: 'Gyms, fitness studios, personal trainers, yoga',

  sections: [
    { id: 'classes', name: 'Classes', icon: 'dumbbell', enabled: true },
    { id: 'memberships', name: 'Memberships', icon: 'credit-card', enabled: true },
    { id: 'trainers', name: 'Trainers', icon: 'users', enabled: true },
    { id: 'contact', name: 'Contact', icon: 'phone', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Join Now',
    primaryCtaType: 'call',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Transform your body, transform your life',
  },
}

export const retailTemplate: WizardTemplate = {
  id: 'retail',
  name: 'Retail',
  icon: '🛍️',
  description: 'Shops, boutiques, online stores',

  sections: [
    { id: 'products', name: 'Products', icon: 'shopping-bag', enabled: true },
    { id: 'about', name: 'About', icon: 'info', enabled: true },
    { id: 'location', name: 'Visit Us', icon: 'map-pin', enabled: true },
    { id: 'contact', name: 'Contact', icon: 'phone', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Shop Now',
    primaryCtaType: 'link',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Quality products, exceptional service',
  },
}

export const eventsTemplate: WizardTemplate = {
  id: 'events',
  name: 'Events / Venue',
  icon: '🎉',
  description: 'Event venues, wedding venues, conference centers',

  sections: [
    { id: 'spaces', name: 'Spaces', icon: 'home', enabled: true },
    { id: 'services', name: 'Services', icon: 'sparkles', enabled: true },
    { id: 'gallery', name: 'Gallery', icon: 'image', enabled: true },
    { id: 'contact', name: 'Contact', icon: 'phone', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Enquire Now',
    primaryCtaType: 'email',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Where memorable moments happen',
  },
}

export const carHireTemplate: WizardTemplate = {
  id: 'car-hire',
  name: 'Car Hire',
  icon: '🚗',
  description: 'Vehicle rental, car hire, van hire',

  sections: [
    { id: 'fleet', name: 'Our Fleet', icon: 'car', enabled: true },
    { id: 'rates', name: 'Rates', icon: 'credit-card', enabled: true },
    { id: 'locations', name: 'Locations', icon: 'map-pin', enabled: true },
    { id: 'about', name: 'About Us', icon: 'info', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Book Now',
    primaryCtaType: 'link',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Your adventure starts here',
  },
}

export const toursTemplate: WizardTemplate = {
  id: 'tours',
  name: 'Tours & Activities',
  icon: '⛵',
  description: 'Boat tours, walking tours, experiences, activities',

  sections: [
    { id: 'tours', name: 'Our Tours', icon: 'ship', enabled: true },
    { id: 'schedule', name: 'Schedule', icon: 'calendar', enabled: true },
    { id: 'pricing', name: 'Pricing', icon: 'credit-card', enabled: true },
    { id: 'gallery', name: 'Gallery', icon: 'image', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Book a Tour',
    primaryCtaType: 'link',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Unforgettable experiences await',
  },
}

export const genericTemplate: WizardTemplate = {
  id: 'generic',
  name: 'Other',
  icon: '✨',
  description: 'Any other type of business',

  sections: [
    { id: 'services', name: 'Services', icon: 'briefcase', enabled: true },
    { id: 'about', name: 'About', icon: 'info', enabled: true },
    { id: 'gallery', name: 'Gallery', icon: 'image', enabled: true },
    { id: 'contact', name: 'Contact', icon: 'phone', enabled: true },
  ],

  homeDefaults: {
    primaryCtaText: 'Contact Us',
    primaryCtaType: 'call',
    showCategoryIcons: true,
    showHearts: true,
    showShare: true,
    showSound: true,
    showReviews: true,
  },

  placeholders: {
    tagline: 'Welcome to our business',
  },
}

// ============================================
// EXPORTS
// ============================================

export const TEMPLATES: Record<BusinessType, WizardTemplate> = {
  florist: floristTemplate,
  restaurant: restaurantTemplate,
  salon: salonTemplate,
  photographer: photographerTemplate,
  hotel: hotelTemplate,
  gym: gymTemplate,
  retail: retailTemplate,
  events: eventsTemplate,
  'car-hire': carHireTemplate,
  tours: toursTemplate,
  generic: genericTemplate,
}

export const TEMPLATE_LIST: WizardTemplate[] = [
  floristTemplate,
  restaurantTemplate,
  salonTemplate,
  photographerTemplate,
  hotelTemplate,
  gymTemplate,
  retailTemplate,
  eventsTemplate,
  carHireTemplate,
  toursTemplate,
  genericTemplate,
]

export function getTemplate(type: BusinessType): WizardTemplate {
  return TEMPLATES[type] || genericTemplate
}
