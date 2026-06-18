import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import NumberCard from './NumberCard.jsx'

function DraggableWaitingCard({ num }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `waiting-${num}`,
    data: { num, from: 'waiting' },
  })

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isDragging ? 0.35 : 1 }}
      exit={{ scale: 0, opacity: 0 }}
      // touch-action: none keeps mobile browsers from hijacking the
      // gesture for page scrolling, which is what made dragging here
      // feel inaccurate on touch devices.
      style={{ touchAction: 'none' }}
      {...listeners}
      {...attributes}
    >
      <NumberCard num={num} small />
    </motion.div>
  )
}

/**
 * Waiting List — numbers manually parked here are excluded from the
 * random selection but can be dragged back into the Active Pool at
 * any time. Also a valid drop target for numbers dragged out of Active.
 */
export default function WaitingList({ waitingNumbers }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'waiting-zone' })

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-3xl p-4 sm:p-5 min-h-[140px] transition-colors duration-200
        ${isOver ? 'bg-sky/30 ring-4 ring-sky' : 'bg-white/70'}
        border-2 border-dashed
        ${isOver ? 'border-[#5EA8E0]' : 'border-[#E7DCC6]'}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base text-[#6B5640] flex items-center gap-2">
          ⏸️ Waiting List
        </h3>
        <span className="text-xs font-bold text-[#9C8F77] bg-white/80 px-2.5 py-1 rounded-full">
          {waitingNumbers.length}
        </span>
      </div>

      {waitingNumbers.length === 0 ? (
        <p className="text-xs text-[#B3A789] italic px-1">
          Drag a number here to temporarily remove it from the draw.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          <AnimatePresence>
            {waitingNumbers.map((num) => (
              <DraggableWaitingCard key={num} num={num} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
