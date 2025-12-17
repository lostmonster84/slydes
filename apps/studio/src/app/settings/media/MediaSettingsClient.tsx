'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Video, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import FrameAttachDemoClient from './FrameAttachDemoClient'

type Props = {
  organizationId: string
  organizationName: string
  existingVideoUid: string | null
}

export default function MediaSettingsClient({ organizationId, organizationName, existingVideoUid }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoStatus, setVideoStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'requesting-upload' }
    | { kind: 'uploading'; uid: string }
    | { kind: 'done'; uid: string }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' })
  const [homeVideoUid, setHomeVideoUid] = useState<string | null>(existingVideoUid)
  const [lastUploadedVideoUid, setLastUploadedVideoUid] = useState<string | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageStatus, setImageStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'requesting-upload' }
    | { kind: 'uploading'; id: string }
    | { kind: 'done'; id: string }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' })
  const [lastUploadedImageId, setLastUploadedImageId] = useState<string | null>(null)

  async function uploadVideoToCloudflare(file: File): Promise<string> {
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

    const uid = String((json as any)?.uid || '')
    const uploadURL = String((json as any)?.uploadURL || '')
    if (!uid || !uploadURL) throw new Error('Upload URL missing')

    // 2) Upload the file directly to Cloudflare (your server never receives the video)
    const fd = new FormData()
    fd.set('file', file)
    const uploadRes = await fetch(uploadURL, { method: 'POST', body: fd })
    if (!uploadRes.ok) throw new Error('Upload failed')

    return uid
  }

  async function setHomeVideo(uid: string | null) {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ home_video_stream_uid: uid })
        .eq('id', organizationId)
      if (error) throw error

      setHomeVideoUid(uid)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setVideoStatus({ kind: 'error', message: msg })
    }
  }

  async function handleVideoUpload() {
    if (!videoFile) return
    try {
      setVideoStatus({ kind: 'requesting-upload' })
      const uid = await uploadVideoToCloudflare(videoFile)
      setVideoStatus({ kind: 'done', uid })
      setLastUploadedVideoUid(uid)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setVideoStatus({ kind: 'error', message: msg })
    }
  }

  async function handleImageUpload() {
    if (!imageFile) return
    try {
      setImageStatus({ kind: 'requesting-upload' })

      const res = await fetch('/api/media/create-image-upload', { method: 'POST' })
      const contentType = res.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')
      const json = isJson ? await res.json().catch(() => null) : null
      if (!res.ok) {
        const text = !isJson ? await res.text().catch(() => '') : ''
        throw new Error((json as any)?.error || text || `Failed to create upload (HTTP ${res.status})`)
      }

      const id = String((json as any)?.id || '')
      const uploadURL = String((json as any)?.uploadURL || '')
      if (!id || !uploadURL) throw new Error('Image upload URL missing')

      setImageStatus({ kind: 'uploading', id })
      const fd = new FormData()
      fd.set('file', imageFile)
      const uploadRes = await fetch(uploadURL, { method: 'POST', body: fd })
      if (!uploadRes.ok) throw new Error('Image upload failed')

      setImageStatus({ kind: 'done', id })
      setLastUploadedImageId(id)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setImageStatus({ kind: 'error', message: msg })
    }
  }

  const videoBusy = videoStatus.kind !== 'idle' && videoStatus.kind !== 'done' && videoStatus.kind !== 'error'
  const imageBusy = imageStatus.kind !== 'idle' && imageStatus.kind !== 'done' && imageStatus.kind !== 'error'

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white">
      <header className="border-b border-gray-200 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/settings"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-white/60 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Settings</span>
            </Link>
            <h1 className="text-xl font-display font-semibold">Media library</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-gray-500 dark:text-white/60" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Videos</h2>
              <p className="text-gray-500 dark:text-white/60 text-sm">
                Uploads go to Cloudflare Stream. After upload, you can set one as your Home video for {organizationName}, or attach it to a frame below.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="bg-gray-100 border border-gray-200 dark:bg-black/30 dark:border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 dark:text-white/50">Home video id (organization)</div>
              <div className="mt-1 font-mono text-sm break-all">
                {homeVideoUid ?? '—'}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHomeVideo(null)}
                  disabled={!homeVideoUid || videoBusy}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-white/80 text-xs font-medium hover:bg-gray-300 dark:hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Home video
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-gray-600 dark:text-white/70">Choose a video file (mp4/mov)</label>
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/*"
                disabled={videoBusy}
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-600 dark:text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 file:text-gray-700 dark:file:bg-white/10 dark:file:text-white/80 hover:file:bg-gray-300 dark:hover:file:bg-white/15"
              />
              <p className="text-xs text-gray-400 dark:text-white/45">
                Tip: keep it short (10–30s) and vertical (9:16) like the spec.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleVideoUpload}
                disabled={!videoFile || videoBusy}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-leader-blue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {videoBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Upload to library
              </button>

              {videoStatus.kind === 'requesting-upload' && (
                <div className="text-sm text-gray-500 dark:text-white/60">Getting upload link…</div>
              )}
              {videoStatus.kind === 'uploading' && (
                <div className="text-sm text-gray-500 dark:text-white/60">Uploading to Cloudflare…</div>
              )}
              {videoStatus.kind === 'done' && (
                <div className="text-sm text-emerald-600 dark:text-emerald-300">Uploaded.</div>
              )}
              {videoStatus.kind === 'error' && (
                <div className="text-sm text-red-600 dark:text-red-300">Error: {videoStatus.message}</div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 dark:bg-black/20 dark:border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 dark:text-white/50">Last uploaded video id</div>
              <div className="mt-1 font-mono text-sm break-all">
                {lastUploadedVideoUid ?? '—'}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => (lastUploadedVideoUid ? setHomeVideo(lastUploadedVideoUid) : null)}
                  disabled={!lastUploadedVideoUid || videoBusy}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-white/80 text-xs font-medium hover:bg-gray-300 dark:hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set as Home video
                </button>
                <div className="text-xs text-gray-400 dark:text-white/45">
                  This writes `home_video_stream_uid` onto your organization.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gray-500 dark:text-white/60" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Images</h2>
              <p className="text-gray-500 dark:text-white/60 text-sm">
                Uploads go to Cloudflare Images (auto-resizing/optimization). After upload, attach the image to a frame below.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm text-gray-600 dark:text-white/70">Choose an image file</label>
              <input
                type="file"
                accept="image/*"
                disabled={imageBusy}
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-600 dark:text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 file:text-gray-700 dark:file:bg-white/10 dark:file:text-white/80 hover:file:bg-gray-300 dark:hover:file:bg-white/15"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!imageFile || imageBusy}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-leader-blue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {imageBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Upload to library
              </button>

              {imageStatus.kind === 'requesting-upload' && (
                <div className="text-sm text-gray-500 dark:text-white/60">Getting upload link…</div>
              )}
              {imageStatus.kind === 'uploading' && (
                <div className="text-sm text-gray-500 dark:text-white/60">Uploading to Cloudflare…</div>
              )}
              {imageStatus.kind === 'done' && (
                <div className="text-sm text-emerald-600 dark:text-emerald-300">Uploaded.</div>
              )}
              {imageStatus.kind === 'error' && (
                <div className="text-sm text-red-600 dark:text-red-300">Error: {imageStatus.message}</div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 dark:bg-black/20 dark:border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 dark:text-white/50">Last uploaded image id</div>
              <div className="mt-1 font-mono text-sm break-all">
                {lastUploadedImageId ?? '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600 dark:text-white/70 font-medium">Attach media to a frame</div>
          <FrameAttachDemoClient />
        </div>
      </main>
    </div>
  )
}


