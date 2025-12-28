'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { applyStarterTemplate } from '@/lib/starterTemplates'
import { writeDemoHomeSlyde } from '@/lib/demoHomeSlyde'

interface PendingOnboarding {
  full_name: string
  organization_name: string
  slug: string
  website: string
  business_type: string
  other_description: string
  timestamp: number
}

export default function AuthCompletePage() {
  const router = useRouter()
  const supabase = createClient()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Completing your setup...')

  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        // Check for pending onboarding data
        const pendingData = localStorage.getItem('pendingOnboarding')

        if (!pendingData) {
          // No pending onboarding - just a normal sign-in, redirect to dashboard
          router.replace('/')
          return
        }

        const pending: PendingOnboarding = JSON.parse(pendingData)

        // Check if data is stale (older than 24 hours)
        const isStale = Date.now() - pending.timestamp > 24 * 60 * 60 * 1000
        if (isStale) {
          localStorage.removeItem('pendingOnboarding')
          router.replace('/')
          return
        }

        // Get the authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          setStatus('error')
          setMessage('Authentication failed. Please try again.')
          localStorage.removeItem('pendingOnboarding')
          setTimeout(() => router.replace('/login'), 2000)
          return
        }

        // Check if user already has completed onboarding
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        if (existingProfile?.onboarding_completed) {
          // User already onboarded (maybe clicked "Get Started" but had an account)
          localStorage.removeItem('pendingOnboarding')
          setStatus('success')
          setMessage('Welcome back! Redirecting...')
          setTimeout(() => router.replace('/'), 1000)
          return
        }

        setMessage('Creating your organization...')

        // Check slug availability one more time
        const { data: slugStatus } = await supabase.rpc('slug_status', {
          check_slug: pending.slug.toLowerCase()
        })

        let orgId: string | null = null

        if (slugStatus === 'owned') {
          // User already owns this slug, reuse the org
          const { data: existingOrg } = await supabase
            .from('organizations')
            .select('id')
            .eq('slug', pending.slug.toLowerCase())
            .single()

          if (existingOrg) {
            orgId = existingOrg.id
          }
        } else if (slugStatus === 'available') {
          // Create new organization
          const { data: org, error: orgError } = await supabase
            .from('organizations')
            .insert({
              owner_id: user.id,
              name: pending.organization_name,
              slug: pending.slug.toLowerCase(),
              website: pending.website || null,
              business_type: pending.business_type,
            })
            .select('id')
            .single()

          if (orgError) {
            console.error('Error creating organization:', orgError)
            setStatus('error')
            setMessage('Could not create your organization. Please try again.')
            localStorage.removeItem('pendingOnboarding')
            setTimeout(() => router.replace('/onboarding'), 2000)
            return
          }

          orgId = org?.id || null
        } else {
          // Slug is taken by someone else
          setStatus('error')
          setMessage('Your chosen URL is no longer available. Please try again.')
          localStorage.removeItem('pendingOnboarding')
          setTimeout(() => router.replace('/onboarding'), 2000)
          return
        }

        if (!orgId) {
          setStatus('error')
          setMessage('Could not create your organization. Please try again.')
          localStorage.removeItem('pendingOnboarding')
          setTimeout(() => router.replace('/onboarding'), 2000)
          return
        }

        setMessage('Setting up your profile...')

        // Upsert profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: pending.full_name,
            company_name: pending.organization_name,
            company_website: pending.website,
            onboarding_completed: true,
            current_organization_id: orgId,
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.error('Error updating profile:', profileError)
          setStatus('error')
          setMessage('Could not update your profile. Please try again.')
          localStorage.removeItem('pendingOnboarding')
          setTimeout(() => router.replace('/'), 2000)
          return
        }

        // Apply starter template based on business type
        setMessage('Applying your starter template...')
        const starterHomeSlyde = applyStarterTemplate(pending.business_type)
        if (starterHomeSlyde) {
          writeDemoHomeSlyde(starterHomeSlyde)
        }

        // Success!
        localStorage.removeItem('pendingOnboarding')
        setStatus('success')
        setMessage('All set! Welcome to Slydes!')

        setTimeout(() => {
          router.replace('/')
          router.refresh()
        }, 1000)

      } catch (error) {
        console.error('Error completing onboarding:', error)
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
        localStorage.removeItem('pendingOnboarding')
        setTimeout(() => router.replace('/login'), 2000)
      }
    }

    completeOnboarding()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-future-black">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold tracking-tight">
          <span className="text-white">Slydes</span>
          <span className="text-leader-blue">.io</span>
        </h1>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl text-center">
          <motion.div
            key={status}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-6"
          >
            {status === 'loading' && (
              <Loader2 className="w-12 h-12 text-leader-blue animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-12 h-12 text-green-400" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-12 h-12 text-red-400" />
            )}
          </motion.div>

          <motion.p
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-[17px] ${
              status === 'error' ? 'text-red-200' :
              status === 'success' ? 'text-green-200' :
              'text-white/70'
            }`}
          >
            {message}
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
