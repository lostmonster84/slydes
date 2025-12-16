import { StatusBadge, StatusText } from './StatusBadge'

type Status = 'healthy' | 'warning' | 'error'

interface IntegrationCardProps {
  name: string
  status: Status
  message: string
  icon: React.ReactNode
  lastChecked?: string
  critical?: boolean
}

export function IntegrationCard({
  name,
  status,
  message,
  icon,
  lastChecked,
  critical = false,
}: IntegrationCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border p-5 ${
        status === 'error' && critical
          ? 'border-red-200 bg-red-50/50'
          : status === 'error'
          ? 'border-red-200'
          : status === 'warning'
          ? 'border-amber-200'
          : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              status === 'healthy'
                ? 'bg-gray-100 text-gray-600'
                : status === 'warning'
                ? 'bg-amber-100 text-amber-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            {critical && (
              <span className="text-xs text-gray-400 uppercase tracking-wide">Critical</span>
            )}
          </div>
        </div>
        <StatusBadge status={status} size="md" />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 truncate flex-1">{message}</p>
        <StatusText status={status} />
      </div>

      {lastChecked && (
        <p className="text-xs text-gray-400 mt-2">
          Last checked: {new Date(lastChecked).toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}

// Icon components for each integration
export function StripeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
    </svg>
  )
}

export function SupabaseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z" />
    </svg>
  )
}

export function CloudflareIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.309 13.456c.071-.253.065-.49-.016-.704a1.097 1.097 0 0 0-.576-.533l-8.622-.028a.178.178 0 0 1-.148-.074.175.175 0 0 1-.018-.166.203.203 0 0 1 .182-.128l8.702-.028c.721-.027 1.496-.595 1.77-1.3l.346-.888a.301.301 0 0 0 .015-.2 5.407 5.407 0 0 0-10.446 1.474c-.665-.275-1.42-.213-2.018.25a2.268 2.268 0 0 0-.883 1.589.292.292 0 0 0 .284.319l10.94.017a.178.178 0 0 0 .172-.128l.316-.472z" />
      <path d="M19.15 10.03a.14.14 0 0 0-.14.016.132.132 0 0 0-.054.128 2.86 2.86 0 0 1-.103 1.26l-.316.973a.203.203 0 0 1-.182.128l-13.14-.017a.705.705 0 0 0-.612.344.71.71 0 0 0-.063.69l.178.396c.14.302.449.497.79.497h14.062c2.026 0 3.746-1.424 4.21-3.404a2.8 2.8 0 0 0-1.52-3.144 3.13 3.13 0 0 0-3.11.133z" />
    </svg>
  )
}

export function ResendIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm3.519 0L12 11.671 18.481 6H5.52zM20 7.329l-8 7.001-8-7.001V18h16V7.329z" />
    </svg>
  )
}

export function AnalyticsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  )
}
