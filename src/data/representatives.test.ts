import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from './representatives'
import { countByParty } from '../lib/filter'

describe('roster oficial 2025–2028', () => {
  it('tiene 53 representantes (40 distrito + 13 acumulación, ley de minorías)', () => {
    expect(REPRESENTATIVES).toHaveLength(53)
    expect(REPRESENTATIVES.filter((r) => r.district !== null)).toHaveLength(40)
    expect(REPRESENTATIVES.filter((r) => r.district === null)).toHaveLength(13)
  })

  it('cubre cada distrito 1–40 una sola vez', () => {
    const districts = REPRESENTATIVES.map((r) => r.district).filter(
      (d): d is number => d !== null,
    )
    expect(new Set(districts).size).toBe(40)
    expect(Math.min(...districts)).toBe(1)
    expect(Math.max(...districts)).toBe(40)
  })

  it('no repite ids ni nombres canónicos', () => {
    const ids = REPRESENTATIVES.map((r) => r.id)
    const names = REPRESENTATIVES.map((r) => r.name)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(names).size).toBe(names.length)
  })

  it('compone la Cámara PNP 36 / PPD 13 / PIP 3 / PD 1', () => {
    expect(countByParty(REPRESENTATIVES)).toEqual({
      PNP: 36,
      PPD: 13,
      PIP: 3,
      PD: 1,
    })
  })

  it('lista al presidente actual del distrito 36', () => {
    const president = REPRESENTATIVES.find((r) => r.role === 'Presidente')
    expect(president?.name).toMatch(/Méndez/)
    expect(president?.district).toBe(36)
    expect(president?.party).toBe('PNP')
  })

  it('refleja el titular vigente del distrito 31, no el electo original', () => {
    const d31 = REPRESENTATIVES.find((r) => r.district === 31)
    expect(d31?.name).toMatch(/López Román/)
    expect(d31?.name).not.toMatch(/Vilmarie/)
  })

  it('permite email o teléfono ausentes sin romper el directorio', () => {
    const missingEmail = REPRESENTATIVES.filter((r) => r.email === null)
    expect(missingEmail.length).toBeGreaterThan(0)
    expect(missingEmail.every((r) => r.phone !== null || r.profileUrl.length > 0)).toBe(
      true,
    )
    expect(REPRESENTATIVES.every((r) => r.phone !== null || r.email !== null)).toBe(true)
  })

  it('usa partidos válidos y URLs del sitio oficial', () => {
    for (const rep of REPRESENTATIVES) {
      expect(['PNP', 'PPD', 'PIP', 'PD']).toContain(rep.party)
      expect(rep.profileUrl).toMatch(/^https:\/\/www\.camara\.pr\.gov\//)
      if (rep.photoUrl) {
        expect(rep.photoUrl).toMatch(/^https:\/\/www\.camara\.pr\.gov\//)
      }
    }
  })
})
