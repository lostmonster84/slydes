/**
 * Website Scraping Utilities
 *
 * Extracts business data from websites for demo generation.
 * Uses cheerio for HTML parsing - no browser required.
 */

import * as cheerio from 'cheerio'
import type {
  ScrapedBusiness,
  ScrapedService,
  ScrapedReview,
  ScrapeProgress,
} from '@/types/generator'
import type { SocialLinks } from '@/components/slyde-demo/frameData'

// ============================================
// CONFIGURATION
// ============================================

const FETCH_TIMEOUT = 30000 // 30 seconds
const MAX_PAGES_TO_SCRAPE = 10
const MIN_IMAGE_SIZE = 400 // pixels - filter out tiny images
const RATE_LIMIT_MS = 500 // 0.5 second between requests

// URLs we should never scrape
const BLOCKED_DOMAINS = [
  'google.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
  'amazon.com',
  'ebay.com',
]

// Common nav link patterns to identify service pages
const SERVICE_PAGE_PATTERNS = [
  /services/i,
  /products/i,
  /menu/i,
  /offerings/i,
  /what-we-do/i,
  /solutions/i,
  /packages/i,
  /pricing/i,
]

// Common about page patterns
const ABOUT_PAGE_PATTERNS = [/about/i, /our-story/i, /who-we-are/i, /team/i, /company/i]

// Common contact page patterns
const CONTACT_PAGE_PATTERNS = [/contact/i, /get-in-touch/i, /reach-us/i, /location/i]

// Common gallery page patterns
const GALLERY_PAGE_PATTERNS = [/gallery/i, /portfolio/i, /work/i, /projects/i, /photos/i]

// ============================================
// UTILITIES
// ============================================

/**
 * Sleep for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Validate URL is safe to scrape
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) return false

    const hostname = parsed.hostname.toLowerCase()
    if (BLOCKED_DOMAINS.some((domain) => hostname.includes(domain))) return false

    return true
  } catch {
    return false
  }
}

/**
 * Normalize URL to absolute path
 */
function normalizeUrl(url: string, baseUrl: string): string {
  try {
    return new URL(url, baseUrl).href
  } catch {
    return url
  }
}

/**
 * Extract domain from URL
 */
function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return ''
  }
}

/**
 * Fetch a page with timeout
 */
async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; SlydesBot/1.0; +https://slydes.io)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) return null
    return await response.text()
  } catch {
    return null
  }
}

// ============================================
// EXTRACTION FUNCTIONS
// ============================================

/**
 * Extract meta tags from HTML
 */
function extractMeta(
  $: cheerio.CheerioAPI
): {
  title: string
  description: string
  ogImage: string
  ogSiteName: string
} {
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('title').text() ||
    $('h1').first().text() ||
    ''

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    ''

  const ogImage = $('meta[property="og:image"]').attr('content') || ''
  const ogSiteName = $('meta[property="og:site_name"]').attr('content') || ''

  return {
    title: title.trim(),
    description: description.trim(),
    ogImage,
    ogSiteName: ogSiteName.trim(),
  }
}

/**
 * Extract all images from page
 */
function extractImages($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const images: string[] = []
  const seen = new Set<string>()

  // Get og:image first (usually best quality)
  const ogImage = $('meta[property="og:image"]').attr('content')
  if (ogImage) {
    const normalized = normalizeUrl(ogImage, baseUrl)
    if (!seen.has(normalized)) {
      images.push(normalized)
      seen.add(normalized)
    }
  }

  // Get all img tags
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src')
    if (!src) return

    // Skip tiny images (icons, logos, etc.) based on attribute
    const width = parseInt($(el).attr('width') || '0', 10)
    const height = parseInt($(el).attr('height') || '0', 10)
    if ((width > 0 && width < MIN_IMAGE_SIZE) || (height > 0 && height < MIN_IMAGE_SIZE)) return

    // Skip common tiny image patterns
    if (
      src.includes('icon') ||
      src.includes('logo') ||
      src.includes('avatar') ||
      src.includes('favicon') ||
      src.includes('1x1') ||
      src.includes('pixel')
    )
      return

    const normalized = normalizeUrl(src, baseUrl)
    if (!seen.has(normalized)) {
      images.push(normalized)
      seen.add(normalized)
    }
  })

  // Get background images from style attributes
  $('[style*="background"]').each((_, el) => {
    const style = $(el).attr('style') || ''
    const match = style.match(/url\(['"]?([^'")\s]+)['"]?\)/i)
    if (match && match[1]) {
      const normalized = normalizeUrl(match[1], baseUrl)
      if (!seen.has(normalized)) {
        images.push(normalized)
        seen.add(normalized)
      }
    }
  })

  return images
}

