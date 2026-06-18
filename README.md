# 🎲 Random Roll Number Picker

A polished, animated lottery-style number picker built with React, Vite, Tailwind CSS, Framer Motion, and dnd-kit.

## Installation

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview   # serve the production build locally
```

## Dependencies

| Package | Purpose |
|---|---|
| `react`, `react-dom` | UI library |
| `vite`, `@vitejs/plugin-react` | Dev server / bundler |
| `tailwindcss`, `postcss`, `autoprefixer` | Styling |
| `framer-motion` | Card, highlight, and winner animations |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | Drag-and-drop between Active Pool and Waiting List |
| `react-confetti` | Winner celebration burst |

## File tree

```
roll-picker/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Button.jsx            (new — shared 3D pill button)
    │   ├── NumberCard.jsx
    │   ├── NumberGrid.jsx        (new)
    │   ├── ControlPanel.jsx      (new)
    │   ├── WinnerDisplay.jsx     (new)
    │   ├── WaitingList.jsx       (new)
    │   ├── PickedList.jsx        (new)
    │   ├── ShuffleAnimation.jsx  (new)
    │   └── ConfettiEffect.jsx    (new)
    ├── hooks/
    │   ├── useRandomPicker.js
    │   └── useShuffleAnimation.js
    ├── utils/
    │   ├── randomPicker.js
    │   └── colorGenerator.js
    └── data/
        └── pastelColors.js
```
![Project Screenshot](https://github.com/AmitTamas/randomizer/blob/964c6aab4594760d1ac46b994018705c1dd0354c/randomizer-pic-1.png)

![Project Screenshot](https://github.com/AmitTamas/randomizer/blob/964c6aab4594760d1ac46b994018705c1dd0354c/randomizer-pic-2.png)
## Component-by-component explanation

**`App.jsx`** — Wires everything together. Holds the `DndContext`, owns the
`useRandomPicker` and `useShuffleAnimation` hooks, and routes drag events to
the right state mutation (`moveToWaiting` / `restoreFromWaiting`). Also
renders a live `DragOverlay` preview of whichever card is currently being
dragged.

**`ControlPanel.jsx`** — Player-count input + Generate button, the large
SELECT WINNER button (disabled while rolling or when the pool is empty),
and the secondary Reset Game / Undo Last Winner controls.

**`NumberGrid.jsx`** — The droppable Active Pool. Each card is wrapped in a
`useDraggable` handle (disabled mid-roll so dragging can't fight the
animation) and gets a gentle random jitter while a roll is in progress for
that "lottery drum" feel, without breaking drag-and-drop once the roll ends.

**`WaitingList.jsx`** — A droppable zone for numbers parked out of the draw.
Cards here are draggable back into the Active Pool.

**`PickedList.jsx`** — Shows every past winner, most recent first (with a
🥇 badge). Click any chip to restore it to the Active Pool.

**`WinnerDisplay.jsx`** — The large celebratory reveal once a roll finishes:
glowing pulse animation on the winning number.

**`ShuffleAnimation.jsx`** — The "Rolling…" banner shown above the grid for
the full 10-second roll, spinning dice + bouncing dots, showing the number
currently flashing in the grid.

**`ConfettiEffect.jsx`** — Fires a one-shot confetti burst (via
`react-confetti`) whenever a new winner is confirmed.

**`Button.jsx`** — A small reusable "3D pop" pill button (flat top color +
darker bottom border) matching the reference screenshots, used throughout
`ControlPanel`.

**`NumberCard.jsx`, `useRandomPicker.js`, `useShuffleAnimation.js`,
`randomPicker.js`, `colorGenerator.js`, `pastelColors.js`** — Provided
building blocks, used as-is: state machine, 10-second roll easing/timing,
pastel color palette, and the base card visual.

## How the core logic works

- `activeNumbers`, `waitingNumbers`, `pickedNumbers`, `currentWinner` all
  live in `useRandomPicker`. The winner is always drawn only from
  `activeNumbers`.
- `useShuffleAnimation` pre-picks the winner up front, then runs a
  10-second `setTimeout` loop (via `rollDelay`'s ease-in-cubic curve) that
  rapidly flashes random active numbers, slows down, and locks onto the
  winner — which is then handed to `confirmWinner` to move it from
  active → picked.
- Drag-and-drop is two `useDroppable` zones (`active-zone`, `waiting-zone`)
  plus per-card `useDraggable` handles carrying `{ num, from }` in their
  drag data, so `App.jsx`'s `onDragEnd` only needs to check the `from` /
  `over.id` pair to call the right mutator.

## Notes / optional items

- **Reorder inside Waiting List**: the provided `useRandomPicker` hook
  keeps `waitingNumbers` numerically sorted on every move, so manual
  reordering wasn't wired up (it would just get re-sorted away). The
  drag-and-drop itself (Active ↔ Waiting) is fully functional.
- **Undo Last Winner** and **restoring a picked winner** are both
  implemented per the optional UX requirements.
