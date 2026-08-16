import { describe, expect, it } from 'vitest'
import { CHAIRS, DUAL_CHAIRS } from '../data/dossiers/commissions'
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
    const carlo = DOSSIERS['emilio-carlo-acosta']
    expect(carlo.bio).toBeNull()
    expect(carlo.career).toEqual([])
    expect(carlo.aspirations).toEqual([])
    expect(carlo.committees).toEqual([])
    expect(carlo.connections).toEqual([])
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
    expect(d31.bio).toMatch(/18 de agosto de 2025/)
    expect(d31.bio).toMatch(/2,148/)
    expect(d31.bio).toMatch(/677–634–414–337–82/)
    expect(d31.bio).toMatch(/afiliados del PNP/)
    expect(d31.career.join(' ')).toMatch(/PC 1115/)
    expect(d31.career.join(' ')).toMatch(/Trabajo y Asuntos Laborales/)
    expect(d31.career.join(' ')).toMatch(/INFERENCIA/)
    expect(d31.career.join(' ')).toMatch(/2016/)
    expect(d31.committees).toContain('Trabajo y Asuntos Laborales')
    expect(d31.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.wiprD31.url,
        SRC.metroD31.url,
        SRC.ceeD31.url,
        SRC.endiPena.url,
        SRC.telemundoPC1115.url,
        SRC.camaraTrabajo.url,
      ]),
    )
  })

  it('usa la ficha oficial para Ferrer y no inventa finanzas OCE', () => {
    const ferrer = DOSSIERS['hector-e-ferrer-santiago']
    expect(ferrer.bio).toMatch(/23 de septiembre de 1994/)
    expect(ferrer.bio).toMatch(/Héctor J\. Ferrer Ríos/)
    expect(ferrer.career.join(' ')).toMatch(/169,060/)
    expect(JSON.stringify(ferrer)).not.toMatch(/\$\d/)
    expect(ferrer.sources.map((s) => s.url)).toContain(SRC.camaraFerrer.url)
  })

  it('fija a Méndez, Peña y Lebrón con las fuentes de la inaugural', () => {
    const johnny = DOSSIERS['carlos-johnny-mendez-nunez']
    expect(johnny.bio).toMatch(/50 votos/)
    expect(johnny.bio).toMatch(/décimo segundo/)
    expect(johnny.career.join(' ')).toMatch(/RC 352/)
    expect(johnny.career.join(' ')).toMatch(/PPD, PIP ni PD/)
    expect(johnny.connections.filter((c) => c.kind === 'fact').map((c) => c.toId)).toEqual(
      expect.arrayContaining([
        'yashira-lebron-rodriguez',
        'angel-r-pena-ramirez',
        'jose-conny-varela',
      ]),
    )
    expect(johnny.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([SRC.wiprMendez.url, SRC.metroInaugural.url, SRC.metroRC352.url]),
    )
  })

  it('cita a Aponte 2005–2009 (oficial) y a Rivera 2016–2017 como expresidentes sentados', () => {
    const aponte = DOSSIERS['jose-f-aponte-hernandez']
    expect(aponte.bio).toMatch(/2005 a 2009/)
    expect(aponte.bio).toMatch(/Néstor Aponte/)
    expect(aponte.committees).toContain('Asuntos Federales y Veteranos')
    expect(aponte.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([SRC.metroInaugural.url, SRC.camaraAponte.url]),
    )
    const rivera = DOSSIERS['roberto-rivera-ruiz-de-porras']
    expect(rivera.bio).toMatch(/2016–2017/)
    expect(rivera.connections.map((c) => c.toId)).toEqual(
      expect.arrayContaining(['carlos-johnny-mendez-nunez', 'jose-f-aponte-hernandez']),
    )
  })

  it('asigna las 34 presidencias de RC0002 y deja Trabajo en López Román', () => {
    const chairCount = Object.values(CHAIRS).reduce((n, chairs) => n + chairs.length, 0)
    expect(chairCount).toBe(34)
    expect(CHAIRS['roberto-lopez-roman']).toEqual(['Trabajo y Asuntos Laborales'])
    expect(Object.keys(CHAIRS).join(' ')).not.toMatch(/pena-davila|vimarie/)
    expect(DUAL_CHAIRS['axel-chino-roque-gracia']).toEqual(['Turismo', 'Región Central'])
    expect(DUAL_CHAIRS['jorge-navarro-suarez']).toEqual([
      'Banca, Seguros y Comercio',
      'Región Metro',
    ])
    for (const [id, chairs] of Object.entries(CHAIRS)) {
      const rep = REPRESENTATIVES.find((r) => r.id === id)
      expect(rep, id).toBeDefined()
      expect(rep?.party).toBe('PNP')
      expect(DOSSIERS[id].committees).toEqual(expect.arrayContaining(chairs))
    }
  })

  it('no le da presidencia de comisión a PPD, PIP ni PD', () => {
    const minorityChairs = REPRESENTATIVES.filter((r) => r.party !== 'PNP').filter(
      (r) => (CHAIRS[r.id] ?? []).length > 0,
    )
    expect(minorityChairs).toEqual([])
  })

  it('no intercambia a Wilson Román López con Roberto López Román, ni D20/D22', () => {
    const wilson = REPRESENTATIVES.find((r) => r.id === 'wilson-j-roman-lopez')!
    const lopez = REPRESENTATIVES.find((r) => r.id === 'roberto-lopez-roman')!
    expect(wilson.district).toBe(17)
    expect(wilson.role).toMatch(/Portavoz alterno/)
    expect(lopez.district).toBe(31)
    expect(lopez.name).not.toBe(wilson.name)
    expect(REPRESENTATIVES.find((r) => r.district === 20)?.name).toMatch(/Carlo/)
    expect(REPRESENTATIVES.find((r) => r.district === 22)?.name).toMatch(/Colón/)
    expect(REPRESENTATIVES.find((r) => r.id === 'nelie-lebron-robles')?.name).not.toMatch(/Flores/)
    expect(REPRESENTATIVES.find((r) => r.id === 'sergio-estevez-velez')?.name).toMatch(/Vélez/)
  })

  it('toda conexión guardada en data cita URL; el pueblo solo se infiere en runtime', () => {
    for (const dossier of Object.values(DOSSIERS)) {
      for (const connection of dossier.connections) {
        expect(connection.sources.length).toBeGreaterThan(0)
        expect(REPRESENTATIVES.some((r) => r.id === connection.toId)).toBe(true)
        if (connection.kind === 'inference') {
          expect(connection.label).toMatch(/INFERENCIA/i)
        }
      }
    }
  })
})
