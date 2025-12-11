'use client'

import { Button } from '@/components/ui/Button'
import { PhoneMockup } from '@/components/ui/PhoneMockup'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 min-h-[90vh] md:min-h-screen flex items-center overflow-hidden relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230A0E27' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-leader-blue rounded-full animate-pulse" />
                Now accepting founding members
              </span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 
              className="font-display mb-6 text-balance text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="block">Mobile sites that</span>
              <span className="block gradient-text">customers actually use</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              TikTok-style vertical scrolling for businesses. 
              Built in minutes, not months.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/founding-member">
                <Button size="lg" className="w-full sm:w-auto animate-pulse-glow">
                  Become a Founding Member
                </Button>
              </Link>
              <Link href="/showcase">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto hover-lift">
                  See Showcase
                </Button>
              </Link>
            </motion.div>
            
            <motion.p 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Join 50 founding members shaping the future of mobile-first business sites.
            </motion.p>
          </div>

          {/* Right Column - Phone Mockup - SAME COMPONENT AS EVERYWHERE ELSE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex-shrink-0 mt-8 lg:mt-0"
          >
            <PhoneMockup 
              variant="hospitality"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
