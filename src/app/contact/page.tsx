'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.message) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Get in touch
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-future-black mb-6">
                Let&apos;s talk
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Have a question, feedback, or just want to say hi? 
                We&apos;d love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="pb-24 md:pb-32">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 md:p-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Message sent!</h2>
                  <p className="text-gray-600 mb-6">
                    Thanks for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setStatus('idle')}
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full min-h-[48px] px-4 text-base rounded-xl border border-gray-200 bg-white focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/20 outline-none transition-all"
                        style={{ fontSize: '16px' }}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full min-h-[48px] px-4 text-base rounded-xl border border-gray-200 bg-white focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/20 outline-none transition-all"
                        style={{ fontSize: '16px' }}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full min-h-[48px] px-4 text-base rounded-xl border border-gray-200 bg-white focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/20 outline-none transition-all appearance-none cursor-pointer"
                      style={{ fontSize: '16px' }}
                    >
                      <option value="">Select a topic...</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press & Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      rows={6}
                      className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 bg-white focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/20 outline-none transition-all resize-none"
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  {/* Error Message */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm"
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Message
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </Button>

                  {/* Privacy Note */}
                  <p className="text-sm text-gray-500 text-center">
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              )}
            </motion.div>

            {/* Alternative Contact Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 pt-12 border-t border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-8">
                Or reach us directly
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <a
                  href="mailto:hello@slydes.io"
                  className="group flex items-center gap-4 p-6 rounded-2xl bg-white border border-gray-200 hover:border-leader-blue/30 hover:shadow-lg hover:shadow-leader-blue/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-leader-blue/10 flex items-center justify-center group-hover:bg-leader-blue/20 transition-colors">
                    <svg className="w-6 h-6 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email us at</p>
                    <p className="font-semibold text-gray-900 group-hover:text-leader-blue transition-colors">hello@slydes.io</p>
                  </div>
                </a>

                {/* Twitter/X */}
                <a
                  href="https://twitter.com/slydes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-6 rounded-2xl bg-white border border-gray-200 hover:border-leader-blue/30 hover:shadow-lg hover:shadow-leader-blue/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-leader-blue/10 flex items-center justify-center group-hover:bg-leader-blue/20 transition-colors">
                    <svg className="w-6 h-6 text-leader-blue" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Follow us on</p>
                    <p className="font-semibold text-gray-900 group-hover:text-leader-blue transition-colors">@slydes</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

