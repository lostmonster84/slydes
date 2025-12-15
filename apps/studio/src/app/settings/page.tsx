import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, User, Bell, Shield, CreditCard, Video } from 'lucide-react'

export default async function SettingsPage() {
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

  const displayName = profile?.full_name || user.user_metadata?.full_name || 'User'
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture
  const companyName = profile?.company_name

  const settingsSections = [
    {
      title: 'Profile',
      description: 'Manage your account details',
      icon: User,
      href: '/settings/profile',
    },
    {
      title: 'Media',
      description: 'Upload your Home video',
      icon: Video,
      href: '/settings/media',
    },
    {
      title: 'Notifications',
      description: 'Configure email and push notifications',
      icon: Bell,
      href: '/settings/notifications',
    },
    {
      title: 'Security',
      description: 'Password and authentication settings',
      icon: Shield,
      href: '/settings/security',
    },
    {
      title: 'Billing',
      description: 'Manage your subscription and payments',
      icon: CreditCard,
      href: '/settings/billing',
    },
  ]

  return (
    <div className="min-h-screen bg-future-black">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
            <h1 className="text-xl font-display font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-leader-blue/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-leader-blue" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold">{displayName}</h2>
              {companyName && (
                <p className="text-white/80 text-sm">{companyName}</p>
              )}
              <p className="text-white/60 text-sm">{user.email}</p>
            </div>
            <div className="ml-auto">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                profile?.plan === 'pro'
                  ? 'bg-leader-blue/20 text-leader-blue'
                  : profile?.plan === 'enterprise'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-white/10 text-white/60'
              }`}>
                {profile?.plan === 'pro' ? 'Pro' : profile?.plan === 'enterprise' ? 'Enterprise' : 'Free'}
              </span>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-2">
          {settingsSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <section.icon className="w-5 h-5 text-white/60" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{section.title}</h3>
                <p className="text-sm text-white/60">{section.description}</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-white/40 rotate-180" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
