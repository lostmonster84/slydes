'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, X, Loader2 } from 'lucide-react'

interface SlugInputProps {
  value: string
  onChange: (value: string) => void
  onAvailabilityChange: (available: boolean | null) => void
  isChecking: boolean
  onCheckingChange: (checking: boolean) => void
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Convert to URL-safe slug
function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')  // Replace non-alphanumeric with dash
    .replace(/-+/g, '-')          // Collapse multiple dashes
    .replace(/^-|-$/g, '')        // Trim leading/trailing dashes
    .slice(0, 30)                 // Max 30 chars
}

export function SlugInput({
  value,
  onChange,
  onAvailabilityChange,
  isChecking,
  onCheckingChange,
}: SlugInputProps) {
  const [availability, setAvailability] = useState<boolean | null>(null)
  const debouncedSlug = useDebounce(value, 300)

  // Check availability when debounced value changes
  useEffect(() => {
    if (!debouncedSlug || debouncedSlug.length < 3) {
      setAvailability(null)
      onAvailabilityChange(null)
      return
    }

    let cancelled = false

    async function checkAvailability() {
      onCheckingChange(true)
      try {
        const res = await fetch(`/api/account/slug?slug=${encodeURIComponent(debouncedSlug)}`)
        if (cancelled) return

        if (res.ok) {
          const data = await res.json()
          setAvailability(data.available)
          onAvailabilityChange(data.available)
        } else {
          setAvailability(null)
          onAvailabilityChange(null)
        }
      } catch {
        if (!cancelled) {
          setAvailability(null)
          onAvailabilityChange(null)
        }
      } finally {
        if (!cancelled) {
          onCheckingChange(false)
        }
      }
    }

    checkAvailability()

    return () => {
      cancelled = true
    }
  }, [debouncedSlug, onAvailabilityChange, onCheckingChange])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = toSlug(e.target.value)
    onChange(slug)
    // Reset availability while typing
    setAvailability(null)
    onAvailabilityChange(null)
  }, [onChange, onAvailabilityChange])

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
        Your Slyde URL
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="mybusiness"
          className={`
            w-full rounded-xl border bg-white px-4 py-3 pr-10
            text-gray-900 placeholder:text-gray-400
            transition-colors focus:outline-none focus:ring-2
            dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-white/40
            ${availability === true
              ? 'border-green-500 focus:ring-green-500/30'
              : availability === false
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-gray-200 focus:ring-blue-500/30 dark:border-white/10'
            }
          `}
          style={{ fontSize: '16px' }}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {/* Status indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isChecking ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : availability === true ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : availability === false ? (
            <X className="h-5 w-5 text-red-500" />
          ) : null}
        </div>
      </div>
      {/* URL preview */}
      <p className="text-sm text-gray-500 dark:text-white/50">
        {value ? (
          <>
            <span className="text-gray-400 dark:text-white/30">https://</span>
            <span className="font-medium text-gray-700 dark:text-white/70">{value}</span>
            <span className="text-gray-400 dark:text-white/30">.slydes.io</span>
          </>
        ) : (
          <span className="text-gray-400 dark:text-white/30">
            https://yourbusiness.slydes.io
          </span>
        )}
      </p>
      {/* Availability message */}
      {availability === false && (
        <p className="text-sm text-red-500">
          This URL is already taken. Try a different one.
        </p>
      )}
    </div>
  )
}
