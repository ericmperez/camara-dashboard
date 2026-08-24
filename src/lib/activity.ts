import { CHAIRS } from '../data/dossiers/commissions'
import type { Measure, Representative } from '../types'
import { fichaFor } from './dossiers'
import { dossierFor, latestProjects } from './measures'
import { normalize } from './text'

export type ActivityTheme = {
  id: string
  label: string
  count: number
}

export type Activity = {
  headline: string
  line: string
  themes: ActivityTheme[]
  chairs: string[]
  pc: number
  resolutions: number
  latest: Measure[]
  disclaimer: string
}

const DISCLAIMER =
  'Lectura del cargo, las presidencias de comisión y los títulos radicados en SUTRA. No es una entrevista ni un programa de trabajo citado.'

const THEMES: { id: string; label: string; keys: string[] }[] = [
  { id: 'educacion', label: 'educación', keys: ['educacion', 'educativa', 'escuela', 'maestro', 'estudiante', 'universidad'] },
  { id: 'salud', label: 'salud', keys: ['salud', 'hospital', 'medico', 'paciente', 'vapeo'] },
  { id: 'vivienda', label: 'vivienda', keys: ['vivienda', 'inquilino', 'alquiler'] },
  { id: 'municipios', label: 'municipios', keys: ['codigo municipal', 'municipio', 'municipal'] },
  { id: 'hacienda', label: 'hacienda', keys: ['contribucion', 'impuesto', 'hacienda', 'ivu'] },
  { id: 'seguridad', label: 'seguridad', keys: ['policia', 'seguridad publica', 'delito'] },
  { id: 'trabajo', label: 'trabajo', keys: ['asuntos laborales', 'salario', 'empleado publico'] },
  { id: 'retiro', label: 'retiro', keys: ['retiro', 'pension'] },
  { id: 'energia', label: 'energía', keys: ['energia', 'renovable', 'luma'] },
  { id: 'transportacion', label: 'transportación', keys: ['transportacion', 'carretera', 'autopista'] },
  { id: 'agricultura', label: 'agricultura', keys: ['agricultura', 'agricola', 'ganadero'] },
  { id: 'turismo', label: 'turismo', keys: ['turismo', 'hotel', 'hospederia'] },
  { id: 'mujer', label: 'mujer', keys: ['mujer', 'violencia de genero'] },
  { id: 'juventud', label: 'juventud', keys: ['juventud', 'jovenes'] },
  { id: 'veteranos', label: 'veteranos', keys: ['veterano'] },
  { id: 'ambiente', label: 'ambiente', keys: ['recursos naturales', 'ambiental', 'playa'] },
  { id: 'consumidor', label: 'consumidor', keys: ['consumidor'] },
  { id: 'banca', label: 'banca', keys: ['banca', 'banco', 'seguros'] },
  { id: 'etica', label: 'ética y transparencia', keys: ['etica gubernamental', 'transparencia'] },
]

export function listEs(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} y ${items[1]}`
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`
}

export function themesOfTitles(titles: string[], limit = 3): ActivityTheme[] {
  const scored = THEMES.map((theme) => {
    let count = 0
    for (const title of titles) {
      const text = normalize(title)
      if (theme.keys.some((key) => text.includes(key))) count += 1
    }
    return { id: theme.id, label: theme.label, count }
  })
  return scored.filter((theme) => theme.count > 0).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'es')).slice(0, limit)
}

function roleSentence(rep: Representative): string | null {
  if (!rep.role) return null
  if (rep.role === 'Presidente') return 'Preside la Cámara.'
  return `Es ${rep.role}.`
}

function chairSentence(chairs: string[]): string | null {
  if (chairs.length === 0) return null
  if (chairs.length === 1) return `Preside la comisión de ${chairs[0]}.`
  return `Preside las comisiones de ${listEs(chairs)}.`
}

function sutraSentence(pc: number, themes: ActivityTheme[]): string {
  if (pc === 0) return 'SUTRA no le lista proyectos de ley todavía.'
  const noun = pc === 1 ? 'proyecto de ley' : 'proyectos de ley'
  if (themes.length === 0) return `En SUTRA tiene ${pc} ${noun}.`
  return `En SUTRA tiene ${pc} ${noun}, concentrados en ${listEs(themes.map((theme) => theme.label))}.`
}

const BY_ID = new Map<string, Activity>()

export function activityOf(rep: Representative): Activity {
  const cached = BY_ID.get(rep.id)
  if (cached) return cached

  const measures = dossierFor(rep.id)
  const pc = measures?.counts.PC ?? 0
  const resolutions = measures
    ? measures.counts.RC + measures.counts.RCC + measures.counts.RKC
    : 0
  const titles = measures?.projects.map((project) => project.title) ?? []
  const themes = themesOfTitles(titles)
  const chairs = CHAIRS[rep.id] ?? []
  const aspirations = fichaFor(rep.id)?.aspirations ?? []
  const parts = [roleSentence(rep), chairSentence(chairs), sutraSentence(pc, themes)]
  if (aspirations.length > 0) {
    parts.push(`Aspiración citada: ${aspirations[0]}`)
  }
  const headline = parts.filter(Boolean).join(' ')
  const line =
    chairs[0] ??
    (themes[0] ? `${pc} PC · ${themes[0].label}` : pc > 0 ? `${pc} proyectos de ley` : 'Sin proyectos en SUTRA')

  const activity: Activity = {
    headline,
    line,
    themes,
    chairs,
    pc,
    resolutions,
    latest: latestProjects(rep.id, 3),
    disclaimer: DISCLAIMER,
  }
  BY_ID.set(rep.id, activity)
  return activity
}
