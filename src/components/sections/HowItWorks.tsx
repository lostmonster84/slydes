'use client'

import { motion } from 'framer-motion'
import { AnimatedGridFade } from '@/components/ui/BackgroundAnimations'

const steps = [
  {
    number: '01',
    title: 'Build your slides',
    description: 'Stack vertical slides like TikTok. Add horizontal frames within each slide for carousels so people swipe through more of your offer.',
    details: ['Hook frames to capture attention', 'Gallery frames for showcasing', 'Action frames for conversions'],
  },
  {
    number: '02',
    title: 'Add your content',
    description: 'Upload videos, add text, customize colors. See changes live in the phone preview so you ship with confidence.',
    details: ['Drag-and-drop interface', 'Live iPhone preview', 'Video backgrounds'],
  },
  {
    number: '03',
    title: 'Share your link',
    description: 'Publish with one click. Share your Slyde from your Instagram bio, QR codes, or emails so visitors land in a mobile experience that converts.',
    details: ['Instant publishing', 'Works on every phone', 'Analytics built in'],
  },
]

// Step 01 Visual: Frame Stack
function FrameStackVisual() {
  return (
    <div className="relative w-[200px] h-[280px]">
      {/* Stacked frames */}
      {[2, 1, 0].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-xl border shadow-lg"
          style={{
            width: 160,
            height: 220,
            left: 20 + i * 12,
            top: 30 - i * 12,
            zIndex: 3 - i,
            background: i === 0 ? 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)' : '#fff',
            borderColor: i === 0 ? 'transparent' : '#e5e7eb',
          }}
          initial={{ opacity: 0, y: 20, rotate: -3 + i * 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3 + i * 2 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
          viewport={{ once: true }}
        >
          {i === 0 && (
            <div className="p-4 text-white h-full flex flex-col justify-end">
              <div className="text-[10px] opacity-70 mb-1">Welcome</div>
              <div className="text-sm font-semibold mb-2">Highland Bites</div>
              <div className="w-full bg-white/20 rounded-full py-1.5 text-[10px] text-center font-medium">
                View Menu
              </div>
            </div>
          )}
          {i === 1 && (
            <div className="p-3">
              <div className="w-full h-16 bg-gray-100 rounded-lg mb-2" />
              <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-2 bg-gray-100 rounded w-1/2" />
            </div>
          )}
          {i === 2 && (
            <div className="p-3">
              <div className="w-full h-12 bg-gray-50 rounded-lg mb-2" />
              <div className="h-2 bg-gray-100 rounded w-2/3" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Step 02 Visual: Mini Editor
function EditorVisual() {
  return (
    <motion.div
      className="w-[240px] bg-[#1e1e1e] rounded-xl border border-[#3a3a3a] shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {/* Toolbar */}
      <div className="bg-[#323232] px-3 py-2 flex items-center gap-1.5 border-b border-[#3a3a3a]">
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="text-[8px] text-white/50 ml-2">Slydes Editor</span>
      </div>
      {/* Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-16 bg-[#2d2d2d] p-2 border-r border-[#3a3a3a]">
          <div className="text-[6px] text-white/40 mb-1">SLIDES</div>
          <div className="space-y-1">
            <div className="h-4 bg-leader-blue rounded text-[6px] text-white flex items-center px-1">Welcome</div>
            <div className="h-4 bg-white/5 rounded text-[6px] text-white/60 flex items-center px-1">Menu</div>
            <div className="h-4 bg-white/5 rounded text-[6px] text-white/60 flex items-center px-1">Contact</div>
          </div>
        </div>
        {/* Preview */}
        <div className="flex-1 p-3 flex items-center justify-center">
          <div className="w-12 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg flex flex-col justify-end p-1.5">
            <div className="text-[5px] text-white/80">Chef&apos;s Table</div>
            <div className="w-full bg-amber-400 rounded-full py-0.5 text-[4px] text-center text-amber-900 font-medium mt-1">
              View
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Step 03 Visual: Before/After
function BeforeAfterVisual() {
  return (
    <div className="flex gap-3 items-end">
      {/* Before */}
      <motion.div
        className="opacity-50"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 0.5, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <div className="text-[8px] text-gray-400 text-center mb-1">Before</div>
        <div className="w-[60px] h-[120px] bg-gray-300 rounded-lg p-1">
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-[6px]">Old Site</span>
          </div>
        </div>
      </motion.div>
      
      {/* Arrow */}
      <motion.div
        className="pb-14"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <svg className="w-6 h-6 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </motion.div>
      
      {/* After */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="text-[8px] text-leader-blue text-center mb-1 font-medium">With Slydes</div>
        <div className="relative">
          <div className="absolute inset-0 bg-leader-blue/20 blur-xl rounded-full scale-110" />
          <div className="w-[90px] h-[180px] bg-gray-900 rounded-xl p-1 shadow-lg shadow-leader-blue/20 relative">
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex flex-col justify-end p-2 text-white">
              <div className="text-[5px] text-white/60">Available Now</div>
              <div className="text-[8px] font-bold mb-0.5">Land Rover</div>
              <div className="text-[5px] text-white/70 mb-1.5">Highland adventures</div>
              <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[6px] font-semibold text-center">
                Book Now
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <AnimatedGridFade>
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4">
              From idea to live in <span className="gradient-text">10 minutes</span>
            </h2>
            <p className="text-gray-600 text-lg">
              No code. No designer. Just drag, drop, and publish.
            </p>
          </motion.div>

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                  {/* Content */}
                  <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                    <div className="text-5xl md:text-6xl font-bold gradient-text mb-3">{step.number}</div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center">
                          <svg className="w-4 h-4 text-leader-blue mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={`flex justify-center ${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                    {step.number === '01' && <FrameStackVisual />}
                    {step.number === '02' && <EditorVisual />}
                    {step.number === '03' && <BeforeAfterVisual />}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedGridFade>
  )
}
