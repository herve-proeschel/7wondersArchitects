import { useLanguage } from '../context/LanguageContext'
import LanguagePicker from './LanguagePicker'

function AppHeader() {
  const { t } = useLanguage()

  return (
    <header>
      <div className="header-row">
        <h1>7 Wonders</h1>
        <LanguagePicker />
      </div>
      <p className="subtitle">{t.subtitle}</p>
    </header>
  )
}

export default AppHeader
