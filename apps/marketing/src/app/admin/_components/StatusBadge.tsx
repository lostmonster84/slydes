type Status = 'healthy' | 'warning' | 'error'

interface StatusBadgeProps {
  status: Status
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
}

const STATUS_COLORS: Record<Status, { bg: string; ring: string }> = {
  healthy: { bg: 'bg-green-500', ring: 'ring-green-500/30' },
  warning: { bg: 'bg-amber-500', ring: 'ring-amber-500/30' },
  error: { bg: 'bg-red-500', ring: 'ring-red-500/30' },
}

const SIZES = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

export function StatusBadge({ status, size = 'md', pulse = true }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status]

  return (
    <span className="relative flex">
      <span
        className={`${SIZES[size]} ${colors.bg} rounded-full ${
          pulse && status !== 'healthy' ? 'animate-pulse' : ''
        }`}
      />
      {pulse && status === 'healthy' && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${colors.bg} opacity-40 animate-ping`}
        />
      )}
    </span>
  )
}

export function StatusText({ status }: { status: Status }) {
  const labels: Record<Status, { text: string; color: string }> = {
    healthy: { text: 'Healthy', color: 'text-green-400' },
    warning: { text: 'Warning', color: 'text-amber-400' },
    error: { text: 'Error', color: 'text-red-400' },
  }

  const { text, color } = labels[status]

  return <span className={`text-sm font-medium ${color}`}>{text}</span>
}
