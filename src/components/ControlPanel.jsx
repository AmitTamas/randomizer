import React, { useState } from 'react'
import Button from './Button.jsx'

/**
 * Top control panel: choose how many players to generate, run the big
 * SELECT WINNER roll, and reach the secondary game controls (reset,
 * undo last winner).
 */
export default function ControlPanel({
  onGenerate,
  onSelectWinner,
  isSelecting,
  activeCount,
  hasPool,
  onReset,
  onUndo,
  canUndo,
  rollDuration,
  onRollDurationChange,
}) {
  const [count, setCount] = useState(50)

  const handleGenerate = () => {
    const n = parseInt(count, 10)
    if (!Number.isFinite(n) || n < 1) return
    onGenerate(n)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleGenerate()
  }

  return (
    <div className="rounded-3xl bg-white/80 border-2 border-[#E7DCC6] p-5 sm:p-6 flex flex-col gap-5">
      {/* Pool generation */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="font-display text-sm text-[#6B5640]">Players:</label>
        <input
          type="number"
          min={1}
          max={200}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSelecting}
          className="w-24 px-3 py-2 rounded-xl border-2 border-dashed border-[#C9B99A] bg-white/70 text-center font-bold text-[#5A4030] focus:outline-none focus:border-coral disabled:opacity-50"
        />
        <Button variant="neutral" size="sm" onClick={handleGenerate} disabled={isSelecting}>
          ✨ Generate
        </Button>

        <div className="flex-1" />

        <Button variant="warning" size="sm" onClick={onReset} disabled={!hasPool || isSelecting}>
          ↺ Reset Game
        </Button>
        <Button variant="neutral" size="sm" onClick={onUndo} disabled={!canUndo}>
          ⏪ Undo Last Winner
        </Button>
      </div>
      {/* Roll duration */}
      <div className="flex items-center gap-3">
        <label className="font-display text-sm text-[#6B5640] whitespace-nowrap">
          Roll Time:
        </label>
        <input
          type="range"
          min={5}
          max={10}
          step={1}
          value={rollDuration}
          onChange={(e) => onRollDurationChange(Number(e.target.value))}
          disabled={isSelecting}
          className="flex-1 accent-[#F9C74F] disabled:opacity-50"
        />
        <span className="text-sm font-bold text-[#9C8F77] bg-white/80 px-2.5 py-1 rounded-full w-12 text-center">
          {rollDuration}s
        </span>
      </div>

      {/* Main action */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onSelectWinner}
        disabled={!hasPool || activeCount === 0 || isSelecting}
      >
        {isSelecting ? '🎲 Rolling…' : activeCount === 0 ? 'No numbers remaining' : '🎉 SELECT WINNER'}
      </Button>
    </div>
  )
}
