import { describe, expect, it } from 'vitest'
import { CHAIRS } from '../data/dossiers/commissions'
import { REPRESENTATIVES } from '../data/representatives'
import { emptyWhipBoard, setSeatStatus } from './whip'
import { ceeLeverageLine, leverageOf, rankGettable } from './leverage'

function rep(id: string) {
  return REPRESENTATIVES.find((r) => r.id === id)!
}

describe('palanca pública (sin alianza de pueblos)', () => {
  it('lee partido, cargo, CHAIRS, margen CEE y coautorías HECHO', () => {
    const zamora = leverageOf(rep('jose-e-torres-zamora'))
    expect(zamora.party).toBe('PNP')
    expect(zamora.bloc).toBe('mayoría')
    expect(zamora.role).toMatch(/Portavoz/)
    expect(zamora.chairs).toEqual(CHAIRS['jose-e-torres-zamora'])
    expect(zamora.chairs).toContain('Calendario y Reglas Especiales de Debate')
    expect(zamora.cee.kind).toBe('margen')

    const johnny = leverageOf(rep('carlos-johnny-mendez-nunez'))
    expect(johnny.role).toBe('Presidente')
    expect(johnny.chairs).toEqual([])
    expect(johnny.factCoauthors.length).toBeGreaterThan(0)
    expect(johnny.factCoauthors.every((c) => c.kind === 'fact')).toBe(true)
    expect(johnny.factCoauthors.every((c) => c.sources.length > 0)).toBe(true)
  })

  it('marca sin-voto a quien entró por ley de minorías y no inventa %', () => {
    const adriana = leverageOf(rep('adriana-gutierrez-colon'))
    expect(adriana.party).toBe('PIP')
    expect(adriana.bloc).toBe('minoría')
    expect(adriana.cee.kind).toBe('sin-voto')
    if (adriana.cee.kind === 'sin-voto') {
      expect(adriana.cee.note).toMatch(/ley de minorías/i)
    }
    expect(ceeLeverageLine(adriana.cee)).toMatch(/^sin-voto/)
    expect(ceeLeverageLine(adriana.cee)).not.toMatch(/%/)
  })

  it('deja el solape de pueblos como INFERENCIA, no alianza', () => {
    const lopez = leverageOf(rep('roberto-lopez-roman'))
    expect(lopez.chairs).toEqual(['Trabajo y Asuntos Laborales'])
    expect(lopez.cee.kind).toBe('margen')
    if (lopez.cee.kind === 'margen') expect(lopez.cee.margin).toBe(43)
    expect(lopez.townOverlap.length).toBeGreaterThan(0)
    expect(lopez.townOverlap.every((c) => c.kind === 'inference')).toBe(true)
    expect(lopez.townOverlap.every((c) => c.sources.length === 0)).toBe(true)
    expect(lopez.townOverlap.every((c) => /no implica alianza/i.test(c.note ?? ''))).toBe(
      true,
    )
    expect(lopez.factCoauthors).toEqual([])
  })

  it('un PPD muestra partido de minoría y hechos citados, no presidencia', () => {
    const varela = leverageOf(rep('jose-conny-varela'))
    expect(varela.party).toBe('PPD')
    expect(varela.bloc).toBe('minoría')
    expect(varela.chairs).toEqual([])
    expect(varela.cee.kind).toBe('margen')
    expect(varela.factCoauthors.map((c) => c.toId)).toContain('carlos-johnny-mendez-nunez')
    expect(varela.factCoauthors.every((c) => c.kind === 'fact')).toBe(true)
  })

  it('la cola gettable no ordena por pueblos en común', () => {
    const johnny = rep('carlos-johnny-mendez-nunez')
    const lopez = rep('roberto-lopez-roman')
    const ids = REPRESENTATIVES.map((r) => r.id)
    let board = emptyWhipBoard(ids, 'PC1302')
    board = setSeatStatus(board, lopez.id, 'voto-que-puedo-coger')
    board = setSeatStatus(board, johnny.id, 'voto-que-puedo-coger')

    const ranked = rankGettable([lopez, johnny], board)
    expect(ranked.map((r) => r.id)).toEqual([johnny.id, lopez.id])
    expect(leverageOf(lopez).townOverlap.length).toBeGreaterThan(0)
    expect(leverageOf(johnny).factCoauthors.length).toBeGreaterThan(
      leverageOf(lopez).factCoauthors.length,
    )
  })
})
