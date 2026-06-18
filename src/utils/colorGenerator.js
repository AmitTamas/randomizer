import { PASTEL_COLORS } from '../data/pastelColors.js'

/** Returns the pastel color object for a given number (1-indexed, cyclic). */
export function colorFor(num) {
  return PASTEL_COLORS[(num - 1) % PASTEL_COLORS.length]
}