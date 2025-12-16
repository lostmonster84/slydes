import Link from 'next/link'

export function ScaffoldNotice({
  title,
  demoHref,
}: {
  title: string
  demoHref?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#2c2c2e]">
      <div className="p-6">
        <div className="text-sm font-display font-bold tracking-tight text-gray-900 dark:text-white">{title}</div>
        <div className="mt-2 text-sm text-gray-600 dark:text-white/60 leading-relaxed">
          This page is scaffolding only. We’re still perfecting the HQ + editor UX in <span className="font-medium">/demo</span>. Once it’s locked,
          we’ll promote the same UI into <span className="font-medium">/app</span> and swap demo state for Supabase-backed data and auth.
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {demoHref ? (
            <Link
              href={demoHref}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-xs font-semibold text-white"
            >
              Open the working demo
            </Link>
          ) : null}
          <Link
            href="/demo/hq-dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors"
          >
            HQ demo
          </Link>
          <Link
            href="/demo/editor-home"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors"
          >
            Editor demo
          </Link>
        </div>
      </div>
    </div>
  )
}



