import { DOSSIERS } from '../data/dossiers'
import { REPRESENTATIVES } from '../data/representatives'
import type { Dossier, DossierConnection, Representative } from '../types'

const BY_ID = new Map(REPRESENTATIVES.map((rep) => [rep.id, rep]))

export function fichaFor(id: string): Dossier | null {
  return DOSSIERS[id] ?? null
}

export function repById(id: string): Representative | null {
  return BY_ID.get(id) ?? null
}

export function townOverlapConnections(id: string): DossierConnection[] {
  const me = BY_ID.get(id)
  if (!me || me.municipalities.length === 0) return []
  const mine = new Set(me.municipalities)
  const out: DossierConnection[] = []
  for (const other of REPRESENTATIVES) {
    if (other.id === id) continue
    const shared = other.municipalities.filter((town) => mine.has(town))
    if (shared.length === 0) continue
    out.push({
      toId: other.id,
      kind: 'inference',
      label: `Pueblos en común: ${shared.join(', ')}`,
      note: 'Inferencia por solape de municipios en el directorio. No implica alianza ni trato.',
      sources: [],
    })
  }
  return out
}

export function connectionsOf(id: string): DossierConnection[] {
  const dossier = fichaFor(id)
  const facts = dossier?.connections ?? []
  return [...facts, ...townOverlapConnections(id)]
}

export function dossierSearchText(id: string): string {
  const dossier = fichaFor(id)
  if (!dossier) return ''
  return [
    dossier.bio ?? '',
    ...dossier.career,
    ...dossier.aspirations,
    ...dossier.committees,
    ...dossier.connections.map((c) => c.label),
  ].join(' ')
}

export function hasVerifiedBody(dossier: Dossier): boolean {
  return Boolean(
    dossier.bio ||
      dossier.career.length ||
      dossier.aspirations.length ||
      dossier.committees.length ||
      dossier.connections.length,
  )
}
