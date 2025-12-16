'use client'

import { useState } from 'react'
import { Gift, Check, X } from 'lucide-react'
import { redeemUnlockCode, hasUnlockCode, clearUnlockCode } from '@/lib/whitelist'

export function PromoCodeInput() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false
    return hasUnlockCode()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (redeemUnlockCode(code)) {
      setStatus('success')
      setIsUnlocked(true)
      setCode('')
      // Reload to apply new plan
      setTimeout(() => window.location.reload(), 1500)
    } else {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  const handleClear = () => {
    clearUnlockCode()
    setIsUnlocked(false)
    window.location.reload()
  }

  if (isUnlocked) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-green-400">Pro Unlocked</h3>
            <p className="text-sm text-green-400/70">You have full access to all features</p>
          </div>
          <button
            onClick={handleClear}
            className="text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5 text-white/60" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Promo Code</h3>
          <p className="text-sm text-white/60 mb-3">Have a promo code? Enter it to unlock Pro features</p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className={`flex-1 bg-white/5 border rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all ${
                status === 'error'
                  ? 'border-red-500/50 focus:ring-red-500/30'
                  : status === 'success'
                  ? 'border-green-500/50 focus:ring-green-500/30'
                  : 'border-white/10 focus:ring-leader-blue/30 focus:border-leader-blue/50'
              }`}
            />
            <button
              type="submit"
              disabled={!code.trim()}
              className="px-4 py-2 bg-leader-blue text-white text-sm font-medium rounded-lg hover:bg-leader-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply
            </button>
          </form>

          {status === 'error' && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <X className="w-3 h-3" />
              Invalid code
            </p>
          )}
          {status === 'success' && (
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Pro unlocked! Reloading...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
