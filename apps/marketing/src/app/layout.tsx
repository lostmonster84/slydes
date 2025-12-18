import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { PageTracker } from '@/components/PageTracker'
import { spaceGrotesk, inter, jetbrainsMono } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Slydes - Mobile sites that customers actually use',
  description: 'TikTok-style vertical video storefronts for businesses. Built in minutes, not months. Free to start, $19/mo for Pro.',
  keywords: ['mobile-first', 'business sites', 'TikTok-style', 'vertical scrolling', 'microsites', 'mobile website builder'],
  authors: [{ name: 'Slydes' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Slydes - Mobile sites that customers actually use',
    description: 'TikTok-style vertical scrolling for businesses. Built in minutes, not months.',
    type: 'website',
    url: 'https://slydes.io',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Slydes - Mobile sites that customers actually use',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slydes - Mobile sites that customers actually use',
    description: 'TikTok-style vertical scrolling for businesses. Built in minutes, not months.',
    images: ['/og-image.png'],
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
        <Analytics />
        <PageTracker />
      </body>
    </html>
  )
}
