import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import NumberCard from './NumberCard.jsx'

/**
 * A single draggable wrapper around NumberCard, used inside the Active Pool.
 * Disabled while the roll animation is running so it can't be dragged
 * mid-spin (per the "don't break drag-and-drop" requirement, we simply
 * pause dragging instead of breaking it).
 */
function DraggableActiveCard({ num, highlighted, winner, isSelecting }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `active-${num}`,
    data: { num, from: 'active' },
    disabled: isSelecting,
  })

  // Gentle random jitter while the roll is in progress — lottery-drum feel.
  const jitter = isSelecting && !highlighted
    ? {
        x: [0, Math.random() * 6 - 3, 0],
        y: [0, Math.random() * 6 - 3, 0],
        rotate: [0, Math.random() * 4 - 2, 0],
      }
    : { x: 0, y: 0, rotate: 0 }

  return (
    <motion.div
      ref={setNodeRef}
      // touch-action: none is required by dnd-kit for reliable touch
      // dragging — without it, mobile browsers try to scroll the page
      // on the same gesture and the drag reads as jumpy/inaccurate.
      style={{ touchAction: 'none', opacity: isDragging ? 0.35 : 1 }}
      animate={jitter}
      transition={{ duration: 0.5, repeat: isSelecting ? Infinity : 0, repeatType: 'mirror' }}
      {...listeners}
      {...attributes}
    >
      <NumberCard num={num} highlighted={highlighted} winner={winner} />
    </motion.div>
  )
}

/**
 * The Active Pool — a responsive, droppable grid of every number currently
 * eligible to be picked. Accepts drops from the Waiting List to restore a
 * number, and renders the highlight/winner visual states driven by the
 * roll animation hook.
 */
export default function NumberGrid({ activeNumbers, highlighted, winner, isSelecting }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'active-zone' })

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-3xl p-5 sm:p-6 min-h-[180px] transition-colors duration-200
        ${isOver ? 'bg-mint/40 ring-4 ring-mint' : 'bg-white/70'}
        border-2 border-dashed
        ${isOver ? 'border-teal' : 'border-[#E7DCC6]'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg sm:text-xl text-[#6B5640] flex items-center gap-2">
          🎯 Active Pool
        </h2>
        <span className="text-sm font-bold text-[#9C8F77] bg-white/80 px-3 py-1 rounded-full">
          {activeNumbers.length} left
        </span>
      </div>

      {activeNumbers.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-[#9C8F77] font-semibold">
          No numbers remaining 🎉
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <AnimatePresence>
            {activeNumbers.map((num) => (
              <DraggableActiveCard
                key={num}
                num={num}
                highlighted={highlighted === num}
                winner={winner === num}
                isSelecting={isSelecting}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
