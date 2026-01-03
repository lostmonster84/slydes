/**
 * Hospitality & Experience Templates
 *
 * AIDA-optimized frame structures for experience-first businesses:
 * - Restaurants & Bars
 * - Hotels & Stays
 * - Venues & Events
 * - Tours & Adventures
 * - Wellness & Fitness
 */

import type { SlydeTemplate } from './index'

// ============================================
// 1. Restaurant Showcase - 5 Frames
// ============================================
export const restaurantShowcase: SlydeTemplate = {
  id: 'restaurant-showcase',
  name: 'Restaurant Showcase',
  description: 'Showcase your restaurant with atmosphere, menu highlights, and reservations',
  icon: 'utensils-crossed',
  vertical: 'restaurant-bar',
  previewHint: '5 frames • Ambiance → Menu → Chef → Drinks → Reserve',
  frames: [
    {
      templateType: 'hook',
      title: 'Welcome',
      subtitle: 'A culinary journey awaits',
    },
    {
      templateType: 'what',
      title: 'Our Menu',
      subtitle: 'Seasonal ingredients, bold flavours',
      cta: {
        text: 'View Menu',
        type: 'info',
      },
    },
    {
      templateType: 'who',
      title: "Chef's Table",
      subtitle: 'Meet the team behind the magic',
    },
    {
      templateType: 'how',
      title: 'The Bar',
      subtitle: 'Craft cocktails & fine wines',
    },
    {
      templateType: 'action',
      title: 'Reserve Your Table',
      subtitle: 'Join us for an unforgettable evening',
      cta: {
        text: 'Book Now',
        type: 'link',
      },
    },
  ],
}

// ============================================
// 2. Hotel Experience - 5 Frames
// ============================================
export const hotelExperience: SlydeTemplate = {
  id: 'hotel-experience',
  name: 'Hotel Experience',
  description: 'Showcase your stay with rooms, amenities, and booking',
  icon: 'bed',
  vertical: 'hotel',
  previewHint: '5 frames • Arrival → Rooms → Amenities → Location → Book',
  frames: [
    {
      templateType: 'hook',
      title: 'Your Escape Awaits',
      subtitle: 'Where comfort meets adventure',
    },
    {
      templateType: 'what',
      title: 'Our Rooms',
      subtitle: 'Thoughtfully designed spaces',
      cta: {
        text: 'View Rooms',
        type: 'list',
      },
    },
    {
      templateType: 'how',
      title: 'Amenities',
      subtitle: 'Everything you need to unwind',
    },
    {
      templateType: 'trust',
      title: 'Perfect Location',
      subtitle: 'Minutes from everything',
      cta: {
        text: 'View Map',
        type: 'directions',
      },
    },
    {
      templateType: 'action',
      title: 'Book Your Stay',
      subtitle: 'Best rates guaranteed',
      cta: {
        text: 'Check Availability',
        type: 'link',
      },
    },
  ],
}

// ============================================
// 3. Venue Showcase - 4 Frames
// ============================================
export const venueShowcase: SlydeTemplate = {
  id: 'venue-showcase',
  name: 'Venue Showcase',
  description: 'Showcase your event space for weddings, parties, and corporate',
  icon: 'party-popper',
  vertical: 'venue',
  previewHint: '4 frames • Space → Services → Gallery → Enquire',
  frames: [
    {
      templateType: 'hook',
      title: 'Your Perfect Event',
      subtitle: 'Where memories are made',
    },
    {
      templateType: 'what',
      title: 'Our Spaces',
      subtitle: 'From intimate to grand',
      cta: {
        text: 'View Spaces',
        type: 'list',
      },
    },
    {
      templateType: 'how',
      title: 'Full Service',
      subtitle: 'Catering, AV, coordination',
    },
    {
      templateType: 'action',
      title: 'Plan Your Event',
      subtitle: "Let's create something special",
      cta: {
        text: 'Enquire Now',
        type: 'link',
      },
    },
  ],
}

// ============================================
// 4. Adventure Experience - 4 Frames
// ============================================
export const adventureExperience: SlydeTemplate = {
  id: 'adventure-experience',
  name: 'Adventure / Tour',
  description: 'Showcase tours, adventures, and outdoor experiences',
  icon: 'compass',
  vertical: 'adventure',
  previewHint: "4 frames • Thrill → What's Included → Reviews → Book",
  frames: [
    {
      templateType: 'hook',
      title: 'The Adventure Begins',
      subtitle: "Experiences you'll never forget",
    },
    {
      templateType: 'what',
      title: "What's Included",
      subtitle: 'Everything you need to know',
      cta: {
        text: 'View Details',
        type: 'info',
      },
    },
    {
      templateType: 'proof',
      title: 'What People Say',
      subtitle: '★★★★★ Rated experiences',
      cta: {
        text: 'See Reviews',
        type: 'reviews',
      },
    },
    {
      templateType: 'action',
      title: 'Ready for Adventure?',
      subtitle: 'Secure your spot today',
      cta: {
        text: 'Book Now',
        type: 'link',
      },
    },
  ],
}

// ============================================
// 5. Bar / Nightlife - 4 Frames
// ============================================
export const barNightlife: SlydeTemplate = {
  id: 'bar-nightlife',
  name: 'Bar / Nightlife',
  description: 'Showcase your bar, club, or nightlife venue',
  icon: 'wine',
  vertical: 'restaurant-bar',
  previewHint: '4 frames • Vibe → Drinks → Events → Visit',
  frames: [
    {
      templateType: 'hook',
      title: 'Tonight',
      subtitle: 'Where the night comes alive',
    },
    {
      templateType: 'what',
      title: 'The Menu',
      subtitle: 'Signature cocktails & more',
      cta: {
        text: 'View Menu',
        type: 'info',
      },
    },
    {
      templateType: 'how',
      title: 'Events',
      subtitle: 'Live music, DJs, special nights',
      cta: {
        text: 'See Events',
        type: 'list',
      },
    },
    {
      templateType: 'action',
      title: 'See You Tonight',
      subtitle: 'Reserve a table or just show up',
      cta: {
        text: 'Reserve',
        type: 'link',
      },
    },
  ],
}

// ============================================
// 6. Wellness Experience - 4 Frames (NEW)
// ============================================
export const wellnessExperience: SlydeTemplate = {
  id: 'wellness-experience',
  name: 'Wellness Experience',
  description: 'Showcase your spa, gym, or wellness studio',
  icon: 'sparkles',
  vertical: 'wellness',
  previewHint: '4 frames • Sanctuary → Services → Space → Book',
  frames: [
    {
      templateType: 'hook',
      title: 'Your Sanctuary',
      subtitle: 'Where wellness begins',
    },
    {
      templateType: 'what',
      title: 'Our Services',
      subtitle: 'Treatments & classes',
      cta: {
        text: 'View Services',
        type: 'list',
      },
    },
    {
      templateType: 'how',
      title: 'Our Space',
      subtitle: 'Designed for relaxation',
    },
    {
      templateType: 'action',
      title: 'Book Your Session',
      subtitle: 'Start your journey',
      cta: {
        text: 'Book Now',
        type: 'link',
      },
    },
  ],
}

// ============================================
// Combined array for "other" vertical
// ============================================
export const hospitalityTemplates: SlydeTemplate[] = [
  restaurantShowcase,
  hotelExperience,
  venueShowcase,
  adventureExperience,
  barNightlife,
  wellnessExperience,
]
