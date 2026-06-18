// Plays real audio files. Note: these are imported (not just referenced
// as path strings) — passing a relative string straight into `new
// Audio('../sounds/x.mp3')` would resolve against the page's URL, not
// against this file's location, and would 404. Importing lets Vite
// resolve the path correctly and bundle the file into the build.
import tickSrc from '../sounds/retro-coin-4.mp3'
import celebrationSrc from '../sounds/level-up.mp3'

let muted = false

export function setMuted(value) {
  muted = value
}

export function isMuted() {
  return muted
}

// Created once and reused as the "template" for every play — see play()
// below for why we clone it instead of calling .play() on it directly.
const tickAudio = new Audio(tickSrc)
tickAudio.volume = 0.4
tickAudio.preload = 'auto'

const celebrationAudio = new Audio(celebrationSrc)
celebrationAudio.volume = 0.6
celebrationAudio.preload = 'auto'

function play(template, { playbackRate = 1 } = {}) {
  if (muted) return
  // Ticks fire in rapid succession (as fast as ~60ms apart at the start
  // of a roll). Calling .play() on the same <audio> element again before
  // it finishes just restarts it, cutting the previous tick off. Cloning
  // the node gives each play its own independent instance so overlapping
  // ticks don't choke each other out.
  const instance = template.cloneNode()
  instance.volume = template.volume
  instance.playbackRate = playbackRate
  instance.play().catch(() => {
    // Browsers block audio until the user has interacted with the page
    // at least once — safe to ignore here, the next click will work fine.
  })
}

/**
 * The "tick" heard each time the highlight jumps to a new number during
 * a roll. `progress` (0–1) nudges playback rate (= pitch) upward as the
 * roll slows down, the same "winding down" effect as before.
 */
export function playTick(progress = 0) {
  play(tickAudio, { playbackRate: 0.9 + progress * 0.4 })
}

/** The little fanfare played once a winner is confirmed. */
export function playCelebration() {
  play(celebrationAudio)
}