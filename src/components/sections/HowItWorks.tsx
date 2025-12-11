'use client'

import { motion } from 'framer-motion'
import { AnimatedGridFade } from '@/components/ui/BackgroundAnimations'

const steps = [
  {
    number: '1',
    title: 'Build your slides',
    description: 'Stack vertical slides like TikTok. Add horizontal frames within each slide for carousels.',
  },
  {
    number: '2',
    title: 'Add your content',
    description: 'Upload videos, add text, customize colors. See changes live in the phone preview.',
  },
  {
    number: '3',
    title: 'Share your link',
    description: 'One click to publish. Share your Slyde anywhere—Instagram bio, QR codes, emails.',
  },
]

export function HowItWorks() {
  return (
    <AnimatedGridFade>
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
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

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-6 items-start"
            >
              {/* Simple number */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-900">{step.number}</span>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </section>
    </AnimatedGridFade>
  )
}
