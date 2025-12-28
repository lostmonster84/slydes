'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/ui/ContactModal'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface FormData {
  name: string
  email: string
  businessName: string
  website: string
  // Social toggle states
  instagramEnabled: boolean
  tiktokEnabled: boolean
  youtubeEnabled: boolean
  twitterEnabled: boolean
  // Social handle values
  instagramUrl: string
  tiktokUrl: string
  youtubeUrl: string
  twitterUrl: string
  industry: string
  audienceSize: string
  whyPartner: string
}

function EarningsCalculator() {
  const [subscribers, setSubscribers] = useState(50)
  const monthlyEarnings = subscribers * 4.75 // £4.75 minimum commission per sub
  const yearlyEarnings = monthlyEarnings * 12

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
      <p className="text-white text-sm mb-4 text-center font-medium">Calculate your earnings</p>
      
      {/* Slider */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300">Subscribers you refer:</span>
          <span className="text-white font-bold text-lg">{subscribers}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={subscribers}
          onChange={(e) => setSubscribers(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-leader-blue"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>1,000</span>
        </div>
      </div>

      {/* Earnings Display */}
      <div className="bg-gray-900/50 rounded-lg p-4 text-center">
        <p className="text-gray-300 text-xs mb-1">Your potential earnings</p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-3xl font-bold text-white">£{monthlyEarnings.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-gray-300">/month</span>
        </div>
        <p className="text-cyan-400 text-sm mt-1">
          £{yearlyEarnings.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year
        </p>
      </div>

      {/* Conversion hint */}
      <p className="text-gray-400 text-xs text-center mt-3">
        Based on £4.75 (~$6 USD) minimum commission per subscriber
      </p>
    </div>
  )
}

export default function AffiliatesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})


  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) newErrors.name = 'Name is required'
    if (!formData.email?.trim()) newErrors.email = 'Email is required'
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.businessName?.trim()) newErrors.businessName = 'Brand or account name is required'

    // Require at least one social enabled WITH a handle
    const hasValidSocial =
      (formData.instagramEnabled && formData.instagramUrl?.trim()) ||
      (formData.tiktokEnabled && formData.tiktokUrl?.trim()) ||
      (formData.youtubeEnabled && formData.youtubeUrl?.trim()) ||
      (formData.twitterEnabled && formData.twitterUrl?.trim())
    if (!hasValidSocial) newErrors.socialProfiles = 'Enable at least one platform and provide your handle'

    if (!formData.industry) newErrors.industry = 'Please select your industry'
    if (!formData.audienceSize) newErrors.audienceSize = 'Please select your audience size'
    if (!formData.whyPartner?.trim()) newErrors.whyPartner = 'Please tell us why you want to partner'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const toggleSocial = (platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter') => {
    const enabledKey = `${platform}Enabled` as keyof FormData
    setFormData(prev => ({
      ...prev,
      [enabledKey]: !prev[enabledKey]
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/partner-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        const data = await response.json()
        alert(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white relative overflow-hidden">
          <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Application <span className="gradient-text">Received!</span>
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Thanks for applying to become an Affiliate. We review every application personally.
                </p>
                
                <div className="text-left bg-gray-50 rounded-2xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">What happens next:</h3>
                  <ul className="space-y-3 text-gray-600">
                    {[
                      'We\'ll review your application within 48 hours',
                      'If approved, you\'ll receive your affiliate dashboard access',
                      'We\'ll set up your unique referral link',
                      'Start earning 25% on every subscriber you refer',
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <span className="text-leader-blue font-bold mr-3">{i + 1}.</span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm text-gray-500">
                  Questions?{' '}
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="text-leader-blue hover:underline"
                  >
                    Send us a message
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />

        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          type="affiliate"
        />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-gradient-to-b from-white via-blue-50/30 to-white min-h-screen relative overflow-hidden">

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Affiliate Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-leader-blue rounded-full animate-pulse" />
              Affiliate Program
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Promote Slydes.<br />
              <span className="gradient-text">Earn 25% for life.</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Join our affiliate program. 
              You promote Slydes. You earn commission on every conversion. Simple.
            </p>
            <p className="text-leader-blue font-semibold text-lg">
              From £4.75 <span className="text-gray-400 font-normal">(~$6 USD)</span> per subscriber per month. Forever.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Value Props */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Commission Card */}
              <div className="bg-future-black rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-cyan-400 text-sm font-medium mb-1">Affiliate Commission</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">25%</span>
                      <span className="text-gray-300">for life</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Open</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">applications</p>
                  </div>
                </div>
                
                {/* Interactive Earnings Calculator */}
                <EarningsCalculator />
              </div>

              {/* What You Get */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                  <span className="text-leader-blue">✦</span> What You Get
                </h3>
                <ul className="space-y-4">
                  {[
                    { title: '25% commission for life', desc: 'On every paying subscriber you refer. Recurring forever.' },
                    { title: 'Unique referral link', desc: 'slydes.io/?ref=yourname to track all conversions' },
                    { title: 'Partner dashboard', desc: 'Real-time tracking: clicks, signups, conversions, earnings' },
                    { title: 'Monthly payouts', desc: 'Paid on the 1st via Stripe Connect or PayPal' },
                    { title: 'Lifetime Pro access', desc: 'Full Slydes Pro features, free forever' },
                    { title: 'Direct founder access', desc: 'Private Slack channel with James' },
                    { title: 'Featured showcase', desc: 'Your Slyde featured on slydes.io' },
                    { title: 'Early access', desc: 'New features before anyone else' },
                  ].map((item, i) => (
                    <motion.li 
                      key={item.title}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-leader-blue/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{item.title}</span>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* What We Ask */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-medium mb-3 text-gray-900 text-sm flex items-center gap-2">
                  <span className="text-leader-blue">↔</span> What We Ask
                </h3>
                <ul className="space-y-3">
                  {[
                    'Create a Slyde for your brand/business',
                    'Share your referral link on your primary platform',
                    'Post about Slydes at least once per quarter',
                    'Disclose partnership per FTC guidelines',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Right Column - Application Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl sticky top-28">
                <h2 className="text-xl font-semibold mb-2 text-center">Apply to become an Affiliate</h2>
                <p className="text-gray-500 text-sm text-center mb-6">We review every application personally</p>
                
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 min-h-[48px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Your name"
                      style={{ fontSize: '16px' }}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 min-h-[48px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="you@example.com"
                      style={{ fontSize: '16px' }}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Business/Brand Name */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Brand or account name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      value={formData.businessName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-4 py-3 min-h-[48px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Your brand, business, or creator name"
                      style={{ fontSize: '16px' }}
                    />
                    {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                  </div>

                  {/* Website */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Website
                    </label>
                    <input
                      type="text"
                      id="website"
                      value={formData.website || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 min-h-[48px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="https://yourbusiness.com"
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  {/* Social Profiles - Toggle to Enable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social profiles <span className="text-gray-400 font-normal">(select platforms you&apos;re on)</span>
                    </label>
                    <div className="space-y-3">
                      {/* Instagram */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSocial('instagram')}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                            formData.instagramEnabled
                              ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <svg className={`w-5 h-5 ${formData.instagramEnabled ? 'text-white' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </button>
                        <input
                          type="text"
                          disabled={!formData.instagramEnabled}
                          value={formData.instagramUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                          className={`flex-1 px-4 py-3 min-h-[48px] border rounded-xl transition-all ${
                            formData.instagramEnabled
                              ? 'bg-white border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900 placeholder:text-gray-400'
                              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          placeholder={formData.instagramEnabled ? '@yourhandle' : 'Click icon to enable'}
                          style={{ fontSize: '16px' }}
                        />
                      </div>

                      {/* TikTok */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSocial('tiktok')}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                            formData.tiktokEnabled
                              ? 'bg-black'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <svg className={`w-5 h-5 ${formData.tiktokEnabled ? 'text-white' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                        </button>
                        <input
                          type="text"
                          disabled={!formData.tiktokEnabled}
                          value={formData.tiktokUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, tiktokUrl: e.target.value }))}
                          className={`flex-1 px-4 py-3 min-h-[48px] border rounded-xl transition-all ${
                            formData.tiktokEnabled
                              ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-900 placeholder:text-gray-400'
                              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          placeholder={formData.tiktokEnabled ? '@yourhandle' : 'Click icon to enable'}
                          style={{ fontSize: '16px' }}
                        />
                      </div>

                      {/* YouTube */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSocial('youtube')}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                            formData.youtubeEnabled
                              ? 'bg-red-600'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <svg className={`w-5 h-5 ${formData.youtubeEnabled ? 'text-white' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </button>
                        <input
                          type="text"
                          disabled={!formData.youtubeEnabled}
                          value={formData.youtubeUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                          className={`flex-1 px-4 py-3 min-h-[48px] border rounded-xl transition-all ${
                            formData.youtubeEnabled
                              ? 'bg-white border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-gray-900 placeholder:text-gray-400'
                              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          placeholder={formData.youtubeEnabled ? '@yourchannel' : 'Click icon to enable'}
                          style={{ fontSize: '16px' }}
                        />
                      </div>

                      {/* X/Twitter */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSocial('twitter')}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                            formData.twitterEnabled
                              ? 'bg-black'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <svg className={`w-5 h-5 ${formData.twitterEnabled ? 'text-white' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </button>
                        <input
                          type="text"
                          disabled={!formData.twitterEnabled}
                          value={formData.twitterUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                          className={`flex-1 px-4 py-3 min-h-[48px] border rounded-xl transition-all ${
                            formData.twitterEnabled
                              ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-900 placeholder:text-gray-400'
                              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          placeholder={formData.twitterEnabled ? '@yourhandle' : 'Click icon to enable'}
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                    </div>
                    {errors.socialProfiles && <p className="text-red-500 text-sm mt-1">{errors.socialProfiles}</p>}
                  </div>

                  {/* Industry */}
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="industry"
                        value={formData.industry || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-4 py-3 min-h-[48px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 appearance-none cursor-pointer"
                        style={{ fontSize: '16px' }}
                      >
                        <option value="">Select your industry...</option>
                        <option value="property">Property (Sales & Lettings)</option>
                        <option value="hospitality">Hospitality (Hotels, Holiday Lets, Glamping)</option>
                        <option value="automotive">Automotive (Car Hire, Dealerships)</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                  </div>

                  {/* Audience Size */}
                  <div>
                    <label htmlFor="audienceSize" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Total audience size <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="audienceSize"
                        value={formData.audienceSize || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, audienceSize: e.target.value }))}
                        className="w-full px-4 py-3 min-h-[48px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 appearance-none cursor-pointer"
                        style={{ fontSize: '16px' }}
                      >
                        <option value="">Select audience size...</option>
                        <option value="under-1k">Under 1,000</option>
                        <option value="1k-5k">1,000 - 5,000</option>
                        <option value="5k-10k">5,000 - 10,000</option>
                        <option value="10k-25k">10,000 - 25,000</option>
                        <option value="25k-50k">25,000 - 50,000</option>
                        <option value="50k-100k">50,000 - 100,000</option>
                        <option value="100k+">100,000+</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.audienceSize && <p className="text-red-500 text-sm mt-1">{errors.audienceSize}</p>}
                  </div>

                  {/* Why Partner */}
                  <div>
                    <label htmlFor="whyPartner" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Why do you want to be an Affiliate? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="whyPartner"
                      value={formData.whyPartner || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, whyPartner: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                      placeholder="Tell us about your audience and why you're excited about Slydes..."
                      style={{ fontSize: '16px' }}
                    />
                    {errors.whyPartner && <p className="text-red-500 text-sm mt-1">{errors.whyPartner}</p>}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>

                  {/* Note */}
                  <p className="text-xs text-gray-500 text-center">
                    We review applications within 48 hours. Quality over quantity.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Who We're Looking For */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-gray-50 rounded-2xl p-6 border border-gray-200 max-w-3xl">
              <h3 className="font-semibold mb-4">Who we&apos;re looking for</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-2xl mb-2">🏠</p>
                  <p className="font-medium text-gray-900">Property</p>
                  <p className="text-gray-500 text-xs mt-1">Estate agents, lettings, property influencers</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-2xl mb-2">🏨</p>
                  <p className="font-medium text-gray-900">Hospitality</p>
                  <p className="text-gray-500 text-xs mt-1">Hotels, holiday lets, glamping, travel vloggers</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-2xl mb-2">🚗</p>
                  <p className="font-medium text-gray-900">Automotive</p>
                  <p className="text-gray-500 text-xs mt-1">Car hire, dealerships, vehicle influencers</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                Engaged audiences matter more than follower count.
              </p>
            </div>
          </motion.div>

          {/* Key Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-center"
          >
            <blockquote className="text-xl md:text-2xl text-gray-600 italic max-w-2xl mx-auto">
              &ldquo;Earn 25% on every business you refer to Slydes. For life. Not a one-time bounty. <span className="text-leader-blue font-medium not-italic">Recurring income</span> as long as they stay subscribed.&rdquo;
            </blockquote>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
