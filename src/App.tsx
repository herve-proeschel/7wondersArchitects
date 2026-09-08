import { FormEvent, useEffect, useState } from 'react'
import {
  Assignment,
  BASE_WONDERS,
  CLASSIC_PACKS,
  Language,
  LANGUAGES,
  MEDALS_WONDERS,
  Wonder,
  WONDER_NAMES,
} from './wonders'
import { translations } from './translations'

const PLAYERS_STORAGE_KEY = '7w_players_fs'
const MODE_STORAGE_KEY = '7w_mode_fs'
const CLASSIC_PACKS_STORAGE_KEY = '7w_classic_packs_fs'
const LANGUAGE_STORAGE_KEY = '7w_language_fs'
const MEDALS_STORAGE_KEY = '7w_medals_fs'

type GameMode = 'architects' | 'classic'

function readSavedLanguage(): Language {
  const saved = readStorage(LANGUAGE_STORAGE_KEY)
  if (saved && LANGUAGES.some((language) => language.code === saved))
    return saved as Language
  const locale =
    typeof navigator === 'undefined' ? '' : navigator.language.toLowerCase()
  return LANGUAGES.some((language) => locale.startsWith(language.code))
    ? (locale.slice(0, 2) as Language)
    : 'en'
}

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

function readSavedMedals(): boolean {
  return readStorage(MEDALS_STORAGE_KEY) !== 'false'
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
  const [medalsEnabled, setMedalsEnabled] = useState(readSavedMedals)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [firstPlayerIndex, setFirstPlayerIndex] = useState<number | null>(null)
  const [language, setLanguage] = useState<Language>(readSavedLanguage)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const t = translations[language]
  const selectedLanguage = LANGUAGES.find((item) => item.code === language)

  useEffect(() => {
    writeStorage(PLAYERS_STORAGE_KEY, JSON.stringify(players))
  }, [players])

  useEffect(() => {
    writeStorage(MODE_STORAGE_KEY, mode)
  }, [mode])

  useEffect(() => {
    writeStorage(CLASSIC_PACKS_STORAGE_KEY, JSON.stringify(classicPacks))
  }, [classicPacks])

  useEffect(() => {
    writeStorage(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const themeColor = document.querySelector('meta[name="theme-color"]')
    const updateThemeColor = () => {
      themeColor?.setAttribute(
        'content',
        colorScheme.matches ? '#121211' : '#f4f0e8',
      )
    }

    updateThemeColor()
    colorScheme.addEventListener('change', updateThemeColor)

    return () => colorScheme.removeEventListener('change', updateThemeColor)
  }, [])

  useEffect(() => {
    writeStorage(MEDALS_STORAGE_KEY, String(medalsEnabled))
  }, [medalsEnabled])

  const maxAllowed =
    BASE_WONDERS.length +
    (mode === 'architects' && medalsEnabled
      ? MEDALS_WONDERS.length
      : mode === 'architects'
      ? 0
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
      mode === 'architects' && medalsEnabled
        ? MEDALS_WONDERS
        : mode === 'architects'
        ? []
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
        <div className="header-row">
          <h1>7 Wonders</h1>
          <div className="language-picker">
            <button
              className="language-button"
              type="button"
              aria-label={t.language}
              aria-haspopup="listbox"
              aria-expanded={isLanguageMenuOpen}
              onClick={() => setIsLanguageMenuOpen((isOpen) => !isOpen)}
            >
              <span aria-hidden="true">{selectedLanguage?.flag}</span>
              <span className="language-code" aria-hidden="true">
                {selectedLanguage?.label}
              </span>
              <span className="language-chevron" aria-hidden="true">
                ▾
              </span>
            </button>
            {isLanguageMenuOpen && (
              <div
                className="language-menu"
                role="listbox"
                aria-label={t.language}
              >
                {LANGUAGES.map((item) => (
                  <button
                    className={`language-option ${
                      item.code === language ? 'selected' : ''
                    }`}
                    key={item.code}
                    type="button"
                    role="option"
                    aria-selected={item.code === language}
                    onClick={() => {
                      setLanguage(item.code)
                      setIsLanguageMenuOpen(false)
                    }}
                  >
                    <span aria-hidden="true">{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="subtitle">{t.subtitle}</p>
      </header>

      <section className="card" aria-labelledby="players-title">
        <div className="card-title">
          <span id="players-title">
            {t.players} ({players.length} / {maxAllowed})
          </span>
          {players.length > 0 && (
            <button
              className="clear-btn"
              type="button"
              onClick={clearAllPlayers}
            >
              {t.clear}
            </button>
          )}
        </div>

        {players.length > maxAllowed ? (
          <div className="limit-reached-badge">
            {t.overMax} ({maxAllowed})
          </div>
        ) : players.length === maxAllowed ? (
          <div className="limit-reached-badge">
            {t.max} ({maxAllowed})
          </div>
        ) : (
          <form className="input-row" onSubmit={addPlayer}>
            <input
              type="text"
              className="text-input"
              placeholder={t.add}
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              maxLength={20}
              aria-label={t.playerName}
            />
            <button type="submit" className="btn-add" aria-label={t.addPlayer}>
              +
            </button>
          </form>
        )}

        <div className="player-list" aria-live="polite">
          {players.length === 0 && (
            <span className="empty-state">{t.empty}</span>
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

        <div className="extension-choices" role="group" aria-label={t.mode}>
          <div className="mode-toggle" role="tablist" aria-label={t.game}>
            <button
              className={`mode-toggle-button ${
                mode === 'classic' ? 'active' : ''
              }`}
              type="button"
              role="tab"
              aria-selected={mode === 'classic'}
              onClick={() => setMode('classic')}
            >
              Classic
            </button>
            <button
              className={`mode-toggle-button ${
                mode === 'architects' ? 'active' : ''
              }`}
              type="button"
              role="tab"
              aria-selected={mode === 'architects'}
              onClick={() => setMode('architects')}
            >
              Architects
            </button>
          </div>

          {mode === 'architects' ? (
            <div className="classic-extension-list">
              <button
                className="extension-row"
                type="button"
                aria-pressed={medalsEnabled}
                onClick={() => setMedalsEnabled((enabled) => !enabled)}
              >
                <span>
                  <strong>Medals</strong>
                  <small>
                    + {WONDER_NAMES.rome[language]} &amp;{' '}
                    {WONDER_NAMES.ur[language]} ({t.upTo} 9) + Rome &amp; Ur
                    (jusqu&apos;a {BASE_WONDERS.length + MEDALS_WONDERS.length})
                  </small>
                </span>
                <span
                  className={`switch ${medalsEnabled ? 'active' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          ) : (
            <div className="classic-extension-list">
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
                      <strong>
                        {pack.id === 'cities' ? 'Cities' : 'Wonder Pack'}
                      </strong>
                      <small>
                        + {pack.wonders.length} {t.wonders} ({t.upTo}{' '}
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
          )}
        </div>
      </section>

      <button
        className="btn-draw"
        type="button"
        disabled={!canDraw}
        onClick={drawWonders}
      >
        <span aria-hidden="true">*</span>
        <span>{assignments.length > 0 ? t.drawAgain : t.draw}</span>
      </button>

      <div className="results-viewport" aria-live="polite">
        {assignments.map((assignment, index) => (
          <div className="result-card" key={`${assignment.player}-${index}`}>
            <span className="res-player">
              {index === firstPlayerIndex && (
                <span className="first-player-flag" aria-label={t.first}>
                  ⚑
                </span>
              )}
              {assignment.player}
            </span>
            <span className="res-wonder">
              {WONDER_NAMES[assignment.wonder][language]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
