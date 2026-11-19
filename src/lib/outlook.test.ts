import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { electionFor } from './votes'
import { outlookOf, rankOutlook, sameCandidate } from './outlook'

function rep(id: string) {
  return REPRESENTATIVES.find((item) => item.id === id)!
}

describe('pronóstico 2028', () => {
  it('reconoce al segundo real aunque el apodo cambie', () => {
    expect(sameCandidate('Pedro Cardona Roig', 'Pedro Cardona Roig (El Urbanista)')).toBe(true)
    expect(sameCandidate('Ana (Ginny) Piñero Parés', 'Pedro Cardona Roig')).toBe(false)
  })

  it('deja a López en riesgo por la general del distrito, no por los 43 votos de la especial', () => {
    const read = outlookOf(rep('roberto-lopez-roman'))
    expect(read.margin).toBe(0.6)
    expect(read.probability).toBe(45)
    expect(read.band).toBe('en-riesgo')
    expect(read.flags).toContain('especial-d31')
    expect(read.flags).toContain('sin-par-2020')
    expect(read.flags).not.toContain('antiguedad-sin-cita')
    expect(electionFor('roberto-lopez-roman')?.margin).toBe(43)
  })

  it('marca a Elinette sin par y sin año, y a Parés con el margen de 1.1', () => {
    const elinette = outlookOf(rep('elinette-gonzalez-aguayo'))
    expect(elinette.probability).toBe(45)
    expect(elinette.flags).toEqual(['sin-par-2020', 'antiguedad-sin-cita'])

    const pares = outlookOf(rep('victor-l-pares-otero'))
    expect(pares.margin).toBe(1.1)
    expect(pares.swing).toBe(1.9)
    expect(pares.probability).toBe(50)
    expect(pares.band).toBe('competitivo')
    expect(pares.flags).not.toContain('runner-up-no-es-el-segundo')
  })

  it('sube a Chino Rey con el swing y deja a Méndez en seguro', () => {
    const chino = outlookOf(rep('ricardo-chino-rey-ocasio-ramos'))
    expect(chino.margin).toBe(1.8)
    expect(chino.swing).toBe(5.4)
    expect(chino.probability).toBe(55)

    const johnny = outlookOf(rep('carlos-johnny-mendez-nunez'))
    expect(johnny.probability).toBe(97)
    expect(johnny.band).toBe('seguro')
    expect(johnny.flags).not.toContain('sin-par-2020')
  })

  it('ordena solo dentro de la lista que le pasen, de menor a mayor', () => {
    const pnp = REPRESENTATIVES.filter((item) => item.party === 'PNP')
    const ranked = rankOutlook(pnp)
    expect(ranked[0]?.id).toBe('roberto-lopez-roman')
    expect(outlookOf(ranked.at(-1)!).band).toBe('seguro')
    expect(ranked.some((item) => item.party !== 'PNP')).toBe(false)
    expect(ranked).toHaveLength(pnp.length)
  })
})
