import type { PlanTier } from './plans'

/**
 * Pro Access Unlock System
 *
 * Two ways to get Pro access:
 * 1. Email whitelist (hardcoded)
 * 2. Unlock code (stored in localStorage)
 */

// ============================================
// UNLOCK CODES
// ============================================
// Give these to friends/family to unlock Pro
// They enter the code once, it saves to localStorage

export const UNLOCK_CODES: string[] = [
  'JM16SLYDESUNLOCK',
]

const UNLOCK_STORAGE_KEY = 'slydes_pro_unlock'

/**
 * Check if a valid unlock code is stored
 */
export function hasUnlockCode(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(UNLOCK_STORAGE_KEY)
  return stored !== null && UNLOCK_CODES.includes(stored)
}

/**
 * Validate and store an unlock code
 * Returns true if code was valid
 */
export function redeemUnlockCode(code: string): boolean {
  const normalized = code.trim().toUpperCase()
  if (UNLOCK_CODES.includes(normalized)) {
    localStorage.setItem(UNLOCK_STORAGE_KEY, normalized)
    return true
  }
  return false
}

/**
 * Clear stored unlock code
 */
export function clearUnlockCode(): void {
  localStorage.removeItem(UNLOCK_STORAGE_KEY)
}

// ============================================
// EMAIL WHITELIST (backup/admin)
// ============================================

export const PRO_WHITELIST: string[] = [
  'james@lostmonster.io',
]

export function isWhitelisted(email: string | null | undefined): boolean {
  if (!email) return false
  return PRO_WHITELIST.includes(email.toLowerCase())
}

// ============================================
// MAIN CHECK
// ============================================

/**
 * Get effective plan for a user
 * Checks: email whitelist OR unlock code
 */
export function getEffectivePlan(
  email: string | null | undefined,
  dbPlan: PlanTier
): PlanTier {
  // Email whitelist always wins (gives Pro)
  if (isWhitelisted(email)) return 'pro'

  // Check for unlock code (client-side only) - gives Pro
  if (typeof window !== 'undefined' && hasUnlockCode()) return 'pro'

  return dbPlan
}
