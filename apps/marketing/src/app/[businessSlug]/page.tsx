import { notFound } from 'next/navigation'
import { PublicHomeClient } from './PublicHomeClient'

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
])

export default async function BusinessHomePage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  if (!businessSlug || RESERVED.has(businessSlug)) return notFound()

  // Demo scope: only WildTrax is wired to the Home Slyde store right now.
  if (businessSlug !== 'wildtrax') return notFound()

  return <PublicHomeClient businessSlug={businessSlug} />
}


