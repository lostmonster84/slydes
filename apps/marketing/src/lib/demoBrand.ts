export type DemoBrandProfile = {
  businessName: string
  tagline: string
  primaryColor: string // hex
  secondaryColor: string // hex
}

export const DEMO_BRAND_STORAGE_KEY = 'slydes_demo_brand'

export const DEFAULT_DEMO_BRAND: DemoBrandProfile = {
  businessName: 'WildTrax',
  tagline: 'Adventure awaits',
  primaryColor: '#2563EB',
  secondaryColor: '#06B6D4',
}

function isHexColor(input: string) {
  return /^#[0-9a-fA-F]{6}$/.test(input)
}

export function readDemoBrandProfile(): DemoBrandProfile {
  if (typeof window === 'undefined') return DEFAULT_DEMO_BRAND
  try {
    const raw = window.localStorage.getItem(DEMO_BRAND_STORAGE_KEY)
    if (!raw) return DEFAULT_DEMO_BRAND
    const parsed = JSON.parse(raw) as Partial<DemoBrandProfile>
    return {
      businessName: typeof parsed.businessName === 'string' && parsed.businessName.trim() ? parsed.businessName : DEFAULT_DEMO_BRAND.businessName,
      tagline: typeof parsed.tagline === 'string' ? parsed.tagline : DEFAULT_DEMO_BRAND.tagline,
      primaryColor: typeof parsed.primaryColor === 'string' && isHexColor(parsed.primaryColor) ? parsed.primaryColor : DEFAULT_DEMO_BRAND.primaryColor,
      secondaryColor: typeof parsed.secondaryColor === 'string' && isHexColor(parsed.secondaryColor) ? parsed.secondaryColor : DEFAULT_DEMO_BRAND.secondaryColor,
    }
  } catch {
    return DEFAULT_DEMO_BRAND
  }
}

export function writeDemoBrandProfile(profile: DemoBrandProfile) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(DEMO_BRAND_STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // ignore
  }
}

export function demoBrandGradient(profile: DemoBrandProfile) {
  return `linear-gradient(135deg, ${profile.primaryColor} 0%, ${profile.secondaryColor} 100%)`
}


