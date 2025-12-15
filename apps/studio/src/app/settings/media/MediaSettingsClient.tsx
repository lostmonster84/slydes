'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Video } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import FrameAttachDemoClient from './FrameAttachDemoClient'

type Props = {
  organizationId: string
  organizationName: string
  existingVideoUid: string | null
}

export default function MediaSettingsClient({ organizationId, organizationName, existingVideoUid }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'requesting-upload' }
    | { kind: 'uploading'; uid: string }
    | { kind: 'saving'; uid: string }
    | { kind: 'done'; uid: string }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' })
  const [currentUid, setCurrentUid] = useState<string | null>(existingVideoUid)

  async function handleUpload() {
    if (!file) return
    try {
      setStatus({ kind: 'requesting-upload' })

      // 1) Ask our Studio server for a safe, short-lived Cloudflare upload URL
      const res = await fetch('/api/media/create-video-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxDurationSeconds: 30 }),
      })
      const contentType = res.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')
      const json = isJson ? await res.json().catch(() => null) : null
      if (!res.ok) {
        const text = !isJson ? await res.text().catch(() => '') : ''
        throw new Error((json as any)?.error || text || `Failed to create upload (HTTP ${res.status})`)
      }

      const uid = String(json.uid || '')
      const uploadURL = String(json.uploadURL || '')
      if (!uid || !uploadURL) throw new Error('Upload URL missing')

      // 2) Upload the file directly to Cloudflare (your server never receives the video)
      setStatus({ kind: 'uploading', uid })
      const fd = new FormData()
      fd.set('file', file)
      const uploadRes = await fetch(uploadURL, { method: 'POST', body: fd })
      if (!uploadRes.ok) throw new Error('Upload failed')

      // 3) Save the Cloudflare video id (uid) onto your organization record
      setStatus({ kind: 'saving', uid })
      const { error } = await supabase
        .from('organizations')
        .update({ home_video_stream_uid: uid })
        .eq('id', organizationId)
      if (error) throw error

      setCurrentUid(uid)
      setStatus({ kind: 'done', uid })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setStatus({ kind: 'error', message: msg })
    }
  }

  const busy = status.kind !== 'idle' && status.kind !== 'done' && status.kind !== 'error'

  return (
    <div className="min-h-screen bg-future-black">
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/settings"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Settings</span>
            </Link>
            <h1 className="text-xl font-display font-semibold">Media</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white/60" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Home video</h2>
              <p className="text-white/60 text-sm">
                This uploads your video to Cloudflare and saves the “video id” to your organization ({organizationName}).
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="bg-black/30 border border-white/10 rounded-xl p-4">
              <div className="text-xs text-white/50">Current video id</div>
              <div className="mt-1 font-mono text-sm text-white break-all">
                {currentUid ?? '—'}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-white/70">Choose a video file (mp4/mov)</label>
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/*"
                disabled={busy}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/80 hover:file:bg-white/15"
              />
              <p className="text-xs text-white/45">
                Tip: keep it short (10–30s) and vertical (9:16) like the spec.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || busy}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-leader-blue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Upload video
              </button>

              {status.kind === 'requesting-upload' && (
                <div className="text-sm text-white/60">Getting upload link…</div>
              )}
              {status.kind === 'uploading' && (
                <div className="text-sm text-white/60">Uploading to Cloudflare…</div>
              )}
              {status.kind === 'saving' && (
                <div className="text-sm text-white/60">Saving video id…</div>
              )}
              {status.kind === 'done' && (
                <div className="text-sm text-emerald-300">Uploaded. Video id saved.</div>
              )}
              {status.kind === 'error' && (
                <div className="text-sm text-red-300">Error: {status.message}</div>
              )}
            </div>
          </div>
        </div>

        <FrameAttachDemoClient />
      </main>
    </div>
  )
}


