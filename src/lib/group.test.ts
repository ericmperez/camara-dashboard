import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { countDistrictsByParty, groupByParty, splitDistrictsByParty } from './group'

describe('los 40 de distrito por partido', () => {
  it('parte 30 PNP, 10 populares, 0 PIP y 0 Proyecto Dignidad', () => {
    expect(countDistrictsByParty(REPRESENTATIVES)).toEqual({
      PNP: 30,
      PPD: 10,
      PIP: 0,
      PD: 0,
    })
  })

  it('deja visibles los partidos sin escaño de distrito (no los esconde)', () => {
    const groups = splitDistrictsByParty(REPRESENTATIVES)
    expect(groups.map((g) => g.party)).toEqual(['PNP', 'PPD', 'PIP', 'PD'])
    expect(groups.find((g) => g.party === 'PIP')?.members).toEqual([])
    expect(groups.find((g) => g.party === 'PD')?.members).toEqual([])
  })

  it('no cuela a los de acumulación en el lote de los 40', () => {
    const districtIds = new Set(
      splitDistrictsByParty(REPRESENTATIVES).flatMap((g) => g.members.map((m) => m.id)),
    )
    expect(districtIds.size).toBe(40)
    expect(districtIds.has('hector-e-ferrer-santiago')).toBe(false)
    expect(districtIds.has('denis-marquez-lebron')).toBe(false)
    expect(districtIds.has('lisie-j-burgos-muniz')).toBe(false)
  })

  it('ordena cada bloque por número de distrito', () => {
    const pnp = splitDistrictsByParty(REPRESENTATIVES).find((g) => g.party === 'PNP')!
    expect(pnp.members[0].district).toBe(1)
    expect(pnp.members.every((rep, i, list) => i === 0 || (rep.district ?? 0) > (list[i - 1].district ?? 0))).toBe(
      true,
    )
  })
})

describe('groupByParty del directorio completo', () => {
  it('omite partidos vacíos cuando se filtra', () => {
    const onlyPip = REPRESENTATIVES.filter((r) => r.party === 'PIP')
    const groups = groupByParty(onlyPip)
    expect(groups).toHaveLength(1)
    expect(groups[0]?.party).toBe('PIP')
    expect(groups[0]?.members).toHaveLength(3)
  })
})
