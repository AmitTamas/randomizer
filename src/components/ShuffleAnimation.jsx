import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Banner shown above the Active Pool while the 10-second roll is in
 * progress, reinforcing the "lottery drum" feel alongside the per-card
 * jitter happening in <NumberGrid />.
 */
export default function ShuffleAnimation({ isSelecting, highlighted }) {
  return (
    <AnimatePresence>
      {isSelecting && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-center gap-3 py-3 mb-4 rounded-2xl bg-gradient-to-r from-peach/60 via-gold/40 to-blush/60 border-2 border-dashed border-gold">
            <motion.span
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
              className="text-2xl"
            >
              🎲
            </motion.span>
            <span className="font-display text-[#7A5800]">
              Rolling{highlighted != null ? `… ${highlighted}` : '…'}
            </span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#B8860B]"
                />
              ))}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
