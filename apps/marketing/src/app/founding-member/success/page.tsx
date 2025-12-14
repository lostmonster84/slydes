'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl">
              {/* Success Icon */}
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-leader-blue to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6"
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

              {/* What's Next */}
              <div className="text-left bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold mb-4 text-lg">What happens next:</h3>
                <ul className="space-y-4 text-gray-600">
                  {[
                    { icon: '👀', text: 'We\'ll review your application within 48 hours' },
                    { icon: '📧', text: 'You\'ll receive an email with our decision' },
                    { icon: '💬', text: 'If selected, we\'ll invite you to our private Slack' },
                    { icon: '🔗', text: 'We\'ll set up your unique referral link + partner dashboard' },
                    { icon: '💰', text: 'Start earning 25% on every subscriber you refer' },
                  ].map((item, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <span className="text-xl mr-3">{item.icon}</span>
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Commission Reminder */}
              <div className="text-left bg-leader-blue/5 border border-leader-blue/20 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold mb-3 text-leader-blue">As a Founding Partner you&apos;ll get:</h3>
                <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  {[
                    '25% commission for life',
                    'Unique referral link',
                    'Partner dashboard',
                    'Monthly payouts',
                    'Lifetime Pro access',
                    'Direct founder access',
                    'Featured showcase',
                    'Early access',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-4 h-4 text-leader-blue mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <Link href="/">
                  <Button size="lg" className="w-full">
                    Back to Homepage
                  </Button>
                </Link>
                
                <p className="text-sm text-gray-500">
                  Questions? Email us at{' '}
                  <a href="mailto:partners@slydes.io" className="text-leader-blue hover:underline">
                    partners@slydes.io
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
