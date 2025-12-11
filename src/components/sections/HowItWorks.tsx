'use client'

import { motion } from 'framer-motion'
import { AnimatedGridFade } from '@/components/ui/BackgroundAnimations'

const steps = [
  {
    number: '1',
    title: 'Build your slides',
    description: 'Stack vertical slides like TikTok. Add horizontal frames within each slide for carousels so people swipe through more of your offer.',
  },
  {
    number: '2',
    title: 'Add your content',
    description: 'Upload videos, add text, customize colors. See changes live in the phone preview so you ship with confidence.',
  },
  {
    number: '3',
    title: 'Share your link',
    description: 'Publish with one click. Share your Slyde from your Instagram bio, QR codes, or emails so visitors land in a mobile experience that converts.',
  },
]

export function HowItWorks() {
  return (
    <AnimatedGridFade>
      <section className="py-24 relative overflow-hidden">
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

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[27px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-leader-blue via-cyan-400 to-purple-400 opacity-20" />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start relative"
              >
                {/* Bold gradient number */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white shadow-lg shadow-leader-blue/10 border border-gray-100 flex items-center justify-center relative z-10">
                  <span className="text-2xl font-bold gradient-text">{step.number}</span>
                </div>
                
                {/* Content */}
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </section>
    </AnimatedGridFade>
  )
}
