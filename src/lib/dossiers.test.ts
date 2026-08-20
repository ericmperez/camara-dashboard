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

  it('profundiza la mesa (10), Aponte, Rivera Ruiz, López Román, Muriel, Ocasio, Hernández D3, Parés, Navarro D5, Morey D6, Pérez Ortiz D7, Pacheco D9, Pellé D10, Elinette D11, Feliciano D12, Nieves D13, Robles D14, Franqui D15 y Figueroa D16', () => {
    const extra = [
      'jose-f-aponte-hernandez',
      'roberto-rivera-ruiz-de-porras',
      'roberto-lopez-roman',
      'christian-muriel-sanchez',
      'ricardo-chino-rey-ocasio-ramos',
      'jose-hernandez-concepcion',
      'victor-l-pares-otero',
      'jorge-navarro-suarez',
      'angel-morey-noble',
      'luis-perez-ortiz',
      'felix-pacheco-burgos',
      'pedro-j-pelle-santiago-guzman',
      'elinette-gonzalez-aguayo',
      'edgardo-feliciano-sanchez',
      'jerry-nieves-rosario',
      'edgar-robles-rivera',
      'joel-i-franqui-atiles',
      'reinaldo-rey-figueroa',
    ]
    for (const id of [...MESA_IDS, ...extra]) {
      expect(DEEP_IDS.has(id)).toBe(true)
      expect(VERIFIED[id]).toBeDefined()
    }
    expect(DEEP_IDS.size).toBe(28)
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

  it('codifica el D4 de Parés con interinato 2012, CEE 2024 y OCE-17-216', () => {
    const d4 = DOSSIERS['victor-l-pares-otero']
    expect(d4.bio).toMatch(/18 de julio de 1966/)
    expect(d4.bio).toMatch(/vpares@camara\.pr\.gov/)
    expect(d4.bio).toMatch(/M-937-AL/)
    expect(d4.bio).toMatch(/Comisión de Gobierno/)
    expect(d4.bio).toMatch(/omite el interinato/)
    expect(d4.career.join(' ')).toMatch(/José y Aida/)
    expect(d4.career.join(' ')).toMatch(/fundación del PNP/)
    expect(d4.career.join(' ')).toMatch(/Liza Fernández/)
    expect(d4.career.join(' ')).toMatch(/no familiar/)
    expect(d4.career.join(' ')).toMatch(/24 de mayo de 2012/)
    expect(d4.career.join(' ')).toMatch(/No retuvo el escaño/)
    expect(d4.career.join(' ')).toMatch(/Interamericana/)
    expect(d4.career.join(' ')).toMatch(/Méndez lo designó/)
    expect(d4.career.join(' ')).toMatch(/11,210/)
    expect(d4.career.join(' ')).toMatch(/Adriana Gutiérrez Colón/)
    expect(d4.career.join(' ')).toMatch(/PIP/)
    expect(d4.career.join(' ')).not.toMatch(/MVC/)
    expect(d4.career.join(' ')).toMatch(/OCE-17-216/)
    expect(d4.career.join(' ')).toMatch(/no hay auditoría 2024/)
    expect(d4.career.join(' ')).toMatch(/Ángel Pérez Otero/)
    expect(JSON.stringify(d4)).not.toMatch(/esposa|hijos|nieta/)
    expect(d4.aspirations.join(' ')).toMatch(/RC 42/)
    expect(d4.aspirations.join(' ')).toMatch(/PC 42/)
    expect(d4.aspirations.join(' ')).toMatch(/PC 17/)
    expect(d4.aspirations.join(' ')).toMatch(/RC 749/)
    expect(d4.aspirations.join(' ')).toMatch(/PC 1335/)
    expect(d4.aspirations.join(' ')).toMatch(/RC 653/)
    expect(d4.aspirations.join(' ')).toMatch(/RC 592/)
    expect(d4.committees).toEqual(['Gobierno'])
    expect(JSON.stringify(d4)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d4)).not.toMatch(/OCE-EB-24/)
    const facts = d4.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual(
      expect.arrayContaining(['carlos-johnny-mendez-nunez', 'adriana-gutierrez-colon']),
    )
    expect(facts).toHaveLength(2)
    const overlap = townOverlapConnections('victor-l-pares-otero')
    expect(overlap.some((c) => c.toId === 'eddie-charbonier-chinea' && c.kind === 'inference')).toBe(
      true,
    )
    expect(overlap.some((c) => c.toId === 'ricardo-chino-rey-ocasio-ramos')).toBe(true)
    expect(overlap.some((c) => c.toId === 'jose-hernandez-concepcion')).toBe(true)
    expect(overlap.some((c) => c.toId === 'jorge-navarro-suarez')).toBe(true)
    expect(d4.connections.some((c) => c.kind === 'inference')).toBe(false)
    expect(d4.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraPares.url,
        SRC.sutraPares.url,
        SRC.ballotpediaPares.url,
        SRC.wikiPares.url,
        SRC.wiki2024House.url,
        SRC.ocePares2016.url,
        SRC.oceD04_2016.url,
        SRC.oce2024Reps.url,
        SRC.tribunaPares2012.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D5 de Navarro con CEE 2024, OCE-B-21-001 y récord público del padre', () => {
    const d5 = DOSSIERS['jorge-navarro-suarez']
    expect(d5.bio).toMatch(/8 de julio de 1964/)
    expect(d5.bio).toMatch(/Georgie Navarro Suárez/)
    expect(d5.bio).toMatch(/University Gardens/)
    expect(d5.bio).toMatch(/UPR Bayamón/)
    expect(d5.bio).toMatch(/jnavarro@camara\.pr\.gov/)
    expect(d5.bio).toMatch(/M-938-AL/)
    expect(d5.bio).toMatch(/721-6040/)
    expect(d5.bio).toMatch(/Banca, Seguros y Comercio/)
    expect(d5.bio).toMatch(/Región Metro/)
    expect(d5.career.join(' ')).toMatch(/Georgie Navarro Alicea/)
    expect(d5.career.join(' ')).toMatch(/Nitza Suárez/)
    expect(d5.career.join(' ')).toMatch(/segundo de cinco/)
    expect(d5.career.join(' ')).toMatch(/Pueblo Supermarket/)
    expect(d5.career.join(' ')).toMatch(/Juan F\. Woldroff/)
    expect(d5.career.join(' ')).toMatch(/Minority Business Opportunity/)
    expect(d5.career.join(' ')).toMatch(/2 de enero de 2005/)
    expect(d5.career.join(' ')).toMatch(/Roberto «Junior» Maldonado|Roberto "Junior" Maldonado/)
    expect(d5.career.join(' ')).toMatch(/primaria PNP de 2024 cancelada/i)
    expect(d5.career.join(' ')).toMatch(/14,748/)
    expect(d5.career.join(' ')).toMatch(/Gabriel Casal Nazario/)
    expect(d5.career.join(' ')).toMatch(/Elba Beatriz Rivera/)
    expect(d5.career.join(' ')).toMatch(/Ricardo Rodríguez Quiles/)
    expect(d5.career.join(' ')).toMatch(/30,676/)
    expect(d5.career.join(' ')).toMatch(/variantes Gabriel Nazario y Elba Estrada/)
    expect(d5.career.join(' ')).toMatch(/Pueblo v\. Navarro Alicea/)
    expect(d5.career.join(' ')).toMatch(/PADRE/)
    expect(d5.career.join(' ')).toMatch(/92 cargos/)
    expect(d5.career.join(' ')).toMatch(/OCE-B-21-001/)
    expect(d5.career.join(' ')).toMatch(/Monto no extraído/)
    expect(d5.career.join(' ')).toMatch(/no hay auditoría 2024/)
    expect(JSON.stringify(d5)).not.toMatch(/esposa|cónyuge|yerno/)
    expect(d5.aspirations.join(' ')).toMatch(/PC 808/)
    expect(d5.aspirations.join(' ')).toMatch(/PC 785/)
    expect(d5.aspirations.join(' ')).toMatch(/PC 179/)
    expect(d5.aspirations.join(' ')).toMatch(/vuelve a la carga/)
    expect(d5.aspirations.join(' ')).toMatch(/PC 43/)
    expect(d5.aspirations.join(' ')).toMatch(/RC 98/)
    expect(d5.aspirations.join(' ')).toMatch(/RC 125/)
    expect(d5.aspirations.join(' ')).toMatch(/RC 435/)
    expect(d5.aspirations.join(' ')).toMatch(/RC 609/)
    expect(d5.aspirations.join(' ')).toMatch(/Futucare/)
    expect(d5.aspirations.join(' ')).toMatch(/RC 123/)
    expect(d5.aspirations.join(' ')).toMatch(/Cantera Estrella/)
    expect(d5.aspirations.join(' ')).toMatch(/PC 1341/)
    expect(d5.committees).toEqual(['Banca, Seguros y Comercio', 'Región Metro'])
    expect(d5.connections).toEqual([])
    expect(JSON.stringify(d5)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d5)).not.toMatch(/OCE-EB-24/)
    const overlap = townOverlapConnections('jorge-navarro-suarez')
    expect(overlap.some((c) => c.toId === 'eddie-charbonier-chinea' && c.kind === 'inference')).toBe(
      true,
    )
    expect(overlap.some((c) => c.toId === 'ricardo-chino-rey-ocasio-ramos')).toBe(true)
    expect(overlap.some((c) => c.toId === 'jose-hernandez-concepcion')).toBe(true)
    expect(overlap.some((c) => c.toId === 'victor-l-pares-otero')).toBe(true)
    expect(overlap.some((c) => c.toId === 'angel-morey-noble')).toBe(true)
    expect(d5.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraNavarro.url,
        SRC.sutraNavarro.url,
        SRC.ballotpediaNavarro.url,
        SRC.wikiNavarro.url,
        SRC.wiki2024House.url,
        SRC.oceNavarro2020.url,
        SRC.oceD05_2020.url,
        SRC.oce2024Reps.url,
        SRC.endiCelularesNavarro.url,
        SRC.teleonceNavarroAlicea.url,
        SRC.puebloNavarroAlicea.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D6 de Morey con especial 2021, CEE 2024 y sin docket OCE a su nombre', () => {
    const d6 = DOSSIERS['angel-morey-noble']
    expect(d6.bio).toMatch(/Distrito 6/)
    expect(d6.bio).toMatch(/amorey@camara\.pr\.gov/)
    expect(d6.bio).toMatch(/M-939-AL/)
    expect(d6.bio).toMatch(/721-6040/)
    expect(d6.bio).toMatch(/Phi Sigma Alpha/)
    expect(d6.bio).toMatch(/1 de junio de 2021/)
    expect(d6.bio).toMatch(/Reorganización, Eficiencia y Diligencia/)
    expect(d6.bio).toMatch(/48 años/)
    expect(d6.bio).toMatch(/INFERENCIA/)
    expect(d6.bio).not.toMatch(/nació el \d/)
    expect(d6.career.join(' ')).toMatch(/Angel Morey Santiago|Ángel Morey/)
    expect(d6.career.join(' ')).toMatch(/Secretario de Estado/)
    expect(d6.career.join(' ')).toMatch(/PADRE/)
    expect(d6.career.join(' ')).toMatch(/Tony Soto|Antonio «Tony» Soto/)
    expect(d6.career.join(' ')).toMatch(/28 de febrero de 2021/)
    expect(d6.career.join(' ')).toMatch(/27 de mayo de 2021/)
    expect(d6.career.join(' ')).toMatch(/Francisco Rosado Colomer/)
    expect(d6.career.join(' ')).toMatch(/Ángel Pérez Otero/)
    expect(d6.career.join(' ')).toMatch(/no implica alianza/)
    expect(d6.career.join(' ')).toMatch(/Samuel Almodóvar/)
    expect(d6.career.join(' ')).toMatch(/14,006/)
    expect(d6.career.join(' ')).toMatch(/Effie Alexandra Acevedo Guasp/)
    expect(d6.career.join(' ')).toMatch(/Magdiel Colón/)
    expect(d6.career.join(' ')).toMatch(/Ricky Aponte/)
    expect(d6.career.join(' ')).toMatch(/28,173/)
    expect(d6.career.join(' ')).toMatch(/variantes Effie Guasp, Magdiel Ortiz y Ricardo Ricky Aponte/)
    expect(d6.career.join(' ')).toMatch(/OCE-B-21-239/)
    expect(d6.career.join(' ')).toMatch(/No se le atribuye OCE-B-21-239/)
    expect(d6.career.join(' ')).toMatch(/sin auditoría OCE publicada a su nombre/)
    expect(JSON.stringify(d6)).not.toMatch(/esposa|cónyuge|yerno/)
    expect(d6.aspirations.join(' ')).toMatch(/PC 644/)
    expect(d6.aspirations.join(' ')).toMatch(/RETIRADO/)
    expect(d6.aspirations.join(' ')).toMatch(/RCC 369/)
    expect(d6.aspirations.join(' ')).toMatch(/no se afirma autoría exclusiva/)
    expect(d6.aspirations.join(' ')).toMatch(/PC 139/)
    expect(d6.aspirations.join(' ')).toMatch(/Swanny E\. Vargas/)
    expect(d6.aspirations.join(' ')).toMatch(/148,872 dólares/)
    expect(d6.aspirations.join(' ')).toMatch(/RC 487/)
    expect(d6.aspirations.join(' ')).toMatch(/RC 456/)
    expect(d6.committees).toEqual(['Reorganización, Eficiencia y Diligencia'])
    expect(JSON.stringify(d6)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d6)).not.toMatch(/OCE-EB-24/)
    const facts = d6.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual(['swanny-e-vargas-laureano'])
    expect(facts).toHaveLength(1)
    expect(d6.connections.some((c) => c.toId === 'carlos-johnny-mendez-nunez')).toBe(false)
    expect(d6.connections.some((c) => c.toId === 'jorge-navarro-suarez')).toBe(false)
    const overlap = townOverlapConnections('angel-morey-noble')
    expect(overlap.some((c) => c.toId === 'jorge-navarro-suarez' && c.kind === 'inference')).toBe(
      true,
    )
    expect(overlap.some((c) => c.toId === 'luis-perez-ortiz')).toBe(true)
    expect(d6.connections.some((c) => c.kind === 'inference')).toBe(false)
    expect(d6.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraMorey.url,
        SRC.sutraMorey.url,
        SRC.ballotpediaMorey.url,
        SRC.wikiMorey.url,
        SRC.wikiAngelMoreyPadre.url,
        SRC.wiki2024House.url,
        SRC.endiMoreyJura.url,
        SRC.metroPC644.url,
        SRC.bayamonRCC369.url,
        SRC.primeraHoraPC139.url,
        SRC.oceD06_2020.url,
        SRC.oce2024Reps.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D7 de Pérez Ortiz con CEE 2024, OCE-B-21-317 y OCE-EB-24-129', () => {
    const d7 = DOSSIERS['luis-perez-ortiz']
    expect(d7.bio).toMatch(/5 de septiembre de 1955/)
    expect(d7.bio).toMatch(/Junior/)
    expect(d7.bio).toMatch(/lperez@camara\.pr\.gov/)
    expect(d7.bio).toMatch(/M-940-AL/)
    expect(d7.bio).toMatch(/721-6040/)
    expect(d7.bio).toMatch(/Asuntos Municipales/)
    expect(d7.career.join(' ')).toMatch(/Parcelas Van Scoy/)
    expect(d7.career.join(' ')).toMatch(/María Vázquez de Umpierre/)
    expect(d7.career.join(' ')).toMatch(/Agustín Stahl/)
    expect(d7.career.join(' ')).toMatch(/Holsum Bakers/)
    expect(d7.career.join(' ')).toMatch(/Ramón Luis Rivera/)
    expect(d7.career.join(' ')).toMatch(/no implica alianza/)
    expect(d7.career.join(' ')).toMatch(/1998/)
    expect(d7.career.join(' ')).toMatch(/primaria PNP de 2024 cancelada/i)
    expect(d7.career.join(' ')).toMatch(/11,889/)
    expect(d7.career.join(' ')).toMatch(/Zabdiel Rodríguez Nieves/)
    expect(d7.career.join(' ')).toMatch(/Marisel Álvarez Feliciano/)
    expect(d7.career.join(' ')).toMatch(/Johnny Rivera/)
    expect(d7.career.join(' ')).toMatch(/25,720/)
    expect(d7.career.join(' ')).toMatch(/variantes Janice Nieves, Marisel Feliciano y Juan Luis Rivera/)
    expect(d7.career.join(' ')).toMatch(/Casado desde 1978/)
    expect(d7.career.join(' ')).toMatch(/tres hijos/)
    expect(d7.career.join(' ')).toMatch(/cuatro hermanos/)
    expect(d7.career.join(' ')).toMatch(/OCE-B-21-317/)
    expect(d7.career.join(' ')).toMatch(/monto no extraído/)
    expect(d7.career.join(' ')).toMatch(/OCE-EB-24-129/)
    expect(JSON.stringify(d7)).not.toMatch(/Ramón Luis Rivera hijo|Rivera Cruz/)
    expect(d7.aspirations.join(' ')).toMatch(/RC 108/)
    expect(d7.aspirations.join(' ')).toMatch(/PC 6/)
    expect(d7.aspirations.join(' ')).toMatch(/PC 1209/)
    expect(d7.aspirations.join(' ')).toMatch(/RC 596/)
    expect(d7.aspirations.join(' ')).toMatch(/PC 997/)
    expect(d7.aspirations.join(' ')).toMatch(/RCC 254/)
    expect(d7.aspirations.join(' ')).toMatch(/RCC 202/)
    expect(d7.aspirations.join(' ')).toMatch(/74,000/)
    expect(d7.aspirations.join(' ')).toMatch(/107,000 dólares/)
    expect(d7.aspirations.join(' ')).toMatch(/PC 781/)
    expect(d7.aspirations.join(' ')).toMatch(/Space Force/)
    expect(d7.committees).toEqual(['Asuntos Municipales'])
    expect(d7.connections).toEqual([])
    expect(JSON.stringify(d7)).not.toMatch(/\$\d/)
    const overlap = townOverlapConnections('luis-perez-ortiz')
    expect(overlap.some((c) => c.toId === 'angel-morey-noble' && c.kind === 'inference')).toBe(true)
    expect(overlap.some((c) => c.toId === 'yashira-lebron-rodriguez')).toBe(true)
    expect(overlap.some((c) => c.toId === 'felix-pacheco-burgos')).toBe(true)
    expect(d7.connections.some((c) => c.toId === 'carlos-johnny-mendez-nunez')).toBe(false)
    expect(d7.connections.some((c) => c.toId === 'angel-morey-noble')).toBe(false)
    expect(d7.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraPerezOrtiz.url,
        SRC.sutraPerezOrtiz.url,
        SRC.ballotpediaPerezOrtiz.url,
        SRC.wikiPerezOrtiz.url,
        SRC.wiki2024House.url,
        SRC.ocePerez2020.url,
        SRC.oceD07_2020.url,
        SRC.oceD07_2024dl.url,
        SRC.oce2024Reps.url,
        SRC.cpaAsuntosMunicipales.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('expande la ficha de mesa de Lebrón D8 con CEE 2024, OCE y SUTRA M-941-AL', () => {
    const d8 = DOSSIERS['yashira-lebron-rodriguez']
    expect(d8.bio).toMatch(/24 de julio de 1981/)
    expect(d8.bio).toMatch(/primera mujer/i)
    expect(d8.bio).toMatch(/23 de octubre de 2014/)
    expect(d8.bio).toMatch(/ylebron@camara\.pr\.gov/)
    expect(d8.bio).toMatch(/M-941-AL/)
    expect(d8.bio).toMatch(/722-0801/)
    expect(d8.bio).toMatch(/vicepresidenta/i)
    expect(d8.career.join(' ')).toMatch(/Diego de Torres Vargas/)
    expect(d8.career.join(' ')).toMatch(/Jesús Sánchez Erazo/)
    expect(d8.career.join(' ')).toMatch(/Sthal/)
    expect(d8.career.join(' ')).toMatch(/Toñito Silva|Antonio «Toñito» Silva/)
    expect(d8.career.join(' ')).toMatch(/primaria PNP de 2024 cancelada/i)
    expect(d8.career.join(' ')).toMatch(/13,006/)
    expect(d8.career.join(' ')).toMatch(/Carlos A\. Sánchez Rivera/)
    expect(d8.career.join(' ')).toMatch(/Jesús M\. Dávila/)
    expect(d8.career.join(' ')).toMatch(/Abdiel Enrique Contreras Álvarez/)
    expect(d8.career.join(' ')).toMatch(/27,087/)
    expect(d8.career.join(' ')).toMatch(/Torres Zamora/)
    expect(d8.career.join(' ')).toMatch(/Calendario/)
    expect(d8.career.join(' ')).toMatch(/cuatrienio viejo|HECHO histórico/)
    expect(d8.career.join(' ')).toMatch(/OCE-B-21-138/)
    expect(d8.career.join(' ')).toMatch(/OCE-EB-24-160/)
    expect(d8.career.join(' ')).toMatch(/monto no extraído/)
    expect(d8.committees).toEqual([])
    expect(d8.committees).not.toContain('Calendario y Reglas Especiales de Debate')
    expect(DOSSIERS['jose-e-torres-zamora'].committees).toContain(
      'Calendario y Reglas Especiales de Debate',
    )
    expect(JSON.stringify(d8)).not.toMatch(/esposa|cónyuge|yerno/)
    expect(d8.aspirations.join(' ')).toMatch(/PC 420/)
    expect(d8.aspirations.join(' ')).toMatch(/no se afirma autoría/)
    expect(d8.aspirations.join(' ')).toMatch(/PC 101/)
    expect(d8.aspirations.join(' ')).toMatch(/PC 107/)
    expect(d8.aspirations.join(' ')).toMatch(/PC 385/)
    expect(d8.aspirations.join(' ')).toMatch(/PC 672/)
    expect(d8.aspirations.join(' ')).toMatch(/PC 1158/)
    expect(d8.aspirations.join(' ')).toMatch(/PC 1331/)
    expect(JSON.stringify(d8)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d8)).not.toMatch(/M-718/)
    const facts = d8.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual(['carlos-johnny-mendez-nunez', 'angel-r-pena-ramirez'])
    expect(facts).toHaveLength(2)
    expect(d8.connections.some((c) => c.toId === 'luis-perez-ortiz')).toBe(false)
    expect(d8.connections.some((c) => c.toId === 'felix-pacheco-burgos')).toBe(false)
    const overlap = townOverlapConnections('yashira-lebron-rodriguez')
    expect(overlap.some((c) => c.toId === 'luis-perez-ortiz' && c.kind === 'inference')).toBe(true)
    expect(overlap.some((c) => c.toId === 'angel-morey-noble')).toBe(true)
    expect(d8.connections.some((c) => c.kind === 'inference')).toBe(false)
    expect(d8.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraYashira.url,
        SRC.sutraYashira.url,
        SRC.ballotpediaYashira.url,
        SRC.wikiYashira.url,
        SRC.wiki2024House.url,
        SRC.oceYashira2020.url,
        SRC.oceD08_2020.url,
        SRC.oceYashira2024.url,
        SRC.oceD08_2024.url,
        SRC.oceD08_2024dl.url,
        SRC.esNoticia100.url,
        SRC.metroInaugural.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D9 de Pacheco con primaria 2024, CEE y OCE-EB-24-089', () => {
    const d9 = DOSSIERS['felix-pacheco-burgos']
    expect(d9.bio).toMatch(/3 de diciembre de 1988/)
    expect(d9.bio).toMatch(/fpacheco@camara\.pr\.gov/)
    expect(d9.bio).toMatch(/M-942-AL/)
    expect(d9.bio).toMatch(/Seguridad Pública/)
    expect(d9.career.join(' ')).toMatch(/Nancy Burgos/)
    expect(d9.career.join(' ')).toMatch(/Félix Pacheco/)
    expect(d9.career.join(' ')).toMatch(/cinco hermanos/)
    expect(d9.career.join(' ')).toMatch(/Violanta Jiménez/)
    expect(d9.career.join(' ')).toMatch(/Ana G\. Méndez/)
    expect(d9.career.join(' ')).toMatch(/4,055/)
    expect(d9.career.join(' ')).toMatch(/3,308/)
    expect(d9.career.join(' ')).toMatch(/Morales Díaz/)
    expect(d9.career.join(' ')).toMatch(/12,117/)
    expect(d9.career.join(' ')).toMatch(/Noelia Ramos Vázquez/)
    expect(d9.career.join(' ')).toMatch(/Gabriel Vicéns Rivera/)
    expect(d9.career.join(' ')).toMatch(/Anabel Sánchez/)
    expect(d9.career.join(' ')).toMatch(/26,292/)
    expect(d9.career.join(' ')).toMatch(/variantes Gabriel Rivera y Anabel Ayala/)
    expect(d9.career.join(' ')).toMatch(/OCE-B-21-250/)
    expect(d9.career.join(' ')).toMatch(/No se le atribuye OCE-B-21-250/)
    expect(d9.career.join(' ')).toMatch(/OCE-EB-24-089/)
    expect(d9.career.join(' ')).toMatch(/monto no extraído/)
    expect(JSON.stringify(d9)).not.toMatch(/esposa|cónyuge|yerno/)
    expect(d9.aspirations.join(' ')).toMatch(/PC 406/)
    expect(d9.aspirations.join(' ')).toMatch(/no se afirma autoría/)
    expect(d9.aspirations.join(' ')).toMatch(/PC 631/)
    expect(d9.aspirations.join(' ')).toMatch(/Experience/)
    expect(d9.aspirations.join(' ')).toMatch(/RC 37/)
    expect(d9.aspirations.join(' ')).toMatch(/Joseph González/)
    expect(d9.aspirations.join(' ')).toMatch(/no implica alianza/)
    expect(d9.aspirations.join(' ')).toMatch(/PC 1139/)
    expect(d9.aspirations.join(' ')).toMatch(/PC 1144/)
    expect(d9.aspirations.join(' ')).toMatch(/PC 633/)
    expect(d9.committees).toEqual(['Seguridad Pública'])
    expect(d9.connections).toEqual([])
    expect(JSON.stringify(d9)).not.toMatch(/\$\d/)
    expect(d9.connections.some((c) => c.toId === 'yashira-lebron-rodriguez')).toBe(false)
    expect(d9.connections.some((c) => c.toId === 'luis-perez-ortiz')).toBe(false)
    expect(d9.connections.some((c) => c.toId === 'carlos-johnny-mendez-nunez')).toBe(false)
    const overlap = townOverlapConnections('felix-pacheco-burgos')
    expect(overlap.some((c) => c.toId === 'yashira-lebron-rodriguez' && c.kind === 'inference')).toBe(
      true,
    )
    expect(overlap.some((c) => c.toId === 'luis-perez-ortiz')).toBe(true)
    expect(d9.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraPacheco.url,
        SRC.sutraPacheco.url,
        SRC.ballotpediaPacheco.url,
        SRC.wiki2024House.url,
        SRC.ocePacheco2024.url,
        SRC.oceD09_2024dl.url,
        SRC.oceD09_2020.url,
        SRC.oce2024Reps.url,
        SRC.voceroPC406.url,
        SRC.voceroCuarteles.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D10 de Pellé con CEE 2024, OCE-EB-24-149 y sin montos inventados', () => {
    const d10 = DOSSIERS['pedro-j-pelle-santiago-guzman']
    expect(d10.id).toBe('pedro-j-pelle-santiago-guzman')
    expect(d10.id).not.toBe('pedro-santiago-guzman')
    expect(d10.bio).toMatch(/Distrito 10/)
    expect(d10.bio).toMatch(/25 de marzo de 1961/)
    expect(d10.bio).toMatch(/Wikipedia EN/)
    expect(d10.bio).toMatch(/sin refs|References vacías/)
    expect(d10.bio).toMatch(/No consta en la ficha oficial/)
    expect(d10.bio).toMatch(/psantiago@camara\.pr\.gov/)
    expect(d10.bio).toMatch(/M-943-AL/)
    expect(d10.bio).toMatch(/Asuntos Interiores/)
    expect(d10.career.join(' ')).toMatch(/10,528/)
    expect(d10.career.join(' ')).toMatch(/42\.2%/)
    expect(d10.career.join(' ')).toMatch(/24,927/)
    expect(d10.career.join(' ')).toMatch(/Sahir I\. Pujols Vázquez/)
    expect(d10.career.join(' ')).toMatch(/Sahir Vazquez/)
    expect(d10.career.join(' ')).toMatch(/9,846/)
    expect(d10.career.join(' ')).toMatch(/10,106/)
    expect(d10.career.join(' ')).toMatch(/2 de enero de 2021/)
    expect(d10.career.join(' ')).toMatch(/no se usa/)
    expect(d10.career.join(' ')).not.toMatch(/9,709|9,359/)
    expect(d10.career.join(' ')).toMatch(/totales publicados no coinciden/)
    expect(d10.career.join(' ')).toMatch(/3,746–3,688/)
    expect(d10.career.join(' ')).toMatch(/2,893–2,824/)
    expect(d10.career.join(' ')).toMatch(/CEE HTML no extraído/)
    expect(d10.career.join(' ')).toMatch(/No se certifica un par como CEE/)
    expect(d10.career.join(' ')).toMatch(/vicealcalde/)
    expect(d10.career.join(' ')).toMatch(/Autoatribución/)
    expect(d10.career.join(' ')).toMatch(/14,100 dólares/)
    expect(d10.career.join(' ')).toMatch(/Montos de pensión no publicados/)
    expect(d10.career.join(' ')).toMatch(/Sistema de Retiro/)
    expect(d10.career.join(' ')).toMatch(/No se afirma vicepresidencia de Salud/)
    expect(d10.career.join(' ')).toMatch(/OCE-EB-24-149/)
    expect(d10.career.join(' ')).toMatch(/OCE-18-020/)
    expect(d10.career.join(' ')).toMatch(/monto no extraído/)
    expect(d10.career.join(' ')).toMatch(/No se le atribuyen OCE-EB-24-150/)
    expect(d10.career.join(' ')).toMatch(/Asuntos Internos/)
    expect(d10.career.join(' ')).toMatch(/Interiores vs Internos/)
    expect(d10.aspirations.join(' ')).toMatch(/RC 756/)
    expect(d10.aspirations.join(' ')).toMatch(/PC 651/)
    expect(d10.aspirations.join(' ')).toMatch(/no implica alianza/)
    expect(d10.committees).toEqual(['Asuntos Internos'])
    expect(d10.committees).not.toContain('Sistema de Retiro')
    const facts = d10.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual(['lisie-j-burgos-muniz'])
    expect(facts[0].label).toMatch(/no implica alianza/)
    expect(d10.connections.some((c) => c.toId === 'maria-de-lourdes-ramos-rivera')).toBe(false)
    expect(JSON.stringify(d10)).not.toMatch(/\$\d/)
    expect(d10.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraPelle.url,
        SRC.sutraPelle.url,
        SRC.ballotpediaPelle.url,
        SRC.wikiPelle.url,
        SRC.wiki2024House.url,
        SRC.ocePelle2024.url,
        SRC.oceD10_2024.url,
        SRC.ocePelle2020.url,
        SRC.oceD10_2020.url,
        SRC.ocePelle2016.url,
        SRC.telemundoPellePrimaria.url,
        SRC.metroPellePrimaria.url,
        SRC.victoria840Pelle2016.url,
        SRC.metroDietasPelle.url,
        SRC.metroPC651.url,
        SRC.sutraPC651.url,
        SRC.ceeElectos2012.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D11 de Elinette con CEE 2024, OCE-EB-24-029 y sin monto', () => {
    const d11 = DOSSIERS['elinette-gonzalez-aguayo']
    expect(d11.id).toBe('elinette-gonzalez-aguayo')
    expect(d11.bio).toMatch(/27 de agosto de 1973/)
    expect(d11.bio).toMatch(/elgonzalez@camara\.pr\.gov/)
    expect(d11.bio).toMatch(/M-944-AL/)
    expect(d11.bio).toMatch(/622-4486/)
    expect(d11.career.join(' ')).toMatch(/11,262/)
    expect(d11.career.join(' ')).toMatch(/43\.2%/)
    expect(d11.career.join(' ')).toMatch(/OCE-EB-24-029/)
    expect(d11.career.join(' ')).toMatch(/monto no extraído/)
    expect(d11.career.join(' ')).toMatch(/Rossner Marrero/)
    expect(d11.career.join(' ')).toMatch(/Angel de Leon/)
    expect(d11.career.join(' ')).toMatch(/Wikipedia EN y ES/)
    expect(d11.career.join(' ')).toMatch(/no se presenta como XML CEE/)
    expect(d11.career.join(' ')).toMatch(/No se le atribuyen OCE-EB-24-030/)
    expect(d11.career.join(' ')).toMatch(/no se le atribuyen en solitario RCC 191/)
    expect(d11.career.join(' ')).toMatch(/PC 1079/)
    expect(d11.career.join(' ')).toMatch(/no autoría/)
    expect(d11.career.join(' ')).toMatch(/no es pariente/)
    expect(d11.career.join(' ')).not.toMatch(/LinkedIn/)
    expect(d11.aspirations.join(' ')).toMatch(/RCC 58|Res\. Conj\. 19-2025/)
    expect(d11.aspirations.join(' ')).toMatch(/RC 557/)
    expect(d11.aspirations.join(' ')).toMatch(/RC 489/)
    expect(d11.aspirations.join(' ')).toMatch(/Autores = 1/)
    expect(d11.committees).toEqual(['Recursos Naturales'])
    expect(JSON.stringify(d11)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d11)).not.toMatch(/M-943-AL/)
    const facts = d11.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual(['edgardo-feliciano-sanchez', 'jose-f-aponte-hernandez'])
    expect(facts.every((c) => /no implica alianza/.test(c.label))).toBe(true)
    expect(d11.connections.some((c) => c.toId === 'carlos-johnny-mendez-nunez')).toBe(false)
    expect(d11.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraElinette.url,
        SRC.sutraElinette.url,
        SRC.ballotpediaElinette.url,
        SRC.wiki2024House.url,
        SRC.wiki2024HouseES.url,
        SRC.oceElinette2024.url,
        SRC.oceD11_2024.url,
        SRC.oceD11_2020.url,
        SRC.sutraRCC0058.url,
        SRC.sutraRCC0191.url,
        SRC.wiprRCC58.url,
        SRC.victoria840PC1079.url,
        SRC.metroPC269.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D12 de Feliciano con CEE 11,869, OCE-B-21-340 y montos extraídos', () => {
    const d12 = DOSSIERS['edgardo-feliciano-sanchez']
    expect(d12.id).toBe('edgardo-feliciano-sanchez')
    expect(d12.bio).toMatch(/30 de enero de 1976/)
    expect(d12.bio).toMatch(/efeliciano@camara\.pr\.gov/)
    expect(d12.bio).toMatch(/M-945-AL/)
    expect(d12.bio).toMatch(/622-4965/)
    expect(d12.bio).toMatch(/Morovis, Manatí y Vega Baja/)
    expect(d12.bio).toMatch(/no incluyen Vega Alta/)
    expect(d12.bio).toMatch(/portavoz/)
    expect(d12.career.join(' ')).toMatch(/11,869/)
    expect(d12.career.join(' ')).toMatch(/39\.8%/)
    expect(d12.career.join(' ')).toMatch(/12,116/)
    expect(d12.career.join(' ')).toMatch(/OCE-B-21-340/)
    expect(d12.career.join(' ')).toMatch(/15,594\.97/)
    expect(d12.career.join(' ')).toMatch(/1\.29/)
    expect(d12.career.join(' ')).toMatch(/5,509\.83/)
    expect(d12.career.join(' ')).toMatch(/OCE-NMA-2023-037/)
    expect(d12.career.join(' ')).toMatch(/250 dólares/)
    expect(d12.career.join(' ')).not.toMatch(/monto no extraído/)
    expect(d12.career.join(' ')).not.toMatch(/11,574/)
    expect(d12.career.join(' ')).not.toMatch(/11,807/)
    expect(d12.career.join(' ')).toMatch(/Jesús \(Nolo\) Figueroa/)
    expect(d12.career.join(' ')).toMatch(/Anamari Ojeda Vilá/)
    expect(d12.career.join(' ')).toMatch(/No se le atribuyen OCE-B-21-339/)
    expect(d12.career.join(' ')).toMatch(/sin docket 2024 publicado para D12/)
    expect(d12.career.join(' ')).toMatch(/No se afirma que Omar sea Luis O/)
    expect(d12.career.join(' ')).toMatch(/HECHO histórico/)
    expect(d12.career.join(' ')).toMatch(/ENDI 1 mar 2024/)
    expect(d12.career.join(' ')).toMatch(/applyCommissions no lo marca presidente/)
    expect(d12.career.join(' ')).toMatch(/no se le atribuyen en solitario RCC 191/)
    expect(d12.career.join(' ')).toMatch(/No se tratan RCC 39 ni RCC 338/)
    expect(d12.aspirations.join(' ')).toMatch(/RCC 40/)
    expect(d12.aspirations.join(' ')).toMatch(/RCC 41/)
    expect(d12.aspirations.join(' ')).toMatch(/RCC 43/)
    expect(d12.aspirations.join(' ')).toMatch(/RCC 61/)
    expect(d12.aspirations.join(' ')).toMatch(/RCC 159/)
    expect(d12.aspirations.join(' ')).toMatch(/RCC 211/)
    expect(d12.aspirations.join(' ')).toMatch(/RCC 281/)
    expect(d12.aspirations.join(' ')).toMatch(/Autores = 1/)
    expect(d12.aspirations.join(' ')).not.toMatch(/RCC 39|RCC 338/)
    expect(d12.committees).toEqual([])
    expect(d12.committees).not.toContain('Recursos Naturales')
    expect(d12.committees).not.toContain('Región Norte')
    expect(JSON.stringify(d12)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d12)).not.toMatch(/M-944-AL/)
    const facts = d12.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual([
      'elinette-gonzalez-aguayo',
      'jerry-nieves-rosario',
      'gabriel-rodriguez-aguilo',
    ])
    expect(facts.every((c) => /no implica alianza/.test(c.label))).toBe(true)
    expect(d12.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraFeliciano.url,
        SRC.sutraFeliciano.url,
        SRC.ballotpediaFeliciano.url,
        SRC.wiki2024House.url,
        SRC.oceFeliciano2020.url,
        SRC.oceD12_2020.url,
        SRC.oce2024Reps.url,
        SRC.endiPlasticosFeliciano.url,
        SRC.sutraRCC0040.url,
        SRC.sutraRCC0191.url,
        SRC.sutraPC0275.url,
        SRC.sutraPC1184.url,
        SRC.sutraRCC0055.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D13 de Nieves con CEE 12,518, OCE-EB-24-096 y sin monto', () => {
    const d13 = DOSSIERS['jerry-nieves-rosario']
    expect(d13.id).toBe('jerry-nieves-rosario')
    expect(d13.id).not.toBe('jerry-zahamir-nieves-rosario')
    expect(d13.bio).toMatch(/Jerry Zahamir Nieves Rosario/)
    expect(d13.bio).toMatch(/26 de octubre de 1988/)
    expect(d13.bio).toMatch(/Arecibo/)
    expect(d13.bio).toMatch(/Ballotpedia vs ficha/)
    expect(d13.bio).toMatch(/Manatí/)
    expect(d13.bio).toMatch(/jnieves@camara\.pr\.gov/)
    expect(d13.bio).toMatch(/M-946-AL/)
    expect(d13.bio).toMatch(/723-6136/)
    expect(d13.bio).toMatch(/Región Norte/)
    expect(d13.career.join(' ')).toMatch(/12,518/)
    expect(d13.career.join(' ')).toMatch(/45\.8%/)
    expect(d13.career.join(' ')).toMatch(/27,337/)
    expect(d13.career.join(' ')).toMatch(/3,506/)
    expect(d13.career.join(' ')).toMatch(/Yulixa Paredes Albarrán/)
    expect(d13.career.join(' ')).toMatch(/Kevin C\. Cruz Chacón/)
    expect(d13.career.join(' ')).toMatch(/Teresa Vélez Rolón/)
    expect(d13.career.join(' ')).toMatch(/Yulixa Albarán/)
    expect(d13.career.join(' ')).toMatch(/Alexis Valle Martínez/)
    expect(d13.career.join(' ')).toMatch(/3,931/)
    expect(d13.career.join(' ')).toMatch(/3,520/)
    expect(d13.career.join(' ')).toMatch(/7,451/)
    expect(d13.career.join(' ')).toMatch(/Hector Diaz Vanga/)
    expect(d13.career.join(' ')).toMatch(/CEE HTML no extraído/)
    expect(d13.career.join(' ')).toMatch(/PDF locked/)
    expect(d13.career.join(' ')).toMatch(/Gabriel Rodríguez Aguiló/)
    expect(d13.career.join(' ')).toMatch(/25 de marzo de 2022/)
    expect(d13.career.join(' ')).toMatch(/Open seat|open seat|Primera vez/i)
    expect(d13.career.join(' ')).toMatch(/OCE-EB-24-096/)
    expect(d13.career.join(' ')).toMatch(/monto no extraído/)
    expect(d13.career.join(' ')).toMatch(/No se le atribuyen OCE-EB-24-097/)
    expect(d13.career.join(' ')).toMatch(/OCE-A-21-052/)
    expect(d13.career.join(' ')).toMatch(/Sin docket 2020 a su nombre/)
    expect(d13.career.join(' ')).toMatch(/Alondra Paola Nieves Dalmau/)
    expect(d13.career.join(' ')).toMatch(/no es dinastía/)
    expect(d13.career.join(' ')).toMatch(/heredó de su madre/)
    expect(d13.career.join(' ')).toMatch(/no se infiere cargo/)
    expect(d13.career.join(' ')).toMatch(/no se le atribuye en solitario el PC 1184/)
    expect(d13.career.join(' ')).not.toMatch(/OCE-EB-24-096.*\d[\d,]+\.\d{2} dólares/)
    expect(d13.aspirations.join(' ')).toMatch(/PC 512/)
    expect(d13.aspirations.join(' ')).toMatch(/Sabor de las Atenas/)
    expect(d13.aspirations.join(' ')).toMatch(/PR-685/)
    expect(d13.aspirations.join(' ')).toMatch(/PC 1173/)
    expect(d13.aspirations.join(' ')).toMatch(/RCC 57/)
    expect(d13.aspirations.join(' ')).toMatch(/RCC 50/)
    expect(d13.aspirations.join(' ')).toMatch(/RC 282/)
    expect(d13.aspirations.join(' ')).toMatch(/RCC 84/)
    expect(d13.aspirations.join(' ')).toMatch(/RC 416/)
    expect(d13.aspirations.join(' ')).toMatch(/RCC 385/)
    expect(d13.aspirations.join(' ')).toMatch(/PC 1237/)
    expect(d13.aspirations.join(' ')).toMatch(/Ríos Grande de Arecibo/)
    expect(d13.aspirations.join(' ')).toMatch(/RC 29/)
    expect(d13.aspirations.join(' ')).toMatch(/Islote/)
    expect(d13.aspirations.join(' ')).toMatch(/RCC 300/)
    expect(d13.aspirations.join(' ')).toMatch(/Finca Banco A/)
    expect(d13.aspirations.join(' ')).toMatch(/Autores = 1/)
    expect(d13.career.join(' ')).toMatch(/RCC 24/)
    expect(d13.career.join(' ')).toMatch(/PC 243/)
    expect(d13.career.join(' ')).toMatch(/Edgar Robles Rivera/)
    expect(d13.committees).toEqual(['Región Norte'])
    expect(d13.committees).not.toContain('Recreación y Deportes')
    expect(d13.committees).not.toContain('Salud')
    expect(JSON.stringify(d13)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d13)).not.toMatch(/M-945-AL/)
    const facts = d13.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual([
      'gabriel-rodriguez-aguilo',
      'gabriel-rodriguez-aguilo',
      'edgar-robles-rivera',
      'edgardo-feliciano-sanchez',
    ])
    expect(facts[0].label).toMatch(/Sucesión/)
    expect(facts[1].label).toMatch(/RCC 24/)
    expect(facts[1].label).toMatch(/PC 243/)
    expect(facts[2].label).toMatch(/PC 243/)
    expect(facts.every((c) => /no implica alianza/.test(c.label))).toBe(true)
    expect(d13.connections.some((c) => c.toId === 'carlos-johnny-mendez-nunez')).toBe(false)
    expect(d13.connections.some((c) => c.kind === 'inference')).toBe(false)
    const overlap = townOverlapConnections('jerry-nieves-rosario')
    expect(overlap.some((c) => c.toId === 'edgardo-feliciano-sanchez' && c.kind === 'inference')).toBe(
      true,
    )
    expect(overlap.some((c) => c.toId === 'edgar-robles-rivera')).toBe(true)
    expect(d13.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraJerry.url,
        SRC.sutraJerry.url,
        SRC.sutraDirectorio.url,
        SRC.ballotpediaJerry.url,
        SRC.wiki2024House.url,
        SRC.oceJerry2024.url,
        SRC.oceD13_2024.url,
        SRC.oceD13_2020.url,
        SRC.voceroPapeletaPNP2024.url,
        SRC.insPC512.url,
        SRC.sutraPC0512.url,
        SRC.sutraPC1173.url,
        SRC.sutraPC1184.url,
        SRC.sutraRCC0057.url,
        SRC.sutraRCC0050.url,
        SRC.sutraRC0282.url,
        SRC.sutraRCC0084.url,
        SRC.sutraRC0416.url,
        SRC.sutraRCC0385.url,
        SRC.sutraPC1237.url,
        SRC.sutraRC0029.url,
        SRC.sutraRCC0300.url,
        SRC.sutraRCC0024.url,
        SRC.sutraPC0243.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D14 de Robles con CEE 13,087, OCE-EB-24-103 y sin monto', () => {
    const d14 = DOSSIERS['edgar-robles-rivera']
    expect(d14.id).toBe('edgar-robles-rivera')
    expect(d14.id).not.toBe('edgard-robles-rivera')
    expect(d14.bio).toMatch(/Edgar Robles Rivera/)
    expect(d14.bio).toMatch(/Arecibo/)
    expect(d14.bio).toMatch(/Hatillo/)
    expect(d14.bio).toMatch(/Asuntos del Consumidor/)
    expect(d14.bio).toMatch(/ficha oficial es delgada/)
    expect(d14.bio).toMatch(/erobles@camara\.pr\.gov/)
    expect(d14.bio).toMatch(/M-947-AL/)
    expect(d14.bio).toMatch(/725-9189/)
    expect(d14.career.join(' ')).toMatch(/13,087/)
    expect(d14.career.join(' ')).toMatch(/43\.0%/)
    expect(d14.career.join(' ')).toMatch(/30,431/)
    expect(d14.career.join(' ')).toMatch(/1,403/)
    expect(d14.career.join(' ')).toMatch(/Juan Carlos Colón González/)
    expect(d14.career.join(' ')).toMatch(/Daniel Batista Crespo/)
    expect(d14.career.join(' ')).toMatch(/Karina García/)
    expect(d14.career.join(' ')).toMatch(/Deniel Batista/)
    expect(d14.career.join(' ')).toMatch(/Karina Garcia/)
    expect(d14.career.join(' ')).toMatch(/Karina M\. García Medina/)
    expect(d14.career.join(' ')).toMatch(/Abraham Cortés Vélez/)
    expect(d14.career.join(' ')).toMatch(/6,146/)
    expect(d14.career.join(' ')).toMatch(/2,525/)
    expect(d14.career.join(' ')).toMatch(/8,671/)
    expect(d14.career.join(' ')).toMatch(/CEE HTML\/XML no extraído/)
    expect(d14.career.join(' ')).toMatch(/José González Mercado/)
    expect(d14.career.join(' ')).toMatch(/alcalde de Arecibo/)
    expect(d14.career.join(' ')).toMatch(/Open seat|open seat|Primera vez/i)
    expect(d14.career.join(' ')).toMatch(/sitio de campaña, no ficha oficial/)
    expect(d14.career.join(' ')).toMatch(/21 de septiembre de 1975/)
    expect(d14.career.join(' ')).toMatch(/La ficha de Cámara no publica fecha de nacimiento/)
    expect(d14.career.join(' ')).toMatch(/Juan Robles Pantoja/)
    expect(d14.career.join(' ')).toMatch(/padre de dos/)
    expect(d14.career.join(' ')).toMatch(/no es dinastía/)
    expect(d14.career.join(' ')).toMatch(/La Meseta/)
    expect(d14.career.join(' ')).toMatch(/Caleb/)
    expect(d14.career.join(' ')).toMatch(/Débora/)
    expect(d14.career.join(' ')).toMatch(/opinión firmada/)
    expect(d14.career.join(' ')).toMatch(/no está en la ficha de Cámara/)
    expect(d14.career.join(' ')).toMatch(/OCE-EB-24-103/)
    expect(d14.career.join(' ')).toMatch(/PDF locked/)
    expect(d14.career.join(' ')).toMatch(/monto no extraído/)
    expect(d14.career.join(' ')).toMatch(/No se le atribuyen OCE-EB-24-104/)
    expect(d14.career.join(' ')).toMatch(/OCE-B-21-120/)
    expect(d14.career.join(' ')).toMatch(/Sin docket 2020 a su nombre/)
    expect(d14.career.join(' ')).toMatch(/no se le atribuye en solitario el PC 243/)
    expect(d14.career.join(' ')).toMatch(/PC 180/)
    expect(d14.career.join(' ')).toMatch(/no es suyo solo/)
    expect(d14.career.join(' ')).toMatch(/Swanny E\. Vargas Laureano/)
    expect(d14.career.join(' ')).toMatch(/Joe Colón Rodríguez/)
    expect(d14.career.join(' ')).toMatch(/PC 385/)
    expect(d14.career.join(' ')).not.toMatch(/11,423/)
    expect(d14.career.join(' ')).not.toMatch(/OCE-EB-24-103.*\d[\d,]+\.\d{2} dólares/)
    expect(d14.aspirations.join(' ')).not.toMatch(/PC 180/)
    expect(d14.aspirations.join(' ')).toMatch(/RC 249/)
    expect(d14.aspirations.join(' ')).toMatch(/iluminación/)
    expect(d14.aspirations.join(' ')).toMatch(/RC 289/)
    expect(d14.aspirations.join(' ')).toMatch(/no anuncian el precio/)
    expect(d14.aspirations.join(' ')).toMatch(/RC 317/)
    expect(d14.aspirations.join(' ')).toMatch(/PC 786/)
    expect(d14.aspirations.join(' ')).toMatch(/PC 833/)
    expect(d14.aspirations.join(' ')).toMatch(/RC 649/)
    expect(d14.aspirations.join(' ')).toMatch(/residenciales públicos/)
    expect(d14.aspirations.join(' ')).toMatch(/RC 668/)
    expect(d14.aspirations.join(' ')).toMatch(/La Puntilla/)
    expect(d14.aspirations.join(' ')).toMatch(/El Fuerte/)
    expect(d14.aspirations.join(' ')).toMatch(/Autores = 1/)
    expect(d14.aspirations.join(' ')).not.toMatch(/PC 632/)
    expect(d14.aspirations.join(' ')).not.toMatch(/RC 719/)
    expect(d14.committees).toEqual(['Asuntos del Consumidor'])
    expect(d14.committees).not.toContain('Región Norte')
    expect(d14.committees).not.toContain('Salud')
    expect(JSON.stringify(d14)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d14)).not.toMatch(/M-946-AL/)
    expect(JSON.stringify(d14)).not.toMatch(/sengov/)
    const facts = d14.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual([
      'jerry-nieves-rosario',
      'gabriel-rodriguez-aguilo',
      'swanny-e-vargas-laureano',
      'joe-joito-colon-rodriguez',
    ])
    expect(facts[0].label).toMatch(/PC 243/)
    expect(facts[1].label).toMatch(/PC 243/)
    expect(facts[2].label).toMatch(/PC 180/)
    expect(facts[3].label).toMatch(/PC 180/)
    expect(facts.every((c) => /no implica alianza/.test(c.label))).toBe(true)
    expect(d14.connections.some((c) => c.kind === 'inference')).toBe(false)
    const overlap = townOverlapConnections('edgar-robles-rivera')
    expect(overlap.some((c) => c.toId === 'jerry-nieves-rosario' && c.kind === 'inference')).toBe(
      true,
    )
    expect(overlap.some((c) => c.toId === 'joel-i-franqui-atiles')).toBe(true)
    expect(d14.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraRobles.url,
        SRC.camaraRoblesEN.url,
        SRC.sutraRobles.url,
        SRC.sutraDirectorio.url,
        SRC.ballotpediaRobles.url,
        SRC.wiki2024House.url,
        SRC.wiki2024HouseES.url,
        SRC.oceRobles2024.url,
        SRC.oceD14_2024.url,
        SRC.oceD14_2020.url,
        SRC.campaignRobles.url,
        SRC.islaNewsRoblesPapa.url,
        SRC.visionPC180.url,
        SRC.sutraPC0180.url,
        SRC.sutraPC0243.url,
        SRC.sutraPC0786.url,
        SRC.sutraPC0833.url,
        SRC.sutraRC0249.url,
        SRC.sutraRC0289.url,
        SRC.sutraRC0317.url,
        SRC.sutraRC0649.url,
        SRC.sutraRC0668.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D15 de Franqui con CEE 17,679, OCE-B-21-198 y 31,571.58 dólares', () => {
    const d15 = DOSSIERS['joel-i-franqui-atiles']
    expect(d15.id).toBe('joel-i-franqui-atiles')
    expect(d15.bio).toMatch(/Joel I\. Franqui Atiles/)
    expect(d15.bio).toMatch(/Hatillo/)
    expect(d15.bio).toMatch(/Camuy/)
    expect(d15.bio).toMatch(/Quebradillas/)
    expect(d15.bio).toMatch(/Desarrollo Económico/)
    expect(d15.bio).toMatch(/ficha oficial es delgada/)
    expect(d15.bio).toMatch(/NO tiene línea Presidente/)
    expect(d15.bio).toMatch(/jfranqui@camara\.pr\.gov/)
    expect(d15.bio).toMatch(/M-948-AL/)
    expect(d15.bio).toMatch(/legislador numérico 948/)
    expect(d15.bio).toMatch(/721-4949/)
    expect(d15.bio).toMatch(/Phone: Economic Development Commission/)
    expect(d15.bio).toMatch(/no es un número de teléfono/)
    expect(d15.bio).toMatch(/no consta en la ficha oficial/)
    expect(d15.bio).toMatch(/2 de enero de 2017/)
    expect(d15.bio).toMatch(/2 de enero de 2029/)
    expect(d15.career.join(' ')).toMatch(/17,679/)
    expect(d15.career.join(' ')).toMatch(/51\.6%/)
    expect(d15.career.join(' ')).toMatch(/34,258/)
    expect(d15.career.join(' ')).toMatch(/7,625/)
    expect(d15.career.join(' ')).toMatch(/Iván Serrano/)
    expect(d15.career.join(' ')).toMatch(/Iván Serrano Cordero/)
    expect(d15.career.join(' ')).toMatch(/10,054/)
    expect(d15.career.join(' ')).toMatch(/Abiatar Ramos Jiménez/)
    expect(d15.career.join(' ')).toMatch(/Fernando Babilonia Aguilar/)
    expect(d15.career.join(' ')).toMatch(/Primaria PNP 2024 cancelada/)
    expect(d15.career.join(' ')).not.toMatch(/14,497/)
    expect(d15.career.join(' ')).toMatch(/15,312/)
    expect(d15.career.join(' ')).toMatch(/14,769/)
    expect(d15.career.join(' ')).toMatch(/No se certifica un par como CEE HTML/)
    expect(d15.career.join(' ')).toMatch(/César A\. Hernández Alfonzo/)
    expect(d15.career.join(' ')).toMatch(/Gladys M\. Canals Portalatín/)
    expect(d15.career.join(' ')).toMatch(/Totales de votos 2016 no extraídos/)
    expect(d15.career.join(' ')).toMatch(/OCE-18-014/)
    expect(d15.career.join(' ')).toMatch(/monto no extraído/)
    expect(d15.career.join(' ')).toMatch(/OCE-B-21-198/)
    expect(d15.career.join(' ')).toMatch(/31,571\.58 dólares/)
    expect(d15.career.join(' ')).toMatch(/Amigos Joel Franqui Atiles/)
    expect(d15.career.join(' ')).toMatch(/Joel Isaac Franqui Atiles/)
    expect(d15.career.join(' ')).toMatch(/Juan José Peraza Batista/)
    expect(d15.career.join(' ')).toMatch(/OCE-NMA-2022-148/)
    expect(d15.career.join(' ')).toMatch(/no hay auditoría 2024 publicada a su nombre/)
    expect(d15.career.join(' ')).toMatch(/Irelis Pérez Cintrón/)
    expect(d15.career.join(' ')).toMatch(/Learn & Grow/)
    expect(d15.career.join(' ')).toMatch(/no hay récord público citado de un familiar sentado/)
    expect(d15.career.join(' ')).toMatch(/Alejito Cubero Padín/)
    expect(d15.career.join(' ')).toMatch(/Gabriel ‘Gaby’ Hernández/)
    expect(d15.career.join(' ')).toMatch(/Heriberto Vélez/)
    expect(d15.career.join(' ')).toMatch(/Maam Vale/)
    expect(d15.career.join(' ')).toMatch(/Carlos E\. Román Román/)
    expect(d15.career.join(' ')).toMatch(/no se afirma que asistiera/)
    expect(d15.career.join(' ')).toMatch(/Brenda Pérez/)
    expect(d15.career.join(' ')).toMatch(/Héctor ‘Gaby’ González/)
    expect(d15.career.join(' ')).toMatch(/no se le atribuyen en solitario RCC 226/)
    expect(d15.career.join(' ')).toMatch(/primer autor Carlos/)
    expect(d15.aspirations.join(' ')).toMatch(/PC 684/)
    expect(d15.aspirations.join(' ')).toMatch(/Túnel Oscuro/)
    expect(d15.aspirations.join(' ')).toMatch(/RCC 145/)
    expect(d15.aspirations.join(' ')).toMatch(/Finca Nolla/)
    expect(d15.aspirations.join(' ')).toMatch(/RCC 146/)
    expect(d15.aspirations.join(' ')).toMatch(/Área Escénica/)
    expect(d15.aspirations.join(' ')).toMatch(/RCC 147/)
    expect(d15.aspirations.join(' ')).toMatch(/Cavernas del Río Camuy/)
    expect(d15.aspirations.join(' ')).toMatch(/PC 682/)
    expect(d15.aspirations.join(' ')).toMatch(/PC 683/)
    expect(d15.aspirations.join(' ')).toMatch(/PC 685/)
    expect(d15.aspirations.join(' ')).toMatch(/RC 341/)
    expect(d15.aspirations.join(' ')).toMatch(/PC 699/)
    expect(d15.aspirations.join(' ')).toMatch(/Autores = 1/)
    expect(d15.aspirations.join(' ')).not.toMatch(/RCC 226/)
    expect(d15.aspirations.join(' ')).not.toMatch(/RCC 92/)
    expect(d15.committees).toEqual(['Desarrollo Económico'])
    expect(JSON.stringify(d15)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d15)).not.toMatch(/OCE-EB-24/)
    expect(JSON.stringify(d15)).not.toMatch(/M-947-AL/)
    expect(JSON.stringify(d15)).not.toMatch(/sengov/)
    const facts = d15.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual([
      'carlos-johnny-mendez-nunez',
      'edgar-robles-rivera',
      'jerry-nieves-rosario',
    ])
    expect(facts[0].label).toMatch(/oficina de Camuy/)
    expect(facts[1].label).toMatch(/oficina de Camuy/)
    expect(facts[2].label).toMatch(/oficina de Camuy/)
    expect(facts.every((c) => c.sources.some((s) => s.url === SRC.visionFranquiCamuy.url))).toBe(
      true,
    )
    expect(facts.every((c) => /no implica alianza/.test(c.label))).toBe(true)
    expect(d15.connections.some((c) => c.kind === 'inference')).toBe(false)
    const overlap = townOverlapConnections('joel-i-franqui-atiles')
    expect(overlap.some((c) => c.toId === 'edgar-robles-rivera' && c.kind === 'inference')).toBe(
      true,
    )
    expect(d15.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraFranqui.url,
        SRC.sutraFranqui.url,
        SRC.sutraDirectorioFranqui.url,
        SRC.ballotpediaFranqui.url,
        SRC.wiki2024House.url,
        SRC.wiki2020House.url,
        SRC.oceFranqui2020.url,
        SRC.oce2024Reps.url,
        SRC.visionFranquiCamuy.url,
        SRC.primeraHoraFranquiEsposa.url,
        SRC.sutraPC0684.url,
        SRC.sutraRCC0145.url,
        SRC.sutraRCC0146.url,
        SRC.sutraRCC0147.url,
        SRC.microjurisComisiones.url,
      ]),
    )
  })

  it('codifica el D16 de Figueroa con CEE 13,298, sin OCE y RC 56 Autores=1', () => {
    const d16 = DOSSIERS['reinaldo-rey-figueroa']
    expect(d16.id).toBe('reinaldo-rey-figueroa')
    expect(d16.bio).toMatch(/Reinaldo ‘Rey’ Figueroa|Reinaldo Figueroa Acevedo/)
    expect(d16.bio).toMatch(/Figueroa Acevedo/)
    expect(d16.bio).toMatch(/Distrito 16/)
    expect(d16.bio).toMatch(/Isabela/)
    expect(d16.bio).toMatch(/San Sebastián/)
    expect(d16.bio).toMatch(/Aguadilla/)
    expect(d16.bio).toMatch(/Barrio Guerrero/)
    expect(d16.bio).toMatch(/PPD/)
    expect(d16.bio).toMatch(/24 de febrero de 1971/)
    expect(d16.bio).toMatch(/Educación Física/)
    expect(d16.bio).toMatch(/Mayagüez|RUM/)
    expect(d16.bio).toMatch(/reifigueroa@camara\.pr\.gov/)
    expect(d16.bio).toMatch(/M-949-AL/)
    expect(d16.bio).toMatch(/legislador numérico 949/)
    expect(d16.bio).toMatch(/977-2456/)
    expect(d16.bio).toMatch(/2 de enero de 2025/)
    expect(d16.bio).toMatch(/2 de enero de 2029/)
    expect(d16.bio).toMatch(/no preside comisión|Minoría PPD/)
    expect(d16.career.join(' ')).toMatch(/Centro de Ayuda a Niños con impedimentos/)
    expect(d16.career.join(' ')).toMatch(/Liga de baloncesto de Isabela/)
    expect(d16.career.join(' ')).toMatch(/Pequeñas Ligas/)
    expect(d16.career.join(' ')).toMatch(/Club de Leones/)
    expect(d16.career.join(' ')).toMatch(/últimos 4 años/)
    expect(d16.career.join(' ')).toMatch(/Legislatura Municipal/)
    expect(d16.career.join(' ')).toMatch(/13,298/)
    expect(d16.career.join(' ')).toMatch(/40\.0%/)
    expect(d16.career.join(' ')).toMatch(/33,597/)
    expect(d16.career.join(' ')).toMatch(/1,693/)
    expect(d16.career.join(' ')).toMatch(/Liza I\. Alfaro Mercado/)
    expect(d16.career.join(' ')).toMatch(/11,605/)
    expect(d16.career.join(' ')).toMatch(/Ángel Lebrón/)
    expect(d16.career.join(' ')).toMatch(/5,555/)
    expect(d16.career.join(' ')).toMatch(/Reynaldo Acevedo Vélez/)
    expect(d16.career.join(' ')).toMatch(/3,139/)
    expect(d16.career.join(' ')).toMatch(/Hold PPD/)
    expect(d16.career.join(' ')).toMatch(/13,289/)
    expect(d16.career.join(' ')).toMatch(/11,579/)
    expect(d16.career.join(' ')).toMatch(/Pedro Lebrón Santiago/)
    expect(d16.career.join(' ')).toMatch(/5,550/)
    expect(d16.career.join(' ')).toMatch(/3,130/)
    expect(d16.career.join(' ')).toMatch(/33,548/)
    expect(d16.career.join(' ')).toMatch(/12,478/)
    expect(d16.career.join(' ')).toMatch(/9,871/)
    expect(d16.career.join(' ')).toMatch(/5,240/)
    expect(d16.career.join(' ')).toMatch(/2,998/)
    expect(d16.career.join(' ')).toMatch(/30,587/)
    expect(d16.career.join(' ')).toMatch(/No se certifica un par como CEE HTML/)
    expect(d16.career.join(' ')).toMatch(/2,628/)
    expect(d16.career.join(' ')).toMatch(/David Cruz Hernández/)
    expect(d16.career.join(' ')).toMatch(/1,761/)
    expect(d16.career.join(' ')).toMatch(/Orlando Cortes Mejías/)
    expect(d16.career.join(' ')).toMatch(/588/)
    expect(d16.career.join(' ')).toMatch(/Esther Soto/)
    expect(d16.career.join(' ')).toMatch(/133/)
    expect(d16.career.join(' ')).toMatch(/5,110/)
    expect(d16.career.join(' ')).toMatch(/Eladio J\. Cardona Quiles/)
    expect(d16.career.join(' ')).toMatch(/28 de diciembre de 2023/)
    expect(d16.career.join(' ')).toMatch(/no hay auditoría OCE publicada a su nombre/)
    expect(d16.career.join(' ')).toMatch(/no lista el Distrito 16/)
    expect(d16.career.join(' ')).toMatch(/OCE-B-21-145/)
    expect(d16.career.join(' ')).toMatch(/miembro/)
    expect(d16.career.join(' ')).toMatch(/portavoz PPD/)
    expect(d16.career.join(' ')).toMatch(/Tatiana Pérez Ramírez/)
    expect(d16.career.join(' ')).toMatch(/No se afirma que Figueroa la preside/)
    expect(d16.career.join(' ')).toMatch(/Pilar Barbosa/)
    expect(d16.career.join(' ')).toMatch(/NO ENCONTRADO/)
    expect(d16.career.join(' ')).toMatch(/no hay récord público citado de un familiar sentado/)
    expect(d16.career.join(' ')).not.toMatch(/esposa|cónyuge|yerno/)
    expect(d16.career.join(' ')).toMatch(/OCE-PB-24-002/)
    expect(d16.career.join(' ')).toMatch(/No se le atribuyen/)
    expect(d16.career.join(' ')).toMatch(/Boys & Girls Club/)
    expect(d16.career.join(' ')).toMatch(/Ricky/)
    expect(d16.career.join(' ')).toMatch(/RC 74/)
    expect(d16.career.join(' ')).toMatch(/PC 812/)
    expect(d16.career.join(' ')).toMatch(/No se afirma autoría SUTRA/)
    expect(d16.career.join(' ')).toMatch(/RC 56/)
    expect(d16.aspirations.join(' ')).toMatch(/RC 56|RC0056/)
    expect(d16.aspirations.join(' ')).toMatch(/PR-112/)
    expect(d16.aspirations.join(' ')).toMatch(/PR-445/)
    expect(d16.aspirations.join(' ')).toMatch(/PR-446/)
    expect(d16.aspirations.join(' ')).toMatch(/RCC 93/)
    expect(d16.aspirations.join(' ')).toMatch(/Doris L\. Chaparro Ríos/)
    expect(d16.aspirations.join(' ')).toMatch(/RCC 94/)
    expect(d16.aspirations.join(' ')).toMatch(/RCC 95/)
    expect(d16.aspirations.join(' ')).toMatch(/RC 391/)
    expect(d16.aspirations.join(' ')).toMatch(/RCC 210/)
    expect(d16.aspirations.join(' ')).toMatch(/RC 500/)
    expect(d16.aspirations.join(' ')).toMatch(/PC 579/)
    expect(d16.aspirations.join(' ')).toMatch(/PC 760/)
    expect(d16.aspirations.join(' ')).toMatch(/RCC 333/)
    expect(d16.aspirations.join(' ')).toMatch(/Juana B\. Guzmán/)
    expect(d16.aspirations.join(' ')).toMatch(/RC 699/)
    expect(d16.aspirations.join(' ')).toMatch(/Guajataca/)
    expect(d16.aspirations.join(' ')).toMatch(/RC 729/)
    expect(d16.aspirations.join(' ')).toMatch(/RCC 388/)
    expect(d16.aspirations.join(' ')).toMatch(/Autores = 1/)
    expect(d16.committees).toEqual([])
    expect(d16.committees).not.toContain('Educación')
    expect(JSON.stringify(d16)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d16)).not.toMatch(/M-948-AL/)
    expect(JSON.stringify(d16)).not.toMatch(/OCE-EB-24/)
    const facts = d16.connections.filter((c) => c.kind === 'fact')
    expect(facts.map((c) => c.toId)).toEqual([
      'hector-e-ferrer-santiago',
      'tatiana-perez-ramirez',
      'ricardo-chino-rey-ocasio-ramos',
    ])
    expect(facts[0].label).toMatch(/PC 812/)
    expect(facts[0].label).toMatch(/no se afirma autoría SUTRA/)
    expect(facts[1].label).toMatch(/Pilar Barbosa|Educación/)
    expect(facts[2].label).toMatch(/Pilar Barbosa/)
    expect(facts.every((c) => /no implica alianza/.test(c.label))).toBe(true)
    expect(d16.connections.some((c) => c.toId === 'wilson-j-roman-lopez')).toBe(false)
    expect(d16.connections.some((c) => c.kind === 'inference')).toBe(false)
    const overlap = townOverlapConnections('reinaldo-rey-figueroa')
    expect(overlap.some((c) => c.toId === 'wilson-j-roman-lopez' && c.kind === 'inference')).toBe(
      true,
    )
    expect(overlap.every((c) => c.kind === 'inference')).toBe(true)
    expect(d16.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraFigueroa.url,
        SRC.camaraFigueroaEN.url,
        SRC.sutraFigueroa.url,
        SRC.sutraDirectorioFigueroa.url,
        SRC.ballotpediaFigueroa.url,
        SRC.wiki2024House.url,
        SRC.wiki2024HouseES.url,
        SRC.visionRC56.url,
        SRC.oce2024Reps.url,
        SRC.oce2024PrimariasReps.url,
        SRC.oceD16_2020.url,
        SRC.camaraEducacion.url,
        SRC.camaraPilarBarbosa.url,
        SRC.primeraHoraPC812.url,
        SRC.islaNewsAAA210.url,
        SRC.sutraRC0056.url,
        SRC.sutraRCC0093.url,
        SRC.sutraRCC0210.url,
        SRC.sutraRC0500.url,
        SRC.sutraPC0579.url,
        SRC.sutraPC0760.url,
        SRC.sutraRCC0333.url,
        SRC.sutraRC0699.url,
        SRC.sutraRC0729.url,
        SRC.sutraRCC0388.url,
        SRC.microjurisComisiones.url,
      ]),
    )
    expect(SRC.sutraDirectorioFigueroa.url).toBe('https://sutra.oslpr.org/directorio?page=14')
    expect(SRC.sutraFigueroa.url).toBe('https://sutra.oslpr.org/legisladores/M-949-AL')
  })

  it('expande la ficha de mesa de Wilson D17 con CEE 14,615 y SUTRA M-950-AL', () => {
    const d17 = DOSSIERS['wilson-j-roman-lopez']
    expect(d17.bio).toMatch(/Portavoz alterno/)
    expect(d17.bio).toMatch(/No es Roberto López Román/)
    expect(d17.bio).toMatch(/M-950-AL/)
    expect(d17.career.join(' ')).toMatch(/14,615/)
    expect(d17.career.join(' ')).toMatch(/46\.8%/)
    expect(d17.career.join(' ')).toMatch(/31,260/)
    expect(d17.career.join(' ')).toMatch(/Kenneth Sanabria Domenech/)
    expect(d17.career.join(' ')).toMatch(/11,141/)
    expect(d17.aspirations).toHaveLength(3)
    expect(d17.aspirations.join(' ')).toMatch(/PC 1129/)
    expect(d17.aspirations.join(' ')).toMatch(/PC 1128/)
    expect(d17.aspirations.join(' ')).toMatch(/RCC 120/)
    expect(d17.aspirations.join(' ')).toMatch(/Autores = 1/)
    expect(d17.committees).toEqual([])
    expect(d17.connections).toEqual([])
    expect(JSON.stringify(d17)).not.toMatch(/\$\d/)
    expect(d17.connections.some((c) => c.toId === 'reinaldo-rey-figueroa')).toBe(false)
    expect(d17.connections.some((c) => c.toId === 'carlos-johnny-mendez-nunez')).toBe(false)
    const overlap = townOverlapConnections('wilson-j-roman-lopez')
    expect(overlap.some((c) => c.toId === 'reinaldo-rey-figueroa' && c.kind === 'inference')).toBe(
      true,
    )
    expect(d17.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraWilson.url,
        SRC.sutraWilson.url,
        SRC.ballotpediaWilson.url,
        SRC.wiki2024House.url,
      ]),
    )
    expect(SRC.sutraWilson.url).toBe('https://sutra.oslpr.org/legisladores/M-950-AL')
  })

  it('expande la ficha delgada de Odalys D18 con CEE 16,515 y SUTRA M-951-AL', () => {
    const d18 = DOSSIERS['odalys-gonzalez-gonzalez']
    expect(DEEP_IDS.has('odalys-gonzalez-gonzalez')).toBe(false)
    expect(DEEP_IDS.size).toBe(28)
    expect(VERIFIED['odalys-gonzalez-gonzalez']).toBeDefined()
    expect(d18.bio).toMatch(/Distrito 18/)
    expect(d18.bio).toMatch(/M-951-AL/)
    expect(d18.bio).toMatch(/2 de enero de 2025/)
    expect(d18.career.join(' ')).toMatch(/16,515/)
    expect(d18.career.join(' ')).toMatch(/47\.7%/)
    expect(d18.career.join(' ')).toMatch(/34,636/)
    expect(d18.career.join(' ')).toMatch(/Jessie Cortés Ramos/)
    expect(d18.career.join(' ')).toMatch(/14,206/)
    expect(d18.aspirations).toHaveLength(3)
    expect(d18.aspirations.join(' ')).toMatch(/PC 677/)
    expect(d18.aspirations.join(' ')).toMatch(/PC 675/)
    expect(d18.aspirations.join(' ')).toMatch(/RC 315/)
    expect(d18.aspirations.join(' ')).toMatch(/Autores = 1/)
    expect(d18.aspirations.join(' ')).not.toMatch(/PC 1214|PC1214/)
    expect(d18.committees).toEqual(['Región Oeste'])
    expect(JSON.stringify(d18)).not.toMatch(/\$\d/)
    expect(d18.connections.map((c) => c.toId)).toEqual([
      'wilson-j-roman-lopez',
      'jose-j-perez-cordero',
    ])
    expect(d18.connections.every((c) => c.kind === 'fact')).toBe(true)
    expect(d18.connections[0]?.label).toMatch(/PC 638/)
    expect(d18.connections[1]?.label).toMatch(/PC 344/)
    expect(d18.connections.every((c) => /no implica alianza/.test(c.label))).toBe(true)
    expect(d18.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraOdalys.url,
        SRC.sutraOdalys.url,
        SRC.ballotpediaOdalys.url,
        SRC.wiki2024House.url,
        SRC.microjurisComisiones.url,
        SRC.sutraPC0677.url,
        SRC.sutraPC0675.url,
        SRC.sutraRC0315.url,
        SRC.sutraPC0638.url,
        SRC.sutraPC0344Odalys.url,
      ]),
    )
    expect(SRC.sutraOdalys.url).toBe('https://sutra.oslpr.org/legisladores/M-951-AL')
    expect(SRC.sutraPC0675.url).toBe('https://sutra.oslpr.org/medidas/155872')
    expect(SRC.sutraRC0315.url).toBe(
      'https://sutra.oslpr.org/medidas?cuatrienio_id=2025&num_medida=RC0315',
    )
    expect(SRC.sutraPC0344Odalys.url).toBe('https://sutra.oslpr.org/medidas/153883')
  })

  it('expande la ficha delgada de Lilly D19 con CEE 10,994 y SUTRA M-952-AL', () => {
    const d19 = DOSSIERS['lilibeth-lilly-rosas']
    expect(DEEP_IDS.has('lilibeth-lilly-rosas')).toBe(false)
    expect(DEEP_IDS.size).toBe(28)
    expect(VERIFIED['lilibeth-lilly-rosas']).toBeDefined()
    expect(d19.bio).toMatch(/Distrito 19/)
    expect(d19.bio).toMatch(/M-952-AL/)
    expect(d19.bio).toMatch(/2 de enero de 2025/)
    expect(d19.career.join(' ')).toMatch(/10,994/)
    expect(d19.career.join(' ')).toMatch(/40\.7%/)
    expect(d19.career.join(' ')).toMatch(/27,020/)
    expect(d19.career.join(' ')).toMatch(/Edson Rodríguez/)
    expect(d19.career.join(' ')).toMatch(/9,311/)
    expect(d19.career.join(' ')).toMatch(/votes\.json/)
    expect(d19.career.join(' ')).not.toMatch(/9,027|22,581/)
    expect(d19.aspirations).toHaveLength(3)
    expect(d19.aspirations.join(' ')).toMatch(/PC 731/)
    expect(d19.aspirations.join(' ')).toMatch(/RC 359/)
    expect(d19.aspirations.join(' ')).toMatch(/RC 232/)
    expect(d19.aspirations.join(' ')).toMatch(/Autores = 1/)
    expect(d19.aspirations.join(' ')).not.toMatch(/RC 61|RCC 239|PC 885|RC 198/)
    expect(d19.committees).toEqual([])
    expect(JSON.stringify(d19)).not.toMatch(/\$\d/)
    expect(JSON.stringify(d19)).not.toMatch(/Efraín|De Jesús|esposa|cónyuge/)
    expect(d19.connections.map((c) => c.toId)).toEqual([
      'ramon-torres-cruz',
      'gretchen-hau',
      'edgardo-feliciano-sanchez',
      'reinaldo-rey-figueroa',
      'hector-e-ferrer-santiago',
    ])
    expect(d19.connections.every((c) => c.kind === 'fact')).toBe(true)
    expect(d19.connections[0]?.label).toMatch(/RC 61/)
    expect(d19.connections[1]?.label).toMatch(/RCC 239/)
    expect(d19.connections[3]?.label).toMatch(/PC 885/)
    expect(d19.connections.every((c) => /no implica alianza/.test(c.label))).toBe(true)
    expect(d19.connections.some((c) => c.toId === 'odalys-gonzalez-gonzalez')).toBe(false)
    expect(d19.connections.some((c) => c.toId === 'emilio-carlo-acosta')).toBe(false)
    expect(d19.sources.map((s) => s.url)).toEqual(
      expect.arrayContaining([
        SRC.camaraLilly.url,
        SRC.sutraLilly.url,
        SRC.ballotpediaLilly.url,
        SRC.wiki2024House.url,
        SRC.sutraPC0731.url,
        SRC.sutraRC0359.url,
        SRC.sutraRC0232.url,
        SRC.sutraRC0061Lilly.url,
        SRC.sutraRCC0239Lilly.url,
        SRC.sutraPC0885Lilly.url,
      ]),
    )
    expect(SRC.sutraLilly.url).toBe('https://sutra.oslpr.org/legisladores/M-952-AL')
    expect(SRC.sutraPC0731.url).toBe('https://sutra.oslpr.org/medidas/156529')
    expect(SRC.sutraRC0359.url).toBe('https://sutra.oslpr.org/medidas/156435')
    expect(SRC.sutraRC0232.url).toBe('https://sutra.oslpr.org/medidas/154676')
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
