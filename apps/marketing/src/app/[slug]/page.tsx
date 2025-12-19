import { notFound } from 'next/navigation'
import { PublicHomeClient } from './PublicHomeClient'
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
  if (!slug || RESERVED.has(slug)) return notFound()

  const admin = createSupabaseAdmin()

  // Look up business by slug
  const { data: org } = await admin
    .from('organizations')
    .select('id, slug, name, primary_color, home_video_stream_uid, home_video_poster_url, home_audio_r2_key, home_audio_library_id, home_audio_enabled')
    .eq('slug', slug)
    .single()

  if (!org) return notFound()

  // Fetch all published slydes for this organization (categories)
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

  // Build audio URL from R2 key or library ID
  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-98abdd0a909a4a78b03fe6de579904ae.r2.dev'
  let audioSrc: string | undefined
  if (org.home_audio_enabled !== false) {
    if (org.home_audio_r2_key) {
      audioSrc = `${r2PublicUrl}/${org.home_audio_r2_key}`
    } else if (org.home_audio_library_id) {
      // Library tracks - for now just use demo track as placeholder
      // TODO: Map library IDs to actual URLs
      audioSrc = `${r2PublicUrl}/demo/slydesanthem.mp3`
    }
  }

  return (
    <PublicHomeClient
      businessSlug={slug}
      businessName={org.name}
      primaryColor={org.primary_color || '#2563EB'}
      videoSrc={videoSrc}
      posterSrc={org.home_video_poster_url || undefined}
      categories={categories}
      audioSrc={audioSrc}
      audioEnabled={org.home_audio_enabled !== false}
    />
  )
}
