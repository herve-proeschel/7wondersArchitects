import { useLanguage } from '../context/LanguageContext'

type DrawButtonProps = {
  canDraw: boolean
  hasDrawn: boolean
  onDraw: () => void
}

function DrawButton({ canDraw, hasDrawn, onDraw }: DrawButtonProps) {
  const { t } = useLanguage()

  return (
    <button
      className="btn-draw"
      type="button"
      disabled={!canDraw}
      onClick={onDraw}
    >
      <span>{hasDrawn ? t.drawAgain : t.draw}</span>
    </button>
  )
}

export default DrawButton
