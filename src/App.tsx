import { FormEvent, useEffect, useState } from 'react'
import {
  Assignment,
  BASE_WONDERS,
  CLASSIC_PACKS,
  MEDALS_WONDERS,
  Wonder,
} from './wonders'

const PLAYERS_STORAGE_KEY = '7w_players_fs'
const MODE_STORAGE_KEY = '7w_mode_fs'
const CLASSIC_PACKS_STORAGE_KEY = '7w_classic_packs_fs'

type GameMode = 'architects' | 'classic'

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

function readSavedPlayers(): string[] {
  const saved = readStorage(PLAYERS_STORAGE_KEY)

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

function readSavedMode(): GameMode {
  return readStorage(MODE_STORAGE_KEY) === 'classic' ? 'classic' : 'architects'
}

function readSavedClassicPacks(): string[] {
  const saved = readStorage(CLASSIC_PACKS_STORAGE_KEY)

  if (!saved) return CLASSIC_PACKS.map((pack) => pack.id)

  try {
    const packs = JSON.parse(saved)
    return Array.isArray(packs) &&
      packs.every((pack) =>
        CLASSIC_PACKS.some((classicPack) => classicPack.id === pack),
      )
      ? packs
      : CLASSIC_PACKS.map((pack) => pack.id)
  } catch {
    return CLASSIC_PACKS.map((pack) => pack.id)
  }
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
  const [mode, setMode] = useState<GameMode>(readSavedMode)
  const [classicPacks, setClassicPacks] = useState<string[]>(
    readSavedClassicPacks,
  )
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [firstPlayerIndex, setFirstPlayerIndex] = useState<number | null>(null)

  useEffect(() => {
    writeStorage(PLAYERS_STORAGE_KEY, JSON.stringify(players))
  }, [players])

  useEffect(() => {
    writeStorage(MODE_STORAGE_KEY, mode)
  }, [mode])

  useEffect(() => {
    writeStorage(CLASSIC_PACKS_STORAGE_KEY, JSON.stringify(classicPacks))
  }, [classicPacks])

  const maxAllowed =
    BASE_WONDERS.length +
    (mode === 'architects'
      ? MEDALS_WONDERS.length
      : CLASSIC_PACKS.filter((pack) => classicPacks.includes(pack.id)).reduce(
          (total, pack) => total + pack.wonders.length,
          0,
        ))
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
    setFirstPlayerIndex(null)
    triggerHaptic()
  }

  function clearAllPlayers() {
    setPlayers([])
    setAssignments([])
    setFirstPlayerIndex(null)
  }

  function drawWonders() {
    if (!canDraw) return

    const extensionWonders =
      mode === 'architects'
        ? MEDALS_WONDERS
        : CLASSIC_PACKS.filter((pack) =>
            classicPacks.includes(pack.id),
          ).flatMap((pack) => pack.wonders)
    const wonderPool: Wonder[] = [...BASE_WONDERS, ...extensionWonders]
    const shuffledWonders = shuffle(wonderPool)

    setAssignments(
      players.map((player, index) => ({
        player,
        wonder: shuffledWonders[index],
      })),
    )
    setFirstPlayerIndex(Math.floor(Math.random() * players.length))
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

        <div
          className="extension-choices"
          role="group"
          aria-label="Mode de jeu"
        >
          <button
            className="extension-row"
            type="button"
            aria-pressed={mode === 'architects'}
            onClick={() => setMode('architects')}
          >
            <span>
              <strong>7 Wonders Architects</strong>
              <small>+ Rome &amp; Ur (jusqu&apos;a 9)</small>
            </span>
            <span
              className={`switch ${mode === 'architects' ? 'active' : ''}`}
              aria-hidden="true"
            />
          </button>
          <div className="classic-extension-list">
            <span className="extension-heading">7 Wonders Classic</span>
            {CLASSIC_PACKS.map((pack) => {
              const selected =
                mode === 'classic' && classicPacks.includes(pack.id)

              return (
                <button
                  className="extension-row"
                  type="button"
                  aria-pressed={selected}
                  key={pack.id}
                  onClick={() => {
                    setMode('classic')
                    setClassicPacks((currentPacks) =>
                      currentPacks.includes(pack.id)
                        ? currentPacks.filter((item) => item !== pack.id)
                        : [...currentPacks, pack.id],
                    )
                  }}
                >
                  <span>
                    <strong>{pack.name}</strong>
                    <small>
                      + {pack.wonders.length} merveilles (jusqu&apos;a{' '}
                      {BASE_WONDERS.length + pack.wonders.length})
                    </small>
                  </span>
                  <span
                    className={`switch ${selected ? 'active' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              )
            })}
          </div>
        </div>
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
            <span className="res-player">
              {index === firstPlayerIndex && (
                <span className="first-player-flag" aria-label="Premier joueur">
                  ⚑
                </span>
              )}
              {assignment.player}
            </span>
            <span className="res-wonder">{assignment.wonder}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
