'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

import {
  AnimatedGradientBlobs,
  AnimatedParticleField,
  AnimatedRadarPulse,
  AnimatedNoiseTexture,
  AnimatedLightRays,
  AnimatedAurora,
  MeshGradient,
  AnimatedSpotlight,
  AnimatedWaveLines,
  AnimatedGridFade,
  AnimatedHeroBackground,
} from '@/components/ui/BackgroundAnimations'

// Sample hero content to show in each variation
function HeroContent() {
  return (
    <div className="min-h-[500px] flex items-center py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-leader-blue rounded-full animate-pulse" />
              Now accepting founding members
            </span>
            
            <h1 className="font-display mb-6 text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="block text-gray-900">Mobile sites that</span>
              <span className="block gradient-text">customers actually use</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              TikTok-style vertical scrolling for businesses. 
              Built in minutes, not months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="animate-pulse-glow">
                Become a Founding Member
              </Button>
              <Button variant="secondary" size="lg">
                See Showcase
              </Button>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="w-48 h-96 bg-gray-900 rounded-[2rem] p-2 shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] flex items-center justify-center">
                <span className="text-white/40 text-sm">Phone Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// All variations
const variations = [
  {
    name: 'Gradient Blobs',
    description: 'Slow-moving soft color shapes - Linear/Stripe style',
    aida: { attention: 8, interest: 7, desire: 7, action: 6 },
    component: AnimatedGradientBlobs,
    bg: 'bg-white',
  },
  {
    name: 'Particle Field',
    description: 'Floating dots drifting upward - tech/premium feel',
    aida: { attention: 7, interest: 8, desire: 6, action: 6 },
    component: AnimatedParticleField,
    bg: 'bg-gray-50',
  },
  {
    name: 'Radar Pulse',
    description: 'Rings emanating outward - signal/broadcast vibe',
    aida: { attention: 9, interest: 7, desire: 7, action: 7 },
    component: AnimatedRadarPulse,
    bg: 'bg-white',
  },
  {
    name: 'Noise Texture',
    description: 'Animated film grain - depth and premium quality',
    aida: { attention: 5, interest: 6, desire: 8, action: 5 },
    component: AnimatedNoiseTexture,
    bg: 'bg-gradient-to-br from-white to-gray-100',
  },
  {
    name: 'Light Rays',
    description: 'Diagonal beams of light - dramatic, focused',
    aida: { attention: 8, interest: 7, desire: 7, action: 6 },
    component: AnimatedLightRays,
    bg: 'bg-white',
  },
  {
    name: 'Aurora',
    description: 'Northern lights effect - ethereal, premium',
    aida: { attention: 9, interest: 9, desire: 8, action: 7 },
    component: AnimatedAurora,
    bg: 'bg-gray-50',
  },
  {
    name: 'Mesh Gradient',
    description: 'Complex static gradient - clean, Apple-like',
    aida: { attention: 6, interest: 7, desire: 8, action: 6 },
    component: MeshGradient,
    bg: 'bg-white',
  },
  {
    name: 'Spotlight',
    description: 'Pulsing glow focus - draws eye to content',
    aida: { attention: 8, interest: 7, desire: 7, action: 8 },
    component: AnimatedSpotlight,
    bg: 'bg-white',
  },
  {
    name: 'Wave Lines',
    description: 'Flowing sine waves - fluid, modern',
    aida: { attention: 6, interest: 7, desire: 6, action: 5 },
    component: AnimatedWaveLines,
    bg: 'bg-gray-50',
  },
  {
    name: 'Grid Fade',
    description: 'Animated grid with radial mask - technical',
    aida: { attention: 7, interest: 7, desire: 6, action: 6 },
    component: AnimatedGridFade,
    bg: 'bg-white',
  },
  {
    name: 'Combined Hero',
    description: 'Best of all - blobs + noise + mesh gradient',
    aida: { attention: 9, interest: 9, desire: 9, action: 8 },
    component: AnimatedHeroBackground,
    bg: 'bg-white',
  },
]

export default function BackgroundAnimationsDemo() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single')

  const active = variations[activeIndex]
  const ActiveComponent = active.component
  const aidaScore = active.aida.attention + active.aida.interest + active.aida.desire + active.aida.action

  return (
    <div className="min-h-screen bg-future-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-future-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold">DEMX: Background Animations</h1>
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1 rounded text-sm ${viewMode === 'single' ? 'bg-white text-future-black' : 'text-white/60'}`}
              >
                Single
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-white text-future-black' : 'text-white/60'}`}
              >
                Grid
              </button>
            </div>
          </div>
          <div className="text-xs text-white/40">{variations.length} variations</div>
        </div>
      </header>

      {viewMode === 'single' ? (
        <div className="pt-20 flex">
          {/* Sidebar */}
          <aside className="w-72 fixed left-0 top-20 bottom-0 bg-white/5 border-r border-white/10 overflow-y-auto p-4">
            <div className="space-y-2">
              {variations.map((v, i) => {
                const score = v.aida.attention + v.aida.interest + v.aida.desire + v.aida.action
                return (
                  <button
                    key={v.name}
                    onClick={() => setActiveIndex(i)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activeIndex === i
                        ? 'bg-leader-blue text-white'
                        : 'hover:bg-white/5 text-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{v.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        score >= 32 ? 'bg-green-500/20 text-green-400' :
                        score >= 28 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {score}/40
                      </span>
                    </div>
                    <p className="text-xs opacity-70 line-clamp-1">{v.description}</p>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Main Preview */}
          <main className="ml-72 flex-1">
            {/* Info Bar */}
            <div className="bg-white/5 border-b border-white/10 px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{active.name}</h2>
                  <p className="text-white/60 text-sm">{active.description}</p>
                </div>
                <div className="flex gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-leader-blue">{active.aida.attention}</div>
                    <div className="text-[10px] text-white/40 uppercase">Attention</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{active.aida.interest}</div>
                    <div className="text-[10px] text-white/40 uppercase">Interest</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{active.aida.desire}</div>
                    <div className="text-[10px] text-white/40 uppercase">Desire</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{active.aida.action}</div>
                    <div className="text-[10px] text-white/40 uppercase">Action</div>
                  </div>
                  <div className="border-l border-white/20 pl-4">
                    <div className="text-2xl font-bold">{aidaScore}/40</div>
                    <div className="text-[10px] text-white/40 uppercase">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className={`${active.bg}`}>
              <ActiveComponent>
                <HeroContent />
              </ActiveComponent>
            </div>

            {/* Usage */}
            <div className="bg-white/5 border-t border-white/10 px-8 py-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">Usage</h4>
              <pre className="text-sm text-white/80 bg-future-black/50 p-4 rounded-lg overflow-x-auto">
                <code>{`import { ${active.component.name || active.name.replace(/\s/g, '')} } from '@/components/ui/BackgroundAnimations'

<${active.component.name || active.name.replace(/\s/g, '')}>
  {/* Your content */}
</${active.component.name || active.name.replace(/\s/g, '')}>`}</code>
              </pre>
            </div>
          </main>
        </div>
      ) : (
        /* Grid View */
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {variations.map((v, i) => {
                const Component = v.component
                const score = v.aida.attention + v.aida.interest + v.aida.desire + v.aida.action
                return (
                  <motion.div
                    key={v.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl overflow-hidden border border-white/10"
                  >
                    {/* Header */}
                    <div className="bg-white/5 px-4 py-3 flex items-center justify-between">
                      <div>
                        <span className="font-medium">{v.name}</span>
                        <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                          score >= 32 ? 'bg-green-500/20 text-green-400' :
                          score >= 28 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-white/10 text-white/60'
                        }`}>
                          AIDA: {score}/40
                        </span>
                      </div>
                      <button
                        onClick={() => { setActiveIndex(i); setViewMode('single'); }}
                        className="text-xs text-leader-blue hover:underline"
                      >
                        View Full →
                      </button>
                    </div>
                    {/* Preview (scaled down) */}
                    <div className={`${v.bg} h-[300px] overflow-hidden`}>
                      <div className="transform scale-[0.5] origin-top-left w-[200%] h-[200%]">
                        <Component>
                          <HeroContent />
                        </Component>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
