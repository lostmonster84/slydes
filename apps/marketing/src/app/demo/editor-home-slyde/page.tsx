'use client'

import dynamic from 'next/dynamic'

const HomeSlydeEditorClient = dynamic(
  () => import('./HomeSlydeEditorClient').then((m) => m.HomeSlydeEditorClient),
  { ssr: false }
)

export default function HomeSlydeEditorPage() {
  return <HomeSlydeEditorClient />
}
