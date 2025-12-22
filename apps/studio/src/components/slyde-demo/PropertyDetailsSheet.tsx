'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Bed, Bath, Ruler, Zap, Receipt, Car, Trees, PawPrint, Key, CalendarCheck } from 'lucide-react'
import type { FrameData } from './frameData'

interface PropertyDetailsSheetProps {
  isOpen: boolean
  onClose: () => void
  property?: FrameData['property']
  title?: string
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  'detached': 'Detached House',
  'semi-detached': 'Semi-Detached House',
  'terraced': 'Terraced House',
  'flat': 'Flat / Apartment',
  'bungalow': 'Bungalow',
  'cottage': 'Cottage',
  'villa': 'Villa',
  'land': 'Land',
  'commercial': 'Commercial',
  'other': 'Other',
}

const PRICE_QUALIFIER_LABELS: Record<string, string> = {
  'asking': 'Asking Price',
  'offers_over': 'Offers Over',
  'offers_in_region': 'Offers in Region',
  'fixed': 'Fixed Price',
  'poa': 'POA',
  'pcm': '/month',
  'pw': '/week',
}

const TENURE_LABELS: Record<string, string> = {
  'freehold': 'Freehold',
  'leasehold': 'Leasehold',
  'share_of_freehold': 'Share of Freehold',
}

/**
 * PropertyDetailsSheet - Displays property information in a bottom sheet
 *
 * Shows all filled property info fields in a clean, scannable layout.
 * Pattern: Opens from bottom, slides up, dismisses with X or tap outside.
 */
export function PropertyDetailsSheet({
  isOpen,
  onClose,
  property,
  title = 'Property Details',
}: PropertyDetailsSheetProps) {
  if (!property) return null

  const priceDisplay = property.price
    ? property.priceQualifier && ['pcm', 'pw'].includes(property.priceQualifier)
      ? `${property.price}${PRICE_QUALIFIER_LABELS[property.priceQualifier]}`
      : property.priceQualifier
        ? `${PRICE_QUALIFIER_LABELS[property.priceQualifier]}: ${property.price}`
        : property.price
    : null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl z-50 max-h-[80%] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-white/50" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[60vh] space-y-6">
              {/* Price - Hero treatment */}
              {priceDisplay && (
                <div className="text-center py-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{priceDisplay}</p>
                  {property.propertyType && (
                    <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
                      {PROPERTY_TYPE_LABELS[property.propertyType] || property.propertyType}
                    </p>
                  )}
                </div>
              )}

              {/* Key Stats Grid */}
              {(property.bedrooms !== undefined || property.bathrooms !== undefined || property.sqft !== undefined) && (
                <div className="grid grid-cols-3 gap-3">
                  {property.bedrooms !== undefined && (
                    <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <Bed className="w-5 h-5 text-gray-400 dark:text-white/40 mb-1" />
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.bedrooms}</p>
                      <p className="text-xs text-gray-500 dark:text-white/50">Beds</p>
                    </div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <Bath className="w-5 h-5 text-gray-400 dark:text-white/40 mb-1" />
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.bathrooms}</p>
                      <p className="text-xs text-gray-500 dark:text-white/50">Baths</p>
                    </div>
                  )}
                  {property.sqft !== undefined && (
                    <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <Ruler className="w-5 h-5 text-gray-400 dark:text-white/40 mb-1" />
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.sqft.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-white/50">sq ft</p>
                    </div>
                  )}
                </div>
              )}

              {/* Details List */}
              <div className="space-y-3">
                {property.epcRating && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">EPC Rating</span>
                    </div>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                      ['A', 'B'].includes(property.epcRating) ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                      ['C', 'D'].includes(property.epcRating) ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                    }`}>
                      {property.epcRating}
                    </span>
                  </div>
                )}

                {property.councilTaxBand && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <Receipt className="w-4 h-4" />
                      <span className="text-sm">Council Tax</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Band {property.councilTaxBand}</span>
                  </div>
                )}

                {property.tenure && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <Key className="w-4 h-4" />
                      <span className="text-sm">Tenure</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{TENURE_LABELS[property.tenure]}</span>
                  </div>
                )}

                {property.leaseLength && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <span className="text-sm ml-6">Lease Length</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{property.leaseLength}</span>
                  </div>
                )}

                {property.serviceCharge && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <span className="text-sm ml-6">Service Charge</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{property.serviceCharge}</span>
                  </div>
                )}

                {property.groundRent && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <span className="text-sm ml-6">Ground Rent</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{property.groundRent}</span>
                  </div>
                )}

                {property.availability && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <CalendarCheck className="w-4 h-4" />
                      <span className="text-sm">Availability</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{property.availability}</span>
                  </div>
                )}

                {property.parking && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <Car className="w-4 h-4" />
                      <span className="text-sm">Parking</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{property.parking}</span>
                  </div>
                )}

                {property.garden && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <Trees className="w-4 h-4" />
                      <span className="text-sm">Garden</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{property.garden}</span>
                  </div>
                )}

                {property.petFriendly !== undefined && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/70">
                      <PawPrint className="w-4 h-4" />
                      <span className="text-sm">Pets</span>
                    </div>
                    <span className={`text-sm font-medium ${property.petFriendly ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-white/50'}`}>
                      {property.petFriendly ? 'Allowed' : 'Not allowed'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Safe area padding for mobile */}
            <div className="h-6" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
