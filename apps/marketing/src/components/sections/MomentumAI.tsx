'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, MessageSquare, Lightbulb } from 'lucide-react'
import { useState, useEffect } from 'react'

/**
 * Typing animation component for AI responses
 */
function TypingMessage({ children, delay = 0 }: { children: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!hasStarted) return

    let index = 0
    let timeout: NodeJS.Timeout

    const typeNext = () => {
      if (index < children.length) {
        setDisplayText(children.slice(0, index + 1))
        index++
        // Variable speed for natural feel
        const char = children[index - 1]
        const baseDelay = char === '.' || char === '!' ? 300 : char === ',' ? 150 : 25 + Math.random() * 15
        timeout = setTimeout(typeNext, baseDelay)
      } else {
        setIsComplete(true)
      }
    }

    timeout = setTimeout(typeNext, 100)
    return () => clearTimeout(timeout)
  }, [children, hasStarted])

  if (!hasStarted) return null

  return (
    <span>
      {displayText}
      {!isComplete && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-white/70 ml-0.5 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </span>
  )
}

/**
 * Interactive chat mockup component - replaces content on button click
 */
function InteractiveChat() {
  const [currentView, setCurrentView] = useState<'initial' | 'fix' | 'stats' | 'orders'>('initial')
  const [showResponse, setShowResponse] = useState(false)

  const handleButtonClick = (view: 'fix' | 'stats' | 'orders') => {
    setCurrentView(view)
    setShowResponse(false)
    // Show AI response after a brief delay
    setTimeout(() => setShowResponse(true), 600)
  }

  // Initial conversation view
  if (currentView === 'initial') {
    return (
      <div className="p-5 space-y-4 min-h-[320px]">
        {/* User message */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-leader-blue text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] text-sm">
            How&apos;s my week looking?
          </div>
        </motion.div>

        {/* AI response */}
        <motion.div
          className="flex justify-start"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-bl-md w-[85%] text-sm space-y-2">
            <p className="text-white/70"><TypingMessage delay={1200}>Your Slyde had a strong week! Here&apos;s the breakdown:</TypingMessage></p>
            <motion.div
              className="bg-white/5 rounded-lg p-3 space-y-2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 3.5 }}
              viewport={{ once: true }}
            >
              {[
                { label: 'Views', value: '+23% ↑', color: 'text-emerald-400', delay: 0 },
                { label: 'CTA clicks', value: '+18% ↑', color: 'text-emerald-400', delay: 0.15 },
                { label: 'Completion', value: '-5% ↓', color: 'text-amber-400', delay: 0.3 },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex justify-between text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 3.7 + stat.delay }}
                  viewport={{ once: true }}
                >
                  <span className="text-white/60">{stat.label}</span>
                  <span className={`${stat.color} font-medium`}>{stat.value}</span>
                </motion.div>
              ))}
            </motion.div>
            <p className="text-white/70">
              <TypingMessage delay={4500}>Completion dipped slightly. Your 4th frame might be losing people - want me to suggest some improvements?</TypingMessage>
            </p>
          </div>
        </motion.div>

        {/* Quick action buttons */}
        <motion.div
          className="flex flex-wrap gap-2 pt-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 8 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => handleButtonClick('fix')}
            className="px-3 py-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 rounded-full text-xs text-white/70 hover:text-purple-300 transition-all cursor-pointer"
          >
            Yes, help me fix it
          </button>
          <button
            onClick={() => handleButtonClick('stats')}
            className="px-3 py-1.5 bg-white/5 hover:bg-electric-cyan/20 border border-white/10 hover:border-electric-cyan/30 rounded-full text-xs text-white/70 hover:text-electric-cyan transition-all cursor-pointer"
          >
            Show me frame stats
          </button>
          <button
            onClick={() => handleButtonClick('orders')}
            className="px-3 py-1.5 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 rounded-full text-xs text-white/70 hover:text-emerald-400 transition-all cursor-pointer"
          >
            How many reservations today?
          </button>
        </motion.div>
      </div>
    )
  }

  // "Fix it" conversation view
  if (currentView === 'fix') {
    return (
      <div className="p-5 space-y-4 min-h-[320px]">
        {/* User message */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-leader-blue text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] text-sm">
            Yes, help me fix it
          </div>
        </motion.div>

        {/* AI response */}
        {showResponse && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-bl-md w-[85%] text-sm space-y-2">
              <p className="text-white/70">
                <TypingMessage delay={0}>Here&apos;s what I&apos;d suggest for Frame 4:</TypingMessage>
              </p>
              <motion.div
                className="bg-white/5 rounded-lg p-3 space-y-2 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">1.</span>
                  <span className="text-white/70">Shorten the headline to under 6 words</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">2.</span>
                  <span className="text-white/70">Add a testimonial for social proof</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">3.</span>
                  <span className="text-white/70">Make the CTA more urgent: &quot;Book Today&quot;</span>
                </div>
              </motion.div>
              <motion.p
                className="text-white/70 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                Want me to rewrite the copy for you?
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Follow-up buttons */}
        <motion.div
          className="flex flex-wrap gap-2 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          <button
            onClick={() => handleButtonClick('stats')}
            className="px-3 py-1.5 bg-white/5 hover:bg-electric-cyan/20 border border-white/10 hover:border-electric-cyan/30 rounded-full text-xs text-white/70 hover:text-electric-cyan transition-all cursor-pointer"
          >
            Show me frame stats
          </button>
          <button
            onClick={() => setCurrentView('initial')}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/50 hover:text-white/70 transition-all cursor-pointer"
          >
            ← Back
          </button>
        </motion.div>
      </div>
    )
  }

  // "Stats" conversation view
  if (currentView === 'stats') {
    return (
      <div className="p-5 space-y-4 min-h-[320px]">
        {/* User message */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-leader-blue text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] text-sm">
            Show me frame stats
          </div>
        </motion.div>

        {/* AI response */}
        {showResponse && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-bl-md w-[85%] text-sm space-y-2">
              <p className="text-white/70">
                <TypingMessage delay={0}>Here&apos;s the frame-by-frame breakdown:</TypingMessage>
              </p>
              <motion.div
                className="bg-white/5 rounded-lg p-3 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {[
                  { frame: 'Welcome', pct: 100, color: 'bg-leader-blue' },
                  { frame: 'Ambiance', pct: 82, color: 'bg-leader-blue' },
                  { frame: 'Menu', pct: 71, color: 'bg-leader-blue' },
                  { frame: 'Cocktails', pct: 52, color: 'bg-amber-500' },
                  { frame: 'Reserve', pct: 45, color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.7 + i * 0.1 }}
                  >
                    <span className="text-white/50 text-[10px] w-14">{item.frame}</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${item.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 0.6, delay: 1.8 + i * 0.1 }}
                      />
                    </div>
                    <span className="text-white/70 text-[10px] w-6">{item.pct}%</span>
                  </motion.div>
                ))}
              </motion.div>
              <motion.p
                className="text-amber-400 text-xs font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
              >
                💡 Cocktails frame losing 19% - biggest drop-off point
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Follow-up buttons */}
        <motion.div
          className="flex flex-wrap gap-2 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2 }}
        >
          <button
            onClick={() => handleButtonClick('fix')}
            className="px-3 py-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 rounded-full text-xs text-white/70 hover:text-purple-300 transition-all cursor-pointer"
          >
            Help me fix it
          </button>
          <button
            onClick={() => handleButtonClick('orders')}
            className="px-3 py-1.5 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 rounded-full text-xs text-white/70 hover:text-emerald-400 transition-all cursor-pointer"
          >
            How many reservations?
          </button>
          <button
            onClick={() => setCurrentView('initial')}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/50 hover:text-white/70 transition-all cursor-pointer"
          >
            ← Back
          </button>
        </motion.div>
      </div>
    )
  }

  // "Orders" conversation view (fallback) - repurposed as reservations for restaurants/experiences
  return (
    <div className="p-5 space-y-4 min-h-[320px]">
      {/* User message */}
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-leader-blue text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] text-sm">
          How many reservations today?
        </div>
      </motion.div>

      {/* AI response */}
      {showResponse && (
        <motion.div
          className="flex justify-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-bl-md w-[85%] text-sm space-y-2">
            <p className="text-white/70">
              <TypingMessage delay={0}>Great day so far! Here&apos;s your reservation summary:</TypingMessage>
            </p>
            <motion.div
              className="bg-white/5 rounded-lg p-3 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Reservations today</span>
                <span className="text-emerald-400 font-bold">24</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Total covers</span>
                <span className="text-emerald-400 font-bold">67</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Most requested</span>
                <span className="text-white/90 font-medium">Chef&apos;s Table</span>
              </div>
            </motion.div>
            <motion.p
              className="text-emerald-400 text-xs font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              📈 That&apos;s 40% more than yesterday!
            </motion.p>
          </div>
        </motion.div>
      )}

      {/* Follow-up buttons */}
      <motion.div
        className="flex flex-wrap gap-2 pt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        <button
          onClick={() => handleButtonClick('stats')}
          className="px-3 py-1.5 bg-white/5 hover:bg-electric-cyan/20 border border-white/10 hover:border-electric-cyan/30 rounded-full text-xs text-white/70 hover:text-electric-cyan transition-all cursor-pointer"
        >
          Show frame stats
        </button>
        <button
          onClick={() => handleButtonClick('fix')}
          className="px-3 py-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 rounded-full text-xs text-white/70 hover:text-purple-300 transition-all cursor-pointer"
        >
          Help me fix it
        </button>
        <button
          onClick={() => setCurrentView('initial')}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/50 hover:text-white/70 transition-all cursor-pointer"
        >
          ← Back
        </button>
      </motion.div>
    </div>
  )
}

