'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

interface SlideContent {
  title: string
  subtitle?: string
  cta?: string
  ctaIcon?: 'book' | 'call' | 'menu' | 'view' | 'arrow'
  rating?: number
  reviews?: number
  tag?: string
  videoSrc: string
}

interface PhoneMockupProps {
  className?: string
  variant: 'hospitality' | 'rentals' | 'experiences' | 'wellness' | 'realestate' | 'events' | 'fitness' | 'automotive' | 'wildtrax' | 'lunadomes' | 'extremetrailers'
}

// 8 INDUSTRIES - All aspirational, luxury, premium
// Every video must make people think "I want THAT"
const variantContent: Record<string, {
  slides: SlideContent[]
  accentColor: string
  gradient: string
}> = {
  // 1. HOSPITALITY - Fine Dining (Maison Lumière, Paris)
  hospitality: {
    accentColor: 'bg-amber-500',
    gradient: 'from-amber-600 to-orange-700',
    slides: [
      {
        title: 'Maison Lumière',
        subtitle: 'Paris • Fine dining',
        cta: 'Reserve Table',
        ctaIcon: 'book',
        rating: 4.9,
        reviews: 3512,
        tag: '🍷 Michelin ⭐⭐',
        videoSrc: 'https://videos.pexels.com/video-files/5107292/5107292-uhd_1440_2560_25fps.mp4',
      },
      {
        title: "Chef's Table",
        subtitle: '12-course omakase',
        cta: 'View Menu',
        ctaIcon: 'menu',
        tag: '🔥 Signature Experience',
        videoSrc: 'https://videos.pexels.com/video-files/8477264/8477264-hd_1080_1920_24fps.mp4',
      },
      {
        title: 'Private Events',
        subtitle: 'Exclusive dining rooms',
        cta: 'Inquire',
        ctaIcon: 'call',
        videoSrc: 'https://videos.pexels.com/video-files/5107292/5107292-uhd_1440_2560_25fps.mp4',
      },
    ],
  },

  // 2. LUXURY RENTALS - Villa Serenità (Amalfi Coast)
  rentals: {
    accentColor: 'bg-emerald-500',
    gradient: 'from-emerald-600 to-teal-700',
    slides: [
      {
        title: 'Villa Serenità',
        subtitle: 'Amalfi Coast, Italy',
        cta: 'Check Availability',
        ctaIcon: 'book',
        rating: 4.9,
        reviews: 1243,
        tag: '🏆 Luxury Collection',
        videoSrc: 'https://videos.pexels.com/video-files/7578550/7578550-uhd_2560_1440_30fps.mp4',
      },
      {
        title: 'The Grand Suite',
        subtitle: 'Sea view • Private terrace',
        cta: 'View Property',
        ctaIcon: 'view',
        tag: '⭐ Editor\'s Choice',
        videoSrc: 'https://videos.pexels.com/video-files/7578545/7578545-uhd_2560_1440_30fps.mp4',
      },
      {
        title: 'Reserve Your Stay',
        subtitle: 'Flexible cancellation',
        cta: 'Book Now',
        ctaIcon: 'book',
        videoSrc: 'https://videos.pexels.com/video-files/7578542/7578542-uhd_2560_1440_30fps.mp4',
      },
    ],
  },

  // 9. WILDTRAX - Real Land Rover Defender footage (RED accent)
  wildtrax: {
    accentColor: 'bg-red-600',
    gradient: 'from-red-700 to-red-900',
    slides: [
      {
        title: 'WildTrax 4x4',
        subtitle: 'Scottish Highlands',
        cta: 'View Fleet',
        ctaIcon: 'view',
        rating: 5.0,
        reviews: 209,
        tag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Highland Adventures',
        videoSrc: 'https://cdn.prod.website-files.com/637f750dfbde40cdf98c2098/64ad551bff882df891df435e_Wildtrax%20Hero%20Video-transcode.mp4',
      },
      {
        title: 'Land Rover Defender',
        subtitle: 'Roof tent • Full kit',
        cta: 'Book Now',
        ctaIcon: 'book',
        tag: '🏕️ Camp Wild',
        videoSrc: 'https://cdn.prod.website-files.com/637f750dfbde40cdf98c2098/64ad551bff882df891df435e_Wildtrax%20Hero%20Video-transcode.mp4',
      },
      {
        title: 'NC500 Ready',
        subtitle: 'From £165/day',
        cta: 'Check Availability',
        ctaIcon: 'book',
        videoSrc: 'https://cdn.prod.website-files.com/637f750dfbde40cdf98c2098/64ad551bff882df891df435e_Wildtrax%20Hero%20Video-transcode.mp4',
      },
    ],
  },

  // 3. EXPERIENCES - Azure Yacht Charters (Mediterranean)
  experiences: {
    accentColor: 'bg-blue-500',
    gradient: 'from-blue-600 to-indigo-700',
    slides: [
      {
        title: 'Azure Charters',
        subtitle: 'Mediterranean yacht experiences',
        cta: 'Book Now',
        ctaIcon: 'book',
        rating: 4.9,
        reviews: 2847,
        tag: '⛵ Luxury Fleet',
        videoSrc: 'https://videos.pexels.com/video-files/28680911/12451812_2160_3840_30fps.mp4',
      },
      {
        title: 'Sunset Cruise',
        subtitle: 'Private 4-hour charter',
        cta: 'View Experience',
        ctaIcon: 'arrow',
        tag: '🔥 Most Requested',
        videoSrc: 'https://videos.pexels.com/video-files/28680911/12451812_2160_3840_30fps.mp4',
      },
      {
        title: 'Concierge',
        subtitle: '24/7 white-glove service',
        cta: 'Contact Us',
        ctaIcon: 'call',
        videoSrc: 'https://videos.pexels.com/video-files/28680911/12451812_2160_3840_30fps.mp4',
      },
    ],
  },

  // 4. BEAUTY & WELLNESS - Velvet Spa (Beverly Hills)
  wellness: {
    accentColor: 'bg-rose-500',
    gradient: 'from-rose-500 to-pink-600',
    slides: [
      {
        title: 'Velvet Spa',
        subtitle: 'Beverly Hills',
        cta: 'Book Treatment',
        ctaIcon: 'book',
        rating: 4.9,
        reviews: 1892,
        tag: '✨ Forbes 5-Star',
        // Using elegant interior - no people
        videoSrc: 'https://videos.pexels.com/video-files/7578550/7578550-uhd_2560_1440_30fps.mp4',
      },
      {
        title: 'Diamond Facial',
        subtitle: '90-min signature treatment',
        cta: 'View Services',
        ctaIcon: 'view',
        tag: '💎 Most Popular',
        videoSrc: 'https://videos.pexels.com/video-files/7578545/7578545-uhd_2560_1440_30fps.mp4',
      },
      {
        title: 'Gift Cards',
        subtitle: 'The perfect present',
        cta: 'Purchase',
        ctaIcon: 'arrow',
        videoSrc: 'https://videos.pexels.com/video-files/7578542/7578542-uhd_2560_1440_30fps.mp4',
      },
    ],
  },

  // 5. REAL ESTATE - Prestige Estates (Miami)
  realestate: {
    accentColor: 'bg-slate-600',
    gradient: 'from-slate-700 to-slate-900',
    slides: [
      {
        title: 'Prestige Estates',
        subtitle: 'Miami Luxury Properties',
        cta: 'View Listings',
        ctaIcon: 'view',
        rating: 4.9,
        reviews: 847,
        tag: '🏠 #1 Luxury Brokerage',
        videoSrc: 'https://videos.pexels.com/video-files/7578550/7578550-uhd_2560_1440_30fps.mp4',
      },
      {
        title: 'Oceanfront Penthouse',
        subtitle: '$12.5M • 5,400 sq ft',
        cta: 'Schedule Tour',
        ctaIcon: 'book',
        tag: '🔥 Just Listed',
        videoSrc: 'https://videos.pexels.com/video-files/7578545/7578545-uhd_2560_1440_30fps.mp4',
      },
      {
        title: 'Private Viewings',
        subtitle: 'By appointment only',
        cta: 'Contact Agent',
        ctaIcon: 'call',
        videoSrc: 'https://videos.pexels.com/video-files/7578542/7578542-uhd_2560_1440_30fps.mp4',
      },
    ],
  },

  // 6. EVENTS & VENUES - The Glass House
  events: {
    accentColor: 'bg-purple-500',
    gradient: 'from-purple-600 to-violet-700',
    slides: [
      {
        title: 'The Glass House',
        subtitle: 'Los Angeles Event Venue',
        cta: 'Check Availability',
        ctaIcon: 'book',
        rating: 4.9,
        reviews: 1456,
        tag: '💒 Award-Winning Venue',
        videoSrc: 'https://videos.pexels.com/video-files/5107292/5107292-uhd_1440_2560_25fps.mp4',
      },
      {
        title: 'Grand Ballroom',
        subtitle: 'Up to 400 guests',
        cta: 'View Spaces',
        ctaIcon: 'view',
        tag: '⭐ Featured in Vogue',
        videoSrc: 'https://videos.pexels.com/video-files/5107292/5107292-uhd_1440_2560_25fps.mp4',
      },
      {
        title: 'Plan Your Event',
        subtitle: 'Full-service coordination',
        cta: 'Get Quote',
        ctaIcon: 'arrow',
        videoSrc: 'https://videos.pexels.com/video-files/5107292/5107292-uhd_1440_2560_25fps.mp4',
      },
    ],
  },

  // 7. FITNESS - FORM Studio (Boutique Fitness)
  fitness: {
    accentColor: 'bg-orange-500',
    gradient: 'from-orange-500 to-red-600',
    slides: [
      {
        title: 'FORM Studio',
        subtitle: 'Manhattan • Boutique Fitness',
        cta: 'Book Class',
        ctaIcon: 'book',
        rating: 4.9,
        reviews: 2341,
        tag: '🏋️ NYC\'s #1 Studio',
        // Man lifting barbell - powerful strength training
        videoSrc: 'https://videos.pexels.com/video-files/5319754/5319754-hd_1080_1920_25fps.mp4',
      },
      {
        title: 'Signature HIIT',
        subtitle: '45 min • All levels',
        cta: 'View Schedule',
        ctaIcon: 'view',
        tag: '🔥 Bestseller',
        // Girl doing dumbbells - gym workout
        videoSrc: 'https://videos.pexels.com/video-files/20535458/20535458-uhd_1440_2560_24fps.mp4',
      },
      {
        title: 'Memberships',
        subtitle: 'Unlimited access from $199/mo',
        cta: 'Join Now',
        ctaIcon: 'arrow',
        // Additional fitness video
        videoSrc: 'https://videos.pexels.com/video-files/4921647/4921647-hd_1080_1920_25fps.mp4',
      },
    ],
  },

  // 8. AUTOMOTIVE - Apex Motors (Exotic Cars)
  automotive: {
    accentColor: 'bg-red-600',
    gradient: 'from-red-600 to-red-900',
    slides: [
      {
        title: 'Apex Motors',
        subtitle: 'Dubai • Exotic Car Rentals',
        cta: 'Browse Fleet',
        ctaIcon: 'view',
        rating: 4.9,
        reviews: 1567,
        tag: '🏎️ Premium Collection',
        videoSrc: 'https://videos.pexels.com/video-files/5309351/5309351-hd_1920_1080_25fps.mp4',
      },
      {
        title: 'Ferrari 488 Spider',
        subtitle: 'From $1,500/day',
        cta: 'Reserve Now',
        ctaIcon: 'book',
        tag: '⚡ Available Today',
        videoSrc: 'https://videos.pexels.com/video-files/5309380/5309380-hd_1920_1080_25fps.mp4',
      },
      {
        title: 'Start Your Engine',
        subtitle: 'White-glove delivery',
        cta: 'Contact Us',
        ctaIcon: 'call',
        videoSrc: 'https://videos.pexels.com/video-files/5309435/5309435-hd_1920_1080_25fps.mp4',
      },
    ],
  },

  // LUNA DOMES - Luxury Glamping (West Kent)
  // 4 slides: Hero, Featured Dome, Hot Tub Experience, Winter Offer
  lunadomes: {
    accentColor: 'bg-amber-500',
    gradient: 'from-amber-700 to-rose-800',
    slides: [
      {
        // SLIDE 1: Hero - Stunning dome exterior at sunset/dusk
        title: 'Luna Domes',
        subtitle: 'West Kent • Luxury Glamping',
        cta: 'Explore Domes',
        ctaIcon: 'view',
        rating: 4.9,
        reviews: 847,
        tag: '🌙 Britain\'s Finest',
        // Glamping dome in nature at dusk
        videoSrc: 'https://videos.pexels.com/video-files/6394054/6394054-uhd_2560_1440_25fps.mp4',
      },
      {
        // SLIDE 2: Featured Dome - Wakehurst interior luxury
        title: 'Wakehurst Dome',
        subtitle: 'Split-level • Incredible views',
        cta: 'View Dome',
        ctaIcon: 'view',
        tag: '👑 Most Popular',
        // Cozy cabin interior with warm lighting
        videoSrc: 'https://videos.pexels.com/video-files/6394024/6394024-uhd_2560_1440_25fps.mp4',
      },
      {
        // SLIDE 3: Hot tub experience - the luxury selling point
        title: 'Private Hot Tubs',
        subtitle: 'Every dome • Under the stars',
        cta: 'Book Now',
        ctaIcon: 'book',
        tag: '🔥 Included',
        // Hot tub / spa relaxation
        videoSrc: 'https://videos.pexels.com/video-files/6394148/6394148-uhd_2560_1440_25fps.mp4',
      },
      {
        // SLIDE 4: Winter promo - cozy fire vibes
        title: '30% Off Winter',
        subtitle: '3-night midweek escapes',
        cta: 'Claim Offer',
        ctaIcon: 'arrow',
        tag: '❄️ Limited Time',
        // Cozy fireplace / winter cabin vibes
        videoSrc: 'https://videos.pexels.com/video-files/5896379/5896379-uhd_2560_1440_25fps.mp4',
      },
    ],
  },

  // EXTREME TRAILERS - Boat Trailers (Southampton)
  // 4 slides: Hero, Jet Ski Trailers, RIB/Boat Trailers, Custom Build
  extremetrailers: {
    accentColor: 'bg-cyan-500',
    gradient: 'from-cyan-700 to-blue-900',
    slides: [
      {
        // SLIDE 1: Hero - Epic boat/water lifestyle
        title: 'Extreme Trailers',
        subtitle: 'Southampton • Made in Britain',
        cta: 'View Range',
        ctaIcon: 'view',
        rating: 4.9,
        reviews: 1243,
        tag: '🇬🇧 100 Years Marine Experience',
        // Luxury boat on water
        videoSrc: 'https://videos.pexels.com/video-files/1739010/1739010-uhd_2560_1440_24fps.mp4',
      },
      {
        // SLIDE 2: Jet Ski range - their bestseller
        title: 'EXT750 Jet Ski',
        subtitle: 'Best Seller • AL-KO Axles',
        cta: 'Get Quote',
        ctaIcon: 'arrow',
        tag: '🔥 #1 Seller',
        // Jet ski action
        videoSrc: 'https://videos.pexels.com/video-files/4816566/4816566-uhd_2560_1440_30fps.mp4',
      },
      {
        // SLIDE 3: RIB & Boat trailers - bigger vessels
        title: 'RIB & Boat Range',
        subtitle: 'Up to 10m • Heavy duty',
        cta: 'View Specs',
        ctaIcon: 'view',
        tag: '⚓ Professional Grade',
        // Boat marina / sailing
        videoSrc: 'https://videos.pexels.com/video-files/2499573/2499573-uhd_2560_1440_24fps.mp4',
      },
      {
        // SLIDE 4: Custom builds - CNC precision
        title: 'Custom Built',
        subtitle: 'CNC laser • Hot-dipped galvanised',
        cta: 'Call Now',
        ctaIcon: 'call',
        tag: '🛠️ Bespoke',
        // Industrial / manufacturing precision
        videoSrc: 'https://videos.pexels.com/video-files/3252131/3252131-uhd_2560_1440_25fps.mp4',
      },
    ],
  },
}

