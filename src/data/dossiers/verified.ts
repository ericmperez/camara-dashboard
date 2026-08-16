import type { Dossier } from '../../types'
import { SRC } from './sources'

export const VERIFIED: Record<string, Dossier> = {
  'carlos-johnny-mendez-nunez': {
    id: 'carlos-johnny-mendez-nunez',
    bio: 'Electo presidente de la Cámara el 13 de enero de 2025 con 50 votos. Es su segunda presidencia (2017–2020 y 2025–). La ficha oficial lo llama el décimo segundo legislador en ocupar el cargo dos veces. Fue portavoz de la minoría PNP en 2021–2025.',
    career: [
      'Presidente de la Cámara, 2017–2020.',
      'Portavoz de la minoría PNP, 2021–2025.',
      'Presidente de la Cámara desde el 13 de enero de 2025 (50 votos).',
      'Décimo segundo legislador en presidir el cuerpo en dos ocasiones (ficha oficial).',
      'En enero de 2025 no se asignó presidencia de comisión a PPD, PIP ni PD (RC0002).',
      'En abril de 2026 paralizó la RC 352 (centros de inspección / Ciary Pérez Peña) citando una investigación del PFEI.',
    ],
    aspirations: [
      'Reforma contributiva (prioridad de la segunda sesión, 16 ago 2026).',
      'Reconstrucción de la infraestructura de agua.',
      'Modernización de escuelas.',
      'Desarrollo de Roosevelt Roads.',
    ],
    committees: [],
    connections: [
      {
        toId: 'yashira-lebron-rodriguez',
        kind: 'fact',
        label: 'Vicepresidenta electa por unanimidad el 13 ene 2025',
        sources: [SRC.metroInaugural],
      },
      {
        toId: 'angel-r-pena-ramirez',
        kind: 'fact',
        label: 'Vicepresidente electo por unanimidad el 13 ene 2025',
        sources: [SRC.metroInaugural],
      },
      {
        toId: 'jose-f-aponte-hernandez',
        kind: 'fact',
        label: 'Expresidentes que siguen sentados: Aponte, Méndez, Rivera Ruiz',
        sources: [SRC.metroInaugural, SRC.camaraAponte, SRC.univisionRivera],
      },
      {
        toId: 'roberto-rivera-ruiz-de-porras',
        kind: 'fact',
        label: 'Expresidentes que siguen sentados: Aponte, Méndez, Rivera Ruiz',
        sources: [SRC.metroInaugural, SRC.camaraAponte, SRC.univisionRivera],
      },
      {
        toId: 'jose-conny-varela',
        kind: 'fact',
        label: 'Paralizó la RC 352; Varela dijo que el presidente no puede suspender un mandato de la Cámara',
        sources: [SRC.metroRC352],
      },
    ],
    sources: [
      SRC.wiprMendez,
      SRC.metroInaugural,
      SRC.camaraMendez,
      SRC.voceroPrioridades,
      SRC.metroRC352,
      SRC.microjurisComisiones,
    ],
  },

  'yashira-lebron-rodriguez': {
    id: 'yashira-lebron-rodriguez',
    bio: 'Primera mujer representante del Distrito 8. Juramentó el 23 de octubre de 2014. Electa vicepresidenta por unanimidad el 13 de enero de 2025.',
    career: [
      'Juramentó el 23 de octubre de 2014; primera mujer del Distrito 8.',
      'Vicepresidenta de la Cámara desde el 13 de enero de 2025.',
    ],
    aspirations: [],
    committees: [],
    connections: [
      {
        toId: 'carlos-johnny-mendez-nunez',
        kind: 'fact',
        label: 'Electa vicepresidenta por unanimidad cuando Méndez asumió la presidencia',
        sources: [SRC.metroInaugural],
      },
      {
        toId: 'angel-r-pena-ramirez',
        kind: 'fact',
        label: 'Electos vicepresidentes por unanimidad el 13 ene 2025',
        sources: [SRC.metroInaugural],
      },
    ],
    sources: [SRC.metroInaugural, SRC.camaraYashira],
  },

  'angel-r-pena-ramirez': {
    id: 'angel-r-pena-ramirez',
    bio: 'Electo vicepresidente de la Cámara por unanimidad el 13 de enero de 2025, en la misma sesión inaugural que eligió a Méndez.',
    career: [
      'Vicepresidente de la Cámara desde el 13 de enero de 2025.',
      'Presidente de la Comisión de Ética (RC0002, ene 2025).',
    ],
    aspirations: [],
    committees: [],
    connections: [
      {
        toId: 'carlos-johnny-mendez-nunez',
        kind: 'fact',
        label: 'Electo vicepresidente por unanimidad cuando Méndez asumió la presidencia',
        sources: [SRC.metroInaugural],
      },
      {
        toId: 'yashira-lebron-rodriguez',
        kind: 'fact',
        label: 'Electos vicepresidentes por unanimidad el 13 ene 2025',
        sources: [SRC.metroInaugural],
      },
    ],
    sources: [SRC.metroInaugural, SRC.microjurisComisiones],
  },

  'jose-e-torres-zamora': {
    id: 'jose-e-torres-zamora',
    bio: null,
    career: [
      'Portavoz de la mayoría PNP en la XX Asamblea (directorio oficial).',
      'Presidente de Calendario y Reglas Especiales de Debate (RC0002, ene 2025).',
      '87,511 votos por acumulación en 2024 (Ballotpedia).',
    ],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [SRC.microjurisComisiones, SRC.ballotpediaDenis],
  },

  'wilson-j-roman-lopez': {
    id: 'wilson-j-roman-lopez',
    bio: 'Portavoz alterno PNP del Distrito 17. No es Roberto López Román (D31).',
    career: ['Portavoz alterno de la mayoría PNP (directorio oficial).'],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [],
  },

  'hector-e-ferrer-santiago': {
    id: 'hector-e-ferrer-santiago',
    bio: 'Nació el 23 de septiembre de 1994. Hijo de Héctor J. Ferrer Ríos, quien fue representante por el Distrito 29 (2000–2004) y por acumulación (2004–2012), y presidente del PPD en dos ocasiones. Según su ficha oficial, en 2020 fue el legislador con más votos entre ambos cuerpos.',
    career: [
      'Portavoz de la delegación del PPD (directorio oficial).',
      '169,060 votos por acumulación en 2024 (Ballotpedia).',
    ],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [SRC.camaraFerrer, SRC.ballotpediaDenis],
  },

  'domingo-j-torres-garcia': {
    id: 'domingo-j-torres-garcia',
    bio: null,
    career: ['Portavoz alterno de la delegación del PPD (directorio oficial).'],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [],
  },

  'denis-marquez-lebron': {
    id: 'denis-marquez-lebron',
    bio: null,
    career: [
      'Portavoz de la delegación del PIP (directorio oficial).',
      '192,404 votos por acumulación en 2024; primero en esa lista (Ballotpedia).',
    ],
    aspirations: [],
    committees: [],
    connections: [
      {
        toId: 'adriana-gutierrez-colon',
        kind: 'fact',
        label: 'Gutiérrez fue su asesora legislativa de 2017 a 2024',
        sources: [SRC.perlaMinorias],
      },
    ],
    sources: [SRC.ballotpediaDenis, SRC.perlaMinorias],
  },

  'adriana-gutierrez-colon': {
    id: 'adriana-gutierrez-colon',
    bio: 'Entra por la cláusula constitucional de minorías. Su origen electoral fue el Distrito 4; en el directorio oficial sienta el escaño como acumulación. Fue asesora legislativa de Denis Márquez de 2017 a 2024.',
    career: [
      'Portavoz alterna de la delegación del PIP (directorio oficial).',
      'Asesora legislativa de Denis Márquez, 2017–2024.',
    ],
    aspirations: [],
    committees: [],
    connections: [
      {
        toId: 'denis-marquez-lebron',
        kind: 'fact',
        label: 'Asesora legislativa suya, 2017–2024',
        sources: [SRC.perlaMinorias],
      },
      {
        toId: 'nelie-lebron-robles',
        kind: 'fact',
        label: 'Ambas entraron por ley de minorías (PIP) en 2024',
        sources: [SRC.perlaMinorias, SRC.metroRoster],
      },
    ],
    sources: [SRC.perlaMinorias, SRC.metroRoster],
  },

  'lisie-j-burgos-muniz': {
    id: 'lisie-j-burgos-muniz',
    bio: 'Única representante de Proyecto Dignidad. Metro (14 ene 2025) registra la primera vez que PD ocupa escaño en ambos cuerpos: Burgos en la Cámara y Joanne Rodríguez Veve en el Senado.',
    career: [
      'Portavoz de Proyecto Dignidad (directorio oficial).',
      '84,976 votos por acumulación en 2024 (Ballotpedia).',
    ],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [SRC.metroRoster, SRC.ballotpediaDenis],
  },

  'jose-f-aponte-hernandez': {
    id: 'jose-f-aponte-hernandez',
    bio: 'Entró en 2000 cubriendo la vacante de su hermano Néstor Aponte en el Distrito 33. Presidente de la Cámara de 2005 a 2009 (ficha oficial). Metro rota 2005–2008 en la foto de expresidentes de la inaugural. Secretario general del PNP bajo Rosselló, 1997–1999.',
    career: [
      'Entró en 2000 por la vacante de Néstor Aponte, Distrito 33.',
      'Secretario general del PNP, 1997–1999.',
      'Presidente de la Cámara, 2005–2009 (ficha oficial).',
      '72,792 votos por acumulación en 2024; último electo de esa lista (Ballotpedia).',
      'Presidente de Asuntos Federales y Veteranos (RC0002, ene 2025).',
    ],
    aspirations: [],
    committees: [],
    connections: [
      {
        toId: 'carlos-johnny-mendez-nunez',
        kind: 'fact',
        label: 'Expresidentes que siguen sentados: Aponte, Méndez, Rivera Ruiz',
        sources: [SRC.metroInaugural, SRC.camaraAponte, SRC.univisionRivera],
      },
      {
        toId: 'roberto-rivera-ruiz-de-porras',
        kind: 'fact',
        label: 'Expresidentes que siguen sentados: Aponte, Méndez, Rivera Ruiz',
        sources: [SRC.metroInaugural, SRC.camaraAponte, SRC.univisionRivera],
      },
    ],
    sources: [SRC.metroInaugural, SRC.camaraAponte, SRC.wikiAponte, SRC.ballotpediaDenis],
  },

  'roberto-rivera-ruiz-de-porras': {
    id: 'roberto-rivera-ruiz-de-porras',
    bio: 'Presidente de la Cámara en 2016–2017, tras la renuncia de Jaime Perelló. Le sucedió Méndez. Sigue sentado por el Distrito 39. El Metro de la inaugural lo lista como titular del 39; no aparece en la foto de expresidentes de esa nota.',
    career: [
      'Presidente de la Cámara, 2016–2017.',
      'Representante del Distrito 39 (Carolina y Trujillo Alto).',
    ],
    aspirations: [],
    committees: [],
    connections: [
      {
        toId: 'carlos-johnny-mendez-nunez',
        kind: 'fact',
        label: 'Expresidentes que siguen sentados: Aponte, Méndez, Rivera Ruiz',
        sources: [SRC.metroInaugural, SRC.camaraAponte, SRC.univisionRivera],
      },
      {
        toId: 'jose-f-aponte-hernandez',
        kind: 'fact',
        label: 'Expresidentes que siguen sentados: Aponte, Méndez, Rivera Ruiz',
        sources: [SRC.metroInaugural, SRC.camaraAponte, SRC.univisionRivera],
      },
    ],
    sources: [SRC.metroInaugural, SRC.univisionRivera, SRC.wikiRivera],
  },

  'roberto-lopez-roman': {
    id: 'roberto-lopez-roman',
    bio: 'Titular del Distrito 31 (Caguas y Gurabo) por la elección especial del 28 de septiembre de 2025, solo entre afiliados del PNP. Vimarie Peña Dávila renunció el 18 de agosto de 2025 para asumir la alcaldía de Gurabo, cargo que quedó libre cuando Rosachely Rivera Santana pasó a Secretaría de Estado. Metro (29 sep): 2,148 votantes; 677–634–414–337–82. La CEE lo certificó el 29 de septiembre; asumió el 7 de octubre de 2025.',
    career: [
      'Presidente del comité municipal del PNP en Caguas.',
      'Oficializó su aspiración a la alcaldía de Caguas por el PNP (Telemundo).',
      'INFERENCIA (Wikipedia, sin acta CEE): candidato a alcalde de Caguas en 2016, 2020 y 2024.',
      'Bachillerato y maestría en ciencias políticas (FIU) y maestría en sociología (FLACSO, Buenos Aires).',
      'Trabajó con Marco Rubio cuando este presidía la Cámara de Representantes de la Florida.',
      'En el Senado de Puerto Rico: un cuatrienio como presidente de la Comisión de Relaciones Federales y seis años en la Comisión de Desarrollo Económico, Industria y Comercio.',
      'Autor del PC 1115 para derogar la comisión evaluadora del salario mínimo; la Cámara lo aprobó 32–20 en junio de 2026.',
      'Preside Trabajo y Asuntos Laborales. En enero de 2025 RC0002 nombró a Vimarie Peña; el directorio de la comisión ahora lo lista a él.',
    ],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [
      SRC.wiprD31,
      SRC.metroD31,
      SRC.ceeD31,
      SRC.endiPena,
      SRC.ballotpediaLopez,
      SRC.telemundoCaguas,
      SRC.telemundoPC1115,
      SRC.camaraTrabajo,
      SRC.wikiLopez,
    ],
  },
}
