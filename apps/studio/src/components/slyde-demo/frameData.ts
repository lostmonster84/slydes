/**
 * Frame Data Configuration for WildTrax Demo
 * 
 * This file contains all the data for the WildTrax demo Slydes.
 * Each Frame follows the AIDA framework:
 * - Attention (Hook)
 * - Interest (How, Who, What)
 * - Desire (Social Proof, Choose, Cinematic)
 * - Action (Trust, Book)
 * 
 * TERMINOLOGY (per STRUCTURE.md):
 * - Slyde = shareable experience (e.g., "Camping", "Just Drive")
 * - Frame = vertical screen inside a Slyde
 * 
 * @see SLYDESBUILD.md for schema documentation
 * @see STRUCTURE.md for canonical hierarchy
 */

export type CTAIconType = 'book' | 'call' | 'view' | 'arrow' | 'menu'

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
  faqCount: number
  cta?: {
    text: string
    icon: CTAIconType
    action?: string // URL or action identifier (e.g., 'book', 'faq', 'reviews')
  }
  background: {
    type: 'video' | 'image'
    src: string
    position?: string
    startTime?: number  // Video start time in seconds
  }
  accentColor: string
  // Frame-specific info content for the Info sheet
  infoContent?: FrameInfoContent
  // URL-safe slug for deep-linking
  slug?: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
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
// WILDTRAX BUSINESS INFO
// ============================================

