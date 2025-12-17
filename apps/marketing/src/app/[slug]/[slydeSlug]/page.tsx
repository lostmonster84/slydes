import { notFound } from 'next/navigation'
import { PublicSlydeClient } from './PublicSlydeClient'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export default function BusinessSlydePage({
  params,
}: {
  params: Promise<{ slug: string; slydeSlug: string }>
}) {
  return <BusinessSlydePageContent paramsPromise={params} />
}

async function BusinessSlydePageContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string; slydeSlug: string }>
}) {
  const { slug: businessSlug, slydeSlug } = await paramsPromise
  if (!businessSlug || !slydeSlug) return notFound()

  const admin = createSupabaseAdmin()

  const { data: org } = await admin
    .from('organizations')
    .select('id, slug, name, primary_color')
    .eq('slug', businessSlug)
    .single()

  if (!org) return notFound()

  const { data: slyde } = await admin
    .from('slydes')
    .select('id, public_id, title, published')
    .eq('organization_id', org.id)
    .eq('public_id', slydeSlug)
    .single()

  if (!slyde || !slyde.published) return notFound()

  const { data: frames } = await admin
    .from('frames')
    .select('frame_index, media_type, video_stream_uid, image_url, image_id, image_variant, video_status')
    .eq('slyde_id', slyde.id)
    .order('frame_index', { ascending: true })

  const frameMedia =
    (frames ?? []).map((f) => ({
      frameIndex: f.frame_index as number,
      mediaType: (f.media_type as 'video' | 'image' | null) ?? null,
      videoUid: (f.video_stream_uid as string | null) ?? null,
      imageUrl: (f.image_url as string | null) ?? null,
      imageId: (f.image_id as string | null) ?? null,
      imageVariant: (f.image_variant as string | null) ?? null,
      videoStatus: (f.video_status as string | null) ?? null,
    })) ?? []

  return (
    <PublicSlydeClient
      businessSlug={businessSlug}
      slydeSlug={slydeSlug}
      frameMedia={frameMedia}
      businessName={(org.name as string) ?? businessSlug}
    />
  )
}


