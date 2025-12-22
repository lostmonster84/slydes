/**
 * Property Vertical Templates
 *
 * AIDA-optimized frame structures for property businesses:
 * - Estate agents
 * - Letting agents
 * - Property developers
 * - Landlords
 */

import type { SlydeTemplate } from './index'

export const propertyTemplates: SlydeTemplate[] = [
  // ============================================
  // 1. Property Listing (Flagship) - 5 Frames
  // ============================================
  {
    id: 'property-listing',
    name: 'Property Listing',
    description: 'Showcase a single property with hero, features, and booking CTA',
    icon: 'home',
    vertical: 'property',
    previewHint: '5 frames • Hero → Features → Lifestyle → Details → Book',
    frames: [
      {
        templateType: 'hook',
        title: 'Welcome Home',
        subtitle: '4 bed • Location • £XXX,XXX',
        // No CTA - keep them swiping
      },
      {
        templateType: 'what',
        title: 'Heart of the Home',
        subtitle: 'Open-plan kitchen-diner',
        // No CTA - building interest
      },
      {
        templateType: 'how',
        title: 'Your Private Retreat',
        subtitle: 'South-facing garden',
        // No CTA - showing lifestyle
      },
      {
        templateType: 'trust',
        title: 'Why This Property?',
        subtitle: 'Everything you need',
        cta: {
          text: 'View Details',
          type: 'info',
        },
      },
      {
        templateType: 'action',
        title: 'Ready to View?',
        subtitle: 'Book your private viewing',
        cta: {
          text: 'Book Viewing',
          type: 'link',
        },
      },
    ],
  },

  // ============================================
  // 2. New Development - 4 Frames
  // ============================================
  {
    id: 'new-development',
    name: 'New Development',
    description: 'Market a development site with multiple plots',
    icon: 'building-2',
    vertical: 'property',
    previewHint: '4 frames • Overview → Plots → Location → Register',
    frames: [
      {
        templateType: 'hook',
        title: 'Coming Soon',
        subtitle: 'A new chapter begins',
        // No CTA - hook them first
      },
      {
        templateType: 'what',
        title: 'Find Your Plot',
        subtitle: 'X homes available',
        cta: {
          text: 'View Plots',
          type: 'list',
        },
      },
      {
        templateType: 'how',
        title: 'Perfect Location',
        subtitle: 'Everything on your doorstep',
        cta: {
          text: 'View Map',
          type: 'directions',
        },
      },
      {
        templateType: 'action',
        title: 'Be First to Know',
        subtitle: 'Register your interest',
        cta: {
          text: 'Register Now',
          type: 'link',
        },
      },
    ],
  },

  // ============================================
  // 3. Agent Profile - 4 Frames
  // ============================================
  {
    id: 'agent-profile',
    name: 'Agent Profile',
    description: 'Introduce your agency and build trust',
    icon: 'user-circle',
    vertical: 'property',
    previewHint: '4 frames • About → Services → Results → Contact',
    frames: [
      {
        templateType: 'who',
        title: 'Meet Your Agent',
        subtitle: 'Local expertise you can trust',
        // No CTA - introducing themselves
      },
      {
        templateType: 'what',
        title: 'How We Help',
        subtitle: 'Sales • Lettings • Management',
        // No CTA - showing services
      },
      {
        templateType: 'proof',
        title: 'Our Results',
        subtitle: 'X homes sold this year',
        cta: {
          text: 'See Reviews',
          type: 'reviews',
        },
      },
      {
        templateType: 'action',
        title: "Let's Talk",
        subtitle: 'Free, no-obligation chat',
        cta: {
          text: 'Call Now',
          type: 'call',
        },
      },
    ],
  },

  // ============================================
  // 4. Free Valuation - 4 Frames (Lead Gen)
  // ============================================
  {
    id: 'free-valuation',
    name: 'Free Valuation',
    description: 'Generate seller leads with a valuation offer',
    icon: 'calculator',
    vertical: 'property',
    previewHint: '4 frames • Hook → Market → Results → Book',
    frames: [
      {
        templateType: 'hook',
        title: "What's Your Home Worth?",
        subtitle: 'Find out in 60 seconds',
        // No CTA - hook them with the question
      },
      {
        templateType: 'what',
        title: 'The Market Right Now',
        subtitle: 'Prices in your area are...',
        // No CTA - providing value
      },
      {
        templateType: 'proof',
        title: 'We Get Results',
        subtitle: 'Average X days to sell',
        cta: {
          text: 'See Reviews',
          type: 'reviews',
        },
      },
      {
        templateType: 'action',
        title: 'Get Your Free Valuation',
        subtitle: 'No obligation, no pressure',
        cta: {
          text: 'Book Now',
          type: 'link',
        },
      },
    ],
  },

  // ============================================
  // 5. Open House Event - 3 Frames
  // ============================================
  {
    id: 'open-house',
    name: 'Open House Event',
    description: 'Promote a viewing day or open house',
    icon: 'calendar',
    vertical: 'property',
    previewHint: '3 frames • Event → Property → RSVP',
    frames: [
      {
        templateType: 'hook',
        title: 'Open House',
        subtitle: 'Saturday 10am - 4pm',
        // No CTA - date/time is the hook
      },
      {
        templateType: 'what',
        title: 'The Property',
        subtitle: 'A rare opportunity',
        cta: {
          text: 'View Details',
          type: 'info',
        },
      },
      {
        templateType: 'action',
        title: 'Secure Your Slot',
        subtitle: 'Limited viewing times',
        cta: {
          text: 'RSVP Now',
          type: 'link',
        },
      },
    ],
  },
]
