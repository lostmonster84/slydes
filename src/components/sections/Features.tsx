'use client'

import { motion } from 'framer-motion'

export function Features() {
  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-[#0A0E27]">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-white">
            Why <span className="gradient-text">Slydes</span>?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Your website was built for desktops. Your customers are on phones.
            Slydes bridges that gap.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* Hero Card - Mobile Native (spans full width on mobile, left column on desktop) */}
          <motion.div
            className="md:row-span-2 bg-gradient-to-br from-leader-blue/20 to-purple-500/10 rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-leader-blue/20 rounded-full blur-3xl group-hover:bg-leader-blue/30 transition-all duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-leader-blue/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-leader-blue font-medium uppercase tracking-wide">Core Feature</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Mobile-native by default</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Built for how people actually use their phones. Vertical scrolling, thumb-friendly navigation, and full-screen video.
              </p>
              
              {/* Mini phone demo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Phone frame */}
                  <div className="w-[120px] h-[240px] bg-black rounded-[1.75rem] p-[3px] shadow-2xl shadow-black/50">
                    {/* Screen */}
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 rounded-[1.5rem] flex flex-col justify-end p-3 text-white relative overflow-hidden">
                      {/* Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-black rounded-full" />
                      
                      <div className="text-[9px] font-bold mb-1">Chef&apos;s Table</div>
                      <div className="text-[7px] text-white/80 mb-2">12-course omakase</div>
                      <div className="w-full bg-white/20 backdrop-blur rounded-full py-1.5 text-[7px] text-center font-medium">
                        View Menu
                      </div>
                      
                      {/* Swipe indicator */}
                      <motion.div 
                        className="absolute left-1/2 -translate-x-1/2 top-1/3"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </motion.div>
                      
                      {/* Home indicator */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['Vertical swipe', 'Thumb-friendly', 'Full-screen video'].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Visual Editor */}
          <motion.div
            className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Visual editor</h3>
                <p className="text-xs text-white/50">Live preview</p>
              </div>
            </div>
            
            <p className="text-white/70 text-sm mb-4">
              What you see is what you get. Edit with a live iPhone preview. No code required, ever.
            </p>
            
            {/* Mini editor preview */}
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#3a3a3a]">
              <div className="bg-[#323232] px-2 py-1.5 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff5f57]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#febc2e]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
                <span className="text-[6px] text-white/40 ml-1">Editor</span>
              </div>
              <div className="flex">
                {/* Sidebar */}
                <div className="w-14 bg-[#2d2d2d] p-1.5 border-r border-[#3a3a3a]">
                  <div className="space-y-1">
                    <div className="h-3 bg-leader-blue rounded text-[5px] text-white flex items-center px-1">Welcome</div>
                    <div className="h-3 bg-white/5 rounded text-[5px] text-white/40 flex items-center px-1">Menu</div>
                  </div>
                </div>
                {/* Preview area */}
                <div className="flex-1 p-2 flex items-center justify-center bg-[#1a1a1a]">
                  <div className="w-10 h-20 bg-black rounded-lg p-[2px]">
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 rounded-[6px] flex flex-col justify-end p-1">
                      <div className="text-[4px] text-white font-medium">Chef&apos;s Table</div>
                      <div className="w-full bg-white/30 rounded-full py-0.5 text-[3px] text-center text-white mt-0.5">View</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3 - One Click Publish */}
          <motion.div
            className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">One click publish</h3>
                <p className="text-xs text-white/50">Instant sharing</p>
              </div>
            </div>
            
            <p className="text-white/70 text-sm mb-4">
              Get a shareable link instantly. Works on every phone. Track views from day one.
            </p>
            
            {/* Share link preview */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-3 h-3 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-[10px] text-white/70 font-mono">slydes.io/your-business</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-6 bg-leader-blue rounded text-[9px] text-white flex items-center justify-center font-medium">
                  Copy Link
                </div>
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
