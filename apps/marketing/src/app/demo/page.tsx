'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const demos = [
  {
    category: 'Reference Implementation',
    items: [
      {
        href: '/demo/hq-dashboard',
        title: 'Slydes HQ (Master)',
        description: 'The primary HQ surface — Dashboard, Slydes, Analytics, Inbox, Brand, Settings (Free/Creator gates)',
        status: 'complete',
        icon: '🏢',
        featured: true,
      },
    ],
  },
  {
    category: 'Editor',
    items: [
      {
        href: '/demo/hq-mockup',
        title: 'Slydes HQ — Slydes (Picture)',
        description: 'High-fidelity visual mockup of the light-first HQ Slydes management screen (MVP gates)',
        status: 'complete',
        icon: '🏢',
        featured: true,
      },
      {
        href: '/demo/hq-dashboard',
        title: 'Slydes HQ — Dashboard (Picture)',
        description: 'HQ dashboard mock: performance, inbox, and MVP upgrade triggers (Free vs Creator)',
        status: 'complete',
        icon: '📊',
      },
      {
        href: '/demo/hq-analytics',
        title: 'Slydes HQ — Analytics (Picture)',
        description: 'Simple, behaviour-first analytics: views, swipe depth, completion, shares — locked on Free',
        status: 'complete',
        icon: '📈',
      },
      {
        href: '/demo/hq-inbox',
        title: 'Slydes HQ — Inbox (Picture)',
        description: 'Enquiry capture + handoff (not a CRM) — kept separate from the v1 Dashboard scope',
        status: 'complete',
        icon: '📥',
      },
      {
        href: '/demo/editor-home',
        title: 'Editor Home (Profile)',
        description: 'Profile-level view showing all Slydes for a business',
        status: 'complete',
        icon: '🏠',
      },
      {
        href: '/demo/editor-mockup',
        title: 'Frame Editor',
        description: '3-panel layout with live preview, inspector, and frame management',
        status: 'complete',
        icon: '🎨',
      },
      {
        href: '/demo/editor-states',
        title: 'Editor States',
        description: 'Empty, partial, full, publishing, and success states',
        status: 'complete',
        icon: '🔄',
      },
      {
        href: '/demo/editor-depth-variations',
        title: 'Visual Variations',
        description: '25 layout, depth, background, and composition options',
        status: 'complete',
        icon: '✨',
      },
      {
        href: '/demo/mobile-editor',
        title: 'Mobile Editor',
        description: 'Partner App editor mockup (phone-native layout)',
        status: 'complete',
        icon: '📱',
      },
    ],
  },
  {
    category: 'Slyde Types',
    items: [
      {
        href: '/demo/slyde-types',
        title: 'All 6 Types',
        description: 'Hero, About, Showcase, Reviews, Location, CTA with best practices',
        status: 'complete',
        icon: '📚',
      },
      {
        href: '/demo/industry-templates',
        title: 'Industry Templates',
        description: 'Restaurant, Hotel, Vehicle, Salon, Fitness complete flows',
        status: 'complete',
        icon: '🏢',
      },
    ],
  },
  {
    category: 'Customer Experience',
    items: [
      {
        href: '/demo/home-slyde',
        title: 'Home Slyde Flow (MASTER)',
        description: 'Complete Home → Category → Inventory → Item flow with shared SocialActionStack',
        status: 'complete',
        icon: '🏠',
        featured: true,
      },
      {
        href: '/demo-slyde',
        title: 'Slyde Experience (Reference)',
        description: 'The canonical device-preview Slyde — Heart, FAQ, Share, Info, ProfilePill, AboutSheet',
        status: 'complete',
        icon: '📱',
      },
      {
        href: '/demo/public-viewer',
        title: 'Public Viewer',
        description: 'Full-screen swipe experience (what customers see)',
        status: 'complete',
        icon: '👁️',
      },
      {
        href: '/demo/analytics',
        title: 'Analytics Dashboard',
        description: 'Views, completion rates, hearts, and insights',
        status: 'complete',
        icon: '📊',
      },
    ],
  },
  {
    category: 'Components',
    items: [
      {
        href: '/demo/components',
        title: 'UI Components',
        description: 'Buttons, inputs, cards, and design system elements',
        status: 'complete',
        icon: '🧩',
      },
      {
        href: '/demo/background-animations',
        title: 'Backgrounds',
        description: 'Animated background effects and patterns',
        status: 'complete',
        icon: '🌊',
      },
      {
        href: '/demo/logo-variations',
        title: 'Logo Options',
        description: 'Logo variations and usage guidelines',
        status: 'complete',
        icon: '🎯',
      },
    ],
  },
]

export default function DemoIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 dark:border-white/10 dark:bg-[#1c1c1e]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-sm text-white">
              S
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Slydes</span>
          </Link>
          <div className="text-sm text-gray-500 dark:text-white/60">Design Playbook</div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Editor Design{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Playbook
              </span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-white/60 max-w-2xl mx-auto mb-8">
              Complete reference for the Slydes editor — from mockups to production components.
              Everything you need to build the perfect vertical video editor.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 dark:text-white/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>{demos.reduce((acc, cat) => acc + cat.items.length, 0)} demos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Interactive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>Production-ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {demos.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-sm font-semibold text-gray-400 dark:text-white/50 uppercase tracking-wider mb-4">
                {category.category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.items.map((item, itemIndex) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-red-300 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md dark:bg-[#2c2c2e] dark:hover:bg-[#3a3a3c] dark:border-white/10 dark:hover:border-red-500/40"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{item.icon}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'complete' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-300'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 dark:text-white/50 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                      <span>View demo</span>
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6 border-t border-gray-200 bg-white dark:border-white/10 dark:bg-[#1c1c1e]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/docs/EDITOR-DESIGN-SPEC.md" className="text-gray-400 hover:text-gray-900 dark:text-white/50 dark:hover:text-white transition-colors">
              📄 Design Spec
            </Link>
            <span className="text-gray-300 dark:text-white/20">•</span>
            <Link href="/" className="text-gray-400 hover:text-gray-900 dark:text-white/50 dark:hover:text-white transition-colors">
              🏠 Marketing Site
            </Link>
            <span className="text-gray-300 dark:text-white/20">•</span>
            <Link href="/showcase" className="text-gray-400 hover:text-gray-900 dark:text-white/50 dark:hover:text-white transition-colors">
              🎬 Showcase
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

