'use client'

import { useState, useRef } from 'react'
import { Upload, Link2, X, Loader2, Youtube, Film, Image as ImageIcon, Video, Scissors } from 'lucide-react'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { VIDEO_FILTERS, VIDEO_SPEEDS, type VideoFilterPreset, type VideoSpeedPreset } from '@/lib/videoFilters'
import type { BackgroundType } from '@/lib/demoHomeSlyde'
import { VideoTrimEditor } from './VideoTrimEditor'

// Re-export parseVideoUrl from VideoMediaInput for backwards compatibility
import { parseVideoUrl } from './VideoMediaInput'
export { parseVideoUrl }

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

  // Start time (for YouTube/Vimeo)
  startTime?: number
  onStartTimeChange?: (time: number) => void

  // UI options
  showFilters?: boolean
  className?: string

  // Context: 'home' for Home Slyde (5 min), 'frame' for frames (20 sec)
  context?: 'home' | 'frame'

  // Onboarding: pulse the URL input field
  shouldPulseInput?: boolean
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
  startTime = 0,
  onStartTimeChange,
  showFilters = true,
  className = '',
  context = 'home',
  shouldPulseInput = false,
}: BackgroundMediaInputProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null)
  const [showTrimEditor, setShowTrimEditor] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { uploadVideo, uploadImage, videoStatus, videoProgress, imageStatus } = useMediaUpload()

  const isVideo = backgroundType === 'video'

  // Max duration based on context: home = 5 minutes, frame = 20 seconds
  const maxDuration = context === 'home' ? 300 : 20

  // Handle video file selection - show trim editor first
  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset file input immediately
    if (videoInputRef.current) videoInputRef.current.value = ''

    // Show trim editor
    setPendingVideoFile(file)
    setShowTrimEditor(true)
  }

  // After trimming, upload the trimmed file
  const handleTrimComplete = async (trimmedFile: File) => {
    setShowTrimEditor(false)
    setPendingVideoFile(null)
    setIsUploading(true)

    try {
      const result = await uploadVideo(trimmedFile, { maxDurationSeconds: maxDuration })
      if (result?.playback?.hls) {
        onVideoSrcChange(result.playback.hls)
      }
    } catch (error) {
      console.error('Video upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  // Cancel trimming
  const handleTrimCancel = () => {
    setShowTrimEditor(false)
    setPendingVideoFile(null)
  }

  // Skip trimming and upload directly
  const handleSkipTrim = async () => {
    if (!pendingVideoFile) return

    setShowTrimEditor(false)
    setIsUploading(true)

    try {
      const result = await uploadVideo(pendingVideoFile, { maxDurationSeconds: maxDuration })
      if (result?.playback?.hls) {
        onVideoSrcChange(result.playback.hls)
      }
    } catch (error) {
      console.error('Video upload failed:', error)
    } finally {
      setIsUploading(false)
      setPendingVideoFile(null)
    }
  }

  // Check if current video is a direct MP4 that can be trimmed
  const canTrimExisting = videoSrc && (
    videoSrc.endsWith('.mp4') ||
    videoSrc.endsWith('.webm') ||
    videoSrc.endsWith('.mov') ||
    videoSrc.includes('.mp4?') ||
    videoSrc.includes('.webm?')
  ) && !videoSrc.includes('cloudflarestream.com') // Can't trim HLS streams

  // Trim existing video URL
  const [trimError, setTrimError] = useState<string | null>(null)

  const handleTrimExisting = async () => {
    if (!videoSrc || !canTrimExisting) return

    setIsUploading(true)
    setTrimError(null)
    try {
      // Fetch the video as a blob
      const response = await fetch(videoSrc)
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status}`)
      }
      const blob = await response.blob()
      if (blob.size === 0) {
        throw new Error('Video file is empty')
      }
      const file = new File([blob], 'video.mp4', { type: blob.type || 'video/mp4' })

      setIsUploading(false)
      setPendingVideoFile(file)
      setShowTrimEditor(true)
    } catch (error) {
      console.error('Failed to fetch video for trimming:', error)
      setTrimError(error instanceof Error ? error.message : 'Failed to load video for trimming')
      setIsUploading(false)
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

  // Detect if video is YouTube or Vimeo (supports start time)
  const parsedVideo = videoSrc ? parseVideoUrl(videoSrc) : null
  const isYouTubeOrVimeo = parsedVideo?.type === 'youtube' || parsedVideo?.type === 'vimeo'

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
          <p className="text-[11px] text-gray-500 dark:text-white/50">
            {context === 'home'
              ? 'Make it impactful. Max 5 minutes. Pair it with epic music.'
              : 'Max 20 seconds. You can trim after selecting.'}
          </p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={videoSrc}
                onChange={(e) => onVideoSrcChange(e.target.value)}
                placeholder="Paste YouTube, Vimeo, or video URL..."
                disabled={isProcessing}
                className={`w-full px-3 py-2 pr-10 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 ${shouldPulseInput && isVideo ? 'animate-pulse-hint' : ''}`}
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
            {/* Trim existing video button */}
            {canTrimExisting && (
              <button
                onClick={handleTrimExisting}
                disabled={isProcessing}
                className="px-3 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-300 dark:border-white/15 rounded-lg text-gray-700 dark:text-white/70 transition-colors disabled:opacity-50"
                title="Trim video"
              >
                <Scissors className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => videoInputRef.current?.click()}
              disabled={isProcessing}
              className={`px-3 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-300 dark:border-white/15 rounded-lg text-gray-700 dark:text-white/70 transition-colors disabled:opacity-50 ${shouldPulseInput && isVideo ? 'animate-pulse-hint' : ''}`}
              title="Upload video"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/*"
              onChange={handleVideoFileSelect}
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

          {/* Trim error message */}
          {trimError && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400">{trimError}</p>
            </div>
          )}

          {/* Start Time Control - for YouTube/Vimeo */}
          {isYouTubeOrVimeo && onStartTimeChange && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-gray-700 dark:text-white/70">
                  Start at
                </label>
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {formatTime(startTime)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                step={1}
                value={startTime}
                onChange={(e) => onStartTimeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between mt-1 text-[10px] text-gray-400 dark:text-white/40">
                <span>0:00</span>
                <span>5:00</span>
              </div>
              <p className="mt-2 text-[11px] text-gray-500 dark:text-white/50">
                {parsedVideo?.type === 'youtube' ? 'YouTube' : 'Vimeo'} video will start at this time
              </p>
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
                className={`w-full px-3 py-2 pr-10 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 ${shouldPulseInput && !isVideo ? 'animate-pulse-hint' : ''}`}
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
              className={`px-3 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-300 dark:border-white/15 rounded-lg text-gray-700 dark:text-white/70 transition-colors disabled:opacity-50 ${shouldPulseInput && !isVideo ? 'animate-pulse-hint' : ''}`}
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

      {/* Trim Editor Modal */}
      {showTrimEditor && pendingVideoFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white">
                <Scissors className="w-5 h-5" />
                <span className="font-medium">Trim Video</span>
              </div>
              <button
                onClick={handleSkipTrim}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Skip trimming →
              </button>
            </div>
            <p className="text-white/50 text-sm mb-4">
              {context === 'home'
                ? `Select up to ${Math.floor(maxDuration / 60)} minutes for your hero video`
                : `Select up to ${maxDuration} seconds for your frame`}
            </p>

            {/* Trim Editor */}
            <VideoTrimEditor
              videoFile={pendingVideoFile}
              onTrimComplete={handleTrimComplete}
              onCancel={handleTrimCancel}
              onSkip={handleSkipTrim}
              maxDuration={maxDuration}
            />
          </div>
        </div>
      )}
    </div>
  )
}
