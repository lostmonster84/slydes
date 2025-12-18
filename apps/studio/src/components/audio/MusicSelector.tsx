'use client'

import { useState, useRef, useEffect } from 'react'
import { Music, Upload, Check, Play, Pause, X, Loader2 } from 'lucide-react'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { MUSIC_LIBRARY, MUSIC_MOODS, formatDuration, type MusicTrack, type MusicMood } from '@/lib/musicLibrary'

interface MusicSelectorProps {
  /** Whether music is enabled */
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  /** Selected library track ID */
  libraryId: string | null
  onLibraryIdChange: (id: string | null) => void
  /** Custom uploaded audio URL */
  customUrl: string | null
  onCustomUrlChange: (url: string | null) => void
  /** Optional class name */
  className?: string
}

type Tab = 'library' | 'upload'

/**
 * MusicSelector - Component for selecting background music in editor
 *
 * Features:
 * - Library tab: Browse curated tracks by mood, tap to preview, tap to select
 * - Upload tab: Upload custom audio files
 * - Enable/disable toggle
 */
export function MusicSelector({
  enabled,
  onEnabledChange,
  libraryId,
  onLibraryIdChange,
  customUrl,
  onCustomUrlChange,
  className = '',
}: MusicSelectorProps) {
  const [activeTab, setActiveTab] = useState<Tab>(customUrl ? 'upload' : 'library')
  const [selectedMood, setSelectedMood] = useState<MusicMood | 'all'>('all')
  const [previewingId, setPreviewingId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadAudio, audioStatus, audioProgress, audioError } = useMediaUpload()

  const isUploading = audioStatus === 'creating' || audioStatus === 'uploading'

  // Filter tracks by mood
  const filteredTracks = selectedMood === 'all'
    ? MUSIC_LIBRARY
    : MUSIC_LIBRARY.filter(track => track.mood === selectedMood)

  // Handle track preview (tap once to preview)
  const handleTrackClick = (track: MusicTrack) => {
    if (previewingId === track.id) {
      // Second tap on same track = select it
      selectLibraryTrack(track.id)
      stopPreview()
    } else {
      // First tap = preview
      previewTrack(track)
    }
  }

  // Preview a track
  const previewTrack = (track: MusicTrack) => {
    if (!audioRef.current) return

    // Stop any current preview
    audioRef.current.pause()

    // Start new preview
    audioRef.current.src = track.url
    audioRef.current.play().catch(() => {})
    setPreviewingId(track.id)
    setIsPlaying(true)
  }

  // Stop preview
  const stopPreview = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.src = ''
    setPreviewingId(null)
    setIsPlaying(false)
  }

  // Select a library track
  const selectLibraryTrack = (trackId: string) => {
    onLibraryIdChange(trackId)
    onCustomUrlChange(null) // Clear custom URL
    stopPreview()
  }

  // Clear selection
  const clearSelection = () => {
    onLibraryIdChange(null)
    onCustomUrlChange(null)
    stopPreview()
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await uploadAudio(file)
      onCustomUrlChange(result.url)
      onLibraryIdChange(null) // Clear library selection
    } catch (error) {
      console.error('Audio upload failed:', error)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Get currently selected track info
  const selectedTrack = libraryId
    ? MUSIC_LIBRARY.find(t => t.id === libraryId)
    : null

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  // Handle audio ended
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setIsPlaying(false)
      setPreviewingId(null)
    }

    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  return (
    <div className={className}>
      {/* Hidden audio element for previews */}
      <audio ref={audioRef} preload="none" />

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
        <>
          {/* Current selection */}
          {(selectedTrack || customUrl) && (
            <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <Music className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-sm text-green-700 dark:text-green-300 flex-1 truncate">
                {selectedTrack ? selectedTrack.title : 'Custom upload'}
              </span>
              <button
                onClick={clearSelection}
                className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded transition-colors"
              >
                <X className="w-4 h-4 text-green-600 dark:text-green-400" />
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mb-3 p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'library'
                  ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5 inline mr-1" />
              Library
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5 inline mr-1" />
              Upload
            </button>
          </div>

          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="space-y-2">
              {/* Mood filters */}
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedMood('all')}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedMood === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/15'
                  }`}
                >
                  All
                </button>
                {MUSIC_MOODS.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedMood === mood.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/15'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>

              {/* Track list */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredTracks.map(track => {
                  const isSelected = libraryId === track.id
                  const isPreviewing = previewingId === track.id

                  return (
                    <button
                      key={track.id}
                      onClick={() => handleTrackClick(track)}
                      className={`w-full p-2 rounded-lg text-left transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                          : isPreviewing
                            ? 'bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20'
                            : 'bg-gray-50 dark:bg-white/5 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {/* Play/Pause indicator */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : isPreviewing
                            ? 'bg-gray-300 dark:bg-white/30 text-gray-700 dark:text-white'
                            : 'bg-gray-200 dark:bg-white/20 text-gray-500 dark:text-white/60'
                      }`}>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : isPreviewing && isPlaying ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3 ml-0.5" />
                        )}
                      </div>

                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {track.title}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-white/50">
                          {track.mood.charAt(0).toUpperCase() + track.mood.slice(1)} · {formatDuration(track.duration)}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <p className="text-[10px] text-gray-400 dark:text-white/30 text-center">
                Tap to preview · Tap again to select
              </p>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-2">
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
                      Click to upload audio
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

              {/* Current custom upload */}
              {customUrl && (
                <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg flex items-center gap-2">
                  <Music className="w-4 h-4 text-gray-500 dark:text-white/50" />
                  <span className="text-xs text-gray-600 dark:text-white/60 flex-1 truncate">
                    Custom audio uploaded
                  </span>
                  <button
                    onClick={() => onCustomUrlChange(null)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400 dark:text-white/40" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
