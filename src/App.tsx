import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  CLUE_TITLES,
  POINTS,
  TIER_META,
  drawPlayerForStreak,
  findPlayerByName,
  getDisplayClubName,
  getStreakTier,
  getSuggestions,
  isCorrectGuess,
  isSameClub,
  loadBestStreak,
  saveBestStreak,
  type Footballer,
} from './game/engine'

type Phase = 'playing' | 'roundWon' | 'gameOver'

interface WrongGuess {
  name: string
  sameClub: boolean
}

const LOCKED_INITIAL = [false, false, false, false] as const

function nextLockedIndex(unlocked: readonly boolean[]): number {
  return unlocked.findIndex((value) => !value)
}

export default function App() {
  const [bank, setBank] = useState<number>(POINTS.STARTING_BANK)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(() => loadBestStreak())
  const [target, setTarget] = useState<Footballer>(() => drawPlayerForStreak(0, []))
  const [usedIds, setUsedIds] = useState<number[]>(() => [target.id])
  const [unlocked, setUnlocked] = useState<boolean[]>([...LOCKED_INITIAL])
  const [wrongGuesses, setWrongGuesses] = useState<WrongGuess[]>([])
  const [phase, setPhase] = useState<Phase>('playing')
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [notice, setNotice] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [confirmGiveUp, setConfirmGiveUp] = useState(false)

  const suggestions = useMemo(() => getSuggestions(query), [query])
  const tier = getStreakTier(streak)
  const tierMeta = TIER_META[tier]
  const unlockedCount = unlocked.filter(Boolean).length
  const lockedIndex = nextLockedIndex(unlocked)
  const allCluesOut = lockedIndex === -1

  function pushBest(candidate: number): void {
    if (candidate > best) {
      setBest(candidate)
      saveBestStreak(candidate)
    }
  }

  function handleBuyClue(): void {
    if (phase !== 'playing' || allCluesOut) return
    const nextBank = bank - POINTS.CLUE_COST
    const nextUnlocked = [...unlocked]
    nextUnlocked[lockedIndex] = true
    setUnlocked(nextUnlocked)
    setBank(nextBank)
    setNotice('')
    setConfirmGiveUp(false)
    if (nextBank <= 0) {
      setPhase('gameOver')
      pushBest(streak)
    }
  }

  function handleGuess(rawInput: string): void {
    if (phase !== 'playing') return
    const guess = rawInput.trim()
    if (!guess) {
      setNotice('Type a name or pick one from the dropdown.')
      return
    }
    if (wrongGuesses.some((entry) => entry.name.toLowerCase() === guess.toLowerCase())) {
      setNotice('You already tried that name — no points lost.')
      return
    }

    if (isCorrectGuess(guess, target)) {
      const nextBank = bank + POINTS.CORRECT_GUESS
      const nextStreak = streak + 1
      setBank(nextBank)
      setStreak(nextStreak)
      pushBest(nextStreak)
      setPhase('roundWon')
      setQuery('')
      setActiveIndex(-1)
      setDropdownOpen(false)
      setNotice('')
      return
    }

    const guessedPlayer = findPlayerByName(guess)
    const sameClub = isSameClub(guessedPlayer, target)
    const nextBank = bank - POINTS.WRONG_GUESS
    setWrongGuesses((previous) => [...previous, { name: guess, sameClub }])
    setBank(nextBank)
    setQuery('')
    setActiveIndex(-1)
    setDropdownOpen(false)
    setNotice('')
    setConfirmGiveUp(false)
    if (nextBank <= 0) {
      setPhase('gameOver')
      pushBest(streak)
    }
  }

  const handleNextPlayer = useCallback((): void => {
    const next = drawPlayerForStreak(streak, usedIds)
    setTarget(next)
    setUsedIds((previous) => (previous.includes(next.id) ? previous : [...previous, next.id]))
    setUnlocked([...LOCKED_INITIAL])
    setWrongGuesses([])
    setQuery('')
    setActiveIndex(-1)
    setDropdownOpen(false)
    setNotice('')
    setConfirmGiveUp(false)
    setPhase('playing')
  }, [streak, usedIds])

  function handleGiveUp(): void {
    if (phase !== 'playing') return
    if (!confirmGiveUp) {
      setConfirmGiveUp(true)
      return
    }
    pushBest(streak)
    setConfirmGiveUp(false)
    setPhase('gameOver')
  }

  function handleRestart(): void {
    const fresh = drawPlayerForStreak(0, [])
    setBank(POINTS.STARTING_BANK)
    setStreak(0)
    setTarget(fresh)
    setUsedIds([fresh.id])
    setUnlocked([...LOCKED_INITIAL])
    setWrongGuesses([])
    setQuery('')
    setActiveIndex(-1)
    setDropdownOpen(false)
    setNotice('')
    setConfirmGiveUp(false)
    setPhase('playing')
  }

  function pickSuggestion(name: string): void {
    setQuery(name)
    setDropdownOpen(false)
    setActiveIndex(-1)
    handleGuess(name)
  }

  useEffect(() => {
    if (phase === 'playing') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape' && phase === 'roundWon') {
        handleNextPlayer()
        return
      }
      if (event.key !== 'Tab') return
      const takeover = document.querySelector('.takeover')
      if (takeover === null) return
      const focusable = Array.from(
        takeover.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [phase, handleNextPlayer])

  const bankDanger = bank <= POINTS.WRONG_GUESS + POINTS.CLUE_COST
  const bankMeterWidth = Math.max(0, Math.min(100, (bank / (POINTS.STARTING_BANK * 2)) * 100))

  return (
    <main className="game-container">
      <header className="folio">
        <h1 className="folio-title">Guess the Premier League Footballer</h1>
        <p className="folio-meta">{tierMeta.label}</p>
      </header>

      <p className="question" aria-label="Who is it?">
        Who
        <br aria-hidden="true" />
        is it?
      </p>

      <section className="stage" aria-label="Mystery player">
        <div className="stage-grid">
          <div className="stage-fact">
            <span className="stage-label">Nationality</span>
            <span className="stage-value">{target.nationality}</span>
          </div>
          <div className="stage-fact">
            <span className="stage-label">Position</span>
            <span className="stage-value">{target.position}</span>
          </div>
          <div className="stage-fact">
            <span className="stage-label">Club</span>
            <span className="stage-value">
              {unlocked[3] ? (
                getDisplayClubName(target)
              ) : (
                <span className="censor" aria-label="Redacted">
                  <span className="censor-bar censor-bar-long" aria-hidden="true" />
                  <span className="censor-bar censor-bar-short" aria-hidden="true" />
                </span>
              )}
            </span>
          </div>
        </div>
        <p className="stage-foot">Free file · the rest costs you</p>
      </section>

      <div className="bank-strip" role="status" aria-label="Bank, streak and tier">
        <div className={`bank-cell${bankDanger && phase === 'playing' ? ' bank-cell-danger' : ''}`}>
          <span className="bank-label">
            Bank{bankDanger && phase === 'playing' ? <span className="bank-low">Low</span> : null}
          </span>
          <span className="bank-numeral" key={bank}>
            {bank}
          </span>
          <span className="bank-meter" role="img" aria-label={`Bank ${bank} points`}>
            <span className="bank-meter-fill" style={{ width: `${bankMeterWidth}%` }} aria-hidden="true" />
          </span>
        </div>
        <div className="bank-cell">
          <span className="bank-label">Streak</span>
          <span className="bank-numeral bank-numeral-small streak-pop" key={streak}>
            {streak}
          </span>
          <span className="bank-sub">Best {best}</span>
        </div>
        <div className="bank-cell">
          <span className="bank-label">Tier</span>
          <span className="bank-tier">{tierMeta.short}</span>
          <span className="bank-sub">{tierMeta.range}</span>
        </div>
      </div>

      <p className="rules-line">
        <span>Protect the bank</span>
        <span aria-hidden="true"> / </span>
        <span>
          <strong>−{POINTS.CLUE_COST}</strong> per clue
        </span>
        <span aria-hidden="true"> / </span>
        <span>
          <strong>−{POINTS.WRONG_GUESS}</strong> per miss
        </span>
        <span aria-hidden="true"> / </span>
        <span>
          <strong>+{POINTS.CORRECT_GUESS}</strong> per hit
        </span>
      </p>

      <section className="slips" aria-label="Clue feed">
        <div className="slips-head">
          <h2 className="slips-title">Clue feed</h2>
          <span className="slips-count">
            {unlockedCount}/{POINTS.CLUE_COUNT} open
          </span>
        </div>
        <ol className="slips-list">
          {CLUE_TITLES.map((title, index) => {
            const isOpen = unlocked[index] ?? false
            const isArmed = !isOpen && index === lockedIndex && phase === 'playing'
            const row = (
              <>
                <span className="slip-num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="slip-body">
                  <div className="slip-head">
                    <span className="slip-title">{title}</span>
                    <span className="slip-price">{isOpen ? 'Opened' : `−${POINTS.CLUE_COST}`}</span>
                  </div>
                  {isOpen ? (
                    <p className="slip-text">{target.bonusClues[index]}</p>
                  ) : (
                    <p className="slip-locked">
                      {isArmed ? 'Tap to open this clue.' : 'Opens in order.'}
                    </p>
                  )}
                </div>
              </>
            )
            return (
              <li
                key={title}
                className={`slip${isOpen ? ' slip-open' : ''}${isArmed ? ' slip-armed' : ''}`}
              >
                {isArmed ? (
                  <button
                    type="button"
                    className="slip-hit"
                    onClick={handleBuyClue}
                    aria-label={`Open clue ${index + 1}: ${title}, costs ${POINTS.CLUE_COST} points`}
                  >
                    {row}
                  </button>
                ) : (
                  row
                )}
              </li>
            )
          })}
        </ol>
        <button
          type="button"
          className="slip-action"
          onClick={handleBuyClue}
          disabled={phase !== 'playing' || allCluesOut}
        >
          {allCluesOut ? 'All clues open' : `Open clue ${unlockedCount + 1} · −${POINTS.CLUE_COST}`}
        </button>
      </section>

      <section className="coupon" aria-label="Make your guess">
        <form
          className="guess-form"
          onSubmit={(event) => {
            event.preventDefault()
            if (activeIndex >= 0 && suggestions[activeIndex] !== undefined) {
              pickSuggestion(suggestions[activeIndex])
            } else {
              handleGuess(query)
            }
          }}
        >
          <div className="autocomplete-container">
            <div className="input-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="12.5" y1="12.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                className="guess-input"
                type="text"
                value={query}
                placeholder="Search a footballer…"
                aria-label="Search a footballer"
                autoComplete="off"
                disabled={phase !== 'playing'}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(-1)
                  setDropdownOpen(true)
                }}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setDropdownOpen(false), 120)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' && suggestions.length > 0) {
                    event.preventDefault()
                    setActiveIndex((previous) => (previous + 1) % suggestions.length)
                  } else if (event.key === 'ArrowUp' && suggestions.length > 0) {
                    event.preventDefault()
                    setActiveIndex((previous) =>
                      previous <= 0 ? suggestions.length - 1 : previous - 1,
                    )
                  } else if (event.key === 'Escape') {
                    setDropdownOpen(false)
                    setActiveIndex(-1)
                  }
                }}
              />
              {query && (
                <button
                  type="button"
                  className="btn-clear"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery('')
                    setActiveIndex(-1)
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            {dropdownOpen && suggestions.length > 0 && phase === 'playing' && (
              <ul className="dropdown-suggestions" role="listbox" aria-label="Player suggestions">
                {suggestions.map((name, index) => (
                  <li
                    key={name}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={`suggestion-item${index === activeIndex ? ' active' : ''}`}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      pickSuggestion(name)
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            )}
            {dropdownOpen && suggestions.length === 0 && query.trim() !== '' && phase === 'playing' && (
              <div className="suggestions-empty">No matches — check the spelling.</div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={phase !== 'playing' || !query.trim()}>
              Submit guess <span className="btn-cost">−{POINTS.WRONG_GUESS} if wrong</span>
            </button>
            <button
              type="button"
              className={`btn-giveup${confirmGiveUp ? ' btn-giveup-armed' : ''}`}
              onClick={handleGiveUp}
              disabled={phase !== 'playing'}
              aria-live="polite"
            >
              {confirmGiveUp ? 'Tap again to confirm full-time' : 'Give up'}
            </button>
          </div>
        </form>
        {notice && (
          <p className="form-error" role="alert">
            {notice}
          </p>
        )}

        {wrongGuesses.length > 0 && (
          <div className="ledger">
            <p className="ledger-title">Misses ({wrongGuesses.length})</p>
            <ul className="ledger-list">
              {wrongGuesses.map((entry) => (
                <li
                  key={`${entry.name.toLowerCase()}`}
                  className={`ledger-row${entry.sameClub ? ' ledger-row-hot' : ''}`}
                >
                  <span className="ledger-name">
                    {entry.name} <span className="ledger-cost">−{POINTS.WRONG_GUESS}</span>
                  </span>
                  <span className="ledger-hint">
                    {entry.sameClub ? 'Same club — close' : 'Different club'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {phase !== 'playing' && (
        <div className="takeover" role="dialog" aria-modal="true">
          <div className="takeover-inner">
            {phase === 'roundWon' ? (
              <section aria-live="polite">
                <p className="takeover-kicker">Correct call</p>
                <h2 className="takeover-name">{target.name}</h2>
                <p className="takeover-meta">
                  {target.nationality} · {target.position} · {getDisplayClubName(target)}
                </p>
                <p className="takeover-reward">
                  +{POINTS.CORRECT_GUESS} banked · Streak {streak}
                </p>
                <button type="button" className="takeover-action" onClick={handleNextPlayer} autoFocus>
                  Next player
                </button>
              </section>
            ) : (
              <section aria-live="polite">
                <p className="takeover-kicker takeover-kicker-danger">Full time</p>
                <h2 className="takeover-name">{target.name}</h2>
                <p className="takeover-meta">
                  {target.nationality} · {target.position} · {getDisplayClubName(target)}
                </p>
                <p className="takeover-reward">
                  Streak {streak} · Bank {bank} · Best {Math.max(best, streak)}
                </p>
                <button type="button" className="takeover-action" onClick={handleRestart} autoFocus>
                  Restart game
                </button>
              </section>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
