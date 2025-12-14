# Slydes Demo: API Interface

> **Stage 0 Documentation**
> TypeScript interface contract for the Slydes data layer.
> **Updated**: December 14, 2025 (Canonical Frame terminology per STRUCTURE.md)

---

## Overview

The `SlydesAPI` interface abstracts data access so the UI components don't care whether data comes from static files, Supabase, or any other source.

**Key principle**: UI components consume the interface; implementations are swappable.

**Terminology**: See `STRUCTURE.md` for canonical hierarchy (Profile → Slyde → Frame).

---

## Interface Definition

```typescript
// src/lib/slydes/types.ts

// ============================================
// CORE TYPES
// ============================================

export type CTAIconType = 'book' | 'call' | 'view' | 'arrow' | 'menu'

export type FrameTemplateType = 'hook' | 'how' | 'what' | 'trust' | 'proof' | 'action' | 'slydes'

export interface FrameBackground {
  type: 'video' | 'image'
  src: string
  position?: string
  startTime?: number
}

export interface FrameCTA {
  text: string
  icon: CTAIconType
  action?: string
}

export interface FrameInfoHighlight {
  icon: string
  label: string
  value: string
}

export interface FrameInfoContent {
  headline: string
  description?: string
  items?: string[]
  highlights?: FrameInfoHighlight[]
}

export interface Frame {
  id: string
  frameId: string
  order: number
  templateType?: FrameTemplateType
  title: string
  subtitle?: string
  badge?: string
  rating?: number
  reviewCount?: number
  heartCount: number
  faqCount: number
  cta?: FrameCTA
  background: FrameBackground
  accentColor: string
  infoContent?: FrameInfoContent
  isPromoFrame?: boolean
}

export interface FAQ {
  id: string
  faqId: string
  question: string
  answer: string
  category?: string
  order?: number
  isGlobal: boolean
}

export interface Review {
  id: string
  reviewId: string
  author: string
  authorLocation?: string
  rating: number
  text: string
  date: string
  source: 'google' | 'tripadvisor' | 'facebook' | 'manual' | 'imported'
  featured: boolean
  verified: boolean
}

export interface BusinessCredential {
  icon: string
  label: string
  value: string
}

export interface BusinessContact {
  phone?: string
  email?: string
  website?: string
}

export interface Business {
  id: string
  businessId: string
  name: string
  tagline?: string
  location: string
  rating: number
  reviewCount: number
  credentials: BusinessCredential[]
  about: string
  highlights?: string[]
  contact: BusinessContact
  logo?: string
  accentColor: string
}

/**
 * Slyde - A shareable experience containing multiple Frames
 * Example: "Camping" Slyde, "Property 3" Slyde
 */
export interface Slyde {
  id: string
  slydeId: string
  slug: string
  name: string
  description?: string
  accentColor?: string
  frames: Frame[]
  faqs: FAQ[]
  business: Business
}

export interface QuestionSubmission {
  question: string
  frameId?: string
  slydeId?: string
  businessId: string
}

// ============================================
// ANALYTICS EVENTS
// ============================================

export type AnalyticsEvent =
  | { type: 'frameView'; frameId: string; position: number; slydeId: string }
  | { type: 'sessionStart'; slydeId: string; referrer?: string }
  | { type: 'sessionEnd'; slydeId: string; framesViewed: number; duration: number }
  | { type: 'heartTap'; frameId: string; hearted: boolean }
  | { type: 'faqOpen'; frameId: string }
  | { type: 'faqExpand'; faqId: string; question: string }
  | { type: 'questionSubmit'; businessId: string; question: string }
  | { type: 'shareOpen'; frameId: string }
  | { type: 'shareClick'; platform: string; slydeId: string }
  | { type: 'ctaClick'; frameId: string; ctaText: string; action: string }
  | { type: 'contactClick'; contactType: 'call' | 'email' | 'message'; businessId: string }

// ============================================
// API INTERFACE
// ============================================

export interface SlydesAPI {
  // ─────────────────────────────────────────
  // Content Fetching
  // ─────────────────────────────────────────
  
  /**
   * Get a Slyde by slug with all Frames and FAQs populated
   */
  getSlyde(businessSlug: string, slydeSlug: string): Promise<Slyde | null>
  
  /**
   * Get all Slydes for a business (for Profile page)
   */
  getSlydes(businessSlug: string): Promise<Slyde[]>
  
  /**
   * Get Frames for a Slyde (ordered)
   */
  getFrames(slydeId: string): Promise<Frame[]>
  
  /**
   * Get a single Frame by ID
   */
  getFrame(frameId: string): Promise<Frame | null>
  
  /**
   * Get FAQs for a Slyde
   * If frameId provided, returns FAQs tagged for that Frame
   * Otherwise returns all FAQs for the Slyde
   */
  getFAQs(slydeId: string, frameId?: string): Promise<FAQ[]>
  
  /**
   * Search FAQs across all (global search)
   */
  searchFAQs(slydeId: string, query: string): Promise<FAQ[]>
  
  /**
   * Get reviews for a business
   * If featuredOnly=true, returns only featured reviews
   */
  getReviews(businessId: string, featuredOnly?: boolean): Promise<Review[]>
  
  /**
   * Get business profile
   */
  getBusiness(businessSlug: string): Promise<Business | null>
  
  // ─────────────────────────────────────────
  // User Interactions
  // ─────────────────────────────────────────
  
  /**
   * Increment heart count for a Frame
   * Returns the new count
   */
  incrementHeart(frameId: string): Promise<number>
  
  /**
   * Decrement heart count for a Frame
   * Returns the new count
   */
  decrementHeart(frameId: string): Promise<number>
  
  /**
   * Submit a user question
   */
  submitQuestion(submission: QuestionSubmission): Promise<void>
  
  // ─────────────────────────────────────────
  // Analytics
  // ─────────────────────────────────────────
  
  /**
   * Track an analytics event
   * Implementation can be no-op, console.log, or real sink
   */
  trackEvent(event: AnalyticsEvent): void
}
```

