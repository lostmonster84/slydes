'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Empty State */}
              <div className="bg-white rounded-2xl border border-gray-200 p-12 md:p-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4">Ready to build your first Slyde?</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Create a mobile-first, TikTok-style microsite in under 10 minutes.
                </p>
                <Button size="lg">
                  Create New Slyde
                </Button>
              </div>

              {/* Coming Soon Notice */}
              <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-gray-600">
                  <span className="font-semibold text-future-black">Dashboard launching January 2026.</span>
                  <br />
                  <span className="text-sm">Founding Partners earn 25% commission for life.</span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
