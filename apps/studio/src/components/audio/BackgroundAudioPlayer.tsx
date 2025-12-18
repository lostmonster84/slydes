'use client'

import { forwardRef } from 'react'

interface BackgroundAudioPlayerProps {
  /** Audio source URL */
  src?: string | null
  /** Whether the audio should loop */
  loop?: boolean
  /** Whether the audio should be muted */
  muted?: boolean
  /** Preload strategy */
  preload?: 'none' | 'metadata' | 'auto'
}

/**
 * BackgroundAudioPlayer - Invisible audio element for background music
 *
 * This component should be mounted at a high level in the component tree
 * to persist across navigation. It's controlled via a ref passed from
 * useBackgroundMusic hook.
 *
 * Features:
 * - Invisible (no UI)
 * - Loops by default
 * - Controlled via ref
 */
export const BackgroundAudioPlayer = forwardRef<HTMLAudioElement, BackgroundAudioPlayerProps>(
  function BackgroundAudioPlayer({ src, loop = true, muted = false, preload = 'metadata' }, ref) {
    if (!src) return null

    return (
      <audio
        ref={ref}
        src={src}
        loop={loop}
        muted={muted}
        preload={preload}
        playsInline
        // Hidden from view
        style={{ display: 'none' }}
      />
    )
  }
)
