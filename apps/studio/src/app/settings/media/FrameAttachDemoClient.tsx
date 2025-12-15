'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function FrameAttachDemoClient() {
  const supabase = useMemo(() => createClient(), [])
  const [frameId, setFrameId] = useState('')
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video')
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageVariant, setImageVariant] = useState<'thumb' | 'card' | 'hero'>('hero')
  const [message, setMessage] = useState<string>('')
  const [busy, setBusy] = useState(false)

  async function run() {
    if (!frameId) return
    setBusy(true)
    setMessage('')
    try {
      if (mediaType === 'video') {
        if (!file) throw new Error('Choose a video file')

        // 1) Get a safe upload link
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

        // 2) Upload direct to Cloudflare
        const fd = new FormData()
        fd.set('file', file)
        const uploadRes = await fetch(uploadURL, { method: 'POST', body: fd })
        if (!uploadRes.ok) throw new Error('Upload failed')

        // 3) Attach the Cloudflare uid to this frame row
        const attachRes = await fetch('/api/media/attach-to-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ frameId, mediaType: 'video', videoUid: uid }),
        })
        const attachJson = await attachRes.json()
        if (!attachRes.ok) throw new Error(attachJson?.error || 'Failed to attach to frame')

        setMessage(`Uploaded. Processing video…`)

        // 4) Poll until Cloudflare says it's ready
        for (let i = 0; i < 60; i++) {
          await new Promise((r) => setTimeout(r, 2000))
          const syncRes = await fetch('/api/media/sync-video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ frameId, videoUid: uid }),
          })
          const syncJson = await syncRes.json()
          if (!syncRes.ok) throw new Error(syncJson?.error || 'Failed to sync status')

          if (syncJson.videoStatus === 'ready') {
            setMessage(`Done. Frame is now VIDEO (ready): ${uid}`)
            break
          }
          if (syncJson.videoStatus === 'failed') {
            setMessage(`Video processing failed. Try re-uploading.`)
            break
          }
        }
      } else {
        // Prefer image upload (Cloudflare Images), fall back to URL paste.
        if (imageFile) {
          const res = await fetch('/api/media/create-image-upload', { method: 'POST' })
          const json = await res.json()
          if (!res.ok) throw new Error(json?.error || 'Failed to create image upload')

          const id = String(json.id || '')
          const uploadURL = String(json.uploadURL || '')
          if (!id || !uploadURL) throw new Error('Image upload URL missing')

          const fd = new FormData()
          fd.set('file', imageFile)
          const uploadRes = await fetch(uploadURL, { method: 'POST', body: fd })
          if (!uploadRes.ok) throw new Error('Image upload failed')

          const attachRes = await fetch('/api/media/attach-to-frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ frameId, mediaType: 'image', imageId: id, imageVariant }),
          })
          const attachJson = await attachRes.json()
          if (!attachRes.ok) throw new Error(attachJson?.error || 'Failed to attach to frame')

          setMessage(`Done. Frame is now IMAGE with id: ${id} (variant: ${imageVariant})`)
        } else {
          if (!imageUrl) throw new Error('Upload an image or paste an image URL')

          const attachRes = await fetch('/api/media/attach-to-frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ frameId, mediaType: 'image', imageUrl }),
          })
          const attachJson = await attachRes.json()
          if (!attachRes.ok) throw new Error(attachJson?.error || 'Failed to attach to frame')

          setMessage(`Done. Frame is now IMAGE with url: ${imageUrl}`)
        }
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="text-sm text-white/60">
        Temporary helper so you can test “video per frame” before the full editor UI exists.
      </div>

      <div className="mt-4 grid gap-3">
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Frame ID (UUID)</label>
          <input
            value={frameId}
            onChange={(e) => setFrameId(e.target.value)}
            placeholder="e.g. 0f6a6d6e-...."
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm text-white/70">Media type</label>
          <select
            value={mediaType}
            disabled={busy}
            onChange={(e) => setMediaType(e.target.value === 'image' ? 'image' : 'video')}
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/50"
          >
            <option value="video">Video (upload)</option>
            <option value="image">Image (URL)</option>
          </select>
        </div>

        {mediaType === 'video' ? (
          <div className="grid gap-2">
            <label className="text-sm text-white/70">Video file</label>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/*"
              disabled={busy}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/80 hover:file:bg-white/15"
            />
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="grid gap-2">
              <label className="text-sm text-white/70">Image file (recommended)</label>
              <input
                type="file"
                accept="image/*"
                disabled={busy}
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/80 hover:file:bg-white/15"
              />
              <div className="text-xs text-white/45">This uploads to Cloudflare Images so we can resize automatically.</div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-white/70">Image size (variant)</label>
              <select
                value={imageVariant}
                disabled={busy}
                onChange={(e) => setImageVariant(e.target.value === 'thumb' ? 'thumb' : e.target.value === 'card' ? 'card' : 'hero')}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/50"
              >
                <option value="thumb">thumb (small)</option>
                <option value="card">card (medium)</option>
                <option value="hero">hero (full-screen)</option>
              </select>
              <div className="text-xs text-white/45">We store this on the frame so the viewer can request the right size.</div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-white/70">Or paste an image URL</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                disabled={busy}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50"
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={run}
          disabled={!frameId || busy || (mediaType === 'video' ? !file : (!imageFile && !imageUrl))}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Attach to frame
        </button>

        {message ? (
          <div className="text-sm text-white/70 break-words">{message}</div>
        ) : null}
      </div>
    </div>
  )
}


