import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  PLAYERS,
  SEARCH_NAMES,
  CLUE_TITLES,
  TIER_META,
  POINTS,
  getStreakTier,
  drawPlayerForStreak,
  drawRandom,
  findPlayerByName,
  isCorrectGuess,
  getSuggestions,
  loadBestStreak,
  saveBestStreak,
} from '../src/game/engine.ts'
import playersData from '../src/data/players.json' with { type: 'json' }
import searchNamesData from '../src/data/searchNames.json' with { type: 'json' }

test('players data matches engine roster shape and conventions', () => {
  assert.equal(PLAYERS.length, playersData.length)
  for (const p of PLAYERS) {
    assert.equal(typeof p.id, 'number')
    assert.equal(typeof p.name, 'string')
    assert.ok(p.name.length > 0)
    assert.equal(typeof p.nationality, 'string')
    assert.equal(typeof p.position, 'string')
    assert.equal(typeof p.iconicClub, 'string')
    assert.ok([1, 2, 3, 4].includes(p.tier))
    assert.ok(Array.isArray(p.bonusClues) && p.bonusClues.length === 4)
    for (const clue of p.bonusClues) assert.equal(typeof clue, 'string')
  }
  assert.equal(new Set(PLAYERS.map((p) => p.id)).size, PLAYERS.length)
  assert.equal(new Set(PLAYERS.map((p) => p.name.toLowerCase())).size, PLAYERS.length)
})

test('search names union includes roster plus aliases', () => {
  const expected = Array.from(
    new Set([...PLAYERS.map((p) => p.name), ...searchNamesData]),
  ).sort((a, b) => a.localeCompare(b))
  assert.deepEqual(SEARCH_NAMES, expected)
})

test('clue titles and tier metadata match product conventions', () => {
  assert.equal(POINTS.CLUE_COUNT, CLUE_TITLES.length)
  assert.deepEqual([...CLUE_TITLES], [
    'Early Career / Youth',
    'Records & Milestones',
    'Playstyle & Shirt Number',
    'Current / Iconic Club',
  ])
  assert.deepEqual(Object.keys(TIER_META).map(Number), [1, 2, 3, 4])
  for (const tier of [1, 2, 3, 4]) {
    assert.equal(typeof TIER_META[tier].label, 'string')
    assert.equal(typeof TIER_META[tier].short, 'string')
    assert.equal(typeof TIER_META[tier].range, 'string')
  }
  assert.equal(POINTS.STARTING_BANK, 10)
  assert.equal(POINTS.CORRECT_GUESS, 10)
  assert.equal(POINTS.WRONG_GUESS, 2)
  assert.equal(POINTS.CLUE_COST, 2)
})

test('streak tier boundaries', () => {
  assert.equal(getStreakTier(0), 1)
  assert.equal(getStreakTier(1), 1)
  assert.equal(getStreakTier(2), 2)
  assert.equal(getStreakTier(7), 2)
  assert.equal(getStreakTier(8), 3)
  assert.equal(getStreakTier(15), 3)
  assert.equal(getStreakTier(16), 4)
  assert.equal(getStreakTier(50), 4)
})

test('no repeats across the full pool', () => {
  const usedIds = []
  for (let i = 0; i < PLAYERS.length; i++) {
    const streak = Math.floor(i / 40) * 20
    const p = drawPlayerForStreak(streak, usedIds)
    assert.ok(!usedIds.includes(p.id), `repeat id ${p.id} at draw ${i}`)
    usedIds.push(p.id)
  }
  assert.equal(usedIds.length, PLAYERS.length)
  assert.equal(new Set(usedIds).size, PLAYERS.length)
})

test('tier exhaustion fallback follows cycling rules', () => {
  const byTier = (t) => PLAYERS.filter((p) => p.tier === t).map((p) => p.id)
  const t1 = byTier(1)
  const t1Exhausted = drawPlayerForStreak(0, t1)
  assert.ok(t1Exhausted.tier === 2 || t1Exhausted.tier === 3)
  assert.ok(!t1.includes(t1Exhausted.id))

  const nonT4 = [...byTier(1), ...byTier(2), ...byTier(3)]
  const forcedT4 = drawPlayerForStreak(16, nonT4)
  assert.equal(forcedT4.tier, 4)
  assert.ok(!nonT4.includes(forcedT4.id))

  const all = PLAYERS.map((p) => p.id)
  const last = drawPlayerForStreak(0, all)
  assert.ok(all.includes(last.id))
  assert.ok(PLAYERS.some((p) => p.id === last.id))
})

