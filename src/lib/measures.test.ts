import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import {
  dossierFor,
  emptyDossier,
  latestProjects,
  matchesMeasureCode,
  projectsFor,
} from './measures'

describe('proyectos de SUTRA', () => {
  it('tiene ficha de SUTRA para los 53, incluido el titular vigente del 31', () => {
    for (const rep of REPRESENTATIVES) {
      const dossier = dossierFor(rep.id)
      expect(dossier, rep.id).toBeTruthy()
      expect(dossier!.sutraUrl).toMatch(/^https:\/\/sutra\.oslpr\.org\/legisladores\//)
      expect(emptyDossier(rep.id)).toBe(false)
    }
    const d31 = REPRESENTATIVES.find((r) => r.district === 31)!
    expect(d31.id).toBe('roberto-lopez-roman')
    expect(projectsFor(d31.id).length).toBeGreaterThan(0)
  })

  it('separa proyectos de ley (PC) de resoluciones', () => {
    const johnny = dossierFor('carlos-johnny-mendez-nunez')!
    expect(johnny.counts.PC).toBe(johnny.projects.length)
    expect(johnny.projects.every((m) => m.code.startsWith('PC'))).toBe(true)
    expect(johnny.counts.RC + johnny.counts.RCC + johnny.counts.RKC).toBeGreaterThan(0)
    expect(johnny.projects[0]?.title.length).toBeGreaterThan(20)
    expect(johnny.projects[0]?.title).not.toMatch(/class=/)
  })

  it('latestProjects recorta y no inventa si el id no existe', () => {
    expect(latestProjects('no-existe')).toEqual([])
    expect(dossierFor('no-existe')).toBeNull()
    const few = latestProjects('eddie-charbonier-chinea', 3)
    expect(few.length).toBeLessThanOrEqual(3)
  })

  it('encuentra al autor por número de proyecto, no por coincidencia parcial de distrito', () => {
    const sample = projectsFor('jose-e-torres-zamora')[0]
    expect(sample).toBeTruthy()
    const hit = REPRESENTATIVES.filter((r) => matchesMeasureCode(r, sample!.code))
    expect(hit.some((r) => r.id === 'jose-e-torres-zamora')).toBe(true)
    expect(matchesMeasureCode(REPRESENTATIVES[0]!, 'xyz')).toBe(false)
  })
})