export const wildtraxBusiness: BusinessInfo = {
  id: 'wildtrax',
  name: 'WildTrax',
  tagline: 'Highland Adventures',
  location: 'Scottish Highlands',
  rating: 5.0,
  reviewCount: 209,
  credentials: [
    { icon: '⭐', label: '5-Star', value: 'Rated' },
    { icon: '🏆', label: 'Top', value: 'Rated 2024' },
    { icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', label: 'Est', value: '2019' }
  ],
  about: 'Land Rover Defender camping experiences in the Scottish Highlands. We provide fully-equipped Defenders with rooftop tents, kitchens, and all the gear you need. Wake up anywhere. No camping experience required.',
  highlights: [
    '15+ years of Highland adventure experience',
    'NC500 and off-grid specialists',
    'Fully equipped Defender 110s',
    'No camping experience required',
    'Award-winning customer service'
  ],
  contact: {
    phone: '+44 1234 567890',
    email: 'hello@wildtrax.co.uk',
    website: 'https://wildtrax.co.uk'
  },
  accentColor: 'bg-red-600'
}

// ============================================
// SLYDE CONFIGURATIONS
// ============================================

export const campingSlydeConfig: SlydeConfig = {
  id: 'camping',
  slug: 'camping',
  name: 'Camping',
  description: 'Land Rover + Rooftop Tent',
  icon: 'tent',
  accentColor: 'bg-red-600'
}

export const justDriveSlydeConfig: SlydeConfig = {
  id: 'just-drive',
  slug: 'just-drive',
  name: 'Just Drive',
  description: 'Land Rover Day Hire',
  icon: 'car',
  accentColor: 'bg-amber-600'
}

export const wildtraxSlydes: SlydeConfig[] = [
  campingSlydeConfig,
  justDriveSlydeConfig
]

// ============================================
// CAMPING SLYDE FRAMES
// ============================================

export const campingFrames: FrameData[] = [
  {
    id: 'hook',
    order: 1,
    templateType: 'hook',
    title: 'Wake Up',
    subtitle: 'Here',
    badge: '⭐ 5-Star Rated',
    rating: 5.0,
    reviewCount: 209,
    heartCount: 2400,
    faqCount: 12,
    cta: { text: 'Book Now', icon: 'book', action: 'https://wildtrax.co.uk/book' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 0
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'The WildTrax Experience',
      description: 'Land Rover Defender camping in the Scottish Highlands. Everything included - just bring yourself and a sense of adventure.',
      highlights: [
        { icon: '🏔️', label: 'Location', value: 'Scottish Highlands' },
        { icon: '🚗', label: 'Vehicle', value: 'Land Rover Defender' },
        { icon: '⏱️', label: 'Min Stay', value: '2 nights' },
      ]
    }
  },
  {
    id: 'how',
    order: 2,
    templateType: 'how',
    title: 'Rooftop Tent',
    subtitle: 'Pop up in 60 seconds',
    badge: '🏕️ Easy Setup',
    heartCount: 1800,
    faqCount: 8,
    cta: { text: 'See How It Works', icon: 'view', action: 'info' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 3
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'How the Tent Works',
      description: 'Our QuickPitch rooftop tent sets up in under 60 seconds. No poles, no pegs, no stress.',
      items: [
        'Unfold the tent from the roof rack',
        'Pull the ladder down',
        'Climb in and sleep',
        'Pack down in 2 minutes'
      ],
      highlights: [
        { icon: '⏱️', label: 'Setup', value: '60 seconds' },
        { icon: '👥', label: 'Sleeps', value: '2-3 people' },
        { icon: '📏', label: 'Size', value: 'King-size mattress' },
      ]
    }
  },
  {
    id: 'who',
    order: 3,
    templateType: 'who',
    title: 'The Experience',
    subtitle: 'Couples • Families • Friends • Solo',
    badge: '🚗 4 Adventures',
    heartCount: 3100,
    faqCount: 15,
    cta: { text: 'Find Your Trip', icon: 'view', action: 'https://wildtrax.co.uk/experiences' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 6
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'Perfect For Everyone',
      description: 'Whether you\'re a couple seeking romance, a family making memories, friends on an adventure, or a solo explorer - we\'ve got you covered.',
      items: [
        '💑 Couples - Romantic highland escapes',
        '👨‍👩‍👧‍👦 Families - Kid-friendly adventures',
        '👯 Friends - Group road trips',
        '🧘 Solo - Find yourself in nature'
      ]
    }
  },
  {
    id: 'what',
    order: 4,
    templateType: 'what',
    title: 'Full Kit',
    subtitle: 'Everything included',
    badge: '✅ Everything Included',
    heartCount: 2900,
    faqCount: 22,
    cta: { text: 'View Gear List', icon: 'view', action: 'info' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 9
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'What\'s Included',
      description: 'Everything you need for a comfortable camping experience. No need to buy or bring any gear.',
      items: [
        '🏕️ Rooftop tent with king-size mattress',
        '🛏️ Bedding: duvet, pillows, sheets',
        '🍳 Full kitchen: stove, pans, utensils',
        '🪑 Camping chairs and table',
        '💡 LED lighting (interior + exterior)',
        '❄️ Cool box for food and drinks',
        '☔ Awning for shade and rain cover',
        '🔌 USB charging ports'
      ],
      highlights: [
        { icon: '📦', label: 'Items', value: '30+ included' },
        { icon: '💰', label: 'Extra Cost', value: 'None' },
        { icon: '✅', label: 'Setup', value: 'Ready to go' },
      ]
    }
  },
  {
    id: 'proof',
    order: 5,
    templateType: 'proof',
    title: '209 Reviews',
    subtitle: '"Best trip of our lives"',
    badge: '💬 Verified Reviews',
    rating: 5.0,
    reviewCount: 209,
    heartCount: 4200,
    faqCount: 6,
    cta: { text: 'Read Reviews', icon: 'view', action: 'reviews' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 12
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'What Guests Say',
      description: '209 five-star reviews and counting. Here\'s what real guests have to say:',
      items: [
        '"Absolutely incredible! Waking up to Glencoe views was unforgettable." - James & Sarah',
        '"The kids loved it. So easy to set up, we were cooking dinner in 10 minutes." - The Thompsons',
        '"Best way to see the Highlands. Will definitely be back!" - Mike R.',
        '"Perfect for our honeymoon. Romantic and adventurous." - Emma & Tom'
      ],
      highlights: [
        { icon: '⭐', label: 'Rating', value: '5.0 / 5.0' },
        { icon: '💬', label: 'Reviews', value: '209 verified' },
        { icon: '👍', label: 'Recommend', value: '100%' },
      ]
    }
  },
  {
    id: 'choose',
    order: 6,
    title: 'Pick Your Defender',
    subtitle: '3 vehicles • All equipped',
    badge: '🚙 Choose Your Ride',
    rating: 5.0,
    reviewCount: 209,
    heartCount: 5100,
    faqCount: 18,
    cta: { text: 'View Fleet', icon: 'view', action: 'info' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 15
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'Our Fleet',
      description: 'Three Land Rover Defenders, each fully equipped with rooftop tent and camping kit.',
      items: [
        '🟢 Defender 90 "Glen" - Compact, nimble, perfect for couples',
        '🔵 Defender 110 "Loch" - More space, great for families',
        '🟡 Defender 110 "Ben" - Our newest addition, premium spec'
      ],
      highlights: [
        { icon: '🚗', label: 'Vehicles', value: '3 available' },
        { icon: '📅', label: 'Book ahead', value: '2-4 weeks' },
        { icon: '🔄', label: 'Availability', value: 'Check dates' },
      ]
    }
  },
  {
    id: 'cinematic',
    order: 7,
    title: '',
    subtitle: '',
    heartCount: 6300,
    faqCount: 4,
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 18
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'The Highland Experience',
      description: 'This is what awaits you. Wild camping under the stars, waking up to mountain views, complete freedom to explore.',
    }
  },
  {
    id: 'trust',
    order: 8,
    templateType: 'trust',
    title: 'Quick Answers',
    subtitle: 'Top questions answered',
    badge: '❓ FAQs',
    heartCount: 1200,
    faqCount: 31,
    cta: { text: 'View All FAQs', icon: 'view', action: 'faq' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 21
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'Common Questions',
      items: [
        '🐕 Dogs welcome - no extra charge',
        '❌ Free cancellation up to 48 hours',
        '🪪 Standard UK license required (25+)',
        '📍 Pick up from Inverness',
        '⛽ Fuel not included (25-30 MPG)',
        '🏕️ Wild camping allowed in Scotland'
      ]
    }
  },
  {
    id: 'action',
    order: 9,
    templateType: 'action',
    title: 'Book Now',
    subtitle: 'From £165/night',
    badge: '💰 Best Price',
    rating: 5.0,
    reviewCount: 209,
    heartCount: 2800,
    faqCount: 9,
    cta: { text: 'Check Availability', icon: 'book', action: 'https://wildtrax.co.uk/book' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 24
    },
    accentColor: 'bg-red-600',
    infoContent: {
      headline: 'Pricing & Booking',
      description: 'Simple, transparent pricing. Everything included.',
      highlights: [
        { icon: '💰', label: 'From', value: '£165/night' },
        { icon: '📅', label: 'Min stay', value: '2 nights' },
        { icon: '❌', label: 'Cancellation', value: 'Free (48hrs)' },
      ],
      items: [
        '✅ Defender + rooftop tent',
        '✅ Full camping kit (30+ items)',
        '✅ Unlimited mileage',
        '✅ 24/7 roadside assistance',
        '✅ Comprehensive insurance'
      ]
    }
  },
  {
    id: 'slydes',
    order: 10,
    templateType: 'slydes',
    title: 'Want This For',
    subtitle: 'Your Business?',
    badge: '✨ Powered by Slydes',
    heartCount: 0,
    faqCount: 0,
    cta: { text: 'Try Slydes', icon: 'arrow', action: 'https://slydes.io' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 27
    },
    accentColor: 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4]',
    infoContent: {
      headline: 'About Slydes.io',
      description: 'Mobile-first, video-driven experiences that actually convert. Old school websites are OUT. Slydes are IN.',
      highlights: [
        { icon: '📱', label: 'Built for', value: 'Mobile' },
        { icon: '⚡', label: 'Setup', value: '10 mins' },
        { icon: '🚀', label: 'Future', value: '2030' },
      ]
    }
  },
]

