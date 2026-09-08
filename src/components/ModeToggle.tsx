import { GameMode } from '../types'
import { useLanguage } from '../context/LanguageContext'

type ModeToggleProps = {
  mode: GameMode
  onSelectMode: (mode: GameMode) => void
}

function ModeToggle({ mode, onSelectMode }: ModeToggleProps) {
  const { t } = useLanguage()

  return (
    <div className="mode-toggle" role="tablist" aria-label={t.game}>
      <button
        className={`mode-toggle-button ${mode === 'classic' ? 'active' : ''}`}
        type="button"
        role="tab"
        aria-selected={mode === 'classic'}
        onClick={() => onSelectMode('classic')}
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
        onClick={() => onSelectMode('architects')}
      >
        Architects
      </button>
    </div>
  )
}

export default ModeToggle
