export const BASE_WONDERS = [
  'alexandria',
  'babylon',
  'ephesus',
  'giza',
  'halicarnassus',
  'olympia',
  'rhodes',
] as const

export const MEDALS_WONDERS = ['rome', 'ur'] as const

export const CLASSIC_PACKS = [
  {
    id: 'cities',
    name: 'Cities',
    wonders: ['byzantium', 'petra'],
  },
  {
    id: 'wonder-pack',
    name: 'Wonder Pack',
    wonders: ['abu-simbel', 'great-wall', 'manneken-pis', 'stonehenge'],
  },
] as const

export const CLASSIC_WONDERS = CLASSIC_PACKS.reduce<string[]>(
  (wonders, pack) => [...wonders, ...pack.wonders],
  [],
)

export type Wonder =
  | (typeof BASE_WONDERS)[number]
  | (typeof MEDALS_WONDERS)[number]
  | (typeof CLASSIC_WONDERS)[number]

export type Assignment = {
  player: string
  wonder: Wonder
}

export type Language = 'fr' | 'en' | 'de' | 'it' | 'es'

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'it', label: 'IT', flag: '🇮🇹' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

export const WONDER_NAMES: Record<Wonder, Record<Language, string>> = {
  alexandria: {
    fr: 'Alexandrie',
    en: 'Alexandria',
    de: 'Alexandria',
    it: 'Alessandria',
    es: 'Alejandría',
  },
  babylon: {
    fr: 'Babylone',
    en: 'Babylon',
    de: 'Babylon',
    it: 'Babilonia',
    es: 'Babilonia',
  },
  ephesus: {
    fr: 'Éphèse',
    en: 'Ephesus',
    de: 'Ephesos',
    it: 'Efeso',
    es: 'Éfeso',
  },
  giza: {
    fr: 'Gizeh',
    en: 'Giza',
    de: 'Gizeh',
    it: 'Giza',
    es: 'Guiza',
  },
  halicarnassus: {
    fr: 'Halicarnasse',
    en: 'Halicarnassus',
    de: 'Halikarnassos',
    it: 'Alicarnasso',
    es: 'Halicarnaso',
  },
  olympia: {
    fr: 'Olympie',
    en: 'Olympia',
    de: 'Olympia',
    it: 'Olimpia',
    es: 'Olimpia',
  },
  rhodes: {
    fr: 'Rhodes',
    en: 'Rhodes',
    de: 'Rhodos',
    it: 'Rodi',
    es: 'Rodas',
  },
  rome: {
    fr: 'Rome',
    en: 'Rome',
    de: 'Rom',
    it: 'Roma',
    es: 'Roma',
  },
  ur: { fr: 'Ur', en: 'Ur', de: 'Ur', it: 'Ur', es: 'Ur' },
  byzantium: {
    fr: 'Byzance',
    en: 'Byzantium',
    de: 'Byzanz',
    it: 'Bisanzio',
    es: 'Bizancio',
  },
  petra: { fr: 'Pétra', en: 'Petra', de: 'Petra', it: 'Petra', es: 'Petra' },
  'abu-simbel': {
    fr: 'Abou Simbel',
    en: 'Abu Simbel',
    de: 'Abu Simbel',
    it: 'Abu Simbel',
    es: 'Abu Simbel',
  },
  'great-wall': {
    fr: 'Grande Muraille',
    en: 'Great Wall',
    de: 'Chinesische Mauer',
    it: 'Grande muraglia cinese',
    es: 'Gran Muralla China',
  },
  'manneken-pis': {
    fr: 'Manneken-Pis',
    en: 'Manneken Pis',
    de: 'Manneken Pis',
    it: 'Manneken Pis',
    es: 'Manneken Pis',
  },
  stonehenge: {
    fr: 'Stonehenge',
    en: 'Stonehenge',
    de: 'Stonehenge',
    it: 'Stonehenge',
    es: 'Stonehenge',
  },
}
