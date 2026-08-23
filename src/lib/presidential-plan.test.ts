import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const PLAN_PATH = resolve(process.cwd(), 'docs/plan-presidente-votos-conseguibles.md')

function plan(): string {
  return readFileSync(PLAN_PATH, 'utf8')
}

describe('plan de producto para el Presidente (votos conseguibles)', () => {
  it('existe como documento de producto en el repo, no como stub', () => {
    const body = plan()
    expect(body.length).toBeGreaterThan(8000)
    expect(body).toMatch(/Usuario primario/i)
    expect(body).toMatch(/Presidente de la Cámara/)
  })

  it('nombra al Presidente y el trabajo de cogerles un voto', () => {
    const body = plan()
    expect(body).toContain('Méndez Núñez')
    expect(body).toContain('Johnny')
    expect(body).toContain('cogerles un voto')
    expect(body).toContain('votos conseguibles')
  })

  it('inventaria las cinco vistas, el roster de 53, CEE, SUTRA y fuerza', () => {
    const body = plan()
    expect(body).toMatch(/\bCaras\b/)
    expect(body).toMatch(/\bHemiciclo\b/)
    expect(body).toMatch(/\bRanking\b/)
    expect(body).toMatch(/\bFicha\b/)
    expect(body).toMatch(/\bConexiones\b/)
    expect(body).toMatch(/\b53\b/)
    expect(body).toMatch(/\bCEE\b/)
    expect(body).toMatch(/\bSUTRA\b/)
    expect(body).toMatch(/fuerza 0–100|fuerza 0-100/)
  })

  it('nombra los huecos de whip, tablero por medida, tally de mayoría y notas privadas', () => {
    const body = plan()
    expect(body).toMatch(/whip status|estado de whip/i)
    expect(body).toMatch(/tablero por medida/i)
    expect(body).toMatch(/tally contra la mayoría|27 de 53/)
    expect(body).toMatch(/notas privadas/)
  })

  it('fija el conjunto cerrado de posiciones y el conteo contra 27', () => {
    const body = plan()
    expect(body).toContain('voto que puedo coger')
    expect(body).toContain('| **sí** |')
    expect(body).toContain('| **no** |')
    expect(body).toContain('indeciso')
    expect(body).toContain('no contactado')
    expect(body).toContain('Mayoría del cuerpo = 27')
  })

  it('usa partido, cargo o presidencia, margen CEE y coautorías citadas como palanca, no el solape de pueblos', () => {
    const body = plan()
    expect(body).toMatch(/Partido/)
    expect(body).toMatch(/Cargo o presidencia de comisión|presidencia de comisión/)
    expect(body).toMatch(/Margen CEE/)
    expect(body).toMatch(/Coautorías citadas/)
    expect(body).toMatch(/INFERENCIA, no alianza/)
  })

  it('exige barra en español, hechos citados, y diferidos explícitos', () => {
    const body = plan()
    expect(body).toMatch(/en español/)
    expect(body).toMatch(/hechos citados/)
    expect(body).toMatch(/Harvest de votos en sala|live floor-vote/)
    expect(body).toMatch(/PR #2|draft PR #2/)
    expect(body).toMatch(/Auth \/ backend|auth\/backend/)
    expect(body).toMatch(/Fichas VERIFIED que faltan/)
  })
})
