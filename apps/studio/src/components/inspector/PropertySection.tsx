'use client'

import { ChevronDown, Home, MapPin, Video, LayoutGrid, Calendar, FileText, Phone, ClipboardCheck, HandCoins, Bed, Bath, Ruler, Zap, Car, Trees, PawPrint, Key, Receipt } from 'lucide-react'
import type { FrameData } from '@/components/slyde-demo'

interface PropertySectionProps {
  isExpanded: boolean
  onToggle: () => void
  property: FrameData['property']
  onPropertyChange: (property: FrameData['property']) => void
}

const PROPERTY_TYPES = [
  { value: 'detached', label: 'Detached' },
  { value: 'semi-detached', label: 'Semi-Detached' },
  { value: 'terraced', label: 'Terraced' },
  { value: 'flat', label: 'Flat' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
] as const

const PRICE_QUALIFIERS = [
  { value: 'asking', label: 'Asking Price' },
  { value: 'offers_over', label: 'Offers Over' },
  { value: 'offers_in_region', label: 'Offers in Region' },
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'poa', label: 'POA' },
  { value: 'pcm', label: 'Per Month' },
  { value: 'pw', label: 'Per Week' },
] as const

const EPC_RATINGS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const
const COUNCIL_TAX_BANDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const

const TENURE_OPTIONS = [
  { value: 'freehold', label: 'Freehold' },
  { value: 'leasehold', label: 'Leasehold' },
  { value: 'share_of_freehold', label: 'Share of Freehold' },
] as const

/**
 * PropertySection - Property-specific fields for the Inspector
 *
 * Only shown when org.vertical === 'property'
 * Contains both action fields (URLs that create buttons) and info fields (displayed in PropertyDetails sheet)
 */
