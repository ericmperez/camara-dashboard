import harvest from '../data/votes-2020.json'
import { VOTES_2020_MANUAL } from '../data/votes-2020-manual'
import type { PriorVote } from '../types'

const HARVEST = harvest as Record<string, PriorVote>

export function priorOf(id: string): PriorVote | null {
  const manual = VOTES_2020_MANUAL[id]
  if (manual) return manual
  const row = HARVEST[id]
  if (!row || !row.comparable) return null
  return row
}
