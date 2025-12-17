'use client'

/**
 * SheetHandle - Consistent drag handle for all bottom sheets
 *
 * Standard iOS-style handle that indicates the sheet can be dragged.
 * Use this at the top of every bottom sheet for consistency.
 *
 * @see UI-PATTERNS.md for full specification
 */
export function SheetHandle() {
  return (
    <div className="flex justify-center pt-2 pb-1">
      <div className="w-8 h-1 bg-white/20 rounded-full" />
    </div>
  )
}
