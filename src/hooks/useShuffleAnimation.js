import { useState, useRef, useCallback } from 'react'
import { pickRandom, rollDelay } from '../utils/randomPicker.js'
import { playTick } from '../utils/sound.js'

/**
 * Manages the 10-second roll animation: rapidly highlighting cells,
 * slowing down, then landing on a final winner.
 *
 * @param {number[]} activeNumbers - Pool to pick from
 * @param {(winner: number) => void} onWinnerSelected - Called when roll ends
 */
export function useShuffleAnimation(activeNumbers, onWinnerSelected, durationMs = 10_000) {
  const [highlighted, setHighlighted] = useState(null)
  const [isRunning, setIsRunning]     = useState(false)
  const timeoutRef                    = useRef(null)

  const startRoll = useCallback(() => {
    if (!activeNumbers.length || isRunning) return

    setIsRunning(true)

    // Pre-decide the winner so the animation always lands correctly
    const winner        = pickRandom(activeNumbers)
    const TOTAL_DURATION = durationMs // 10 seconds as default
    const start          = performance.now()

    function step() {
      const elapsed  = performance.now() - start
      const progress = Math.min(elapsed / TOTAL_DURATION, 1)

      if (progress >= 1) {
        // Final: lock onto winner. isRunning stays TRUE through the hold
        // pause below — it only flips back to false in the same tick that
        // onWinnerSelected actually fires. This matters for two reasons:
        // (1) it stops the SELECT WINNER button from becoming clickable
        //     again during the 900ms hold, which would otherwise let a
        //     second roll start before this winner is confirmed and
        //     removed from activeNumbers (a real race condition);
        // (2) React 18 batches the setHighlighted(null) + setIsRunning(false)
        //     + onWinnerSelected(winner) calls below into a single render,
        //     so nothing ever reads a "done rolling" state with a stale
        //     (previous) winner still showing.
        setHighlighted(winner)
        playTick(1)
        setTimeout(() => {
          setHighlighted(null)
          setIsRunning(false)
          onWinnerSelected(winner)
        }, 900)
        return
      }

      // During the roll: pick a random active number (avoid same as winner near the end)
      let next
      if (progress > 0.85 && activeNumbers.length > 1) {
        // Tease – occasionally show the winner
        next = Math.random() < 0.25 ? winner : pickRandom(activeNumbers)
      } else {
        next = pickRandom(activeNumbers)
      }
      setHighlighted(next)
      playTick(progress)

      const delay = rollDelay(progress)
      timeoutRef.current = setTimeout(step, delay)
    }

    step()
  }, [activeNumbers, isRunning, onWinnerSelected, durationMs])

  const stopRoll = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setIsRunning(false)
    setHighlighted(null)
  }, [])

  return { highlighted, isRunning, startRoll, stopRoll }
}