// ============================================
// CAMPING SLYDE FAQ DATA
// ============================================

export const campingFAQs: FAQItem[] = [
  {
    id: 'dogs',
    question: 'Do you allow dogs?',
    answer: 'Yes! Dogs are welcome in all our vehicles. We just ask that you bring a blanket for them and clean up any mess. There\'s no extra charge for furry friends.'
  },
  {
    id: 'included',
    question: 'What\'s included in the camping kit?',
    answer: 'Full setup: rooftop tent, awning, kitchen with stove and cookware, bedding (duvet, pillows, sheets), camping chairs, table, LED lighting, and a cool box. Everything you need to camp in comfort.'
  },
  {
    id: 'cancel',
    question: 'Can I cancel my booking?',
    answer: 'Free cancellation up to 48 hours before your trip. Cancellations within 48 hours are charged at 50% of the booking value. No-shows are charged in full.'
  },
  {
    id: 'pickup',
    question: 'Where do I pick up?',
    answer: 'Our base is in Inverness, just 10 minutes from Inverness Airport. We provide detailed directions and can arrange airport transfers if needed.'
  },
  {
    id: 'experience',
    question: 'Do I need camping experience?',
    answer: 'No experience needed! We provide a full handover showing you how everything works - the tent, kitchen, and all the gear. Most guests are set up and cooking within 15 minutes.'
  },
  {
    id: 'license',
    question: 'What license do I need?',
    answer: 'A standard UK driving license (or international equivalent) held for at least 2 years. You must be 25 or over to hire. Named drivers can be added for a small fee.'
  },
  {
    id: 'fuel',
    question: 'Is fuel included?',
    answer: 'You\'ll receive the vehicle with a full tank and should return it full. The Defenders average about 25-30 MPG depending on driving style and terrain.'
  },
  {
    id: 'wild-camp',
    question: 'Can I wild camp anywhere?',
    answer: 'Scotland has fantastic wild camping rights! You can camp on most unenclosed land. We provide a guide to the best spots and local regulations. Please follow Leave No Trace principles.'
  },
]

