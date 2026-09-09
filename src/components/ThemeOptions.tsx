import { useLanguage } from '../context/LanguageContext'
import { Theme } from '../storage'

const THEME_CHOICES: Theme[] = ['system', 'dark', 'light']

type ThemeOptionsProps = {
  theme: Theme
  t: ReturnType<typeof useLanguage>['t']
  onSelectTheme: (themeChoice: Theme) => void
}

function ThemeOptions({ theme, t, onSelectTheme }: ThemeOptionsProps) {
  return (
    <>
      <p className="menu-section-title">{t.theme}</p>
      {THEME_CHOICES.map((themeChoice) => (
        <button
          className={`language-option ${
            themeChoice === theme ? 'selected' : ''
          }`}
          key={themeChoice}
          type="button"
          aria-pressed={themeChoice === theme}
          onClick={() => onSelectTheme(themeChoice)}
        >
          {themeChoice === 'system'
            ? t.themeSystem
            : themeChoice === 'dark'
            ? t.themeDark
            : t.themeLight}
        </button>
      ))}
    </>
  )
}

export default ThemeOptions
