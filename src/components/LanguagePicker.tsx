import { useState } from 'react'
import { LANGUAGES } from '../wonders'
import { useLanguage } from '../context/LanguageContext'

function LanguagePicker() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const selectedLanguage = LANGUAGES.find((item) => item.code === language)

  return (
    <div className="language-picker">
      <button
        className="language-button"
        type="button"
        aria-label={t.language}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((isMenuOpen) => !isMenuOpen)}
      >
        <span aria-hidden="true">{selectedLanguage?.flag}</span>
        <span className="language-code" aria-hidden="true">
          {selectedLanguage?.label}
        </span>
        <span className="language-chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <div className="language-menu" role="listbox" aria-label={t.language}>
          {LANGUAGES.map((item) => (
            <button
              className={`language-option ${
                item.code === language ? 'selected' : ''
              }`}
              key={item.code}
              type="button"
              role="option"
              aria-selected={item.code === language}
              onClick={() => {
                setLanguage(item.code)
                setIsOpen(false)
              }}
            >
              <span aria-hidden="true">{item.flag}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguagePicker
