# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start Vite dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the dist/ build locally
```

No linter or test suite is configured.

## Architecture

Single-page React app (Vite + React 18 + Tailwind CSS v3). No router — everything renders in one scrollable page driven by state in `App.jsx`.

### State flow (`App.jsx`)

Three pieces of user input control the whole experience:

| State | Type | Purpose |
|---|---|---|
| `gameType` | `'4d' \| 'toto' \| 'both'` | Which game to generate numbers for |
| `mood` | mood object from `data/moods.js` | Carries a `weight` multiplier used in seeding |
| `selectedDreams` | array of dream objects | Each carries a `seed` integer used in seeding |

When the user clicks **Reveal My Fortune**, `showNumbers` flips to `true` and `NumberDisplay` mounts. Clicking again increments `regenerateKey`, which triggers a fresh generation inside `NumberDisplay` via `useEffect`. Any change to game/mood/dreams resets `showNumbers` to false.

### Number generation (`utils/numberGenerator.js`)

All generation is **deterministic-seeded**: same mood + dreams + calendar date = same numbers. The seed is derived from `mood.weight`, the sum of `dream.seed` values, and today's date components. A simple LCG (`seededRandom`) then produces the values.

- `generate4DNumbers` → 3 strings, each 4 digits zero-padded
- `generateTotoNumbers` → sorted array of 6 unique integers 1–49
- `regenerateSingle4DDigit(number, position, mood, dreamSeeds)` → new 4-digit string with one digit swapped (uses `Date.now() % 997` to break determinism per-click)
- `regenerateSingleTotoNumber(numbers, index, mood, dreamSeeds)` → new sorted array with one number swapped

### Data layer (`src/data/`)

All static — no API calls anywhere.

- `moods.js` — 8 mood objects `{ id, emoji, label, description, color, weight }`
- `dreams.js` — 4 categories, each with 6 items `{ id, label, emoji, seed }`
- `previousDraws.js` — hardcoded sample draw history for 4D and TOTO

To wire up real Singapore Pools data, replace the exports in `previousDraws.js` with fetched data and update the jackpot/draw-date strings in `Hero.jsx` and `NumberDisplay.jsx`.

### Styling

No Tailwind component classes are used for colour — all colours are inline `style` props using the red/gold palette:

- Background base: `#080202`
- Lucky red: `#dc2626` / `rgba(220,38,38,…)`
- Imperial gold: `#fbbf24` / `rgba(251,191,36,…)`
- Glass panels: `.glass`, `.glass-strong`, `.glass-gold` utility classes in `index.css`
- Gradient text: `.gradient-text` (red→gold) and `.gradient-text-gold` (pale gold)
- All keyframe animations (`float`, `slideUp`, `fadeIn`, `goldPulse`, `ripple`, `lanternSwing`) are defined in `index.css` and referenced via inline `animation:` style props — **not** via Tailwind `animate-*` classes. Adding new animations: define the `@keyframes` in `index.css` first, then apply via inline style.
