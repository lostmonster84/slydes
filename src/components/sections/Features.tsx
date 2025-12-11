'use client'

import { motion } from 'framer-motion'
import { MeshGradient } from '@/components/ui/BackgroundAnimations'

const features = [
  {
    title: 'Mobile-native by default',
    description: 'Built for how people actually use their phones. Vertical scrolling, thumb-friendly navigation, and full-screen video keep people moving toward your booking or checkout.',
  },
  {
    title: 'Visual editor, live preview',
    description: 'What you see is what you get. Edit with a live iPhone preview so you know exactly what customers will see. No code required, ever.',
  },
  {
    title: 'One click to publish',
    description: 'Get a shareable link instantly. It works on every phone with no app to download so more people reach your calls to action. Track views and engagement from day one.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function Features() {
  return (
    <MeshGradient>
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">
            Why <span className="gradient-text">Slydes</span>?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your website was built for desktops. Your customers are on phones.
            Slydes bridges that gap.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        </div>
      </section>
    </MeshGradient>
  )
}
