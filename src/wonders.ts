export const BASE_WONDERS = [
  'Alexandrie',
  'Babylone',
  'Éphèse',
  'Gizeh',
  'Halicarnasse',
  'Olympie',
  'Rhodes',
] as const

export const MEDALS_WONDERS = ['Rome', 'Ur'] as const

export type Wonder = (typeof BASE_WONDERS)[number] | (typeof MEDALS_WONDERS)[number]

export type Assignment = {
  player: string
  wonder: Wonder
}
