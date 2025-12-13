'use client'

import { motion } from 'framer-motion'

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
    <section className="py-12 md:py-24 relative overflow-hidden bg-[#0A0E27]">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-white">
            Why <span className="gradient-text">Slydes</span>?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
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
              className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
