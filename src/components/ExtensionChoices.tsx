import { useLanguage } from '../context/LanguageContext'
import { GameMode } from '../types'
import ModeToggle from './ModeToggle'
import MedalsToggle from './MedalsToggle'
import ClassicPacksList from './ClassicPacksList'

type ExtensionChoicesProps = {
  mode: GameMode
  medalsEnabled: boolean
  classicPacks: string[]
  onSelectMode: (mode: GameMode) => void
  onToggleMedals: () => void
  onTogglePack: (packId: string) => void
}

function ExtensionChoices({
  mode,
  medalsEnabled,
  classicPacks,
  onSelectMode,
  onToggleMedals,
  onTogglePack,
}: ExtensionChoicesProps) {
  const { t } = useLanguage()

  return (
    <div className="extension-choices" role="group" aria-label={t.mode}>
      <ModeToggle mode={mode} onSelectMode={onSelectMode} />

      {mode === 'architects' ? (
        <MedalsToggle medalsEnabled={medalsEnabled} onToggle={onToggleMedals} />
      ) : (
        <ClassicPacksList
          mode={mode}
          classicPacks={classicPacks}
          onTogglePack={onTogglePack}
        />
      )}
    </div>
  )
}

export default ExtensionChoices
