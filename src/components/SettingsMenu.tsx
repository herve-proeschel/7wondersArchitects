import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { readSavedTheme, Theme, writeSavedTheme } from '../storage'
import AboutSection from './AboutSection'
import LanguageOptions from './LanguageOptions'
import ThemeOptions from './ThemeOptions'

function isDarkTheme(theme: Theme, prefersDark: boolean) {
  return theme === 'dark' || (theme === 'system' && prefersDark)
}

function SettingsMenu() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(readSavedTheme)
  const menuRef = useRef<HTMLDivElement>(null)
  const commitHash = import.meta.env.VITE_COMMIT_HASH || 'dev'

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)

    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [isOpen])

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
    <div ref={menuRef} className="settings-menu">
      <button
        className="settings-menu-button"
        type="button"
        aria-label={t.more}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((isMenuOpen) => !isMenuOpen)}
      >
        <span aria-hidden="true">⋯</span>
      </button>
      {isOpen && (
        <div className="settings-menu-panel" aria-label={t.more}>
          <LanguageOptions
            language={language}
            t={t}
            onSelectLanguage={(languageCode) => {
              setLanguage(languageCode)
              setIsOpen(false)
            }}
          />
          <ThemeOptions
            theme={theme}
            t={t}
            onSelectTheme={(themeChoice) => {
              setTheme(themeChoice)
              setIsOpen(false)
            }}
          />
          <AboutSection commitHash={commitHash} t={t} />
        </div>
      )}
    </div>
  )
}

export default SettingsMenu
