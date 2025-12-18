import { InfoIcon } from './InfoTooltip'

interface MetricCardProps {
  label: string
  value: string | number
  subtext?: string
  tooltip?: string
  trend?: {
    value: number
    label: string
  }
  icon?: React.ReactNode
  color?: 'default' | 'blue' | 'green' | 'amber' | 'cyan'
}

// Apple HIG dark mode colors
const COLOR_CLASSES = {
  default: {
    iconBg: 'bg-[#3a3a3c]',
    iconText: 'text-[#98989d]',
    valueText: 'text-white',
  },
  blue: {
    iconBg: 'bg-blue-500/20',
    iconText: 'text-blue-400',
    valueText: 'text-blue-400',
  },
  green: {
    iconBg: 'bg-green-500/20',
    iconText: 'text-green-400',
    valueText: 'text-green-400',
  },
  amber: {
    iconBg: 'bg-amber-500/20',
    iconText: 'text-amber-400',
    valueText: 'text-amber-400',
  },
  cyan: {
    iconBg: 'bg-cyan-500/20',
    iconText: 'text-cyan-400',
    valueText: 'text-cyan-400',
  },
}

export function MetricCard({
  label,
  value,
  subtext,
  tooltip,
  trend,
  icon,
  color = 'default',
}: MetricCardProps) {
  const colors = COLOR_CLASSES[color]

  return (
    <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-[#98989d]">{label}</p>
          {tooltip && <InfoIcon tooltip={tooltip} light />}
        </div>
        {icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
            <span className={colors.iconText}>{icon}</span>
          </div>
        )}
      </div>

      <p className={`text-3xl font-bold ${colors.valueText}`}>{value}</p>

      {(subtext || trend) && (
        <div className="mt-2 flex items-center gap-2">
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend.value >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value} {trend.label}
            </span>
          )}
          {subtext && <span className="text-sm text-[#636366]">{subtext}</span>}
        </div>
      )}
    </div>
  )
}

// Useful icons for metrics
export function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )
}

export function BuildingIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  )
}

export function LayersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  )
}

export function CurrencyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

export function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}
