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
    .select('id, slug, name, primary_color, home_audio_r2_key, home_audio_library_id, home_audio_enabled')
    .eq('slug', businessSlug)
    .single()

  if (!org) return notFound()

  // Build audio URL from R2 key or library ID
  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-98abdd0a909a4a78b03fe6de579904ae.r2.dev'
  let audioSrc: string | undefined
  if (org.home_audio_enabled !== false) {
    if (org.home_audio_r2_key) {
      audioSrc = `${r2PublicUrl}/${org.home_audio_r2_key}`
    } else if (org.home_audio_library_id) {
      audioSrc = `${r2PublicUrl}/demo/slydesanthem.mp3`
    }
  }

  const { data: slyde } = await admin
    .from('slydes')
    .select('id, public_id, title, description, published, icon')
    .eq('organization_id', org.id)
    .eq('public_id', slydeSlug)
    .single()

  if (!slyde || !slyde.published) return notFound()

  const slydeInfo = {
    id: slyde.id as string,
    publicId: slyde.public_id as string,
    title: slyde.title as string,
    description: (slyde.description as string | null) ?? '',
    icon: (slyde.icon as string | null) ?? '✨',
  }

  // Fetch complete frame data including content, media, and styling
  const { data: frames } = await admin
    .from('frames')
    .select(`
      id,
      public_id,
      frame_index,
      template_type,
      title,
      subtitle,
      media_type,
      video_stream_uid,
      video_poster_url,
      video_status,
      image_url,
      image_id,
      image_variant,
      cta_text,
      cta_action,
      cta_icon,
      cta_type,
      accent_color,
      demo_video_url,
      background_type,
      background_gradient,
      background_color,
      video_filter,
      video_vignette,
      video_speed
    `)
    .eq('slyde_id', slyde.id)
    .order('frame_index', { ascending: true })

  // Build complete frame data for client
  const dbFrames = (frames ?? []).map((f) => ({
    id: f.id as string,
    publicId: f.public_id as string,
    frameIndex: f.frame_index as number,
    templateType: f.template_type as string | null,
    title: f.title as string | null,
    subtitle: f.subtitle as string | null,
    mediaType: (f.media_type as 'video' | 'image' | null) ?? null,
    videoUid: (f.video_stream_uid as string | null) ?? null,
    videoPosterUrl: (f.video_poster_url as string | null) ?? null,
    videoStatus: (f.video_status as string | null) ?? null,
    imageUrl: (f.image_url as string | null) ?? null,
    imageId: (f.image_id as string | null) ?? null,
    imageVariant: (f.image_variant as string | null) ?? null,
    ctaText: (f.cta_text as string | null) ?? null,
    ctaAction: (f.cta_action as string | null) ?? null,
    ctaIcon: (f.cta_icon as string | null) ?? null,
    ctaType: (f.cta_type as string | null) ?? null,
    accentColor: (f.accent_color as string | null) ?? org.primary_color,
    demoVideoUrl: (f.demo_video_url as string | null) ?? null,
    backgroundType: (f.background_type as 'video' | 'image' | 'gradient' | 'color' | null) ?? null,
    backgroundGradient: (f.background_gradient as string | null) ?? null,
    backgroundColor: (f.background_color as string | null) ?? null,
    videoFilter: (f.video_filter as string | null) ?? null,
    videoVignette: (f.video_vignette as boolean | null) ?? null,
    videoSpeed: (f.video_speed as string | null) ?? null,
  }))

  // Legacy frameMedia format for backward compatibility
  const frameMedia = dbFrames.map((f) => ({
    frameIndex: f.frameIndex,
    mediaType: f.mediaType,
    videoUid: f.videoUid,
    imageUrl: f.imageUrl,
    imageId: f.imageId,
    imageVariant: f.imageVariant,
    videoStatus: f.videoStatus,
  }))

  return (
    <PublicSlydeClient
      businessSlug={businessSlug}
      slydeSlug={slydeSlug}
      slydeInfo={slydeInfo}
      dbFrames={dbFrames}
      frameMedia={frameMedia}
      businessName={(org.name as string) ?? businessSlug}
      audioSrc={audioSrc}
      audioEnabled={org.home_audio_enabled !== false}
    />
  )
}


