/**
 * Highland Motors Demo Data
 *
 * Complete data structure for the Home Slyde flow demo.
 * Demonstrates: Home Slyde → Category Slyde → Inventory Grid → Item Slyde
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

export interface InventoryItem {
  id: string
  title: string
  subtitle: string
  price: string
  image: string
  badge?: string
  frames: FrameData[] // Item's own slyde frames
}

export interface CategoryData {
  id: string
  label: string
  icon: string
  description: string
  frames: FrameData[]
  inventory?: InventoryItem[] // Only categories with inventory show "View All"
}

export interface HomeSlydeData {
  businessName: string
  tagline: string
  accentColor: string
  backgroundGradient: string
  categories: CategoryData[]
  primaryCta?: {
    text: string
    action: string
  }
}

// ============================================
// HIGHLAND MOTORS DATA
// ============================================

export const highlandMotorsData: HomeSlydeData = {
  businessName: 'Highland Motors',
  tagline: 'Premium Service, Highland Style',
  accentColor: '#22D3EE', // Electric Cyan
  backgroundGradient: 'from-slate-900 via-slate-800 to-slate-900',

  primaryCta: {
    text: 'Book Service',
    action: 'book',
  },

  categories: [
    // ============================================
    // SERVICES (No inventory)
    // ============================================
    {
      id: 'services',
      label: 'Services',
      icon: '🔧',
      description: 'MOT, Servicing & Repairs',
      frames: [
        {
          id: 'services-hero',
          title: 'Expert Service',
          subtitle: 'Factory-trained technicians. Genuine parts. Highland hospitality.',
          badge: 'Trusted Since 1985',
          background: { type: 'gradient', gradient: 'from-slate-800 to-slate-900' },
        },
        {
          id: 'services-mot',
          title: 'MOT Testing',
          subtitle: 'Class 4, 5 & 7. Same-day results. Free retest within 10 days.',
          badge: 'From £45',
          background: { type: 'gradient', gradient: 'from-blue-900 to-slate-900' },
        },
        {
          id: 'services-maintenance',
          title: 'Full Servicing',
          subtitle: 'Interim, full & major services. All makes and models.',
          badge: 'From £149',
          background: { type: 'gradient', gradient: 'from-emerald-900 to-slate-900' },
        },
        {
          id: 'services-repairs',
          title: 'Repairs & Diagnostics',
          subtitle: 'Engine, gearbox, suspension, brakes. Latest diagnostic equipment.',
          background: { type: 'gradient', gradient: 'from-amber-900 to-slate-900' },
        },
        {
          id: 'services-cta',
          title: 'Book Your Service',
          subtitle: 'Online booking. Courtesy car available. Collection service.',
          background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
          cta: { text: 'Book Now', action: 'book' },
        },
      ],
    },

    // ============================================
    // VEHICLES (Has inventory - 12 items)
    // ============================================
    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: '🚗',
      description: 'Quality Used Cars',
      frames: [
        {
          id: 'vehicles-hero',
          title: 'Quality Pre-Owned',
          subtitle: 'Hand-picked vehicles. Full history. Highland warranty.',
          badge: '12 In Stock',
          background: { type: 'gradient', gradient: 'from-slate-800 to-slate-900' },
        },
        {
          id: 'vehicles-trust',
          title: 'Every Vehicle Inspected',
          subtitle: '120-point check. HPI clear. Service history verified.',
          badge: 'Peace of Mind',
          background: { type: 'gradient', gradient: 'from-emerald-900 to-slate-900' },
        },
        {
          id: 'vehicles-featured',
          title: 'Featured: Range Rover Sport',
          subtitle: '2023 • 8,000 miles • Full spec • £45,000',
          badge: 'New In',
          background: { type: 'gradient', gradient: 'from-amber-900 to-slate-900' },
        },
        {
          id: 'vehicles-viewall',
          title: 'Browse Our Stock',
          subtitle: '12 vehicles ready for viewing. Part exchange welcome.',
          background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
          showViewAll: true,
          cta: { text: 'View All 12 Vehicles', action: 'inventory' },
        },
      ],
      inventory: [
        {
          id: 'bmw-320d',
          title: 'BMW 320d M Sport',
          subtitle: '2022 • 15,000 miles',
          price: '£28,995',
          image: '/demo/cars/bmw-320d.jpg',
          badge: 'Featured',
          frames: [
            {
              id: 'bmw-hero',
              title: 'BMW 320d M Sport',
              subtitle: '2022 • 15,000 miles • Automatic • Diesel',
              badge: '£28,995',
              background: { type: 'gradient', gradient: 'from-blue-900 to-slate-900' },
            },
            {
              id: 'bmw-interior',
              title: 'Premium Interior',
              subtitle: 'Full leather • Heated seats • HUD • Harman Kardon',
              background: { type: 'gradient', gradient: 'from-slate-800 to-slate-900' },
            },
            {
              id: 'bmw-specs',
              title: 'Performance',
              subtitle: '190bhp • 0-60 in 7.1s • 55mpg • £30 road tax',
              badge: 'Efficient',
              background: { type: 'gradient', gradient: 'from-emerald-900 to-slate-900' },
            },
            {
              id: 'bmw-history',
              title: 'Full BMW History',
              subtitle: '2 owners • All stamps • HPI clear • MOT Sept 2025',
              badge: 'Verified',
              background: { type: 'gradient', gradient: 'from-amber-900 to-slate-900' },
            },
            {
              id: 'bmw-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'audi-a4',
          title: 'Audi A4 S Line',
          subtitle: '2021 • 22,000 miles',
          price: '£26,500',
          image: '/demo/cars/audi-a4.jpg',
          frames: [
            {
              id: 'audi-hero',
              title: 'Audi A4 S Line',
              subtitle: '2021 • 22,000 miles • Automatic • Petrol',
              badge: '£26,500',
              background: { type: 'gradient', gradient: 'from-red-900 to-slate-900' },
            },
            {
              id: 'audi-interior',
              title: 'Virtual Cockpit',
              subtitle: 'Digital dash • MMI Navigation • B&O Sound',
              background: { type: 'gradient', gradient: 'from-slate-800 to-slate-900' },
            },
            {
              id: 'audi-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'range-rover-sport',
          title: 'Range Rover Sport',
          subtitle: '2023 • 8,000 miles',
          price: '£45,000',
          image: '/demo/cars/range-rover.jpg',
          badge: 'New In',
          frames: [
            {
              id: 'rr-hero',
              title: 'Range Rover Sport',
              subtitle: '2023 • 8,000 miles • Automatic • Diesel',
              badge: '£45,000',
              background: { type: 'gradient', gradient: 'from-emerald-900 to-slate-900' },
            },
            {
              id: 'rr-interior',
              title: 'Luxury Interior',
              subtitle: 'Windsor leather • Meridian • Panoramic roof',
              background: { type: 'gradient', gradient: 'from-slate-800 to-slate-900' },
            },
            {
              id: 'rr-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'vw-golf-gti',
          title: 'VW Golf GTI',
          subtitle: '2022 • 18,000 miles',
          price: '£22,995',
          image: '/demo/cars/golf-gti.jpg',
          frames: [
            {
              id: 'golf-hero',
              title: 'VW Golf GTI',
              subtitle: '2022 • 18,000 miles • DSG • Petrol',
              badge: '£22,995',
              background: { type: 'gradient', gradient: 'from-red-900 to-slate-900' },
            },
            {
              id: 'golf-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'mercedes-c-class',
          title: 'Mercedes C-Class',
          subtitle: '2021 • 25,000 miles',
          price: '£29,500',
          image: '/demo/cars/mercedes-c.jpg',
          frames: [
            {
              id: 'merc-hero',
              title: 'Mercedes C220d AMG Line',
              subtitle: '2021 • 25,000 miles • Automatic • Diesel',
              badge: '£29,500',
              background: { type: 'gradient', gradient: 'from-slate-700 to-slate-900' },
            },
            {
              id: 'merc-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'ford-focus-st',
          title: 'Ford Focus ST',
          subtitle: '2022 • 12,000 miles',
          price: '£19,995',
          image: '/demo/cars/focus-st.jpg',
          badge: 'Low Miles',
          frames: [
            {
              id: 'focus-hero',
              title: 'Ford Focus ST',
              subtitle: '2022 • 12,000 miles • Manual • Petrol',
              badge: '£19,995',
              background: { type: 'gradient', gradient: 'from-blue-900 to-slate-900' },
            },
            {
              id: 'focus-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'volvo-xc60',
          title: 'Volvo XC60 R-Design',
          subtitle: '2022 • 20,000 miles',
          price: '£32,500',
          image: '/demo/cars/volvo-xc60.jpg',
          frames: [
            {
              id: 'volvo-hero',
              title: 'Volvo XC60 R-Design',
              subtitle: '2022 • 20,000 miles • Automatic • Diesel',
              badge: '£32,500',
              background: { type: 'gradient', gradient: 'from-slate-700 to-slate-900' },
            },
            {
              id: 'volvo-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'tesla-model3',
          title: 'Tesla Model 3',
          subtitle: '2023 • 5,000 miles',
          price: '£35,995',
          image: '/demo/cars/tesla-model3.jpg',
          badge: 'Electric',
          frames: [
            {
              id: 'tesla-hero',
              title: 'Tesla Model 3 Long Range',
              subtitle: '2023 • 5,000 miles • Automatic • Electric',
              badge: '£35,995',
              background: { type: 'gradient', gradient: 'from-red-900 to-slate-900' },
            },
            {
              id: 'tesla-range',
              title: '350 Mile Range',
              subtitle: 'Long Range battery • Supercharger access • Autopilot',
              badge: 'Electric',
              background: { type: 'gradient', gradient: 'from-emerald-900 to-slate-900' },
            },
            {
              id: 'tesla-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'mini-cooper-s',
          title: 'MINI Cooper S',
          subtitle: '2022 • 14,000 miles',
          price: '£18,995',
          image: '/demo/cars/mini-cooper.jpg',
          frames: [
            {
              id: 'mini-hero',
              title: 'MINI Cooper S',
              subtitle: '2022 • 14,000 miles • Automatic • Petrol',
              badge: '£18,995',
              background: { type: 'gradient', gradient: 'from-red-900 to-slate-900' },
            },
            {
              id: 'mini-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'porsche-macan',
          title: 'Porsche Macan',
          subtitle: '2021 • 28,000 miles',
          price: '£42,500',
          image: '/demo/cars/porsche-macan.jpg',
          badge: 'Premium',
          frames: [
            {
              id: 'porsche-hero',
              title: 'Porsche Macan S',
              subtitle: '2021 • 28,000 miles • PDK • Petrol',
              badge: '£42,500',
              background: { type: 'gradient', gradient: 'from-slate-700 to-slate-900' },
            },
            {
              id: 'porsche-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'skoda-octavia',
          title: 'Skoda Octavia vRS',
          subtitle: '2022 • 16,000 miles',
          price: '£24,995',
          image: '/demo/cars/skoda-octavia.jpg',
          frames: [
            {
              id: 'skoda-hero',
              title: 'Skoda Octavia vRS',
              subtitle: '2022 • 16,000 miles • DSG • Petrol',
              badge: '£24,995',
              background: { type: 'gradient', gradient: 'from-emerald-900 to-slate-900' },
            },
            {
              id: 'skoda-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
        {
          id: 'hyundai-ioniq5',
          title: 'Hyundai IONIQ 5',
          subtitle: '2023 • 6,000 miles',
          price: '£38,995',
          image: '/demo/cars/hyundai-ioniq5.jpg',
          badge: 'Electric',
          frames: [
            {
              id: 'ioniq-hero',
              title: 'Hyundai IONIQ 5 Ultimate',
              subtitle: '2023 • 6,000 miles • Automatic • Electric',
              badge: '£38,995',
              background: { type: 'gradient', gradient: 'from-blue-900 to-slate-900' },
            },
            {
              id: 'ioniq-cta',
              title: 'Interested?',
              subtitle: 'Book a test drive or reserve with £500 deposit.',
              background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
              cta: { text: 'Enquire Now', action: 'enquire' },
            },
          ],
        },
      ],
    },

    // ============================================
    // OFFERS (No inventory)
    // ============================================
    {
      id: 'offers',
      label: 'Offers',
      icon: '💰',
      description: 'Special Deals',
      frames: [
        {
          id: 'offers-hero',
          title: 'Current Offers',
          subtitle: 'Exclusive deals for Highland customers.',
          badge: 'Limited Time',
          background: { type: 'gradient', gradient: 'from-amber-900 to-slate-900' },
        },
        {
          id: 'offers-mot',
          title: 'MOT Special',
          subtitle: 'Book online and get 20% off. Use code: HIGHLAND20',
          badge: '£36',
          background: { type: 'gradient', gradient: 'from-emerald-900 to-slate-900' },
        },
        {
          id: 'offers-service',
          title: 'Winter Service Package',
          subtitle: 'Full service + winter check + antifreeze top-up.',
          badge: '£199',
          background: { type: 'gradient', gradient: 'from-blue-900 to-slate-900' },
        },
        {
          id: 'offers-cta',
          title: 'Claim Your Offer',
          subtitle: 'Book online or call us. Offers end December 31st.',
          background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
          cta: { text: 'Book Now', action: 'book' },
        },
      ],
    },

    // ============================================
    // ABOUT (No inventory)
    // ============================================
    {
      id: 'about',
      label: 'About Us',
      icon: '📍',
      description: 'Est. 1985',
      frames: [
        {
          id: 'about-hero',
          title: 'Highland Motors',
          subtitle: 'Family-run since 1985. Three generations of expertise.',
          badge: 'Est. 1985',
          background: { type: 'gradient', gradient: 'from-slate-800 to-slate-900' },
        },
        {
          id: 'about-team',
          title: 'Our Team',
          subtitle: '12 factory-trained technicians. Master mechanics. Friendly service.',
          background: { type: 'gradient', gradient: 'from-blue-900 to-slate-900' },
        },
        {
          id: 'about-location',
          title: 'Find Us',
          subtitle: 'A9 Industrial Estate, Inverness. Open 7 days.',
          badge: 'Easy Access',
          background: { type: 'gradient', gradient: 'from-emerald-900 to-slate-900' },
        },
        {
          id: 'about-cta',
          title: 'Get In Touch',
          subtitle: 'Call, email, or drop in. Kettle\'s always on.',
          background: { type: 'gradient', gradient: 'from-cyan-900 to-slate-900' },
          cta: { text: 'Contact Us', action: 'contact' },
        },
      ],
    },
  ],
}

// Helper to get category by ID
export function getCategory(categoryId: string): CategoryData | undefined {
  return highlandMotorsData.categories.find(c => c.id === categoryId)
}

// Helper to get item from category inventory
export function getInventoryItem(categoryId: string, itemId: string): InventoryItem | undefined {
  const category = getCategory(categoryId)
  return category?.inventory?.find(item => item.id === itemId)
}
