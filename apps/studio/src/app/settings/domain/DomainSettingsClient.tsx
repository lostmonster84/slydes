'use client'

import { useState } from 'react'
import { Globe, AlertTriangle, CheckCircle2, Copy, ExternalLink, RefreshCw, Trash2 } from 'lucide-react'

interface DomainSettingsClientProps {
  orgId: string
  orgName: string
  orgSlug: string
  customDomain: string | null
  customDomainVerified: boolean | null
  customDomainVerifiedAt: string | null
}

export function DomainSettingsClient({
  orgId,
  orgName,
  orgSlug,
  customDomain: initialDomain,
  customDomainVerified: initialVerified,
  customDomainVerifiedAt: initialVerifiedAt,
}: DomainSettingsClientProps) {
  const [domain, setDomain] = useState(initialDomain || '')
  const [inputDomain, setInputDomain] = useState('')
  const [isVerified, setIsVerified] = useState(initialVerified || false)
  const [verifiedAt, setVerifiedAt] = useState(initialVerifiedAt)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const cnameTarget = 'cname.slydes.io'

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConnect = async () => {
    if (!inputDomain.trim()) {
      setError('Please enter a domain')
      return
    }

    // Basic validation
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i
    if (!domainRegex.test(inputDomain.trim())) {
      setError('Please enter a valid domain (e.g., m.yourdomain.com)')
      return
    }

    setShowWarning(true)
  }

  const confirmConnect = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Call API to add domain to Vercel and save to database
      const res = await fetch('/api/domain/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: inputDomain.trim().toLowerCase(),
          orgId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add domain')
      }

      setDomain(data.domain)
      setIsVerified(data.verified)
      setVerifiedAt(data.verified ? new Date().toISOString() : null)
      setInputDomain('')
      setShowWarning(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save domain')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    setError('')

    try {
      const res = await fetch('/api/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, orgId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      if (data.verified) {
        setIsVerified(true)
        setVerifiedAt(new Date().toISOString())
      } else {
        setError(`DNS not configured yet. Expected CNAME pointing to ${cnameTarget}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your custom domain?')) return

    setIsLoading(true)
    setError('')

    try {
      // Call API to remove domain from Vercel and database
      const res = await fetch('/api/domain/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to remove domain')
      }

      setDomain('')
      setIsVerified(false)
      setVerifiedAt(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove domain')
    } finally {
      setIsLoading(false)
    }
  }

  // No domain connected yet
  if (!domain) {
    return (
      <div className="space-y-6">
        {/* Explanation */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-leader-blue/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-leader-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Connect Your Mobile Domain</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Connect a subdomain like <span className="text-white font-mono">m.yourdomain.com</span> to serve your
                Slydes experience from your own domain. Perfect for QR codes, social bio links, and SMS campaigns.
              </p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-500 mb-1">Important: This replaces your mobile site</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                When you connect a domain, visitors to that URL will see your Slydes experience instead of your
                existing website. This is designed for mobile-specific subdomains (m., go., mobile.) - not your main domain.
              </p>
            </div>
          </div>
        </div>

        {/* Current Slydes URL */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Your current Slydes URL</p>
          <div className="flex items-center gap-2">
            <code className="text-white font-mono text-sm">{orgSlug}.slydes.io</code>
            <a
              href={`https://${orgSlug}.slydes.io`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-leader-blue hover:text-electric-cyan transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Domain Input */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-medium mb-3">Mobile Subdomain</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputDomain}
              onChange={(e) => {
                setInputDomain(e.target.value)
                setError('')
              }}
              placeholder="m.yourdomain.com"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 font-mono"
            />
            <button
              onClick={handleConnect}
              disabled={isLoading || !inputDomain.trim()}
              className="px-6 py-3 bg-leader-blue hover:bg-leader-blue/90 disabled:bg-white/10 disabled:text-white/30 rounded-xl font-medium transition-colors"
            >
              {isLoading ? 'Saving...' : 'Connect'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <p className="text-white/40 text-xs mt-3">
            Recommended: m.yourdomain.com, go.yourdomain.com, or mobile.yourdomain.com
          </p>
        </div>

        {/* Warning Confirmation Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold">Confirm Domain Connection</h3>
              </div>

              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                You&apos;re about to connect <span className="text-white font-mono">{inputDomain}</span> to your Slydes.
              </p>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                <p className="text-amber-400 text-sm font-medium mb-2">This means:</p>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Visitors to {inputDomain} will see your Slydes</li>
                  <li>• Any existing content at that URL will be replaced</li>
                  <li>• This is designed for mobile subdomains, not main sites</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWarning(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmConnect}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-leader-blue hover:bg-leader-blue/90 rounded-xl font-medium transition-colors"
                >
                  {isLoading ? 'Connecting...' : 'Yes, Connect'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Domain connected - show setup instructions or verified state
  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {isVerified ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-medium text-green-500">Domain Connected</h3>
              <p className="text-white/60 text-sm">
                Your Slydes are live at <span className="font-mono text-white">{domain}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-medium text-amber-500">DNS Configuration Required</h3>
              <p className="text-white/60 text-sm">
                Add the CNAME record below to complete setup
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Domain Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Connected Domain</p>
            <p className="text-white font-mono text-lg">{domain}</p>
          </div>
          <div className="flex items-center gap-2">
            {isVerified ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
                Verified
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm font-medium">
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-4 pt-4 border-t border-white/10">
          <a
            href={`https://${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-leader-blue hover:text-electric-cyan transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Visit {domain}
          </a>
          <a
            href={`https://${orgSlug}.slydes.io`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            {orgSlug}.slydes.io
          </a>
        </div>
      </div>

      {/* DNS Instructions */}
      {!isVerified && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">DNS Configuration</h3>
          <p className="text-white/60 text-sm mb-4">
            Add this CNAME record in your domain provider (GoDaddy, Cloudflare, Namecheap, etc.):
          </p>

          <div className="bg-black/30 rounded-xl p-4 space-y-3 font-mono text-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/40">Type:</span>
                <span className="text-white ml-2">CNAME</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/40">Host/Name:</span>
                <span className="text-white ml-2">{domain.split('.')[0]}</span>
              </div>
              <button
                onClick={() => handleCopy(domain.split('.')[0])}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-white/40" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/40">Value/Target:</span>
                <span className="text-electric-cyan ml-2">{cnameTarget}</span>
              </div>
              <button
                onClick={() => handleCopy(cnameTarget)}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-white/40" />
              </button>
            </div>
          </div>

          {copied && (
            <p className="text-green-500 text-sm mt-2">Copied to clipboard!</p>
          )}

          <p className="text-white/40 text-xs mt-4">
            DNS changes can take up to 48 hours to propagate, but usually complete within minutes.
          </p>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-leader-blue hover:bg-leader-blue/90 disabled:bg-white/10 rounded-xl font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            {isVerifying ? 'Checking DNS...' : 'Verify DNS'}
          </button>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      )}

      {/* Verified - Show success info */}
      {isVerified && verifiedAt && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs">
            Verified {new Date(verifiedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Remove Domain */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Remove custom domain
        </button>
      </div>
    </div>
  )
}
