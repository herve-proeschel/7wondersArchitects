import { useLanguage } from '../context/LanguageContext'
import SettingsMenu from './SettingsMenu'

function AppHeader() {
  const { t } = useLanguage()

  return (
    <header>
      <div className="header-row">
        <h1>7 Wonders</h1>
        <SettingsMenu />
      </div>
      <p className="subtitle">{t.subtitle}</p>
    </header>
  )
}

export default AppHeader
