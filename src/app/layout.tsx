import type { Metadata, Viewport } from 'next'
import { spaceGrotesk, inter, jetbrainsMono } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Slydes - Mobile sites that customers actually use',
  description: 'TikTok-style vertical scrolling for businesses. Built in minutes, not months. Join 50 founding members building the future of mobile-first business sites.',
  keywords: ['mobile-first', 'business sites', 'TikTok-style', 'vertical scrolling', 'microsites', 'mobile website builder'],
  authors: [{ name: 'Slydes' }],
  openGraph: {
    title: 'Slydes - Mobile sites that customers actually use',
    description: 'TikTok-style vertical scrolling for businesses. Built in minutes, not months.',
    type: 'website',
    url: 'https://slydes.io',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
