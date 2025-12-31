'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, Play, Pause, RefreshCw, Copy, Check, Music, Settings } from 'lucide-react'

interface SoundFile {
  key: string
  name: string
  size: number
  lastModified: string
  url: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminSoundsPage() {
  const [sounds, setSounds] = useState<SoundFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [playingUrl, setPlayingUrl] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [customName, setCustomName] = useState('')
  const [corsStatus, setCorsStatus] = useState<'unknown' | 'configured' | 'configuring' | 'error'>('unknown')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Configure CORS for audio playback
  const configureCors = async () => {
    setCorsStatus('configuring')
    try {
      const response = await fetch('/api/admin/sounds/cors', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to configure CORS')
      setCorsStatus('configured')
    } catch {
      setCorsStatus('error')
    }
  }

  const fetchSounds = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/sounds')
      if (!response.ok) throw new Error('Failed to fetch sounds')
      const data = await response.json()
      setSounds(data.sounds || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sounds')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSounds()
  }, [fetchSounds])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (customName.trim()) {
        formData.append('name', customName.trim())
      }

      // Simulate progress (actual upload doesn't have progress events with fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch('/api/admin/sounds', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      setCustomName('')
      await fetchSounds()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (key: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    try {
      const response = await fetch('/api/admin/sounds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })

      if (!response.ok) throw new Error('Delete failed')
      await fetchSounds()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const togglePlay = async (url: string) => {
    if (playingUrl === url) {
      audioRef.current?.pause()
      setPlayingUrl(null)
    } else {
      // Use Audio API directly (works better with CORS than <audio> element)
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(url)
      audio.onended = () => setPlayingUrl(null)
      audio.onerror = () => {
        setPlayingUrl(null)
        setError('Playback failed - check audio file format')
      }
      try {
        await audio.play()
        // Store reference for pause functionality
        ;(audioRef as React.MutableRefObject<HTMLAudioElement>).current = audio
        setPlayingUrl(url)
      } catch (err) {
        setPlayingUrl(null)
        setError(`Playback failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Sounds</h1>
          <p className="text-gray-500 dark:text-[#98989d]">Upload and manage demo audio files</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={configureCors}
            disabled={corsStatus === 'configuring'}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              corsStatus === 'configured'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-gray-100 dark:bg-[#3a3a3c] text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-[#48484a]'
            } disabled:opacity-50`}
          >
            <Settings className={`w-4 h-4 ${corsStatus === 'configuring' ? 'animate-spin' : ''}`} />
            {corsStatus === 'configured' ? 'CORS OK' : 'Fix CORS'}
          </button>
          <button
            onClick={fetchSounds}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-[#3a3a3c] text-gray-700 dark:text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-[#48484a] disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload New Sound</h2>

        {/* Custom name input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 dark:text-[#98989d] mb-2">
            File name (optional)
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g. slydes-anthem"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#3a3a3c] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 dark:text-[#636366] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">
            Will be saved as: demo/{customName || 'filename'}.mp3
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/mp4,audio/m4a,audio/wav"
          onChange={handleUpload}
          className="hidden"
        />

        {/* Upload button/area */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors ${
            isUploading
              ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-white/20 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-full max-w-xs h-2 bg-gray-200 dark:bg-[#3a3a3c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Uploading... {uploadProgress}%
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-10 h-10 text-gray-400 dark:text-white/40" />
              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-white/60">
                  Click to upload audio file
                </span>
                <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
                  MP3, M4A, or WAV
                </p>
              </div>
            </div>
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500 mt-3">{error}</p>
        )}
      </motion.div>

      {/* Sounds List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Demo Sounds ({sounds.length})
          </h2>
        </div>

        {sounds.length === 0 && !isLoading ? (
          <div className="p-12 text-center">
            <Music className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 dark:text-[#636366]">No sounds uploaded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-white/10">
            {sounds.map((sound) => (
              <div
                key={sound.key}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                {/* Play button */}
                <button
                  onClick={() => togglePlay(sound.url)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    playingUrl === sound.url
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-[#3a3a3c] text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-[#48484a]'
                  }`}
                >
                  {playingUrl === sound.url ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {sound.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-[#636366]">
                    {formatBytes(sound.size)} &middot; {formatDate(sound.lastModified)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyUrl(sound.url)}
                    className="p-2 rounded-lg text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === sound.url ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(sound.key, sound.name)}
                    className="p-2 rounded-lg text-gray-400 dark:text-white/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Usage hint */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Tip:</strong> After uploading, copy the URL and update the{' '}
          <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-500/20 rounded text-xs">
            SLYDES_DEMO_TRACK_URL
          </code>{' '}
          constant in <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-500/20 rounded text-xs">
            MusicSelector.tsx
          </code>
        </p>
      </div>
    </div>
  )
}
