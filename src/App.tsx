import { FormEvent, useEffect, useState } from 'react'
import {
  Assignment,
  BASE_WONDERS,
  CLASSIC_PACKS,
  MEDALS_WONDERS,
  Wonder,
} from './wonders'
import { GameMode } from './types'
import { LanguageProvider } from './context/LanguageContext'
import AppHeader from './components/AppHeader'
import PlayersCard from './components/PlayersCard'
import DrawButton from './components/DrawButton'
import ResultsList from './components/ResultsList'
import {
  readSavedClassicPacks,
  readSavedMedals,
  readSavedMode,
  readSavedPlayers,
  writeSavedClassicPacks,
  writeSavedMedals,
  writeSavedMode,
  writeSavedPlayers,
} from './storage'

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

  useEffect(() => {
    writeSavedPlayers(players)
  }, [players])

  useEffect(() => {
    writeSavedMode(mode)
  }, [mode])

  useEffect(() => {
    writeSavedClassicPacks(classicPacks)
  }, [classicPacks])

  useEffect(() => {
    writeSavedMedals(medalsEnabled)
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
      shuffle(
        players.map((player, index) => ({
          player,
          wonder: shuffledWonders[index],
        })),
      ),
    )
    setFirstPlayerIndex(Math.floor(Math.random() * players.length))
    triggerHaptic()
  }

  return (
    <LanguageProvider>
      <div className="app-screen">
        <AppHeader />

        <PlayersCard
          players={players}
          maxAllowed={maxAllowed}
          nameInput={nameInput}
          mode={mode}
          medalsEnabled={medalsEnabled}
          classicPacks={classicPacks}
          onNameInputChange={setNameInput}
          onAddPlayer={addPlayer}
          onRemovePlayer={removePlayer}
          onClearAllPlayers={clearAllPlayers}
          onSelectMode={setMode}
          onToggleMedals={() => setMedalsEnabled((enabled) => !enabled)}
          onTogglePack={(packId) => {
            setMode('classic')
            setClassicPacks((currentPacks) =>
              currentPacks.includes(packId)
                ? currentPacks.filter((item) => item !== packId)
                : [...currentPacks, packId],
            )
          }}
        />

        <DrawButton
          canDraw={canDraw}
          hasDrawn={assignments.length > 0}
          onDraw={drawWonders}
        />

        <ResultsList
          assignments={assignments}
          firstPlayerIndex={firstPlayerIndex}
        />
      </div>
    </LanguageProvider>
  )
}

export default App
