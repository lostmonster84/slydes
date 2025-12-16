'use client'

import { useState, useRef, useEffect } from 'react'
import { Info } from 'lucide-react'

interface InfoTooltipProps {
  text: string
  className?: string
  light?: boolean // Use for dark backgrounds
}

export function InfoTooltip({ text, className = '', light = false }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      // If too close to top of screen, show below
      if (rect.top < 100) {
        setPosition('bottom')
      } else {
        setPosition('top')
      }
    }
  }, [isVisible])

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`transition-colors ${
          light
            ? 'text-white/60 hover:text-white'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        aria-label="More information"
      >
        <Info className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-64 px-3 py-2 text-sm text-gray-700 bg-white rounded-lg shadow-lg border border-gray-200 ${
            position === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
        >
          {text}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-white border-gray-200 transform rotate-45 ${
              position === 'top'
                ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b'
                : 'top-[-5px] left-1/2 -translate-x-1/2 border-l border-t'
            }`}
          />
        </div>
      )}
    </div>
  )
}

// Inline variant for headings
export function InfoIcon({ tooltip, light = false }: { tooltip: string; light?: boolean }) {
  return <InfoTooltip text={tooltip} className="ml-1" light={light} />
}