---

## Implementation: Supabase Adapter

> **Note**: This is the implementation for Slydes.io using Supabase.

```typescript
// src/lib/slydes/supabase-adapter.ts

import { createClient } from '@supabase/supabase-js'
import type { SlydesAPI, Slyde, Frame, FAQ, Review, Business, QuestionSubmission, AnalyticsEvent } from './types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function createSupabaseAdapter(): SlydesAPI {
  return {
    // ─────────────────────────────────────────
    // Content Fetching
    // ─────────────────────────────────────────
    
    async getSlyde(businessSlug: string, slydeSlug: string): Promise<Slyde | null> {
      const { data, error } = await supabase
        .from('slydes')
        .select(`
          *,
          frames (*),
          faqs (*),
          business:businesses (*)
        `)
        .eq('business.slug', businessSlug)
        .eq('slug', slydeSlug)
        .single()
      
      if (error || !data) return null
      return data as Slyde
    },
    
    async getSlydes(businessSlug: string): Promise<Slyde[]> {
      const { data, error } = await supabase
        .from('slydes')
        .select(`
          *,
          business:businesses!inner (slug)
        `)
        .eq('business.slug', businessSlug)
        .order('created_at', { ascending: false })
      
      if (error || !data) return []
      return data as Slyde[]
    },
    
    async getFrames(slydeId: string): Promise<Frame[]> {
      const { data, error } = await supabase
        .from('frames')
        .select('*')
        .eq('slyde_id', slydeId)
        .order('order', { ascending: true })
      
      if (error || !data) return []
      return data as Frame[]
    },
    
    async getFrame(frameId: string): Promise<Frame | null> {
      const { data, error } = await supabase
        .from('frames')
        .select('*')
        .eq('id', frameId)
        .single()
      
      if (error || !data) return null
      return data as Frame
    },
    
    async getFAQs(slydeId: string, frameId?: string): Promise<FAQ[]> {
      let query = supabase
        .from('faqs')
        .select('*')
        .eq('slyde_id', slydeId)
        .order('order', { ascending: true })
      
      if (frameId) {
        query = query.eq('frame_id', frameId)
      }
      
      const { data, error } = await query
      if (error || !data) return []
      return data as FAQ[]
    },
    
    async searchFAQs(slydeId: string, query: string): Promise<FAQ[]> {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('slyde_id', slydeId)
        .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
      
      if (error || !data) return []
      return data as FAQ[]
    },
    
    async getReviews(businessId: string, featuredOnly = false): Promise<Review[]> {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('business_id', businessId)
        .order('date', { ascending: false })
      
      if (featuredOnly) {
        query = query.eq('featured', true)
      }
      
      const { data, error } = await query
      if (error || !data) return []
      return data as Review[]
    },
    
    async getBusiness(businessSlug: string): Promise<Business | null> {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', businessSlug)
        .single()
      
      if (error || !data) return null
      return data as Business
    },
    
    // ─────────────────────────────────────────
    // User Interactions
    // ─────────────────────────────────────────
    
    async incrementHeart(frameId: string): Promise<number> {
      const { data, error } = await supabase.rpc('increment_heart', { frame_id: frameId })
      if (error) throw error
      return data || 0
    },
    
    async decrementHeart(frameId: string): Promise<number> {
      const { data, error } = await supabase.rpc('decrement_heart', { frame_id: frameId })
      if (error) throw error
      return Math.max(0, data || 0)
    },
    
    async submitQuestion(submission: QuestionSubmission): Promise<void> {
      const { error } = await supabase
        .from('questions')
        .insert({
          question: submission.question,
          frame_id: submission.frameId,
          slyde_id: submission.slydeId,
          business_id: submission.businessId,
          status: 'new',
        })
      
      if (error) throw error
    },
    
    // ─────────────────────────────────────────
    // Analytics
    // ─────────────────────────────────────────
    
    trackEvent(event: AnalyticsEvent): void {
      // POC: Log to console
      // Production: Send to analytics service (PostHog, Mixpanel, etc.)
      console.log('[Slydes Analytics]', event)
    },
  }
}
```

