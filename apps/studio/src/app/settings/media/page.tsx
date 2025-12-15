import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MediaSettingsClient from './MediaSettingsClient'

export default async function MediaSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_organization_id')
    .eq('id', user.id)
    .single()

  const orgId = profile?.current_organization_id as string | null
  if (!orgId) {
    // No org selected yet (likely pre-onboarding)
    redirect('/onboarding')
  }

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, home_video_stream_uid')
    .eq('id', orgId)
    .single()

  if (!org) {
    redirect('/onboarding')
  }

  return (
    <MediaSettingsClient
      organizationId={org.id as string}
      organizationName={(org.name as string) ?? 'Organization'}
      existingVideoUid={(org.home_video_stream_uid as string | null) ?? null}
    />
  )
}


