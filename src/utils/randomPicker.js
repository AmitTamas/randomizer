/**
 * Pick a random item from an array.
 */
export function pickRandom(arr) {
  if (!arr.length) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Easing function for the slow-down effect during the roll animation.
 * Returns a delay in ms that increases over time (0→1).
 */
export function rollDelay(progress) {
  // Start at ~60ms, end at ~600ms  (ease-in cubic)
  const min = 60
  const max = 620
  const eased = progress * progress * progress
  return min + (max - min) * eased
}