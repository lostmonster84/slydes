import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Navigator/Inspector size toggle classes (S/M/L)
    // Width classes
    'w-72', 'w-80', 'w-96', 'w-[28rem]',
    // Text sizes
    'text-[10px]', 'text-[11px]', 'text-[12px]', 'text-[13px]', 'text-[14px]', 'text-[15px]', 'text-[16px]', 'text-[17px]',
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
    // Padding classes
    'p-3', 'p-4', 'p-5', 'p-6',
    'px-2', 'px-2.5', 'px-3', 'px-3.5', 'px-4',
    'py-1.5', 'py-2', 'py-2.5', 'py-3', 'py-3.5',
    // Icon sizes
    'w-3.5', 'w-4', 'w-5', 'w-6', 'w-7',
    'h-3.5', 'h-4', 'h-5', 'h-6', 'h-7',
    // Animation classes
    'animate-pulse-hint',
  ],
  theme: {
    extend: {
      colors: {
        'future-black': '#0A0E27',
        'leader-blue': '#2563EB',
        'electric-cyan': '#22D3EE',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      keyframes: {
        'pulse-hint': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0)' },
          '25%': { boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.3)' },
          '50%': { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0)' },
          '75%': { boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.3)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        },
      },
      animation: {
        'pulse-hint': 'pulse-hint 1.5s ease-in-out infinite',
        'ken-burns': 'ken-burns 20s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}

export default config
