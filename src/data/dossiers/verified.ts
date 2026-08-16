import type { Dossier } from '../../types'
import { SRC } from './sources'

export const VERIFIED: Record<string, Dossier> = {
  'carlos-johnny-mendez-nunez': {
    id: 'carlos-johnny-mendez-nunez',
    bio: 'Electo presidente de la Cámara el 13 de enero de 2025 con 50 votos. Presidió el cuerpo en 2017–2020 y fue portavoz de la minoría PNP en 2021–2025.',
    career: [
      'Presidente de la Cámara, 2017–2020.',
      'Portavoz de la minoría PNP, 2021–2025.',
      'Presidente de la Cámara desde el 13 de enero de 2025 (50 votos).',
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
        label: 'Expresidente 2005–2008; posó en la foto de expresidentes de la inaugural',
        sources: [SRC.metroInaugural, SRC.wikiAponte],
      },
      {
        toId: 'roberto-rivera-ruiz-de-porras',
        kind: 'fact',
        label: 'Presidente interino 2016–2017, inmediatamente antes de Méndez',
        sources: [SRC.univisionRivera, SRC.wikiRivera],
      },
    ],
    sources: [
      SRC.wiprMendez,
      SRC.metroInaugural,
      SRC.camaraMendez,
      SRC.voceroPrioridades,
    ],
  },

  'yashira-lebron-rodriguez': {
    id: 'yashira-lebron-rodriguez',
    bio: 'Electa vicepresidenta de la Cámara por unanimidad el 13 de enero de 2025, en la misma sesión inaugural que eligió a Méndez.',
    career: ['Vicepresidenta de la Cámara desde el 13 de enero de 2025.'],
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
    sources: [SRC.metroInaugural],
  },

  'angel-r-pena-ramirez': {
    id: 'angel-r-pena-ramirez',
    bio: 'Electo vicepresidente de la Cámara por unanimidad el 13 de enero de 2025, en la misma sesión inaugural que eligió a Méndez.',
    career: ['Vicepresidente de la Cámara desde el 13 de enero de 2025.'],
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
    sources: [SRC.metroInaugural],
  },

  'jose-e-torres-zamora': {
    id: 'jose-e-torres-zamora',
    bio: null,
    career: ['Portavoz de la mayoría PNP en la XX Asamblea (directorio oficial).'],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [],
  },

  'wilson-j-roman-lopez': {
    id: 'wilson-j-roman-lopez',
    bio: null,
    career: ['Portavoz alterno de la mayoría PNP (directorio oficial).'],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [],
  },

  'hector-e-ferrer-santiago': {
    id: 'hector-e-ferrer-santiago',
    bio: 'Nació el 23 de septiembre de 1994. Hijo de Héctor J. Ferrer Ríos, quien fue representante por el Distrito 29 (2000–2004) y por acumulación (2004–2012), y presidente del PPD en dos ocasiones. Según su ficha oficial, en 2020 fue el legislador con más votos entre ambos cuerpos.',
    career: ['Portavoz de la delegación del PPD (directorio oficial).'],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [SRC.camaraFerrer],
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
    career: ['Portavoz de la delegación del PIP (directorio oficial).'],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [],
  },

  'adriana-gutierrez-colon': {
    id: 'adriana-gutierrez-colon',
    bio: null,
    career: ['Portavoz alterna de la delegación del PIP (directorio oficial).'],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [],
  },

  'lisie-j-burgos-muniz': {
    id: 'lisie-j-burgos-muniz',
    bio: null,
    career: ['Portavoz de Proyecto Dignidad (directorio oficial).'],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [],
  },

  'jose-f-aponte-hernandez': {
    id: 'jose-f-aponte-hernandez',
    bio: 'Expresidente de la Cámara (2005–2008). Aparece en la foto de expresidentes de la sesión inaugural del 13 de enero de 2025.',
    career: [
      'Presidente de la Cámara, 2005–2008.',
      'Representante por acumulación en la XX Asamblea (directorio oficial).',
    ],
    aspirations: [],
    committees: [],
    connections: [
      {
        toId: 'carlos-johnny-mendez-nunez',
        kind: 'fact',
        label: 'Ambos expresidentes; foto de la inaugural del 13 ene 2025',
        sources: [SRC.metroInaugural, SRC.wikiAponte],
      },
    ],
    sources: [SRC.metroInaugural, SRC.wikiAponte],
  },

  'roberto-rivera-ruiz-de-porras': {
    id: 'roberto-rivera-ruiz-de-porras',
    bio: 'Presidente interino de la Cámara del 29 de agosto de 2016 al 2 de enero de 2017, tras la renuncia de Jaime Perelló. Le sucedió Méndez. El Metro de la inaugural del 13 ene 2025 lo lista como titular del Distrito 39; no aparece en la foto de expresidentes de esa nota.',
    career: [
      'Presidente de la Cámara (interino), 29 ago 2016 – 2 ene 2017.',
      'Representante del Distrito 39 (Carolina y Trujillo Alto).',
    ],
    aspirations: [],
    committees: [],
    connections: [
      {
        toId: 'carlos-johnny-mendez-nunez',
        kind: 'fact',
        label: 'Le precedió en la presidencia de la Cámara (2016–2017)',
        sources: [SRC.univisionRivera, SRC.wikiRivera],
      },
    ],
    sources: [SRC.metroInaugural, SRC.univisionRivera, SRC.wikiRivera],
  },

  'roberto-lopez-roman': {
    id: 'roberto-lopez-roman',
    bio: 'Titular del Distrito 31 (Caguas y Gurabo) por la elección especial del 28 de septiembre de 2025. La vacante la dejó Vimarie Peña Dávila al pasar a la alcaldía de Gurabo, cargo que a su vez quedó libre cuando Rosachely Rivera Santana fue nombrada secretaria de Estado. López Román obtuvo 677 votos; la CEE lo certificó el 29 de septiembre de 2025 y asumió el 7 de octubre de 2025. Los cinco candidatos de esa especial eran del PNP.',
    career: [
      'Presidente del comité municipal del PNP en Caguas.',
      'Candidato a alcalde de Caguas en 2016, 2020 y 2024; no resultó electo.',
      'Bachillerato y maestría en ciencias políticas (FIU) y maestría en sociología (FLACSO, Buenos Aires).',
      'Trabajó con Marco Rubio cuando este presidía la Cámara de Representantes de la Florida.',
      'En el Senado de Puerto Rico: un cuatrienio como presidente de la Comisión de Relaciones Federales y seis años en la Comisión de Desarrollo Económico, Industria y Comercio.',
    ],
    aspirations: [],
    committees: [],
    connections: [],
    sources: [SRC.wiprD31, SRC.metroD31, SRC.ballotpediaLopez],
  },
}
