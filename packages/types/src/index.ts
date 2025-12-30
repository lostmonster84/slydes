// User types
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  plan_type: 'free' | 'creator'
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

// Slyde types
export interface Slyde {
  id: string
  user_id: string
  name: string
  description?: string
  slug?: string
  slides: Slide[]
  is_published: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface Slide {
  id: string
  type: 'video' | 'image'
  media_id: string
  order: number
  duration?: number
  cta?: SlideCTA
}

export interface SlideCTA {
  type: 'link' | 'phone' | 'email'
  label: string
  value: string
}

// Media types
export interface Media {
  id: string
  slyde_id: string
  mux_asset_id?: string
  mux_playback_id?: string
  file_name?: string
  duration?: number
  status: 'pending' | 'processing' | 'ready' | 'failed'
  created_at: string
}

// Subscription types
export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id?: string
  plan_type: 'free' | 'creator'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_end?: string
  created_at: string
}

// Waitlist types (existing)
export interface WaitlistEntry {
  id?: string
  email: string
  first_name?: string
  industry?: string
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  created_at?: string
}

// Form types
export type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export interface FormErrors {
  [key: string]: string
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// =========================================
// Social Stack Types
// =========================================

export type SocialStackButtonKey = 'location' | 'info' | 'share' | 'heart' | 'connect'

export interface SocialStackConfig {
  buttons: {
    location: boolean
    info: boolean
    share: boolean
    heart: boolean
    connect: boolean
  }
  order: SocialStackButtonKey[]
}

export interface ContactMethods {
  phone?: string
  email?: string
  whatsapp?: string
}

export interface LocationData {
  address?: string
  lat?: number
  lng?: number
}

// =========================================
// Vertical Types & Configurations
// =========================================

export type VerticalType =
  // Experience-first verticals (primary focus)
  | 'restaurant-bar'
  | 'hotel'
  | 'venue'
  | 'adventure'
  | 'wellness'
  // Legacy verticals (for existing users)
  | 'property'
  | 'automotive'
  | 'hospitality'
  | 'beauty'
  | 'food'
  | 'other'

/**
 * Feature flags that can be toggled per vertical/slyde
 * These control which sections appear in the inspector and preview
 */
export interface FeatureFlags {
  // Action Stack buttons
  location: boolean
  info: boolean
  share: boolean
  heart: boolean
  connect: boolean
  // Content sections
  contact: boolean    // Contact details (phone/email/whatsapp in Info sheet)
  faqs: boolean       // FAQ section
  demoVideo: boolean  // Demo video button
}

/**
 * Complete vertical configuration
 */
export interface VerticalConfig {
  id: VerticalType
  name: string
  description: string
  icon: string  // Lucide icon name
  defaults: {
    socialStack: SocialStackConfig
    features: FeatureFlags
  }
}

/**
 * All vertical configurations with their defaults
 */
export const VERTICALS: Record<VerticalType, VerticalConfig> = {
  // =========================================
  // Experience-first verticals (primary focus)
  // =========================================
  'restaurant-bar': {
    id: 'restaurant-bar',
    name: 'Restaurant / Bar / Cafe',
    description: 'Restaurants, bars, cafes, food & drink venues',
    icon: 'UtensilsCrossed',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: true, connect: true },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: true,
        connect: true,
        contact: true,
        faqs: true,
        demoVideo: true
      }
    }
  },
  hotel: {
    id: 'hotel',
    name: 'Hotel / Lodge / Boutique Stay',
    description: 'Hotels, lodges, boutique stays, vacation rentals',
    icon: 'Bed',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: true, connect: true },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: true,
        connect: true,
        contact: true,
        faqs: true,
        demoVideo: true
      }
    }
  },
  venue: {
    id: 'venue',
    name: 'Venue / Event Space',
    description: 'Wedding venues, event spaces, conference centers',
    icon: 'PartyPopper',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: true, connect: true },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: true,
        connect: true,
        contact: true,
        faqs: true,
        demoVideo: true
      }
    }
  },
  adventure: {
    id: 'adventure',
    name: 'Tours / Adventures / Experiences',
    description: 'Tours, adventures, outdoor experiences, activities',
    icon: 'Compass',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: true, connect: true },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: true,
        connect: true,
        contact: true,
        faqs: true,
        demoVideo: true
      }
    }
  },
  wellness: {
    id: 'wellness',
    name: 'Spa / Wellness / Fitness',
    description: 'Spas, wellness centers, gyms, fitness studios',
    icon: 'Sparkles',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: true, connect: true },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: true,
        connect: true,
        contact: true,
        faqs: true,
        demoVideo: false
      }
    }
  },
  // =========================================
  // Legacy verticals (for existing users)
  // =========================================
  property: {
    id: 'property',
    name: 'Property',
    description: 'Real estate, lettings, property management',
    icon: 'Home',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: false, connect: false },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: false,
        connect: false,
        contact: true,
        faqs: true,
        demoVideo: true
      }
    }
  },
  automotive: {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car dealers, rentals, vehicle sales',
    icon: 'Car',
    defaults: {
      socialStack: {
        buttons: { location: false, info: true, share: true, heart: false, connect: true },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: false,
        info: true,
        share: true,
        heart: false,
        connect: true,
        contact: true,
        faqs: true,
        demoVideo: true
      }
    }
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality',
    description: 'Hotels, B&Bs, holiday lets, experiences',
    icon: 'Bed',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: true, connect: true },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: true,
        connect: true,
        contact: true,
        faqs: true,
        demoVideo: true
      }
    }
  },
  beauty: {
    id: 'beauty',
    name: 'Beauty & Wellness',
    description: 'Salons, spas, fitness, wellness',
    icon: 'Sparkles',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: true, connect: true },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: true,
        connect: true,
        contact: true,
        faqs: true,
        demoVideo: false
      }
    }
  },
  food: {
    id: 'food',
    name: 'Food & Drink',
    description: 'Restaurants, cafes, bars, catering',
    icon: 'UtensilsCrossed',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: true, connect: false },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: true,
        connect: false,
        contact: true,
        faqs: true,
        demoVideo: false
      }
    }
  },
  other: {
    id: 'other',
    name: 'Other',
    description: 'General business, services, retail',
    icon: 'Building2',
    defaults: {
      socialStack: {
        buttons: { location: true, info: true, share: true, heart: false, connect: true },
        order: ['location', 'info', 'share', 'heart', 'connect']
      },
      features: {
        location: true,
        info: true,
        share: true,
        heart: false,
        connect: true,
        contact: true,
        faqs: false,
        demoVideo: false
      }
    }
  }
}

