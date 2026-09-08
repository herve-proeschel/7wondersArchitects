import { BASE_WONDERS, CLASSIC_PACKS } from '../wonders'
import { useLanguage } from '../context/LanguageContext'
import { GameMode } from '../types'

type ClassicPacksListProps = {
  mode: GameMode
  classicPacks: string[]
  onTogglePack: (packId: string) => void
}

function ClassicPacksList({
  mode,
  classicPacks,
  onTogglePack,
}: ClassicPacksListProps) {
  const { t } = useLanguage()

  return (
    <div className="classic-extension-list">
      {CLASSIC_PACKS.map((pack) => {
        const selected = mode === 'classic' && classicPacks.includes(pack.id)

        return (
          <button
            className="extension-row"
            type="button"
            aria-pressed={selected}
            key={pack.id}
            onClick={() => onTogglePack(pack.id)}
          >
            <span>
              <strong>{pack.id === 'cities' ? 'Cities' : 'Wonder Pack'}</strong>
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
  )
}

export default ClassicPacksList
