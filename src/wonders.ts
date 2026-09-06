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

export const CLASSIC_PACKS = [
  {
    id: 'cities',
    name: 'Cities',
    wonders: ['Byzance', 'Petra'],
  },
  {
    id: 'wonder-pack',
    name: 'Wonder Pack',
    wonders: ['Abu Simbel', 'Grande Muraille', 'Manneken Pis', 'Stonehenge'],
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
