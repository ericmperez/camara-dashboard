import type { Party, Representative } from '../types'
import { dossierFor } from './measures'
import { electionFor } from './votes'

export type StrengthBand = 'alto' | 'medio' | 'bajo' | 'sin-voto'

export type Strength = {
  electoral: number | null
  activity: number
  role: number
  total: number
  band: StrengthBand
  projects: number
  colorLabel: string
}

export const PARTY_COLOR: Record<Party, string> = {
  PNP: 'Azul',
  PPD: 'Rojo',
  PIP: 'Verde',
  PD: 'Celeste',
}

export function rolePoints(role: string | null): number {
  if (!role) return 0
  const text = role.toLowerCase()
  if (text === 'presidente') return 15
  if (text.startsWith('vice')) return 12
  if (text.includes('altern')) return 6
  if (text.includes('portavoz')) return 10
  return 0
}

export function maxProjectCount(ids: string[]): number {
  return ids.reduce((max, id) => {
    const count = dossierFor(id)?.counts.PC ?? 0
    return count > max ? count : max
  }, 0)
}

export function activityPoints(projects: number, maxProjects: number): number {
  if (maxProjects <= 0 || projects <= 0) return 0
  return Math.round((35 * Math.log(1 + projects)) / Math.log(1 + maxProjects))
}

export function electoralPoints(id: string): number | null {
  const result = electionFor(id)
  if (!result || result.votes === null) return null
  const pct =
    result.pct ??
    (result.total && result.total > 0 ? (100 * result.votes) / result.total : null)
  if (pct === null) return null
  return Math.min(50, Math.max(0, Math.round(pct)))
}

export function strengthOf(rep: Representative, maxProjects: number): Strength {
  const projects = dossierFor(rep.id)?.counts.PC ?? 0
  const electoral = electoralPoints(rep.id)
  const activity = activityPoints(projects, maxProjects)
  const role = rolePoints(rep.role)
  const total = (electoral ?? 0) + activity + role
  const band: StrengthBand =
    electoral === null ? 'sin-voto' : total >= 70 ? 'alto' : total >= 45 ? 'medio' : 'bajo'
  return {
    electoral,
    activity,
    role,
    total,
    band,
    projects,
    colorLabel: PARTY_COLOR[rep.party],
  }
}

export function rankByStrength(
  reps: Representative[],
  maxProjects: number,
): Representative[] {
  return [...reps].sort((a, b) => {
    const sa = strengthOf(a, maxProjects)
    const sb = strengthOf(b, maxProjects)
    if (sb.total !== sa.total) return sb.total - sa.total
    if (sb.projects !== sa.projects) return sb.projects - sa.projects
    return a.name.localeCompare(b.name, 'es')
  })
}
