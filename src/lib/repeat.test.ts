import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { rankByRepeat, repeatOf } from './repeat'

function rep(id: string) {
  return REPRESENTATIVES.find((item) => item.id === id)!
}

describe('quién está sólido para repetir', () => {
  it('tiene una lectura para cada uno de los 53', () => {
    expect(REPRESENTATIVES).toHaveLength(53)
    for (const member of REPRESENTATIVES) {
      const read = repeatOf(member)
      expect(read.score).toBeGreaterThanOrEqual(0)
      expect(read.score).toBeLessThanOrEqual(100)
      expect(read.why.length).toBeGreaterThan(20)
    }
  })

  it('pone a Méndez primero y a López Román entre los vulnerables', () => {
    const ranked = rankByRepeat(REPRESENTATIVES)
    expect(ranked[0]?.id).toBe('carlos-johnny-mendez-nunez')
    expect(repeatOf(rep('carlos-johnny-mendez-nunez')).band).toBe('cerradura')
    expect(repeatOf(rep('carlos-johnny-mendez-nunez')).social).toMatch(/JohnnyMndez36/)

    const lopez = repeatOf(rep('roberto-lopez-roman'))
    expect(lopez.band).toBe('vulnerable')
    expect(lopez.margin).toBe(43)
  })

  it('marca a Hau como la popular de distrito del análisis y no cierra a Adriana', () => {
    const hau = repeatOf(rep('gretchen-hau'))
    expect(hau.score).toBe(64)
    expect(hau.why).toMatch(/Cayey/)

    const adriana = repeatOf(rep('adriana-gutierrez-colon'))
    expect(adriana.computed).toBe(true)
    expect(adriana.why).toMatch(/ley de minorías/i)
    expect(adriana.band).not.toBe('cerradura')
  })

  it('usa el margen CEE vivo, no un número inventado', () => {
    const navarro = repeatOf(rep('jorge-navarro-suarez'))
    expect(navarro.margin).toBe(8102)
    expect(navarro.pct).toBe(48.1)
    expect(rankByRepeat(REPRESENTATIVES).map((item) => item.id)).toContain(
      'yashira-lebron-rodriguez',
    )
  })
})
