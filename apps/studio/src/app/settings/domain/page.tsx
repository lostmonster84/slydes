import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DomainSettingsClient } from './DomainSettingsClient'

export default async function DomainSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's current organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.current_organization_id) {
    redirect('/')
  }

  // Get organization details
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug, custom_domain, custom_domain_verified, custom_domain_verified_at')
    .eq('id', profile.current_organization_id)
    .single()

  if (!org) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-future-black">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/settings"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Settings</span>
            </Link>
            <h1 className="text-xl font-display font-semibold">Custom Domain</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DomainSettingsClient
          orgId={org.id}
          orgName={org.name}
          orgSlug={org.slug}
          customDomain={org.custom_domain}
          customDomainVerified={org.custom_domain_verified}
          customDomainVerifiedAt={org.custom_domain_verified_at}
        />
      </main>
    </div>
  )
}
