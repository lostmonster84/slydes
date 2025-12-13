'use client'

import { motion } from 'framer-motion'

const features = [
  {
    id: 'mobile',
    title: 'Mobile-native by default',
    description: 'Built for how people actually use their phones. Vertical scrolling, thumb-friendly navigation, and full-screen video keep people moving toward your booking or checkout.',
    points: ['Vertical swipe navigation', 'Thumb-friendly controls', 'Full-screen video'],
  },
  {
    id: 'editor',
    title: 'Visual editor, live preview',
    description: 'What you see is what you get. Edit with a live iPhone preview so you know exactly what customers will see. No code required, ever.',
    points: ['Drag-and-drop interface', 'Real-time preview', 'Zero code required'],
  },
  {
    id: 'publish',
    title: 'One click to publish',
    description: 'Get a shareable link instantly. It works on every phone with no app to download so more people reach your calls to action. Track views and engagement from day one.',
    points: ['Instant shareable link', 'No app download needed', 'Built-in analytics'],
  },
]

// Feature 1: Mobile phone with swipe gesture
function MobileNativeVisual() {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {/* Phone frame */}
      <div className="w-[140px] h-[280px] bg-gray-900 rounded-[2rem] p-1.5 shadow-2xl shadow-leader-blue/20 mx-auto">
        <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 rounded-[1.5rem] flex flex-col justify-between p-3 text-white relative overflow-hidden">
          {/* Content */}
          <div className="text-[8px] text-white/70">Maison Lumière</div>
          <div>
            <div className="text-[10px] font-bold mb-1">Chef&apos;s Table</div>
            <div className="text-[7px] text-white/80 mb-2">12-course omakase</div>
            <div className="w-full bg-white/20 backdrop-blur rounded-full py-1.5 text-[8px] text-center font-medium">
              View Menu
            </div>
          </div>
          
          {/* Swipe indicator */}
          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 bottom-8"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center">
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="text-[6px] text-white/50">Swipe</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Gesture trail */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-4 w-1 h-16 bg-gradient-to-t from-transparent via-white/30 to-transparent rounded-full"
        animate={{ opacity: [0, 0.5, 0], y: [20, -20, 20] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

// Feature 2: Mini dark mode editor
function EditorVisual() {
  return (
    <motion.div
      className="w-[260px] bg-[#1e1e1e] rounded-xl border border-[#3a3a3a] shadow-2xl overflow-hidden mx-auto"
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
        <div className="w-20 bg-[#2d2d2d] p-2 border-r border-[#3a3a3a]">
          <div className="text-[6px] text-white/40 mb-1.5">SLIDES</div>
          <div className="space-y-1">
            <div className="h-5 bg-leader-blue rounded text-[7px] text-white flex items-center px-1.5">Welcome</div>
            <div className="h-5 bg-white/5 rounded text-[7px] text-white/60 flex items-center px-1.5">Menu</div>
            <div className="h-5 bg-white/5 rounded text-[7px] text-white/60 flex items-center px-1.5">Contact</div>
          </div>
        </div>
        {/* Preview */}
        <div className="flex-1 p-4 flex items-center justify-center bg-[#1a1a1a]">
          <div className="w-14 h-28 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg flex flex-col justify-end p-2">
            <div className="text-[5px] text-white/80">Chef&apos;s Table</div>
            <div className="w-full bg-white/30 rounded-full py-0.5 text-[4px] text-center text-white font-medium mt-1">
              View
            </div>
          </div>
        </div>
      </div>
      {/* Live indicator */}
      <div className="bg-[#1e1e1e] border-t border-[#3a3a3a] px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[7px] text-emerald-400">Live Preview</span>
        </div>
        <span className="text-[7px] text-white/40">Auto-saved</span>
      </div>
    </motion.div>
  )
}

// Feature 3: Share link + QR code
function PublishVisual() {
  return (
    <motion.div
      className="flex items-center gap-4 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {/* Link card */}
      <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
        <div className="text-[8px] text-white/50 mb-2">Your Slyde link</div>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
          <svg className="w-3 h-3 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="text-[9px] text-white font-mono">slydes.io/highland</span>
        </div>
        <motion.button 
          className="w-full mt-2 bg-leader-blue text-white text-[8px] font-medium py-1.5 rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Copy Link
        </motion.button>
      </div>
      
      {/* QR Code */}
      <div className="bg-white rounded-xl p-3 shadow-lg">
        <div className="w-16 h-16 bg-gray-900 rounded-lg p-1">
          {/* Simplified QR pattern */}
          <div className="w-full h-full grid grid-cols-5 gap-0.5">
            {[1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1].map((cell, i) => (
              <div key={i} className={`${cell ? 'bg-white' : 'bg-gray-900'} rounded-[1px]`} />
            ))}
          </div>
        </div>
        <div className="text-[6px] text-gray-500 text-center mt-1">Scan to preview</div>
      </div>
    </motion.div>
  )
}

export function Features() {
  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-[#0A0E27]">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
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

        <div className="space-y-20 md:space-y-28">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                {/* Content */}
                <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.points.map((point, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-4 h-4 text-leader-blue mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80 text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className={`flex justify-center ${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                  {feature.id === 'mobile' && <MobileNativeVisual />}
                  {feature.id === 'editor' && <EditorVisual />}
                  {feature.id === 'publish' && <PublishVisual />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
