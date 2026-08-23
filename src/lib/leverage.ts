import { CHAIRS } from '../data/dossiers/commissions'
import type {
  DossierConnection,
  Party,
  Representative,
  WhipBoard,
  WhipStatus,
} from '../types'
import { fichaFor, townOverlapConnections } from './dossiers'
import { PARTY_META } from './profile'
import type { Bloc } from './profile'
import { electionFor, formatVotes } from './votes'
import { statusOf } from './whip'

export type LeverageCee =
  | { kind: 'margen'; margin: number; pct: number | null; votes: number }
  | { kind: 'sin-voto'; note: string }

export type Leverage = {
  party: Party
  bloc: Bloc
  role: string | null
  chairs: string[]
  cee: LeverageCee
  factCoauthors: DossierConnection[]
  townOverlap: DossierConnection[]
}

export function leverageOf(rep: Representative): Leverage {
  const election = electionFor(rep.id)
  const cee: LeverageCee =
    !election || election.votes === null || election.event === 'ley-de-minorias'
      ? {
          kind: 'sin-voto',
          note: election?.note ?? 'Entró por la ley de minorías, no por votos.',
        }
      : {
          kind: 'margen',
          margin: election.margin ?? 0,
          pct: election.pct,
          votes: election.votes,
        }
  const facts = (fichaFor(rep.id)?.connections ?? []).filter(
    (connection) => connection.kind === 'fact',
  )
  return {
    party: rep.party,
    bloc: PARTY_META[rep.party].bloc,
    role: rep.role,
    chairs: CHAIRS[rep.id] ?? [],
    cee,
    factCoauthors: facts,
    townOverlap: townOverlapConnections(rep.id),
  }
}

export function ceeLeverageLine(cee: LeverageCee): string {
  if (cee.kind === 'sin-voto') return `sin-voto — ${cee.note}`
  const pct = cee.pct !== null ? ` · ${cee.pct}%` : ''
  return `margen ${formatVotes(cee.margin)}${pct}`
}

function statusRank(status: WhipStatus): number {
  if (status === 'voto-que-puedo-coger') return 0
  if (status === 'indeciso') return 1
  if (status === 'no-contactado') return 2
  return 3
}

function marginKey(cee: LeverageCee): number {
  return cee.kind === 'margen' ? cee.margin : Number.POSITIVE_INFINITY
}

/** Cola sugerida. El solape de pueblos no entra al orden. */
export function rankGettable(
  reps: Representative[],
  board: WhipBoard,
): Representative[] {
  return [...reps].sort((a, b) => {
    const rankA = statusRank(statusOf(board, a.id))
    const rankB = statusRank(statusOf(board, b.id))
    if (rankA !== rankB) return rankA - rankB
    const la = leverageOf(a)
    const lb = leverageOf(b)
    if (la.factCoauthors.length !== lb.factCoauthors.length) {
      return lb.factCoauthors.length - la.factCoauthors.length
    }
    const marginA = marginKey(la.cee)
    const marginB = marginKey(lb.cee)
    if (marginA !== marginB) return marginA - marginB
    return a.name.localeCompare(b.name, 'es')
  })
}