/**
 * Extract navigation links
 */
function extractNavLinks(
  $: cheerio.CheerioAPI,
  baseUrl: string
): Array<{ text: string; url: string }> {
  const links: Array<{ text: string; url: string }> = []
  const seen = new Set<string>()
  const baseDomain = getDomain(baseUrl)

  // Look for nav elements
  $('nav a, header a, [role="navigation"] a').each((_, el) => {
    const href = $(el).attr('href')
    const text = $(el).text().trim()

    if (!href || !text) return
    if (href.startsWith('#') || href.startsWith('javascript:')) return
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return

    const normalized = normalizeUrl(href, baseUrl)
    const linkDomain = getDomain(normalized)

    // Only include internal links
    if (linkDomain !== baseDomain) return

    if (!seen.has(normalized)) {
      links.push({ text, url: normalized })
      seen.add(normalized)
    }
  })

  return links
}

/**
 * Extract social media links
 */
function extractSocialLinks($: cheerio.CheerioAPI): SocialLinks {
  const social: SocialLinks = {}

  $('a[href*="instagram.com"]').each((_, el) => {
    social.instagram = $(el).attr('href') || undefined
  })
  $('a[href*="tiktok.com"]').each((_, el) => {
    social.tiktok = $(el).attr('href') || undefined
  })
  $('a[href*="facebook.com"]').each((_, el) => {
    social.facebook = $(el).attr('href') || undefined
  })
  $('a[href*="youtube.com"]').each((_, el) => {
    social.youtube = $(el).attr('href') || undefined
  })
  $('a[href*="twitter.com"], a[href*="x.com"]').each((_, el) => {
    social.twitter = $(el).attr('href') || undefined
  })
  $('a[href*="linkedin.com"]').each((_, el) => {
    social.linkedin = $(el).attr('href') || undefined
  })

  return social
}

/**
 * Extract YouTube video IDs from page
 */
function extractYouTubeVideos($: cheerio.CheerioAPI): string[] {
  const videos: string[] = []
  const seen = new Set<string>()

  // YouTube iframes
  $('iframe[src*="youtube.com"], iframe[src*="youtu.be"]').each((_, el) => {
    const src = $(el).attr('src') || ''
    const match = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (match && match[1] && !seen.has(match[1])) {
      videos.push(`https://www.youtube.com/embed/${match[1]}`)
      seen.add(match[1])
    }
  })

  // YouTube links
  $('a[href*="youtube.com/watch"], a[href*="youtu.be"]').each((_, el) => {
    const href = $(el).attr('href') || ''
    const match = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (match && match[1] && !seen.has(match[1])) {
      videos.push(`https://www.youtube.com/embed/${match[1]}`)
      seen.add(match[1])
    }
  })

  // data-video-id attributes
  $('[data-video-id]').each((_, el) => {
    const videoId = $(el).attr('data-video-id')
    if (videoId && videoId.length === 11 && !seen.has(videoId)) {
      videos.push(`https://www.youtube.com/embed/${videoId}`)
      seen.add(videoId)
    }
  })

  return videos
}

/**
 * Extract Vimeo video IDs from page
 */
function extractVimeoVideos($: cheerio.CheerioAPI): string[] {
  const videos: string[] = []
  const seen = new Set<string>()

  $('iframe[src*="vimeo.com"]').each((_, el) => {
    const src = $(el).attr('src') || ''
    const match = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    if (match && match[1] && !seen.has(match[1])) {
      videos.push(`https://player.vimeo.com/video/${match[1]}`)
      seen.add(match[1])
    }
  })

  return videos
}

/**
 * Extract contact information
 */
