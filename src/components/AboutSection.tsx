import { useLanguage } from '../context/LanguageContext'

type AboutSectionProps = {
  commitHash: string
  t: ReturnType<typeof useLanguage>['t']
}

function AboutSection({ commitHash, t }: AboutSectionProps) {
  return (
    <>
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
    </>
  )
}

export default AboutSection