---

## Implementation: Static Adapter (for testing/demos)

```typescript
// src/lib/slydes/static-adapter.ts

import type { SlydesAPI } from './types'
import {
  campingFrames,
  justDriveFrames,
  campingFAQs,
  justDriveFAQs,
  wildtraxBusiness,
  wildtraxReviews,
} from '@/components/slyde-demo/frameData'

/**
 * Static adapter that uses existing demo data
 * Useful for testing, demos, or fallback
 */
export function createStaticAdapter(): SlydesAPI {
  const slydes = {
    camping: {
      id: 'camping',
      slydeId: 'camping',
      slug: 'camping',
      name: 'Camping',
      description: 'Land Rover + Rooftop Tent',
      accentColor: 'bg-red-600',
      frames: campingFrames.map((f) => ({ ...f, frameId: f.id })),
      faqs: campingFAQs.map((f) => ({ ...f, faqId: f.id, isGlobal: true })),
      business: { ...wildtraxBusiness, businessId: wildtraxBusiness.id },
    },
    'just-drive': {
      id: 'just-drive',
      slydeId: 'just-drive',
      slug: 'just-drive',
      name: 'Just Drive',
      description: 'Land Rover Day Hire',
      accentColor: 'bg-amber-600',
      frames: justDriveFrames.map((f) => ({ ...f, frameId: f.id })),
      faqs: justDriveFAQs.map((f) => ({ ...f, faqId: f.id, isGlobal: true })),
      business: { ...wildtraxBusiness, businessId: wildtraxBusiness.id },
    },
  }
  
  return {
    async getSlyde(businessSlug, slydeSlug) {
      return slydes[slydeSlug as keyof typeof slydes] || null
    },
    
    async getSlydes(businessSlug) {
      return Object.values(slydes)
    },
    
    async getFrames(slydeId) {
      const slyde = slydes[slydeId as keyof typeof slydes]
      return slyde?.frames || []
    },
    
    async getFrame(frameId) {
      for (const slyde of Object.values(slydes)) {
        const frame = slyde.frames.find(f => f.frameId === frameId)
        if (frame) return frame
      }
      return null
    },
    
    async getFAQs(slydeId, frameId) {
      const slyde = slydes[slydeId as keyof typeof slydes]
      return slyde?.faqs || []
    },
    
    async searchFAQs(slydeId, query) {
      const slyde = slydes[slydeId as keyof typeof slydes]
      if (!slyde) return []
      
      const lowerQuery = query.toLowerCase()
      return slyde.faqs.filter(
        f => f.question.toLowerCase().includes(lowerQuery) ||
             f.answer.toLowerCase().includes(lowerQuery)
      )
    },
    
    async getReviews(businessId, featuredOnly = false) {
      const reviews = wildtraxReviews.map(r => ({
        ...r,
        reviewId: r.id,
      }))
      
      return featuredOnly 
        ? reviews.filter(r => r.featured)
        : reviews
    },
    
    async getBusiness(businessSlug) {
      return {
        ...wildtraxBusiness,
        businessId: wildtraxBusiness.id,
      }
    },
    
    async incrementHeart(frameId) {
      console.log('[Static] incrementHeart', frameId)
      return 100
    },
    
    async decrementHeart(frameId) {
      console.log('[Static] decrementHeart', frameId)
      return 99
    },
    
    async submitQuestion(submission) {
      console.log('[Static] submitQuestion', submission)
    },
    
    trackEvent(event) {
      console.log('[Static Analytics]', event)
    },
  }
}
```

