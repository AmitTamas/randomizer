import React, { useCallback, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
// add to the imports at the top
import { playCelebration, setMuted, isMuted } from './utils/sound.js'
import { useRandomPicker } from './hooks/useRandomPicker.js'
import { useShuffleAnimation } from './hooks/useShuffleAnimation.js'

import ControlPanel from './components/ControlPanel.jsx'
import NumberGrid from './components/NumberGrid.jsx'
import WaitingList from './components/WaitingList.jsx'
import PickedList from './components/PickedList.jsx'
import WinnerDisplay from './components/WinnerDisplay.jsx'
import ShuffleAnimation from './components/ShuffleAnimation.jsx'
import ConfettiEffect from './components/ConfettiEffect.jsx'
import NumberCard from './components/NumberCard.jsx'

export default function App() {
  const {
    activeNumbers,
    waitingNumbers,
    pickedNumbers,
    currentWinner,
    totalCount,
    generate,
    moveToWaiting,
    restoreFromWaiting,
    restoreFromPicked,
    confirmWinner,
    resetGame,
    undoLastWinner,
  } = useRandomPicker()

  const [celebrateAt, setCelebrateAt] = useState(null)

  // Wrap confirmWinner so we can distinguish "a roll genuinely just
  // finished" from any other reason currentWinner might change (undo,
  // restoring a picked number, etc.) — only the former should fire confetti.
  const handleWinnerSelected = useCallback(
    (winner) => {
      confirmWinner(winner)
      setCelebrateAt(Date.now())
      playCelebration()
    },
    [confirmWinner]
  )

  const [rollDuration, setRollDuration] = useState(10) // seconds, 5–10

  const { highlighted, isRunning, startRoll } = useShuffleAnimation(
    activeNumbers,
    handleWinnerSelected,
    rollDuration * 1000
  )

  // Require a small drag distance before a card is considered "dragging",
  // so a plain click/tap still works as expected and doesn't fight dnd-kit.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const [activeDrag, setActiveDrag] = useState(null) // { num, from } | null

  const handleDragStart = useCallback((event) => {
    setActiveDrag(event.active.data.current ?? null)
  }, [])

  const handleDragEnd = useCallback(
    (event) => {
      setActiveDrag(null)
      const { active, over } = event
      if (!over) return

      const { num, from } = active.data.current ?? {}
      if (num == null) return

      const droppedOnWaiting = over.id === 'waiting-zone'
      const droppedOnActive = over.id === 'active-zone'

      if (from === 'active' && droppedOnWaiting) {
        moveToWaiting(num)
      } else if (from === 'waiting' && droppedOnActive) {
        restoreFromWaiting(num)
      }
      // Dropping back on the same zone it came from is a no-op.
    },
    [moveToWaiting, restoreFromWaiting]
  )
  // add mute state, just above `const hasPool = totalCount > 0`
  const [muted, setMutedState] = useState(isMuted())

  const toggleMuted = useCallback(() => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }, [muted])
  const hasPool = totalCount > 0

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          {/* Header */}
          <header className="relative text-center">
            <button
              onClick={toggleMuted}
              title={muted ? 'Unmute sounds' : 'Mute sounds'}
              className="absolute right-0 top-0 w-10 h-10 rounded-full bg-white/80 border-2 border-[#E7DCC6] flex items-center justify-center text-lg hover:scale-105 transition-transform"
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <h1 className="font-display text-3xl sm:text-4xl text-[#5A4030] flex items-center justify-center gap-3">
              🎲 Random Roll Number Picker
            </h1>
            <p className="text-[#9C8F77] font-semibold mt-1 text-sm sm:text-base">
              Generate a pool, roll a winner, drag numbers in and out of play
            </p>
          </header>

          <ControlPanel
            onGenerate={generate}
            onSelectWinner={startRoll}
            isSelecting={isRunning}
            activeCount={activeNumbers.length}
            hasPool={hasPool}
            onReset={resetGame}
            onUndo={undoLastWinner}
            canUndo={pickedNumbers.length > 0 && !isRunning}
            rollDuration={rollDuration}
            onRollDurationChange={setRollDuration}
          />

          {!isRunning && <WinnerDisplay winner={currentWinner} />}

          {hasPool && (
            <>
              <ShuffleAnimation isSelecting={isRunning} highlighted={highlighted} />

              <NumberGrid
                activeNumbers={activeNumbers}
                highlighted={highlighted}
                winner={!isRunning ? currentWinner : null}
                isSelecting={isRunning}
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <WaitingList waitingNumbers={waitingNumbers} />
                <PickedList pickedNumbers={pickedNumbers} onRestore={restoreFromPicked} />
              </div>
            </>
          )}

          {!hasPool && (
            <div className="text-center py-16 text-[#9C8F77] font-semibold">
              Enter a player count above and press <span className="text-[#5A4030]">Generate</span> to begin 🎈
            </div>
          )}
        </div>
      </div>

      <ConfettiEffect trigger={celebrateAt} />

      {/* Floating preview of the card currently being dragged */}
      <DragOverlay>
        {activeDrag ? <NumberCard num={activeDrag.num} dragging small={activeDrag.from === 'waiting'} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
