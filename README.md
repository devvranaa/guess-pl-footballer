# Guess the Premier League Footballer

[![React](https://img.shields.io/badge/React-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel&logoColor=white)](https://guess-pl-footballer.vercel.app)

A survival guessing game: a mystery footballer is shown with nationality and position up front and club redacted. Spend bank points to peel open clues or risk a guess — right calls pay out, misses cost you, and an empty bank ends the run.

## Live demo

[https://guess-pl-footballer.vercel.app](https://guess-pl-footballer.vercel.app)

## How it plays

- Start with a **bank of 10** and a **streak of 0**.
- Four clues in fixed order — early career, records, playstyle & shirt number, club reveal — at **−2** each.
- Wrong guess **−2**, correct guess **+10** and +1 streak.
- Bank at 0 or below, or Give Up, ends the game.
- Streak gates four player tiers (icons → stars → breakouts → cult heroes) with no repeats until a pool is exhausted; best streak persists in the browser.

## Features

- Name-only autocomplete with keyboard navigation
- Ordered, purchasable clue feed
- Miss ledger with same-club / different-club feedback
- Full-screen reveal states for correct guesses and game over
- Responsive mobile layout with reduced-motion support
- Game engine covered by runnable smoke tests

## Tech stack

- React 19, TypeScript, Vite 8
- No backend, database, or external APIs — player data lives in local JSON
- Google Fonts (Archivo Black, Barlow Condensed, Inter) with system fallbacks

## Getting started

Requires Node.js LTS and npm.

```bash
npm install
npm run dev
```

## Scripts

| Command                       | What it does                         |
| ----------------------------- | ------------------------------------ |
| `npm run dev`                 | Dev server with hot reload           |
| `npm run build`               | Type-check and build to `dist/`      |
| `npm run preview`             | Serve the production build locally   |
| `npm run lint`                | ESLint over the project              |
| `node scripts/engine-smoke.mjs` | Run the 18 game-engine assertions  |

## Project structure

```
src/
  App.tsx                # Game flow, screens, UI state
  game/engine.ts         # Bank economy, tiered draws, search, streak storage
  data/players.json      # 159-player roster, the single source of truth
  data/searchNames.json  # 766-name autocomplete index
scripts/
  engine-smoke.mjs  # Assertions against the real engine
  build-rosters.js  # Search-index generation helper
```

## Data

Hand-maintained local dataset — no live feeds, no scraping, no affiliation with the Premier League or its clubs.
