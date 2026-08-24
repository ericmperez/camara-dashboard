import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { curveOf, formatDelta, rankByCurve } from './curve'
import { priorOf } from './prior'

function byId(id: string) {
  return REPRESENTATIVES.find((rep) => rep.id === id)!
}

describe('curva CEE 2020→2024', () => {
  it('no usa la fila harvest de otra persona', () => {
    expect(priorOf('jose-hernandez-concepcion')).toBeNull()
    expect(priorOf('jose-f-aponte-hernandez')?.name).toMatch(/Aponte Hernández/)
    expect(priorOf('jose-f-aponte-hernandez')?.kind).toBe('acumulacion')
  })

  it('resta Wanda y Higgins en el mismo distrito', () => {
    const wanda = curveOf(byId('wanda-del-valle-correa'))
    expect(wanda.comparable).toBe(true)
    expect(wanda.band).toBe('sube')
    expect(wanda.delta).toBe(14)
    expect(wanda.priorPct).toBe(36.66)
    expect(wanda.nowPct).toBe(50.7)

    const higgins = curveOf(byId('sol-y-higgins-cuadrado'))
    expect(higgins.comparable).toBe(true)
    expect(higgins.band).toBe('baja')
    expect(higgins.delta).toBe(-6.2)
    expect(higgins.priorPct).toBe(49.26)
    expect(higgins.nowPct).toBe(43.1)
  })

  it('deja fuera especial, minorías y Hau (senado 2020)', () => {
    expect(curveOf(byId('roberto-lopez-roman')).band).toBe('sin-par')
    expect(curveOf(byId('adriana-gutierrez-colon')).band).toBe('sin-par')
    expect(curveOf(byId('gretchen-hau')).comparable).toBe(false)
  })

  it('compara acumulación con acumulación', () => {
    const denis = curveOf(byId('denis-marquez-lebron'))
    expect(denis.comparable).toBe(true)
    expect(denis.delta).toBe(4.5)
    expect(denis.priorPct).toBe(10.64)
    expect(denis.nowPct).toBe(15.1)
  })

  it('ordena subidas primero y formatea el delta', () => {
    const ranked = rankByCurve(REPRESENTATIVES)
    expect(ranked[0].id).toBe('wanda-del-valle-correa')
    expect(formatDelta(14)).toBe('+14.0')
    expect(formatDelta(-6.2)).toBe('-6.2')
  })
})
