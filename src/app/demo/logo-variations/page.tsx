'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// ============================================
// DEMX: SLYDES.IO TYPOGRAPHY ANALYSIS
// ============================================
// REAL fonts loaded via Google Fonts
// ============================================

interface FontVariation {
  id: string
  name: string
  googleFontUrl: string
  fontFamily: string
  description: string
  usedBy: string[]
  pros: string[]
  cons: string[]
  scores: {
    attention: number
    interest: number
    desire: number
    action: number
  }
  reasoning: string
}

const fontVariations: FontVariation[] = [
  {
    id: '1',
    name: 'Inter',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
    fontFamily: '"Inter", sans-serif',
    description: 'Our current choice. Clean, highly readable, designed specifically for screens. The "safe" SaaS choice.',
    usedBy: ['GitHub', 'Figma', 'Raycast', 'Pitch'],
    pros: ['Excellent readability', 'Great at all sizes', 'Variable font support', 'Free & open source'],
    cons: ['Very common in SaaS', 'Safe but not distinctive', 'Might feel generic'],
    scores: { attention: 6, interest: 6, desire: 6, action: 7 },
    reasoning: 'Solid foundation but doesn\'t scream "Built for 2030". Every other SaaS uses Inter. We blend in, not stand out.'
  },
  {
    id: '2',
    name: 'Outfit',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap',
    fontFamily: '"Outfit", sans-serif',
    description: 'Modern geometric sans-serif. Clean, contemporary, slightly rounded. Fresh but professional.',
    usedBy: ['Modern startups', 'Tech companies'],
    pros: ['Distinctive geometric feel', 'Great weight range', 'Google Fonts available', 'Fresh & modern'],
    cons: ['Slightly soft/rounded', 'Less "sharp" than others'],
    scores: { attention: 8, interest: 8, desire: 7, action: 7 },
    reasoning: 'Fresh and modern. The geometric shapes work well. Slightly softer feel than Space Grotesk.'
  },
  {
    id: '3',
    name: 'Sora',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap',
    fontFamily: '"Sora", sans-serif',
    description: 'Geometric sans with a futuristic edge. Clean, precise, tech-forward.',
    usedBy: ['AI companies', 'Tech startups'],
    pros: ['Very clean geometry', 'Futuristic feel', 'Great for tech brands', 'Google Fonts'],
    cons: ['Can feel cold', 'Less personality than Space Grotesk'],
    scores: { attention: 8, interest: 7, desire: 8, action: 7 },
    reasoning: 'Clean and futuristic. Good contender. Maybe a bit too "cold" for a brand about experiences?'
  },
  {
    id: '4',
    name: 'Manrope',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
    fontFamily: '"Manrope", sans-serif',
    description: 'Clean, futuristic sans-serif. Used by Linear and Arc Browser.',
    usedBy: ['Linear', 'Arc Browser', 'Modern tech'],
    pros: ['Futuristic feel', 'Google Fonts = easy', 'Great for dashboards', 'Good x-height'],
    cons: ['Becoming more common', 'Slightly rounded'],
    scores: { attention: 7, interest: 7, desire: 7, action: 8 },
    reasoning: 'Easy to implement. Has that "future" vibe. But becoming the new Inter - everyone\'s using it.'
  },
  {
    id: '5',
    name: 'Plus Jakarta Sans',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    description: 'Modern geometric with warmth. Professional but friendly.',
    usedBy: ['Vercel docs', 'Modern SaaS'],
    pros: ['Warm yet professional', 'Great readability', 'Google Fonts', 'Versatile'],
    cons: ['Not as distinctive', 'Middle-ground feel'],
    scores: { attention: 7, interest: 7, desire: 7, action: 7 },
    reasoning: 'Nice balance of professional and friendly. But might not be bold enough for "Built for 2030".'
  },
  {
    id: '6',
    name: 'Space Grotesk',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
    fontFamily: '"Space Grotesk", sans-serif',
    description: 'Geometric sans with space-age character. Bold, distinctive, memorable.',
    usedBy: ['Crypto/Web3 projects', 'Tech startups', 'Future-focused brands'],
    pros: ['Highly distinctive', 'Strong personality', 'Google Fonts available', 'Great for logos'],
    cons: ['Might be too "techy"', 'Harder to read in long text'],
    scores: { attention: 9, interest: 8, desire: 8, action: 7 },
    reasoning: 'Maximum distinctiveness. The name alone ("Space") aligns with "Built for 2030". This is the one.'
  }
]

// Rising Cards Logo Mark
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="slydes-grad" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect x="14" y="36" width="36" height="24" rx="4" fill="#2563EB" opacity="0.2" />
      <rect x="12" y="22" width="40" height="28" rx="5" fill="#2563EB" opacity="0.5" />
      <rect x="10" y="6" width="44" height="32" rx="6" fill="url(#slydes-grad)" />
      <rect x="24" y="6" width="16" height="4" rx="2" fill="white" opacity="0.3" />
    </svg>
  )
}

