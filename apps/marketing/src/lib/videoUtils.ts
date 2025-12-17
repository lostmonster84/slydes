// Parse video URLs and return embed-friendly format
export function parseVideoUrl(url: string): { type: 'youtube' | 'vimeo' | 'cloudflare' | 'direct', embedUrl: string, videoId?: string } | null {
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

  // Direct video URL (mp4, webm, mov, etc.)
  if (trimmedUrl.match(/\.(mp4|webm|mov|m4v|ogg)($|\?)/i) || trimmedUrl.startsWith('http')) {
    return {
      type: 'direct',
      embedUrl: trimmedUrl
    }
  }

  return null
}
