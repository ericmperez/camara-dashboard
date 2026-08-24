import type { CurveBand, Representative } from '../types'
import { priorOf } from './prior'
import { electionFor, formatVotes } from './votes'

export const CURVE_BAND_LABELS: Record<CurveBand, string> = {
  sube: 'sube',
  plano: 'plano',
  baja: 'baja',
  'sin-par': 'sin par',
}

export const CURVE_BANNER =
  'Chinas con chinas: el mismo tipo de escaño (distrito con distrito, lista con lista) y el mismo distrito. 2020 es noche del evento (CEE vía Wikipedia); 2024 es el certificado. La especial del 31 y la ley de minorías no entran en la curva. Un % de lista no se resta de un % de pueblo.'

export type CurveRead = {
  comparable: boolean
  band: CurveBand
  delta: number | null
  priorPct: number | null
  nowPct: number | null
  priorVotes: number | null
  nowVotes: number | null
  why: string
  priorSourceUrl: string | null
  priorSourceLabel: string | null
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function bandOf(delta: number): CurveBand {
  if (delta >= 1.5) return 'sube'
  if (delta <= -1.5) return 'baja'
  return 'plano'
}

export function curveOf(rep: Representative): CurveRead {
  const now = electionFor(rep.id)
  const prior = priorOf(rep.id)
  const kind = rep.district === null ? 'acumulacion' : 'distrito'

  if (!now || now.event !== 'generales-2024' || now.pct == null) {
    return {
      comparable: false,
      band: 'sin-par',
      delta: null,
      priorPct: prior?.pct ?? null,
      nowPct: now?.pct ?? null,
      priorVotes: prior?.votes ?? null,
      nowVotes: now?.votes ?? null,
      why:
        now?.event === 'especial-2025'
          ? 'Especial 2025: no hay par 2020 del mismo evento. No se resta un % de generales.'
          : now?.event === 'ley-de-minorias'
            ? 'Entró por ley de minorías: no hay % de pueblo que comparar.'
            : 'Sin general 2024 comparable.',
      priorSourceUrl: prior?.sourceUrl ?? null,
      priorSourceLabel: prior?.sourceLabel ?? null,
    }
  }

  if (!prior) {
    return {
      comparable: false,
      band: 'sin-par',
      delta: null,
      priorPct: null,
      nowPct: now.pct,
      priorVotes: null,
      nowVotes: now.votes,
      why: 'Sin fila 2020 citada de esta persona en este escaño. No se inventa el par.',
      priorSourceUrl: null,
      priorSourceLabel: null,
    }
  }

  const sameKind = prior.kind === kind
  const sameDistrict = kind === 'acumulacion' || prior.district === rep.district
  if (!sameKind || !sameDistrict) {
    return {
      comparable: false,
      band: 'sin-par',
      delta: null,
      priorPct: prior.pct,
      nowPct: now.pct,
      priorVotes: prior.votes,
      nowVotes: now.votes,
      why: 'El 2020 es otro tipo de escaño o otro distrito. No se resta.',
      priorSourceUrl: prior.sourceUrl,
      priorSourceLabel: prior.sourceLabel,
    }
  }

  const delta = round1(now.pct - prior.pct)
  const band = bandOf(delta)
  const sign = delta > 0 ? '+' : ''
  const lost = prior.winner ? '' : ' Perdió 2020; el % sí es de la misma boleta.'
  return {
    comparable: true,
    band,
    delta,
    priorPct: prior.pct,
    nowPct: now.pct,
    priorVotes: prior.votes,
    nowVotes: now.votes,
    why: `${prior.pct}% (${formatVotes(prior.votes)}) → ${now.pct}% (${formatVotes(now.votes)}) · ${sign}${delta} pts.${lost}`,
    priorSourceUrl: prior.sourceUrl,
    priorSourceLabel: prior.sourceLabel,
  }
}

export function rankByCurve(reps: Representative[]): Representative[] {
  return [...reps].sort((a, b) => {
    const ca = curveOf(a)
    const cb = curveOf(b)
    if (ca.comparable !== cb.comparable) return ca.comparable ? -1 : 1
    const da = ca.delta ?? -999
    const db = cb.delta ?? -999
    if (db !== da) return db - da
    return a.name.localeCompare(b.name, 'es')
  })
}

export function formatDelta(delta: number | null): string {
  if (delta == null) return '—'
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}`
}

export function curveSearchText(rep: Representative): string {
  const read = curveOf(rep)
  return [read.band, CURVE_BAND_LABELS[read.band], read.why, 'curva', '2020', '2024'].join(' ')
}
