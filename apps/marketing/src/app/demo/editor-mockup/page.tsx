import EditorMockupClient from './EditorMockupClient'

export const dynamic = 'force-dynamic'

/**
 * Editor Mockup Page
 *
 * TERMINOLOGY (per STRUCTURE.md):
 * - Home Slyde → Child Slyde → Frame
 * - This editor edits Frames within a single Child Slyde
 * - "Create new Slyde" creates a fresh set of Frames
 *
 * Note: This file is a server wrapper in the App Router.
 * The full UI is in EditorMockupClient to avoid Next.js prerender/Suspense
 * issues with useSearchParams().
 */

export default function EditorMockupPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  return <EditorMockupPageContent searchParamsPromise={searchParams} />
}

async function EditorMockupPageContent({
  searchParamsPromise,
}: {
  searchParamsPromise?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = await Promise.resolve(searchParamsPromise)
  const slyde = typeof resolved?.slyde === 'string' ? resolved.slyde : undefined
  const name = typeof resolved?.name === 'string' ? resolved.name : undefined
  return <EditorMockupClient slyde={slyde} name={name} />
}
