import React from 'react'
import { motion } from 'framer-motion'
import { colorFor } from '../utils/colorGenerator.js'

/**
 * A single number card with pastel color, 3D pill shadow,
 * hover/tap animations, and an optional "highlighted" flash state.
 *
 * Props:
 *   num         {number}  - The number to display
 *   highlighted {boolean} - Is this card the currently rolling highlight?
 *   winner      {boolean} - Is this the just-chosen winner?
 *   onClick     {fn}      - Optional click handler
 *   small       {boolean} - Compact size for lists
 *   dragging    {boolean} - Is this card being dragged?
 */
export default function NumberCard({
  num,
  highlighted = false,
  winner      = false,
  onClick,
  small       = false,
  dragging    = false,
}) {
  const color = colorFor(num)

  const size = small
    ? 'w-11 h-11 text-base'
    : 'w-14 h-14 text-lg'

  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={!highlighted ? { scale: 1.1, y: -2 } : {}}
      whileTap={!highlighted  ? { scale: 0.95 }        : {}}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale:   highlighted ? [1, 1.2, 1.15] : winner ? 1.1 : dragging ? 1.05 : 1,
        opacity: 1,
        rotate:  highlighted ? [0, -4, 4, -2, 0]       : 0,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        relative flex items-center justify-center
        rounded-2xl font-display select-none cursor-pointer
        ${size}
        ${highlighted ? 'highlighted-card ring-4 ring-yellow-400 ring-offset-2' : ''}
        ${winner      ? 'winner-pulse ring-4 ring-yellow-400 ring-offset-2'     : ''}
        ${dragging    ? 'opacity-80 rotate-3 scale-105'                         : ''}
        transition-shadow
      `}
      style={{
        background:  highlighted
          ? 'linear-gradient(135deg, #F9C74F, #FFE066)'
          : `linear-gradient(145deg, ${color.bg}, ${color.bg}cc)`,
        borderBottom: `4px solid ${highlighted ? '#E8A800' : color.shadow}`,
        borderRight:  `2px solid ${highlighted ? '#E8A800' : color.border}`,
        boxShadow: highlighted
          ? '0 6px 20px rgba(249,199,79,0.6), 0 2px 8px rgba(0,0,0,0.15)'
          : `0 4px 0 ${color.shadow}66, 0 2px 8px rgba(0,0,0,0.1)`,
        color: highlighted ? '#7A5800' : '#5A4030',
      }}
    >
      {num}
    </motion.div>
  )
}