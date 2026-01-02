/**
 * Video Filter Presets
 *
 * Cinematic CSS filters that make any video look professional.
 * Applied via CSS filter property for zero-cost real-time rendering.
 */

export type VideoFilterPreset = 'original' | 'cinematic' | 'vintage' | 'moody' | 'warm' | 'cool'

export type VideoSpeedPreset = 'normal' | 'slow' | 'slower' | 'cinematic'

export interface VideoSpeedConfig {
  id: VideoSpeedPreset
  label: string
  rate: number // playbackRate value (1.0 = normal, 0.5 = half speed)
}

export const VIDEO_SPEEDS: VideoSpeedConfig[] = [
  { id: 'normal', label: 'Normal', rate: 1.0 },
  { id: 'slow', label: 'Slow', rate: 0.75 },
  { id: 'slower', label: 'Slower', rate: 0.5 },
  { id: 'cinematic', label: 'Cinematic', rate: 0.6 },
]

export function getSpeedRate(preset: VideoSpeedPreset): number {
  const config = VIDEO_SPEEDS.find(s => s.id === preset)
  return config?.rate ?? 1.0
}

export interface VideoFilterConfig {
  id: VideoFilterPreset
  label: string
  filter: string
  defaultVignette: boolean
}

export const VIDEO_FILTERS: VideoFilterConfig[] = [
  {
    id: 'original',
    label: 'Original',
    filter: 'none',
    defaultVignette: false,
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    filter: 'contrast(1.1) saturate(0.85) brightness(0.95) sepia(0.05)',
    defaultVignette: true,
  },
  {
    id: 'vintage',
    label: 'Vintage',
    filter: 'sepia(0.25) contrast(1.1) brightness(1.05) saturate(1.2)',
    defaultVignette: true,
  },
  {
    id: 'moody',
    label: 'Moody',
    filter: 'contrast(1.3) saturate(0.7) brightness(0.85)',
    defaultVignette: true,
  },
  {
    id: 'warm',
    label: 'Warm',
    filter: 'sepia(0.15) saturate(1.3) brightness(1.05) contrast(1.05)',
    defaultVignette: false,
  },
  {
    id: 'cool',
    label: 'Cool',
    filter: 'hue-rotate(-15deg) saturate(0.9) contrast(1.1)',
    defaultVignette: false,
  },
]

/**
 * Get the CSS filter string for a preset
 */
export function getFilterStyle(preset: VideoFilterPreset): string {
  const config = VIDEO_FILTERS.find(f => f.id === preset)
  return config?.filter || 'none'
}

/**
 * Get the full config for a preset
 */
export function getFilterConfig(preset: VideoFilterPreset): VideoFilterConfig {
  return VIDEO_FILTERS.find(f => f.id === preset) || VIDEO_FILTERS[0]
}

/**
 * Vignette overlay CSS
 * Creates a subtle darkening around the edges for cinematic feel
 */
export const VIGNETTE_STYLE = {
  background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
  pointerEvents: 'none' as const,
} as const
