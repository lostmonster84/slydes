import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        'future-black': '#0A0E27',
        'leader-blue': '#2563EB',
        'electric-cyan': '#22D3EE',
        
        // Grays (for clean UI)
        'gray-50': '#FAFAFA',
        'gray-100': '#F4F4F5',
        'gray-200': '#E4E4E7',
        'gray-300': '#D4D4D8',
        'gray-400': '#A1A1AA',
        'gray-500': '#71717A',
        'gray-600': '#52525B',
        'gray-700': '#3F3F46',
        'gray-800': '#27272A',
        'gray-900': '#18181B',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 20s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}

export default config
