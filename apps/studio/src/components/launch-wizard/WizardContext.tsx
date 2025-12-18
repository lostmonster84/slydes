'use client'

import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import { type BusinessType, type WizardTemplate, type TemplateSection, getTemplate } from '@/lib/templates'

// ============================================
// STATE TYPES
// ============================================

export interface WizardState {
  // Step tracking
  currentStep: 1 | 2 | 3 | 4 | 5 | 6
  completedSteps: number[]

  // Step 1: Business Setup
  businessSetup: {
    name: string
    slug: string
    slugAvailable: boolean | null
    slugChecking: boolean
  }

  // Step 2: Business Type
  businessType: BusinessType | null
  template: WizardTemplate | null

  // Step 3: Hero Content
  heroContent: {
    type: 'video' | 'image' | null
    file: File | null
    previewUrl: string | null  // Local blob URL for preview
    uploadedUrl: string | null // Final uploaded URL
    isUploading: boolean
    uploadProgress: number
    uploadError: string | null
  }

  // Step 4: Sections
  sections: TemplateSection[]

  // Step 5: Contact Info
  contactInfo: {
    phone: string
    email: string
    address: string
    instagram: string
    tiktok: string
    facebook: string
  }

  // Meta
  isSubmitting: boolean
  submitError: string | null
  isComplete: boolean
}

// ============================================
// ACTIONS
// ============================================

type WizardAction =
  | { type: 'SET_STEP'; step: WizardState['currentStep'] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_BUSINESS_SETUP'; payload: Partial<WizardState['businessSetup']> }
  | { type: 'SET_BUSINESS_TYPE'; businessType: BusinessType }
  | { type: 'SET_HERO_CONTENT'; payload: Partial<WizardState['heroContent']> }
  | { type: 'SET_HERO_FILE'; file: File }
  | { type: 'CLEAR_HERO_CONTENT' }
  | { type: 'SET_SECTIONS'; sections: TemplateSection[] }
  | { type: 'TOGGLE_SECTION'; sectionId: string }
  | { type: 'RENAME_SECTION'; sectionId: string; newName: string }
  | { type: 'ADD_SECTION'; name: string }
  | { type: 'REMOVE_SECTION'; sectionId: string }
  | { type: 'SET_CONTACT_INFO'; payload: Partial<WizardState['contactInfo']> }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_SUBMIT_ERROR'; error: string | null }
  | { type: 'SET_COMPLETE' }
  | { type: 'RESET' }
  | { type: 'RESTORE'; state: WizardState }

// ============================================
// INITIAL STATE
// ============================================

const initialState: WizardState = {
  currentStep: 1,
  completedSteps: [],

  businessSetup: {
    name: '',
    slug: '',
    slugAvailable: null,
    slugChecking: false,
  },

  businessType: null,
  template: null,

  heroContent: {
    type: null,
    file: null,
    previewUrl: null,
    uploadedUrl: null,
    isUploading: false,
    uploadProgress: 0,
    uploadError: null,
  },

  sections: [],

  contactInfo: {
    phone: '',
    email: '',
    address: '',
    instagram: '',
    tiktok: '',
    facebook: '',
  },

  isSubmitting: false,
  submitError: null,
  isComplete: false,
}

// ============================================
// REDUCER
// ============================================

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step }

    case 'NEXT_STEP': {
      const nextStep = Math.min(state.currentStep + 1, 6) as WizardState['currentStep']
      const completedSteps = state.completedSteps.includes(state.currentStep)
        ? state.completedSteps
        : [...state.completedSteps, state.currentStep]
      return { ...state, currentStep: nextStep, completedSteps }
    }

    case 'PREV_STEP': {
      const prevStep = Math.max(state.currentStep - 1, 1) as WizardState['currentStep']
      return { ...state, currentStep: prevStep }
    }

    case 'SET_BUSINESS_SETUP':
      return {
        ...state,
        businessSetup: { ...state.businessSetup, ...action.payload },
      }

    case 'SET_BUSINESS_TYPE': {
      const template = getTemplate(action.businessType)
      return {
        ...state,
        businessType: action.businessType,
        template,
        sections: template.sections.map(s => ({ ...s })), // Clone sections
      }
    }

    case 'SET_HERO_CONTENT':
      return {
        ...state,
        heroContent: { ...state.heroContent, ...action.payload },
      }

    case 'SET_HERO_FILE': {
      const file = action.file
      const isVideo = file.type.startsWith('video/')
      const previewUrl = URL.createObjectURL(file)
      return {
        ...state,
        heroContent: {
          ...state.heroContent,
          type: isVideo ? 'video' : 'image',
          file,
          previewUrl,
          uploadError: null,
        },
      }
    }

    case 'CLEAR_HERO_CONTENT':
      // Revoke old blob URL to prevent memory leak
      if (state.heroContent.previewUrl) {
        URL.revokeObjectURL(state.heroContent.previewUrl)
      }
      return {
        ...state,
        heroContent: {
          type: null,
          file: null,
          previewUrl: null,
          uploadedUrl: null,
          isUploading: false,
          uploadProgress: 0,
          uploadError: null,
        },
      }

    case 'SET_SECTIONS':
      return { ...state, sections: action.sections }

    case 'TOGGLE_SECTION':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.sectionId ? { ...s, enabled: !s.enabled } : s
        ),
      }

    case 'RENAME_SECTION':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.sectionId ? { ...s, name: action.newName } : s
        ),
      }

    case 'ADD_SECTION': {
      const newId = `custom-${Date.now()}`
      const newSection: TemplateSection = {
        id: newId,
        name: action.name,
        icon: 'star',
        enabled: true,
      }
      return {
        ...state,
        sections: [...state.sections, newSection],
      }
    }

    case 'REMOVE_SECTION':
      return {
        ...state,
        sections: state.sections.filter(s => s.id !== action.sectionId),
      }

    case 'SET_CONTACT_INFO':
      return {
        ...state,
        contactInfo: { ...state.contactInfo, ...action.payload },
      }

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting }

    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.error }

    case 'SET_COMPLETE':
      return { ...state, isComplete: true }

    case 'RESET':
      return initialState

    case 'RESTORE':
      return action.state

    default:
      return state
  }
}