// CTA Icon components
function CTAIcon({ type }: { type: string }) {
  switch (type) {
    case 'book':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'call':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    case 'menu':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'view':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )
  }
}

export function PhoneMockup({ 
  className = '',
  variant = 'hospitality',
}: PhoneMockupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const content = variantContent[variant]
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [content.slides.length])

  const currentContent = content.slides[currentSlide]

  // 3D tilt effect
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3])

  return (
    <motion.div 
      ref={ref}
      className={`relative ${className}`}
      style={{
        rotateY,
        rotateX,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect behind phone */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-br from-leader-blue/30 via-purple-500/20 to-cyan-500/30 rounded-full scale-75" />
      
      {/* iPhone Frame */}
      <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-[0_0_60px_-15px_rgba(37,99,235,0.3),0_25px_50px_-12px_rgba(0,0,0,0.4),0_10px_20px_-5px_rgba(0,0,0,0.2)]">
        {/* Side buttons */}
        <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-700 rounded-l-full" />
        <div className="absolute -left-1 top-36 w-1 h-12 bg-gray-700 rounded-l-full" />
        <div className="absolute -left-1 top-52 w-1 h-12 bg-gray-700 rounded-l-full" />
        <div className="absolute -right-1 top-32 w-1 h-16 bg-gray-700 rounded-r-full" />
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-16 h-4 bg-gray-800 rounded-full flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-700 rounded-full" />
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
        
        {/* Screen */}
        <div className={`relative w-full h-full bg-gradient-to-b ${content.gradient} rounded-[2.25rem] overflow-hidden`}>
          {/* Video Background - CHANGES WITH EACH SLIDE */}
          <AnimatePresence mode="wait">
            <motion.video
              key={currentSlide}
              src={currentContent.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
          
          {/* Gradient overlays for UI readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          
          {/* === TOP SECTION === */}
          <div className="absolute top-10 left-0 right-0 px-4 z-10">
            {/* Tag/Badge */}
            <AnimatePresence mode="wait">
              {currentContent.tag && (
                <motion.div
                  key={`tag-${currentSlide}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="inline-block"
                >
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1 rounded-full">
                    {currentContent.tag}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* === RIGHT SIDE ACTIONS (TikTok style) === */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 z-10">
            {/* Like */}
            <motion.button 
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <span className="text-white text-[10px] font-medium">2.4k</span>
            </motion.button>
            
            {/* Share */}
            <motion.button 
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <span className="text-white text-[10px] font-medium">Share</span>
            </motion.button>

            {/* Info */}
            <motion.button 
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </motion.button>
          </div>

          {/* === SLIDE INDICATORS (Right side, below actions) === */}
          <div className="absolute right-3 bottom-32 flex flex-col gap-1.5 z-10">
            {content.slides.map((_, i) => (
              <motion.div 
                key={i}
                className={`w-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSlide 
                    ? `h-6 ${content.accentColor}` 
                    : 'h-1.5 bg-white/40'
                }`}
                onClick={() => setCurrentSlide(i)}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          {/* === BOTTOM CONTENT === */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Rating & Reviews */}
                {currentContent.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(currentContent.rating!) ? 'text-yellow-400' : 'text-white/30'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white/80 text-[10px]">{currentContent.rating} ({currentContent.reviews} reviews)</span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg">
                  {currentContent.title}
                </h3>
                
                {/* Subtitle */}
                {currentContent.subtitle && (
                  <p className="text-white/80 text-sm mb-4 drop-shadow-md">
                    {currentContent.subtitle}
                  </p>
                )}

                {/* CTA Button */}
                {currentContent.cta && (
                  <motion.button
                    className={`w-full ${content.accentColor} text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentContent.ctaIcon && <CTAIcon type={currentContent.ctaIcon} />}
                    {currentContent.cta}
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Swipe Up Indicator */}
            <motion.div 
              className="flex flex-col items-center mt-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="text-white/50 text-[10px] mt-0.5">Swipe up</span>
            </motion.div>
          </div>
          
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-10" />
        </div>
        
        {/* Physical home indicator on frame */}
        <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-600 rounded-full" />
      </div>
    </motion.div>
  )
}
