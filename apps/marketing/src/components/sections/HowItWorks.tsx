'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { AnimatedGridFade } from '@/components/ui/BackgroundAnimations'
import { EditorFrameStack } from '@/components/ui/EditorMockups'
import { CompositionDarkMode } from '@/components/ui/Compositions'
import { BackgroundDotGrid } from '@/components/ui/BackgroundEffects'

const steps = [
  {
    number: '01',
    title: 'Start with a proven flow',
    description: 'Pick slydes built to do one job: move attention forward.',
    details: ['Hook slydes to capture attention', 'Social proof to build trust', 'Action slydes for conversions'],
  },
  {
    number: '02',
    title: 'Drop in your content. Make it feel alive.',
    description: 'Video first. Text second. Everything built for the phone screen.',
    details: ['Drag-and-drop interface', 'Live iPhone preview', 'Video backgrounds'],
  },
  {
    number: '03',
    title: 'Get AI-powered insights',
    description: 'Momentum AI analyses your Slyde and gives you personalized suggestions to improve performance.',
    details: ['Performance coaching', 'Copy suggestions for CTAs', 'Identifies weak frames', '3 messages/day free'],
  },
  {
    number: '04',
    title: 'Share it where attention already is',
    description: 'Bio links. QR codes. Ads. WhatsApp. SMS. Anywhere people tap, Slydes should open.',
    details: ['Instant publishing', 'Works on every phone', 'One-click copy link'],
  },
  {
    number: '05',
    title: 'Track what works',
    description: 'See exactly where people drop off. Know which frames convert. Fix the leaks, double down on wins.',
    details: ['Frame-by-frame drop-off', 'Traffic source breakdown', 'CTA click tracking', 'Weekly comparisons'],
  },
]

// Step 03 Visual: Momentum AI typing card
function MomentumTypingCard() {
  const fullText = "Your completion rate dropped 12% this week. Frame 4 might be losing people - try shortening the copy."
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let index = 0
    let timeout: NodeJS.Timeout

    const typeNext = () => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1))
        index++
        const delay = fullText[index - 1] === '.' ? 400 : fullText[index - 1] === ',' ? 200 : 30 + Math.random() * 20
        timeout = setTimeout(typeNext, delay)
      } else {
        setIsTyping(false)
        setTimeout(() => {
          setDisplayText('')
          setIsTyping(true)
          index = 0
          timeout = setTimeout(typeNext, 500)
        }, 3000)
      }
    }

    timeout = setTimeout(typeNext, 1000)
    return () => clearTimeout(timeout)
  }, [])

  const renderText = () => {
    const parts = displayText.split(/(12%)/)
    return parts.map((part, i) =>
      part === '12%' ? (
        <span key={i} className="text-amber-400">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full scale-110" />
      <div className="relative bg-[#1e1e1e] rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 p-4 w-[280px]">
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-electric-cyan flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </motion.div>
          <div>
            <div className="text-white text-sm font-medium">Momentum</div>
            <div className="text-purple-400 text-xs">AI insights</div>
          </div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-sm min-h-[80px]">
          <p className="text-white font-medium">
            &quot;{renderText()}
            {isTyping && (
              <motion.span
                className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
            {!isTyping && '\"'}
          </p>
        </div>
        <motion.div
          className="flex gap-2 mt-3"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: isTyping ? 0 : 1, y: isTyping ? 5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <button className="px-3 py-1.5 bg-purple-500/30 text-purple-300 text-xs rounded-lg font-medium">Fix it for me</button>
          <button className="px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-lg">Show stats</button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Step 04 Visual: Before/After
function BeforeAfterVisual() {
  return (
    <div className="flex gap-4 items-end">
      {/* Before - smaller, faded */}
      <div className="opacity-50">
        <div className="text-[10px] text-gray-400 text-center mb-2">Before</div>
        <div className="w-[80px] h-[160px] bg-gray-300 rounded-xl p-1">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-[8px]">Old Site</span>
          </div>
        </div>
      </div>
      {/* Arrow */}
      <motion.div
        className="pb-20"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className="w-8 h-8 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </motion.div>
      {/* After - larger, prominent with glow */}
      <div>
        <div className="text-[10px] text-leader-blue text-center mb-2 font-medium">With Slydes</div>
        <motion.div
          className="relative"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Pulsing Glow */}
          <motion.div
            className="absolute inset-0 bg-rose-500/30 blur-2xl rounded-full scale-110"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="w-[120px] h-[240px] bg-gray-900 rounded-2xl p-1.5 shadow-lg shadow-rose-500/30 relative">
            {/* Animated gradient background */}
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ backgroundSize: '200% 200%' }}
              />
              {/* Floating orb */}
              <motion.div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Content */}
              <div className="relative w-full h-full flex flex-col justify-end p-3 text-white z-10">
                <div className="text-[7px] text-white/80">Florist</div>
                <div className="text-[10px] font-bold mb-1">Bloom Studio</div>
                <div className="text-[6px] text-white/70 mb-2">Shop artisan flowers</div>
                <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Shop Flowers</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Step 05 Visual: Analytics drop-off funnel
function AnalyticsVisual() {
  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Pulsing glow */}
      <motion.div
        className="absolute inset-0 bg-leader-blue/30 blur-3xl rounded-full scale-110"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div className="relative bg-[#1e1e1e] rounded-2xl border border-leader-blue/30 shadow-2xl shadow-leader-blue/20 p-4 w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-sm font-medium">Frame drop-off</span>
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <div className="space-y-2">
          {[
            { name: 'Hero', pct: 100, delay: 0 },
            { name: 'Services', pct: 82, delay: 0.1 },
            { name: 'Pricing', pct: 65, delay: 0.2 },
            { name: 'Reviews', pct: 48, delay: 0.3 },
            { name: 'Book', pct: 41, delay: 0.4 },
          ].map((frame) => (
            <div key={frame.name} className="flex items-center gap-2">
              <span className="text-white/70 text-xs w-14 truncate">{frame.name}</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${frame.pct > 60 ? 'bg-leader-blue' : frame.pct > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${frame.pct}%` }}
                  transition={{ duration: 1, delay: frame.delay, ease: 'easeOut' }}
                  viewport={{ once: false }}
                />
              </div>
              <span className="text-white text-xs w-8 text-right font-medium">{frame.pct}%</span>
            </div>
          ))}
        </div>
        <motion.div
          className="mt-3 pt-3 border-t border-white/10 text-xs text-amber-400 font-medium"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Pricing frame losing 17% - try adding social proof
        </motion.div>
      </div>
    </motion.div>
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
              From idea to live in <span className="gradient-text">minutes</span>.
            </h2>
            <p className="text-gray-600 text-lg">
              No code. No agency. Just build the flow and publish the link.
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
                    {step.number === '01' && (
                      <BackgroundDotGrid>
                        <EditorFrameStack />
                      </BackgroundDotGrid>
                    )}
                    {step.number === '02' && (
                      <div className="relative">
                        {/* Line grid background */}
                        <div className="absolute -inset-8 -z-10 overflow-hidden rounded-3xl">
                          <div
                            className="w-full h-full opacity-10"
                            style={{
                              backgroundImage: `linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)`,
                              backgroundSize: '40px 40px',
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-transparent to-gray-50" />
                        </div>
                        <CompositionDarkMode />
                      </div>
                    )}
                    {step.number === '03' && <MomentumTypingCard />}
                    {step.number === '04' && <BeforeAfterVisual />}
                    {step.number === '05' && <AnalyticsVisual />}
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
