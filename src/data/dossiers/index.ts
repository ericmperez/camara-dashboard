import type { Dossier, DossierSource } from '../../types'
import { REPRESENTATIVES } from '../representatives'
import { CHAIRS, COMMISSION_SOURCES } from './commissions'
import { EXTRAS } from './extras'
import { officialSource, SRC } from './sources'
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

function mergeSources(base: DossierSource[], extra: DossierSource[]): DossierSource[] {
  const seen = new Set(base.map((source) => source.url))
  const out = [...base]
  for (const source of extra) {
    if (seen.has(source.url)) continue
    seen.add(source.url)
    out.push(source)
  }
  return out
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

function applyCommissions(dossier: Dossier): Dossier {
  const chairs = CHAIRS[dossier.id]
  if (!chairs?.length) return dossier
  const extraSources =
    dossier.id === 'roberto-lopez-roman'
      ? [...COMMISSION_SOURCES, SRC.camaraTrabajo]
      : COMMISSION_SOURCES
  return {
    ...dossier,
    committees: unique([...dossier.committees, ...chairs]),
    sources: mergeSources(dossier.sources, extraSources),
  }
}

function applyExtras(dossier: Dossier): Dossier {
  const extra = EXTRAS[dossier.id]
  if (!extra) return dossier
  return {
    ...dossier,
    bio: dossier.bio ?? extra.bio ?? null,
    career: unique([...dossier.career, ...(extra.career ?? [])]),
    aspirations: unique([...dossier.aspirations, ...(extra.aspirations ?? [])]),
    committees: unique([...dossier.committees, ...(extra.committees ?? [])]),
    connections: [...dossier.connections, ...(extra.connections ?? [])],
    sources: mergeSources(dossier.sources, extra.sources ?? []),
  }
}

function mergeOfficial(dossier: Dossier, official: DossierSource): Dossier {
  return {
    ...dossier,
    sources: mergeSources(dossier.sources, [official]),
  }
}

export const DOSSIERS: Record<string, Dossier> = Object.fromEntries(
  REPRESENTATIVES.map((rep) => {
    const official = officialSource(rep.profileUrl, rep.name)
    const base = VERIFIED[rep.id] ?? emptyDossier(rep.id, official)
    return [rep.id, applyCommissions(applyExtras(mergeOfficial(base, official)))]
  }),
)

/** Forma delgada (CEE + 3 Autores=1 + conexiones). No cuenta como ficha profunda. */
const THIN_IDS = new Set([
  'odalys-gonzalez-gonzalez',
  'lilibeth-lilly-rosas',
  'emilio-carlo-acosta',
  'omayra-m-martinez-vazquez',
  'joe-joito-colon-rodriguez',
  'ensol-a-rodriguez-torres',
  'angel-a-fourquet-cordero',
  'luis-josean-jimenez-torres',
  'estrella-martinez-soto',
])

export const DEEP_IDS = new Set(Object.keys(VERIFIED).filter((id) => !THIN_IDS.has(id)))