// ============================================
// CONTEXT
// ============================================

interface WizardContextValue {
  state: WizardState
  actions: {
    setStep: (step: WizardState['currentStep']) => void
    nextStep: () => void
    prevStep: () => void
    setBusinessSetup: (data: Partial<WizardState['businessSetup']>) => void
    setBusinessType: (type: BusinessType) => void
    setHeroFile: (file: File) => void
    setHeroContent: (data: Partial<WizardState['heroContent']>) => void
    clearHeroContent: () => void
    toggleSection: (sectionId: string) => void
    renameSection: (sectionId: string, newName: string) => void
    addSection: (name: string) => void
    removeSection: (sectionId: string) => void
    setContactInfo: (data: Partial<WizardState['contactInfo']>) => void
    setSubmitting: (isSubmitting: boolean) => void
    setSubmitError: (error: string | null) => void
    setComplete: () => void
    reset: () => void
  }
  // Computed
  canProceed: boolean
  enabledSections: TemplateSection[]
}

const WizardContext = createContext<WizardContextValue | null>(null)

// ============================================
// STORAGE
// ============================================

const WIZARD_STATE_KEY = 'slydes_wizard_state'

function saveWizardState(state: WizardState): void {
  if (typeof window === 'undefined') return
  try {
    // Don't save file objects or blob URLs
    const stateToSave = {
      ...state,
      heroContent: {
        ...state.heroContent,
        file: null,
        previewUrl: null,
      },
    }
    sessionStorage.setItem(WIZARD_STATE_KEY, JSON.stringify(stateToSave))
  } catch {
    // Ignore storage errors
  }
}

function loadWizardState(): WizardState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(WIZARD_STATE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as WizardState
  } catch {
    return null
  }
}

function clearWizardStorage(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(WIZARD_STATE_KEY)
}

