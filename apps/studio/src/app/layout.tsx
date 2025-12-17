import type { Metadata } from 'next'
import { spaceGrotesk, inter, jetbrainsMono } from '@/lib/fonts'
import { Providers } from './providers'
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
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-future-black text-white antialiased font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
