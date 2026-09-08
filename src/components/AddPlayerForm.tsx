import { FormEvent } from 'react'
import { useLanguage } from '../context/LanguageContext'

type AddPlayerFormProps = {
  nameInput: string
  onNameInputChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function AddPlayerForm({
  nameInput,
  onNameInputChange,
  onSubmit,
}: AddPlayerFormProps) {
  const { t } = useLanguage()

  return (
    <form className="input-row" onSubmit={onSubmit}>
      <input
        type="text"
        className="text-input"
        placeholder={t.add}
        value={nameInput}
        onChange={(event) => onNameInputChange(event.target.value)}
        maxLength={20}
        aria-label={t.playerName}
      />
      <button type="submit" className="btn-add" aria-label={t.addPlayer}>
        +
      </button>
    </form>
  )
}

export default AddPlayerForm
