import { describe, expect, it } from 'vitest'
import oce from '../data/oce.json'
import { REPRESENTATIVES } from '../data/representatives'
import { formatUsd, oceBalancesUrl, oceFor, oceNote } from './oce'

describe('recaudos OCE', () => {
  it('no presenta el tablero Power BI como si fuera un balance descargado', () => {
    expect(oceNote()).toMatch(/Power BI/)
    expect(oceNote()).toMatch(/No es el balance acumulado/)
    expect(oceBalancesUrl()).toBe(
      'https://oce.pr.gov/comites-activos/balances-de-ingresos-y-gastos/',
    )
    expect(oce.ambiguous).toEqual([])
    expect(oce.unmatched).toEqual([])
  })

  it('empareja a cada PNP con el informe público más reciente de su comité', () => {
    const pnp = REPRESENTATIVES.filter((rep) => rep.party === 'PNP')
    expect(Object.keys(oce.byId)).toHaveLength(pnp.length)
    for (const rep of pnp) {
      const report = oceFor(rep.id)
      expect(report, rep.id).toBeTruthy()
      expect(report?.sourceUrl).toMatch(/serviciosenlinea\.oce\.pr\.gov/)
      expect(report?.reportNumber).toMatch(/^IG-/)
      expect(Number.isFinite(report?.income)).toBe(true)
      expect(Number.isFinite(report?.expenses)).toBe(true)
    }
    const johnny = oceFor('carlos-johnny-mendez-nunez')!
    expect(johnny.committeeName).toMatch(/JOHNNY MENDEZ/)
    expect(johnny.reportNumber).toBe('IG-2026-01632')
    expect(johnny.income).toBe(41970)
    expect(johnny.expenses).toBe(10858.32)
    expect(formatUsd(johnny.income)).toBe('$41,970.00')
  })

  it('no inventa recaudos para quien no es del PNP', () => {
    expect(oceFor('hector-e-ferrer-santiago')).toBeNull()
    expect(oceFor('denis-marquez-lebron')).toBeNull()
  })
})
