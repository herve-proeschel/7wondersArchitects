import { useLanguage } from '../context/LanguageContext'
import PlayerChip from './PlayerChip'

type PlayerListProps = {
  players: string[]
  onRemovePlayer: (index: number) => void
}

function PlayerList({ players, onRemovePlayer }: PlayerListProps) {
  const { t } = useLanguage()

  return (
    <div className="player-list" aria-live="polite">
      {players.length === 0 && <span className="empty-state">{t.empty}</span>}
      {players.map((name, index) => (
        <PlayerChip
          key={`${name}-${index}`}
          name={name}
          onRemove={() => onRemovePlayer(index)}
        />
      ))}
    </div>
  )
}

export default PlayerList
