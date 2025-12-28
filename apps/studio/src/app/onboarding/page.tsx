'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Check, X, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { applyStarterTemplate } from '@/lib/starterTemplates'
import { writeDemoHomeSlyde } from '@/lib/demoHomeSlyde'

interface BusinessType {
  id: string
  label: string
  icon: string
}

// Fallback types if API fails - matches HQ verticals
const DEFAULT_BUSINESS_TYPES: BusinessType[] = [
  { id: 'property', label: 'Property (Sales & Lettings)', icon: '🏠' },
  { id: 'hospitality', label: 'Hospitality (Hotels, Holiday Lets)', icon: '🏨' },
  { id: 'automotive', label: 'Automotive (Car Hire, Dealerships)', icon: '🚗' },
  { id: 'other', label: 'Other', icon: '✨' },
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
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'owned' | 'taken'>('idle')
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(DEFAULT_BUSINESS_TYPES)
  const [formData, setFormData] = useState({
    full_name: '',
    organization_name: '',
    slug: '',
    website: '',
    business_type: '',
    other_description: '', // Custom industry description when "other" is selected
  })

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
      // 1) If the org is visible to this user (RLS), treat it as "owned" (or at least accessible).
      // 2) Otherwise fall back to the older boolean RPC which checks global uniqueness.
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
        router.push('/login')
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
    if (step === 1 && formData.full_name) {
      setDirection(1)
      setStep(2)
    } else if (
      step === 2 &&
      formData.organization_name &&
      formData.slug &&
      (slugStatus === 'available' || slugStatus === 'owned')
    ) {
      setDirection(1)
      setStep(3)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1)
      setStep(step - 1)
    }
  }

  const canProceedStep2 =
    formData.organization_name &&
    formData.slug.length >= 3 &&
    (slugStatus === 'available' || slugStatus === 'owned')
  const canProceedStep3 = formData.business_type

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
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              step === i ? 'bg-leader-blue w-6' : step > i ? 'bg-leader-blue w-2' : 'bg-white/20 w-2'
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
              {/* Step 1: Your Name */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-display font-semibold mb-2 tracking-tight">
                    Welcome to Slydes
                  </h2>
                  <p className="text-white/50 mb-8 text-[15px]">
                    Let's get you set up. What should we call you?
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

              {/* Step 2: Organization & Subdomain */}
              {step === 2 && (
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
                        placeholder="Bloom Studio"
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
                            placeholder="bloomstudio"
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
                        placeholder="bloomstudio.com"
                        className="w-full bg-white/[0.06] border-0 rounded-2xl py-4 px-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 focus:bg-white/[0.08] transition-all text-[17px]"
                      />
                    </div>

                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceedStep2}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-leader-blue text-white font-semibold py-4 px-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[17px]"
                    >
                      Continue
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Step 3: Business Type */}
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
                          placeholder="e.g. Fitness studio, Restaurant, Event venue..."
                          autoFocus
                          className="w-full bg-white/[0.06] border-0 rounded-2xl py-4 px-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 focus:bg-white/[0.08] transition-all text-[17px]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !canProceedStep3}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-leader-blue text-white font-semibold py-4 px-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[17px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Get started'
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-[13px] text-red-200"
                      >
                        {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
