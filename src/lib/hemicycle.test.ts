import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { sortRepresentatives } from './filter'
import { ROW_SIZES, layoutHemicycle } from './hemicycle'

describe('hemiciclo', () => {
  it('tiene 53 asientos (8+12+15+18) y uno por representante', () => {
    expect(ROW_SIZES.reduce((sum, n) => sum + n, 0)).toBe(53)
    const seats = layoutHemicycle(sortRepresentatives(REPRESENTATIVES))
    expect(seats).toHaveLength(53)
    expect(new Set(seats.map((s) => s.id)).size).toBe(53)
  })

  it('sienta el distrito 1 a la izquierda del primer banco', () => {
    const seats = layoutHemicycle(sortRepresentatives(REPRESENTATIVES))
    expect(seats[0].rep.district).toBe(1)
    expect(seats[0].x).toBeLessThan(seats[7].x)
  })
})
