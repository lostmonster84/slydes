'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const INDUSTRIES = [
  { value: '', label: 'Select your industry' },
  { value: 'estate-agent', label: 'Estate agent / property sales' },
  { value: 'lettings', label: 'Lettings / long-term rentals' },
  { value: 'holiday-lets', label: 'Holiday lets (Airbnb/Booking)' },
  { value: 'hotel', label: 'Hotel / lodge / hospitality' },
  { value: 'property-developer', label: 'Property developer' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'retail', label: 'Retail / E-commerce' },
  { value: 'professional', label: 'Professional Services' },
  { value: 'creative', label: 'Creative / Portfolio' },
  { value: 'other', label: 'Other' },
]

export function WaitlistSignup() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [industry, setIndustry] = useState('')
  const [otherIndustry, setOtherIndustry] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return

    setStatus('loading')

    // Determine the final industry value
    const finalIndustry = industry === 'other' ? otherIndustry : industry

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, industry: finalIndustry }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'You\'re in! We\'ll keep you posted.')
        setEmail('')
        setFirstName('')
        setIndustry('')
        setOtherIndustry('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="waitlist" className="py-12 md:py-20 bg-[#0A0E27]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Turn browsing into bookings and enquiries.
          </h2>

          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Create one link that sells the space on mobile — then send them to your listing or booking page.
          </p>

          {/* Form */}
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 max-w-md mx-auto"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">You&apos;re in!</h3>
              <p className="text-white/70">{message}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              {/* Row 1: Name and Email */}
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="flex-1 min-h-[48px] px-4 text-base rounded-xl border border-white/20 focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/30 outline-none transition-all touch-manipulation bg-white/10 text-white placeholder:text-white/70"
                  style={{ fontSize: '16px', touchAction: 'manipulation' }}
                  inputMode="text"
                  autoComplete="given-name"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-[2] min-h-[48px] px-4 text-base rounded-xl border border-white/20 focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/30 outline-none transition-all touch-manipulation bg-white/10 text-white placeholder:text-white/70"
                  style={{ fontSize: '16px', touchAction: 'manipulation' }}
                  inputMode="email"
                  autoComplete="email"
                />
              </div>

              {/* Row 2: Industry dropdown */}
              <div className="mb-3">
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={`w-full min-h-[48px] px-4 text-base rounded-xl border border-white/20 focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/30 outline-none transition-all touch-manipulation bg-white/10 appearance-none cursor-pointer ${industry ? 'text-white' : 'text-white/70'}`}
                  style={{ fontSize: '16px', touchAction: 'manipulation' }}
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value} disabled={ind.value === ''} className="bg-[#0A0E27] text-white">
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3: Other industry text input (conditional) */}
              {industry === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3"
                >
                  <input
                    type="text"
                    placeholder="Tell us your industry"
                    value={otherIndustry}
                    onChange={(e) => setOtherIndustry(e.target.value)}
                    className="w-full min-h-[48px] px-4 text-base rounded-xl border border-white/20 focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/30 outline-none transition-all touch-manipulation bg-white/10 text-white placeholder:text-white/70"
                    style={{ fontSize: '16px', touchAction: 'manipulation' }}
                    inputMode="text"
                  />
                </motion.div>
              )}
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full sm:w-auto px-8 !bg-white !text-future-black hover:!bg-white/90"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  'Create your first property Slyde'
                )}
              </Button>

              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-3"
                >
                  {message}
                </motion.p>
              )}
            </form>
          )}

          {/* Trust note */}
          <p className="text-sm text-white/50 mt-6">
            Live in minutes. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  )
}




