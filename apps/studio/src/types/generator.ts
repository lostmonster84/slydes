/**
 * URL to Demo Slyde Generator Types
 *
 * Types for the dev-only tool that scrapes business websites
 * and generates complete, sellable demo Slydes.
 */

import type { DemoHomeSlydeCategory } from '@/lib/demoHomeSlyde'
import type { FAQItem, FrameData, SocialLinks } from '@/components/slyde-demo/frameData'

// ============================================
// SCRAPED DATA TYPES
// ============================================

/**
 * Service/offering found on the website
 */
export interface ScrapedService {
  name: string
  description: string
  images: string[]
  price?: string
  url: string // Link back to their page
}

/**
 * Review/testimonial found on the website
 */
export interface ScrapedReview {
  text: string
  author: string
  rating?: number
  source?: string
}

/**
 * All data scraped from a business website
 */
export interface ScrapedBusiness {
  // Identity
  name: string
  tagline: string
  location: string
  industry: string

  // Visual assets
  logo: string
  heroImages: string[] // All large images found
  galleryImages: string[] // Portfolio/gallery images
  youtubeVideos: string[] // Embeddable video URLs
  vimeoVideos: string[] // Vimeo video URLs

  // Content
  aboutText: string
  valueProps: string[] // Key selling points
  services: ScrapedService[]

  // Social proof
  reviews: ScrapedReview[]
  testimonials: string[]
  credentials: string[] // Awards, certifications

  // Contact
  phone?: string
  email?: string
  address?: string
  socialLinks: SocialLinks

  // Brand
  primaryColor: string // Extracted from CSS (hex)
  secondaryColor?: string

  // Metadata
  sourceUrl: string
  scrapedAt: string
  pagesScraped: number
}

// ============================================
// GENERATED DEMO TYPES
// ============================================

/**
 * Brand identity for the generated demo
 */
export interface GeneratedBrand {
  name: string
  tagline: string
  location: string
  accentColor: string // Tailwind class like 'bg-blue-600'
}

/**
 * Home Slyde configuration for the generated demo
 */
export interface GeneratedHomeSlyde {
  backgroundImage: string // Best hero image
  backgroundVideo?: string // YouTube/Vimeo if available
  categories: DemoHomeSlydeCategory[]
}

/**
 * A single category Slyde with frames and FAQs
 */
export interface GeneratedCategorySlyde {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryDescription: string
  frames: FrameData[] // 3-6 frames each
  faqs: FAQItem[] // 3-5 FAQs each
}

/**
 * Quality assessment of the generated demo
 */
export type GeneratedQuality = 'high' | 'medium' | 'low'

/**
 * Complete generated demo ready to load into editor
 */
export interface GeneratedDemo {
  brand: GeneratedBrand
  homeSlyde: GeneratedHomeSlyde
  categorySlydes: GeneratedCategorySlyde[]

  // Metadata
  sourceUrl: string
  generatedAt: string
  quality: GeneratedQuality
  qualityNotes: string[] // Warnings or issues found
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

/**
 * Request body for /api/dev/scrape-business
 */
export interface ScrapeBusinessRequest {
  url: string
}

/**
 * Response from /api/dev/scrape-business
 */
export interface ScrapeBusinessResponse {
  ok: boolean
  data?: ScrapedBusiness
  error?: string
  progress?: ScrapeProgress
}

/**
 * Progress updates during scraping
 */
export interface ScrapeProgress {
  stage: 'homepage' | 'services' | 'about' | 'contact' | 'gallery' | 'videos' | 'complete'
  pagesScraped: number
  totalPages: number
  currentUrl?: string
}

/**
 * Request body for /api/dev/generate-slyde-content
 */
export interface GenerateSlydeContentRequest {
  scrapedBusiness: ScrapedBusiness
}

/**
 * Response from /api/dev/generate-slyde-content
 */
export interface GenerateSlydeContentResponse {
  ok: boolean
  data?: GeneratedDemo
  error?: string
}

// ============================================
// UI STATE TYPES
// ============================================

/**
 * Overall generation progress for the UI
 */
export type GeneratorStage =
  | 'idle'
  | 'scraping'
  | 'analyzing'
  | 'generating'
  | 'complete'
  | 'error'

/**
 * Full state for the URL to Slyde generator component
 */
export interface GeneratorState {
  stage: GeneratorStage
  url: string
  scrapeProgress?: ScrapeProgress
  scrapedBusiness?: ScrapedBusiness
  generatedDemo?: GeneratedDemo
  error?: string
}

// ============================================
// VALIDATION TYPES
// ============================================

/**
 * Validation result for generated demo quality
 */
export interface ValidationResult {
  isValid: boolean
  quality: GeneratedQuality
  checks: ValidationCheck[]
}

/**
 * Individual validation check
 */
export interface ValidationCheck {
  name: string
  passed: boolean
  message?: string
}
