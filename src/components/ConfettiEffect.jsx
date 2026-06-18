import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

/**
 * Fires a single confetti burst whenever `trigger` changes to a new
 * truthy value (we pass the winner number, so each new winner re-fires).
 * Confetti does not recycle — it bursts once and clears itself.
 */
export default function ConfettiEffect({ trigger }) {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (trigger == null) return
    setActive(true)
    const t = setTimeout(() => setActive(false), 3200)
    return () => clearTimeout(t)
  }, [trigger])

  if (!active) return null

  return (
    <Confetti
      width={size.width}
      height={size.height}
      numberOfPieces={260}
      recycle={false}
      gravity={0.35}
      colors={['#FFD6A5', '#FFCAD4', '#CDEAC0', '#BDE0FE', '#E4C1F9', '#F9C74F']}
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 999 }}
    />
  )
}
