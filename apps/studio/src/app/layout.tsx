import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Slydes Studio',
  description: 'Create stunning mobile-first experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-future-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
