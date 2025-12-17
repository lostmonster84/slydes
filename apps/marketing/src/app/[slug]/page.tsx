import { notFound } from 'next/navigation'
import { PublicHomeClient } from './PublicHomeClient'
import { CreatorProfileClient } from './CreatorProfileClient'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const RESERVED = new Set([
  'demo',
  'api',
  'pricing',
  'about',
  'docs',
  'blog',
  'contact',
  'terms',
  'privacy',
  'admin',
  'app',
  'signup',
  'login',
  'founding-member',
  'how-it-works',
  'showcase',
  'investors',
  'affiliates',
  'dashboard',
  'demos',
  'demo-slyde',
])

export default function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <SlugPageContent paramsPromise={params} />
}

async function SlugPageContent({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const { slug } = await paramsPromise
  console.log('[slug] Looking up:', slug)
  if (!slug || RESERVED.has(slug)) return notFound()

  const admin = createSupabaseAdmin()

  // First, check if this is a username (creator profile)
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .eq('username', slug)
    .single()

  console.log('[slug] Profile lookup:', { profile, error: profileError?.message })

  if (profile) {
    // This is a creator profile page - show their businesses
    const { data: memberships } = await admin
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', profile.id)

    const orgIds = (memberships ?? []).map(m => m.organization_id)

    // Fetch all organizations this user owns
    const { data: orgs } = orgIds.length > 0
      ? await admin
          .from('organizations')
          .select('id, name, slug, primary_color')
          .in('id', orgIds)
      : { data: [] }

    // Get slyde counts for each org
    const businesses = await Promise.all(
      (orgs ?? []).map(async (org) => {
        const { count } = await admin
          .from('slydes')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', org.id)
          .eq('published', true)

        return {
          id: org.id,
          name: org.name,
          slug: org.slug,
          primaryColor: org.primary_color || '#2563EB',
          slydeCount: count ?? 0,
        }
      })
    )

    return (
      <CreatorProfileClient
        username={profile.username!}
        fullName={profile.full_name}
        avatarUrl={profile.avatar_url}
        businesses={businesses}
      />
    )
  }

  // Not a username, check if it's a business slug
  const { data: org, error: orgError } = await admin
    .from('organizations')
    .select('id, slug, name, primary_color, home_video_stream_uid, home_video_poster_url')
    .eq('slug', slug)
    .single()

  console.log('[slug] Org lookup:', { org, error: orgError?.message })

  if (!org) return notFound()

  // Fetch all slydes for this organization (categories/child slydes)
  const { data: slydes } = await admin
    .from('slydes')
    .select('id, public_id, title, description, published')
    .eq('organization_id', org.id)
    .order('created_at', { ascending: true })

  // Build categories from slydes (excluding "Home" slyde if exists)
  const categories = (slydes ?? [])
    .filter(s => s.title !== 'Home' && s.published)
    .map(slyde => ({
      id: slyde.id,
      icon: 'sparkles', // TODO: Store icon in slyde metadata
      name: slyde.title,
      description: slyde.description || '',
      childSlydeId: slyde.public_id,
    }))

  // Build video URL from Cloudflare Stream UID
  const cfAccountHash = process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH || ''
  const videoSrc = org.home_video_stream_uid
    ? `https://customer-${cfAccountHash}.cloudflarestream.com/${org.home_video_stream_uid}/manifest/video.m3u8`
    : ''

  return (
    <PublicHomeClient
      businessSlug={slug}
      businessName={org.name}
      primaryColor={org.primary_color || '#2563EB'}
      videoSrc={videoSrc}
      posterSrc={org.home_video_poster_url || undefined}
      categories={categories}
    />
  )
}
