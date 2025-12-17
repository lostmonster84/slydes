'use client'

import { motion, useInView } from 'framer-motion'
import { ShoppingBag, CreditCard, Package, TrendingUp } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

/**
 * Animated counter component
 */
function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 2000
}: {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, isInView])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

export function ShopPreview() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Shop mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            {/* Shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-leader-blue/10 to-electric-cyan/10 rounded-3xl blur-2xl scale-95" />

            {/* Shop dashboard mockup */}
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-leader-blue to-electric-cyan flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-future-black font-semibold text-sm">Shop</div>
                    <div className="text-gray-500 text-xs">Revenue & orders</div>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-electric-cyan/10 text-electric-cyan text-xs font-medium rounded-full">
                  Pro
                </div>
              </div>

              {/* Stats grid */}
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {/* Revenue */}
                  <motion.div
                    className="bg-gray-50 rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-xs">Revenue</span>
                      <motion.span
                        className="text-emerald-500 text-xs font-medium"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 2.2 }}
                        viewport={{ once: true }}
                      >
                        +34%
                      </motion.span>
                    </div>
                    <div className="text-2xl font-bold text-future-black">
                      <AnimatedCounter value={2847} prefix="£" duration={2000} />
                    </div>
                    <div className="text-gray-400 text-xs mt-1">This month</div>
                  </motion.div>

                  {/* Orders */}
                  <motion.div
                    className="bg-gray-50 rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-xs">Orders</span>
                      <motion.span
                        className="text-emerald-500 text-xs font-medium"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 2.4 }}
                        viewport={{ once: true }}
                      >
                        +12
                      </motion.span>
                    </div>
                    <div className="text-2xl font-bold text-future-black">
                      <AnimatedCounter value={47} duration={1500} />
                    </div>
                    <div className="text-gray-400 text-xs mt-1">This month</div>
                  </motion.div>
                </div>

                {/* Recent orders */}
                <motion.div
                  className="bg-gray-50 rounded-xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 text-sm font-medium">Recent orders</span>
                    <motion.div
                      className="flex items-center gap-1.5"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-500 text-xs font-medium">Live</span>
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Hydrating Shampoo Set', price: '£34', status: 'Paid', time: '2m ago', delay: 0 },
                      { name: 'Deep Repair Mask', price: '£28', status: 'Paid', time: '1h ago', delay: 0.15 },
                      { name: 'Silk Serum Bundle', price: '£45', status: 'Pending', time: '3h ago', delay: 0.3 },
                    ].map((order, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + order.delay }}
                        viewport={{ once: true }}
                      >
                        <div>
                          <div className="text-sm text-future-black font-medium">{order.name}</div>
                          <div className="text-xs text-gray-400">{order.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-future-black">{order.price}</div>
                          <div className={`text-xs ${order.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {order.status}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-leader-blue/10 border border-leader-blue/20 rounded-full mb-6">
              <ShoppingBag className="w-4 h-4 text-leader-blue" />
              <span className="text-sm font-medium text-leader-blue">Commerce</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-future-black mb-6">
              Sell directly from your <span className="gradient-text">Slyde</span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Turn your Slyde into a storefront. Add products to any frame,
              let customers add to cart, and check out with Stripe.
              No separate shop needed.
            </p>

            {/* Features list */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-leader-blue/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-leader-blue" />
                </div>
                <div>
                  <h3 className="text-future-black font-semibold mb-1">Products on any frame</h3>
                  <p className="text-gray-500 text-sm">Add Buy Now buttons to any frame. Customers see it, tap it, buy it.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-electric-cyan/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-electric-cyan" />
                </div>
                <div>
                  <h3 className="text-future-black font-semibold mb-1">Stripe checkout</h3>
                  <p className="text-gray-500 text-sm">Secure payments powered by Stripe. Apple Pay, Google Pay, cards.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-future-black font-semibold mb-1">Revenue tracking</h3>
                  <p className="text-gray-500 text-sm">See sales, orders, and revenue in real-time. Know what&apos;s working.</p>
                </div>
              </div>
            </div>

            {/* Tier info */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-future-black/5 border border-future-black/10 rounded-lg">
              <span className="text-gray-600 text-sm">Available on</span>
              <span className="text-electric-cyan text-sm font-semibold">Pro plan</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
