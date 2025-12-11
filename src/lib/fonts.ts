import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

// DISPLAY FONT - Headlines, Logo, CTAs, Section Titles
export const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

// BODY FONT - Paragraphs, UI, Descriptions
export const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// ACCENT FONT - Code, Stats, Labels
export const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

