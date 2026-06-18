import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colorFor } from '../utils/colorGenerator.js'

/**
 * Picked Winners — every number that has already won, in most-recent-first
 * order. These are permanently out of the draw unless manually restored.
 */
export default function PickedList({ pickedNumbers, onRestore }) {
  return (
    <div className="rounded-3xl p-4 sm:p-5 min-h-[140px] bg-white/70 border-2 border-dashed border-[#E7DCC6]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base text-[#6B5640] flex items-center gap-2">
          🏆 Picked Winners
        </h3>
        <span className="text-xs font-bold text-[#9C8F77] bg-white/80 px-2.5 py-1 rounded-full">
          {pickedNumbers.length}
        </span>
      </div>

      {pickedNumbers.length === 0 ? (
        <p className="text-xs text-[#B3A789] italic px-1">
          Winners will appear here once you start picking.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          <AnimatePresence>
            {pickedNumbers.map((num, i) => {
              const color = colorFor(num)
              return (
                <motion.button
                  key={num}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onRestore(num)}
                  title="Click to restore to Active Pool"
                  className="relative w-11 h-11 rounded-2xl font-display text-base flex items-center justify-center select-none group"
                  style={{
                    background: `linear-gradient(145deg, ${color.bg}99, ${color.bg}55)`,
                    borderBottom: `4px solid ${color.shadow}88`,
                    borderRight: `2px solid ${color.border}88`,
                    color: '#5A4030',
                    opacity: 0.85,
                  }}
                >
                  {num}
                  {i === 0 && (
                    <span className="absolute -top-1.5 -right-1.5 text-[10px]">🥇</span>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ↺
                  </span>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
