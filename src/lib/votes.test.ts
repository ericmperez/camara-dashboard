import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import report from '../data/harvest-report.json'
import { electionFor, formatVotes, voteLine } from './votes'

describe('votos de la CEE', () => {
  it('tiene resultado para los 53', () => {
    for (const rep of REPRESENTATIVES) {
      expect(electionFor(rep.id), rep.id).toBeTruthy()
    }
  })

  it('usa la especial del 31, no los votos de Vilmarie Peña', () => {
    const d31 = electionFor('roberto-lopez-roman')!
    expect(d31.event).toBe('especial-2025')
    expect(d31.votes).toBe(677)
    expect(d31.runnerUpVotes).toBe(634)
    expect(d31.margin).toBe(43)
    expect(d31.votes).not.toBe(10962)
    expect(d31.sourceUrl).toMatch(/Escrutinio_General_127\/data\/REPRESENTANTES_POR_DISTRITO_Resumen\.xml/)
    expect(d31.harvestedFrom).toBe('cee-d31-xml')
  })

  it('marca a las dos del PIP añadidas por ley de minorías', () => {
    expect(electionFor('adriana-gutierrez-colon')?.votes).toBeNull()
    expect(electionFor('nelie-lebron-robles')?.votes).toBeNull()
    expect(electionFor('denis-marquez-lebron')?.votes).toBe(192404)
  })

  it('no usa floats en el margen: votos enteros', () => {
    const eddie = electionFor('eddie-charbonier-chinea')!
    expect(Number.isInteger(eddie.votes)).toBe(true)
    expect(Number.isInteger(eddie.margin)).toBe(true)
    expect(eddie.votes).toBe(10961)
    expect(voteLine(eddie)).toMatch(/10[.,]?961/)
    expect(formatVotes(null)).toBe('—')
  })
})

describe('recolector de votos', () => {
  it('deja un reporte de qué fuente respondió', () => {
    expect(report.ok).toContain('cee-d31-xml')
    expect(report.d31).toBe(677)
    expect(report.minority).toEqual([
      'adriana-gutierrez-colon',
      'nelie-lebron-robles',
    ])
  })
})