function extractContactInfo($: cheerio.CheerioAPI): {
  phone?: string
  email?: string
  address?: string
} {
  const result: { phone?: string; email?: string; address?: string } = {}

  // Phone - look for tel: links
  $('a[href^="tel:"]').each((_, el) => {
    if (!result.phone) {
      result.phone = $(el).attr('href')?.replace('tel:', '') || undefined
    }
  })

  // Email - look for mailto: links
  $('a[href^="mailto:"]').each((_, el) => {
    if (!result.email) {
      result.email = $(el).attr('href')?.replace('mailto:', '').split('?')[0] || undefined
    }
  })

  // Address - look for address tag or schema.org markup
  const addressEl = $('address').first()
  if (addressEl.length) {
    result.address = addressEl.text().trim().replace(/\s+/g, ' ')
  }

  // Try schema.org address
  $('[itemprop="address"]').each((_, el) => {
    if (!result.address) {
      result.address = $(el).text().trim().replace(/\s+/g, ' ')
    }
  })

  return result
}

/**
 * Extract reviews/testimonials
 */
function extractReviews($: cheerio.CheerioAPI): ScrapedReview[] {
  const reviews: ScrapedReview[] = []

  // Look for common review patterns
  $('[class*="review"], [class*="testimonial"], [class*="feedback"]').each((_, el) => {
    const text = $(el).find('p, [class*="text"], [class*="content"]').first().text().trim()
    const author =
      $(el).find('[class*="author"], [class*="name"], cite').first().text().trim() || 'Customer'

    // Look for star rating
    const stars = $(el).find('[class*="star"], [class*="rating"]')
    let rating: number | undefined
    if (stars.length) {
      // Try to extract rating from class or text
      const ratingText = stars.text()
      const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*5|stars?)?/i)
      if (ratingMatch) {
        rating = parseFloat(ratingMatch[1])
      }
    }

    if (text && text.length > 20 && text.length < 500) {
      reviews.push({ text, author, rating })
    }
  })

  // Schema.org reviews
  $('[itemprop="review"]').each((_, el) => {
    const text = $(el).find('[itemprop="reviewBody"]').text().trim()
    const author = $(el).find('[itemprop="author"]').text().trim() || 'Customer'
    const ratingValue = $(el).find('[itemprop="ratingValue"]').attr('content')
    const rating = ratingValue ? parseFloat(ratingValue) : undefined

    if (text && text.length > 20 && text.length < 500) {
      reviews.push({ text, author, rating })
    }
  })

  return reviews.slice(0, 10) // Max 10 reviews
}

/**
 * Extract brand colors from CSS
 */
