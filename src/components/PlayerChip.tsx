type PlayerChipProps = {
  name: string
  onRemove: () => void
}

function PlayerChip({ name, onRemove }: PlayerChipProps) {
  return (
    <div className="player-chip">
      <span>{name}</span>
      <button
        className="chip-delete"
        type="button"
        aria-label={`Supprimer ${name}`}
        onClick={onRemove}
      >
        ×
      </button>
    </div>
  )
}

export default PlayerChip
