'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function InvestorsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [enquiryStatus, setEnquiryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [enquiryMessage, setEnquiryMessage] = useState('')

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check password against API
    try {
      const response = await fetch('/api/investor-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        setPasswordError('')
      } else {
        setPasswordError('Incorrect password')
      }
    } catch {
      setPasswordError('Something went wrong. Please try again.')
    }
  }

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnquiryStatus('loading')

    try {
      const response = await fetch('/api/investor-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryForm),
      })

      const data = await response.json()

      if (response.ok) {
        setEnquiryStatus('success')
        setEnquiryMessage(data.message || 'Thanks! We\'ll be in touch soon.')
      } else {
        setEnquiryStatus('error')
        setEnquiryMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setEnquiryStatus('error')
      setEnquiryMessage('Something went wrong. Please try again.')
    }
  }

  // If authenticated, show full investor content
  if (isAuthenticated) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 min-h-screen">
          {/* Hero Section */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-future-black to-gray-900 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-leader-blue/20 rounded-full blur-[120px]" />
            
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/20 text-white text-sm font-medium mb-8">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  Seed Investment
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Invest in the future of<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-leader-blue to-cyan-400">mobile business sites</span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Slydes is building the platform that turns every business into a mobile-first experience. 
                  We&apos;re raising to accelerate growth.
                </p>
              </motion.div>
            </div>
          </section>

          {/* The Opportunity */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">The Opportunity</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  60%+ of web traffic is mobile. Yet most business websites are still desktop-first. 
                  We&apos;re fixing that.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                  {
                    stat: '$223M',
                    label: 'TAM',
                    desc: 'Total addressable market in mobile-first business solutions',
                  },
                  {
                    stat: '60%+',
                    label: 'Mobile Traffic',
                    desc: 'Of all web traffic now comes from mobile devices',
                  },
                  {
                    stat: '5-10x',
                    label: 'Engagement',
                    desc: 'Higher engagement vs traditional mobile sites',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200"
                  >
                    <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{item.stat}</p>
                    <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">{item.label}</p>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Slydes */}
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Slydes</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'Category Creation',
                    desc: 'We\'re not competing in an existing market. We\'re creating a new category: TikTok-style vertical experiences for businesses.',
                    icon: '🎯',
                  },
                  {
                    title: 'Behavioral Shift',
                    desc: 'TikTok trained billions to expect vertical, swipeable content. Businesses need to meet customers where they are.',
                    icon: '📱',
                  },
                  {
                    title: 'Distribution Engine',
                    desc: 'Our Founding Partner program turns influencers into distribution. 50 partners = 50 marketing engines.',
                    icon: '🚀',
                  },
                  {
                    title: 'Recurring Revenue',
                    desc: 'SaaS model with strong retention. Once embedded, Slydes becomes essential infrastructure.',
                    icon: '💎',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-2xl border border-gray-200"
                  >
                    <span className="text-3xl mb-4 block">{item.icon}</span>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* The Ask */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">The Ask</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  We&apos;re raising a seed round to accelerate product development and go-to-market. 
                  If you believe in the mobile-first future, let&apos;s talk.
                </p>
                
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-8">
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Stage</p>
                      <p className="text-lg font-semibold">Pre-Seed / Seed</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Use of Funds</p>
                      <p className="text-lg font-semibold">Product + GTM</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link href="/contact">
                    <Button size="lg" className="w-full md:w-auto">
                      Get in Touch
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-500">
                    Or email directly: <a href="mailto:invest@slydes.io" className="text-leader-blue hover:underline">invest@slydes.io</a>
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* What We've Built */}
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What We&apos;ve Built</h2>
                <p className="text-gray-600">Traction and progress to date</p>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { metric: 'Live', label: 'Product Status', desc: 'MVP in production' },
                  { metric: '50', label: 'Partner Spots', desc: 'Founding Partner program' },
                  { metric: '200+', label: 'Waitlist', desc: 'Pre-launch signups' },
                  { metric: '1', label: 'Live Customer', desc: 'WildTrax 4x4' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-xl border border-gray-200 text-center"
                  >
                    <p className="text-3xl font-bold text-leader-blue mb-1">{item.metric}</p>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 md:py-24 bg-future-black relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-leader-blue/20 rounded-full blur-[100px]" />
            
            <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Let&apos;s build the future together
                </h2>
                <p className="text-gray-300 mb-8 text-lg">
                  If you&apos;re an angel investor, fund, or strategic partner interested in the 
                  mobile-first future, we&apos;d love to connect.
                </p>
                <Link href="/contact">
                  <Button size="lg">
                    Start the Conversation
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

  // Public view - Enquiry gate
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-future-black via-gray-900 to-future-black relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-leader-blue/10 rounded-full blur-[150px]" />
        
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/20 text-white text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              Investment Opportunity
            </span>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Interested in<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-leader-blue to-cyan-400">investing in Slydes?</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-xl mx-auto">
              We&apos;re raising a seed round to accelerate the mobile-first revolution. 
              Request access to our investor materials.
            </p>
          </motion.div>

          {/* Two options: Enquire or Enter Password */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-4">Request Access</h2>
              <p className="text-gray-300 text-sm mb-6">
                Tell us about yourself and we&apos;ll share our investor deck.
              </p>

              {enquiryStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-leader-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Request Received</h3>
                  <p className="text-gray-300 text-sm">{enquiryMessage}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 min-h-[48px] bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-leader-blue focus:ring-1 focus:ring-leader-blue outline-none transition-all"
                    style={{ fontSize: '16px' }}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 min-h-[48px] bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-leader-blue focus:ring-1 focus:ring-leader-blue outline-none transition-all"
                    style={{ fontSize: '16px' }}
                  />
                  <input
                    type="text"
                    placeholder="Company / Fund (optional)"
                    value={enquiryForm.company}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, company: e.target.value })}
                    className="w-full px-4 py-3 min-h-[48px] bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-leader-blue focus:ring-1 focus:ring-leader-blue outline-none transition-all"
                    style={{ fontSize: '16px' }}
                  />
                  <textarea
                    placeholder="Brief message (optional)"
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-leader-blue focus:ring-1 focus:ring-leader-blue outline-none transition-all resize-none"
                    style={{ fontSize: '16px' }}
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={enquiryStatus === 'loading'}
                  >
                    {enquiryStatus === 'loading' ? 'Sending...' : 'Request Access'}
                  </Button>
                  {enquiryStatus === 'error' && (
                    <p className="text-red-400 text-sm text-center">{enquiryMessage}</p>
                  )}
                </form>
              )}
            </motion.div>

            {/* Password Entry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-4">Already have access?</h2>
              <p className="text-gray-300 text-sm mb-6">
                Enter your password to view investor materials.
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 min-h-[48px] bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-leader-blue focus:ring-1 focus:ring-leader-blue outline-none transition-all"
                  style={{ fontSize: '16px' }}
                />
                <Button type="submit" variant="secondary" size="lg" className="w-full">
                  Access Materials
                </Button>
                {passwordError && (
                  <p className="text-red-400 text-sm text-center">{passwordError}</p>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <p className="text-gray-400 text-xs text-center">
                  Passwords are shared after we review your enquiry.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Brief teaser */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-400 text-sm mb-6">What you&apos;ll learn about:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Market Opportunity', 'Product Vision', 'Traction', 'The Ask', 'Team'].map((item) => (
                <span key={item} className="px-3 py-1.5 bg-gray-800/50 rounded-full text-gray-300 text-sm border border-gray-700/50">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