/**
 * Get vertical config by type (with fallback to 'other')
 */
export function getVerticalConfig(vertical: VerticalType | string | null | undefined): VerticalConfig {
  if (vertical && vertical in VERTICALS) {
    return VERTICALS[vertical as VerticalType]
  }
  return VERTICALS.other
}

/**
 * Get default feature flags for a vertical
 */
export function getVerticalDefaults(vertical: VerticalType | string | null | undefined): FeatureFlags {
  return getVerticalConfig(vertical).defaults.features
}

/**
 * Get default social stack config for a vertical
 */
export function getVerticalSocialStack(vertical: VerticalType | string | null | undefined): SocialStackConfig {
  return getVerticalConfig(vertical).defaults.socialStack
}

// Legacy: Keep VERTICAL_PRESETS for backwards compatibility
export const VERTICAL_PRESETS: Record<VerticalType, SocialStackConfig> = {
  // Experience-first verticals
  'restaurant-bar': VERTICALS['restaurant-bar'].defaults.socialStack,
  hotel: VERTICALS.hotel.defaults.socialStack,
  venue: VERTICALS.venue.defaults.socialStack,
  adventure: VERTICALS.adventure.defaults.socialStack,
  wellness: VERTICALS.wellness.defaults.socialStack,
  // Legacy verticals
  property: VERTICALS.property.defaults.socialStack,
  automotive: VERTICALS.automotive.defaults.socialStack,
  hospitality: VERTICALS.hospitality.defaults.socialStack,
  beauty: VERTICALS.beauty.defaults.socialStack,
  food: VERTICALS.food.defaults.socialStack,
  other: VERTICALS.other.defaults.socialStack,
}

// Default social stack config (for slydes/categories)
// Note: Contact is accessed via Info sheet's dropdown, not a separate button
export const DEFAULT_SOCIAL_STACK_CONFIG: SocialStackConfig = {
  buttons: {
    location: true,
    info: true,
    share: true,
    heart: false,
    connect: true
  },
  order: ['location', 'info', 'share', 'heart', 'connect']
}

// Home screen social stack config (simpler - no Location/Info since those are slyde-specific)
export const HOME_SOCIAL_STACK_CONFIG: SocialStackConfig = {
  buttons: {
    location: false,
    info: false,
    share: true,
    heart: true,
    connect: true
  },
  order: ['share', 'heart', 'connect']
}