function extractBrandColors($: cheerio.CheerioAPI): { primary: string; secondary?: string } {
  let primary = '#2563EB' // Default blue
  let secondary: string | undefined

  // Look for CSS custom properties
  $('style').each((_, el) => {
    const css = $(el).text()

    // Look for --primary, --brand, --accent color variables
    const primaryMatch = css.match(
      /--(?:primary|brand|accent|main)(?:-color)?:\s*(#[a-fA-F0-9]{3,6})/i
    )
    if (primaryMatch) {
      primary = primaryMatch[1]
    }

    const secondaryMatch = css.match(/--(?:secondary)(?:-color)?:\s*(#[a-fA-F0-9]{3,6})/i)
    if (secondaryMatch) {
      secondary = secondaryMatch[1]
    }
  })

  // If no CSS variables, try to extract from buttons/CTAs
  if (primary === '#2563EB') {
    $('button, .btn, [class*="cta"], [class*="button"]').each((_, el) => {
      const style = $(el).attr('style') || ''
      const bgMatch = style.match(/background(?:-color)?:\s*(#[a-fA-F0-9]{3,6})/i)
      if (bgMatch) {
        primary = bgMatch[1]
        return false // Stop after first match
      }
    })
  }

  return { primary, secondary }
}

/**
 * Convert hex color to Tailwind-like class
 */
export function hexToTailwindClass(hex: string): string {
  // Basic color mapping - could be more sophisticated
  const color = hex.toLowerCase()

  // Common brand colors
  if (color.includes('25') && color.includes('63') && color.includes('eb')) return 'bg-blue-600'
  if (color.includes('dc') && color.includes('26') && color.includes('26')) return 'bg-red-600'
  if (color.includes('16') && color.includes('a3') && color.includes('4a')) return 'bg-green-600'
  if (color.includes('ca') && color.includes('85') && color.includes('00')) return 'bg-amber-500'
  if (color.includes('79') && color.includes('29') && color.includes('be')) return 'bg-purple-600'
  if (color.includes('06') && color.includes('b6') && color.includes('d4')) return 'bg-cyan-500'

  // Default to blue
  return 'bg-blue-600'
}

/**
 * Extract main content text from page
 */
function extractMainContent($: cheerio.CheerioAPI): string {
  // Remove script, style, nav, header, footer
  $('script, style, nav, header, footer, aside').remove()

  // Get main content area
  const main = $('main, article, [role="main"], .content, #content').first()
  if (main.length) {
    return main.text().trim().replace(/\s+/g, ' ').slice(0, 2000)
  }

  // Fall back to body
  return $('body').text().trim().replace(/\s+/g, ' ').slice(0, 2000)
}

// ============================================
// MAIN SCRAPING FUNCTION
// ============================================

/**
 * Scrape a business website and extract all relevant data
 */
export async function scrapeBusiness(
  url: string,
  onProgress?: (progress: ScrapeProgress) => void
): Promise<ScrapedBusiness> {
  if (!isValidUrl(url)) {
    throw new Error('Invalid or blocked URL')
  }

  const baseUrl = new URL(url).origin
  let pagesScraped = 0

  // Initialize result
  const result: ScrapedBusiness = {
    name: '',
    tagline: '',
    location: '',
    industry: '',
    logo: '',
    heroImages: [],
    galleryImages: [],
    youtubeVideos: [],
    vimeoVideos: [],
    aboutText: '',
    valueProps: [],
    services: [],
    reviews: [],
    testimonials: [],
    credentials: [],
    socialLinks: {},
    primaryColor: '#2563EB',
    sourceUrl: url,
    scrapedAt: new Date().toISOString(),
    pagesScraped: 0,
  }

  // 1. Scrape homepage
  onProgress?.({
    stage: 'homepage',
    pagesScraped: 0,
    totalPages: MAX_PAGES_TO_SCRAPE,
    currentUrl: url,
  })

  const homepageHtml = await fetchPage(url)
  if (!homepageHtml) {
    throw new Error('Failed to fetch homepage')
  }

  const $ = cheerio.load(homepageHtml)
  pagesScraped++

  // Extract basic info from homepage
  const meta = extractMeta($)
  result.name = meta.ogSiteName || meta.title.split('|')[0].split('-')[0].trim()
  result.tagline = meta.description
  result.heroImages = extractImages($, url)
  result.socialLinks = extractSocialLinks($)
  result.youtubeVideos = extractYouTubeVideos($)
  result.vimeoVideos = extractVimeoVideos($)

  const colors = extractBrandColors($)
  result.primaryColor = colors.primary

  const contact = extractContactInfo($)
  result.phone = contact.phone
  result.email = contact.email
  result.address = contact.address

  result.reviews = extractReviews($)

  // Get nav links for further scraping
  const navLinks = extractNavLinks($, url)

  // 2. Find and scrape service pages
  const servicePagesToScrape = navLinks.filter((link) =>
    SERVICE_PAGE_PATTERNS.some((pattern) => pattern.test(link.url) || pattern.test(link.text))
  )

  onProgress?.({
    stage: 'services',
    pagesScraped,
    totalPages: MAX_PAGES_TO_SCRAPE,
  })

  for (const serviceLink of servicePagesToScrape.slice(0, 4)) {
    if (pagesScraped >= MAX_PAGES_TO_SCRAPE) break

    await sleep(RATE_LIMIT_MS)
    const serviceHtml = await fetchPage(serviceLink.url)
    if (!serviceHtml) continue

    pagesScraped++
    const $service = cheerio.load(serviceHtml)

    const serviceMeta = extractMeta($service)
    const serviceImages = extractImages($service, serviceLink.url)
    const serviceContent = extractMainContent($service)

    // Look for price on page
    const priceMatch = serviceContent.match(/(?:£|\$|€)\s*\d+(?:\.\d{2})?(?:\s*\/\s*\w+)?/i)

    const service: ScrapedService = {
      name: serviceLink.text || serviceMeta.title,
      description: serviceMeta.description || serviceContent.slice(0, 200),
      images: serviceImages,
      price: priceMatch?.[0],
      url: serviceLink.url,
    }

    result.services.push(service)
    result.galleryImages.push(...serviceImages)

    // Get more videos
    result.youtubeVideos.push(...extractYouTubeVideos($service))
    result.vimeoVideos.push(...extractVimeoVideos($service))
  }

  // 3. Find and scrape about page
  const aboutPage = navLinks.find((link) =>
    ABOUT_PAGE_PATTERNS.some((pattern) => pattern.test(link.url) || pattern.test(link.text))
  )

  onProgress?.({
    stage: 'about',
    pagesScraped,
    totalPages: MAX_PAGES_TO_SCRAPE,
  })

  if (aboutPage && pagesScraped < MAX_PAGES_TO_SCRAPE) {
    await sleep(RATE_LIMIT_MS)
    const aboutHtml = await fetchPage(aboutPage.url)
    if (aboutHtml) {
      pagesScraped++
      const $about = cheerio.load(aboutHtml)
      result.aboutText = extractMainContent($about)
      result.galleryImages.push(...extractImages($about, aboutPage.url))
    }
  }

  // 4. Find and scrape contact page
  const contactPage = navLinks.find((link) =>
    CONTACT_PAGE_PATTERNS.some((pattern) => pattern.test(link.url) || pattern.test(link.text))
  )

  onProgress?.({
    stage: 'contact',
    pagesScraped,
    totalPages: MAX_PAGES_TO_SCRAPE,
  })

  if (contactPage && pagesScraped < MAX_PAGES_TO_SCRAPE) {
    await sleep(RATE_LIMIT_MS)
    const contactHtml = await fetchPage(contactPage.url)
    if (contactHtml) {
      pagesScraped++
      const $contact = cheerio.load(contactHtml)
      const contactInfo = extractContactInfo($contact)
      result.phone = result.phone || contactInfo.phone
      result.email = result.email || contactInfo.email
      result.address = result.address || contactInfo.address
      if (result.address) {
        // Try to extract location from address
        result.location = result.address.split(',').slice(-2).join(',').trim()
      }
    }
  }

  // 5. Find and scrape gallery page
  const galleryPage = navLinks.find((link) =>
    GALLERY_PAGE_PATTERNS.some((pattern) => pattern.test(link.url) || pattern.test(link.text))
  )

  onProgress?.({
    stage: 'gallery',
    pagesScraped,
    totalPages: MAX_PAGES_TO_SCRAPE,
  })

  if (galleryPage && pagesScraped < MAX_PAGES_TO_SCRAPE) {
    await sleep(RATE_LIMIT_MS)
    const galleryHtml = await fetchPage(galleryPage.url)
    if (galleryHtml) {
      pagesScraped++
      const $gallery = cheerio.load(galleryHtml)
      const galleryImages = extractImages($gallery, galleryPage.url)
      result.galleryImages.push(...galleryImages)
      result.youtubeVideos.push(...extractYouTubeVideos($gallery))
    }
  }

  // Deduplicate images and videos
  result.heroImages = [...new Set(result.heroImages)]
  result.galleryImages = [...new Set(result.galleryImages)]
  result.youtubeVideos = [...new Set(result.youtubeVideos)]
  result.vimeoVideos = [...new Set(result.vimeoVideos)]

  // Try to determine industry from content
  const allContent = `${result.name} ${result.tagline} ${result.aboutText}`.toLowerCase()
  if (allContent.includes('restaurant') || allContent.includes('food') || allContent.includes('menu'))
    result.industry = 'restaurant'
  else if (allContent.includes('salon') || allContent.includes('hair') || allContent.includes('beauty'))
    result.industry = 'salon'
  else if (allContent.includes('hotel') || allContent.includes('accommodation') || allContent.includes('stay'))
    result.industry = 'accommodation'
  else if (allContent.includes('rental') || allContent.includes('hire'))
    result.industry = 'rentals'
  else if (allContent.includes('tour') || allContent.includes('experience') || allContent.includes('adventure'))
    result.industry = 'tours'
  else if (allContent.includes('gym') || allContent.includes('fitness') || allContent.includes('workout'))
    result.industry = 'fitness'
  else if (allContent.includes('shop') || allContent.includes('store') || allContent.includes('product'))
    result.industry = 'retail'
  else result.industry = 'other'

  result.pagesScraped = pagesScraped

  onProgress?.({
    stage: 'complete',
    pagesScraped,
    totalPages: pagesScraped,
  })

  return result
}
