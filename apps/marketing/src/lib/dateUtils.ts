/**
 * Date utilities for WoW/MoM/YoY trend calculations
 */

export type TrendPeriod = 'wow' | 'mom' | 'yoy' | 'custom'

export interface TrendMetric {
  current: number
  previous: number
  change: number
  changePercent: number
  direction: 'up' | 'down' | 'flat'
}

export interface PeriodRange {
  current: { start: Date; end: Date }
  previous: { start: Date; end: Date }
  label: string
}

export interface CustomDateRange {
  startDate: string // ISO date string YYYY-MM-DD
  endDate: string   // ISO date string YYYY-MM-DD
}

/**
 * Get date ranges for current and previous periods
 * WoW: Last 7 days vs 7-14 days ago
 * MoM: This calendar month vs same days last month
 * YoY: This year to date vs same period last year
 * Custom: User-defined range vs equivalent previous period
 */
export function getPeriodRanges(
  period: TrendPeriod,
  now: Date = new Date(),
  customRange?: CustomDateRange
): PeriodRange {
  switch (period) {
    case 'wow': {
      // This week: last 7 days (including today)
      const currentEnd = new Date(now)
      currentEnd.setHours(23, 59, 59, 999)

      const currentStart = new Date(now)
      currentStart.setDate(currentStart.getDate() - 6)
      currentStart.setHours(0, 0, 0, 0)

      // Last week: 7-14 days ago
      const previousEnd = new Date(currentStart)
      previousEnd.setDate(previousEnd.getDate() - 1)
      previousEnd.setHours(23, 59, 59, 999)

      const previousStart = new Date(previousEnd)
      previousStart.setDate(previousStart.getDate() - 6)
      previousStart.setHours(0, 0, 0, 0)

      return {
        current: { start: currentStart, end: currentEnd },
        previous: { start: previousStart, end: previousEnd },
        label: `${formatShortDate(currentStart)}-${formatShortDate(currentEnd)} vs ${formatShortDate(previousStart)}-${formatShortDate(previousEnd)}`
      }
    }

    case 'mom': {
      // This month: calendar month to date
      const currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
      currentStart.setHours(0, 0, 0, 0)

      const currentEnd = new Date(now)
      currentEnd.setHours(23, 59, 59, 999)

      const dayOfMonth = now.getDate()

      // Last month: same days of previous month
      const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      previousStart.setHours(0, 0, 0, 0)

      // Handle months with fewer days (e.g., comparing March 31 to Feb 28)
      const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate()
      const previousEnd = new Date(now.getFullYear(), now.getMonth() - 1, Math.min(dayOfMonth, daysInPrevMonth))
      previousEnd.setHours(23, 59, 59, 999)

      return {
        current: { start: currentStart, end: currentEnd },
        previous: { start: previousStart, end: previousEnd },
        label: `${formatMonth(currentStart)} vs ${formatMonth(previousStart)}`
      }
    }

    case 'yoy': {
      // This year: Jan 1 to today
      const currentStart = new Date(now.getFullYear(), 0, 1)
      currentStart.setHours(0, 0, 0, 0)

      const currentEnd = new Date(now)
      currentEnd.setHours(23, 59, 59, 999)

      // Last year: Jan 1 to same date last year
      const previousStart = new Date(now.getFullYear() - 1, 0, 1)
      previousStart.setHours(0, 0, 0, 0)

      const previousEnd = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      previousEnd.setHours(23, 59, 59, 999)

      return {
        current: { start: currentStart, end: currentEnd },
        previous: { start: previousStart, end: previousEnd },
        label: `${now.getFullYear()} vs ${now.getFullYear() - 1}`
      }
    }

    case 'custom': {
      if (!customRange) {
        // Default to last 7 days if no custom range provided
        return getPeriodRanges('wow', now)
      }

      // Parse the custom date range
      const currentStart = new Date(customRange.startDate)
      currentStart.setHours(0, 0, 0, 0)

      const currentEnd = new Date(customRange.endDate)
      currentEnd.setHours(23, 59, 59, 999)

      // Calculate the duration in days
      const durationMs = currentEnd.getTime() - currentStart.getTime()
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24))

      // Previous period: same duration, ending the day before current starts
      const previousEnd = new Date(currentStart)
      previousEnd.setDate(previousEnd.getDate() - 1)
      previousEnd.setHours(23, 59, 59, 999)

      const previousStart = new Date(previousEnd)
      previousStart.setDate(previousStart.getDate() - durationDays + 1)
      previousStart.setHours(0, 0, 0, 0)

      return {
        current: { start: currentStart, end: currentEnd },
        previous: { start: previousStart, end: previousEnd },
        label: `${formatShortDate(currentStart)}-${formatShortDate(currentEnd)} vs ${formatShortDate(previousStart)}-${formatShortDate(previousEnd)}`
      }
    }
  }
}

/**
 * Calculate trend metrics from current and previous values
 */
export function calculateTrend(current: number, previous: number): TrendMetric {
  const change = current - previous

  // Handle division by zero - if previous was 0 and current > 0, that's 100% growth
  // If both are 0, that's flat (0%)
  let changePercent: number
  if (previous === 0) {
    changePercent = current > 0 ? 100 : 0
  } else {
    changePercent = Math.round((change / previous) * 100 * 10) / 10 // One decimal place
  }

  return {
    current,
    previous,
    change,
    changePercent,
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
  }
}

/**
 * Format date as "Dec 17"
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
}

/**
 * Format date as "Dec 2024"
 */
function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

/**
 * Format date as "YYYY-MM-DD" for input fields
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Get period label for UI display
 */
export function getPeriodLabel(period: TrendPeriod): string {
  switch (period) {
    case 'wow': return 'WoW'
    case 'mom': return 'MoM'
    case 'yoy': return 'YoY'
    case 'custom': return 'Custom'
  }
}
