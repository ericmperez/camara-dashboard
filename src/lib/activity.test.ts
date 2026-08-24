import { describe, expect, it } from 'vitest'
import { CHAIRS } from '../data/dossiers/commissions'
import { REPRESENTATIVES } from '../data/representatives'
import { activityOf, listEs, themesOfTitles } from './activity'

function rep(id: string) {
  return REPRESENTATIVES.find((item) => item.id === id)!
}

describe('lectura de lo que está haciendo cada escaño', () => {
  it('lista en español con y', () => {
    expect(listEs(['educación'])).toBe('educación')
    expect(listEs(['salud', 'vivienda'])).toBe('salud y vivienda')
    expect(listEs(['salud', 'vivienda', 'municipios'])).toBe('salud, vivienda y municipios')
  })

  it('cuenta temas solo cuando el título los nombra', () => {
    const themes = themesOfTitles([
      'Para enmendar la Ley de Educación',
      'Para destinar fondos a las escuelas públicas',
      'Para crear un impuesto municipal',
    ])
    expect(themes.map((theme) => theme.id)).toEqual(['educacion', 'hacienda', 'municipios'])
    expect(themes[0]?.count).toBe(2)
  })

  it('tiene una lectura para cada uno de los 53, sin inventar proyectos', () => {
    expect(REPRESENTATIVES).toHaveLength(53)
    for (const member of REPRESENTATIVES) {
      const activity = activityOf(member)
      expect(activity.headline.length).toBeGreaterThan(20)
      expect(activity.line.length).toBeGreaterThan(2)
      expect(activity.disclaimer).toMatch(/SUTRA/)
      expect(activity.pc).toBeGreaterThanOrEqual(0)
      expect(activity.chairs).toEqual(CHAIRS[member.id] ?? [])
    }
  })

  it('nombra el cargo de Méndez y la presidencia de Educación de Pérez', () => {
    const johnny = activityOf(rep('carlos-johnny-mendez-nunez'))
    expect(johnny.headline).toMatch(/preside la cámara/i)
    expect(johnny.pc).toBeGreaterThan(0)
    expect(johnny.headline).toMatch(/SUTRA/)

    const tatiana = activityOf(rep('tatiana-perez-ramirez'))
    expect(tatiana.chairs).toContain('Educación')
    expect(tatiana.headline).toMatch(/educación/i)
    expect(tatiana.line).toMatch(/educación/i)
  })

  it('no marca presidencia de comisión a quien no está en CHAIRS', () => {
    const johnny = activityOf(rep('carlos-johnny-mendez-nunez'))
    expect(johnny.chairs).toEqual([])
    expect(johnny.headline).not.toMatch(/preside la comisión/i)
  })
})
