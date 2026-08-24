import { PLAYBOOK, PLAYBOOK_BOOKS } from '../data/playbook'
import type { PlaybookBook, PlaybookEntry } from '../data/playbook'
import type { Representative } from '../types'

const BY_ID = new Map(PLAYBOOK.map((entry) => [entry.id, entry]))

export function playbookOf(id: string): PlaybookEntry | null {
  return BY_ID.get(id) ?? null
}

export function playbookVisible(
  reps: Representative[],
  book: PlaybookBook | 'all' = 'all',
): { rep: Representative; entry: PlaybookEntry }[] {
  const allowed = new Set(reps.map((rep) => rep.id))
  return PLAYBOOK.filter((entry) => allowed.has(entry.id) && (book === 'all' || entry.book === book))
    .map((entry) => {
      const rep = reps.find((item) => item.id === entry.id)
      return rep ? { rep, entry } : null
    })
    .filter((row): row is { rep: Representative; entry: PlaybookEntry } => row !== null)
}

export function playbookSearchText(id: string): string {
  const entry = playbookOf(id)
  if (!entry) return ''
  return [entry.book, entry.popularity, entry.social, entry.said, entry.move, entry.risk ?? ''].join(
    ' ',
  )
}

export { PLAYBOOK_BOOKS }
export type { PlaybookBook, PlaybookEntry }
