import historyFile from '../data/district-history.json'
import type { Representative } from '../types'
import { priorOf } from './prior'
import { tenureOf } from './tenure'
import { normalize } from './text'
import { electionFor } from './votes'

export const OUTLOOK_A = -0.318
export const OUTLOOK_B = 0.16
export const OUTLOOK_AT_LARGE_SCALE = 0.6
export const OUTLOOK_SWING = 0.25
export const OUTLOOK_TERM = 0.25
export const OUTLOOK_TERM_CAP = 1
/** Primer no electo de acumulación 2024: Gabriel López Arrieta. */
export const FIRST_LOSER_VOTES = 70666
export const AT_LARGE_TOTAL = 1271361

const STOP = new Set(['de', 'del', 'los', 'las', 'para', 'por', 'con'])

export const OUTLOOK_FLAGS = [
  'sin-par-2020',
  'antiguedad-sin-cita',
  'especial-d31',
  'runner-up-no-es-el-segundo',
] as const

export type OutlookFlag = (typeof OUTLOOK_FLAGS)[number]

export const OUTLOOK_FLAG_LABELS: Record<OutlookFlag, string> = {
  'sin-par-2020': 'Sin par 2020',
  'antiguedad-sin-cita': 'Antigüedad sin cita',
  'especial-d31': 'Especial D31',
  'runner-up-no-es-el-segundo': 'Segundo mal guardado',
}

export const OUTLOOK_BANDS = ['en-riesgo', 'competitivo', 'probable', 'seguro'] as const
export type OutlookBand = (typeof OUTLOOK_BANDS)[number]

export const OUTLOOK_BAND_LABELS: Record<OutlookBand, string> = {
  'en-riesgo': 'En riesgo',
  competitivo: 'Competitivo',
  probable: 'Probable',
  seguro: 'Seguro',
}

export type DistrictElection = {
  year: number
  winner: string
  winnerParty: string
  winnerVotes: number
  second: string
  secondParty: string
  secondVotes: number
  total: number
  sourceUrl: string
  sourceLabel: string
  alternate: boolean
  ceeUrl: string
  ceeStatus: string
}

type HistoryFile = {
  note: string
  districts: Record<string, DistrictElection[]>
}

const HISTORY = historyFile as HistoryFile

export type Outlook = {
  probability: number
  adjustedMargin: number
  margin: number
  swing: number | null
  band: OutlookBand
  flags: OutlookFlag[]
}

export function districtElections(district: number | null): DistrictElection[] {
  if (district == null) return []
  return HISTORY.districts[String(district)] ?? []
}

export function historyNote(): string {
  return HISTORY.note
}

function tokens(value: string): Set<string> {
  return new Set(
    normalize(value)
      .split(' ')
      .filter((token) => token.length > 3 && !STOP.has(token)),
  )
}

export function sameCandidate(left: string, right: string): boolean {
  const a = tokens(left)
  const b = tokens(right)
  let shared = 0
  for (const token of a) if (b.has(token)) shared += 1
  if (shared >= 2) return true
  return shared === 1 && (a.size <= 2 || b.size <= 2)
}

function sigmoid(z: number): number {
  if (z >= 0) return 1 / (1 + Math.exp(-z))
  const ez = Math.exp(z)
  return ez / (1 + ez)
}

function bandOf(probability: number): OutlookBand {
  if (probability >= 85) return 'seguro'
  if (probability >= 70) return 'probable'
  if (probability >= 50) return 'competitivo'
  return 'en-riesgo'
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

export function outlookOf(rep: Representative): Outlook {
  const election = electionFor(rep.id)
  const prior = priorOf(rep.id)
  const tenure = tenureOf(rep)
  const history = districtElections(rep.district)
  const general2024 = history.find((row) => row.year === 2024) ?? null
  const flags: OutlookFlag[] = []

  if (!prior) flags.push('sin-par-2020')
  if (!tenure.cited) flags.push('antiguedad-sin-cita')
  if (election?.event === 'especial-2025') flags.push('especial-d31')
  if (
    rep.district != null &&
    election?.runnerUp &&
    general2024 &&
    !sameCandidate(election.runnerUp, general2024.second)
  ) {
    flags.push('runner-up-no-es-el-segundo')
  }

  let margin = 0
  if (election?.event === 'especial-2025' && general2024 && general2024.total > 0) {
    margin = ((general2024.winnerVotes - general2024.secondVotes) / general2024.total) * 100
  } else if (rep.district == null && election?.votes != null) {
    margin = ((election.votes - FIRST_LOSER_VOTES) / AT_LARGE_TOTAL) * 100
  } else if (election?.margin != null && election.total) {
    margin = (election.margin / election.total) * 100
  }

  const swing =
    prior && election?.pct != null ? round1(election.pct - prior.pct) : null
  const termBonus = tenure.cited
    ? Math.min(OUTLOOK_TERM_CAP, OUTLOOK_TERM * Math.max(0, tenure.count - 1))
    : 0
  const adjusted = margin + (swing ?? 0) * OUTLOOK_SWING + termBonus
  const probability = Math.round(
    (rep.district == null
      ? sigmoid(adjusted / OUTLOOK_AT_LARGE_SCALE)
      : sigmoid(OUTLOOK_A + OUTLOOK_B * adjusted)) * 100,
  )

  return {
    probability,
    adjustedMargin: round1(adjusted),
    margin: round1(margin),
    swing,
    band: bandOf(probability),
    flags,
  }
}

export function rankOutlook(reps: Representative[]): Representative[] {
  return [...reps].sort((a, b) => {
    const left = outlookOf(a)
    const right = outlookOf(b)
    if (left.probability !== right.probability) return left.probability - right.probability
    if (left.margin !== right.margin) return left.margin - right.margin
    return a.name.localeCompare(b.name, 'es')
  })
}
