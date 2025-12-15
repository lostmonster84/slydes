import { notFound } from 'next/navigation'
import { PublicSlydeClient } from './PublicSlydeClient'

export const dynamic = 'force-dynamic'

export default function BusinessSlydePage({
  params,
}: {
  params: Promise<{ businessSlug: string; slydeSlug: string }>
}) {
  return <BusinessSlydePageContent paramsPromise={params} />
}

async function BusinessSlydePageContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ businessSlug: string; slydeSlug: string }>
}) {
  const { businessSlug, slydeSlug } = await paramsPromise
  if (businessSlug !== 'wildtrax') return notFound()

  if (slydeSlug !== 'camping' && slydeSlug !== 'just-drive') return notFound()

  return <PublicSlydeClient businessSlug={businessSlug} slydeSlug={slydeSlug} />
}


