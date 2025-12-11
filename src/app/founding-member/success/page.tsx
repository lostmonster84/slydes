'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  // In production, you'd verify the session_id with Stripe
  // and fetch the actual member number from your database
  const memberNumber = 4 // Placeholder - would come from database

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white relative overflow-hidden">
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl">
            {/* Success Icon */}
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
            
            {/* Member Number */}
            <motion.div 
              className="bg-future-black rounded-2xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-400 text-sm mb-1">Your founding member number</p>
              <p className="text-5xl font-bold text-white">#{memberNumber}</p>
              <p className="text-gray-500 text-xs mt-2">of 50</p>
            </motion.div>

            {/* What's Next */}
            <div className="text-left bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold mb-4 text-lg">What happens next:</h3>
              <ul className="space-y-4 text-gray-600">
                {[
                  { icon: '📧', text: 'Check your email for your receipt and welcome pack' },
                  { icon: '💬', text: "We'll invite you to our private founders Slack channel" },
                  { icon: '📞', text: "We'll reach out to schedule your 1-on-1 onboarding call" },
                  { icon: '🚀', text: 'Early access begins January 2026 - you\'ll be first in' },
                  { icon: '💰', text: 'Your referral link will be in your welcome email - start earning 20%' },
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

            {/* Founder Benefits Reminder */}
            <div className="text-left bg-leader-blue/5 border border-leader-blue/20 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold mb-3 text-leader-blue">Your founder benefits:</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {[
                  'Lifetime Pro access',
                  '20% revenue share',
                  'Monthly founder calls',
                  'Private Slack channel',
                  '1-on-1 onboarding',
                  'Launch spotlight',
                  'Founder badge',
                  '30-day guarantee',
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-4 h-4 text-leader-blue mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
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
                <a href="mailto:founders@slydes.io" className="text-leader-blue hover:underline">
                  founders@slydes.io
                </a>
              </p>
            </div>

            {/* Session ID for reference */}
            {sessionId && (
              <p className="text-xs text-gray-400 mt-6">
                Reference: {sessionId.slice(0, 20)}...
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </main>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  )
}


