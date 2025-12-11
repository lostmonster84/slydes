'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface FormData {
  name: string
  email: string
  company?: string
  useCase: string
}

export default function FoundingMemberPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [memberNumber, setMemberNumber] = useState<number | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const spotsRemaining = 47

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.url) {
          window.location.href = result.url
        } else {
          setMemberNumber(50 - spotsRemaining + 1)
          setIsSuccess(true)
        }
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setMemberNumber(50 - spotsRemaining + 1)
      setIsSuccess(true)
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
                  Welcome, <span className="gradient-text">Founding Member!</span>
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  You&apos;re officially part of the team building the future of mobile-first business sites.
                </p>
                
                {memberNumber && (
                  <motion.div 
                    className="bg-future-black rounded-2xl p-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-gray-400 text-sm mb-1">Your founding member number</p>
                    <p className="text-5xl font-bold text-white">#{memberNumber}</p>
                  </motion.div>
                )}

                <div className="text-left bg-gray-50 rounded-2xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">What happens next:</h3>
                  <ul className="space-y-3 text-gray-600">
                    {[
                      'Check your email for confirmation and receipt',
                      "You'll get early access when we launch in January 2026",
                      "We'll invite you to our private Slack for roadmap input",
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
                  Questions? Email us at <a href="mailto:founders@slydes.io" className="text-leader-blue hover:underline">founders@slydes.io</a>
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
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Hero Section - Centered */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-leader-blue rounded-full animate-pulse" />
              Limited to 50 founding members
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join 50 founders<br />
              <span className="gradient-text">building the future</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get lifetime Pro access for a one-time payment. 
              Help shape the product. Be recognized as an early supporter.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column - Benefits (2 cols) */}
            <motion.div 
              className="lg:col-span-2 order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Price Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg mb-6">
                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold">£499</span>
                    <span className="text-gray-500">one-time</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    €599 / $629 USD
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Regular: £39/month (£468/year)
                  </p>
                </div>
                
                {/* Spots Counter */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">
                      {spotsRemaining}/50 spots left
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4 text-lg">What you get:</h3>
                <ul className="space-y-4">
                  {[
                    { title: 'Lifetime Pro access', desc: 'Unlimited Slydes, forever' },
                    { title: '20% revenue share', desc: 'Earn 20% on every referral, forever' },
                    { title: 'Your voice matters', desc: 'Monthly founder calls + direct input on features' },
                    { title: 'Private founders channel', desc: 'Direct line to the team and other founders' },
                    { title: '1-on-1 onboarding call', desc: 'Personal setup with the founding team' },
                    { title: 'Launch spotlight', desc: 'We feature your business at launch' },
                    { title: 'Founder badge forever', desc: 'Visible on your Slyde + Hall of Fame' },
                    { title: '30-day guarantee', desc: 'Full refund, no questions asked' },
                  ].map((item, i) => (
                    <motion.li 
                      key={item.title}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
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
            </motion.div>

            {/* Right Column - Form (3 cols) */}
            <motion.div 
              className="lg:col-span-3 order-1 lg:order-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl">
                <h2 className="text-xl font-semibold mb-6 text-center">Claim your spot</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="John Smith"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email address
                    </label>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Company <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      {...register('company')}
                      type="text"
                      id="company"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Your company name"
                    />
                  </div>

                  {/* Use Case */}
                  <div>
                    <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-1.5">
                      What will you use Slydes for?
                    </label>
                    <div className="relative">
                      <select
                        {...register('useCase', { required: 'Please select a use case' })}
                        id="useCase"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent focus:bg-white transition-all text-gray-900 appearance-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled className="text-gray-400">Select your industry...</option>
                        <option value="restaurant">Restaurant / Hospitality</option>
                        <option value="rentals">Rentals / Property</option>
                        <option value="tours">Tours / Experiences</option>
                        <option value="services">Services / Agency</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.useCase && (
                      <p className="text-red-500 text-sm mt-1">{errors.useCase.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full animate-pulse-glow"
                  >
                    {isSubmitting ? 'Processing...' : 'Claim Your Spot — £499'}
                  </Button>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-4 pt-2 text-gray-400 text-xs">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure
                    </span>
                    <span>•</span>
                    <span>Powered by Stripe</span>
                    <span>•</span>
                    <span>30-day refund</span>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
