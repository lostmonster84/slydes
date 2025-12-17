'use client'

import { useCallback, useRef } from 'react'

interface FetchResult {
  ok: boolean
  followers?: number
  handle?: string
  error?: string
}

/**
 * Extracts username from Instagram URL
 * Handles: instagram.com/username, instagram.com/username/, @username
 */
function extractInstagramUsername(input: string): string | null {
  if (!input) return null

  // Handle @username format
  if (input.startsWith('@')) {
    return input.slice(1).toLowerCase()
  }

  // Handle URL format
  const match = input.match(/(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9_.]+)/i)
  if (match) {
    return match[1].toLowerCase()
  }

  // Handle plain username (no @ or URL)
  if (/^[a-zA-Z0-9_.]+$/.test(input)) {
    return input.toLowerCase()
  }

  return null
}

/**
 * Extracts username from TikTok URL
 * Handles: tiktok.com/@username, @username
 */
function extractTikTokUsername(input: string): string | null {
  if (!input) return null

  // Handle @username format
  if (input.startsWith('@')) {
    return input.slice(1).toLowerCase()
  }

  // Handle URL format (TikTok uses @username in URLs)
  const match = input.match(/tiktok\.com\/@?([a-zA-Z0-9_.]+)/i)
  if (match) {
    return match[1].toLowerCase()
  }

  // Handle plain username
  if (/^[a-zA-Z0-9_.]+$/.test(input)) {
    return input.toLowerCase()
  }

  return null
}

/**
 * Hook to fetch and store social media follower counts
 * Debounces requests and updates organization in database
 */
export function useSocialFollowers(organizationId: string | undefined) {
  const debounceTimers = useRef<{ instagram?: NodeJS.Timeout; tiktok?: NodeJS.Timeout }>({})
  const lastFetched = useRef<{ instagram?: string; tiktok?: string }>({})

  /**
   * Save Instagram handle and optional follower count
   * Debounced to avoid hammering on every keystroke
   */
  const saveInstagramHandle = useCallback(async (
    input: string,
    followers?: number,
    onResult?: (result: FetchResult) => void
  ) => {
    const username = extractInstagramUsername(input)

    // Clear existing timer
    if (debounceTimers.current.instagram) {
      clearTimeout(debounceTimers.current.instagram)
    }

    // Skip if no username
    if (!username) {
      return
    }

    // Debounce the save
    debounceTimers.current.instagram = setTimeout(async () => {
      if (!organizationId) {
        onResult?.({ ok: true, handle: username, followers })
        return
      }

      // Save handle and optional followers to database
      try {
        const res = await fetch('/api/social/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, organizationId, followers }),
        })
        const result = await res.json()
        lastFetched.current.instagram = username
        onResult?.(result)
      } catch {
        onResult?.({ ok: false, error: 'Network error' })
      }
    }, 1500) // 1.5 second debounce
  }, [organizationId])

  /**
   * Fetch TikTok followers for a given URL/username
   * Debounced to avoid hammering the API on every keystroke
   */
  const fetchTikTokFollowers = useCallback(async (
    input: string,
    onResult?: (result: FetchResult) => void
  ) => {
    const username = extractTikTokUsername(input)

    // Clear existing timer
    if (debounceTimers.current.tiktok) {
      clearTimeout(debounceTimers.current.tiktok)
    }

    // Skip if no username or same as last fetch
    if (!username || username === lastFetched.current.tiktok) {
      return
    }

    // Debounce the actual fetch
    debounceTimers.current.tiktok = setTimeout(async () => {
      if (!organizationId) {
        // Just fetch without saving (for preview/validation)
        try {
          const res = await fetch(`/api/social/tiktok?username=${encodeURIComponent(username)}`)
          const data: FetchResult = await res.json()
          onResult?.(data)
        } catch (error) {
          onResult?.({ ok: false, error: 'Network error' })
        }
        return
      }

      // Fetch and save to organization
      try {
        const res = await fetch('/api/social/tiktok', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, organizationId }),
        })
        const data: FetchResult = await res.json()
        lastFetched.current.tiktok = username
        onResult?.(data)
      } catch (error) {
        onResult?.({ ok: false, error: 'Network error' })
      }
    }, 1500) // 1.5 second debounce
  }, [organizationId])

  return {
    saveInstagramHandle,
    fetchTikTokFollowers,
    extractInstagramUsername,
    extractTikTokUsername,
  }
}
