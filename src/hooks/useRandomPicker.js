import { useState, useCallback, useEffect } from 'react'

// Bump this if the saved shape ever changes, so old/incompatible
// localStorage data doesn't get loaded into a newer version of the app.
const STORAGE_KEY = 'roll-picker-state-v1'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    // Corrupted JSON, or localStorage unavailable (e.g. some private-
    // browsing modes) — just start fresh instead of crashing.
    return null
  }
}

const saved = loadSaved()

/**
 * Core state machine for the Random Roll Number Picker.
 * Manages activeNumbers, waitingNumbers, pickedNumbers, currentWinner.
 *
 * State is persisted to localStorage on every change and restored on
 * load, so a page refresh doesn't lose progress — the pool only resets
 * when the user explicitly clicks Generate or Reset Game.
 */
export function useRandomPicker() {
  const [activeNumbers,  setActiveNumbers]  = useState(saved?.activeNumbers  ?? [])
  const [waitingNumbers, setWaitingNumbers] = useState(saved?.waitingNumbers ?? [])
  const [pickedNumbers,  setPickedNumbers]  = useState(saved?.pickedNumbers  ?? [])
  const [currentWinner,  setCurrentWinner]  = useState(saved?.currentWinner  ?? null)
  const [totalCount,     setTotalCount]     = useState(saved?.totalCount     ?? 0)

  // Persist on every change. Cheap enough to run unconditionally — these
  // arrays top out at a couple hundred numbers (the Generate cap).
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ activeNumbers, waitingNumbers, pickedNumbers, currentWinner, totalCount })
      )
    } catch {
      // Storage full or unavailable — game still works, it just won't persist.
    }
  }, [activeNumbers, waitingNumbers, pickedNumbers, currentWinner, totalCount])

  /** Generate a fresh pool of N numbers */
  const generate = useCallback((count) => {
    const n = Math.max(1, Math.min(200, count))
    setTotalCount(n)
    setActiveNumbers(Array.from({ length: n }, (_, i) => i + 1))
    setWaitingNumbers([])
    setPickedNumbers([])
    setCurrentWinner(null)
  }, [])

  /** Move a number from active → waiting */
  const moveToWaiting = useCallback((num) => {
    setActiveNumbers(prev  => prev.filter(n => n !== num))
    setWaitingNumbers(prev => [...prev, num].sort((a, b) => a - b))
  }, [])

  /** Move a number from waiting → active */
  const restoreFromWaiting = useCallback((num) => {
    setWaitingNumbers(prev => prev.filter(n => n !== num))
    setActiveNumbers(prev  => [...prev, num].sort((a, b) => a - b))
  }, [])

  /** Move a number from picked → active (optional restore) */
  const restoreFromPicked = useCallback((num) => {
    setPickedNumbers(prev => prev.filter(n => n !== num))
    setActiveNumbers(prev => [...prev, num].sort((a, b) => a - b))
    if (currentWinner === num) setCurrentWinner(null)
  }, [currentWinner])

  /** Called when a winner is selected by the animation */
  const confirmWinner = useCallback((num) => {
    setCurrentWinner(num)
    setActiveNumbers(prev  => prev.filter(n => n !== num))
    setPickedNumbers(prev  => [num, ...prev])
  }, [])

  /** Full reset */
  const resetGame = useCallback(() => {
    if (totalCount > 0) {
      setActiveNumbers(Array.from({ length: totalCount }, (_, i) => i + 1))
      setWaitingNumbers([])
      setPickedNumbers([])
      setCurrentWinner(null)
    }
  }, [totalCount])

  /** Undo last winner */
  const undoLastWinner = useCallback(() => {
    if (!pickedNumbers.length) return
    const [last, ...rest] = pickedNumbers
    setPickedNumbers(rest)
    setActiveNumbers(prev => [...prev, last].sort((a, b) => a - b))
    setCurrentWinner(rest[0] ?? null)
  }, [pickedNumbers])

  return {
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
  }
}