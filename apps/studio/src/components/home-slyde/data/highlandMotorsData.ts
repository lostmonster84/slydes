/**
 * Demo Data - Barbershop / Hair Products
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
// DEMO DATA - BARBERSHOP / HAIR PRODUCTS
// ============================================

export const highlandMotorsData: HomeSlydeData = {
  businessName: 'Crew Cuts',
  tagline: 'Premium Grooming. Classic Style.',
  accentColor: '#F59E0B', // Amber - masculine/premium feel
  backgroundGradient: 'from-zinc-900 via-zinc-800 to-zinc-900',
  rating: 4.8,
  reviewCount: 1243,

  // Business Info
  about: 'Crew Cuts is your destination for premium men\'s grooming products and classic barbershop services. We stock the finest American Crew, Baxter, and Blind Barber products.',
  address: '42 High Street, London, W1D 4SQ',
  hours: 'Mon-Sat 9am-7pm, Sun 10am-5pm',
  website: 'crewcuts.co.uk',

  primaryCta: {
    text: 'Book Appointment',
    action: 'book',
  },

  categories: [
    // ============================================
    // STYLING PRODUCTS (Has inventory)
    // ============================================
    {
      id: 'styling',
      label: 'Styling',
      icon: 'sparkles',
      description: 'Pomades, Clays & Gels',
      frames: [
        {
          id: 'styling-hero',
          title: 'Premium Styling',
          subtitle: 'Pomades, clays, gels and more. Professional-grade hold.',
          badge: 'Best Sellers',
          background: { type: 'gradient', gradient: 'from-amber-900 to-zinc-900' },
        },
        {
          id: 'styling-pomade',
          title: 'Classic Pomades',
          subtitle: 'High shine, strong hold. The traditional choice.',
          badge: 'From £16',
          background: { type: 'gradient', gradient: 'from-zinc-800 to-zinc-900' },
        },
        {
          id: 'styling-clay',
          title: 'Matte Clays',
          subtitle: 'Natural finish, flexible hold. Modern texture.',
          badge: 'Trending',
          background: { type: 'gradient', gradient: 'from-stone-800 to-zinc-900' },
        },
        {
          id: 'styling-viewall',
          title: 'Browse All Styling',
          subtitle: '15 products in stock. Free shipping over £50.',
          background: { type: 'gradient', gradient: 'from-amber-900 to-zinc-900' },
          showViewAll: true,
          cta: { text: 'View All Products', action: 'inventory' },
        },
      ],
      inventory: [
        {
          id: 'ac-pomade',
          title: 'American Crew Pomade',
          subtitle: 'Medium hold • High shine',
          price: '£18.50',
          price_cents: 1850,
          image: 'https://images.unsplash.com/photo-1597854710159-39f3e8d94059?w=200&h=200&fit=crop',
          badge: 'Best Seller',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-pomade-hero',
              title: 'American Crew Pomade',
              subtitle: 'The classic. Medium hold with high shine for slick styles.',
              badge: '£18.50',
              background: { type: 'gradient', gradient: 'from-amber-900 to-zinc-900' },
            },
            {
              id: 'ac-pomade-details',
              title: 'Product Details',
              subtitle: '85g jar • Water-based • Washes out easily • Light fragrance',
              background: { type: 'gradient', gradient: 'from-zinc-800 to-zinc-900' },
            },
            {
              id: 'ac-pomade-use',
              title: 'How to Use',
              subtitle: 'Apply to damp or dry hair. Style with comb or fingers. Reactivates with water.',
              badge: 'Pro Tip',
              background: { type: 'gradient', gradient: 'from-stone-800 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-fiber',
          title: 'American Crew Fiber',
          subtitle: 'High hold • Matte finish',
          price: '£19.00',
          price_cents: 1900,
          image: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?w=200&h=200&fit=crop',
          badge: 'Popular',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-fiber-hero',
              title: 'American Crew Fiber',
              subtitle: 'Strong, pliable hold with matte finish. Perfect for textured looks.',
              badge: '£19.00',
              background: { type: 'gradient', gradient: 'from-zinc-800 to-zinc-900' },
            },
            {
              id: 'ac-fiber-details',
              title: 'Product Details',
              subtitle: '85g jar • Lanolin-based • Strong hold • Natural look',
              background: { type: 'gradient', gradient: 'from-stone-800 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-forming-cream',
          title: 'American Crew Forming Cream',
          subtitle: 'Medium hold • Natural shine',
          price: '£17.50',
          price_cents: 1750,
          image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-fc-hero',
              title: 'American Crew Forming Cream',
              subtitle: 'Versatile styling cream for a natural, healthy-looking finish.',
              badge: '£17.50',
              background: { type: 'gradient', gradient: 'from-amber-800 to-zinc-900' },
            },
          ],
        },
        {
          id: 'baxter-clay',
          title: 'Baxter Clay Pomade',
          subtitle: 'Strong hold • Matte finish',
          price: '£24.00',
          price_cents: 2400,
          image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=200&h=200&fit=crop',
          badge: 'Premium',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'baxter-clay-hero',
              title: 'Baxter Clay Pomade',
              subtitle: 'Premium clay with strong hold and completely matte finish.',
              badge: '£24.00',
              background: { type: 'gradient', gradient: 'from-stone-800 to-zinc-900' },
            },
          ],
        },
        {
          id: 'bb-90proof',
          title: 'Blind Barber 90 Proof',
          subtitle: 'Strong hold • Low shine',
          price: '£22.00',
          price_cents: 2200,
          image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'bb-90-hero',
              title: 'Blind Barber 90 Proof',
              subtitle: 'Strong, workable pomade with low shine. Bourbon-inspired scent.',
              badge: '£22.00',
              background: { type: 'gradient', gradient: 'from-amber-900 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-grooming-cream',
          title: 'AC Grooming Cream',
          subtitle: 'Light hold • High shine',
          price: '£16.50',
          price_cents: 1650,
          image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&h=200&fit=crop',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-gc-hero',
              title: 'American Crew Grooming Cream',
              subtitle: 'Light hold styling cream for a natural, straight finish.',
              badge: '£16.50',
              background: { type: 'gradient', gradient: 'from-zinc-700 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-matte-clay',
          title: 'AC Matte Clay',
          subtitle: 'Medium hold • No shine',
          price: '£18.00',
          price_cents: 1800,
          image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
          badge: 'New',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-mc-hero',
              title: 'American Crew Matte Clay',
              subtitle: 'Medium hold with completely matte finish. Adds texture.',
              badge: '£18.00',
              background: { type: 'gradient', gradient: 'from-stone-800 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-molding-clay',
          title: 'AC Molding Clay',
          subtitle: 'High hold • Matte finish',
          price: '£19.50',
          price_cents: 1950,
          image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&h=200&fit=crop',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-molding-hero',
              title: 'American Crew Molding Clay',
              subtitle: 'High hold clay for defined styles with a matte finish.',
              badge: '£19.50',
              background: { type: 'gradient', gradient: 'from-zinc-800 to-zinc-900' },
            },
          ],
        },
      ],
    },

    // ============================================
    // HAIR CARE (Has inventory)
    // ============================================
    {
      id: 'haircare',
      label: 'Hair Care',
      icon: 'droplets',
      description: 'Shampoos & Conditioners',
      frames: [
        {
          id: 'haircare-hero',
          title: 'Professional Hair Care',
          subtitle: 'Shampoos, conditioners and treatments. Salon-quality at home.',
          badge: 'Essentials',
          background: { type: 'gradient', gradient: 'from-blue-900 to-zinc-900' },
        },
        {
          id: 'haircare-shampoo',
          title: 'Daily Shampoos',
          subtitle: 'Gentle cleansing for everyday use. All hair types.',
          badge: 'From £12',
          background: { type: 'gradient', gradient: 'from-zinc-800 to-zinc-900' },
        },
        {
          id: 'haircare-viewall',
          title: 'Browse Hair Care',
          subtitle: '10 products available. Build your routine.',
          background: { type: 'gradient', gradient: 'from-blue-900 to-zinc-900' },
          showViewAll: true,
          cta: { text: 'View All Products', action: 'inventory' },
        },
      ],
      inventory: [
        {
          id: 'ac-daily-shampoo',
          title: 'AC Daily Shampoo',
          subtitle: 'All hair types • 250ml',
          price: '£12.00',
          price_cents: 1200,
          image: 'https://images.unsplash.com/photo-1556227703-6ca2d0e11a8c?w=200&h=200&fit=crop',
          badge: 'Essential',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-ds-hero',
              title: 'American Crew Daily Shampoo',
              subtitle: 'Gentle daily cleansing for all hair types. Fresh scent.',
              badge: '£12.00',
              background: { type: 'gradient', gradient: 'from-blue-900 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-3in1',
          title: 'AC 3-in-1',
          subtitle: 'Shampoo • Conditioner • Body wash',
          price: '£14.00',
          price_cents: 1400,
          image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&h=200&fit=crop',
          badge: 'Convenience',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-3in1-hero',
              title: 'American Crew 3-in-1',
              subtitle: 'All-in-one shampoo, conditioner, and body wash. Perfect for travel.',
              badge: '£14.00',
              background: { type: 'gradient', gradient: 'from-zinc-800 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-detox-shampoo',
          title: 'AC Detox Shampoo',
          subtitle: 'Deep cleansing • 250ml',
          price: '£15.00',
          price_cents: 1500,
          image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&h=200&fit=crop',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-detox-hero',
              title: 'American Crew Detox Shampoo',
              subtitle: 'Deep cleansing formula removes product buildup.',
              badge: '£15.00',
              background: { type: 'gradient', gradient: 'from-emerald-900 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-conditioner',
          title: 'AC Daily Conditioner',
          subtitle: 'Moisturising • 250ml',
          price: '£13.00',
          price_cents: 1300,
          image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=200&h=200&fit=crop',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-cond-hero',
              title: 'American Crew Daily Conditioner',
              subtitle: 'Lightweight conditioner for soft, manageable hair.',
              badge: '£13.00',
              background: { type: 'gradient', gradient: 'from-blue-800 to-zinc-900' },
            },
          ],
        },
      ],
    },

    // ============================================
    // SHAVING (Has inventory)
    // ============================================
    {
      id: 'shaving',
      label: 'Shaving',
      icon: 'scissors',
      description: 'Creams, Oils & Aftershave',
      frames: [
        {
          id: 'shaving-hero',
          title: 'The Perfect Shave',
          subtitle: 'Pre-shave oils, shaving creams and aftershave balms.',
          badge: 'Essentials',
          background: { type: 'gradient', gradient: 'from-emerald-900 to-zinc-900' },
        },
        {
          id: 'shaving-routine',
          title: 'Build Your Routine',
          subtitle: 'Pre-shave → Lather → Post-shave. The three-step ritual.',
          badge: 'Pro Guide',
          background: { type: 'gradient', gradient: 'from-zinc-800 to-zinc-900' },
        },
        {
          id: 'shaving-viewall',
          title: 'Browse Shaving',
          subtitle: '8 products for the perfect shave.',
          background: { type: 'gradient', gradient: 'from-emerald-900 to-zinc-900' },
          showViewAll: true,
          cta: { text: 'View All Products', action: 'inventory' },
        },
      ],
      inventory: [
        {
          id: 'ac-shave-cream',
          title: 'AC Shaving Cream',
          subtitle: 'Moisturising • 150ml',
          price: '£11.00',
          price_cents: 1100,
          image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=200&h=200&fit=crop',
          badge: 'Classic',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-sc-hero',
              title: 'American Crew Shaving Cream',
              subtitle: 'Rich lather for a smooth, comfortable shave.',
              badge: '£11.00',
              background: { type: 'gradient', gradient: 'from-emerald-900 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-precision-shave',
          title: 'AC Precision Shave Gel',
          subtitle: 'Clear formula • 150ml',
          price: '£13.00',
          price_cents: 1300,
          image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=200&h=200&fit=crop',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-psg-hero',
              title: 'AC Precision Shave Gel',
              subtitle: 'Clear gel for precision shaving. See every stroke.',
              badge: '£13.00',
              background: { type: 'gradient', gradient: 'from-zinc-800 to-zinc-900' },
            },
          ],
        },
        {
          id: 'ac-post-shave',
          title: 'AC Post-Shave Cooling Lotion',
          subtitle: 'Soothing • 150ml',
          price: '£14.00',
          price_cents: 1400,
          image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=200&h=200&fit=crop',
          badge: 'Soothing',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'ac-ps-hero',
              title: 'AC Post-Shave Cooling Lotion',
              subtitle: 'Cooling formula soothes and hydrates after shaving.',
              badge: '£14.00',
              background: { type: 'gradient', gradient: 'from-blue-900 to-zinc-900' },
            },
          ],
        },
        {
          id: 'bb-aftershave',
          title: 'Blind Barber Aftershave',
          subtitle: 'Toning • 100ml',
          price: '£20.00',
          price_cents: 2000,
          image: 'https://images.unsplash.com/photo-1590159983013-d4ff5fc71c1d?w=200&h=200&fit=crop',
          badge: 'Premium',
          commerce_mode: 'add_to_cart',
          frames: [
            {
              id: 'bb-as-hero',
              title: 'Blind Barber Aftershave',
              subtitle: 'Premium aftershave tonic with signature Blind Barber scent.',
              badge: '£20.00',
              background: { type: 'gradient', gradient: 'from-amber-900 to-zinc-900' },
            },
          ],
        },
      ],
    },

    // ============================================
    // SERVICES (No inventory)
    // ============================================
    {
      id: 'services',
      label: 'Services',
      icon: 'calendar',
      description: 'Cuts, Shaves & Treatments',
      frames: [
        {
          id: 'services-hero',
          title: 'In-Store Services',
          subtitle: 'Haircuts, hot towel shaves, beard trims and more.',
          badge: 'Book Now',
          background: { type: 'gradient', gradient: 'from-zinc-800 to-zinc-900' },
        },
        {
          id: 'services-cut',
          title: 'Classic Haircut',
          subtitle: 'Consultation, cut, wash and style. 45 minutes.',
          badge: '£35',
          background: { type: 'gradient', gradient: 'from-amber-900 to-zinc-900' },
        },
        {
          id: 'services-shave',
          title: 'Hot Towel Shave',
          subtitle: 'Traditional straight razor shave with hot towels.',
          badge: '£30',
          background: { type: 'gradient', gradient: 'from-stone-800 to-zinc-900' },
        },
        {
          id: 'services-combo',
          title: 'The Full Service',
          subtitle: 'Haircut + hot towel shave + scalp treatment.',
          badge: '£55',
          background: { type: 'gradient', gradient: 'from-amber-800 to-zinc-900' },
        },
        {
          id: 'services-cta',
          title: 'Book Your Appointment',
          subtitle: 'Online booking available. Walk-ins welcome.',
          background: { type: 'gradient', gradient: 'from-amber-900 to-zinc-900' },
          cta: { text: 'Book Now', action: 'book' },
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
