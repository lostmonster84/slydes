'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Check, X, ChevronLeft, Mail, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { applyStarterTemplate } from '@/lib/starterTemplates'
import { writeDemoHomeSlyde } from '@/lib/demoHomeSlyde'

interface BusinessType {
  id: string
  label: string
  icon: string
}

// Fallback types if API fails - matches experience-first positioning
const DEFAULT_BUSINESS_TYPES: BusinessType[] = [
  { id: 'restaurant-bar', label: 'Restaurant / Bar / Cafe', icon: '🍽️' },
  { id: 'hotel', label: 'Hotel / Lodge / Boutique Stay', icon: '🏨' },
  { id: 'venue', label: 'Venue / Event Space', icon: '🎉' },
  { id: 'adventure', label: 'Tours / Adventures / Experiences', icon: '⛵' },
  { id: 'wellness', label: 'Spa / Wellness / Fitness', icon: '✨' },
  { id: 'other', label: 'Other', icon: '🌟' },
]

// iOS-style slide animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'owned' | 'taken'>('idle')
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(DEFAULT_BUSINESS_TYPES)
  const [email, setEmail] = useState('')
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    organization_name: '',
    slug: '',
    website: '',
    business_type: '',
    other_description: '', // Custom industry description when "other" is selected
  })

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsAuthenticated(true)
        // Pre-fill name from OAuth profile if available
        if (user.user_metadata?.full_name) {
          setFormData(prev => ({ ...prev, full_name: user.user_metadata.full_name }))
        } else if (user.user_metadata?.name) {
          setFormData(prev => ({ ...prev, full_name: user.user_metadata.name }))
        }
        // Skip to step 2 (name) since already authed
        setStep(2)
      }
      setIsCheckingAuth(false)
    }
    checkAuth()
  }, [supabase.auth])

  // Fetch business types from API
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const res = await fetch('/api/verticals')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (data.verticals && data.verticals.length > 0) {
          setBusinessTypes(data.verticals)
        }
      } catch (error) {
        console.warn('Could not fetch verticals, using defaults:', error)
        // Keep defaults on error
      }
    }
    fetchBusinessTypes()
  }, [])

  // Auto-generate slug from organization name
  useEffect(() => {
    if (formData.organization_name && !formData.slug) {
      const autoSlug = formData.organization_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30)
      setFormData(prev => ({ ...prev, slug: autoSlug }))
    }
  }, [formData.organization_name])

  // Check slug availability with debounce
  useEffect(() => {
    if (!formData.slug || formData.slug.length < 3) {
      setSlugStatus('idle')
      return
    }

    const timer = setTimeout(async () => {
      setSlugStatus('checking')
      const checkSlug = formData.slug.toLowerCase()

      // Prefer RPC if present (distinguishes available/owned/taken without relying on RLS visibility).
      const { data, error } = await supabase.rpc('slug_status', { check_slug: checkSlug })

      if (!error) {
        if (data === 'available' || data === 'owned' || data === 'taken') {
          setSlugStatus(data)
        } else {
          setSlugStatus('idle')
        }
        return
      }

      // Fallback path: handle missing RPC or transient errors.
      console.warn('slug_status RPC unavailable; falling back to RLS + is_slug_available', error)

      const { data: visibleOrg, error: visibleOrgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', checkSlug)
        .maybeSingle()

      if (!visibleOrgError && visibleOrg?.id) {
        setSlugStatus('owned')
        return
      }

      const { data: available, error: availableError } = await supabase.rpc('is_slug_available', { check_slug: checkSlug })

      if (availableError) {
        console.error('Error checking slug (fallback):', availableError)
        setSlugStatus('idle')
        return
      }

      if (typeof available === 'boolean') {
        setSlugStatus(available ? 'available' : 'taken')
        return
      }

      setSlugStatus('idle')
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.slug, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'slug') {
      // Only allow lowercase letters, numbers, and hyphens
      const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30)
      setFormData(prev => ({ ...prev, slug: sanitized }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setSubmitError(null)

    try {
      const withTimeout = async <T,>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> => {
        return await Promise.race([
          Promise.resolve(promise),
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms),
          ),
        ])
      }

      const {
        data: { user },
      } = await withTimeout(supabase.auth.getUser(), 15_000, 'Auth check')

      if (!user) {
        setIsLoading(false)
        // Should not happen since we're auth-first, but handle gracefully
        setStep(1)
        setIsAuthenticated(false)
        return
      }

      let orgId: string | null = null

      if (slugStatus === 'owned') {
        // Slug exists and is owned by this user: reuse it instead of inserting (avoids unique constraint failure).
        const { data: existingOrg, error: existingOrgError } = await withTimeout(
          supabase.from('organizations').select('id').eq('slug', formData.slug.toLowerCase()).single(),
          15_000,
          'Loading existing organization',
        )

        if (existingOrgError || !existingOrg) {
          console.error('Error loading existing organization:', JSON.stringify(existingOrgError, null, 2))
          setSubmitError(existingOrgError?.message || 'Could not load your existing organization. Please try again.')
          setIsLoading(false)
          return
        }

        orgId = existingOrg.id
      } else {
        // Create organization
        const { data: org, error: orgError } = await withTimeout(
          supabase
            .from('organizations')
            .insert({
              owner_id: user.id,
              name: formData.organization_name,
              slug: formData.slug.toLowerCase(),
              website: formData.website || null,
              business_type: formData.business_type,
            })
            .select('id')
            .single(),
          20_000,
          'Creating organization',
        )

        if (orgError || !org) {
          console.error('Error creating organization:', JSON.stringify(orgError, null, 2))
          console.error('Error code:', orgError?.code)
          console.error('Error message:', orgError?.message)
          console.error('Error details:', orgError?.details)
          setSubmitError(orgError?.message || 'Could not create your organization. Please try again.')
          setIsLoading(false)
          return
        }

        orgId = org.id
      }

      // Upsert profile (create if missing, update if exists)
      const { error: profileError } = await withTimeout(
        supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: formData.full_name,
            company_name: formData.organization_name,
            company_website: formData.website,
            onboarding_completed: true,
            current_organization_id: orgId,
          }, {
            onConflict: 'id'
          }),
        15_000,
        'Creating/updating profile',
      )

      if (profileError) {
        console.error('Error updating profile:', JSON.stringify(profileError, null, 2))
        setSubmitError(profileError?.message || 'Could not update your profile. Please try again.')
        setIsLoading(false)
        return
      }

      // Apply starter template based on business type
      const starterHomeSlyde = applyStarterTemplate(formData.business_type)
      if (starterHomeSlyde) {
        writeDemoHomeSlyde(starterHomeSlyde)
        console.log('Applied starter template for:', formData.business_type)
      }

      // Success! Redirect to dashboard
      console.log('Onboarding complete, redirecting...')
      setIsLoading(false)
      router.replace('/')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 2 && formData.full_name) {
      setDirection(1)
      setStep(3)
    } else if (
      step === 3 &&
      formData.organization_name &&
      formData.slug &&
      (slugStatus === 'available' || slugStatus === 'owned')
    ) {
      setDirection(1)
      setStep(4)
    }
  }

  const prevStep = () => {
    if (step > 2) {
      // Can't go back to auth step once authenticated
      setDirection(-1)
      setStep(step - 1)
    }
  }

  const canProceedStep3 =
    formData.organization_name &&
    formData.slug.length >= 3 &&
    (slugStatus === 'available' || slugStatus === 'owned')
  const canProceedStep4 = formData.business_type

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    setAuthMessage(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })

    if (error) {
      setAuthMessage({ type: 'error', text: error.message })
      setIsGoogleLoading(false)
    }
  }

  const handleLinkedInSignUp = async () => {
    setIsLinkedInLoading(true)
    setAuthMessage(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })

    if (error) {
      setAuthMessage({ type: 'error', text: error.message })
      setIsLinkedInLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsEmailLoading(true)
    setAuthMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/onboarding`,
      },
    })

    setIsEmailLoading(false)

    if (error) {
      setAuthMessage({ type: 'error', text: error.message })
    } else {
      setAuthMessage({ type: 'success', text: 'Check your email for the magic link!' })
      setEmail('')
    }
  }

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-future-black">
        <Loader2 className="w-8 h-8 animate-spin text-leader-blue" />
      </div>
    )
  }

  // Calculate total steps and current progress
  const totalSteps = 4
  const progressStep = isAuthenticated ? step : 1

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

      {/* iOS-style Progress Dots */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              progressStep === i ? 'bg-leader-blue w-6' : progressStep > i ? 'bg-leader-blue w-2' : 'bg-white/20 w-2'
            }`}
            layout
          />
        ))}
      </div>

      {/* Card with iOS-style animations */}
      <div className="w-full max-w-md">
        <motion.div
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Step 1: Auth (ATTENTION) */}
              {step === 1 && !isAuthenticated && (
                <div>
                  <h2 className="text-2xl font-display font-semibold mb-2 tracking-tight">
                    Create your Slyde
                  </h2>
                  <p className="text-white/50 mb-8 text-[15px]">
                    Sign up to get started. It takes 60 seconds.
                  </p>

                  {/* OAuth Buttons */}
                  <div className="space-y-3">
                    {/* Google */}
                    <motion.button
                      type="button"
                      onClick={handleGoogleSignUp}
                      disabled={isGoogleLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-4 px-4 rounded-2xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGoogleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span>
                            Continue with <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
                          </span>
                        </>
                      )}
                    </motion.button>

                    {/* LinkedIn */}
                    <motion.button
                      type="button"
                      onClick={handleLinkedInSignUp}
                      disabled={isLinkedInLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-3 bg-[#0A66C2] text-white font-medium py-4 px-4 rounded-2xl hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLinkedInLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          Continue with LinkedIn
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-5">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/40 text-sm">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Email Signup */}
                  <form onSubmit={handleEmailSignUp} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                        className="w-full bg-white/[0.06] border-0 rounded-2xl py-4 pl-12 pr-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 focus:bg-white/[0.08] transition-all text-[17px]"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isEmailLoading || !email}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-leader-blue text-white font-semibold py-4 px-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[17px]"
                    >
                      {isEmailLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Send magic link
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Auth Message */}
                  <AnimatePresence>
                    {authMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`mt-4 rounded-2xl p-4 text-[13px] ${
                          authMessage.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-200'
                            : 'bg-red-500/10 border border-red-500/20 text-red-200'
                        }`}
                      >
                        {authMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login link */}
                  <p className="text-center text-white/40 text-[13px] mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-leader-blue hover:underline">
                      Sign in
                    </a>
                  </p>
                </div>
              )}

              {/* Step 2: Your Name (INTEREST) */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-display font-semibold mb-2 tracking-tight">
                    Welcome to Slydes
                  </h2>
                  <p className="text-white/50 mb-8 text-[15px]">
                    What should we call you?
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="full_name" className="block text-[13px] font-medium text-white/60 mb-2 uppercase tracking-wide">
                        Your name
                      </label>
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="James Smith"
                        autoComplete="name"
                        autoFocus
                        className="w-full bg-white/[0.06] border-0 rounded-2xl py-4 px-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 focus:bg-white/[0.08] transition-all text-[17px]"
                      />
                    </div>

                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.full_name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-leader-blue text-white font-semibold py-4 px-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[17px]"
                    >
                      Continue
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Step 3: Organization & Subdomain (DESIRE) */}
              {step === 3 && (
                <div>
                  {/* Back button - iOS style */}
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-leader-blue mb-6 -ml-1"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-[17px]">Back</span>
                  </motion.button>

                  <h2 className="text-2xl font-display font-semibold mb-2 tracking-tight">
                    Your business
                  </h2>
                  <p className="text-white/50 mb-8 text-[15px]">
                    This is where your customers will find you.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="organization_name" className="block text-[13px] font-medium text-white/60 mb-2 uppercase tracking-wide">
                        Business name
                      </label>
                      <input
                        id="organization_name"
                        name="organization_name"
                        type="text"
                        value={formData.organization_name}
                        onChange={handleChange}
                        placeholder="The Kitchen Table"
                        autoComplete="organization"
                        autoFocus
                        className="w-full bg-white/[0.06] border-0 rounded-2xl py-4 px-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 focus:bg-white/[0.08] transition-all text-[17px]"
                      />
                    </div>

                    <div>
                      <label htmlFor="slug" className="block text-[13px] font-medium text-white/60 mb-2 uppercase tracking-wide">
                        Your Slydes URL
                      </label>
                      <div className="relative">
                        <div className="flex items-center bg-white/[0.06] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-leader-blue/50">
                          <input
                            id="slug"
                            name="slug"
                            type="text"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="thekitchentable"
                            className="flex-1 bg-transparent py-4 px-5 text-white placeholder:text-white/30 focus:outline-none text-[17px]"
                          />
                          <div className="flex items-center gap-2 px-4 py-4 text-white/40 bg-white/[0.04] border-l border-white/[0.06]">
                            {formData.slug.length >= 3 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              >
                                {slugStatus === 'checking' && (
                                  <Loader2 className="w-5 h-5 animate-spin text-white/40" />
                                )}
                                {slugStatus === 'available' && (
                                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-400" />
                                  </div>
                                )}
                                {slugStatus === 'owned' && (
                                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-400" />
                                  </div>
                                )}
                                {slugStatus === 'taken' && (
                                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <X className="w-4 h-4 text-red-400" />
                                  </div>
                                )}
                              </motion.div>
                            )}
                            <span className="text-[15px]">.slydes.io</span>
                          </div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {slugStatus === 'taken' && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-400 text-[13px] mt-2"
                          >
                            This URL is already taken
                          </motion.p>
                        )}
                        {slugStatus === 'owned' && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-green-400 text-[13px] mt-2"
                          >
                            This URL is already yours
                          </motion.p>
                        )}
                        {slugStatus === 'available' && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-green-400 text-[13px] mt-2"
                          >
                            Perfect! This URL is available
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-[13px] font-medium text-white/60 mb-2 uppercase tracking-wide">
                        Current website <span className="text-white/30 normal-case">(optional)</span>
                      </label>
                      <input
                        id="website"
                        name="website"
                        type="text"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="thekitchentable.com"
                        className="w-full bg-white/[0.06] border-0 rounded-2xl py-4 px-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 focus:bg-white/[0.08] transition-all text-[17px]"
                      />
                    </div>

                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceedStep3}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-leader-blue text-white font-semibold py-4 px-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[17px]"
                    >
                      Continue
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Step 4: Business Type (ACTION) */}
              {step === 4 && (
                <div>
                  {/* Back button - iOS style */}
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-leader-blue mb-6 -ml-1"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-[17px]">Back</span>
                  </motion.button>

                  <h2 className="text-2xl font-display font-semibold mb-2 tracking-tight">
                    What type of business?
                  </h2>
                  <p className="text-white/50 mb-6 text-[15px]">
                    We'll customize your experience based on this.
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {businessTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, business_type: type.id, other_description: type.id === 'other' ? prev.other_description : '' }))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${
                          formData.business_type === type.id
                            ? 'bg-leader-blue/20 ring-2 ring-leader-blue text-white'
                            : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-[14px] font-medium leading-tight">{type.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom industry input when "Other" is selected */}
                  <AnimatePresence>
                    {formData.business_type === 'other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 overflow-hidden"
                      >
                        <label htmlFor="other_description" className="block text-[13px] font-medium text-white/60 mb-2 uppercase tracking-wide">
                          Tell us about your industry
                        </label>
                        <input
                          id="other_description"
                          name="other_description"
                          type="text"
                          value={formData.other_description}
                          onChange={handleChange}
                          placeholder="e.g. Fitness studio, Salon, Retail..."
                          autoFocus
                          className="w-full bg-white/[0.06] border-0 rounded-2xl py-4 px-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 focus:bg-white/[0.08] transition-all text-[17px]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error message */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mb-4 rounded-2xl p-4 text-[13px] bg-red-500/10 border border-red-500/20 text-red-200"
                      >
                        {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Launch button */}
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canProceedStep4 || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-leader-blue text-white font-semibold py-4 px-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[17px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Launch Studio
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Prompt to select business type if not selected */}
                  {!canProceedStep4 && (
                    <p className="text-white/40 text-center text-[15px] mt-6">
                      Select your business type to continue
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
