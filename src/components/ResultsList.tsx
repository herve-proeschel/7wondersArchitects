import { Assignment } from '../wonders'
import ResultCard from './ResultCard'

type ResultsListProps = {
  assignments: Assignment[]
  firstPlayerIndex: number | null
}

function ResultsList({ assignments, firstPlayerIndex }: ResultsListProps) {
  return (
    <div className="results-viewport" aria-live="polite">
      {assignments.map((assignment, index) => (
        <ResultCard
          key={`${assignment.player}-${index}`}
          assignment={assignment}
          isFirstPlayer={index === firstPlayerIndex}
        />
      ))}
    </div>
  )
}

export default ResultsList
