import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogOut, Plus, Settings, LayoutGrid } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture

  return (
    <div className="min-h-screen bg-future-black">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-display font-bold tracking-tight">
                <span className="text-white">Slydes</span>
                <span className="text-leader-blue">.io</span>
              </h1>
              <nav className="hidden md:flex items-center gap-1">
                <a
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-white/10 rounded-lg"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Dashboard
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </a>
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-white/80">
                  {displayName}
                </span>
              </div>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-semibold mb-2">
            Welcome back{displayName ? `, ${displayName.split(' ')[0]}` : ''}
          </h2>
          <p className="text-white/60">
            Create and manage your Slydes from here
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-leader-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-leader-blue" />
          </div>
          <h3 className="text-xl font-display font-semibold mb-2">
            Create your first Slyde
          </h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Build stunning mobile-first experiences that captivate your audience
          </p>
          <button className="inline-flex items-center gap-2 bg-leader-blue text-white font-medium py-3 px-6 rounded-xl hover:bg-leader-blue/90 transition-colors">
            <Plus className="w-5 h-5" />
            New Slyde
          </button>
        </div>
      </main>
    </div>
  )
}
