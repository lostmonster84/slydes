'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { EditorFrameStack } from '@/components/ui/EditorMockups'
import { CompositionDarkMode } from '@/components/ui/Compositions'
import { BackgroundDotGrid } from '@/components/ui/BackgroundEffects'
import Link from 'next/link'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Choose your frames',
    description: 'Pick from 11 pre-built frame types. Welcome screens, social proof, CTAs, galleries—each designed to convert mobile visitors.',
    details: [
      'Hook frames to capture attention',
      'Social proof to build trust',
      'Action frames for conversions',
      'Gallery frames for showcasing',
    ],
  },
  {
    number: '02',
    title: 'Add your content',
    description: 'Upload videos, add text, customize colors. Our visual editor shows you exactly how it looks on mobile—no guessing.',
    details: [
      'Drag-and-drop interface',
      'Live iPhone preview',
      'Video backgrounds',
      'One-tap call buttons',
    ],
  },
  {
    number: '03',
    title: 'Share your link',
    description: 'One click to publish. Get a shareable link instantly. Add it to your Instagram bio, print it as a QR code, or embed it anywhere.',
    details: [
      'Instant publishing',
      'Works on every phone',
      'No app download needed',
      'Analytics built in',
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-4">From idea to live in <span className="gradient-text">10 minutes</span></h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                No code. No designer. No months of development. 
                Just drag, drop, and publish.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-20 last:mb-0"
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                    <div className="text-6xl font-bold gradient-text mb-4">{step.number}</div>
                    <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
                    <p className="text-gray-600 mb-6">{step.description}</p>
                    
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
                  <div className={`${index % 2 === 1 ? 'md:order-1' : ''} flex justify-center`}>
                    {/* Step 01: Frame Stack - shows multiple layered frames */}
                    {step.number === '01' && (
                      <BackgroundDotGrid>
                        <EditorFrameStack />
                      </BackgroundDotGrid>
                    )}
                    
                    {/* Step 02: Dark Mode Editor */}
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
                    
                    {/* Step 03: Before/After comparison */}
                    {step.number === '03' && (
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
                        <div className="pb-20">
                          <svg className="w-8 h-8 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                        {/* After - larger, prominent with glow */}
                        <div>
                          <div className="text-[10px] text-leader-blue text-center mb-2 font-medium">With Slydes</div>
                          <div className="relative">
                            {/* Glow */}
                            <div className="absolute inset-0 bg-leader-blue/20 blur-2xl rounded-full scale-110" />
                            <div className="w-[120px] h-[240px] bg-gray-900 rounded-2xl p-1.5 shadow-lg shadow-leader-blue/20 relative">
                              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex flex-col justify-end p-3 text-white">
                                <div className="text-[7px] text-white/60">Available Now</div>
                                <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
                                <div className="text-[6px] text-white/70 mb-2">Highland adventures await</div>
                                <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4">Ready to build your first Slyde?</h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Join our Founding Partners and earn 25% commission for life 
                on every subscriber you refer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/founding-member">
                  <Button size="lg">
                    Become a Founding Partner
                  </Button>
                </Link>
                <Link href="/showcase">
                  <Button variant="secondary" size="lg">
                    See Showcase
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
