'use client'

import { useState, useCallback } from 'react'

type UploadStatus = 'idle' | 'creating' | 'uploading' | 'processing' | 'ready' | 'error'

interface VideoUploadResult {
  uid: string
  status: 'processing' | 'ready'
  playback?: {
    hls: string
    dash: string
  }
  thumbnail?: string
}

interface ImageUploadResult {
  id: string
  url: string
  variants: string[]
}

interface UseMediaUploadReturn {
  // Video upload
  uploadVideo: (file: File, options?: { maxDurationSeconds?: number }) => Promise<VideoUploadResult>
  videoStatus: UploadStatus
  videoProgress: number
  videoError: string | null

  // Image upload
  uploadImage: (file: File) => Promise<ImageUploadResult>
  imageStatus: UploadStatus
  imageProgress: number
  imageError: string | null

  // Utilities
  pollVideoStatus: (uid: string) => Promise<VideoUploadResult>
  attachToFrame: (frameId: string, media: { videoStreamUid?: string; imageId?: string }) => Promise<void>
  reset: () => void
}

/**
 * useMediaUpload - Client-side hook for uploading media to Cloudflare
 *
 * Flow:
 * 1. Call uploadVideo/uploadImage with a file
 * 2. Hook gets a direct upload URL from our API
 * 3. File is uploaded directly to Cloudflare (no server bandwidth)
 * 4. For videos, poll status until ready
 * 5. Call attachToFrame to link media to a frame
 */
export function useMediaUpload(): UseMediaUploadReturn {
  const [videoStatus, setVideoStatus] = useState<UploadStatus>('idle')
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoError, setVideoError] = useState<string | null>(null)

  const [imageStatus, setImageStatus] = useState<UploadStatus>('idle')
  const [imageProgress, setImageProgress] = useState(0)
  const [imageError, setImageError] = useState<string | null>(null)

  // Reset all state
  const reset = useCallback(() => {
    setVideoStatus('idle')
    setVideoProgress(0)
    setVideoError(null)
    setImageStatus('idle')
    setImageProgress(0)
    setImageError(null)
  }, [])

  // Poll video status until ready or error
  const pollVideoStatus = useCallback(async (uid: string): Promise<VideoUploadResult> => {
    const maxAttempts = 60 // 5 minutes with 5s intervals
    let attempts = 0

    while (attempts < maxAttempts) {
      const response = await fetch(`/api/media/video-status?uid=${uid}`)
      const data = await response.json()

      if (data.status === 'ready') {
        return {
          uid,
          status: 'ready',
          playback: data.playback,
          thumbnail: data.thumbnail,
        }
      }

      if (data.status === 'error') {
        throw new Error(data.errorMessage || 'Video processing failed')
      }

      // Still processing, wait and retry
      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++
    }

    throw new Error('Video processing timed out')
  }, [])

  // Upload video to Cloudflare Stream
  const uploadVideo = useCallback(async (
    file: File,
    options?: { maxDurationSeconds?: number }
  ): Promise<VideoUploadResult> => {
    try {
      setVideoStatus('creating')
      setVideoProgress(0)
      setVideoError(null)

      // 1. Get direct upload URL from our API
      const createResponse = await fetch('/api/media/create-video-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxDurationSeconds: options?.maxDurationSeconds || 30,
        }),
      })

      if (!createResponse.ok) {
        const error = await createResponse.json()
        throw new Error(error.error || 'Failed to create upload URL')
      }

      const { uid, uploadURL } = await createResponse.json()

      // 2. Upload file directly to Cloudflare using TUS protocol
      setVideoStatus('uploading')

      // Use fetch for simple upload (TUS for resumable uploads would be better for large files)
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch(uploadURL, {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload video to Cloudflare')
      }

      setVideoProgress(100)
      setVideoStatus('processing')

      // 3. Poll for video readiness
      const result = await pollVideoStatus(uid)
      setVideoStatus('ready')

      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setVideoError(message)
      setVideoStatus('error')
      throw err
    }
  }, [pollVideoStatus])

  // Upload image to Cloudflare Images
  const uploadImage = useCallback(async (file: File): Promise<ImageUploadResult> => {
    try {
      setImageStatus('creating')
      setImageProgress(0)
      setImageError(null)

      // 1. Get direct upload URL from our API
      const createResponse = await fetch('/api/media/create-image-upload', {
        method: 'POST',
      })

      if (!createResponse.ok) {
        const error = await createResponse.json()
        throw new Error(error.error || 'Failed to create upload URL')
      }

      const { id, uploadURL } = await createResponse.json()

      // 2. Upload file directly to Cloudflare
      setImageStatus('uploading')

      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch(uploadURL, {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to Cloudflare')
      }

      const uploadResult = await uploadResponse.json()

      setImageProgress(100)
      setImageStatus('ready')

      // Cloudflare Images returns the result with variants
      return {
        id: uploadResult.result?.id || id,
        url: uploadResult.result?.variants?.[0] || '',
        variants: uploadResult.result?.variants || [],
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setImageError(message)
      setImageStatus('error')
      throw err
    }
  }, [])

  // Attach uploaded media to a frame
  const attachToFrame = useCallback(async (
    frameId: string,
    media: { videoStreamUid?: string; imageId?: string }
  ) => {
    const response = await fetch('/api/media/attach-to-frame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        frameId,
        ...media,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to attach media to frame')
    }
  }, [])

  return {
    uploadVideo,
    videoStatus,
    videoProgress,
    videoError,
    uploadImage,
    imageStatus,
    imageProgress,
    imageError,
    pollVideoStatus,
    attachToFrame,
    reset,
  }
}
