'use client'

import { ArrowLeft, Phone, Mail, MapPin, Instagram } from 'lucide-react'
import { useWizard } from '../WizardContext'

export function ContactInfoStep() {
  const { state, actions, canProceed } = useWizard()
  const { contactInfo } = state

  const handleChange = (field: keyof typeof contactInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    actions.setContactInfo({ [field]: e.target.value })
  }

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500">
          <Phone className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          How can customers reach you?
        </h1>
        <p className="mt-2 text-gray-500 dark:text-white/60">
          Add your contact details (all optional)
        </p>
      </div>

      {/* Contact Form */}
      <div className="space-y-4">
        {/* Phone */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white/70">
            <Phone className="h-4 w-4" />
            Phone
            <span className="text-xs text-gray-400">(shows Call button)</span>
          </label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={handleChange('phone')}
            placeholder="+44 1234 567890"
            className="
              w-full rounded-xl border border-gray-200 bg-white px-4 py-3
              text-gray-900 placeholder:text-gray-400
              transition-colors focus:border-leader-blue focus:outline-none focus:ring-2 focus:ring-leader-blue/40
              dark:border-white/10 dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-white/40
            "
            style={{ fontSize: '16px' }}
            autoComplete="tel"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white/70">
            <Mail className="h-4 w-4" />
            Email
          </label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={handleChange('email')}
            placeholder="hello@yourbusiness.com"
            className="
              w-full rounded-xl border border-gray-200 bg-white px-4 py-3
              text-gray-900 placeholder:text-gray-400
              transition-colors focus:border-leader-blue focus:outline-none focus:ring-2 focus:ring-leader-blue/40
              dark:border-white/10 dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-white/40
            "
            style={{ fontSize: '16px' }}
            autoComplete="email"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white/70">
            <MapPin className="h-4 w-4" />
            Address
            <span className="text-xs text-gray-400">(shows Directions button)</span>
          </label>
          <input
            type="text"
            value={contactInfo.address}
            onChange={handleChange('address')}
            placeholder="123 High Street, London, W1A 1AA"
            className="
              w-full rounded-xl border border-gray-200 bg-white px-4 py-3
              text-gray-900 placeholder:text-gray-400
              transition-colors focus:border-leader-blue focus:outline-none focus:ring-2 focus:ring-leader-blue/40
              dark:border-white/10 dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-white/40
            "
            style={{ fontSize: '16px' }}
            autoComplete="street-address"
          />
        </div>

        {/* Social Links */}
        <div className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-white/10">
          <p className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white/70">
            <Instagram className="h-4 w-4" />
            Social Links
            <span className="text-xs text-gray-400">(optional)</span>
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-24 text-sm text-gray-500 dark:text-white/50">Instagram</span>
              <input
                type="text"
                value={contactInfo.instagram}
                onChange={handleChange('instagram')}
                placeholder="@yourbusiness"
                className="
                  flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2
                  text-sm text-gray-900 placeholder:text-gray-400
                  transition-colors focus:border-leader-blue focus:outline-none focus:ring-2 focus:ring-leader-blue/40
                  dark:border-white/10 dark:bg-[#1c1c1e] dark:text-white dark:placeholder:text-white/40
                "
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-24 text-sm text-gray-500 dark:text-white/50">TikTok</span>
              <input
                type="text"
                value={contactInfo.tiktok}
                onChange={handleChange('tiktok')}
                placeholder="@yourbusiness"
                className="
                  flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2
                  text-sm text-gray-900 placeholder:text-gray-400
                  transition-colors focus:border-leader-blue focus:outline-none focus:ring-2 focus:ring-leader-blue/40
                  dark:border-white/10 dark:bg-[#1c1c1e] dark:text-white dark:placeholder:text-white/40
                "
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-24 text-sm text-gray-500 dark:text-white/50">Facebook</span>
              <input
                type="text"
                value={contactInfo.facebook}
                onChange={handleChange('facebook')}
                placeholder="/yourbusiness"
                className="
                  flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2
                  text-sm text-gray-900 placeholder:text-gray-400
                  transition-colors focus:border-leader-blue focus:outline-none focus:ring-2 focus:ring-leader-blue/40
                  dark:border-white/10 dark:bg-[#1c1c1e] dark:text-white dark:placeholder:text-white/40
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={actions.prevStep}
          className="
            flex items-center justify-center gap-2 rounded-xl border border-gray-200
            bg-white px-6 py-4 font-medium text-gray-700
            transition-colors hover:bg-gray-50
            dark:border-white/10 dark:bg-[#2c2c2e] dark:text-white dark:hover:bg-[#3c3c3e]
          "
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <button
          onClick={actions.nextStep}
          disabled={!canProceed}
          className={`
            flex-1 rounded-xl py-4 text-lg font-semibold transition-all
            ${canProceed
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-white/10 dark:text-white/30'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
