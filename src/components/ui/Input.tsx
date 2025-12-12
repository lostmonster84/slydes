'use client'

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

// ============================================
// INPUT COMPONENTS WITH BUILT-IN CONTRAST
// ============================================
// Use these instead of raw <input> to ensure
// proper contrast on light/dark backgrounds.
// ============================================

type InputProps = InputHTMLAttributes<HTMLInputElement>
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

// ============================================
// LIGHT CONTEXT INPUTS
// For use on: bg-white, bg-gray-50, bg-gray-100
// ============================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/20 outline-none transition-all ${className}`}
        style={{ fontSize: '16px' }} // Prevents iOS zoom
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/20 outline-none transition-all resize-none ${className}`}
        style={{ fontSize: '16px' }} // Prevents iOS zoom
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

// ============================================
// DARK CONTEXT INPUTS
// For use on: bg-gray-800, bg-gray-900, bg-future-black
// ============================================

export const DarkInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-leader-blue focus:ring-1 focus:ring-leader-blue outline-none transition-all ${className}`}
        style={{ fontSize: '16px' }} // Prevents iOS zoom
        {...props}
      />
    )
  }
)
DarkInput.displayName = 'DarkInput'

export const DarkTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-leader-blue focus:ring-1 focus:ring-leader-blue outline-none transition-all resize-none ${className}`}
        style={{ fontSize: '16px' }} // Prevents iOS zoom
        {...props}
      />
    )
  }
)
DarkTextarea.displayName = 'DarkTextarea'

