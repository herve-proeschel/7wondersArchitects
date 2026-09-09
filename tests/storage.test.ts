import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  readSavedClassicPacks,
  readSavedLanguage,
  readSavedMedals,
  readSavedMode,
  readSavedPlayers,
  readSavedTheme,
  writeSavedClassicPacks,
  writeSavedLanguage,
  writeSavedMedals,
  writeSavedMode,
  writeSavedPlayers,
  writeSavedTheme,
} from '../src/storage'
import { CLASSIC_PACKS } from '../src/wonders'

const defaultPacks = CLASSIC_PACKS.map((pack) => pack.id)

beforeEach(() => {
  localStorage.clear()
  Object.defineProperty(navigator, 'language', {
    configurable: true,
    value: 'en-US',
  })
})

describe('storage preferences', () => {
  it('reads and writes valid preferences', () => {
    writeSavedPlayers(['Ada', 'Grace'])
    writeSavedMode('classic')
    writeSavedClassicPacks(['cities'])
    writeSavedMedals(false)
    writeSavedLanguage('fr')
    writeSavedTheme('dark')

    expect(readSavedPlayers()).toEqual(['Ada', 'Grace'])
    expect(readSavedMode()).toBe('classic')
    expect(readSavedClassicPacks()).toEqual(['cities'])
    expect(readSavedMedals()).toBe(false)
    expect(readSavedLanguage()).toBe('fr')
    expect(readSavedTheme()).toBe('dark')
  })

  it('uses defaults for missing, malformed, and invalid values', () => {
    expect(readSavedPlayers()).toEqual([])
    expect(readSavedMode()).toBe('architects')
    expect(readSavedClassicPacks()).toEqual(defaultPacks)
    expect(readSavedMedals()).toBe(true)
    expect(readSavedLanguage()).toBe('en')
    expect(readSavedTheme()).toBe('system')

    localStorage.setItem('7w_players_fs', '{bad json')
    localStorage.setItem('7w_mode_fs', 'other')
    localStorage.setItem('7w_classic_packs_fs', '["unknown"]')
    localStorage.setItem('7w_medals_fs', 'true')
    localStorage.setItem('7w_language_fs', 'xx')
    localStorage.setItem('7w_theme_fs', 'sepia')

    expect(readSavedPlayers()).toEqual([])
    expect(readSavedMode()).toBe('architects')
    expect(readSavedClassicPacks()).toEqual(defaultPacks)
    expect(readSavedMedals()).toBe(true)
    expect(readSavedLanguage()).toBe('en')
    expect(readSavedTheme()).toBe('system')

    localStorage.setItem('7w_players_fs', '["Ada", 3]')
    localStorage.setItem('7w_classic_packs_fs', '["cities", "unknown"]')
    expect(readSavedPlayers()).toEqual([])
    expect(readSavedClassicPacks()).toEqual(defaultPacks)
  })

  it('detects a supported browser language', () => {
    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: 'de-DE',
    })
    expect(readSavedLanguage()).toBe('de')

    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: 'pt-BR',
    })
    expect(readSavedLanguage()).toBe('en')
  })

  it('survives storage API failures', () => {
    const getItem = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('blocked')
      })
    expect(readSavedPlayers()).toEqual([])
    expect(readSavedMode()).toBe('architects')
    expect(readSavedClassicPacks()).toEqual(defaultPacks)

    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('blocked')
      })
    expect(() => writeSavedPlayers(['Ada'])).not.toThrow()
    expect(() => writeSavedMode('classic')).not.toThrow()
    expect(() => writeSavedClassicPacks(['cities'])).not.toThrow()
    expect(() => writeSavedMedals(false)).not.toThrow()
    expect(() => writeSavedLanguage('fr')).not.toThrow()
    expect(() => writeSavedTheme('dark')).not.toThrow()
    getItem.mockRestore()
    setItem.mockRestore()
  })
})