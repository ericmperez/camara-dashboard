import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { WHIP_STATUSES } from '../types'
import {
  DEFAULT_WHIP_STATUS,
  NEED_FOR_MAJORITY,
  WHIP_STATUS_LABELS,
  defaultStatusFor,
  emptyWhipBoard,
  needForMajority,
  setSeatStatus,
  statusBreakdown,
  yesCount,
} from './whip'

const ids = REPRESENTATIVES.map((r) => r.id)
const NOW = '2026-08-23T12:00:00.000Z'

function boardFor(measure = 'PC1302') {
  return emptyWhipBoard(ids, measure, 'Oficina de Ayuda Vieques y Culebra', NOW)
}

describe('modelo de whip y tally 27/53', () => {
  it('cierra el conjunto de estados; no hay ausente ni auto-sí', () => {
    expect(WHIP_STATUSES).toEqual([
      'no-contactado',
      'voto-que-puedo-coger',
      'indeciso',
      'si',
      'no',
    ])
    expect(DEFAULT_WHIP_STATUS).toBe('no-contactado')
    expect(NEED_FOR_MAJORITY).toBe(27)
    expect(WHIP_STATUS_LABELS.si).toBe('sí')
    expect(WHIP_STATUS_LABELS['voto-que-puedo-coger']).toBe('voto que puedo coger')
  })

  it('abre una medida con 53 asientos en no-contactado, nunca sí por ser PNP', () => {
    const board = boardFor()
    expect(Object.keys(board.seats)).toHaveLength(53)
    expect(ids.every((id) => board.seats[id]?.status === 'no-contactado')).toBe(true)
    expect(ids.every((id) => board.seats[id]?.note === null)).toBe(true)

    const johnny = REPRESENTATIVES.find((r) => r.role === 'Presidente')!
    expect(johnny.party).toBe('PNP')
    expect(board.seats[johnny.id]?.status).toBe('no-contactado')
    expect(defaultStatusFor('PNP')).toBe('no-contactado')
    expect(defaultStatusFor('PPD')).toBe('no-contactado')
    expect(defaultStatusFor('PIP')).toBe('no-contactado')
    expect(defaultStatusFor('PD')).toBe('no-contactado')

    const pnp = REPRESENTATIVES.filter((r) => r.party === 'PNP')
    expect(pnp).toHaveLength(36)
    expect(pnp.every((r) => board.seats[r.id]?.status === 'no-contactado')).toBe(true)
    expect(yesCount(board)).toBe(0)
    expect(needForMajority(board)).toBe(27)
  })

  it('yesCount solo cuenta sí; voto que puedo coger no infla la mayoría', () => {
    let board = boardFor()
    const [a, b, c, d, e] = ids
    board = setSeatStatus(board, a!, 'si', NOW)
    board = setSeatStatus(board, b!, 'si', NOW)
    board = setSeatStatus(board, c!, 'si', NOW)
    board = setSeatStatus(board, d!, 'si', NOW)
    board = setSeatStatus(board, e!, 'si', NOW)
    board = setSeatStatus(board, ids[5]!, 'voto-que-puedo-coger', NOW)
    board = setSeatStatus(board, ids[6]!, 'voto-que-puedo-coger', NOW)
    board = setSeatStatus(board, ids[7]!, 'voto-que-puedo-coger', NOW)
    board = setSeatStatus(board, ids[8]!, 'no', NOW)
    board = setSeatStatus(board, ids[9]!, 'indeciso', NOW)

    expect(yesCount(board)).toBe(5)
    expect(needForMajority(board)).toBe(22)

    const breakdown = statusBreakdown(board)
    expect(breakdown.si).toBe(5)
    expect(breakdown['voto-que-puedo-coger']).toBe(3)
    expect(breakdown.no).toBe(1)
    expect(breakdown.indeciso).toBe(1)
    expect(breakdown['no-contactado']).toBe(43)
    expect(
      breakdown.si +
        breakdown['voto-que-puedo-coger'] +
        breakdown.indeciso +
        breakdown.no +
        breakdown['no-contactado'],
    ).toBe(53)
  })

  it('needForMajority queda en 0 cuando hay 27 o más sí', () => {
    let board = boardFor()
    for (const id of ids.slice(0, 27)) {
      board = setSeatStatus(board, id, 'si', NOW)
    }
    expect(yesCount(board)).toBe(27)
    expect(needForMajority(board)).toBe(0)

    board = setSeatStatus(board, ids[27]!, 'si', NOW)
    expect(yesCount(board)).toBe(28)
    expect(needForMajority(board)).toBe(0)
    expect(statusBreakdown(board)['no-contactado']).toBe(25)
  })
})
