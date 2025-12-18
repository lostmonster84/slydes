'use client'

import { useRef } from 'react'
import { Music, Upload, X, Loader2, ExternalLink } from 'lucide-react'
import { useMediaUpload } from '@/hooks/useMediaUpload'

interface MusicSelectorProps {
  /** Whether music is enabled */
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  /** Custom uploaded audio URL */
  customUrl: string | null
  onCustomUrlChange: (url: string | null) => void
  /** Optional class name */
  className?: string
}

/**
 * MusicSelector - Component for uploading background music in editor
 *
 * Features:
 * - Upload custom audio files
 * - Link to Suno for AI music generation
 * - Enable/disable toggle
 */
export function MusicSelector({
  enabled,
  onEnabledChange,
  customUrl,
  onCustomUrlChange,
  className = '',
}: MusicSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadAudio, audioStatus, audioProgress, audioError } = useMediaUpload()

  const isUploading = audioStatus === 'creating' || audioStatus === 'uploading'

  // Clear selection
  const clearSelection = () => {
    onCustomUrlChange(null)
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await uploadAudio(file)
      onCustomUrlChange(result.url)
    } catch (error) {
      console.error('Audio upload failed:', error)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mpeg,audio/mp3,audio/mp4,audio/m4a,audio/wav"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Enable toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-white/70">
          Background Music
        </span>
        <button
          onClick={() => onEnabledChange(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-white/20'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3">
          {/* Current selection */}
          {customUrl && (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <Music className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-sm text-green-700 dark:text-green-300 flex-1 truncate">
                Custom audio
              </span>
              <button
                onClick={clearSelection}
                className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded transition-colors"
              >
                <X className="w-4 h-4 text-green-600 dark:text-green-400" />
              </button>
            </div>
          )}

          {/* Upload area */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-full p-4 border-2 border-dashed rounded-lg transition-colors text-center ${
              isUploading
                ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-white/20 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Uploading... {audioProgress}%
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-gray-400 dark:text-white/40" />
                <span className="text-xs text-gray-600 dark:text-white/60">
                  {customUrl ? 'Replace audio' : 'Upload your audio'}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-white/30">
                  MP3, M4A, or WAV (max 10MB)
                </span>
              </div>
            )}
          </button>

          {/* Error message */}
          {audioError && (
            <p className="text-xs text-red-500 text-center">{audioError}</p>
          )}

          {/* Suno tip */}
          <a
            href="https://suno.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-200 dark:border-purple-800/50 rounded-lg hover:from-purple-500/20 hover:to-pink-500/20 dark:hover:from-purple-500/30 dark:hover:to-pink-500/30 transition-colors group"
          >
            <span className="text-xs text-purple-700 dark:text-purple-300">
              Create custom tracks with AI
            </span>
            <ExternalLink className="w-3 h-3 text-purple-500 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      )}
    </div>
  )
}
