/**
 * Cloudflare Media URL Helpers
 *
 * Generate URLs for Cloudflare Stream videos and Images.
 * These use public delivery URLs - no auth required for viewing.
 */

// Get from env or use placeholder
const CF_ACCOUNT_HASH = process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH || 'your-account-hash'
const CF_IMAGES_ACCOUNT_HASH = process.env.NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH || CF_ACCOUNT_HASH

/**
 * Get HLS playback URL for a Cloudflare Stream video
 */
export function getStreamHlsUrl(videoUid: string): string {
  return `https://customer-${CF_ACCOUNT_HASH}.cloudflarestream.com/${videoUid}/manifest/video.m3u8`
}

/**
 * Get thumbnail URL for a Cloudflare Stream video
 */
export function getStreamThumbnailUrl(videoUid: string, options?: {
  time?: string  // e.g., '1s', '5s', '10%'
  height?: number
  width?: number
  fit?: 'crop' | 'clip' | 'scale'
}): string {
  const params = new URLSearchParams()
  if (options?.time) params.set('time', options.time)
  if (options?.height) params.set('height', String(options.height))
  if (options?.width) params.set('width', String(options.width))
  if (options?.fit) params.set('fit', options.fit)

  const query = params.toString()
  return `https://customer-${CF_ACCOUNT_HASH}.cloudflarestream.com/${videoUid}/thumbnails/thumbnail.jpg${query ? `?${query}` : ''}`
}

/**
 * Get animated GIF preview for a Cloudflare Stream video
 */
export function getStreamGifUrl(videoUid: string, options?: {
  duration?: string  // e.g., '4s'
  height?: number
  width?: number
  fps?: number
  start?: string  // e.g., '1s'
}): string {
  const params = new URLSearchParams()
  if (options?.duration) params.set('duration', options.duration)
  if (options?.height) params.set('height', String(options.height))
  if (options?.width) params.set('width', String(options.width))
  if (options?.fps) params.set('fps', String(options.fps))
  if (options?.start) params.set('start', options.start)

  const query = params.toString()
  return `https://customer-${CF_ACCOUNT_HASH}.cloudflarestream.com/${videoUid}/thumbnails/thumbnail.gif${query ? `?${query}` : ''}`
}

/**
 * Get Cloudflare Images URL with variant
 *
 * Variants are configured in Cloudflare dashboard:
 * - public: Original size
 * - thumbnail: Small preview
 * - hero: Full-width hero image
 */
export function getImageUrl(imageId: string, variant: string = 'public'): string {
  return `https://imagedelivery.net/${CF_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`
}

/**
 * Type guard to check if a URL is a Cloudflare Stream URL
 */
export function isStreamUrl(url: string): boolean {
  return url.includes('cloudflarestream.com')
}

/**
 * Type guard to check if a URL is a Cloudflare Images URL
 */
export function isImagesUrl(url: string): boolean {
  return url.includes('imagedelivery.net')
}

/**
 * Extract video UID from a Cloudflare Stream URL
 */
export function extractStreamUid(url: string): string | null {
  const match = url.match(/cloudflarestream\.com\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

/**
 * Extract image ID from a Cloudflare Images URL
 */
export function extractImageId(url: string): string | null {
  const match = url.match(/imagedelivery\.net\/[^/]+\/([^/]+)/)
  return match ? match[1] : null
}
