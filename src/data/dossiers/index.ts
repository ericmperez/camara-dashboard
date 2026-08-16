import type { Dossier, DossierSource } from '../../types'
import { REPRESENTATIVES } from '../representatives'
import { officialSource } from './sources'
import { VERIFIED } from './verified'

function emptyDossier(id: string, official: DossierSource): Dossier {
  return {
    id,
    bio: null,
    career: [],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [official],
  }
}

function mergeOfficial(dossier: Dossier, official: DossierSource): Dossier {
  const hasOfficial = dossier.sources.some((source) => source.url === official.url)
  return {
    ...dossier,
    sources: hasOfficial ? dossier.sources : [...dossier.sources, official],
  }
}

export const DOSSIERS: Record<string, Dossier> = Object.fromEntries(
  REPRESENTATIVES.map((rep) => {
    const official = officialSource(rep.profileUrl, rep.name)
    const verified = VERIFIED[rep.id]
    return [rep.id, verified ? mergeOfficial(verified, official) : emptyDossier(rep.id, official)]
  }),
)

export const DEEP_IDS = new Set(Object.keys(VERIFIED))
