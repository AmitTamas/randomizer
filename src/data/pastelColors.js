// Warm pastel palette matching the Tile Logic / Math Tower aesthetic
export const PASTEL_COLORS = [
  { bg: '#FFD6A5', border: '#EDBA7A', shadow: '#C99550' }, // peach
  { bg: '#FFCAD4', border: '#EDAAB5', shadow: '#C97D8C' }, // blush
  { bg: '#CDEAC0', border: '#A8D498', shadow: '#76B064' }, // mint
  { bg: '#BDE0FE', border: '#8EC8FA', shadow: '#5EA8E0' }, // sky
  { bg: '#E4C1F9', border: '#C9A0E8', shadow: '#9A68C8' }, // lavender
  { bg: '#FFF1A8', border: '#F0D86A', shadow: '#C8A830' }, // lemon
  { bg: '#B5EAD7', border: '#80CFAF', shadow: '#4CAF84' }, // seafoam
  { bg: '#FFDAC1', border: '#F0B898', shadow: '#D08060' }, // apricot
]

// Get a deterministic color for a given number
export function getColorForNumber(num) {
  return PASTEL_COLORS[(num - 1) % PASTEL_COLORS.length]
}