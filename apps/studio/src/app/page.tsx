import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioClient } from './StudioClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Auth check (temporarily bypassed for development)
  // if (!user) {
  //   redirect('/login')
  // }

  // Check if user has an organization
  let hasOrganization = false
  if (user) {
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)

    hasOrganization = !!(orgs && orgs.length > 0)
  }

  return <StudioClient hasOrganization={hasOrganization} />
}
