/**
 * Slyde Wizard Templates
 *
 * AIDA-optimized frame structures for each vertical.
 * Templates create Slydes with pre-populated frames - users just fill in their media.
 */

import type { CTAType } from '@/components/slyde-demo'
import type { VerticalType } from '@slydes/types'
import { propertyTemplates } from './property'
import { hospitalityTemplates } from './hospitality'

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
  // Experience-first verticals (primary focus)
  'restaurant-bar': hospitalityTemplates,
  hotel: hospitalityTemplates,
  venue: hospitalityTemplates,
  adventure: hospitalityTemplates,
  wellness: hospitalityTemplates,
  hospitality: hospitalityTemplates,
  food: hospitalityTemplates,
  beauty: hospitalityTemplates,
  // Legacy verticals (for existing users)
  property: propertyTemplates,
  automotive: propertyTemplates,
  other: hospitalityTemplates,
}

/**
 * Get templates for a vertical
 * Falls back to hospitality templates (experience-first positioning)
 */
export function getTemplatesForVertical(vertical: VerticalType | null): SlydeTemplate[] {
  // If vertical specified and has templates, use those
  if (vertical && TEMPLATE_REGISTRY[vertical]?.length > 0) {
    return TEMPLATE_REGISTRY[vertical]
  }

  // Fallback to hospitality templates (experience-first)
  return hospitalityTemplates
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
