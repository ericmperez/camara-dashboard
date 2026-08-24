export const PLAYBOOK_BOOKS = ['invertir', 'ofrecer', 'portero'] as const
export type PlaybookBook = (typeof PLAYBOOK_BOOKS)[number]

export const PLAYBOOK_BOOK_LABELS: Record<PlaybookBook, string> = {
  invertir: 'Invertir',
  ofrecer: 'Ofrecer',
  portero: 'Portero',
}

export type PlaybookEntry = {
  id: string
  book: PlaybookBook
  popularity: string
  social: string
  said: string
  move: string
  risk: string | null
}

export const PLAYBOOK_BANNER =
  'Capital político, no dinero. Invertir = relación a 2028. Ofrecer = tienen un hueco (pueblo, expediente, salida). Portero = se trata, no se compra. Chinas con chinas: distrito con distrito. Fuentes: CEE 2024 certificado, CEE 2020 noche del evento, SUTRA, RC0002, prensa de la RC 352 (abr 2026).'

export const PLAYBOOK_RULE =
  'No se ofrece lo mismo a Méndez que a Varela. Al Presidente se le entra por el calendario y Roosevelt Roads. Al popular de Caguas, por fiscalización y por el margen flojo.'

export const PLAYBOOK_NEXT =
  'Tres movimientos: Wanda ahora; campo a Varela o Estrella a cambio de expediente; gavel de Trabajo de López Román (barato hoy). Méndez se trata en paralelo.'

