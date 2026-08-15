import votes from '../data/votes.json'
import type { ElectionResult } from '../types'

const BY_ID = votes as Record<string, ElectionResult>

export function electionFor(id: string): ElectionResult | null {
  return BY_ID[id] ?? null
}

export function formatVotes(n: number | null): string {
  if (n === null) return '—'
  return n.toLocaleString('es-PR')
}

export function voteLine(result: ElectionResult): string {
  if (result.event === 'ley-de-minorias' || result.votes === null) {
    return result.note ?? 'Entró por la ley de minorías, no por votos.'
  }
  const parts = [`${formatVotes(result.votes)} votos`]
  if (result.pct !== null) parts.push(`(${result.pct}%)`)
  if (result.margin !== null) parts.push(`ganó por ${formatVotes(result.margin)}`)
  return parts.join(' · ')
}
