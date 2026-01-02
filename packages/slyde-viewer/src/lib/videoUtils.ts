/**
 * Video URL parsing utilities
 *
 * Parse video URLs from various sources (YouTube, Vimeo, Cloudflare, direct)
 * and return embed-friendly formats.
 */

export type VideoUrlType = 'youtube' | 'vimeo' | 'cloudflare' | 'direct'

export interface ParsedVideoUrl {
  type: VideoUrlType
  embedUrl: string
  videoId?: string
}

/**
 * Parse video URLs and return embed-friendly format
 */
export function parseVideoUrl(url: string): ParsedVideoUrl | null {
  if (!url) return null

  const trimmedUrl = url.trim()

  // YouTube patterns
  // - youtube.com/watch?v=VIDEO_ID
  // - youtu.be/VIDEO_ID
  // - youtube.com/embed/VIDEO_ID
  // - youtube.com/shorts/VIDEO_ID
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of youtubePatterns) {
    const match = trimmedUrl.match(pattern)
    if (match) {
      const videoId = match[1]
      return {
        type: 'youtube',
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
      }
    }
  }

  // Vimeo patterns
  // - vimeo.com/VIDEO_ID
  // - player.vimeo.com/video/VIDEO_ID
  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ]

  for (const pattern of vimeoPatterns) {
    const match = trimmedUrl.match(pattern)
    if (match) {
      const videoId = match[1]
      return {
        type: 'vimeo',
        videoId,
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&autopause=0`
      }
    }
  }

  // Cloudflare Stream
  if (trimmedUrl.includes('videodelivery.net') || trimmedUrl.includes('cloudflarestream.com')) {
    return {
      type: 'cloudflare',
      embedUrl: trimmedUrl
    }
  }

  // Direct video URL (mp4, webm, mov, m4v, ogg, etc.)
  if (trimmedUrl.match(/\.(mp4|webm|mov|m4v|ogg)($|\?)/i) || trimmedUrl.startsWith('http')) {
    return {
      type: 'direct',
      embedUrl: trimmedUrl
    }
  }

  return null
}

/**
 * Get display-friendly URL type name
 */
export function getVideoUrlType(url: string): string {
  const parsed = parseVideoUrl(url)
  if (!parsed) return 'Unknown'

  switch (parsed.type) {
    case 'youtube': return 'YouTube'
    case 'vimeo': return 'Vimeo'
    case 'cloudflare': return 'Cloudflare'
    case 'direct': return 'Direct'
    default: return 'Video'
  }
}
