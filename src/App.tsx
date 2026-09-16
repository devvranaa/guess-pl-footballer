import { useState, useMemo, useRef, useEffect } from 'react'
import { PLAYERS, type Footballer } from './data/players'
import searchNamesData from './data/searchNames.json'
import './App.css'

const searchNames: string[] = Array.from(
  new Set([...PLAYERS.map((p) => p.name), ...(searchNamesData as string[])])
).sort()

const CLUE_TITLES = [
  'Early Career & Trivia',
  'Records & Career Transfers',
  'Shirt Number & Playstyle',
  'Current / Iconic Club Reveal',
]

const TIER_LABELS: Record<Footballer['tier'], string> = {
  1: 'Tier 1: Icons',
  2: 'Tier 2: Elite & Breakouts',
  3: 'Tier 3: Legends',
  4: 'Cult Heroes',
}

// Quick club affiliation directory for prominent players
const CLUB_LOOKUP: Record<string, string> = {
  // Arsenal
  'thierry henry': 'Arsenal',
  'bukayo saka': 'Arsenal',
  'dennis bergkamp': 'Arsenal',
  'patrick vieira': 'Arsenal',
  'martin ødegaard': 'Arsenal',
  'gabriel martinelli': 'Arsenal',
  'william saliba': 'Arsenal',
  'declan rice': 'Arsenal',
  'gabriel jesus': 'Arsenal',
  'kai havertz': 'Arsenal',
  'ethan nwaneri': 'Arsenal',
  // Manchester City
  'erling haaland': 'Manchester City',
  'kevin de bruyne': 'Manchester City',
  'sergio agüero': 'Manchester City',
  'david silva': 'Manchester City',
  'vincent kompany': 'Manchester City',
  'yaya touré': 'Manchester City',
  'phil foden': 'Manchester City',
  'bernardo silva': 'Manchester City',
  'rodri': 'Manchester City',
  'jack grealish': 'Manchester City',
  // Manchester United
  'wayne rooney': 'Manchester United',
  'cristiano ronaldo': 'Manchester United',
  'paul scholes': 'Manchester United',
  'rio ferdinand': 'Manchester United',
  'nemanja vidić': 'Manchester United',
  'eric cantona': 'Manchester United',
  'bruno fernandes': 'Manchester United',
  'marcus rashford': 'Manchester United',
  'kobbie mainoo': 'Manchester United',
  'alejandro garnacho': 'Manchester United',
  // Liverpool
  'mohamed salah': 'Liverpool',
  'steven gerrard': 'Liverpool',
  'virgil van dijk': 'Liverpool',
  'trent alexander-arnold': 'Liverpool',
  'alisson becker': 'Liverpool',
  'luis díaz': 'Liverpool',
  'darwin núñez': 'Liverpool',
  'alexis mac allister': 'Liverpool',
  'dominik szoboszlai': 'Liverpool',
  // Chelsea
  'frank lampard': 'Chelsea',
  'eden hazard': 'Chelsea',
  'didier drogba': 'Chelsea',
  'john terry': 'Chelsea',
  'petr čech': 'Chelsea',
  'cole palmer': 'Chelsea',
  'enzo fernández': 'Chelsea',
  'moisés caicedo': 'Chelsea',
  'nicolas jackson': 'Chelsea',
  // Tottenham
  'son heung-min': 'Tottenham Hotspur',
  'harry kane': 'Tottenham Hotspur',
  'james maddison': 'Tottenham Hotspur',
  'dejan kulusevski': 'Tottenham Hotspur',
  'cristian romero': 'Tottenham Hotspur',
  // Newcastle
  'alan shearer': 'Newcastle United',
  'alexander isak': 'Newcastle United',
  'anthony gordon': 'Newcastle United',
  'bruno guimarães': 'Newcastle United',
  // Fulham
  'oscar bobb': 'Fulham',
  'emile smith rowe': 'Fulham',
  'antonee robinson': 'Fulham',
  // Stoke City
  'peter crouch': 'Stoke City',
  'rory delap': 'Stoke City',
  // Swansea
  'michu': 'Swansea City',
  // QPR
  'adel taarabt': 'Queens Park Rangers',
}

interface WrongGuess {
  name: string
  hint: string
  isSameClub: boolean
}

