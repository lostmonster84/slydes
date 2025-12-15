import type { Metadata } from 'next'
import { AppScaffoldShell } from './AppScaffoldShell'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Slydes App (Scaffold)',
  description: 'Scaffolding for /app routes. Real auth/data wiring will replace the /demo stores later.',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppScaffoldShell>{children}</AppScaffoldShell>
}


