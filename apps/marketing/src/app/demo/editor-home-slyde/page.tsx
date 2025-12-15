'use client'

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const HomeSlydeEditorClient = dynamic(
  () => import('./HomeSlydeEditorClient').then((m) => m.HomeSlydeEditorClient),
  { ssr: false }
)

function EditorWithParams() {
  const searchParams = useSearchParams()
  const initialCategoryId = searchParams.get('category') ?? undefined

  return <HomeSlydeEditorClient initialCategoryId={initialCategoryId} />
}

export default function HomeSlydeEditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <EditorWithParams />
    </Suspense>
  )
}
