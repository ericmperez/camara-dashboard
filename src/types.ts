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
