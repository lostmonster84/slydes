import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UnifiedStudioEditor } from './UnifiedStudioEditor'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Auth check (temporarily bypassed for development)
  // if (!user) {
  //   redirect('/login')
  // }

  // Check onboarding status (temporarily bypassed for development)
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('onboarding_completed')
  //   .eq('id', user.id)
  //   .single()

  // if (!profile?.onboarding_completed) {
  //   redirect('/onboarding')
  // }

  return <UnifiedStudioEditor />
}
