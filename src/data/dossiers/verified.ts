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

  'christian-muriel-sanchez': {
    id: 'christian-muriel-sanchez',
    bio: 'Titular del Distrito 34 (Yabucoa, Maunabo, Patillas y San Lorenzo) por el PNP. Asumió el 2 de enero de 2025; el término vence el 2 de enero de 2029 (Ballotpedia). SUTRA lo lista como M-967-AL, cuatrienio 2025–2028. Correo oficial: cmuriel@camara.pr.gov. Preside la Comisión de Cooperativismo (ficha oficial).',
    career: [
      'Primaria PNP del 2 de junio de 2024: Victoria 840 (82% escrutado) lo da con 2,876 votos (54.20%) frente a Javier Velázquez, 2,430 (45.80%). Ballotpedia confirma que derrotó a Velázquez.',
      'Generales del 5 de noviembre de 2024: Muriel (PNP) 16,831 (47.6%), el incumbente Ramón Luis Cruz / Ramón Cruz Burgos (PPD) 15,130 (42.8%), Catalino Santiago (PIP) 3,383 (9.6%); total 35,344. Ganancia PNP (Wikipedia / Ballotpedia).',
      'Expediente OCE-EB-24-093: candidato a representante por el Distrito 34, PNP. El índice distrital de auditorías 2024 lo lista. No se citan montos ni hallazgos.',
      'El Nuevo Día: los datos oficiales primero lo incluían entre legisladores con un familiar en la Cámara; dijo que pidió dispensa a Ética y al presidente Méndez, se autorizó, pero «no procedimos a completar el trámite. No tengo a nadie, ni familiar ni nadie cercano, trabajando en mi oficina.» ENDI no nombra al familiar.',
    ],
    aspirations: [
      'RCC 292: planes de turismo municipal para el Distrito 34 (SUTRA).',
      'RC 310: investigación de los salones de Educación Especial del Distrito 34 (SUTRA).',
      'RC 263: estudio de la criminalidad en el Distrito 34 (SUTRA).',
      'RC 200: investigación de carreteras e infraestructura del Distrito 34 (SUTRA).',
      'PC 830 (seguridad pública / portación de armas): presentado el 28 de agosto de 2025; aprobado por la Cámara el 20 de abril de 2026 (SUTRA / Plural).',
      'Reunión del 20 de enero de 2026 con el director regional del DTOP y el alcalde de Yabucoa, Rafael Surillo, sobre mejoras viales (Isla News). Hecho de la reunión; no implica alianza partidista.',
    ],
    committees: [],
    connections: [
      {
        toId: 'carlos-johnny-mendez-nunez',
        kind: 'fact',
        label: 'ENDI: Ética y Méndez autorizaron una dispensa que él no completó; dijo que no tiene familiar en su oficina',
        sources: [SRC.endiFamiliares],
      },
    ],
    sources: [
      SRC.camaraMuriel,
      SRC.sutraMuriel,
      SRC.ballotpediaMuriel,
      SRC.wiki2024House,
      SRC.victoria840Muriel,
      SRC.oceMuriel,
      SRC.oceD34,
      SRC.pluralPC830,
      SRC.islaNewsYabucoa,
      SRC.endiFamiliares,
    ],
  },
}
