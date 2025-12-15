import { notFound } from 'next/navigation'
import { PublicSlydeClient } from './PublicSlydeClient'

export const dynamic = 'force-dynamic'

export default async function BusinessSlydePage({
  params,
}: {
  params: Promise<{ businessSlug: string; slydeSlug: string }>
}) {
  const { businessSlug, slydeSlug } = await params
  if (businessSlug !== 'wildtrax') return notFound()

  if (slydeSlug !== 'camping' && slydeSlug !== 'just-drive') return notFound()

  return <PublicSlydeClient businessSlug={businessSlug} slydeSlug={slydeSlug} />
}


