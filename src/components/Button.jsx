import React from 'react'
import { motion } from 'framer-motion'

/**
 * Chunky 3D "pop" pill button matching the reference screenshots —
 * flat top color with a darker bottom border that gives a pressed-paper look.
 *
 * variant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
 * size:    'sm' | 'md' | 'lg'
 */
const VARIANTS = {
  primary: { bg: 'linear-gradient(180deg,#8ECBFF,#5EA8E0)', border: '#3E7FBE', text: '#FFFFFF' },
  success: { bg: 'linear-gradient(180deg,#A9E6C6,#80C9A4)', border: '#5BA37E', text: '#234D38' },
  warning: { bg: 'linear-gradient(180deg,#FFD6A5,#F9B97F)', border: '#D08F4E', text: '#5A3A1A' },
  danger:  { bg: 'linear-gradient(180deg,#FFB3BE,#FF8C9A)', border: '#D85F70', text: '#FFFFFF' },
  neutral: { bg: 'linear-gradient(180deg,#FFFFFF,#F1E9DD)', border: '#D8C8AC', text: '#6B5640' },
}

const SIZES = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-xl rounded-3xl',
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}) {
  const v = VARIANTS[variant] ?? VARIANTS.primary

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { y: 1, scale: 0.98 } : {}}
      className={`
        font-display select-none transition-opacity
        ${SIZES[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        background: disabled ? '#E5DDCC' : v.bg,
        borderBottom: `4px solid ${disabled ? '#C9BFA8' : v.border}`,
        borderRight: `2px solid ${disabled ? '#C9BFA8' : v.border}`,
        color: disabled ? '#9C8F77' : v.text,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {children}
    </motion.button>
  )
}
