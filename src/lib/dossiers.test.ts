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

  it('profundiza la mesa (10), Aponte, Rivera Ruiz, López Román, Muriel, Ocasio y Hernández D3', () => {
    const extra = [
      'jose-f-aponte-hernandez',
      'roberto-rivera-ruiz-de-porras',
      'roberto-lopez-roman',
      'christian-muriel-sanchez',
      'ricardo-chino-rey-ocasio-ramos',
      'jose-hernandez-concepcion',
    ]
    for (const id of [...MESA_IDS, ...extra]) {
      expect(DEEP_IDS.has(id)).toBe(true)
      expect(VERIFIED[id]).toBeDefined()
    }
    expect(DEEP_IDS.size).toBe(16)
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

  it('codifica el D34 de Muriel con docket OCE, PC 830 y la nota familiar de ENDI', () => {
    const d34 = DOSSIERS['christian-muriel-sanchez']
    expect(d34.bio).toMatch(/Distrito 34/)
    expect(d34.bio).toMatch(/cmuriel@camara\.pr\.gov/)
    expect(d34.bio).toMatch(/M-967-AL/)
    expect(d34.bio).toMatch(/2 de enero de 2025/)
    expect(d34.career.join(' ')).toMatch(/2,876/)
    expect(d34.career.join(' ')).toMatch(/16,831/)
    expect(d34.career.join(' ')).toMatch(/Ramón Luis Cruz/)
    expect(d34.career.join(' ')).toMatch(/OCE-EB-24-093/)
    expect(d34.career.join(' ')).toMatch(/no procedimos a completar el trámite/)
    expect(d34.career.join(' ')).not.toMatch(/esposa|madre|hijo|yerno|hermano/)
    expect(d34.aspirations.join(' ')).toMatch(/RCC 292/)
    expect(d34.aspirations.join(' ')).toMatch(/RC 310/)
    expect(d34.aspirations.join(' ')).toMatch(/RC 263/)
    expect(d34.aspirations.join(' ')).toMatch(/RC 200/)
    expect(d34.aspirations.join(' ')).toMatch(/PC 830/)
    expect(d34.aspirations.join(' ')).toMatch(/20 de abril de 2026/)
    expect(d34.aspirations.join(' ')).toMatch(/Rafael Surillo/)
    expect(d34.aspirations.join(' ')).toMatch(/no implica alianza/)
    expect(d34.committees).toEqual(['Cooperativismo'])
    expect(JSON.stringify(d34)).not.toMatch(/\$\d/)
    const facts = d34.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual(['carlos-johnny-mendez-nunez'])
    expect(facts[0].sources.map((s) => s.url)).toContain(SRC.endiFamiliares.url)
    const overlap = townOverlapConnections('christian-muriel-sanchez')
    expect(overlap.some((c) => c.toId === 'angel-r-pena-ramirez' && c.kind === 'inference')).toBe(
      true,
    )
    expect(d34.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraMuriel.url,
        SRC.sutraMuriel.url,
        SRC.ballotpediaMuriel.url,
        SRC.wiki2024House.url,
        SRC.victoria840Muriel.url,
        SRC.oceMuriel.url,
        SRC.oceD34.url,
        SRC.pluralPC830.url,
        SRC.islaNewsYabucoa.url,
        SRC.endiFamiliares.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D2 de Ocasio con CEE 2024, docket 2020 y sin auditoría 2024', () => {
    const d2 = DOSSIERS['ricardo-chino-rey-ocasio-ramos']
    expect(d2.bio).toMatch(/1 de noviembre de 1967/)
    expect(d2.bio).toMatch(/Ramón Vila Mayo/)
    expect(d2.bio).toMatch(/rocasio@camara\.pr\.gov/)
    expect(d2.bio).toMatch(/M-935-AL/)
    expect(d2.bio).toMatch(/Adultos Mayores y Bienestar Social/)
    expect(d2.career.join(' ')).toMatch(/8,755/)
    expect(d2.career.join(' ')).toMatch(/Joel Vázquez Rosario/)
    expect(d2.career.join(' ')).toMatch(/Bryan Saavedra/)
    expect(d2.career.join(' ')).toMatch(/Juan Gabriel Zayas Monge/)
    expect(d2.career.join(' ')).not.toMatch(/Bryan Santana|Joel Rosario|Alfonso Questell/)
    expect(d2.career.join(' ')).toMatch(/primaria PNP de 2024 cancelada/i)
    expect(d2.career.join(' ')).toMatch(/Luis R\. Torres Cruz/)
    expect(d2.career.join(' ')).toMatch(/No es Ramón Torres Cruz/)
    expect(d2.career.join(' ')).toMatch(/OCE-B-21-148/)
    expect(d2.career.join(' ')).toMatch(/no hay auditoría 2024/)
    expect(d2.career.join(' ')).toMatch(/Ana Luisa Torres/)
    expect(d2.career.join(' ')).not.toMatch(/2,676|1,664|782/)
    expect(d2.career.join(' ')).toMatch(/No hay récord público citado de un familiar/)
    expect(d2.career.join(' ')).not.toMatch(/esposa|madre|hijo|yerno|hermano/)
    expect(d2.aspirations.join(' ')).toMatch(/RC 40/)
    expect(d2.aspirations.join(' ')).toMatch(/RC 101/)
    expect(d2.aspirations.join(' ')).toMatch(/PC 654/)
    expect(d2.aspirations.join(' ')).toMatch(/RC 320/)
    expect(d2.aspirations.join(' ')).toMatch(/RC 468/)
    expect(d2.aspirations.join(' ')).toMatch(/RC 477/)
    expect(d2.aspirations.join(' ')).toMatch(/PC 1353/)
    expect(d2.aspirations.join(' ')).toMatch(/PC 872/)
    expect(d2.aspirations.join(' ')).toMatch(/no autoría de Ocasio/)
    expect(d2.committees).toEqual(['Adultos Mayores y Bienestar Social'])
    expect(JSON.stringify(d2)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d2)).not.toMatch(/OCE-EB-24/)
    const facts = d2.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual(['carlos-johnny-mendez-nunez'])
    expect(facts[0].sources.map((s) => s.url)).toContain(SRC.elSolPC872.url)
    const overlap = townOverlapConnections('ricardo-chino-rey-ocasio-ramos')
    expect(
      overlap.some((c) => c.toId === 'eddie-charbonier-chinea' && c.kind === 'inference'),
    ).toBe(true)
    expect(overlap.some((c) => c.toId === 'jose-hernandez-concepcion')).toBe(true)
    expect(overlap.some((c) => c.toId === 'victor-l-pares-otero')).toBe(true)
    expect(overlap.some((c) => c.toId === 'jorge-navarro-suarez')).toBe(true)
    expect(d2.connections.some((c) => c.kind === 'inference')).toBe(false)
    expect(d2.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraOcasio.url,
        SRC.sutraOcasio.url,
        SRC.ballotpediaOcasio.url,
        SRC.wiki2024House.url,
        SRC.oceOcasio2020.url,
        SRC.oceD02_2020.url,
        SRC.oce2024Reps.url,
        SRC.wiprPC654.url,
        SRC.elSolPC872.url,
        SRC.metroTorresD2.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D3 de Hernández con la especial 2022, CEE 2024 y sin docket OCE 2024', () => {
    const d3 = DOSSIERS['jose-hernandez-concepcion']
    expect(d3.bio).toMatch(/Distrito 3/)
    expect(d3.bio).toMatch(/Cheito|Cheíto/)
    expect(d3.bio).toMatch(/jhernandez@camara\.pr\.gov/)
    expect(d3.bio).toMatch(/M-936-AL/)
    expect(d3.bio).toMatch(/12 de diciembre de 2022/)
    expect(d3.bio).toMatch(/Transportación e Infraestructura/)
    expect(d3.bio).not.toMatch(/nació el|Ramón Vila|1 de noviembre/i)
    expect(d3.career.join(' ')).toMatch(/871/)
    expect(d3.career.join(' ')).toMatch(/Christopher Ríos Aponte/)
    expect(d3.career.join(' ')).toMatch(/1,701/)
    expect(d3.career.join(' ')).toMatch(/Juan Oscar Morales|Juan O\. Morales/)
    expect(d3.career.join(' ')).toMatch(/Henry Neumann/)
    expect(d3.career.join(' ')).toMatch(/9,797/)
    expect(d3.career.join(' ')).toMatch(/Eva Prados Rodríguez/)
    expect(d3.career.join(' ')).toMatch(/Cristofer Malespín/)
    expect(d3.career.join(' ')).not.toMatch(/Cristofer Diaz|Daniel Marquez/)
    expect(d3.career.join(' ')).toMatch(/primaria PNP de 2024 cancelada/i)
    expect(d3.career.join(' ')).toMatch(/no hay auditoría 2024/)
    expect(d3.career.join(' ')).toMatch(/Hernández Lázaro|Kako/)
    expect(d3.career.join(' ')).toMatch(/No hay récord público citado de un familiar/)
    expect(d3.career.join(' ')).not.toMatch(/esposa|madre|hijo|yerno|hermano/)
    expect(d3.career.join(' ')).not.toMatch(/Democratic|demócrata/i)
    expect(d3.aspirations.join(' ')).toMatch(/PC 1352/)
    expect(d3.aspirations.join(' ')).toMatch(/15 a 5/)
    expect(d3.aspirations.join(' ')).toMatch(/PC 1334/)
    expect(d3.aspirations.join(' ')).toMatch(/RC 741/)
    expect(d3.aspirations.join(' ')).toMatch(/RC 627/)
    expect(d3.aspirations.join(' ')).toMatch(/Miguel Romero/)
    expect(d3.aspirations.join(' ')).toMatch(/no implica alianza/)
    expect(d3.committees).toEqual(['Transportación e Infraestructura'])
    expect(d3.connections).toEqual([])
    expect(JSON.stringify(d3)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d3)).not.toMatch(/OCE-EB-24-0(?!80)/)
    const overlap = townOverlapConnections('jose-hernandez-concepcion')
    expect(overlap.some((c) => c.toId === 'eddie-charbonier-chinea' && c.kind === 'inference')).toBe(
      true,
    )
    expect(overlap.some((c) => c.toId === 'ricardo-chino-rey-ocasio-ramos')).toBe(true)
    expect(overlap.some((c) => c.toId === 'victor-l-pares-otero')).toBe(true)
    expect(overlap.some((c) => c.toId === 'jorge-navarro-suarez')).toBe(true)
    expect(d3.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraHernandezD3.url,
        SRC.sutraHernandezD3.url,
        SRC.ballotpediaHernandezD3.url,
        SRC.wikiHernandezD3.url,
        SRC.wiki2024House.url,
        SRC.endiEspecialD3.url,
        SRC.ceeEspecialD3.url,
        SRC.primeraHoraEspecialD3.url,
        SRC.oce2024Reps.url,
        SRC.voceroPC1352.url,
        SRC.radioIslaVistas2026.url,
        SRC.voceroAAA.url,
        SRC.microjurisComisiones.url,
      ]),
    )
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
