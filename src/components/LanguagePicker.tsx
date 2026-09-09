import { useEffect, useState } from 'react'
import { LANGUAGES } from '../wonders'
import { useLanguage } from '../context/LanguageContext'
import { readSavedTheme, Theme, writeSavedTheme } from '../storage'

const THEME_CHOICES: Theme[] = ['system', 'dark', 'light']

function isDarkTheme(theme: Theme, prefersDark: boolean) {
  return theme === 'dark' || (theme === 'system' && prefersDark)
}

function LanguagePicker() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(readSavedTheme)
  const commitHash = import.meta.env.VITE_COMMIT_HASH || 'dev'

  useEffect(() => {
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const themeColor = document.querySelector('meta[name="theme-color"]')
    const applyTheme = () => {
      if (theme === 'system') {
        document.documentElement.removeAttribute('data-theme')
      } else {
        document.documentElement.setAttribute('data-theme', theme)
      }
      themeColor?.setAttribute(
        'content',
        isDarkTheme(theme, colorScheme.matches) ? '#121211' : '#f4f0e8',
      )
    }

    applyTheme()
    colorScheme.addEventListener('change', applyTheme)

    return () => colorScheme.removeEventListener('change', applyTheme)
  }, [theme])

  useEffect(() => {
    writeSavedTheme(theme)
  }, [theme])

  return (
    <div className="language-picker">
      <button
        className="language-button"
        type="button"
        aria-label={t.more}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((isMenuOpen) => !isMenuOpen)}
      >
        <span aria-hidden="true">⋯</span>
        <span className="language-code">{t.more}</span>
        <span className="language-chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <div className="language-menu" role="menu" aria-label={t.more}>
          <p className="menu-section-title">{t.language}</p>
          {LANGUAGES.map((item) => (
            <button
              className={`language-option ${
                item.code === language ? 'selected' : ''
              }`}
              key={item.code}
              type="button"
              role="menuitemradio"
              aria-checked={item.code === language}
              onClick={() => {
                setLanguage(item.code)
                setIsOpen(false)
              }}
            >
              <span aria-hidden="true">{item.flag}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <p className="menu-section-title">{t.theme}</p>
          {THEME_CHOICES.map((themeChoice) => (
            <button
              className={`language-option ${themeChoice === theme ? 'selected' : ''}`}
              key={themeChoice}
              type="button"
              role="menuitemradio"
              aria-checked={themeChoice === theme}
              onClick={() => {
                setTheme(themeChoice)
                setIsOpen(false)
              }}
            >
              {themeChoice === 'system'
                ? t.themeSystem
                : themeChoice === 'dark'
                ? t.themeDark
                : t.themeLight}
            </button>
          ))}
          <p className="menu-section-title">{t.about}</p>
          <p className="menu-about">{t.aboutText}</p>
          <a
            className="menu-link"
            href="https://github.com/herve-proeschel/7wondersArchitects"
            target="_blank"
            rel="noreferrer"
          >
            {t.project}
          </a>
          <p className="menu-commit">
            {t.commit}: <code>{commitHash}</code>
          </p>
        </div>
      )}
    </div>
  )
}

export default LanguagePicker
