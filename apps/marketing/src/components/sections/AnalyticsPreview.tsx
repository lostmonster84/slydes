'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingDown, MousePointerClick, Globe } from 'lucide-react'

export function AnalyticsPreview() {
  return (
    <section className="py-20 md:py-32 bg-future-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-leader-blue/10 rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-leader-blue/10 border border-leader-blue/20 rounded-full mb-6">
              <BarChart3 className="w-4 h-4 text-leader-blue" />
              <span className="text-sm font-medium text-leader-blue">Analytics</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Know exactly where they <span className="gradient-text">drop off</span>
            </h2>

            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              See which frames keep attention and which lose it.
              Track every swipe, every tap, every conversion.
              Fix the leaks, double down on what works.
            </p>

            {/* Features list */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Frame-by-frame drop-off</h3>
                  <p className="text-white/60 text-sm">See exactly where people leave. Fix the weak spots.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <MousePointerClick className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">CTA performance</h3>
                  <p className="text-white/60 text-sm">Which buttons get clicked? Which CTAs convert?</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Traffic sources</h3>
                  <p className="text-white/60 text-sm">Bio link? QR code? Ads? Know where your traffic comes from.</p>
                </div>
              </div>
            </div>

            {/* Tier info */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-white/60 text-sm">Basic on Creator</span>
              <span className="text-white/30">•</span>
              <span className="text-electric-cyan text-sm font-medium">Advanced on Pro</span>
            </div>
          </motion.div>

          {/* Right: Analytics mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-leader-blue/20 to-purple-500/20 rounded-3xl blur-2xl scale-95" />

            {/* Analytics dashboard mockup */}
            <div className="relative bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#2d2d2d] px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-leader-blue flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Analytics</div>
                    <div className="text-white/40 text-xs">The Kitchen Table</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-white/10 text-white/70 text-xs rounded-lg">This week</button>
                  <button className="px-3 py-1.5 bg-leader-blue text-white text-xs rounded-lg">vs Last week</button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-white/50 text-xs mb-1">Views</div>
                    <div className="text-xl font-bold text-white">1,247</div>
                    <div className="text-emerald-400 text-xs mt-1">+23%</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-white/50 text-xs mb-1">Completion</div>
                    <div className="text-xl font-bold text-white">68%</div>
                    <div className="text-amber-400 text-xs mt-1">-5%</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-white/50 text-xs mb-1">CTA clicks</div>
                    <div className="text-xl font-bold text-white">89</div>
                    <div className="text-emerald-400 text-xs mt-1">+18%</div>
                  </div>
                </div>

                {/* Drop-off funnel with animated bars */}
                <div className="bg-white/5 rounded-xl p-4">
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
                      { frame: 'Welcome', viewers: 100, color: 'bg-leader-blue', delay: 0 },
                      { frame: 'Ambiance', viewers: 86, color: 'bg-leader-blue', delay: 0.1 },
                      { frame: 'Menu', viewers: 74, color: 'bg-leader-blue', delay: 0.2 },
                      { frame: 'Cocktails', viewers: 59, color: 'bg-amber-500', delay: 0.3 },
                      { frame: 'Reserve', viewers: 46, color: 'bg-emerald-500', delay: 0.4 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-white/50 text-xs w-16 truncate">{item.frame}</span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${item.color} rounded-full`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.viewers}%` }}
                            transition={{ duration: 1, delay: item.delay, ease: 'easeOut' }}
                            viewport={{ once: false }}
                          />
                        </div>
                        <span className="text-white text-xs w-8 text-right font-medium">{item.viewers}%</span>
                      </div>
                    ))}
                  </div>
                  <motion.div
                    className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-amber-400 text-xs font-medium">Cocktails frame losing 15% - consider shortening</span>
                  </motion.div>
                </div>

                {/* Traffic sources */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-white text-sm font-medium mb-3">Traffic sources</div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-leader-blue" />
                      <span className="text-white/70 text-xs">Bio link</span>
                      <span className="text-white text-xs font-medium ml-auto">52%</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-electric-cyan" />
                      <span className="text-white/70 text-xs">QR code</span>
                      <span className="text-white text-xs font-medium ml-auto">31%</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-white/70 text-xs">Direct</span>
                      <span className="text-white text-xs font-medium ml-auto">17%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
