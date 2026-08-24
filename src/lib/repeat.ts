import { CHAIRS } from '../data/dossiers/commissions'
import { REPEAT_PROFILES } from '../data/repeat-profiles'
import type { RepeatBand, Representative } from '../types'
import { electionFor, formatVotes } from './votes'
import { rolePoints } from './strength'

export const REPEAT_BAND_LABELS: Record<RepeatBand, string> = {
  cerradura: 'cerradura',
  solido: 'sólido',
  posible: 'posible',
  vulnerable: 'vulnerable',
}

export type RepeatRead = {
  score: number
  band: RepeatBand
  since: number | null
  social: string
  socialNote: string
  why: string
  margin: number | null
  pct: number | null
  votes: number | null
  computed: boolean
}

function bandOf(score: number): RepeatBand {
  if (score >= 80) return 'cerradura'
  if (score >= 70) return 'solido'
  if (score >= 55) return 'posible'
  return 'vulnerable'
}

function electoralPoints(rep: Representative): number {
  const election = electionFor(rep.id)
  if (!election) return 8
  if (election.event === 'ley-de-minorias' || election.votes === null) return 10
  if (rep.district === null) {
    if (election.votes >= 150_000) return 28
    if (election.votes >= 85_000) return 20
    if (election.votes >= 70_000) return 14
    return 10
  }
  const margin = election.margin ?? 0
  const pct = election.pct ?? 0
  let marginPts = 2
  if (margin >= 6000) marginPts = 25
  else if (margin >= 4000) marginPts = 20
  else if (margin >= 2500) marginPts = 14
  else if (margin >= 1500) marginPts = 8
  else if (margin >= 800) marginPts = 5
  let pctPts = 3
  if (pct >= 50) pctPts = 20
  else if (pct >= 47) pctPts = 15
  else if (pct >= 44) pctPts = 10
  else if (pct >= 40) pctPts = 6
  if (election.event === 'especial-2025' && margin < 200) return 6
  return marginPts + pctPts
}

function machinePoints(rep: Representative): number {
  const role = rolePoints(rep.role)
  const chairs = CHAIRS[rep.id] ?? []
  const chairPts = chairs.length >= 2 ? 8 : chairs.length === 1 ? 4 : 0
  return Math.min(25, role + chairPts)
}

function computedWhy(rep: Representative, score: number, band: RepeatBand): string {
  const election = electionFor(rep.id)
  if (election?.event === 'ley-de-minorias') {
    return 'Entró por ley de minorías: no hay margen de distrito que cerrar. Repite si el partido vuelve a activar la cláusula.'
  }
  if (rep.district === null && election?.votes != null) {
    return `Acumulación: ${formatVotes(election.votes)} votos en la lista isleña. No hay segundo de distrito.`
  }
  if (election?.margin != null) {
    return `Margen CEE ${formatVotes(election.margin)} · ${election.pct ?? '—'}%. Lectura ${REPEAT_BAND_LABELS[band]} (${score}). Sin ficha de redes citada.`
  }
  return `Sin margen CEE citado. Lectura ${REPEAT_BAND_LABELS[band]} (${score}).`
}

export function repeatOf(rep: Representative): RepeatRead {
  const election = electionFor(rep.id)
  const overlay = REPEAT_PROFILES[rep.id]
  if (overlay) {
    return {
      ...overlay,
      margin: election?.margin ?? null,
      pct: election?.pct ?? null,
      votes: election?.votes ?? null,
      computed: false,
    }
  }
  const score = Math.min(100, electoralPoints(rep) + machinePoints(rep) + 8)
  const band = bandOf(score)
  return {
    score,
    band,
    since: null,
    social: 'Sin handle nominativo citado',
    socialNote: 'No hay cuenta verificada en el análisis. El número sale del CEE y del cargo.',
    why: computedWhy(rep, score, band),
    margin: election?.margin ?? null,
    pct: election?.pct ?? null,
    votes: election?.votes ?? null,
    computed: true,
  }
}

export function rankByRepeat(reps: Representative[]): Representative[] {
  return [...reps].sort((a, b) => {
    const ra = repeatOf(a)
    const rb = repeatOf(b)
    if (rb.score !== ra.score) return rb.score - ra.score
    const roleA = rolePoints(a.role)
    const roleB = rolePoints(b.role)
    if (roleB !== roleA) return roleB - roleA
    const marginA = ra.margin ?? -1
    const marginB = rb.margin ?? -1
    if (marginB !== marginA) return marginB - marginA
    return a.name.localeCompare(b.name, 'es')
  })
}

export function repeatSearchText(rep: Representative): string {
  const read = repeatOf(rep)
  return [read.band, REPEAT_BAND_LABELS[read.band], read.social, read.why, 'repite', '2028'].join(' ')
}
