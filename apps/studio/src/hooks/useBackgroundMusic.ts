'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseBackgroundMusicOptions {
  /** Custom audio URL */
  customUrl?: string | null
  /** Whether music is enabled */
  enabled?: boolean
  /** Auto-start after first interaction (mobile-friendly) */
  autoStart?: boolean
}

interface UseBackgroundMusicReturn {
  /** Ref to the audio element - attach this to your audio player */
  audioRef: React.RefObject<HTMLAudioElement>
  /** Whether audio is currently playing */
  isPlaying: boolean
  /** Whether audio is muted */
  isMuted: boolean
  /** Whether audio has been unlocked (user interaction occurred) */
  isUnlocked: boolean
  /** Audio source URL */
  audioSrc: string | null
  /** Start playback */
  play: () => void
  /** Pause playback */
  pause: () => void
  /** Toggle play/pause */
  toggle: () => void
  /** Mute audio */
  mute: () => void
  /** Unmute audio */
  unmute: () => void
  /** Toggle mute state */
  toggleMute: () => void
  /** Unlock audio (call on first user interaction) */
  unlockAudio: () => void
}

/**
 * useBackgroundMusic - Manages persistent background audio playback
 *
 * Handles:
 * - Mobile autoplay policies (requires user interaction to start)
 * - Custom uploads
 * - Persistent playback across navigation
 * - Mute/unmute controls
 */
export function useBackgroundMusic(options: UseBackgroundMusicOptions = {}): UseBackgroundMusicReturn {
  const { customUrl, enabled = true, autoStart = true } = options

  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Resolve audio source
  const audioSrc = customUrl ?? null

  // Play audio
  const play = useCallback(() => {
    if (!audioRef.current || !audioSrc || !enabled) return
    audioRef.current.play().catch(() => {
      // Autoplay blocked - need user interaction
      setIsPlaying(false)
    })
  }, [audioSrc, enabled])

  // Pause audio
  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
  }, [])

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  // Mute
  const mute = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.muted = true
    setIsMuted(true)
  }, [])

  // Unmute
  const unmute = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.muted = false
    setIsMuted(false)
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (isMuted) {
      unmute()
    } else {
      mute()
    }
  }, [isMuted, mute, unmute])

  // Unlock audio (call on first user interaction)
  const unlockAudio = useCallback(() => {
    if (isUnlocked) return
    setIsUnlocked(true)

    if (autoStart && audioSrc && enabled) {
      // Short delay to ensure state updates
      setTimeout(() => {
        play()
      }, 100)
    }
  }, [isUnlocked, autoStart, audioSrc, enabled, play])

  // Sync playing state with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      // Loop the audio
      audio.currentTime = 0
      audio.play().catch(() => {})
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Update audio source when it changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (audioSrc) {
      audio.src = audioSrc
      audio.load()
      // If already unlocked and enabled, start playing
      if (isUnlocked && enabled && autoStart) {
        audio.play().catch(() => {})
      }
    } else {
      audio.pause()
      audio.src = ''
    }
  }, [audioSrc, isUnlocked, enabled, autoStart])

  // Handle enabled toggle
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!enabled) {
      audio.pause()
    } else if (isUnlocked && audioSrc && autoStart) {
      audio.play().catch(() => {})
    }
  }, [enabled, isUnlocked, audioSrc, autoStart])

  return {
    audioRef,
    isPlaying,
    isMuted,
    isUnlocked,
    audioSrc,
    play,
    pause,
    toggle,
    mute,
    unmute,
    toggleMute,
    unlockAudio,
  }
}