export function PropertySection({
  isExpanded,
  onToggle,
  property,
  onPropertyChange,
}: PropertySectionProps) {
  const updateProperty = (updates: Partial<NonNullable<FrameData['property']>>) => {
    onPropertyChange({
      ...property,
      ...updates,
    })
  }

  // Count how many fields are filled
  const actionFieldCount = [
    property?.locationUrl,
    property?.virtualTourUrl,
    property?.floorPlanUrl,
    property?.bookViewingUrl,
    property?.brochureUrl,
    property?.agentPhone,
    property?.applyUrl,
    property?.makeOfferUrl,
  ].filter(Boolean).length

  const infoFieldCount = [
    property?.price,
    property?.bedrooms,
    property?.bathrooms,
    property?.propertyType,
    property?.sqft,
    property?.epcRating,
    property?.councilTaxBand,
    property?.availability,
    property?.parking,
    property?.garden,
    property?.petFriendly,
    property?.tenure,
    property?.leaseLength,
    property?.serviceCharge,
    property?.groundRent,
  ].filter(v => v !== undefined && v !== null && v !== '').length

  const totalFilledCount = actionFieldCount + infoFieldCount

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-gray-500 dark:text-white/50" />
          <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
            Property Details
          </span>
          {totalFilledCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
              {totalFilledCount} filled
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
      </button>

      {isExpanded && (
        <div className="p-4 space-y-6 border-t border-gray-200 dark:border-white/10">
          {/* Action Fields - Create buttons in action stack */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
              Action Buttons
            </p>
            <p className="text-[11px] text-gray-400 dark:text-white/40">
              Fill in URLs to show buttons in the action stack
            </p>

            {/* Location URL */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <MapPin className="w-3.5 h-3.5" />
                Location / Directions
              </label>
              <input
                type="url"
                value={property?.locationUrl || ''}
                onChange={(e) => updateProperty({ locationUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              />
            </div>

            {/* Virtual Tour URL */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <Video className="w-3.5 h-3.5" />
                Virtual Tour
              </label>
              <input
                type="url"
                value={property?.virtualTourUrl || ''}
                onChange={(e) => updateProperty({ virtualTourUrl: e.target.value })}
                placeholder="https://my.matterport.com/..."
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              />
            </div>

            {/* Floor Plan URL */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <LayoutGrid className="w-3.5 h-3.5" />
                Floor Plan
              </label>
              <input
                type="url"
                value={property?.floorPlanUrl || ''}
                onChange={(e) => updateProperty({ floorPlanUrl: e.target.value })}
                placeholder="https://... (image or PDF)"
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              />
            </div>

            {/* Book Viewing URL */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <Calendar className="w-3.5 h-3.5" />
                Book Viewing
              </label>
              <input
                type="url"
                value={property?.bookViewingUrl || ''}
                onChange={(e) => updateProperty({ bookViewingUrl: e.target.value })}
                placeholder="https://calendly.com/..."
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              />
            </div>

            {/* Brochure URL */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <FileText className="w-3.5 h-3.5" />
                Brochure / PDF
              </label>
              <input
                type="url"
                value={property?.brochureUrl || ''}
                onChange={(e) => updateProperty({ brochureUrl: e.target.value })}
                placeholder="https://... (PDF download)"
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              />
            </div>

            {/* Agent Phone */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <Phone className="w-3.5 h-3.5" />
                Agent Phone
              </label>
              <input
                type="tel"
                value={property?.agentPhone || ''}
                onChange={(e) => updateProperty({ agentPhone: e.target.value })}
                placeholder="+44 7700 900000"
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              />
            </div>

            {/* Apply URL (Rental) */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <ClipboardCheck className="w-3.5 h-3.5" />
                Apply Now (Rental)
              </label>
              <input
                type="url"
                value={property?.applyUrl || ''}
                onChange={(e) => updateProperty({ applyUrl: e.target.value })}
                placeholder="https://... (application form)"
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              />
            </div>

            {/* Make Offer URL (Sales) */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <HandCoins className="w-3.5 h-3.5" />
                Make an Offer (Sales)
              </label>
              <input
                type="url"
                value={property?.makeOfferUrl || ''}
                onChange={(e) => updateProperty({ makeOfferUrl: e.target.value })}
                placeholder="https://... (offer form)"
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-white/10" />

          {/* Info Fields - Displayed in PropertyDetails sheet */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
              Property Information
            </p>
            <p className="text-[11px] text-gray-400 dark:text-white/40">
              Details shown in the property info sheet
            </p>

            {/* Price */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-gray-600 dark:text-white/60">
                  Price
                </label>
                <input
                  type="text"
                  value={property?.price || ''}
                  onChange={(e) => updateProperty({ price: e.target.value })}
                  placeholder="£425,000"
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-gray-600 dark:text-white/60">
                  Qualifier
                </label>
                <select
                  value={property?.priceQualifier || ''}
                  onChange={(e) => updateProperty({ priceQualifier: e.target.value as typeof PRICE_QUALIFIERS[number]['value'] || undefined })}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                >
                  <option value="">Select...</option>
                  {PRICE_QUALIFIERS.map((q) => (
                    <option key={q.value} value={q.value}>{q.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                  <Bed className="w-3.5 h-3.5" />
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={property?.bedrooms ?? ''}
                  onChange={(e) => updateProperty({ bedrooms: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="3"
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                />
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                  <Bath className="w-3.5 h-3.5" />
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={property?.bathrooms ?? ''}
                  onChange={(e) => updateProperty({ bathrooms: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="2"
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                />
              </div>
            </div>

            {/* Property Type & Size */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-gray-600 dark:text-white/60">
                  Property Type
                </label>
                <select
                  value={property?.propertyType || ''}
                  onChange={(e) => updateProperty({ propertyType: e.target.value as typeof PROPERTY_TYPES[number]['value'] || undefined })}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                >
                  <option value="">Select...</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                  <Ruler className="w-3.5 h-3.5" />
                  Size (sq ft)
                </label>
                <input
                  type="number"
                  min="0"
                  value={property?.sqft ?? ''}
                  onChange={(e) => updateProperty({ sqft: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="1,450"
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                />
              </div>
            </div>

            {/* EPC & Council Tax */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                  <Zap className="w-3.5 h-3.5" />
                  EPC Rating
                </label>
                <select
                  value={property?.epcRating || ''}
                  onChange={(e) => updateProperty({ epcRating: e.target.value as typeof EPC_RATINGS[number] || undefined })}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                >
                  <option value="">Select...</option>
                  {EPC_RATINGS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                  <Receipt className="w-3.5 h-3.5" />
                  Council Tax Band
                </label>
                <select
                  value={property?.councilTaxBand || ''}
                  onChange={(e) => updateProperty({ councilTaxBand: e.target.value as typeof COUNCIL_TAX_BANDS[number] || undefined })}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                >
                  <option value="">Select...</option>
                  {COUNCIL_TAX_BANDS.map((b) => (
                    <option key={b} value={b}>Band {b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <Key className="w-3.5 h-3.5" />
                Tenure
              </label>
              <select
                value={property?.tenure || ''}
                onChange={(e) => updateProperty({ tenure: e.target.value as typeof TENURE_OPTIONS[number]['value'] || undefined })}
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              >
                <option value="">Select...</option>
                {TENURE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Lease Length (if leasehold) */}
            {(property?.tenure === 'leasehold' || property?.tenure === 'share_of_freehold') && (
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-gray-600 dark:text-white/60">
                  Lease Length
                </label>
                <input
                  type="text"
                  value={property?.leaseLength || ''}
                  onChange={(e) => updateProperty({ leaseLength: e.target.value })}
                  placeholder="990 years remaining"
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                />
              </div>
            )}

            {/* Service Charge & Ground Rent (if leasehold) */}
            {(property?.tenure === 'leasehold' || property?.tenure === 'share_of_freehold') && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gray-600 dark:text-white/60">
                    Service Charge
                  </label>
                  <input
                    type="text"
                    value={property?.serviceCharge || ''}
                    onChange={(e) => updateProperty({ serviceCharge: e.target.value })}
                    placeholder="£150/month"
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gray-600 dark:text-white/60">
                    Ground Rent
                  </label>
                  <input
                    type="text"
                    value={property?.groundRent || ''}
                    onChange={(e) => updateProperty({ groundRent: e.target.value })}
                    placeholder="£250/year"
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                  />
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-gray-600 dark:text-white/60">
                Availability
              </label>
              <input
                type="text"
                value={property?.availability || ''}
                onChange={(e) => updateProperty({ availability: e.target.value })}
                placeholder="Available now / 1st February 2025"
                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              />
            </div>

            {/* Parking & Garden */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                  <Car className="w-3.5 h-3.5" />
                  Parking
                </label>
                <input
                  type="text"
                  value={property?.parking || ''}
                  onChange={(e) => updateProperty({ parking: e.target.value })}
                  placeholder="Driveway, Garage"
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                />
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                  <Trees className="w-3.5 h-3.5" />
                  Garden
                </label>
                <input
                  type="text"
                  value={property?.garden || ''}
                  onChange={(e) => updateProperty({ garden: e.target.value })}
                  placeholder="Private garden"
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                />
              </div>
            </div>

            {/* Pet Friendly */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 dark:text-white/60">
                <PawPrint className="w-3.5 h-3.5" />
                Pet Friendly
              </label>
              <button
                onClick={() => updateProperty({ petFriendly: !property?.petFriendly })}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  property?.petFriendly ? 'bg-leader-blue' : 'bg-gray-200 dark:bg-white/20'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    property?.petFriendly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
