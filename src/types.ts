export const PARTIES = ['PNP', 'PPD', 'PIP', 'PD'] as const
export type Party = (typeof PARTIES)[number]

export type Representative = {
  id: string
  name: string
  party: Party
  district: number | null
  districtLabel: string
  municipalities: string[]
  role: string | null
  email: string | null
  phone: string | null
  photoUrl: string | null
  profileUrl: string
}

export type SeatKind = 'all' | 'distrito' | 'acumulacion'

export type RosterFilters = {
  query: string
  party: Party | 'all'
  seat: SeatKind
}

export type Measure = {
  code: string
  filed: string
  title: string
  url: string
}

export type MeasureCounts = {
  PC: number
  RC: number
  RCC: number
  RKC: number
}

export type RepMeasures = {
  sutraId: string
  sutraUrl: string
  counts: MeasureCounts
  projects: Measure[]
}

export type ElectionEvent = 'generales-2024' | 'especial-2025' | 'ley-de-minorias'

export type SeatRaceKind = 'distrito' | 'acumulacion'

export type PriorVote = {
  year: 2020
  name: string
  votes: number
  pct: number
  winner: boolean
  kind: SeatRaceKind
  district: number | null
  comparable: boolean
  sourceUrl: string
  sourceLabel: string
}

export const CURVE_BANDS = ['sube', 'plano', 'baja', 'sin-par'] as const
export type CurveBand = (typeof CURVE_BANDS)[number]

export type ElectionResult = {
  event: ElectionEvent
  eventLabel: string
  votes: number | null
  pct: number | null
  total: number | null
  margin: number | null
  runnerUp: string | null
  runnerUpVotes: number | null
  sourceUrl: string
  sourceLabel: string
  note: string | null
  harvestedFrom?: string
}

export type ConnectionKind = 'fact' | 'inference'

export type DossierSource = {
  url: string
  label: string
  published?: string
}

export type DossierConnection = {
  toId: string
  kind: ConnectionKind
  label: string
  note?: string
  sources: DossierSource[]
}

export type Dossier = {
  id: string
  bio: string | null
  career: string[]
  aspirations: string[]
  committees: string[]
  connections: DossierConnection[]
  sources: DossierSource[]
}

export const WHIP_STATUSES = [
  'no-contactado',
  'voto-que-puedo-coger',
  'indeciso',
  'si',
  'no',
] as const

export type WhipStatus = (typeof WHIP_STATUSES)[number]

export type WhipSeat = {
  status: WhipStatus
  note: string | null
}

export type WhipBoard = {
  measureCode: string
  title: string | null
  updatedAt: string
  seats: Record<string, WhipSeat>
}

export const REPEAT_BANDS = ['cerradura', 'solido', 'posible', 'vulnerable'] as const
export type RepeatBand = (typeof REPEAT_BANDS)[number]
