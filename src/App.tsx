import { FormEvent, useEffect, useState } from 'react'
import { Assignment, BASE_WONDERS, MEDALS_WONDERS, Wonder } from './wonders'

const PLAYERS_STORAGE_KEY = '7w_players_fs'
const MEDALS_STORAGE_KEY = '7w_medals_fs'

function readSavedPlayers(): string[] {
  const saved = localStorage.getItem(PLAYERS_STORAGE_KEY)

  if (!saved) return []

  try {
    const players = JSON.parse(saved)
    return Array.isArray(players) &&
      players.every((player) => typeof player === 'string')
      ? players
      : []
  } catch {
    return []
  }
}

function readSavedMedals(): boolean {
  const saved = localStorage.getItem(MEDALS_STORAGE_KEY)
  return saved === null ? true : saved === 'true'
}

function triggerHaptic() {
  if ('vibrate' in navigator) navigator.vibrate(20)
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

function App() {
  const [players, setPlayers] = useState<string[]>(readSavedPlayers)
  const [nameInput, setNameInput] = useState('')
  const [includeMedals, setIncludeMedals] = useState(readSavedMedals)
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players))
  }, [players])

  useEffect(() => {
    localStorage.setItem(MEDALS_STORAGE_KEY, String(includeMedals))
  }, [includeMedals])

  const maxAllowed =
    BASE_WONDERS.length + (includeMedals ? MEDALS_WONDERS.length : 0)
  const canDraw = players.length >= 2 && players.length <= maxAllowed

  function addPlayer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = nameInput.trim()

    if (!trimmedName || players.length >= maxAllowed) return

    setPlayers((currentPlayers) => [...currentPlayers, trimmedName])
    setNameInput('')
    triggerHaptic()
  }

  function removePlayer(indexToRemove: number) {
    setPlayers((currentPlayers) =>
      currentPlayers.filter((_, index) => index !== indexToRemove),
    )
    setAssignments([])
    triggerHaptic()
  }

  function clearAllPlayers() {
    setPlayers([])
    setAssignments([])
  }

  function drawWonders() {
    if (!canDraw) return

    const wonderPool: Wonder[] = includeMedals
      ? [...BASE_WONDERS, ...MEDALS_WONDERS]
      : [...BASE_WONDERS]
    const shuffledWonders = shuffle(wonderPool)

    setAssignments(
      players.map((player, index) => ({
        player,
        wonder: shuffledWonders[index],
      })),
    )
    triggerHaptic()
  }

  return (
    <div className="app-screen">
      <header>
        <h1>7 Wonders Architects</h1>
        <p className="subtitle">Tirage au sort</p>
      </header>

      <section className="card" aria-labelledby="players-title">
        <div className="card-title">
          <span id="players-title">
            Joueurs ({players.length} / {maxAllowed})
          </span>
          {players.length > 0 && (
            <button
              className="clear-btn"
              type="button"
              onClick={clearAllPlayers}
            >
              Effacer
            </button>
          )}
        </div>

        {players.length >= maxAllowed ? (
          <div className="limit-reached-badge">
            Nombre maximum de joueurs atteint ({maxAllowed})
          </div>
        ) : (
          <form className="input-row" onSubmit={addPlayer}>
            <input
              type="text"
              className="text-input"
              placeholder="Ajouter un joueur..."
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              maxLength={20}
              aria-label="Nom du joueur"
            />
            <button type="submit" className="btn-add" aria-label="Ajouter">
              +
            </button>
          </form>
        )}

        <div className="player-list" aria-live="polite">
          {players.length === 0 && (
            <span className="empty-state">Ajoutez au moins 2 joueurs.</span>
          )}
          {players.map((name, index) => (
            <div className="player-chip" key={`${name}-${index}`}>
              <span>{name}</span>
              <button
                className="chip-delete"
                type="button"
                aria-label={`Supprimer ${name}`}
                onClick={() => removePlayer(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          className="extension-row"
          type="button"
          aria-pressed={includeMedals}
          onClick={() => setIncludeMedals((enabled) => !enabled)}
        >
          <span>
            <strong>Extension Medals</strong>
            <small>+ Rome &amp; Ur (jusqu&apos;a 9)</small>
          </span>
          <span
            className={`switch ${includeMedals ? 'active' : ''}`}
            aria-hidden="true"
          />
        </button>
      </section>

      <button
        className="btn-draw"
        type="button"
        disabled={!canDraw}
        onClick={drawWonders}
      >
        <span aria-hidden="true">*</span>
        <span>
          {assignments.length > 0 ? 'Re-tirer' : 'Tirer les merveilles'}
        </span>
      </button>

      <div className="results-viewport" aria-live="polite">
        {assignments.map((assignment, index) => (
          <div className="result-card" key={`${assignment.player}-${index}`}>
            <span className="res-player">{assignment.player}</span>
            <span className="res-wonder">{assignment.wonder}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
