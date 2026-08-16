import { describe, expect, it } from 'vitest'
import { DEEP_IDS, DOSSIERS } from '../data/dossiers'
import { SRC } from '../data/dossiers/sources'
import { VERIFIED } from '../data/dossiers/verified'
import { REPRESENTATIVES } from '../data/representatives'
import { connectionsOf, fichaFor, townOverlapConnections } from './dossiers'

const MESA_IDS = [
  'carlos-johnny-mendez-nunez',
  'yashira-lebron-rodriguez',
  'angel-r-pena-ramirez',
  'jose-e-torres-zamora',
  'wilson-j-roman-lopez',
  'hector-e-ferrer-santiago',
  'domingo-j-torres-garcia',
  'denis-marquez-lebron',
  'adriana-gutierrez-colon',
  'lisie-j-burgos-muniz',
] as const

describe('dossiers 2025–2028', () => {
  it('tiene una ficha para cada uno de los 53, sin ids huérfanos', () => {
    expect(Object.keys(DOSSIERS)).toHaveLength(53)
    for (const rep of REPRESENTATIVES) {
      const dossier = fichaFor(rep.id)
      expect(dossier).not.toBeNull()
      expect(dossier?.id).toBe(rep.id)
      expect(dossier?.sources.some((s) => s.url === rep.profileUrl)).toBe(true)
    }
  })

  it('profundiza la mesa (10), Aponte, Rivera Ruiz y López Román', () => {
    const extra = [
      'jose-f-aponte-hernandez',
      'roberto-rivera-ruiz-de-porras',
      'roberto-lopez-roman',
    ]
    for (const id of [...MESA_IDS, ...extra]) {
      expect(DEEP_IDS.has(id)).toBe(true)
      expect(VERIFIED[id]).toBeDefined()
    }
    expect(DEEP_IDS.size).toBe(13)
  })

  it('deja vacía la biografía de quien no tiene hecho verificado', () => {
    const eddie = DOSSIERS['eddie-charbonier-chinea']
    expect(eddie.bio).toBeNull()
    expect(eddie.career).toEqual([])
    expect(eddie.aspirations).toEqual([])
    expect(eddie.committees).toEqual([])
    expect(eddie.connections).toEqual([])
  })

  it('no marca el solape de pueblos como hecho', () => {
    const overlaps = townOverlapConnections('roberto-lopez-roman')
    expect(overlaps.some((c) => c.toId === 'jose-conny-varela')).toBe(true)
    expect(overlaps.every((c) => c.kind === 'inference')).toBe(true)
    expect(overlaps.every((c) => c.sources.length === 0)).toBe(true)
    const facts = connectionsOf('roberto-lopez-roman').filter((c) => c.kind === 'fact')
    expect(facts).toHaveLength(0)
  })

  it('codifica la cadena de vacante del D31 con las URLs citadas', () => {
    const d31 = DOSSIERS['roberto-lopez-roman']
    expect(d31.bio).toMatch(/Vimarie Peña Dávila/)
    expect(d31.bio).toMatch(/Rosachely Rivera Santana/)
    expect(d31.bio).toMatch(/677/)
    expect(d31.bio).toMatch(/7 de octubre de 2025/)
    expect(d31.bio).toMatch(/cinco candidatos/)
    expect(d31.career.join(' ')).toMatch(/Caguas/)
    expect(d31.career.join(' ')).toMatch(/2016/)
    expect(d31.career.join(' ')).toMatch(/FIU/)
    expect(d31.career.join(' ')).toMatch(/FLACSO/)
    expect(d31.career.join(' ')).toMatch(/Marco Rubio/)
    expect(d31.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([SRC.wiprD31.url, SRC.metroD31.url, SRC.ballotpediaLopez.url]),
    )
  })

  it('usa solo la ficha oficial para Ferrer', () => {
    const ferrer = DOSSIERS['hector-e-ferrer-santiago']
    expect(ferrer.bio).toMatch(/23 de septiembre de 1994/)
    expect(ferrer.bio).toMatch(/Héctor J\. Ferrer Ríos/)
    expect(ferrer.bio).toMatch(/Distrito 29/)
    expect(ferrer.bio).toMatch(/2020/)
    expect(ferrer.sources.map((s) => s.url)).toContain(SRC.camaraFerrer.url)
  })

  it('fija a Méndez, Peña y Lebrón con las fuentes de la inaugural', () => {
    const johnny = DOSSIERS['carlos-johnny-mendez-nunez']
    expect(johnny.bio).toMatch(/50 votos/)
    expect(johnny.bio).toMatch(/2017–2020/)
    expect(johnny.aspirations.join(' ')).toMatch(/Roosevelt Roads/)
    expect(johnny.connections.filter((c) => c.kind === 'fact').map((c) => c.toId)).toEqual(
      expect.arrayContaining(['yashira-lebron-rodriguez', 'angel-r-pena-ramirez']),
    )
    expect(johnny.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([SRC.wiprMendez.url, SRC.metroInaugural.url, SRC.voceroPrioridades.url]),
    )
  })

  it('cita a Aponte 2005–2008 con Metro + Wikipedia, y a Rivera con Univision + Wikipedia', () => {
    const aponte = DOSSIERS['jose-f-aponte-hernandez']
    expect(aponte.bio).toMatch(/2005–2008/)
    expect(aponte.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([SRC.metroInaugural.url, SRC.wikiAponte.url]),
    )
    const rivera = DOSSIERS['roberto-rivera-ruiz-de-porras']
    expect(rivera.bio).toMatch(/2016/)
    expect(rivera.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([SRC.metroInaugural.url, SRC.univisionRivera.url, SRC.wikiRivera.url]),
    )
    expect(rivera.connections[0]?.kind).toBe('fact')
    expect(rivera.connections[0]?.toId).toBe('carlos-johnny-mendez-nunez')
  })

  it('toda conexión guardada en data es hecho con URL, nunca inferencia de pueblo', () => {
    for (const dossier of Object.values(DOSSIERS)) {
      for (const connection of dossier.connections) {
        expect(connection.kind).toBe('fact')
        expect(connection.sources.length).toBeGreaterThan(0)
        expect(REPRESENTATIVES.some((r) => r.id === connection.toId)).toBe(true)
      }
    }
  })
})
