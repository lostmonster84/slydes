'use client'

import { useCallback, useState, useRef } from 'react'
import { Upload, Image as ImageIcon, Video, X, Loader2 } from 'lucide-react'

interface MediaUploaderProps {
  onFileSelect: (file: File) => void
  previewUrl: string | null
  mediaType: 'video' | 'image' | null
  onClear: () => void
  isUploading?: boolean
  uploadProgress?: number
  error?: string | null
}

const ACCEPTED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
}

const ALL_ACCEPTED = [...ACCEPTED_TYPES.image, ...ACCEPTED_TYPES.video]

export function MediaUploader({
  onFileSelect,
  previewUrl,
  mediaType,
  onClear,
  isUploading = false,
  uploadProgress = 0,
  error,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && ALL_ACCEPTED.includes(file.type)) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  // Show preview if we have one
  if (previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
        {/* Preview */}
        <div className="relative aspect-[9/16] max-h-[400px] w-full bg-black">
          {mediaType === 'video' ? (
            <video
              src={previewUrl}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          )}

          {/* Upload progress overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <p className="mt-2 text-sm text-white">Uploading... {uploadProgress}%</p>
              <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Clear button */}
        {!isUploading && (
          <button
            onClick={onClear}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Type indicator */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
          {mediaType === 'video' ? (
            <>
              <Video className="h-3 w-3" />
              Video
            </>
          ) : (
            <>
              <ImageIcon className="h-3 w-3" />
              Image
            </>
          )}
        </div>
      </div>
    )
  }

  // Show drop zone
  return (
    <div className="space-y-3">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex cursor-pointer flex-col items-center justify-center
          rounded-xl border-2 border-dashed p-8 transition-all
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 dark:border-white/20 dark:bg-white/5 dark:hover:border-white/30 dark:hover:bg-white/10'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALL_ACCEPTED.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className={`
          mb-4 flex h-16 w-16 items-center justify-center rounded-full
          ${isDragging ? 'bg-blue-100 dark:bg-blue-500/20' : 'bg-gray-200 dark:bg-white/10'}
        `}>
          <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-white/40'}`} />
        </div>

        <p className="text-center text-sm font-medium text-gray-700 dark:text-white/70">
          {isDragging ? 'Drop your file here' : 'Upload video or image'}
        </p>
        <p className="mt-1 text-center text-xs text-gray-500 dark:text-white/50">
          Drag & drop or click to browse
        </p>
        <p className="mt-2 text-center text-xs text-gray-400 dark:text-white/30">
          MP4, MOV, JPG, PNG, WebP
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-500/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
