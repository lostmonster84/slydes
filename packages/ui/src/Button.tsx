import { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: `
      bg-leader-blue text-white
      hover:bg-blue-700 hover:shadow-lg hover:shadow-leader-blue/25
      active:scale-[0.98]
    `,
    secondary: `
      border border-gray-300 text-gray-700 bg-white
      hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
      active:scale-[0.98]
    `,
    ghost: 'text-gray-600 hover:text-leader-blue hover:bg-gray-100',
  }

  const sizes = {
    default: 'px-5 min-h-[44px] text-sm',
    lg: 'px-7 min-h-[48px] text-base',
  }

  return (
    <button
      className={`
        rounded-xl font-semibold
        transition-all duration-200 ease-out
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
