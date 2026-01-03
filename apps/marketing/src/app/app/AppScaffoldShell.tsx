import Link from 'next/link'

type AppNavItem = { href: string; label: string }

const NAV: AppNavItem[] = [
  { href: '/app/dashboard', label: 'Dashboard' },
  { href: '/app/slydes', label: 'Slydes' },
  { href: '/app/home-slyde', label: 'Home Slyde' },
  { href: '/app/analytics', label: 'Analytics' },
  { href: '/app/inbox', label: 'Inbox' },
  { href: '/app/brand', label: 'Brand' },
  { href: '/app/settings', label: 'Settings' },
]

export function AppScaffoldShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-72 shrink-0 border-r border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#1c1c1e]/60 backdrop-blur-xl">
          <div className="flex flex-col w-full">
            <div className="p-5 border-b border-gray-200 dark:border-white/10">
              <Link href="/demo/hq-dashboard" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div className="min-w-0">
                  <div className="text-base font-display font-bold tracking-tight text-gray-900 dark:text-white">Slydes</div>
                  <div className="text-xs text-gray-500 dark:text-white/50 -mt-0.5">/app scaffold</div>
                </div>
              </Link>
            </div>

            <nav className="p-3 space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60">
                    scaffold
                  </span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto p-4 border-t border-gray-200 dark:border-white/10">
              <div className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">
                This is a lightweight <span className="font-medium text-gray-700 dark:text-white/70">/app</span> scaffold so we can promote the HQ demo later
                without a rewrite.
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href="/demo/hq-dashboard"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors"
                >
                  Open HQ demo
                </Link>
                <Link
                  href="/demo/editor-home"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors"
                >
                  Open editor demo
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="md:hidden sticky top-0 z-40 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <div>
                  <div className="text-sm font-display font-bold text-gray-900 dark:text-white">Slydes</div>
                  <div className="text-[11px] text-gray-500 dark:text-white/50 -mt-0.5">/app scaffold</div>
                </div>
              </div>
              <Link href="/demo/hq-dashboard" className="text-xs font-medium text-blue-600 dark:text-cyan-300">
                Open HQ demo
              </Link>
            </div>
          </div>

          <div className="px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}









