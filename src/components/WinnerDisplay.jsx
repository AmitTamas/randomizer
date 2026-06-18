import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colorFor } from '../utils/colorGenerator.js'

/**
 * Large celebratory banner shown once a winner has been locked in.
 * Pulses + glows; pairs with <ConfettiEffect /> mounted alongside it in App.
 */
export default function WinnerDisplay({ winner }) {
  const color = winner != null ? colorFor(winner) : null

  return (
    <AnimatePresence>
      {winner != null && (
        <motion.div
          key={winner}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="flex flex-col items-center justify-center gap-3 py-6 px-6 rounded-3xl bg-gradient-to-br from-[#FFF8E8] to-[#FFEFD0] border-2 border-gold/60 shadow-lg"
        >
          <span className="font-display text-sm sm:text-base uppercase tracking-wide text-[#B8860B]">
            🎉 We have a winner! 🎉
          </span>

          <motion.div
            animate={{
              boxShadow: [
                '0 0 0px 0px #F9C74F66',
                '0 0 36px 10px #F9C74Faa',
                '0 0 0px 0px #F9C74F66',
              ],
            }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] flex items-center justify-center font-display text-5xl sm:text-6xl"
            style={{
              background: `linear-gradient(145deg, ${color.bg}, #FFE066)`,
              borderBottom: `6px solid ${color.shadow}`,
              borderRight: `3px solid ${color.border}`,
              color: '#5A4030',
            }}
          >
            {winner}
          </motion.div>

          <span className="text-sm text-[#9C8F77] font-semibold">
            Number {winner} has been removed from the Active Pool
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
