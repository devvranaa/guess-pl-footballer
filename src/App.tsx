import { useState } from 'react'
import { PLAYERS } from './data/players'
import './App.css'

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealedCluesCount, setRevealedCluesCount] = useState(0)

  const currentPlayer = PLAYERS[currentIndex]
  const roundScore = 10 - revealedCluesCount * 2
  const allCluesRevealed = revealedCluesCount >= currentPlayer.bonusClues.length

  const handleNextPlayer = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % PLAYERS.length)
    setRevealedCluesCount(0)
  }

  const handleRevealClue = () => {
    if (!allCluesRevealed) {
      setRevealedCluesCount((prev) => prev + 1)
    }
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>⚽ Guess the Premier League Footballer</h1>
        <div className="header-meta">
          <span className="round-indicator">
            Player {currentIndex + 1} of {PLAYERS.length}
          </span>
          <span className="score-badge">
            Points Available: {roundScore} pts
          </span>
        </div>
      </header>

      <main className="clue-card">
        <section className="clues-section">
          <h2 className="card-title">Base Clues</h2>
          <div className="clues-list">
            <div className="clue-item">
              <span className="clue-label">Nationality</span>
              <span className="clue-value">{currentPlayer.nationality}</span>
            </div>
            <div className="clue-item">
              <span className="clue-label">Current Club</span>
              <span className="clue-value">{currentPlayer.club}</span>
            </div>
            <div className="clue-item">
              <span className="clue-label">Position</span>
              <span className="clue-value">{currentPlayer.position}</span>
            </div>
          </div>
        </section>

        <section className="clues-section bonus-section">
          <div className="bonus-title-row">
            <h2 className="card-title">Bonus Clues</h2>
            <span className="clues-count-tag">
              {revealedCluesCount}/{currentPlayer.bonusClues.length} revealed
            </span>
          </div>

          {revealedCluesCount === 0 ? (
            <div className="empty-clues">
              <p>No bonus clues revealed yet. Unlock clues below if you need a hint!</p>
            </div>
          ) : (
            <ul className="bonus-clues-list">
              {currentPlayer.bonusClues.slice(0, revealedCluesCount).map((clue, idx) => (
                <li key={idx} className="bonus-clue-item">
                  <span className="bonus-clue-pill">Hint {idx + 1}</span>
                  <p className="bonus-clue-text">{clue}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="bonus-action-wrapper">
            <button
              type="button"
              className="btn-reveal"
              onClick={handleRevealClue}
              disabled={allCluesRevealed}
            >
              {allCluesRevealed ? 'All Clues Revealed' : 'Reveal Bonus Clue (-2 pts)'}
            </button>
          </div>
        </section>
      </main>

      <div className="actions">
        <button
          type="button"
          className="btn-next"
          onClick={handleNextPlayer}
        >
          Next Player ➔
        </button>
      </div>
    </div>
  )
}

export default App
