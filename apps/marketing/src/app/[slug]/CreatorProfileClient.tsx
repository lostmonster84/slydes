'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

type Business = {
  id: string
  name: string
  slug: string
  primaryColor: string
  slydeCount: number
}

interface CreatorProfileClientProps {
  username: string
  fullName: string | null
  avatarUrl: string | null
  businesses: Business[]
}

export function CreatorProfileClient({
  username,
  fullName,
  avatarUrl,
  businesses,
}: CreatorProfileClientProps) {
  const displayName = fullName || username

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Header */}
      <div className="pt-12 pb-8 px-4">
        <div className="max-w-md mx-auto text-center">
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name */}
          <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
          <p className="text-white/60 text-sm">@{username}</p>
        </div>
      </div>

      {/* Businesses / Slydes */}
      <div className="px-4 pb-12">
        <div className="max-w-md mx-auto space-y-4">
          {businesses.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <p>No published Slydes yet</p>
            </div>
          ) : (
            businesses.map((business) => (
              <Link
                key={business.id}
                href={`/${business.slug}`}
                className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Color indicator */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${business.primaryColor}, ${adjustColor(business.primaryColor, 30)})` }}
                    >
                      {business.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors">
                        {business.name}
                      </h3>
                      <p className="text-white/50 text-sm">
                        {business.slydeCount} {business.slydeCount === 1 ? 'Slyde' : 'Slydes'}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 pb-6 pt-8 bg-gradient-to-t from-black to-transparent">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            <span className="font-semibold">Powered by</span>
            <span className="font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Slydes
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}

// Helper to adjust hex color brightness
function adjustColor(hex: string, percent: number): string {
  hex = hex.replace(/^#/, '')
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  r = Math.min(255, Math.max(0, r - percent))
  g = Math.min(255, Math.max(0, g + percent / 2))
  b = Math.min(255, Math.max(0, b + percent))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
