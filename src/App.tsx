import { useState } from 'react'
import { PLAYERS } from './data/players'
import './App.css'

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentPlayer = PLAYERS[currentIndex]

  const handleNextPlayer = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % PLAYERS.length)
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>⚽ Guess the Premier League Footballer</h1>
        <p className="round-indicator">
          Player {currentIndex + 1} of {PLAYERS.length}
        </p>
      </header>

      <main className="clue-card">
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
