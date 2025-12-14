'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Import all components
import { 
  EditorSideBySide, 
  EditorStacked, 
  EditorToolbar, 
  EditorBeforeAfter, 
  EditorFrameStack 
} from '@/components/ui/EditorMockups'

import { 
  DepthGlow, 
  Depth3DTilt, 
  DepthLayered, 
  DepthColorShadow, 
  DepthFloating 
} from '@/components/ui/DepthWrappers'

import { 
  BackgroundDotGrid, 
  BackgroundConcentricCircles, 
  BackgroundGradientOrbs, 
  BackgroundLineGrid, 
  BackgroundAbstractShapes 
} from '@/components/ui/BackgroundEffects'

import { 
  PhoneIPhone, 
  PhoneMinimal, 
  PhoneBrowser, 
  PhoneWithHand, 
  PhoneWithIcons,
  PhoneMini,
  PhoneDramatic
} from '@/components/ui/PhonePreviews'

import { 
  CompositionSidePanel, 
  CompositionTimeline, 
  CompositionDarkMode, 
  CompositionGlass 
} from '@/components/ui/Compositions'

// Sample content for depth wrappers
function SampleCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 w-64">
      <div className="text-sm text-gray-500 mb-2">Sample Card</div>
      <div className="font-bold text-gray-900">Content Here</div>
    </div>
  )
}

// Component categories
const categories = [
  {
    id: 'editors',
    name: 'Editor Mockups',
    description: 'Different editor UI layouts for showing the Slydes builder',
    file: 'src/components/ui/EditorMockups.tsx',
    components: [
      { name: 'EditorSideBySide', component: EditorSideBySide, description: 'Controls left, phone right' },
      { name: 'EditorStacked', component: EditorStacked, description: 'Phone on top, icon controls below' },
      { name: 'EditorToolbar', component: EditorToolbar, description: 'Phone with floating action bar' },
      { name: 'EditorBeforeAfter', component: EditorBeforeAfter, description: 'Old site vs Slydes comparison' },
      { name: 'EditorFrameStack', component: EditorFrameStack, description: 'Multiple layered frames' },
    ],
  },
  {
    id: 'depth',
    name: 'Depth Wrappers',
    description: 'Wrap any component to add depth and dimension',
    file: 'src/components/ui/DepthWrappers.tsx',
    components: [
      { name: 'DepthGlow', component: () => <DepthGlow><SampleCard /></DepthGlow>, description: 'Soft gradient glow behind' },
      { name: 'Depth3DTilt', component: () => <Depth3DTilt><SampleCard /></Depth3DTilt>, description: '3D perspective with hover' },
      { name: 'DepthLayered', component: () => <DepthLayered><SampleCard /></DepthLayered>, description: 'Stacked card shadows' },
      { name: 'DepthColorShadow', component: () => <DepthColorShadow><SampleCard /></DepthColorShadow>, description: 'Dramatic blue shadow' },
      { name: 'DepthFloating', component: () => <DepthFloating><SampleCard /></DepthFloating>, description: 'Floating animation + reflection' },
    ],
  },
  {
    id: 'backgrounds',
    name: 'Background Effects',
    description: 'Add visual interest behind components',
    file: 'src/components/ui/BackgroundEffects.tsx',
    components: [
      { name: 'BackgroundDotGrid', component: () => <BackgroundDotGrid><SampleCard /></BackgroundDotGrid>, description: 'Dot pattern backdrop' },
      { name: 'BackgroundConcentricCircles', component: () => <BackgroundConcentricCircles><SampleCard /></BackgroundConcentricCircles>, description: 'Radiating rings' },
      { name: 'BackgroundGradientOrbs', component: () => <BackgroundGradientOrbs><SampleCard /></BackgroundGradientOrbs>, description: 'Animated floating orbs' },
      { name: 'BackgroundLineGrid', component: () => <BackgroundLineGrid><SampleCard /></BackgroundLineGrid>, description: 'Crosshatch pattern' },
      { name: 'BackgroundAbstractShapes', component: () => <BackgroundAbstractShapes><SampleCard /></BackgroundAbstractShapes>, description: 'Floating geometric shapes' },
    ],
  },
  {
    id: 'phones',
    name: 'Phone Previews',
    description: 'Different phone mockup styles',
    file: 'src/components/ui/PhonePreviews.tsx',
    components: [
      { name: 'PhoneIPhone', component: PhoneIPhone, description: 'Standard iPhone with notch' },
      { name: 'PhoneMinimal', component: PhoneMinimal, description: 'Simple flat frame' },
      { name: 'PhoneBrowser', component: PhoneBrowser, description: 'Browser chrome instead of phone' },
      { name: 'PhoneWithHand', component: PhoneWithHand, description: 'Hand holding gesture' },
      { name: 'PhoneWithIcons', component: PhoneWithIcons, description: 'Floating app icons' },
      { name: 'PhoneMini', component: PhoneMini, description: 'Small inline preview' },
      { name: 'PhoneDramatic', component: PhoneDramatic, description: 'Large with glow + 3D tilt' },
    ],
  },
  {
    id: 'compositions',
    name: 'Compositions',
    description: 'Complete composed layouts',
    file: 'src/components/ui/Compositions.tsx',
    components: [
      { name: 'CompositionSidePanel', component: CompositionSidePanel, description: 'Info cards + phone' },
      { name: 'CompositionTimeline', component: CompositionTimeline, description: 'Step indicator flow' },
      { name: 'CompositionDarkMode', component: CompositionDarkMode, description: 'Dark theme editor' },
      { name: 'CompositionGlass', component: CompositionGlass, description: 'Glassmorphism card' },
    ],
  },
]

