import medidas from '../data/medidas.json'
import type { Measure, RepMeasures, Representative } from '../types'
import { normalize } from './text'

const BY_ID = medidas as Record<string, RepMeasures>

export function dossierFor(id: string): RepMeasures | null {
  return BY_ID[id] ?? null
}

export function projectsFor(id: string): Measure[] {
  return dossierFor(id)?.projects ?? []
}

export function emptyDossier(id: string): boolean {
  const dossier = dossierFor(id)
  if (!dossier) return true
  return dossier.counts.PC === 0 && dossier.projects.length === 0
}

export function latestProjects(id: string, limit = 4): Measure[] {
  return projectsFor(id).slice(0, limit)
}

const STOP = new Set([
  'para',
  'los',
  'las',
  'del',
  'una',
  'uno',
  'con',
  'por',
  'que',
  'fin',
  'fines',
  'otros',
  'relacionados',
  'enmendar',
  'articulo',
  'ley',
  'num',
  'segun',
  'enmendada',
  'conocida',
  'como',
  'establecer',
  'disponer',
  'anadir',
  'crear',
  'puerto',
  'rico',
])

export function measureSearchText(id: string): string {
  const dossier = dossierFor(id)
  if (!dossier) return ''
  const words = dossier.projects.flatMap((m) =>
    `${m.code} ${m.title}`
      .toLowerCase()
      .replace(/[áéíóúüñ]/g, (ch) => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' })[ch] ?? ch)
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 4 && !STOP.has(w)),
  )
  return words.join(' ')
}

export function matchesMeasureCode(rep: Representative, query: string): boolean {
  const compact = normalize(query).replace(/\s+/g, '')
  if (!/^(pc|rc|rcc|rkc)\d+$/.test(compact)) return false
  return projectsFor(rep.id).some((m) => normalize(m.code) === compact)
}
