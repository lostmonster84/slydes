import EditorMockupClient from './EditorMockupClient'

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

export default function EditorMockupPage() {
  return <EditorMockupClient />
}
