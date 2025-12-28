import { StatusBadge } from './StatusBadge'

type OverallStatus = 'healthy' | 'degraded' | 'unhealthy'

interface HealthBannerProps {
  status: OverallStatus
  lastUpdated?: string
  onRefresh?: () => void
  isRefreshing?: boolean
}

const STATUS_CONFIG: Record<
  OverallStatus,
  { label: string; description: string; bg: string; border: string; text: string; descText: string }
> = {
  healthy: {
    label: 'All Systems Operational',
    description: 'Everything is running smoothly',
    bg: 'bg-green-50 dark:bg-green-500/10',
    border: 'border-green-200 dark:border-green-500/30',
    text: 'text-green-700 dark:text-green-400',
    descText: 'text-green-600 dark:text-green-400/70',
  },
  degraded: {
    label: 'Partial Outage',
    description: 'Some services may be affected',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/30',
    text: 'text-amber-700 dark:text-amber-400',
    descText: 'text-amber-600 dark:text-amber-400/70',
  },
  unhealthy: {
    label: 'Major Outage',
    description: 'Critical services are down',
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/30',
    text: 'text-red-700 dark:text-red-400',
    descText: 'text-red-600 dark:text-red-400/70',
  },
}

export function HealthBanner({ status, lastUpdated, onRefresh, isRefreshing }: HealthBannerProps) {
  const config = STATUS_CONFIG[status]
  const badgeStatus = status === 'healthy' ? 'healthy' : status === 'degraded' ? 'warning' : 'error'

  return (
    <div className={`rounded-xl border ${config.bg} ${config.border} p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={badgeStatus} size="lg" pulse={status !== 'healthy'} />
          <div>
            <h2 className={`font-semibold ${config.text}`}>{config.label}</h2>
            <p className={`text-sm ${config.descText}`}>{config.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-[#636366]">
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-[#3a3a3c] text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-[#48484a] disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRefreshing ? 'Checking...' : 'Refresh'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