export const PLAYBOOK: PlaybookEntry[] = [
  {
    id: 'wanda-del-valle-correa',
    book: 'invertir',
    popularity: '+14.0 pts 2020→2024 · 50.7% · margen 5,125',
    social: '@wanda_distrito38 · Facebook de territorio. Canóvanas, Carolina, Trujillo Alto. No es farándula.',
    said: 'Vivienda regional (2017), perdió 2016, ganó 2020, se ensanchó 2024. Preside Asuntos de la Mujer.',
    move: 'Entra ahora: la curva más limpia del PNP de distrito y todavía no es dinastía.',
    risk: null,
  },
  {
    id: 'jorge-navarro-suarez',
    book: 'invertir',
    popularity: '+12.9 pts · 48.1% · margen 8,102 (el más ancho)',
    social: '@RepJorgeNavarro · ~21k X (agregador). Capitolio + Precinto 5.',
    said: 'Dual chair: Banca y Metro. En el escaño desde 2005. Casa política citada; no se imputa el récord del padre.',
    move: 'Estar en Guaynabo–San Juan 5. No se compra; se acompaña.',
    risk: null,
  },
  {
    id: 'yashira-lebron-rodriguez',
    book: 'invertir',
    popularity: '+8.7 pts · 48.0% · margen 6,923',
    social: '@yashiralebron · Instagram de Bayamón, no de isla.',
    said: 'Primera mujer del D8 (2014). Vicepresidenta por unanimidad el 13 ene 2025.',
    move: 'Cara de la mayoría en el metro oeste. Ofrecerle farándula es insulto.',
    risk: null,
  },
  {
    id: 'denis-marquez-lebron',
    book: 'invertir',
    popularity: '122,973 (10.6%) → 192,404 (15.1%) · 107 PC',
    social: 'Facebook denismarquezpip. La red es el PIP, no el ego.',
    said: 'Único independentista electo por votos. Portavoz PIP. Techo de lista, no de distrito.',
    move: 'Invertir agenda, no escaño de pueblo. Gana las dos monedas: votos y expediente.',
    risk: null,
  },
  {
    id: 'joel-i-franqui-atiles',
    book: 'invertir',
    popularity: '+4.6 pts · 51.6% · margen 7,625 · 51 PC',
    social: 'Facebook/Instagram de campaña. Poco X de Capitolio.',
    said: 'Tercer cuatrienio. Preside Desarrollo Económico (foto con Fortaleza).',
    move: 'PNP de interior que crece y radica. Par de Navarro: pueblo + papel.',
    risk: null,
  },
  {
    id: 'gretchen-hau',
    book: 'invertir',
    popularity: 'margen 3,232 · 46.9% · única PPD sobre la mediana de distrito',
    social: '@gretchenmhau · Facebook senadoragretchenhau. La más profesional del caucus distrital.',
    said: 'Asociación de Alcaldes 2015–2019. Senado Guayama 2020. D29 desde 2023 (Cayey).',
    move: 'Si vas a tener un popular de distrito a 2028, es este.',
    risk: null,
  },
  {
    id: 'jose-conny-varela',
    book: 'ofrecer',
    popularity: '71 PC · margen 729 · tercer PPD más frágil',
    social: 'Habla en carta y en el hemiciclo, no en el feed. Fiscalizador.',
    said: 'Abr 2026: Méndez «no tiene poder parlamentario» para parar la RC 352 (centros de inspección).',
    move: 'Campo en Caguas y una pesquisa que no le cierren. No le ofrezcas silencio.',
    risk: 'Choca con el Presidente. Aliado ruidoso.',
  },
  {
    id: 'estrella-martinez-soto',
    book: 'ofrecer',
    popularity: '48.4% → 42.3% (−6.1) · 50 PC',
    social: 'Sin handle fuerte citado. La voz está en SUTRA.',
    said: 'Decayendo y productiva. Comparar con Higgins, no con Hau.',
    move: 'Operación de pueblo. Ella ya pone el expediente.',
    risk: 'Si el PNP pone un nombre, el −6.1 se come sola.',
  },
  {
    id: 'sol-y-higgins-cuadrado',
    book: 'ofrecer',
    popularity: '49.3% → 43.1% (−6.2)',
    social: 'Sin handle fuerte en el análisis. Popularidad de 2020 gastada.',
    said: 'La otra caída clara entre comparables CEE.',
    move: 'Campo, no likes. Misma oferta que Estrella.',
    risk: 'Invertir a ciegas es recoger un activo que se encoge.',
  },
  {
    id: 'roberto-lopez-roman',
    book: 'ofrecer',
    popularity: 'Especial PNP: 677 votos · margen 43',
    social: 'Comité municipal de Caguas, no red isleña.',
    said: 'Aspiró a la alcaldía de Caguas (Telemundo). PC 1115 (salario mínimo) aprobado 32–20 jun 2026. Preside Trabajo.',
    move: 'Ruta a Caguas o colchón 2028. El gavel de Trabajo es la moneda de ahora.',
    risk: 'No es un distrito; es una primaria tardía. Si se va, el escaño se reabre.',
  },
  {
    id: 'elinette-gonzalez-aguayo',
    book: 'ofrecer',
    popularity: 'margen 172 · 17 PC · preside Recursos Naturales',
    social: 'Digital flojo frente al cargo.',
    said: 'Gavel sin pueblo.',
    move: 'Un proyecto ambiental con foto en el distrito.',
    risk: 'Barato hoy. No es inversión de 2028.',
  },
  {
    id: 'hector-e-ferrer-santiago',
    book: 'ofrecer',
    popularity: '134,587 (11.6%) → 169,060 (13.3%)',
    social: '@hectorferrerpr. Engagement personal alto (prensa del compromiso, 2025).',
    said: 'Portavoz PPD. Voz de minoría, no de pueblo.',
    move: 'Agenda de portavoz y aire. No le ofrezcas un distrito: no lo tiene.',
    risk: 'El apellido abre. La lista PPD cierra si el partido encoge.',
  },
  {
    id: 'pedro-j-pelle-santiago-guzman',
    book: 'ofrecer',
    popularity: 'Perdió 2020 (42.7%), volvió 2024 (42.2%) casi plano',
    social: 'Sin curva de marca citada.',
    said: 'Preside Asuntos Internos. Recuperó el asiento sin crecer.',
    move: 'Un motivo para que 2028 no lo vuelva a botar. Internos es reglamento, no popularidad.',
    risk: 'Oferta táctica. No es curva Wanda.',
  },
  {
    id: 'carlos-johnny-mendez-nunez',
    book: 'portero',
    popularity: '50.2% · margen 5,118 · escaño desde 2005',
    social: '@JohnnyMndez36 · ~29k X · Facebook JohnnyMendez36. Red de presidencia.',
    said: 'Agenda: reforma contributiva, agua, escuelas, Roosevelt Roads. Abr 2026: paró la RC 352 citando al PFEI.',
    move: 'Se entra por Fortaleza y por el calendario (Torres Zamora), no por un cheque de distrito.',
    risk: 'No se cierra como los otros. Se trata en paralelo.',
  },
  {
    id: 'angel-r-pena-ramirez',
    book: 'portero',
    popularity: '52.3% (mejor % del cuerpo) · margen 6,403 · 12 PC',
    social: 'Presencia institucional. Gana en el pueblo, no en el timeline.',
    said: 'Vicepresidente. Preside Ética.',
    move: 'Si ofreces: proceso o silencio. Invertir en su Instagram es desperdicio.',
    risk: null,
  },
  {
    id: 'eddie-charbonier-chinea',
    book: 'portero',
    popularity: 'margen 6,759 · 46% · 14 PC',
    social: '@EddieCharbonier · ~8k X. Sanjuanero (Cangrejeros, D1), no secretaría.',
    said: 'Preside Hacienda. Pueblo sí, expediente no.',
    move: 'Ofrecimiento técnico (contribuciones, presupuesto), no popularidad.',
    risk: null,
  },
]
