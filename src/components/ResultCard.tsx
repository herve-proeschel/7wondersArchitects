import { useLanguage } from '../context/LanguageContext'
import { Assignment, WONDER_NAMES } from '../wonders'

type ResultCardProps = {
  assignment: Assignment
  isFirstPlayer: boolean
}

function ResultCard({ assignment, isFirstPlayer }: ResultCardProps) {
  const { t, language } = useLanguage()

  return (
    <div className="result-card">
      <span className="res-player">
        {isFirstPlayer && (
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
  )
}

export default ResultCard
