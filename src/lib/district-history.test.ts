import { describe, expect, it } from 'vitest'
import history from '../data/district-history.json'
import { districtElections } from './outlook'

describe('tres escrutinios por distrito', () => {
  it('cubre 40 distritos con 2024, 2020 y 2016', () => {
    expect(history.events).toEqual([2024, 2020, 2016])
    expect(Object.keys(history.districts)).toHaveLength(40)
    for (const number of Object.keys(history.districts)) {
      const years = history.districts[number as keyof typeof history.districts].map((row) => row.year)
      expect(years).toEqual([2024, 2020, 2016])
    }
  })

  it('marca 2024 como alterna porque el XML de distrito dio 404, y 2016/2020 salen de la CEE', () => {
    expect(history.ceeProbe['2024'].status).toBe('HTTP 404')
    expect(history.ceeProbe['2024'].alternate).toBe(true)
    expect(history.ceeProbe['2020'].status).toMatch(/TLS vencido/)
    expect(history.ceeProbe['2016'].status).toMatch(/TLS vencido/)
    expect(history.ceeProbe['2020'].alternate).toBe(false)
    expect(history.ceeProbe['2016'].alternate).toBe(false)

    const d1 = districtElections(1)
    expect(d1[0]?.alternate).toBe(true)
    expect(d1[0]?.second).toMatch(/Cardona Roig/)
    expect(d1[1]?.alternate).toBe(false)
    expect(d1[1]?.sourceUrl).toMatch(/elecciones2020\.ceepur\.org/)
    expect(d1[2]?.sourceUrl).toMatch(/elecciones2016\.ceepur\.org/)
  })

  it('no confunde la general 2024 del distrito 31 con la especial de López', () => {
    const [general] = districtElections(31)
    expect(general?.year).toBe(2024)
    expect(general?.winner).toMatch(/Peña Dávila/)
    expect(general?.winnerVotes).toBe(10962)
    expect(general?.second).toMatch(/Santa/)
    expect(general?.winner).not.toMatch(/López/)
  })
})
