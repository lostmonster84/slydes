'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Video, Globe, CreditCard, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProfileSettingsForm } from '@/components/settings/ProfileSettingsForm'
import { MediaSettingsForm } from '@/components/settings/MediaSettingsForm'
import { DomainSettingsForm } from '@/components/settings/DomainSettingsForm'
import { BillingSettingsPanel } from '@/components/settings/BillingSettingsPanel'
import { PlanBadge } from '@/components/settings/PlanBadge'

type SettingsTab = 'profile' | 'media' | 'domain' | 'billing'

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'media', label: 'Media', icon: Video },
  { id: 'domain', label: 'Domain', icon: Globe },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

function SettingsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const tabParam = searchParams.get('tab') as SettingsTab | null
  const success = searchParams.get('success') === 'true'
  const canceled = searchParams.get('canceled') === 'true'

  const [activeTab, setActiveTab] = useState<SettingsTab>(tabParam && tabs.some(t => t.id === tabParam) ? tabParam : 'profile')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [org, setOrg] = useState<any>(null)

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && tabs.some(t => t.id === tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam)
    }
  }, [tabParam, activeTab])

  // Update URL when tab changes
  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    // Preserve success/canceled params only on billing tab
    if (tab !== 'billing') {
      params.delete('success')
      params.delete('canceled')
    }
    router.push(`/settings?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // Fetch organization if user has one
      if (profileData?.current_organization_id) {
        const { data: orgData } = await supabase
          .from('organizations')
          .select('id, name, slug, custom_domain, custom_domain_verified, custom_domain_verified_at, home_video_stream_uid')
          .eq('id', profileData.current_organization_id)
          .single()

        setOrg(orgData)
      }

      setLoading(false)
    }

    fetchData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-leader-blue" />
      </div>
    )
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  const companyName = profile?.company_name

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-white/60 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
            <h1 className="text-xl font-display font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Info */}
        <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6 mb-8">
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
                <p className="text-gray-700 dark:text-white/80 text-sm">{companyName}</p>
              )}
              <p className="text-gray-500 dark:text-white/60 text-sm">{user?.email}</p>
            </div>
            <div className="ml-auto">
              <PlanBadge dbPlan={profile?.plan} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-white/10 mb-8">
          <nav className="flex gap-1 -mb-px" aria-label="Settings tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                    isActive
                      ? 'border-leader-blue text-leader-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-white/60 dark:hover:text-white dark:hover:border-white/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && <ProfileSettingsForm />}

          {activeTab === 'media' && org && (
            <MediaSettingsForm
              organizationId={org.id}
              organizationName={org.name}
              existingVideoUid={org.home_video_stream_uid}
            />
          )}
          {activeTab === 'media' && !org && (
            <div className="text-center py-12 text-gray-500 dark:text-white/60">
              <p>No organization found. Please set up your organization first.</p>
            </div>
          )}

          {activeTab === 'domain' && org && (
            <DomainSettingsForm
              orgId={org.id}
              orgName={org.name}
              orgSlug={org.slug}
              customDomain={org.custom_domain}
              customDomainVerified={org.custom_domain_verified}
              customDomainVerifiedAt={org.custom_domain_verified_at}
            />
          )}
          {activeTab === 'domain' && !org && (
            <div className="text-center py-12 text-gray-500 dark:text-white/60">
              <p>No organization found. Please set up your organization first.</p>
            </div>
          )}

          {activeTab === 'billing' && (
            <BillingSettingsPanel success={success} canceled={canceled} />
          )}
        </div>
      </main>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1e] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-leader-blue" />
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  )
}