test('draw bands respect streak tiers when pools are stocked', () => {
  for (let streak = 0; streak <= 1; streak++) {
    assert.equal(drawPlayerForStreak(streak, []).tier, 1)
  }
  for (let streak = 2; streak <= 7; streak++) {
    assert.equal(drawPlayerForStreak(streak, []).tier, 2)
  }
  for (let streak = 8; streak <= 15; streak++) {
    assert.equal(drawPlayerForStreak(streak, []).tier, 3)
  }
  for (let streak = 16; streak <= 40; streak++) {
    assert.equal(drawPlayerForStreak(streak, []).tier, 4)
  }
})

test('drawRandom returns members of the pool', () => {
  const pool = ['a', 'b', 'c']
  for (let i = 0; i < 20; i++) assert.ok(pool.includes(drawRandom(pool)))
})

test('findPlayerByName trims and lowercases', () => {
  const target = PLAYERS[0]
  assert.equal(findPlayerByName(target.name), target)
  assert.equal(findPlayerByName(`  ${target.name}  `), target)
  assert.equal(findPlayerByName(target.name.toUpperCase()), target)
  assert.equal(findPlayerByName('nonexistent player'), undefined)
})

test('isCorrectGuess only accepts exact full name after trim/lowercase', () => {
  const target = findPlayerByName('Sergio Agüero')
  assert.ok(target)
  assert.equal(isCorrectGuess('Sergio Agüero', target), true)
  assert.equal(isCorrectGuess('  Sergio Agüero  ', target), true)
  assert.equal(isCorrectGuess('SERGIO AGÜERO', target), true)
  assert.equal(isCorrectGuess('sergio agüero', target), true)
  assert.equal(isCorrectGuess('Agüero', target), false)
  assert.equal(isCorrectGuess('Sergio', target), false)
  assert.equal(isCorrectGuess('Sergio Agü', target), false)
  assert.equal(isCorrectGuess('', target), false)
  assert.equal(isCorrectGuess('   ', target), false)
  assert.equal(isCorrectGuess('Harry Kane', target), false)
})

test('getSuggestions handles empty, prefix priority, and limit', () => {
  assert.deepEqual(getSuggestions(''), [])
  assert.deepEqual(getSuggestions('   '), [])
  const hal = getSuggestions('hal')
  assert.ok(hal.length > 0)
  assert.ok(hal.length <= 6)
  for (const name of hal) assert.ok(name.toLowerCase().includes('hal'))
  const startsWith = hal.filter((n) => n.toLowerCase().startsWith('hal'))
  const includes = hal.filter((n) => !n.toLowerCase().startsWith('hal'))
  assert.deepEqual(hal, [...startsWith, ...includes])
  assert.deepEqual(getSuggestions('hal', 1).length, 1)
  assert.deepEqual(getSuggestions('hal', 0), [])
  assert.deepEqual(getSuggestions('son', 3).length, 3)
})

test('getSuggestions reflects SEARCH_NAMES roster order', () => {
  const query = getSuggestions('harry', 6)
  const expectedPool = SEARCH_NAMES.filter((n) => n.toLowerCase().includes('harry'))
  const startsWith = expectedPool.filter((n) => n.toLowerCase().startsWith('harry'))
  const includes = expectedPool.filter((n) => !n.toLowerCase().startsWith('harry'))
  assert.deepEqual(query, [...startsWith, ...includes].slice(0, 6))
})

test('storage helpers use injected globalThis.window safely', async () => {
  const storage = new Map()
  const fakeWindow = {
    localStorage: {
      getItem: (k) => (storage.has(k) ? storage.get(k) : null),
      setItem: (k, v) => { storage.set(k, String(v)) },
    },
  }
  const hadWindow = typeof globalThis.window !== 'undefined'
  const originalWindow = globalThis.window
  globalThis.window = fakeWindow
  try {
    assert.equal(loadBestStreak(), 0)
    saveBestStreak(7)
    assert.equal(loadBestStreak(), 7)
    saveBestStreak(-3)
    assert.equal(loadBestStreak(), 0)
    saveBestStreak(3.5)
    assert.equal(loadBestStreak(), 0)
    assert.equal(storage.get(POINTS.BEST_STREAK_KEY), '3.5')
  } finally {
    if (hadWindow) globalThis.window = originalWindow
    else delete globalThis.window
  }
  assert.equal(loadBestStreak(), 0)
})

test('storage helpers survive a throwing localStorage', async () => {
  const hadWindow = typeof globalThis.window !== 'undefined'
  const originalWindow = globalThis.window
  globalThis.window = {
    localStorage: {
      getItem() { throw new Error('boom') },
      setItem() { throw new Error('boom') },
    },
  }
  try {
    assert.equal(loadBestStreak(), 0)
    assert.doesNotThrow(() => saveBestStreak(5))
  } finally {
    if (hadWindow) globalThis.window = originalWindow
    else delete globalThis.window
  }
})
