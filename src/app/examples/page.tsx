'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

const examples = [
  {
    id: 1,
    category: 'rentals',
    title: 'WildTrax 4x4',
    description: 'Highland vehicle rentals and guided tours. Full-screen video backgrounds, instant booking CTAs.',
    color: 'from-emerald-700 to-emerald-900',
    stats: '40% more mobile bookings',
  },
  {
    id: 2,
    category: 'hospitality',
    title: 'Highland Bites',
    description: 'Restaurant digital menu with video dish previews and one-tap ordering.',
    color: 'from-amber-700 to-amber-900',
    stats: 'Coming soon',
  },
  {
    id: 3,
    category: 'services',
    title: 'Loch Ness Tours',
    description: 'Tour operator experience with drone footage and customer testimonials.',
    color: 'from-blue-700 to-blue-900',
    stats: 'Coming soon',
  },
]

const categories = [
  { id: 'all', label: 'All' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'rentals', label: 'Rentals' },
  { id: 'services', label: 'Services' },
]

export default function ExamplesPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredExamples = activeCategory === 'all' 
    ? examples 
    : examples.filter(ex => ex.category === activeCategory)

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-4">See Slydes in action</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real businesses using Slydes to engage mobile customers.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-6 bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    px-5 py-2 rounded-full text-sm font-medium transition-all
                    ${activeCategory === category.id
                      ? 'bg-future-black text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Examples Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExamples.map((example, index) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors group"
                >
                  {/* Phone Mockup Preview */}
                  <div className="p-6 flex justify-center">
                    <div className="relative w-[180px] h-[360px] bg-gray-900 rounded-[2rem] p-2 shadow-lg">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-10" />
                      <div className={`relative w-full h-full bg-gradient-to-b ${example.color} rounded-[1.5rem] overflow-hidden`}>
                        <div className="h-full w-full flex flex-col items-center justify-center p-4">
                          <h4 className="text-white text-lg font-bold text-center">{example.title}</h4>
                          <p className="text-white/70 text-xs text-center mt-1">Swipe to explore</p>
                        </div>
                      </div>
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {example.category}
                      </span>
                      {example.stats !== 'Coming soon' && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs font-medium text-green-600">
                            {example.stats}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{example.description}</p>
                    
                    {example.id === 1 ? (
                      <a 
                        href="https://wildtrax.co.uk/m/camping" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-leader-blue hover:text-blue-700 font-medium text-sm transition-colors"
                      >
                        View live Slyde →
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">Coming soon</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4">Your business could be here</h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Join our founding members and be one of the first to create 
                mobile experiences that actually convert.
              </p>
              <Link href="/founding-member">
                <Button size="lg">
                  Become a Founding Member
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
