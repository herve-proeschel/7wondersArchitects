import { LANGUAGES, Language } from '../wonders'
import { useLanguage } from '../context/LanguageContext'

type LanguageOptionsProps = {
  language: Language
  t: ReturnType<typeof useLanguage>['t']
  onSelectLanguage: (languageCode: Language) => void
}

function LanguageOptions({
  language,
  t,
  onSelectLanguage,
}: LanguageOptionsProps) {
  return (
    <>
      <p className="menu-section-title">{t.language}</p>
      {LANGUAGES.map((item) => (
        <button
          className={`language-option ${
            item.code === language ? 'selected' : ''
          }`}
          key={item.code}
          type="button"
          aria-pressed={item.code === language}
          onClick={() => onSelectLanguage(item.code)}
        >
          <span aria-hidden="true">{item.flag}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </>
  )
}

export default LanguageOptions