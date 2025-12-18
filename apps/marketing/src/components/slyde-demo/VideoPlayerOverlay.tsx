'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface VideoPlayerOverlayProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
}

// Parse video URLs and return embed-friendly format
function parseVideoUrl(url: string): { type: 'youtube' | 'vimeo' | 'cloudflare' | 'direct', embedUrl: string, videoId?: string } | null {
  if (!url) return null

  const trimmedUrl = url.trim()

  // YouTube patterns
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
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`
      }
    }
  }

  // Vimeo patterns
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
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`
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

/**
 * VideoPlayerOverlay - Full-screen video player for demo content
 *
 * Opens when user taps the Clapperboard icon in the action stack.
 * Supports YouTube, Vimeo, and direct video URLs.
 *
 * Design:
 * - Full-screen dark backdrop with blur
 * - Centered video player (16:9 aspect ratio)
 * - Close button top-right
 * - Tap outside to close
 */
export function VideoPlayerOverlay({ isOpen, onClose, videoUrl }: VideoPlayerOverlayProps) {
  const parsed = parseVideoUrl(videoUrl)

  // Build embed URL with autoplay
  const getEmbedUrl = () => {
    if (parsed?.type === 'youtube') {
      // Add autoplay and remove mute for demo videos (user-initiated)
      return parsed.embedUrl.replace('mute=1', 'mute=0')
    }
    if (parsed?.type === 'vimeo') {
      return parsed.embedUrl
    }
    // Direct video URL
    return videoUrl
  }

  const isDirectVideo = !parsed || (parsed.type !== 'youtube' && parsed.type !== 'vimeo')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Video container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl mx-4 aspect-video rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {isDirectVideo ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <iframe
                src={getEmbedUrl()}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                title="Demo Video"
                style={{ border: 'none' }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
