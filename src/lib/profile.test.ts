import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { PARTY_META, politicalProfile } from './profile'

describe('perfil político', () => {
  it('asigna la línea de estatus del partido, no un invento personal', () => {
    const johnny = REPRESENTATIVES.find((r) => r.id.includes('mendez'))!
    const fourquet = REPRESENTATIVES.find((r) => r.id.includes('fourquet'))!
    const denis = REPRESENTATIVES.find((r) => r.id.includes('marquez'))!
    const lisie = REPRESENTATIVES.find((r) => r.id.includes('burgos'))!

    expect(politicalProfile(johnny).statusLabel).toBe('Estadidad')
    expect(politicalProfile(johnny).bloc).toBe('mayoría')
    expect(politicalProfile(johnny).text).toMatch(/Preside la Cámara/)

    expect(politicalProfile(fourquet).colloquial).toBe('populares')
    expect(politicalProfile(fourquet).statusLabel).toBe('ELA / autonomismo')
    expect(politicalProfile(fourquet).text).toMatch(/Distrito 24/)

    expect(politicalProfile(denis).statusLabel).toBe('Independencia')
    expect(politicalProfile(lisie).statusLabel).toBe('Conservadurismo social')
  })

  it('distingue distrito vs acumulación en el texto', () => {
    const eddie = REPRESENTATIVES.find((r) => r.district === 1)!
    const ferrer = REPRESENTATIVES.find((r) => r.id.includes('ferrer'))!
    expect(politicalProfile(eddie).text).toMatch(/Titular del Distrito 1/)
    expect(politicalProfile(ferrer).text).toMatch(/acumulación/)
    expect(politicalProfile(ferrer).text).not.toMatch(/Titular del Distrito/)
  })

  it('cubre a los 53 sin texto vacío', () => {
    for (const rep of REPRESENTATIVES) {
      const profile = politicalProfile(rep)
      expect(profile.text.length).toBeGreaterThan(40)
      expect(profile.partyName).toBe(PARTY_META[rep.party].name)
    }
  })

  it('no clasifica a un popular como estadista por dato parcial', () => {
    const populares = REPRESENTATIVES.filter((r) => r.party === 'PPD')
    expect(populares.every((r) => politicalProfile(r).statusLabel === 'ELA / autonomismo')).toBe(
      true,
    )
    expect(populares.every((r) => !politicalProfile(r).text.includes('sea un estado de Estados Unidos'))).toBe(
      true,
    )
  })
})
