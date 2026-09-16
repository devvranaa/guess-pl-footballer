import playersData from '../data/players.json' with { type: 'json' }
import searchNamesData from '../data/searchNames.json' with { type: 'json' }

export interface Footballer {
  id: number
  name: string
  nationality: string
  position: string
  iconicClub: string
  tier: 1 | 2 | 3 | 4
  bonusClues: [string, string, string, string]
}

export const PLAYERS = playersData as Footballer[]

export type Tier = Footballer['tier']

const PLAYER_BY_NAME = new Map<string, Footballer>(
  PLAYERS.map((player) => [player.name.toLowerCase(), player]),
)

export function findPlayerByName(name: string): Footballer | undefined {
  return PLAYER_BY_NAME.get(name.trim().toLowerCase())
}

export function isCorrectGuess(guess: string, target: Footballer): boolean {
  const normalized = guess.trim().toLowerCase()
  const targetName = target.name.toLowerCase()
  if (!normalized) return false
  return normalized === targetName
}

export const SEARCH_NAMES: string[] = Array.from(
  new Set([...PLAYERS.map((player) => player.name), ...(searchNamesData as string[])]),
).sort((a, b) => a.localeCompare(b))

export function getSuggestions(query: string, limit = 6): string[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return []
  const startsWith: string[] = []
  const includes: string[] = []
  for (const name of SEARCH_NAMES) {
    const lower = name.toLowerCase()
    if (!lower.includes(trimmed)) continue
    if (lower.startsWith(trimmed)) startsWith.push(name)
    else includes.push(name)
    if (startsWith.length >= limit) break
  }
  return [...startsWith, ...includes].slice(0, limit)
}

export const CLUE_TITLES = [
  'Early Career / Youth',
  'Records & Milestones',
  'Playstyle & Shirt Number',
  'Current / Iconic Club',
] as const

export const TIER_META: Record<Tier, { label: string; short: string; range: string }> = {
  1: { label: 'Household Icons', short: 'T1 · Icons', range: 'Streak 0–1' },
  2: { label: 'Established Stars', short: 'T2 · Stars', range: 'Streak 2–7' },
  3: { label: 'Modern Breakouts', short: 'T3 · Breakouts', range: 'Streak 8–15' },
  4: { label: "Streets Won't Forget", short: 'T4 · Cult', range: 'Streak 16+' },
}

export const POINTS = {
  STARTING_BANK: 10,
  CORRECT_GUESS: 10,
  WRONG_GUESS: 2,
  CLUE_COST: 2,
  CLUE_COUNT: 4,
  BEST_STREAK_KEY: 'pl_guesser_best_streak',
} as const

export function getStreakTier(streak: number): Tier {
  if (streak >= 16) return 4
  if (streak >= 8) return 3
  if (streak >= 2) return 2
  return 1
}

export function loadBestStreak(): number {
  try {
    const raw = window.localStorage.getItem(POINTS.BEST_STREAK_KEY)
    const parsed = raw === null ? 0 : Number(raw)
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 0
  } catch {
    return 0
  }
}

export function saveBestStreak(value: number): void {
  try {
    window.localStorage.setItem(POINTS.BEST_STREAK_KEY, String(value))
  } catch {
    /* storage unavailable (private mode); best streak stays in-memory */
  }
}

export function drawRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * Tier-based draw with safe cycling:
 * 1. Prefer unused players from the active tier for the current streak.
 * 2. If that pool is exhausted, cycle unused Tier 2 and Tier 3 players.
 * 3. Only after T2+T3 are exhausted, force from all remaining players (T4 included).
 */
export function drawPlayerForStreak(streak: number, usedIds: readonly number[]): Footballer {
  const used = new Set(usedIds)
  const unusedFrom = (tier: Tier) => PLAYERS.filter((p) => p.tier === tier && !used.has(p.id))

  const primary = unusedFrom(getStreakTier(streak))
  if (primary.length > 0) return drawRandom(primary)

  const fallback = [...unusedFrom(2), ...unusedFrom(3)]
  if (fallback.length > 0) return drawRandom(fallback)

  const lastResort = PLAYERS.filter((p) => !used.has(p.id))
  if (lastResort.length > 0) return drawRandom(lastResort)

  return drawRandom(PLAYERS)
}
