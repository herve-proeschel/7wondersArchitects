import { CLASSIC_PACKS, Language, LANGUAGES } from './wonders'
import { GameMode } from './types'

const PLAYERS_STORAGE_KEY = '7w_players_fs'
const MODE_STORAGE_KEY = '7w_mode_fs'
const CLASSIC_PACKS_STORAGE_KEY = '7w_classic_packs_fs'
const LANGUAGE_STORAGE_KEY = '7w_language_fs'
const MEDALS_STORAGE_KEY = '7w_medals_fs'

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

export function readSavedLanguage(): Language {
  const saved = readStorage(LANGUAGE_STORAGE_KEY)
  if (saved && LANGUAGES.some((language) => language.code === saved))
    return saved as Language
  const locale =
    typeof navigator === 'undefined' ? '' : navigator.language.toLowerCase()
  return LANGUAGES.some((language) => locale.startsWith(language.code))
    ? (locale.slice(0, 2) as Language)
    : 'en'
}

export function writeSavedLanguage(language: Language) {
  writeStorage(LANGUAGE_STORAGE_KEY, language)
}

export function readSavedPlayers(): string[] {
  const saved = readStorage(PLAYERS_STORAGE_KEY)

  if (!saved) return []

  try {
    const players = JSON.parse(saved)
    return Array.isArray(players) &&
      players.every((player) => typeof player === 'string')
      ? players
      : []
  } catch {
    return []
  }
}

export function writeSavedPlayers(players: string[]) {
  writeStorage(PLAYERS_STORAGE_KEY, JSON.stringify(players))
}

export function readSavedMode(): GameMode {
  return readStorage(MODE_STORAGE_KEY) === 'classic' ? 'classic' : 'architects'
}

export function writeSavedMode(mode: GameMode) {
  writeStorage(MODE_STORAGE_KEY, mode)
}

export function readSavedClassicPacks(): string[] {
  const saved = readStorage(CLASSIC_PACKS_STORAGE_KEY)

  if (!saved) return CLASSIC_PACKS.map((pack) => pack.id)

  try {
    const packs = JSON.parse(saved)
    return Array.isArray(packs) &&
      packs.every((pack) =>
        CLASSIC_PACKS.some((classicPack) => classicPack.id === pack),
      )
      ? packs
      : CLASSIC_PACKS.map((pack) => pack.id)
  } catch {
    return CLASSIC_PACKS.map((pack) => pack.id)
  }
}

export function writeSavedClassicPacks(classicPacks: string[]) {
  writeStorage(CLASSIC_PACKS_STORAGE_KEY, JSON.stringify(classicPacks))
}

export function readSavedMedals(): boolean {
  return readStorage(MEDALS_STORAGE_KEY) !== 'false'
}

export function writeSavedMedals(medalsEnabled: boolean) {
  writeStorage(MEDALS_STORAGE_KEY, String(medalsEnabled))
}
