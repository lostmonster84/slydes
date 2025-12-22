/**
 * Slyde Wizard Templates
 *
 * AIDA-optimized frame structures for each vertical.
 * Templates create Slydes with pre-populated frames - users just fill in their media.
 */

import type { CTAType } from '@/components/slyde-demo/frameData'
import type { VerticalType } from '@slydes/types'
import { propertyTemplates } from './property'

// ============================================
// Types
// ============================================

/**
 * Frame template - minimal data needed to create a frame
 * Background media is intentionally omitted - user adds their own content
 */
export interface FrameTemplate {
  templateType: 'hook' | 'how' | 'who' | 'what' | 'proof' | 'trust' | 'action' | 'slydes' | 'custom'
  title: string
  subtitle?: string
  cta?: {
    text: string
    type: CTAType
    value?: string
  }
}

/**
 * Slyde template - creates a complete Slyde with frames
 */
export interface SlydeTemplate {
  id: string                    // Unique template identifier (e.g., 'property-listing')
  name: string                  // Display name: "Property Listing"
  description: string           // Brief description for card
  icon: string                  // Lucide icon name
  vertical: VerticalType        // Which vertical this belongs to
  previewHint: string           // e.g., "5 frames • Hero → Features → Book"
  frames: FrameTemplate[]       // Frame structure to create
}

// ============================================
// Registry
// ============================================

/**
 * All templates indexed by vertical
 */
export const TEMPLATE_REGISTRY: Record<VerticalType, SlydeTemplate[]> = {
  property: propertyTemplates,
  hospitality: [], // TODO: Add hospitality templates
  automotive: [],  // TODO: Add automotive templates
  beauty: [],      // TODO: Add beauty templates
  food: [],        // TODO: Add food templates
  other: [],       // Generic templates
}

/**
 * Get templates for a vertical
 * Falls back to property templates if none available for the vertical
 * (Property templates are generic enough - Showcase, Profile, Event work for any business)
 */
export function getTemplatesForVertical(vertical: VerticalType | null): SlydeTemplate[] {
  // If vertical specified and has templates, use those
  if (vertical && TEMPLATE_REGISTRY[vertical]?.length > 0) {
    return TEMPLATE_REGISTRY[vertical]
  }

  // Fallback to property templates (they're universal)
  // TODO: Create truly generic templates when we have more verticals
  return propertyTemplates
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(templateId: string): SlydeTemplate | null {
  for (const templates of Object.values(TEMPLATE_REGISTRY)) {
    const template = templates.find(t => t.id === templateId)
    if (template) return template
  }
  return null
}
