# Guess the Premier League Footballer

An endless survival quiz. The game shows you a mystery Premier League footballer — nationality and position up front, club redacted — and you spend points to peel open clues or risk a guess. Correct calls pay out, misses cost you, and the bank hitting zero ends the show.

## How it plays

- You start with a **bank of 10 points** and a **streak of 0**.
- Each of the 4 clues costs **−2**, in fixed order: early career → records → playstyle & shirt number → club reveal.
- A wrong guess costs **−2**. A correct guess pays **+10** and extends your streak.
- Bank at 0 or below, or hitting Give Up, ends the game.
- Wrong guesses are logged with a directional hint: same club ("close") or different club.
- Difficulty follows your streak across four tiers of players (icons → stars → breakouts → cult heroes), with no repeats until the pool is exhausted. Your best streak is saved in the browser.

## Key features

- Autocomplete search with keyboard navigation and position/club context per suggestion
- Ordered, purchasable clue feed with a clearly marked next-to-open clue
- Miss ledger with same-club / different-club feedback
- Full-screen cinematic reveal on correct guesses and game over
- Responsive layout with a sticky guess bar on mobile, plus reduced-motion support
- Engine covered by runnable assertions (`scripts/engine-smoke.mjs`)

## Tech stack

- React 19, TypeScript, Vite 8
- No backend, no database, no external APIs — player data lives in local JSON
- Fonts via Google Fonts (Archivo Black, Barlow Condensed, Inter) with system fallbacks

## Getting started

Requires a recent Node.js LTS and npm.

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |
| `node scripts/engine-smoke.mjs` | Run the 14 game-engine assertions |

## Environment variables

None. There is nothing to configure — clone, install, run.

## Project structure

```
src/
  App.tsx          # Game flow, screens, and UI state
  main.tsx         # React entry point
  index.css        # Design tokens
  App.css          # Screen styles
  game/engine.ts   # Bank economy, tiered draws, search, streak storage
  data/players.json      # 160-player roster in 4 tiers
  data/searchNames.json  # 767-name search index
scripts/
  engine-smoke.mjs  # Assertions against the real engine
  build-rosters.js  # Roster generation helper
```

## Data

The roster and clues are a hand-maintained local dataset — no live feeds, no scraping, no official affiliation with the Premier League or its clubs.
