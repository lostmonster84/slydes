'use client'

import { useState, useRef, useEffect } from 'react'
import { TrendPeriod, formatDateForInput, CustomDateRange } from '@/lib/dateUtils'

interface PeriodSelectorProps {
  value: TrendPeriod
  onChange: (period: TrendPeriod, customRange?: CustomDateRange) => void
  periodLabel?: string
  customRange?: CustomDateRange
}

const PERIOD_OPTIONS: { value: TrendPeriod; label: string; tooltip: string }[] = [
  { value: 'wow', label: 'WoW', tooltip: 'Week on Week' },
  { value: 'mom', label: 'MoM', tooltip: 'Month on Month' },
  { value: 'yoy', label: 'YoY', tooltip: 'Year on Year' },
  { value: 'custom', label: 'Custom', tooltip: 'Custom date range' },
]

/**
 * Apple HIG segmented control for period selection
 * Matches existing dark mode styling patterns
 */
export function PeriodSelector({ value, onChange, periodLabel, customRange }: PeriodSelectorProps) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [startDate, setStartDate] = useState(customRange?.startDate || '')
  const [endDate, setEndDate] = useState(customRange?.endDate || '')
  const datePickerRef = useRef<HTMLDivElement>(null)

  // Close date picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Set default dates when opening custom picker
  const handleCustomClick = () => {
    if (!startDate || !endDate) {
      const now = new Date()
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      setStartDate(formatDateForInput(weekAgo))
      setEndDate(formatDateForInput(now))
    }
    setShowDatePicker(true)
  }

  const handleApplyCustom = () => {
    if (startDate && endDate) {
      onChange('custom', { startDate, endDate })
      setShowDatePicker(false)
    }
  }

  const handlePeriodClick = (period: TrendPeriod) => {
    if (period === 'custom') {
      handleCustomClick()
    } else {
      onChange(period)
      setShowDatePicker(false)
    }
  }

  return (
    <div className="relative flex items-center gap-3">
      {periodLabel && (
        <span className="text-xs text-[#636366] hidden sm:block">{periodLabel}</span>
      )}
      <div className="inline-flex items-center p-1 rounded-lg bg-[#3a3a3c] border border-white/10">
        {PERIOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handlePeriodClick(option.value)}
            title={option.tooltip}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              value === option.value
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Custom Date Picker Dropdown */}
      {showDatePicker && (
        <div
          ref={datePickerRef}
          className="absolute top-full right-0 mt-2 p-4 bg-[#2c2c2e] rounded-xl border border-white/10 shadow-xl z-50"
        >
          <div className="flex flex-col gap-3 min-w-[280px]">
            <div>
              <label className="block text-xs text-[#98989d] mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
                className="w-full px-3 py-2 text-sm bg-[#3a3a3c] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-[#98989d] mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                max={formatDateForInput(new Date())}
                className="w-full px-3 py-2 text-sm bg-[#3a3a3c] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDatePicker(false)}
                className="flex-1 px-3 py-2 text-xs font-medium text-white/70 hover:text-white bg-[#3a3a3c] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                disabled={!startDate || !endDate}
                className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
