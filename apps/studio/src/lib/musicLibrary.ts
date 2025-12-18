/**
 * Music Library for Slydes
 *
 * Curated royalty-free tracks organized by mood.
 * All tracks are licensed for commercial use.
 */

export type MusicMood = 'upbeat' | 'chill' | 'energetic' | 'ambient' | 'cinematic'

export interface MusicTrack {
  id: string
  title: string
  artist: string
  mood: MusicMood
  duration: number // seconds
  url: string // CDN URL to audio file
}

export const MUSIC_MOODS: { id: MusicMood; label: string }[] = [
  { id: 'upbeat', label: 'Upbeat' },
  { id: 'chill', label: 'Chill' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'ambient', label: 'Ambient' },
  { id: 'cinematic', label: 'Cinematic' },
]

/**
 * Music library - curated royalty-free tracks
 *
 * Sources:
 * - Pixabay Music (pixabay.com/music)
 * - Free Music Archive
 * - Custom commissioned tracks
 *
 * All tracks are royalty-free for commercial use.
 */
export const MUSIC_LIBRARY: MusicTrack[] = [
  // Upbeat
  {
    id: 'upbeat-01',
    title: 'Good Vibes',
    artist: 'Slydes Music',
    mood: 'upbeat',
    duration: 120,
    url: 'https://cdn.pixabay.com/audio/2024/11/06/audio_c66f82e0c4.mp3', // Upbeat corporate
  },
  {
    id: 'upbeat-02',
    title: 'Fresh Start',
    artist: 'Slydes Music',
    mood: 'upbeat',
    duration: 135,
    url: 'https://cdn.pixabay.com/audio/2024/09/12/audio_b4e968e8e0.mp3', // Positive energy
  },
  {
    id: 'upbeat-03',
    title: 'Rise & Shine',
    artist: 'Slydes Music',
    mood: 'upbeat',
    duration: 108,
    url: 'https://cdn.pixabay.com/audio/2023/10/08/audio_f91cab5a8d.mp3', // Happy uplifting
  },

  // Chill
  {
    id: 'chill-01',
    title: 'Mellow Afternoon',
    artist: 'Slydes Music',
    mood: 'chill',
    duration: 145,
    url: 'https://cdn.pixabay.com/audio/2024/02/07/audio_89ef7b2d2f.mp3', // Lofi chill
  },
  {
    id: 'chill-02',
    title: 'Easy Going',
    artist: 'Slydes Music',
    mood: 'chill',
    duration: 130,
    url: 'https://cdn.pixabay.com/audio/2024/05/16/audio_a1c93ea83c.mp3', // Relaxed vibes
  },
  {
    id: 'chill-03',
    title: 'Laid Back',
    artist: 'Slydes Music',
    mood: 'chill',
    duration: 118,
    url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_b58578b465.mp3', // Soft acoustic
  },

  // Energetic
  {
    id: 'energetic-01',
    title: 'Full Throttle',
    artist: 'Slydes Music',
    mood: 'energetic',
    duration: 125,
    url: 'https://cdn.pixabay.com/audio/2024/04/16/audio_a86d1a8dce.mp3', // Driving beat
  },
  {
    id: 'energetic-02',
    title: 'Power Move',
    artist: 'Slydes Music',
    mood: 'energetic',
    duration: 140,
    url: 'https://cdn.pixabay.com/audio/2023/07/20/audio_5c185c99de.mp3', // High energy
  },
  {
    id: 'energetic-03',
    title: 'Game On',
    artist: 'Slydes Music',
    mood: 'energetic',
    duration: 112,
    url: 'https://cdn.pixabay.com/audio/2024/03/14/audio_79c4e24ed6.mp3', // Sports/action
  },

  // Ambient
  {
    id: 'ambient-01',
    title: 'Peaceful Mind',
    artist: 'Slydes Music',
    mood: 'ambient',
    duration: 180,
    url: 'https://cdn.pixabay.com/audio/2024/01/10/audio_2ab68f2f11.mp3', // Calm ambient
  },
  {
    id: 'ambient-02',
    title: 'Drift Away',
    artist: 'Slydes Music',
    mood: 'ambient',
    duration: 165,
    url: 'https://cdn.pixabay.com/audio/2023/05/22/audio_14a35b8b96.mp3', // Dreamy
  },
  {
    id: 'ambient-03',
    title: 'Soft Focus',
    artist: 'Slydes Music',
    mood: 'ambient',
    duration: 150,
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_14a04f5d4e.mp3', // Minimal ambient
  },

  // Cinematic
  {
    id: 'cinematic-01',
    title: 'Epic Journey',
    artist: 'Slydes Music',
    mood: 'cinematic',
    duration: 155,
    url: 'https://cdn.pixabay.com/audio/2024/06/12/audio_f1bba19a92.mp3', // Orchestral
  },
  {
    id: 'cinematic-02',
    title: 'Grand Vision',
    artist: 'Slydes Music',
    mood: 'cinematic',
    duration: 170,
    url: 'https://cdn.pixabay.com/audio/2023/09/04/audio_d2f39d6a2e.mp3', // Inspiring
  },
  {
    id: 'cinematic-03',
    title: 'The Reveal',
    artist: 'Slydes Music',
    mood: 'cinematic',
    duration: 138,
    url: 'https://cdn.pixabay.com/audio/2024/08/22/audio_b6e3c96f0e.mp3', // Dramatic build
  },
]

/**
 * Get a track by ID
 */
export function getTrackById(id: string): MusicTrack | undefined {
  return MUSIC_LIBRARY.find(track => track.id === id)
}

/**
 * Get tracks filtered by mood
 */
export function getTracksByMood(mood: MusicMood): MusicTrack[] {
  return MUSIC_LIBRARY.filter(track => track.mood === mood)
}

/**
 * Format duration as MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