// ============================================
// JUST DRIVE SLYDE FRAMES
// ============================================

export const justDriveFrames: FrameData[] = [
  {
    id: 'hook',
    order: 1,
    templateType: 'hook',
    title: 'Just',
    subtitle: 'Drive',
    badge: '⭐ 5-Star Rated',
    rating: 5.0,
    reviewCount: 156,
    heartCount: 1800,
    faqCount: 10,
    cta: { text: 'Book Now', icon: 'book', action: 'https://wildtrax.co.uk/book' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 2
    },
    accentColor: 'bg-amber-600',
    infoContent: {
      headline: 'Land Rover Day Hire',
      description: 'Take a Defender for the day and explore the Scottish Highlands your way. No camping kit, just pure driving freedom.',
      highlights: [
        { icon: '🏔️', label: 'Location', value: 'Scottish Highlands' },
        { icon: '🚗', label: 'Vehicle', value: 'Land Rover Defender' },
        { icon: '⏱️', label: 'Min Hire', value: '1 day' },
      ]
    }
  },
  {
    id: 'how',
    order: 2,
    templateType: 'how',
    title: 'Pick Up',
    subtitle: 'Drive. Return.',
    badge: '🚗 Simple Process',
    heartCount: 1200,
    faqCount: 6,
    cta: { text: 'See How It Works', icon: 'view', action: 'info' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 5
    },
    accentColor: 'bg-amber-600',
    infoContent: {
      headline: 'How It Works',
      description: 'Simple, hassle-free Land Rover hire. Pick up in Inverness, explore the Highlands, return when you\'re done.',
      items: [
        'Collect from our Inverness base',
        'Full vehicle handover and orientation',
        'Explore at your own pace',
        'Return with a full tank'
      ],
      highlights: [
        { icon: '📍', label: 'Pickup', value: 'Inverness' },
        { icon: '⏱️', label: 'Handover', value: '15 mins' },
        { icon: '🛣️', label: 'Mileage', value: 'Unlimited' },
      ]
    }
  },
  {
    id: 'who',
    order: 3,
    templateType: 'who',
    title: 'Day Trips',
    subtitle: 'NC500 • Glencoe • Isle of Skye',
    badge: '🗺️ Explore',
    heartCount: 2200,
    faqCount: 12,
    cta: { text: 'Plan Your Route', icon: 'view', action: 'https://wildtrax.co.uk/routes' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 8
    },
    accentColor: 'bg-amber-600',
    infoContent: {
      headline: 'Perfect For',
      description: 'Whether you want to tackle the NC500, explore Glencoe, or drive to the Isle of Skye - a Defender is the ultimate way to do it.',
      items: [
        '🛣️ NC500 - The ultimate Scottish road trip',
        '🏔️ Glencoe - Dramatic Highland scenery',
        '🌊 Isle of Skye - Fairy pools and castles',
        '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Off the beaten track - Go anywhere'
      ]
    }
  },
  {
    id: 'what',
    order: 4,
    templateType: 'what',
    title: 'Defender',
    subtitle: 'Ready to go',
    badge: '✅ Fully Equipped',
    heartCount: 1900,
    faqCount: 15,
    cta: { text: 'View Specs', icon: 'view', action: 'info' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 11
    },
    accentColor: 'bg-amber-600',
    infoContent: {
      headline: 'What\'s Included',
      description: 'Every Defender comes fully equipped for your Highland adventure.',
      items: [
        '🚗 Land Rover Defender 110',
        '📱 Apple CarPlay / Android Auto',
        '🗺️ Sat Nav with offline maps',
        '🔌 USB charging ports',
        '❄️ Heated seats',
        '📷 360° parking cameras',
        '🛡️ Comprehensive insurance',
        '🆘 24/7 roadside assistance'
      ],
      highlights: [
        { icon: '🛣️', label: 'Mileage', value: 'Unlimited' },
        { icon: '⛽', label: 'Fuel', value: 'Full tank' },
        { icon: '🛡️', label: 'Insurance', value: 'Included' },
      ]
    }
  },
  {
    id: 'proof',
    order: 5,
    templateType: 'proof',
    title: '156 Reviews',
    subtitle: '"Best drive of my life"',
    badge: '💬 Verified Reviews',
    rating: 5.0,
    reviewCount: 156,
    heartCount: 2800,
    faqCount: 4,
    cta: { text: 'Read Reviews', icon: 'view', action: 'reviews' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 14
    },
    accentColor: 'bg-amber-600',
    infoContent: {
      headline: 'What Drivers Say',
      description: '156 five-star reviews from happy drivers.',
      items: [
        '"The Defender handled everything - single track roads, muddy trails, you name it!" - Mark T.',
        '"Perfect for our NC500 trip. Turned heads everywhere we went." - Lisa & Dave',
        '"So easy to pick up and drop off. Will definitely hire again." - James R.',
        '"Best way to see the Highlands. Period." - Sarah M.'
      ],
      highlights: [
        { icon: '⭐', label: 'Rating', value: '5.0 / 5.0' },
        { icon: '💬', label: 'Reviews', value: '156 verified' },
        { icon: '👍', label: 'Recommend', value: '100%' },
      ]
    }
  },
  {
    id: 'choose',
    order: 6,
    title: 'The Fleet',
    subtitle: '3 Defenders available',
    badge: '🚙 Choose Your Ride',
    rating: 5.0,
    reviewCount: 156,
    heartCount: 3200,
    faqCount: 14,
    cta: { text: 'View Fleet', icon: 'view', action: 'info' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 17
    },
    accentColor: 'bg-amber-600',
    infoContent: {
      headline: 'Our Fleet',
      description: 'Three Land Rover Defenders ready for your Highland adventure.',
      items: [
        '🟢 Defender 90 "Glen" - Compact, nimble, perfect for couples',
        '🔵 Defender 110 "Loch" - More space, great for families',
        '🟡 Defender 110 "Ben" - Our newest addition, premium spec'
      ],
      highlights: [
        { icon: '🚗', label: 'Vehicles', value: '3 available' },
        { icon: '📅', label: 'Book ahead', value: '1-2 weeks' },
        { icon: '🔄', label: 'Availability', value: 'Check dates' },
      ]
    }
  },
  {
    id: 'cinematic',
    order: 7,
    title: '',
    subtitle: '',
    heartCount: 4100,
    faqCount: 3,
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 20
    },
    accentColor: 'bg-amber-600',
    infoContent: {
      headline: 'The Highland Drive',
      description: 'This is what awaits you. Open roads, dramatic scenery, and the freedom to explore.',
    }
  },
  {
    id: 'trust',
    order: 8,
    templateType: 'trust',
    title: 'Quick Answers',
    subtitle: 'Common questions',
    badge: '❓ FAQs',
    heartCount: 900,
    faqCount: 22,
    cta: { text: 'View All FAQs', icon: 'view', action: 'faq' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 23
    },
    accentColor: 'bg-amber-600',
    infoContent: {
      headline: 'Common Questions',
      items: [
        '🪪 Standard UK license (25+)',
        '🛣️ Unlimited mileage included',
        '⛽ Return with full tank',
        '❌ Free cancellation (48hrs)',
        '🛡️ Fully comprehensive insurance',
        '📍 Pick up from Inverness'
      ]
    }
  },
  {
    id: 'action',
    order: 9,
    templateType: 'action',
    title: 'Book Your',
    subtitle: 'Drive',
    badge: '💰 From £125/day',
    rating: 5.0,
    reviewCount: 156,
    heartCount: 2100,
    faqCount: 7,
    cta: { text: 'Check Availability', icon: 'book', action: 'https://wildtrax.co.uk/book' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 26
    },
    accentColor: 'bg-amber-600',
    infoContent: {
      headline: 'Pricing & Booking',
      description: 'Simple, transparent pricing. Everything included.',
      highlights: [
        { icon: '💰', label: 'From', value: '£125/day' },
        { icon: '📅', label: 'Min hire', value: '1 day' },
        { icon: '❌', label: 'Cancellation', value: 'Free (48hrs)' },
      ],
      items: [
        '✅ Land Rover Defender',
        '✅ Unlimited mileage',
        '✅ Comprehensive insurance',
        '✅ 24/7 roadside assistance',
        '✅ Full tank of fuel'
      ]
    }
  },
  {
    id: 'slydes',
    order: 10,
    templateType: 'slydes',
    title: 'Want This For',
    subtitle: 'Your Business?',
    badge: '✨ Powered by Slydes',
    heartCount: 0,
    faqCount: 0,
    cta: { text: 'Try Slydes', icon: 'arrow', action: 'https://slydes.io' },
    background: { 
      type: 'video', 
      src: '/videos/hero-defender.mp4',
      startTime: 29
    },
    accentColor: 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4]',
    infoContent: {
      headline: 'About Slydes.io',
      description: 'Mobile-first, video-driven experiences that actually convert. Old school websites are OUT. Slydes are IN.',
      highlights: [
        { icon: '📱', label: 'Built for', value: 'Mobile' },
        { icon: '⚡', label: 'Setup', value: '10 mins' },
        { icon: '🚀', label: 'Future', value: 'Now' },
      ]
    }
  },
]

