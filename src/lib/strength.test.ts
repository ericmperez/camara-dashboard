import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import {
  activityPoints,
  electoralPoints,
  maxProjectCount,
  rankByStrength,
  rolePoints,
  strengthOf,
} from './strength'

const ids = REPRESENTATIVES.map((r) => r.id)
const maxPc = maxProjectCount(ids)

describe('fuerza del candidato', () => {
  it('el presidente con más proyectos queda arriba, no un escaño de minoría', () => {
    const johnny = REPRESENTATIVES.find((r) => r.role === 'Presidente')!
    const ranked = rankByStrength(REPRESENTATIVES, maxPc)
    expect(ranked[0]?.id).toBe(johnny.id)
    const score = strengthOf(johnny, maxPc)
    expect(score.role).toBe(15)
    expect(score.activity).toBe(35)
    expect(score.electoral).toBe(50)
    expect(score.total).toBe(100)
    expect(score.colorLabel).toBe('Azul')
    expect(score.band).toBe('alto')
  })

  it('no inventa fuerza electoral a quien entró por ley de minorías', () => {
    const adriana = REPRESENTATIVES.find((r) => r.id === 'adriana-gutierrez-colon')!
    const score = strengthOf(adriana, maxPc)
    expect(electoralPoints(adriana.id)).toBeNull()
    expect(score.electoral).toBeNull()
    expect(score.band).toBe('sin-voto')
    expect(score.total).toBe(score.activity + score.role)
    expect(score.colorLabel).toBe('Verde')
  })

  it('el distrito 31 usa su % de la especial, no los 10,961 de Peña', () => {
    const d31 = REPRESENTATIVES.find((r) => r.district === 31)!
    const score = strengthOf(d31, maxPc)
    expect(score.electoral).toBe(32)
    expect(score.electoral).not.toBe(35)
  })

  it('populares salen Rojo y el log de proyectos no usa floats de dinero', () => {
    const hau = REPRESENTATIVES.find((r) => r.id === 'gretchen-hau')!
    expect(strengthOf(hau, maxPc).colorLabel).toBe('Rojo')
    expect(activityPoints(0, 100)).toBe(0)
    expect(activityPoints(100, 100)).toBe(35)
    expect(Number.isInteger(activityPoints(14, 237))).toBe(true)
    expect(rolePoints(null)).toBe(0)
    expect(rolePoints('Portavoz alterno — PPD')).toBe(6)
    expect(rolePoints('Portavoz — PIP')).toBe(10)
  })
})
