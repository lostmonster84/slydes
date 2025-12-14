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
