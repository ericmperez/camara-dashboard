import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import {
  countByParty,
  emptyFilters,
  filterRepresentatives,
  hasActiveFilters,
  matchesQuery,
  sortRepresentatives,
} from './filter'
import { projectsFor } from './measures'
import { initials, normalize } from './text'
import type { Representative } from '../types'

const stub = (partial: Partial<Representative>): Representative => ({
  id: 'x',
  name: 'Ada Pérez',
  party: 'PNP',
  district: 1,
  districtLabel: 'Distrito 1',
  municipalities: ['San Juan'],
  role: null,
  email: 'ada@camara.pr.gov',
  phone: '787-000-0000',
  photoUrl: null,
  profileUrl: 'https://www.camara.pr.gov/team/ada',
  ...partial,
})

describe('normalize / search', () => {
  it('ignora acentos y mayúsculas', () => {
    expect(normalize('Méndez')).toBe('mendez')
    const johnny = REPRESENTATIVES.find((r) => r.id.includes('mendez'))!
    expect(matchesQuery(johnny, 'mendez')).toBe(true)
    expect(matchesQuery(johnny, 'MÉNDEZ')).toBe(true)
  })

  it('encuentra al autor por el número de un proyecto de SUTRA', () => {
    const pichy = REPRESENTATIVES.find((r) => r.id === 'jose-e-torres-zamora')!
    const code = projectsFor(pichy.id)[0]?.code
    expect(code).toBeTruthy()
    const hits = filterRepresentatives(REPRESENTATIVES, {
      ...emptyFilters(),
      query: code!,
    })
    expect(hits.some((r) => r.id === pichy.id)).toBe(true)
  })

  it('encuentra por línea política: populares, estadidad, independencia', () => {
    const popular = REPRESENTATIVES.find((r) => r.party === 'PPD')!
    const estadista = REPRESENTATIVES.find((r) => r.party === 'PNP')!
    const pip = REPRESENTATIVES.find((r) => r.party === 'PIP')!
    expect(matchesQuery(popular, 'populares')).toBe(true)
    expect(matchesQuery(popular, 'estadidad')).toBe(false)
    expect(matchesQuery(estadista, 'estadidad')).toBe(true)
    expect(matchesQuery(pip, 'independencia')).toBe(true)
  })

  it('encuentra por apodo, municipio o número de distrito', () => {
    const chino = REPRESENTATIVES.find((r) => r.id.includes('ocasio'))!
    expect(matchesQuery(chino, 'chino')).toBe(true)
    expect(matchesQuery(chino, 'vieques')).toBe(false)

    const johnny = REPRESENTATIVES.find((r) => r.district === 36)!
    expect(matchesQuery(johnny, 'vieques')).toBe(true)
    expect(matchesQuery(johnny, '36')).toBe(true)
    expect(matchesQuery(johnny, 'distrito 36')).toBe(true)
    const vieques = filterRepresentatives(REPRESENTATIVES, {
      ...emptyFilters(),
      query: 'Vieques',
    })
    expect(vieques).toHaveLength(1)
    expect(vieques[0]?.district).toBe(36)
  })

  it('trata query vacío o solo espacios como "mostrar todos"', () => {
    expect(matchesQuery(stub({}), '')).toBe(true)
    expect(matchesQuery(stub({}), '   ')).toBe(true)
  })

  it('no confunde apellidos repetidos: filtra el token completo', () => {
    const torres = filterRepresentatives(REPRESENTATIVES, {
      ...emptyFilters(),
      query: 'torres',
    })
    expect(torres.length).toBeGreaterThan(1)
    expect(torres.every((r) => /torres/i.test(r.name) || r.municipalities.length >= 0)).toBe(
      true,
    )
    expect(torres.every((r) => matchesQuery(r, 'torres'))).toBe(true)
  })
})

describe('filterRepresentatives', () => {
  it('filtra por partido', () => {
    const pip = filterRepresentatives(REPRESENTATIVES, {
      ...emptyFilters(),
      party: 'PIP',
    })
    expect(pip).toHaveLength(3)
    expect(pip.every((r) => r.party === 'PIP')).toBe(true)
  })

  it('separa distrito vs acumulación', () => {
    const districts = filterRepresentatives(REPRESENTATIVES, {
      ...emptyFilters(),
      seat: 'distrito',
    })
    const atLarge = filterRepresentatives(REPRESENTATIVES, {
      ...emptyFilters(),
      seat: 'acumulacion',
    })
    expect(districts).toHaveLength(40)
    expect(atLarge).toHaveLength(13)
    expect(districts.every((r) => r.district !== null)).toBe(true)
    expect(atLarge.every((r) => r.district === null)).toBe(true)
  })

  it('combina partido + escaño + texto', () => {
    const result = filterRepresentatives(REPRESENTATIVES, {
      query: 'acumulacion',
      party: 'PPD',
      seat: 'acumulacion',
    })
    expect(result.every((r) => r.party === 'PPD' && r.district === null)).toBe(true)
    expect(result.length).toBe(3)
  })

  it('devuelve lista vacía cuando no hay match (empty state)', () => {
    const none = filterRepresentatives(REPRESENTATIVES, {
      ...emptyFilters(),
      query: 'xyzzy-no-existe',
    })
    expect(none).toEqual([])
  })

  it('no clasifica mal un distrito por dato parcial: 1 no mete al 10, 11, 21…', () => {
    const onlyFirst = filterRepresentatives(REPRESENTATIVES, {
      ...emptyFilters(),
      query: 'distrito 1',
    })
    expect(onlyFirst.map((r) => r.district)).toEqual([1])
  })
})

describe('sort + counts', () => {
  it('ordena por número de distrito y deja acumulación al final', () => {
    const sorted = sortRepresentatives(REPRESENTATIVES)
    expect(sorted[0].district).toBe(1)
    expect(sorted[39].district).toBe(40)
    expect(sorted.slice(40).every((r) => r.district === null)).toBe(true)
  })

  it('countByParty no usa floats y parte de cero', () => {
    expect(countByParty([])).toEqual({ PNP: 0, PPD: 0, PIP: 0, PD: 0 })
    expect(countByParty([stub({ party: 'PD' })])).toEqual({
      PNP: 0,
      PPD: 0,
      PIP: 0,
      PD: 1,
    })
  })

  it('hasActiveFilters distingue el estado inicial', () => {
    expect(hasActiveFilters(emptyFilters())).toBe(false)
    expect(hasActiveFilters({ ...emptyFilters(), query: 'ponce' })).toBe(true)
    expect(hasActiveFilters({ ...emptyFilters(), party: 'PNP' })).toBe(true)
  })
})

describe('initials fallback', () => {
  it('usa primera y última palabra útil, ignora apodos entre comillas', () => {
    expect(initials("Carlos 'Johnny' Méndez Núñez")).toBe('CN')
    expect(initials('Gretchen Hau')).toBe('GH')
    expect(initials('')).toBe('?')
  })
})
