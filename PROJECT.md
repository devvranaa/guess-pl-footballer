# Guess the Premier League Footballer - Endless Survival

## 1. Core Mechanics: The Bank Economy
- The player starts with a persistent **Bank Balance of 10 points** and a **Streak of 0**.
- **Buying Clues:** Costs -2 points from the bank.
- **Wrong Guess:** Costs -2 points from the bank.
- **Correct Guess:** Adds +10 points to the bank and increments Streak (+1).
- **Game Over:** If the Bank drops to 0 or below, or if the player clicks "Give Up", the game ends.

## 2. Clue System
- **Base Clues (Always Visible):** Nationality and Position only (Current Club is hidden!).
- **4 Progressive Clues (Locked until bought):**
  1. Early Career / Trivia (-2 pts)
  2. Transfer Trail / Records (-2 pts)
  3. Shirt Number & Playstyle (-2 pts)
  4. Current Club (-2 pts)

## 3. Guessing & Feedback
- Search dropdown / autocomplete input (prevents typos).
- Wrong guesses display as badges with a directional hint:
  - "❌ [Name] (-2 pts) — Different Club"
  - "❌ [Name] (-2 pts) — 🔥 Same Club!"

## 4. Game States
- `PLAYING`: Round active, bank visible, clues locked/unlocked, search input active.
- `ROUND_WON`: Celebration banner, banked points, "Next Player" button.
- `GAME_OVER`: Final streak report, mystery player card revealed, "Restart Game" button.
