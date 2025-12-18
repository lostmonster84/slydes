'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Scissors, Play, Pause, Loader2, Check, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

interface VideoTrimEditorProps {
  /** The video file to trim (from user upload) */
  videoFile: File
  /** Called when trim is complete with the trimmed file */
  onTrimComplete: (trimmedFile: File) => void
  /** Called when user cancels trimming */
  onCancel: () => void
  /** Maximum duration allowed in seconds (e.g., 20 for frames, 300 for home) */
  maxDuration?: number
  /** Optional className */
  className?: string
}

type TrimState = 'loading' | 'ready' | 'trimming' | 'done' | 'error'

// Format seconds to MM:SS.ms
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 10)
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`
}

// Format seconds to just MM:SS
function formatTimeShort(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function VideoTrimEditor({
  videoFile,
  onTrimComplete,
  onCancel,
  maxDuration,
  className = '',
}: VideoTrimEditorProps) {
  // Core state
  const [state, setState] = useState<TrimState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Video state
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Trim state (in seconds)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)

  // Dragging state
  const [isDragging, setIsDragging] = useState<'start' | 'end' | 'playhead' | null>(null)

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const ffmpegLoadedRef = useRef(false)

  // Thumbnail state
  const [thumbnails, setThumbnails] = useState<string[]>([])

  // Load FFmpeg on mount
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const loadFFmpeg = async () => {
      if (ffmpegLoadedRef.current) {
        if (isMounted) setState('ready')
        return
      }

      try {
        const ffmpeg = new FFmpeg()
        ffmpegRef.current = ffmpeg

        // Log progress
        ffmpeg.on('progress', ({ progress }) => {
          if (isMounted) setProgress(Math.round(progress * 100))
        })

        // Load from CDN with timeout
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'

        // Fetch with timeout to prevent hanging
        const fetchWithTimeout = async (url: string, type: string) => {
          const response = await fetch(url, { signal: controller.signal })
          if (!response.ok) throw new Error(`Failed to fetch ${type}`)
          const blob = await response.blob()
          return URL.createObjectURL(blob)
        }

        const [coreURL, wasmURL] = await Promise.all([
          fetchWithTimeout(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          fetchWithTimeout(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        ])

        await ffmpeg.load({ coreURL, wasmURL })

        ffmpegLoadedRef.current = true
        if (isMounted) setState('ready')
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to load FFmpeg:', err)
        const message = err instanceof Error && err.name === 'AbortError'
          ? 'Loading cancelled'
          : 'Failed to load video editor. Please try again.'
        setError(message)
        setState('error')
      }
    }

    loadFFmpeg()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  // Create video URL and extract info
  useEffect(() => {
    const url = URL.createObjectURL(videoFile)
    setVideoUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [videoFile])

  // Generate thumbnail strip
  const generateThumbnails = useCallback(async (video: HTMLVideoElement, dur: number) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const thumbCount = 10
    const thumbWidth = 60
    const thumbHeight = 80
    canvas.width = thumbWidth
    canvas.height = thumbHeight

    const thumbs: string[] = []

    for (let i = 0; i < thumbCount; i++) {
      const time = (dur / thumbCount) * i
      video.currentTime = time

      await new Promise(resolve => {
        video.onseeked = resolve
      })

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, thumbWidth, thumbHeight)
      thumbs.push(canvas.toDataURL('image/jpeg', 0.5))
    }

    setThumbnails(thumbs)
    video.currentTime = 0
  }, [])

  // When video loads, set duration and default trim end
  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current) {
      const dur = videoRef.current.duration
      setDuration(dur)
      // If maxDuration is set and video is longer, limit initial selection
      const initialEnd = maxDuration && dur > maxDuration ? maxDuration : dur
      setTrimEnd(initialEnd)
      generateThumbnails(videoRef.current, dur)
    }
  }, [generateThumbnails, maxDuration])

  // Handle timeline click/drag
  const getTimeFromPosition = useCallback((clientX: number): number => {
    if (!timelineRef.current || duration === 0) return 0

    const rect = timelineRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    return percent * duration
  }, [duration])

  const handleTimelineMouseDown = useCallback((e: React.MouseEvent, type: 'start' | 'end' | 'playhead') => {
    e.preventDefault()
    setIsDragging(type)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const time = getTimeFromPosition(e.clientX)
    const effectiveMaxDuration = maxDuration || duration

    if (isDragging === 'start') {
      // Don't let start go past end - 0.5s minimum
      // Also ensure selection doesn't exceed maxDuration
      const minStart = maxDuration ? Math.max(0, trimEnd - effectiveMaxDuration) : 0
      setTrimStart(Math.max(minStart, Math.min(time, trimEnd - 0.5)))
    } else if (isDragging === 'end') {
      // Don't let end go before start + 0.5s minimum
      // Also ensure selection doesn't exceed maxDuration
      const maxEnd = maxDuration ? Math.min(duration, trimStart + effectiveMaxDuration) : duration
      setTrimEnd(Math.min(maxEnd, Math.max(time, trimStart + 0.5)))
    } else if (isDragging === 'playhead') {
      setCurrentTime(time)
      if (videoRef.current) {
        videoRef.current.currentTime = time
      }
    }
  }, [isDragging, getTimeFromPosition, trimStart, trimEnd, maxDuration, duration])

  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  // Add/remove global mouse listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Sync video time
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)

      // Loop within trim region during playback
      if (isPlaying && video.currentTime >= trimEnd) {
        video.currentTime = trimStart
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [isPlaying, trimStart, trimEnd])

  // Play/pause
  const togglePlayback = useCallback(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      // Start from trim start if before it
      if (videoRef.current.currentTime < trimStart) {
        videoRef.current.currentTime = trimStart
      }
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, trimStart])

  // Fine-tune controls
  const adjustTrim = useCallback((handle: 'start' | 'end', delta: number) => {
    const effectiveMaxDuration = maxDuration || duration
    if (handle === 'start') {
      const minStart = maxDuration ? Math.max(0, trimEnd - effectiveMaxDuration) : 0
      setTrimStart(prev => Math.max(minStart, Math.min(prev + delta, trimEnd - 0.5)))
    } else {
      const maxEnd = maxDuration ? Math.min(duration, trimStart + effectiveMaxDuration) : duration
      setTrimEnd(prev => Math.min(maxEnd, Math.max(prev + delta, trimStart + 0.5)))
    }
  }, [trimStart, trimEnd, duration, maxDuration])

  // Reset trim
  const resetTrim = useCallback(() => {
    setTrimStart(0)
    // Respect maxDuration when resetting
    setTrimEnd(maxDuration && duration > maxDuration ? maxDuration : duration)
  }, [duration, maxDuration])

  // Perform the trim
  const handleTrim = useCallback(async () => {
    if (!ffmpegRef.current || !ffmpegLoadedRef.current) return

    setState('trimming')
    setProgress(0)

    try {
      const ffmpeg = ffmpegRef.current

      // Write input file
      const inputData = await fetchFile(videoFile)
      await ffmpeg.writeFile('input.mp4', inputData)

      // Calculate duration
      const trimDuration = trimEnd - trimStart

      // Run FFmpeg trim command
      // Using -ss before -i for fast seeking, -t for duration
      // -c copy for no re-encoding (instant, lossless)
      await ffmpeg.exec([
        '-ss', trimStart.toFixed(3),
        '-i', 'input.mp4',
        '-t', trimDuration.toFixed(3),
        '-c', 'copy',
        '-avoid_negative_ts', 'make_zero',
        'output.mp4'
      ])

      // Read output
      const data = await ffmpeg.readFile('output.mp4')
      // FFmpeg returns Uint8Array - cast through unknown for TS compatibility
      const trimmedBlob = new Blob([data as unknown as BlobPart], { type: 'video/mp4' })
      const trimmedFile = new File([trimmedBlob], videoFile.name, { type: 'video/mp4' })

      // Clean up
      await ffmpeg.deleteFile('input.mp4')
      await ffmpeg.deleteFile('output.mp4')

      setState('done')
      setTimeout(() => {
        onTrimComplete(trimmedFile)
      }, 500)

    } catch (err) {
      console.error('Trim failed:', err)
      setError('Failed to trim video. Please try again.')
      setState('error')
    }
  }, [videoFile, trimStart, trimEnd, onTrimComplete])

  // Calculate positions for UI
  const startPercent = duration > 0 ? (trimStart / duration) * 100 : 0
  const endPercent = duration > 0 ? (trimEnd / duration) * 100 : 100
  const playheadPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const trimDuration = trimEnd - trimStart

  return (
    <div className={`flex flex-col bg-gray-900 rounded-2xl overflow-hidden ${className}`}>
      {/* Video Preview */}
      <div className="relative aspect-[9/16] max-h-[400px] bg-black flex items-center justify-center">
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-contain"
            onLoadedMetadata={handleVideoLoaded}
            muted
            playsInline
          />
        )}

        {/* Play/Pause overlay */}
        <button
          onClick={togglePlayback}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </button>

        {/* Trim duration badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {formatTimeShort(trimDuration)}
          </div>
          {maxDuration && duration > maxDuration && (
            <div className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              Max {formatTimeShort(maxDuration)}
            </div>
          )}
        </div>

        {/* Loading/Progress overlay */}
        {(state === 'loading' || state === 'trimming') && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-white animate-spin mb-3" />
            <p className="text-white text-sm font-medium">
              {state === 'loading' ? 'Loading editor...' : `Trimming... ${progress}%`}
            </p>
            {state === 'trimming' && (
              <div className="w-48 h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Done overlay */}
        {state === 'done' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-3">
              <Check className="w-8 h-8 text-white" />
            </div>
            <p className="text-white text-sm font-medium">Trim complete!</p>
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <div className="p-4 bg-gray-900">
        {/* Current time display */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-xs font-mono">
            {formatTime(currentTime)}
          </span>
          <span className="text-white/60 text-xs font-mono">
            {formatTime(duration)}
          </span>
        </div>

        {/* Thumbnail Timeline */}
        <div
          ref={timelineRef}
          className="relative h-16 rounded-lg overflow-hidden cursor-pointer select-none"
          style={{ touchAction: 'none' }}
        >
          {/* Thumbnail strip */}
          <div className="absolute inset-0 flex">
            {thumbnails.length > 0 ? (
              thumbnails.map((thumb, i) => (
                <div
                  key={i}
                  className="flex-1 h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${thumb})` }}
                />
              ))
            ) : (
              <div className="flex-1 bg-gray-800 animate-pulse" />
            )}
          </div>

          {/* Dimmed areas (outside trim region) */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-black/70"
            style={{ width: `${startPercent}%` }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 bg-black/70"
            style={{ width: `${100 - endPercent}%` }}
          />

          {/* Trim region border */}
          <div
            className="absolute top-0 bottom-0 border-2 border-white rounded-sm"
            style={{
              left: `${startPercent}%`,
              width: `${endPercent - startPercent}%`
            }}
          />

          {/* Start handle */}
          <div
            className="absolute top-0 bottom-0 w-4 cursor-ew-resize group z-10"
            style={{ left: `calc(${startPercent}% - 8px)` }}
            onMouseDown={(e) => handleTimelineMouseDown(e, 'start')}
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white rounded-full group-hover:bg-blue-400 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-sm shadow-lg flex items-center justify-center group-hover:bg-blue-400 transition-colors">
              <ChevronLeft className="w-3 h-3 text-gray-900" />
            </div>
          </div>

          {/* End handle */}
          <div
            className="absolute top-0 bottom-0 w-4 cursor-ew-resize group z-10"
            style={{ left: `calc(${endPercent}% - 8px)` }}
            onMouseDown={(e) => handleTimelineMouseDown(e, 'end')}
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white rounded-full group-hover:bg-blue-400 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-sm shadow-lg flex items-center justify-center group-hover:bg-blue-400 transition-colors">
              <ChevronRight className="w-3 h-3 text-gray-900" />
            </div>
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-500 cursor-ew-resize z-20"
            style={{ left: `${playheadPercent}%` }}
            onMouseDown={(e) => handleTimelineMouseDown(e, 'playhead')}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg" />
          </div>
        </div>

        {/* Trim range display */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustTrim('start', -0.1)}
              className="p-1 text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white text-xs font-mono min-w-[48px] text-center">
              {formatTime(trimStart)}
            </span>
            <button
              onClick={() => adjustTrim('start', 0.1)}
              className="p-1 text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={resetTrim}
            className="p-1.5 text-white/50 hover:text-white transition-colors"
            title="Reset trim"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustTrim('end', -0.1)}
              className="p-1 text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white text-xs font-mono min-w-[48px] text-center">
              {formatTime(trimEnd)}
            </span>
            <button
              onClick={() => adjustTrim('end', 0.1)}
              className="p-1 text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 bg-gray-900 flex gap-3">
        <button
          onClick={onCancel}
          disabled={state === 'trimming'}
          className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleTrim}
          disabled={state !== 'ready' || trimDuration < 0.5}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
        >
          <Scissors className="w-4 h-4" />
          Trim Video
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 pb-4 bg-gray-900">
          <p className="text-red-400 text-sm text-center mb-2">{error}</p>
          {state === 'error' && (
            <button
              onClick={() => {
                setError(null)
                setState('loading')
                ffmpegLoadedRef.current = false
                ffmpegRef.current = null
                // Trigger re-mount by changing key would be better, but for now just reload
                window.location.reload()
              }}
              className="w-full py-2 px-4 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  )
}
