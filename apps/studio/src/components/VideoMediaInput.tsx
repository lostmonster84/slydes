'use client'

import { useState, useRef } from 'react'
import { Upload, Link2, X, Loader2, Youtube, Film } from 'lucide-react'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { VIDEO_FILTERS, VIDEO_SPEEDS, type VideoFilterPreset, type VideoSpeedPreset } from '@/lib/videoFilters'

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

// Get display-friendly URL type
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

interface VideoMediaInputProps {
  value: string
  onChange: (value: string) => void
  filter?: VideoFilterPreset
  onFilterChange?: (filter: VideoFilterPreset) => void
  vignette?: boolean
  onVignetteChange?: (vignette: boolean) => void
  speed?: VideoSpeedPreset
  onSpeedChange?: (speed: VideoSpeedPreset) => void
  placeholder?: string
  label?: string
  showLabel?: boolean
  showFilters?: boolean
  className?: string
}

export function VideoMediaInput({
  value,
  onChange,
  filter = 'original',
  onFilterChange,
  vignette = false,
  onVignetteChange,
  speed = 'normal',
  onSpeedChange,
  placeholder = 'Paste YouTube, Vimeo, or video URL...',
  label = 'Video',
  showLabel = true,
  showFilters = true,
  className = '',
}: VideoMediaInputProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadVideo, videoStatus, videoProgress } = useMediaUpload()

  const parsedVideo = value ? parseVideoUrl(value) : null

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const result = await uploadVideo(file)
      if (result?.playback?.hls) {
        // Use the HLS URL for Cloudflare Stream videos
        onChange(result.playback.hls)
      }
    } catch (error) {
      console.error('Video upload failed:', error)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    onChange(newUrl)
  }

  const handleClear = () => {
    onChange('')
  }

  const handleFilterSelect = (preset: VideoFilterPreset) => {
    onFilterChange?.(preset)
    // Auto-enable vignette based on preset default
    const filterConfig = VIDEO_FILTERS.find(f => f.id === preset)
    if (filterConfig && onVignetteChange) {
      onVignetteChange(filterConfig.defaultVignette)
    }
  }

  const isProcessing = isUploading || videoStatus === 'uploading' || videoStatus === 'processing'

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="flex gap-2">
          {/* URL Input with type indicator */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={value}
              onChange={handleUrlChange}
              placeholder={placeholder}
              disabled={isProcessing}
              className="w-full px-3 py-2 pr-20 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            />

            {/* Type indicator badge */}
            {value && parsedVideo && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {parsedVideo.type === 'youtube' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded text-[10px] font-medium">
                    <Youtube className="w-3 h-3" />
                    YT
                  </span>
                )}
                {parsedVideo.type === 'vimeo' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 rounded text-[10px] font-medium">
                    <Film className="w-3 h-3" />
                    Vimeo
                  </span>
                )}
                {(parsedVideo.type === 'cloudflare' || parsedVideo.type === 'direct') && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded text-[10px] font-medium">
                    <Link2 className="w-3 h-3" />
                  </span>
                )}
                <button
                  onClick={handleClear}
                  className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-white/70"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-3 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-300 dark:border-white/15 rounded-lg text-gray-700 dark:text-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload video"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Upload progress */}
        {isProcessing && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/50 mb-1">
              <span>
                {videoStatus === 'uploading' ? 'Uploading...' : videoStatus === 'processing' ? 'Processing...' : 'Preparing...'}
              </span>
              {videoProgress > 0 && <span>{videoProgress}%</span>}
            </div>
            <div className="h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter Presets */}
      {showFilters && onFilterChange && (
        <div className="mt-3">
          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-2">
            Style
          </label>
          <div className="flex flex-wrap gap-1.5">
            {VIDEO_FILTERS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleFilterSelect(preset.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  filter === preset.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Vignette toggle */}
          {onVignetteChange && (
            <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={vignette}
                onChange={(e) => onVignetteChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 bg-white dark:bg-white/10"
              />
              <span className="text-xs text-gray-600 dark:text-white/60">
                Vignette (darkened edges)
              </span>
            </label>
          )}

          {/* Speed control */}
          {onSpeedChange && (
            <div className="mt-3">
              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-2">
                Speed
              </label>
              <div className="flex flex-wrap gap-1.5">
                {VIDEO_SPEEDS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSpeedChange(preset.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                      speed === preset.id
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help text - only show when filters are hidden */}
      {!showFilters && (
        <p className="mt-1.5 text-[11px] text-gray-400 dark:text-white/40">
          Paste a YouTube, Vimeo, or direct video URL, or upload a file
        </p>
      )}
    </div>
  )
}