// ============================================
// JUST DRIVE FAQ DATA
// ============================================

export const justDriveFAQs: FAQItem[] = [
  {
    id: 'license',
    question: 'What license do I need?',
    answer: 'A standard UK driving license (or international equivalent) held for at least 2 years. You must be 25 or over to hire. Named drivers can be added for a small fee.'
  },
  {
    id: 'mileage',
    question: 'Is mileage unlimited?',
    answer: 'Yes! All our hires include unlimited mileage. Drive as far as you like without worrying about extra charges.'
  },
  {
    id: 'fuel',
    question: 'What about fuel?',
    answer: 'You\'ll receive the vehicle with a full tank and should return it full. The Defenders average about 25-30 MPG depending on driving style and terrain.'
  },
  {
    id: 'insurance',
    question: 'Is insurance included?',
    answer: 'Yes, fully comprehensive insurance is included. There\'s a £500 excess which can be reduced to £0 for an additional fee.'
  },
  {
    id: 'cancel',
    question: 'Can I cancel my booking?',
    answer: 'Free cancellation up to 48 hours before your hire. Cancellations within 48 hours are charged at 50% of the booking value.'
  },
  {
    id: 'pickup',
    question: 'Where do I pick up?',
    answer: 'Our base is in Inverness, just 10 minutes from Inverness Airport. We provide detailed directions and can arrange airport transfers if needed.'
  },
  {
    id: 'offroad',
    question: 'Can I go off-road?',
    answer: 'The Defenders are capable off-road vehicles, but we ask that you stick to established tracks and trails. No extreme off-roading or water crossings please!'
  },
  {
    id: 'breakdown',
    question: 'What if I break down?',
    answer: '24/7 roadside assistance is included. If you have any issues, call our emergency number and we\'ll get you sorted as quickly as possible.'
  },
]

