import type { RepeatBand } from '../types'

export type RepeatProfile = {
  score: number
  band: RepeatBand
  since: number | null
  social: string
  socialNote: string
  why: string
}

export const REPEAT_DISCLAIMER =
  'El piso es el escrutinio CEE 2024 (o la especial 2025). Encima: años en el escaño, cargo y redes públicas. Los seguidores de X son de agregadores, no un conteo live de Instagram. Las redes no tapan un margen corto.'

/** Evaluación citada en el análisis de repetidores. No es encuesta ni CEE. */
export const REPEAT_PROFILES: Record<string, RepeatProfile> = {
  'carlos-johnny-mendez-nunez': {
    score: 91,
    band: 'cerradura',
    since: 2005,
    social: '@JohnnyMndez36 · ~29k X · FB JohnnyMendez36',
    socialNote: 'La cuenta más institucional del hemiciclo. Sirve a la presidencia, no solo al distrito.',
    why: 'Ya repitió el escaño dos décadas. 50.2% en casa. La red suma marca de Presidente; no es lo que lo elige en Fajardo.',
  },
  'angel-r-pena-ramirez': {
    score: 86,
    band: 'cerradura',
    since: 2009,
    social: 'Presencia institucional; X/IG del distrito débiles frente al margen',
    socialNote: 'Gana en el pueblo, no en el timeline. El 52.3% es el mejor % de distrito del cuerpo.',
    why: 'Cerradura numérica + mesa. Juncos, Las Piedras y San Lorenzo ya lo reeligieron varias veces.',
  },
  'yashira-lebron-rodriguez': {
    score: 84,
    band: 'cerradura',
    since: 2014,
    social: '@yashiralebron (IG) · marca local de Bayamón',
    socialNote: 'Red de distrito, no de farándula. Coherente con cómo se gana Bayamón: cara + maquinaria.',
    why: 'Cuarta reelección (2014–2024). Primera mujer del D8. La vicepresidencia refuerza, no crea, el escaño.',
  },
  'jorge-navarro-suarez': {
    score: 84,
    band: 'cerradura',
    since: 2005,
    social: '@RepJorgeNavarro · ~21k X',
    socialNote: 'X activo y nominativo. El margen de 8,102 es el más ancho del harvest; la red es extra.',
    why: 'El más difícil de tumbar por votos: Precinto 5 y Guaynabo desde 2005. Hijo de casa política.',
  },
  'joel-i-franqui-atiles': {
    score: 78,
    band: 'solido',
    since: 2017,
    social: 'FB/IG de campaña; menos X institucional que Méndez o Navarro',
    socialNote: 'El 51.6% pesa más que el feed. Red suficiente para incumbente, no es un influencer.',
    why: 'Tercer cuatrienio con mayoría clara. La comisión le da foto; el distrito ya era PNP.',
  },
  'eddie-charbonier-chinea': {
    score: 76,
    band: 'solido',
    since: 2017,
    social: '@EddieCharbonier · ~8k X · FB eddiecharbonier',
    socialNote: 'El más «redes de barrio» del top: Cangrejeros, San Juan. Útil para el D1; no mueve la isla.',
    why: 'Hacienda + San Juan 1. El 46% no es aplastante, pero el margen (6,759) sí. Activo en X.',
  },
  'angel-morey-noble': {
    score: 72,
    band: 'solido',
    since: 2021,
    social: 'Enlaces de Cámara (FB/X/IG); marca personal más delgada',
    socialNote: 'El escaño es de la máquina de Guaynabo, no del influencer. Redes no son su palanca.',
    why: 'Segundo margen más alto. Lleva menos tiempo. Si hay primaria PNP, es el sólido que hay que mirar dos veces.',
  },
  'luis-perez-ortiz': {
    score: 71,
    band: 'solido',
    since: 1998,
    social: 'Digital flojo; la fuerza es el nombre en Bayamón',
    socialNote: 'Las redes no lo sostienen ni lo amenazan. Repite por incumbencia extrema.',
    why: 'El más viejo del hemiciclo en el asiento. Sin red moderna sigue siendo el D7. Riesgo: edad o relevo, no el PPD.',
  },
  'wanda-del-valle-correa': {
    score: 68,
    band: 'posible',
    since: 2021,
    social: '@wanda_distrito38 — handle de territorio',
    socialNote: 'Bien nombrada para el distrito. Alcance isleño bajo. Correcto para Canóvanas–Carolina.',
    why: 'Mitad de los votos + 5k de margen. Menos máquina histórica que Navarro o Yashira.',
  },
  'gretchen-hau': {
    score: 64,
    band: 'posible',
    since: 2023,
    social: '@gretchenmhau · FB senadoragretchenhau',
    socialNote: 'La red más profesional de la minoría de distrito: Cayey y Asociación de Alcaldes.',
    why: 'Mejor popular para repetir distrito. Hereda Cayey (Ortiz). Margen menor que el bloque PNP del este metro.',
  },
  'denis-marquez-lebron': {
    score: 78,
    band: 'solido',
    since: null,
    social: 'Marca PIP + FB denismarquezpip',
    socialNote: 'La red es del partido. No es un escaño de distrito.',
    why: '192,404 votos de acumulación (15.1%). El más sólido de lista si el PIP sostiene techo.',
  },
  'hector-e-ferrer-santiago': {
    score: 74,
    band: 'solido',
    since: null,
    social: '@hectorferrerpr — alto engagement personal',
    socialNote: 'Visibilidad isleña (hasta el compromiso salió en prensa). Eso es acumulación, no distrito.',
    why: '169,060 votos (13.3%). Apellido + portavoz. Depende del cupo PPD en la lista.',
  },
  'jose-e-torres-zamora': {
    score: 68,
    band: 'posible',
    since: null,
    social: 'Institucional de portavoz / Calendario',
    socialNote: 'Poca marca de fanbase. La lista PNP lo carga.',
    why: '87,511 votos (6.9%). Repite si el PNP sigue primero en acumulación.',
  },
  'lisie-j-burgos-muniz': {
    score: 58,
    band: 'posible',
    since: null,
    social: 'Nicho moral/religioso, no masa',
    socialNote: 'Un solo escaño PD. El feed no crea un segundo voto.',
    why: '84,976 votos (6.7%). Más frágil si otra lista conservadora crece.',
  },
}