---

## React Context Provider

```typescript
// src/contexts/SlydesContext.tsx

'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { SlydesAPI } from '@/lib/slydes/types'
import { createSupabaseAdapter } from '@/lib/slydes/supabase-adapter'

const SlydesContext = createContext<SlydesAPI | null>(null)

interface SlydesProviderProps {
  children: ReactNode
  adapter?: SlydesAPI
}

export function SlydesProvider({ children, adapter }: SlydesProviderProps) {
  // Default to Supabase adapter
  const api = adapter || createSupabaseAdapter()
  
  return (
    <SlydesContext.Provider value={api}>
      {children}
    </SlydesContext.Provider>
  )
}

export function useSlydes(): SlydesAPI {
  const context = useContext(SlydesContext)
  if (!context) {
    throw new Error('useSlydes must be used within a SlydesProvider')
  }
  return context
}
```

---

## Usage Example

```typescript
// In a component
import { useSlydes } from '@/contexts/SlydesContext'

function MyComponent() {
  const api = useSlydes()
  
  useEffect(() => {
    async function loadSlyde() {
      const slyde = await api.getSlyde('wildtrax', 'camping')
      // Use slyde data...
    }
    loadSlyde()
  }, [api])
  
  const handleHeartTap = async (frameId: string) => {
    const newCount = await api.incrementHeart(frameId)
    api.trackEvent({ type: 'heartTap', frameId, hearted: true })
    // Update UI...
  }
  
  // ...
}
```

---

## Terminology Migration

| Old Term | New Term | Notes |
|----------|----------|-------|
| Slide | Frame | Vertical screen inside a Slyde |
| SlideData | FrameData | Data interface |
| slides[] | frames[] | Array property |
| slideId | frameId | ID field |
| World | Slyde | Shareable experience |
| WorldInfo | *(deleted)* | Camping/Just Drive are now separate Slydes |
| worldId | slydeId | ID field |
| slideView | frameView | Analytics event |
| slidesViewed | framesViewed | Analytics event |

---

*Created: Stage 0 of Slydes Demo Productization*
*Last Updated: December 14, 2025 (Canonical Frame terminology)*