// ============================================
// WILDTRAX REVIEWS DATA
// ============================================

export const wildtraxReviews: Review[] = [
  {
    id: 'review-1',
    author: 'James & Sarah',
    authorLocation: 'Edinburgh, UK',
    rating: 5,
    text: 'Absolutely incredible! Waking up to Glencoe views was unforgettable. The Defender was immaculate and the camping kit had everything we needed. Already planning our next trip!',
    date: '2024-11-15',
    source: 'google',
    featured: true,
    verified: true
  },
  {
    id: 'review-2',
    author: 'The Thompson Family',
    authorLocation: 'Manchester, UK',
    rating: 5,
    text: 'The kids absolutely loved it! So easy to set up - we were cooking dinner within 10 minutes of arriving at our spot. The rooftop tent was a huge hit. Best family adventure ever.',
    date: '2024-11-08',
    source: 'google',
    featured: true,
    verified: true
  },
  {
    id: 'review-3',
    author: 'Mike R.',
    authorLocation: 'London, UK',
    rating: 5,
    text: 'Best way to see the Highlands. The freedom to just pull up anywhere and camp is incredible. Defender handled every track we threw at it. Will definitely be back!',
    date: '2024-10-28',
    source: 'google',
    featured: true,
    verified: true
  },
  {
    id: 'review-4',
    author: 'Emma & Tom',
    authorLocation: 'Bristol, UK',
    rating: 5,
    text: 'Perfect for our honeymoon. Romantic and adventurous in equal measure. Watching the sunset from the rooftop tent with a glass of wine - pure magic. Thank you WildTrax!',
    date: '2024-10-20',
    source: 'google',
    featured: true,
    verified: true
  },
  {
    id: 'review-5',
    author: 'David Chen',
    authorLocation: 'Glasgow, UK',
    rating: 5,
    text: 'Third time booking with WildTrax and it just keeps getting better. The team are so helpful and the vehicles are always spotless. NC500 in a Defender is the only way to do it.',
    date: '2024-10-12',
    source: 'google',
    featured: true,
    verified: true
  },
  {
    id: 'review-6',
    author: 'Sophie Williams',
    authorLocation: 'Cardiff, UK',
    rating: 5,
    text: 'Solo trip and I felt completely safe and prepared. The handover was thorough and they even gave me tips on the best wild camping spots. Incredible experience!',
    date: '2024-09-30',
    source: 'google',
    featured: false,
    verified: true
  },
  {
    id: 'review-7',
    author: 'The Patels',
    authorLocation: 'Birmingham, UK',
    rating: 5,
    text: 'We were nervous about camping with no experience but WildTrax made it so easy. Everything was explained clearly and the gear quality is top notch. 10/10!',
    date: '2024-09-22',
    source: 'google',
    featured: false,
    verified: true
  },
  {
    id: 'review-8',
    author: 'Chris & Anna',
    authorLocation: 'Newcastle, UK',
    rating: 5,
    text: 'Celebrated our anniversary in style. The Defender turned heads everywhere we went. Waking up by Loch Ness was surreal. Already booked again for next year!',
    date: '2024-09-15',
    source: 'google',
    featured: false,
    verified: true
  }
]

// Featured review IDs for display on reviews Frame
export const wildtraxFeaturedReviews = wildtraxReviews
  .filter(r => r.featured)
  .map(r => r.id)

// ============================================
// BACKWARDS COMPATIBILITY EXPORTS
// (Remove these once all imports are updated)
// ============================================

/** @deprecated Use FrameData instead */
export type SlideData = FrameData
/** @deprecated Use FrameInfoContent instead */
export type SlideInfoContent = FrameInfoContent
/** @deprecated Use campingFrames instead */
export const campingSlides = campingFrames
/** @deprecated Use justDriveFrames instead */
export const justDriveSlides = justDriveFrames
/** @deprecated Use campingFrames instead */
export const wildtraxSlides = campingFrames
/** @deprecated Use campingFAQs instead */
export const wildtraxFAQs = campingFAQs

