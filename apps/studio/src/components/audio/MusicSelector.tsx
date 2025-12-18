'use client'

import { useRef, useState } from 'react'
import { Music, Upload, X, Loader2, ExternalLink, Send } from 'lucide-react'
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
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [helpMessage, setHelpMessage] = useState('')
  const [helpStatus, setHelpStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const { uploadAudio, audioStatus, audioProgress, audioError } = useMediaUpload()

  // Send help request
  const sendHelpRequest = async () => {
    if (!helpMessage.trim()) return
    setHelpStatus('sending')

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'editor',
          requestType: 'feature',
          title: 'Music help request',
          description: helpMessage,
        }),
      })
      setHelpStatus('sent')
      setTimeout(() => {
        setShowHelpModal(false)
        setHelpMessage('')
        setHelpStatus('idle')
      }, 1500)
    } catch {
      setHelpStatus('idle')
    }
  }

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

          {/* Suno recommendation */}
          <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-200 dark:border-purple-800/50 rounded-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
              Next-gen AI music. Create the perfect vibe for your Slyde.
            </p>
            <a
              href="https://suno.com/invite/@slydes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors group"
            >
              <span className="text-xs font-medium text-white">
                Create with Suno
              </span>
              <ExternalLink className="w-3 h-3 text-white/80 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="text-[10px] text-purple-600/70 dark:text-purple-400/60 text-center mt-2">
              Need help finding your vibe?{' '}
              <button
                onClick={() => setShowHelpModal(true)}
                className="underline hover:text-purple-700 dark:hover:text-purple-300"
              >
                Reach out
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Help modal */}
      {showHelpModal && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHelpModal(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div
              className="w-full max-w-sm bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {helpStatus === 'sent' ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                    <Send className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Sent!</p>
                  <p className="text-xs text-gray-500 dark:text-white/50 mt-1">We'll get back to you soon</p>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Help me find my vibe</h3>
                      <button
                        onClick={() => setShowHelpModal(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        <X className="w-4 h-4 text-gray-500 dark:text-white/50" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <textarea
                      value={helpMessage}
                      onChange={(e) => setHelpMessage(e.target.value)}
                      placeholder="Describe the vibe you're going for..."
                      rows={3}
                      autoFocus
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                      style={{ fontSize: '16px' }}
                    />
                    <button
                      onClick={sendHelpRequest}
                      disabled={!helpMessage.trim() || helpStatus === 'sending'}
                      className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {helpStatus === 'sending' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