function App() {
  const [bank, setBank] = useState<number>(10)
  const [streak, setStreak] = useState<number>(0)
  const [playerIndex, setPlayerIndex] = useState<number>(0)
  const [revealedCluesCount, setRevealedCluesCount] = useState<number>(0)
  const [wrongGuesses, setWrongGuesses] = useState<WrongGuess[]>([])
  const [gameState, setGameState] = useState<'PLAYING' | 'ROUND_WON' | 'GAME_OVER'>('PLAYING')

  const [query, setQuery] = useState<string>('')
  const [selectedGuess, setSelectedGuess] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const currentPlayer = PLAYERS[playerIndex]

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter top 6 autocomplete suggestions
  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []
    return searchNames
      .filter((name) => name.toLowerCase().includes(trimmed))
      .slice(0, 6)
  }, [query])

  // Reveal next clue
  const handleRevealClue = () => {
    if (gameState !== 'PLAYING' || revealedCluesCount >= 4) return
    const newBank = bank - 2
    setBank(newBank)
    setRevealedCluesCount((prev) => Math.min(prev + 1, 4))
    if (newBank <= 0) {
      setGameState('GAME_OVER')
    }
  }

  // Handle select suggestion from dropdown
  const handleSelectSuggestion = (name: string) => {
    setQuery(name)
    setSelectedGuess(name)
    setIsDropdownOpen(false)
  }

  // Submit guess
  const handleSubmitGuess = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (gameState !== 'PLAYING') return

    const guessToSubmit = (selectedGuess || query).trim()
    if (!guessToSubmit) return

    const normalizedGuess = guessToSubmit.toLowerCase()
    const targetName = currentPlayer.name.toLowerCase()
    const isCorrect =
      normalizedGuess === targetName ||
      targetName.endsWith(normalizedGuess) ||
      targetName.split(' ').includes(normalizedGuess)

    if (isCorrect) {
      setBank((prev) => prev + 10)
      setStreak((prev) => prev + 1)
      setGameState('ROUND_WON')
      setIsDropdownOpen(false)
    } else {
      const newBank = bank - 2
      setBank(newBank)

      // Determine club hint
      const matchedPlayer = PLAYERS.find(
        (p) => p.name.toLowerCase() === guessToSubmit.toLowerCase()
      )
      const guessedClub = matchedPlayer?.iconicClub || CLUB_LOOKUP[guessToSubmit.toLowerCase()]
      const isSameClub = Boolean(
        guessedClub && guessedClub.toLowerCase() === currentPlayer.iconicClub.toLowerCase()
      )

      const hintText = isSameClub ? '🔥 Same Club!' : 'Different Club'

      setWrongGuesses((prev) => [
        ...prev,
        { name: guessToSubmit, hint: hintText, isSameClub },
      ])
      setQuery('')
      setSelectedGuess('')
      setIsDropdownOpen(false)

      if (newBank <= 0) {
        setGameState('GAME_OVER')
      }
    }
  }

  // Give Up
  const handleGiveUp = () => {
    if (gameState !== 'PLAYING') return
    setGameState('GAME_OVER')
  }

  // Advance to next player (Round Won)
  const handleNextPlayer = () => {
    setPlayerIndex((prev) => (prev + 1) % PLAYERS.length)
    setRevealedCluesCount(0)
    setWrongGuesses([])
    setQuery('')
    setSelectedGuess('')
    setIsDropdownOpen(false)
    setGameState('PLAYING')
  }

  // Restart after Game Over
  const handleRestartGame = () => {
    setBank(10)
    setStreak(0)
    setPlayerIndex((prev) => (prev + 1) % PLAYERS.length)
    setRevealedCluesCount(0)
    setWrongGuesses([])
    setQuery('')
    setSelectedGuess('')
    setIsDropdownOpen(false)
    setGameState('PLAYING')
  }

  return (
    <div className="game-container">
      {/* Top HUD: Bank, Streak & Tier */}
      <div className="hud-bar">
        <div className={`hud-badge bank-badge ${bank <= 4 ? 'bank-danger' : ''}`}>
          <span className="hud-icon">💰</span>
          <span className="hud-label">Bank:</span>
          <span className="hud-value">{bank} pts</span>
        </div>

        <div className="hud-badge streak-badge">
          <span className="hud-icon">🔥</span>
          <span className="hud-label">Streak:</span>
          <span className="hud-value">{streak}</span>
        </div>

        <div className="hud-badge tier-badge">
          <span className="tier-pill">{TIER_LABELS[currentPlayer.tier]}</span>
        </div>
      </div>

      <header className="game-header">
        <h1>⚽ Guess the Premier League Footballer</h1>
        <p className="game-subtitle">Endless Survival • 10 Points to Start • Don't Go Bankrupt!</p>
      </header>

      {/* ROUND WON BANNER */}
      {gameState === 'ROUND_WON' && (
        <div className="status-modal round-won-modal">
          <div className="status-header">
            <span className="status-emoji">🎉</span>
            <h2>GET IN! CORRECT GUESS!</h2>
          </div>
          <p className="status-player-name">{currentPlayer.name}</p>
          <p className="status-player-club">Iconic Club: <strong>{currentPlayer.iconicClub}</strong></p>

          <div className="status-rewards">
            <div className="reward-chip">+10 Points Banked 💰</div>
            <div className="reward-chip">Streak: {streak} 🔥</div>
          </div>

          <button type="button" className="btn-primary btn-large" onClick={handleNextPlayer}>
            Next Player ➔
          </button>
        </div>
      )}

      {/* GAME OVER BANNER */}
      {gameState === 'GAME_OVER' && (
        <div className="status-modal game-over-modal">
          <div className="status-header">
            <span className="status-emoji">💀</span>
            <h2>GAME OVER</h2>
          </div>
          <p className="status-subtext">
            {bank <= 0 ? 'Your bank reached 0 points!' : 'You gave up this round.'}
          </p>

          <div className="revealed-player-box">
            <span className="revealed-label">The mystery footballer was:</span>
            <span className="revealed-name">{currentPlayer.name}</span>
            <span className="revealed-club">{currentPlayer.iconicClub} • {currentPlayer.position}</span>
          </div>

          <div className="final-stats">
            <span>Final Streak: <strong>{streak}</strong></span>
          </div>

          <button type="button" className="btn-primary btn-large btn-restart" onClick={handleRestartGame}>
            🔄 Restart Run (10 pts)
          </button>
        </div>
      )}

      {/* MAIN GAME CARD */}
      <main className="clue-card">
        {/* Base Clues: Nationality & Position (Club is intentionally hidden!) */}
        <section className="clues-section base-clues-section">
          <div className="section-title-row">
            <h2 className="card-title">Base Clues</h2>
            <span className="free-tag">Always Visible</span>
          </div>
          <div className="base-clues-grid">
            <div className="base-clue-item">
              <span className="clue-label">Nationality</span>
              <span className="clue-value">{currentPlayer.nationality}</span>
            </div>
            <div className="base-clue-item">
              <span className="clue-label">Position</span>
              <span className="clue-value">{currentPlayer.position}</span>
            </div>
            <div className="base-clue-item club-hidden-item">
              <span className="clue-label">Current Club</span>
              <span className="clue-value hidden-val">🔒 Locked (Clue 4)</span>
            </div>
          </div>
        </section>

        {/* 4 Progressive Clues */}
        <section className="clues-section progressive-section">
          <div className="section-title-row">
            <h2 className="card-title">Progressive Clues Ladder</h2>
            <span className="clues-count-tag">{revealedCluesCount} of 4 Unlocked</span>
          </div>

          <div className="progressive-clues-list">
            {currentPlayer.bonusClues.map((clue, idx) => {
              const isUnlocked = idx < revealedCluesCount
              return (
                <div
                  key={idx}
                  className={`progressive-clue-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="clue-item-header">
                    <span className="clue-tier-indicator">
                      {isUnlocked ? '🔓' : '🔒'} Clue {idx + 1}: {CLUE_TITLES[idx]}
                    </span>
                    <span className="clue-cost-tag">{isUnlocked ? 'Unlocked' : '-2 pts'}</span>
                  </div>

                  {isUnlocked ? (
                    <p className="clue-text">{clue}</p>
                  ) : (
                    <p className="clue-placeholder">Purchase this clue to reveal intel.</p>
                  )}
                </div>
              )
            })}
          </div>

          {gameState === 'PLAYING' && (
            <div className="clue-action-row">
              <button
                type="button"
                className="btn-reveal-clue"
                onClick={handleRevealClue}
                disabled={revealedCluesCount >= 4 || bank < 2}
              >
                {revealedCluesCount >= 4
                  ? 'All 4 Clues Revealed'
                  : `🔓 Reveal Clue ${revealedCluesCount + 1} (-2 pts)`}
              </button>
            </div>
          )}
        </section>

        {/* Guessing Input & Autocomplete Dropdown */}
        {gameState === 'PLAYING' && (
          <section className="guess-section">
            <h2 className="card-title">Identify Player</h2>

            <form onSubmit={handleSubmitGuess} className="guess-form">
              <div className="autocomplete-container" ref={dropdownRef}>
                <div className="input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    className="guess-input"
                    placeholder="Type player name (e.g. Haaland, Henry...)"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setSelectedGuess(e.target.value)
                      setIsDropdownOpen(true)
                    }}
                    onFocus={() => {
                      if (query.trim()) setIsDropdownOpen(true)
                    }}
                  />
                  {query && (
                    <button
                      type="button"
                      className="btn-clear"
                      onClick={() => {
                        setQuery('')
                        setSelectedGuess('')
                        setIsDropdownOpen(false)
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isDropdownOpen && suggestions.length > 0 && (
                  <ul className="dropdown-suggestions">
                    {suggestions.map((name, idx) => (
                      <li
                        key={idx}
                        className="suggestion-item"
                        onClick={() => handleSelectSuggestion(name)}
                      >
                        <span className="suggestion-name">{name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary btn-submit"
                  disabled={!query.trim()}
                >
                  Submit Guess
                </button>
                <button
                  type="button"
                  className="btn-giveup"
                  onClick={handleGiveUp}
                >
                  Give Up
                </button>
              </div>
            </form>

            {/* Wrong Guesses & Directional Hints */}
            {wrongGuesses.length > 0 && (
              <div className="wrong-guesses-container">
                <span className="wrong-guesses-title">Previous Guesses:</span>
                <div className="wrong-guesses-list">
                  {wrongGuesses.map((guess, idx) => (
                    <div
                      key={idx}
                      className={`wrong-guess-badge ${guess.isSameClub ? 'same-club-badge' : 'diff-club-badge'}`}
                    >
                      <span className="guess-name">❌ {guess.name} (-2 pts)</span>
                      <span className="guess-hint">— {guess.hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
