import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { blocksFromAssumed, tenureOf } from './tenure'

function byId(id: string) {
  return REPRESENTATIVES.find((rep) => rep.id === id)!
}

describe('cuatrienios', () => {
  it('parte el primer bloque en el año de asunción', () => {
    expect(blocksFromAssumed(2014).map((b) => b.label)).toEqual([
      '2014–2016',
      '2017–2020',
      '2021–2024',
      '2025–2028',
    ])
    expect(blocksFromAssumed(1998)[0].label).toBe('1998–2000')
    expect(blocksFromAssumed(2023).map((b) => b.label)).toEqual(['2023–2024', '2025–2028'])
  })

  it('cuenta a Navarro desde 2005 y no inventa a quien no tiene año', () => {
    const navarro = tenureOf(byId('jorge-navarro-suarez'))
    expect(navarro.cited).toBe(true)
    expect(navarro.assumed).toBe(2005)
    expect(navarro.count).toBe(6)
    expect(navarro.blocks[0].label).toBe('2005–2008')
    expect(navarro.blocks.at(-1)?.current).toBe(true)

    const random = tenureOf(byId('felix-pacheco-burgos'))
    expect(random.cited).toBe(false)
    expect(random.count).toBe(1)
    expect(random.blocks[0].label).toBe('2025–2028')
  })
})