// ============================================
// PROVIDER
// ============================================

interface WizardProviderProps {
  children: ReactNode
  skipOrgSetup?: boolean  // If org already exists, skip step 1
}

export function WizardProvider({ children, skipOrgSetup = false }: WizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialState, (initial) => {
    // Try to restore from session storage
    const saved = loadWizardState()
    if (saved && !saved.isComplete) {
      return saved
    }
    // If skipping org setup, start at step 2
    if (skipOrgSetup) {
      return { ...initial, currentStep: 2 as const }
    }
    return initial
  })

  // Save state changes to session storage
  useEffect(() => {
    if (!state.isComplete) {
      saveWizardState(state)
    }
  }, [state])

  // Clear storage when complete
  useEffect(() => {
    if (state.isComplete) {
      clearWizardStorage()
    }
  }, [state.isComplete])

  // Actions
  const actions = {
    setStep: useCallback((step: WizardState['currentStep']) => {
      dispatch({ type: 'SET_STEP', step })
    }, []),

    nextStep: useCallback(() => {
      dispatch({ type: 'NEXT_STEP' })
    }, []),

    prevStep: useCallback(() => {
      dispatch({ type: 'PREV_STEP' })
    }, []),

    setBusinessSetup: useCallback((data: Partial<WizardState['businessSetup']>) => {
      dispatch({ type: 'SET_BUSINESS_SETUP', payload: data })
    }, []),

    setBusinessType: useCallback((type: BusinessType) => {
      dispatch({ type: 'SET_BUSINESS_TYPE', businessType: type })
    }, []),

    setHeroFile: useCallback((file: File) => {
      dispatch({ type: 'SET_HERO_FILE', file })
    }, []),

    setHeroContent: useCallback((data: Partial<WizardState['heroContent']>) => {
      dispatch({ type: 'SET_HERO_CONTENT', payload: data })
    }, []),

    clearHeroContent: useCallback(() => {
      dispatch({ type: 'CLEAR_HERO_CONTENT' })
    }, []),

    toggleSection: useCallback((sectionId: string) => {
      dispatch({ type: 'TOGGLE_SECTION', sectionId })
    }, []),

    renameSection: useCallback((sectionId: string, newName: string) => {
      dispatch({ type: 'RENAME_SECTION', sectionId, newName })
    }, []),

    addSection: useCallback((name: string) => {
      dispatch({ type: 'ADD_SECTION', name })
    }, []),

    removeSection: useCallback((sectionId: string) => {
      dispatch({ type: 'REMOVE_SECTION', sectionId })
    }, []),

    setContactInfo: useCallback((data: Partial<WizardState['contactInfo']>) => {
      dispatch({ type: 'SET_CONTACT_INFO', payload: data })
    }, []),

    setSubmitting: useCallback((isSubmitting: boolean) => {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting })
    }, []),

    setSubmitError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_SUBMIT_ERROR', error })
    }, []),

    setComplete: useCallback(() => {
      dispatch({ type: 'SET_COMPLETE' })
    }, []),

    reset: useCallback(() => {
      clearWizardStorage()
      dispatch({ type: 'RESET' })
    }, []),
  }

  // Computed: can proceed to next step?
  const canProceed = (() => {
    switch (state.currentStep) {
      case 1:
        return (
          state.businessSetup.name.trim().length >= 2 &&
          state.businessSetup.slug.trim().length >= 3 &&
          state.businessSetup.slugAvailable === true
        )
      case 2:
        return state.businessType !== null
      case 3:
        // Can proceed even without hero content (optional)
        return true
      case 4:
        return state.sections.some(s => s.enabled)
      case 5:
        // Contact info is optional
        return true
      case 6:
        return !state.isSubmitting
      default:
        return false
    }
  })()

  // Computed: enabled sections only
  const enabledSections = state.sections.filter(s => s.enabled)

  const value: WizardContextValue = {
    state,
    actions,
    canProceed,
    enabledSections,
  }

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  )
}

// ============================================
// HOOK
// ============================================

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}
