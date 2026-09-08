import { FormEvent } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { GameMode } from '../types'
import AddPlayerForm from './AddPlayerForm'
import PlayerList from './PlayerList'
import ExtensionChoices from './ExtensionChoices'

type PlayersCardProps = {
  players: string[]
  maxAllowed: number
  nameInput: string
  mode: GameMode
  medalsEnabled: boolean
  classicPacks: string[]
  onNameInputChange: (value: string) => void
  onAddPlayer: (event: FormEvent<HTMLFormElement>) => void
  onRemovePlayer: (index: number) => void
  onClearAllPlayers: () => void
  onSelectMode: (mode: GameMode) => void
  onToggleMedals: () => void
  onTogglePack: (packId: string) => void
}

function PlayersCard({
  players,
  maxAllowed,
  nameInput,
  mode,
  medalsEnabled,
  classicPacks,
  onNameInputChange,
  onAddPlayer,
  onRemovePlayer,
  onClearAllPlayers,
  onSelectMode,
  onToggleMedals,
  onTogglePack,
}: PlayersCardProps) {
  const { t } = useLanguage()

  return (
    <section className="card" aria-labelledby="players-title">
      <div className="card-title">
        <span id="players-title">
          {t.players} ({players.length} / {maxAllowed})
        </span>
        {players.length > 0 && (
          <button
            className="clear-btn"
            type="button"
            onClick={onClearAllPlayers}
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
        <AddPlayerForm
          nameInput={nameInput}
          onNameInputChange={onNameInputChange}
          onSubmit={onAddPlayer}
        />
      )}

      <PlayerList players={players} onRemovePlayer={onRemovePlayer} />

      <ExtensionChoices
        mode={mode}
        medalsEnabled={medalsEnabled}
        classicPacks={classicPacks}
        onSelectMode={onSelectMode}
        onToggleMedals={onToggleMedals}
        onTogglePack={onTogglePack}
      />
    </section>
  )
}

export default PlayersCard