export default function TypographyAnalysis() {
  const [selectedId, setSelectedId] = useState('6')
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const selected = fontVariations.find(f => f.id === selectedId)!
  const totalScore = Object.values(selected.scores).reduce((a, b) => a + b, 0)
  const maxScore = Math.max(...fontVariations.map(f => Object.values(f.scores).reduce((a, b) => a + b, 0)))

  // Load ALL fonts on mount
  useEffect(() => {
    const loadFonts = async () => {
      // Create link elements for all fonts
      fontVariations.forEach(font => {
        const link = document.createElement('link')
        link.href = font.googleFontUrl
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      })
      
      // Wait for fonts to load
      await document.fonts.ready
      setFontsLoaded(true)
    }
    loadFonts()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white">
      {/* Load status */}
      {!fontsLoaded && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-lg z-50 text-sm font-medium">
          Loading fonts...
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E27]/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            ← Back
          </Link>
          <h1 className="text-lg font-bold">Typography Comparison</h1>
          <div className="flex items-center gap-2">
            {fontVariations.map((f) => {
              const score = Object.values(f.scores).reduce((a, b) => a + b, 0)
              const isTop = score === maxScore
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedId(f.id)}
                  className={`px-3 py-2 rounded-lg font-bold transition-all text-xs ${
                    selectedId === f.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  } ${isTop ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  {f.name}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* BIG FONT PREVIEW - THE MAIN EVENT */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-12 mb-8">
            <div className="text-center mb-8">
              <p className="text-white/40 text-sm mb-2">Currently viewing: <strong className="text-white">{selected.name}</strong></p>
              <p className="text-white/30 text-xs font-mono">{selected.fontFamily}</p>
            </div>

            {/* Logo with wordmark - LARGE */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <LogoMark size={64} />
              <span 
                className="text-6xl font-bold tracking-tight"
                style={{ fontFamily: selected.fontFamily }}
              >
                Slydes<span className="text-white/40">.io</span>
              </span>
            </div>

            {/* Headline test */}
            <div className="text-center mb-8">
              <h1 
                className="text-5xl font-bold mb-4"
                style={{ fontFamily: selected.fontFamily }}
              >
                Built for 2030.
              </h1>
              <p 
                className="text-xl text-white/60"
                style={{ fontFamily: selected.fontFamily }}
              >
                Mobile-first experiences that actually convert.
              </p>
            </div>

            {/* Size comparison */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-white/40 text-xs text-center mb-6">Size comparison</p>
              <div className="space-y-4 text-center">
                <p className="text-lg" style={{ fontFamily: selected.fontFamily }}>
                  <span className="text-white/40 text-sm mr-4">18px</span>
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-2xl font-semibold" style={{ fontFamily: selected.fontFamily }}>
                  <span className="text-white/40 text-sm mr-4">24px</span>
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-4xl font-bold" style={{ fontFamily: selected.fontFamily }}>
                  <span className="text-white/40 text-sm mr-4">36px</span>
                  The quick brown fox
                </p>
              </div>
            </div>
          </div>

          {/* ALL FONTS SIDE BY SIDE */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-6 text-center">
              All Fonts Side-by-Side
            </h2>
            <div className="space-y-6">
              {fontVariations.map((font) => {
                const score = Object.values(font.scores).reduce((a, b) => a + b, 0)
                const isTop = score === maxScore
                const isSelected = font.id === selectedId
                return (
                  <button
                    key={font.id}
                    onClick={() => setSelectedId(font.id)}
                    className={`w-full p-6 rounded-xl transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 border-2 border-blue-500'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <LogoMark size={40} />
                      <span 
                        className="text-3xl font-bold"
                        style={{ fontFamily: font.fontFamily }}
                      >
                        Slydes<span className="text-white/40">.io</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/60 mb-1">{font.name}</div>
                      <div className={`text-xl font-bold ${isTop ? 'text-yellow-400' : 'text-white/60'}`}>
                        {isTop && '⭐ '}{score}/40
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Details for selected */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pros/Cons */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4">{selected.name}</h3>
              <p className="text-white/60 text-sm mb-4">{selected.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Pros</h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    {selected.pros.map((p, i) => <li key={i}>✓ {p}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Cons</h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    {selected.cons.map((c, i) => <li key={i}>✗ {c}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* AIDA Scores */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">
                AIDA Score
              </h3>
              <div className="space-y-3">
                {Object.entries(selected.scores).map(([key, value], index) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm capitalize">{key}</span>
                      <span className={`text-sm font-bold ${value >= 8 ? 'text-green-400' : 'text-white/60'}`}>
                        {value}/10
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${value * 10}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        key={selectedId + key}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-bold">Total</span>
                <span className={`text-2xl font-bold ${totalScore >= 32 ? 'text-yellow-400' : 'text-white'}`}>
                  {totalScore}/40
                </span>
              </div>
            </div>
          </div>

          {/* Light background preview */}
          <div className="mt-8 bg-white rounded-2xl p-8">
            <p className="text-gray-400 text-xs text-center mb-6">Light background preview</p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <LogoMark size={48} />
              <span 
                className="text-4xl font-bold text-[#0A0E27]"
                style={{ fontFamily: selected.fontFamily }}
              >
                Slydes<span className="text-gray-400">.io</span>
              </span>
            </div>
            <p 
              className="text-center text-2xl font-bold text-[#0A0E27]"
              style={{ fontFamily: selected.fontFamily }}
            >
              Built for 2030.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}


