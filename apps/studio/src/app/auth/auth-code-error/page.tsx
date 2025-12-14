import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-future-black">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-display font-semibold mb-2">
          Authentication Error
        </h1>
        <p className="text-white/60 mb-8">
          Something went wrong during authentication. This link may have expired or already been used.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-leader-blue text-white font-medium py-3 px-6 rounded-xl hover:bg-leader-blue/90 transition-colors"
        >
          Try again
        </Link>
      </div>
    </div>
  )
}
