# Guess the Premier League Footballer

## Overview
A web-based guessing game built with React, TypeScript, and Vite where players identify Premier League footballers from clues.

## Core Rules & Mechanics
1. **Tiered Clues:**
   - **Base Clues (Always Visible):** Nationality, Position, Current Club.
   - **Bonus Clues (Hidden initially):** Trivia clues that can be unlocked one by one at the cost of points.
2. **Scoring:**
   - Each round starts with max points (e.g., 10 points).
   - Revealing a bonus clue deducts points (e.g., -2 points per clue).
   - Correct guess awards remaining points to total score.
3. **Guess Input:**
   - Autocomplete/search dropdown (no freeform text errors).
4. **Game Flow:**
   - Round active -> Submit guess -> Feedback (Correct/Incorrect) -> Next Player button.

## Architecture & Code Rules
- Keep code simple, clean, and beginner-friendly.
- No heavy external state libraries; use standard React hooks (useState).
- Strict TypeScript types/interfaces for all models.
