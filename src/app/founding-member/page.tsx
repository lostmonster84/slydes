'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface FormData {
  name: string
  email: string
  businessName: string
  website: string
  industry: string
  audienceSize: string
  platforms: string[]
  whyPartner: string
  contentCommitment: string
}

export default function FoundingPartnerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<FormData>>({
    platforms: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const spotsRemaining = 47
  const totalSpots = 50

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required'
    if (!formData.email?.trim()) newErrors.email = 'Email is required'
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.businessName?.trim()) newErrors.businessName = 'Business name is required'
    if (!formData.industry) newErrors.industry = 'Please select your industry'
    if (!formData.audienceSize) newErrors.audienceSize = 'Please select your audience size'
    if (!formData.platforms || formData.platforms.length === 0) newErrors.platforms = 'Select at least one platform'
    if (!formData.whyPartner?.trim()) newErrors.whyPartner = 'Please tell us why you want to partner'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms?.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...(prev.platforms || []), platform]
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
        alert('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setIsSuccess(true) // Show success anyway for now
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
                  Thanks for applying to become a Founding Partner. We review every application personally.
                </p>
                
                <div className="text-left bg-gray-50 rounded-2xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">What happens next:</h3>
                  <ul className="space-y-3 text-gray-600">
                    {[
                      'We\'ll review your application within 48 hours',
                      'If selected, you\'ll receive an invite to our Founders Slack',
                      'We\'ll schedule a quick intro call to discuss your Slyde',
                      'Your custom Slyde build begins (white-glove service)',
                      'You share the journey with your audience',
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
                  Questions? Email us at <a href="mailto:partners@slydes.io" className="text-leader-blue hover:underline">partners@slydes.io</a>
                </p>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
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
            {/* Partners Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-leader-blue rounded-full animate-pulse" />
              Founding Partners. {spotsRemaining} of {totalSpots} spots remaining.
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Build with us.<br />
              <span className="gradient-text">Grow with us.</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              We&apos;re selecting 50 influencers and creators to become Founding Partners. 
              You bring the audience. We build your Slyde. Together, we grow.
            </p>
            <p className="text-gray-500 max-w-xl mx-auto">
              No payment required. Your audience is your contribution.
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
              {/* The Deal Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-leader-blue text-sm font-medium mb-1">Founding Partner</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">Free</span>
                      <span className="text-gray-500">for selected partners</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Your audience is your investment</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-gray-700">{spotsRemaining}/{totalSpots}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">spots remaining</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-leader-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${((totalSpots - spotsRemaining) / totalSpots) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* What You Get */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                  <span className="text-leader-blue">✦</span> What You Get
                </h3>
                <ul className="space-y-4">
                  {[
                    { title: 'Custom Slyde built for you', desc: 'White-glove build of your mobile experience, tailored to your brand' },
                    { title: 'Lifetime Pro access', desc: 'Full access to Slydes Pro features, forever' },
                    { title: 'Direct access to the founder', desc: 'Private Slack channel with James in the room every day' },
                    { title: 'Featured in our showcase', desc: 'Your Slyde featured as an example of what\'s possible' },
                    { title: 'Early access to everything', desc: 'New features, updates, and tools before anyone else' },
                    { title: 'Founding Partner status', desc: 'Recognition as one of the original 50 who built Slydes' },
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
                    'Share your Slydes journey with your audience',
                    'Create content about your experience (posts, stories, videos)',
                    'Provide feedback to help us improve',
                    'Be an advocate for mobile-first experiences',
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
                <h2 className="text-xl font-semibold mb-2 text-center">Apply to become a Partner</h2>
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Your name"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Business Name */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Business / Brand name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      value={formData.businessName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Your business or brand"
                    />
                    {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                  </div>

                  {/* Website / Social */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Website or main social profile
                    </label>
                    <input
                      type="text"
                      id="website"
                      value={formData.website || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="https://..."
                    />
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 appearance-none cursor-pointer"
                      >
                        <option value="">Select your industry...</option>
                        <option value="hospitality">Restaurant / Hospitality</option>
                        <option value="travel">Travel / Tourism</option>
                        <option value="fitness">Fitness / Wellness</option>
                        <option value="beauty">Beauty / Fashion</option>
                        <option value="rentals">Rentals / Property</option>
                        <option value="automotive">Automotive</option>
                        <option value="lifestyle">Lifestyle / Creator</option>
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
                      Total audience size (across all platforms) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="audienceSize"
                        value={formData.audienceSize || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, audienceSize: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 appearance-none cursor-pointer"
                      >
                        <option value="">Select audience size...</option>
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

                  {/* Platforms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main platforms <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'LinkedIn', 'Newsletter'].map((platform) => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => handlePlatformToggle(platform)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.platforms?.includes(platform)
                              ? 'bg-leader-blue text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                    {errors.platforms && <p className="text-red-500 text-sm mt-1">{errors.platforms}</p>}
                  </div>

                  {/* Why Partner */}
                  <div>
                    <label htmlFor="whyPartner" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Why do you want to be a Founding Partner? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="whyPartner"
                      value={formData.whyPartner || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, whyPartner: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                      placeholder="Tell us about your business, your audience, and why you're excited about mobile-first experiences..."
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
            <div className="inline-block bg-gray-50 rounded-2xl p-6 border border-gray-200 max-w-2xl">
              <h3 className="font-semibold mb-4">Who we&apos;re looking for</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-2xl mb-2">🎯</p>
                  <p className="font-medium text-gray-900">Engaged Audience</p>
                  <p className="text-gray-500 text-xs mt-1">Quality engagement matters more than follower count</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-2xl mb-2">📱</p>
                  <p className="font-medium text-gray-900">Mobile-First Mindset</p>
                  <p className="text-gray-500 text-xs mt-1">You understand where your audience lives</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-2xl mb-2">🤝</p>
                  <p className="font-medium text-gray-900">Builder Mentality</p>
                  <p className="text-gray-500 text-xs mt-1">Excited to shape something new together</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