export function MomentumAI() {
  return (
    <section className="py-20 md:py-32 bg-future-black relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-electric-cyan/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">AI-Powered</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Meet <span className="bg-gradient-to-r from-purple-400 to-electric-cyan bg-clip-text text-transparent">Momentum</span>
            </h2>

            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Your AI business partner that actually understands your Slyde.
              Get personalized insights, copy suggestions, and performance coaching
              based on your real analytics.
            </p>

            {/* Benefits list */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Performance insights</h3>
                  <p className="text-white/60 text-sm">&quot;Your completion rate dropped 12% this week. Frame 3 might be the issue.&quot;</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-electric-cyan/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-electric-cyan" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Copy suggestions</h3>
                  <p className="text-white/60 text-sm">&quot;Your CTA could be stronger. Try: &apos;Reserve a table&apos; instead of &apos;Learn more&apos;.&quot;</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-leader-blue/20 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-leader-blue" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Growth coaching</h3>
                  <p className="text-white/60 text-sm">&quot;Based on your traffic sources, double down on Instagram bio links.&quot;</p>
                </div>
              </div>
            </div>

            {/* Tier info */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-white/60 text-sm">3 messages/day free</span>
              <span className="text-white/30">•</span>
              <span className="text-electric-cyan text-sm font-medium">Unlimited on Pro</span>
            </div>
          </motion.div>

          {/* Right: Chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-electric-cyan/20 rounded-3xl blur-2xl scale-95" />

            {/* Chat interface mockup */}
            <div className="relative bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#2d2d2d] px-5 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-electric-cyan flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Momentum</div>
                  <div className="text-white/40 text-xs">Your AI partner</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs">Online</span>
                </div>
              </div>

              {/* Interactive Chat */}
              <InteractiveChat />

              {/* Input area */}
              <div className="bg-[#2d2d2d] px-4 py-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Ask Momentum anything..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                    disabled
                  />
                  <button className="w-10 h-10 bg-gradient-to-r from-purple-500 to-electric-cyan rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
