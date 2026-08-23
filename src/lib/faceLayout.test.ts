import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  FACE_LAYOUT,
  PHONE_VIEWPORT,
  faceBoardFitsPhoneViewport,
  faceBoardPhoneHeight,
} from './faceLayout'

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../index.css'),
  'utf8',
)

describe('53 fichas delgadas en una pantalla', () => {
  it('el contrato de densidad cabe en un viewport de teléfono 390×844', () => {
    expect(PHONE_VIEWPORT).toEqual({ width: 390, height: 844 })
    expect(FACE_LAYOUT.phoneColumns).toBe(3)
    expect(FACE_LAYOUT.cardMaxHeight).toBe(44)
    expect(FACE_LAYOUT.gap).toBe(3)
    expect(faceBoardPhoneHeight(53)).toBe(18 * 44 + 17 * 3)
    expect(faceBoardPhoneHeight(53)).toBeLessThanOrEqual(PHONE_VIEWPORT.height)
    expect(faceBoardFitsPhoneViewport(53)).toBe(true)
  })

  it('falla si las cartas vuelven a una columna gruesa o a una ficha más alta', () => {
    const fatSingleColumn = 53 * 140
    expect(fatSingleColumn).toBeGreaterThan(PHONE_VIEWPORT.height)
    expect(faceBoardPhoneHeight(53)).toBeLessThan(fatSingleColumn)
    expect(FACE_LAYOUT.phoneColumns).toBeGreaterThan(1)
    expect(FACE_LAYOUT.cardMaxHeight).toBeLessThan(80)
  })

  it('el CSS de Caras publica el mismo contrato one-screen', () => {
    const board = css.match(/\.face-board\s*\{[^}]+\}/)
    expect(board?.[0]).toMatch(/--face-cols:\s*3/)
    expect(board?.[0]).toMatch(/--face-card-max-h:\s*44px/)
    expect(board?.[0]).toMatch(/--face-gap:\s*3px/)
    expect(board?.[0]).toMatch(/grid-auto-rows:\s*var\(--face-card-max-h/)

    const card = css.match(/\.face-card\s*\{[^}]+\}/)
    expect(card?.[0]).toMatch(/height:\s*var\(--face-card-max-h/)
    expect(card?.[0]).toMatch(/grid-template-columns:\s*32px 1fr/)
  })
})
