'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
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
              <h1 className="mb-4">From idea to live in 10 minutes</h1>
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
                className="mb-16 last:mb-0"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                    <div className="text-6xl font-bold text-gray-200 mb-4">{step.number}</div>
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
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm">
                      <div className="aspect-[9/16] bg-gray-100 rounded-xl flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="text-4xl mb-2">
                            {step.number === '01' && '🎨'}
                            {step.number === '02' && '✏️'}
                            {step.number === '03' && '🚀'}
                          </div>
                          <p className="text-sm">Screenshot coming soon</p>
                        </div>
                      </div>
                    </div>
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
                Join our founding members and get lifetime access 
                to the future of mobile-first business sites.
              </p>
              <Link href="/founding-member">
                <Button size="lg">
                  Become a Founding Member
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