export default function ComponentLibraryPage() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [activeComponent, setActiveComponent] = useState(0)
  const [copied, setCopied] = useState(false)
  
  const category = categories[activeCategory]
  const component = category.components[activeComponent]
  const Component = component.component

  const copyImport = () => {
    const importStatement = `import { ${component.name} } from '@/components/ui/${category.file.split('/').pop()?.replace('.tsx', '')}'`
    navigator.clipboard.writeText(importStatement)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
          <h1 className="text-lg font-bold">Component Library</h1>
          <div className="text-xs text-white/40">{categories.reduce((acc, c) => acc + c.components.length, 0)} components</div>
        </div>
      </header>
      
      {/* Sidebar + Content */}
      <div className="pt-20 flex">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-20 bottom-0 bg-white/5 border-r border-white/10 overflow-y-auto">
          <nav className="p-4">
            {categories.map((cat, catIndex) => (
              <div key={cat.id} className="mb-6">
                <button
                  onClick={() => { setActiveCategory(catIndex); setActiveComponent(0); }}
                  className={`text-xs font-bold uppercase tracking-wider mb-2 block w-full text-left ${
                    activeCategory === catIndex ? 'text-leader-blue' : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  {cat.name}
                </button>
                {activeCategory === catIndex && (
                  <div className="space-y-1">
                    {cat.components.map((comp, compIndex) => (
                      <button
                        key={comp.name}
                        onClick={() => setActiveComponent(compIndex)}
                        className={`text-sm block w-full text-left px-3 py-1.5 rounded transition-colors ${
                          activeComponent === compIndex
                            ? 'bg-leader-blue text-white'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {comp.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          {/* Category Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
            <p className="text-white/60 mb-2">{category.description}</p>
            <code className="text-xs text-leader-blue bg-white/5 px-2 py-1 rounded">{category.file}</code>
          </div>
          
          {/* Component Info */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{component.name}</h3>
              <p className="text-white/60 text-sm">{component.description}</p>
            </div>
            <button
              onClick={copyImport}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Import
                </>
              )}
            </button>
          </div>
          
          {/* Preview */}
          <div className="bg-gray-100 rounded-2xl p-12 min-h-[400px] flex items-center justify-center mb-8">
            <Component />
          </div>
          
          {/* Usage */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">Usage</h4>
            <pre className="text-sm text-white/80 whitespace-pre-wrap break-words">
              <code>{`import { ${component.name} } from '@/components/ui/${category.file.split('/').pop()?.replace('.tsx', '')}'

// In your component:
<${component.name} />`}</code>
            </pre>
          </div>
          
          {/* All Components in Category */}
          <div className="mt-12">
            <h4 className="text-lg font-bold mb-6">All {category.name}</h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {category.components.map((comp, i) => {
                const Comp = comp.component
                return (
                  <button
                    key={comp.name}
                    onClick={() => setActiveComponent(i)}
                    className={`bg-gray-100 rounded-xl p-6 transition-all hover:scale-[1.02] text-left ${
                      activeComponent === i ? 'ring-2 ring-leader-blue' : ''
                    }`}
                  >
                    <div className="h-48 flex items-center justify-center overflow-hidden mb-4">
                      <div className="transform scale-[0.4] origin-center">
                        <Comp />
                      </div>
                    </div>
                    <div className="text-future-black font-medium text-sm">{comp.name}</div>
                    <div className="text-gray-500 text-xs">{comp.description}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}




