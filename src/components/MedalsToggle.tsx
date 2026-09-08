import { BASE_WONDERS, MEDALS_WONDERS } from '../wonders'
import { useLanguage } from '../context/LanguageContext'

type MedalsToggleProps = {
  medalsEnabled: boolean
  onToggle: () => void
}

function MedalsToggle({ medalsEnabled, onToggle }: MedalsToggleProps) {
  const { t } = useLanguage()

  return (
    <div className="classic-extension-list">
      <button
        className="extension-row"
        type="button"
        aria-pressed={medalsEnabled}
        onClick={onToggle}
      >
        <span>
          <strong>Medals</strong>
          <small>
            + {MEDALS_WONDERS.length} {t.wonders} ({t.upTo}{' '}
            {BASE_WONDERS.length + MEDALS_WONDERS.length})
          </small>
        </span>
        <span
          className={`switch ${medalsEnabled ? 'active' : ''}`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

export default MedalsToggle
