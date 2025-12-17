'use client'

import { useState, useRef } from 'react'
import { Upload, Link2, X, Loader2, Youtube, Film, Image as ImageIcon, Video } from 'lucide-react'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { VIDEO_FILTERS, VIDEO_SPEEDS, type VideoFilterPreset, type VideoSpeedPreset } from '@/lib/videoFilters'
import type { BackgroundType } from '@/lib/demoHomeSlyde'

// Re-export parseVideoUrl from VideoMediaInput for backwards compatibility
export { parseVideoUrl } from './VideoMediaInput'

interface BackgroundMediaInputProps {
  // Background type
  backgroundType: BackgroundType
  onBackgroundTypeChange: (type: BackgroundType) => void

  // Video props
  videoSrc: string
  onVideoSrcChange: (src: string) => void

  // Image props
  imageSrc?: string
  onImageSrcChange?: (src: string) => void

  // Filter props (apply to both video and image)
  filter?: VideoFilterPreset
  onFilterChange?: (filter: VideoFilterPreset) => void
  vignette?: boolean
  onVignetteChange?: (vignette: boolean) => void

  // Speed props (video only)
  speed?: VideoSpeedPreset
  onSpeedChange?: (speed: VideoSpeedPreset) => void

  // UI options
  showFilters?: boolean
  className?: string
}

/**
 * BackgroundMediaInput - Unified component for Home Slyde background
 *
 * Features:
 * - Toggle between Video and Image background types
 * - Video: URL paste, YouTube/Vimeo detection, file upload
 * - Image: URL paste, file upload
 * - Cinematic filters (both)
 * - Vignette toggle (both)
 * - Speed control (video only)
 */
export function BackgroundMediaInput({
  backgroundType,
  onBackgroundTypeChange,
  videoSrc,
  onVideoSrcChange,
  imageSrc = '',
  onImageSrcChange,
  filter = 'original',
  onFilterChange,
  vignette = false,
  onVignetteChange,
  speed = 'normal',
  onSpeedChange,
  showFilters = true,
  className = '',
}: BackgroundMediaInputProps) {
  const [isUploading, setIsUploading] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { uploadVideo, uploadImage, videoStatus, videoProgress, imageStatus } = useMediaUpload()

  const isVideo = backgroundType === 'video'

  // Handle video file upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const result = await uploadVideo(file)
      if (result?.playback?.hls) {
        onVideoSrcChange(result.playback.hls)
      }
    } catch (error) {
      console.error('Video upload failed:', error)
    } finally {
      setIsUploading(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImageSrcChange) return

    setIsUploading(true)
    try {
      const result = await uploadImage(file)
      if (result?.url) {
        onImageSrcChange(result.url)
      }
    } catch (error) {
      console.error('Image upload failed:', error)
    } finally {
      setIsUploading(false)
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  const handleFilterSelect = (preset: VideoFilterPreset) => {
    onFilterChange?.(preset)
    // Auto-enable vignette based on preset default
    const filterConfig = VIDEO_FILTERS.find(f => f.id === preset)
    if (filterConfig && onVignetteChange) {
      onVignetteChange(filterConfig.defaultVignette)
    }
  }

  const isProcessing = isUploading || videoStatus === 'uploading' || videoStatus === 'processing' || imageStatus === 'uploading'

  return (
    <div className={className}>
      {/* Background Type Toggle */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-2">
          Background
        </label>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
          <button
            onClick={() => onBackgroundTypeChange('video')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              isVideo
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
            }`}
          >
            <Video className="w-4 h-4" />
            Video
          </button>
          <button
            onClick={() => onBackgroundTypeChange('image')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              !isVideo
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
        </div>
      </div>

      {/* Video Input */}
      {isVideo && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={videoSrc}
                onChange={(e) => onVideoSrcChange(e.target.value)}
                placeholder="Paste YouTube, Vimeo, or video URL..."
                disabled={isProcessing}
                className="w-full px-3 py-2 pr-10 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
              />
              {videoSrc && (
                <button
                  onClick={() => onVideoSrcChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-white/70"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => videoInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-300 dark:border-white/15 rounded-lg text-gray-700 dark:text-white/70 transition-colors disabled:opacity-50"
              title="Upload video"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </div>

          {/* Upload progress */}
          {isProcessing && (
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/50 mb-1">
                <span>
                  {videoStatus === 'uploading' ? 'Uploading...' : videoStatus === 'processing' ? 'Processing...' : 'Preparing...'}
                </span>
                {videoProgress > 0 && <span>{videoProgress}%</span>}
              </div>
              <div className="h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${videoProgress}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Input */}
      {!isVideo && onImageSrcChange && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={imageSrc}
                onChange={(e) => onImageSrcChange(e.target.value)}
                placeholder="Paste image URL..."
                disabled={isProcessing}
                className="w-full px-3 py-2 pr-10 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
              />
              {imageSrc && (
                <button
                  onClick={() => onImageSrcChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-white/70"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => imageInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-300 dark:border-white/15 rounded-lg text-gray-700 dark:text-white/70 transition-colors disabled:opacity-50"
              title="Upload image"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Image preview */}
          {imageSrc && (
            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5">
              <img src={imageSrc} alt="Background preview" className="w-full h-full object-cover" />
            </div>
          )}

          <p className="text-[11px] text-gray-500 dark:text-white/40">
            No video? A high-quality photo works great too.
          </p>
        </div>
      )}

      {/* Filter Presets */}
      {showFilters && onFilterChange && (
        <div className="mt-4">
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

          {/* Speed control - only for video */}
          {isVideo && onSpeedChange && (
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
    </div>
  )
}
