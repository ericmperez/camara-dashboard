import type { PriorVote } from '../types'

const CEE_2020_DIST =
  'https://elecciones2020.ceepur.org/Noche_del_Evento_92/index.html#en/default_list/REPRESENTANTES_POR_DISTRITO_Distritos_Representativos.xml'
const CEE_2020_AL =
  'https://elecciones2020.ceepur.org/Noche_del_Evento_92/index.html#en/pic_bar_list/REPRESENTANTES_POR_ACUMULACION_Resumen.xml'
const LABEL = 'CEE · noche del evento 3 nov 2020 (vía Wikipedia)'

function dist(
  name: string,
  votes: number,
  pct: number,
  district: number,
  winner: boolean,
): PriorVote {
  return {
    year: 2020,
    name,
    votes,
    pct,
    winner,
    kind: 'distrito',
    district,
    comparable: true,
    sourceUrl: CEE_2020_DIST,
    sourceLabel: LABEL,
  }
}

/** Apodos y lista que el harvest automático no emparejó (o emparejó a otra persona). */
export const VOTES_2020_MANUAL: Record<string, PriorVote> = {
  'carlos-johnny-mendez-nunez': dist('Carlos Méndez', 9634, 44.36, 36, true),
  'angel-r-pena-ramirez': dist('Ángel Peña Jr.', 13257, 49.91, 33, true),
  'luis-perez-ortiz': dist('Luis Pérez Ortiz', 11064, 42.03, 7, true),
  'jose-conny-varela': dist('José Varela', 8558, 35.43, 32, true),
  'sol-y-higgins-cuadrado': dist('Sol Higgins', 11892, 49.26, 35, true),
  'angel-a-fourquet-cordero': dist('Ángel Fourquet', 9024, 36.34, 24, true),
  'jose-f-aponte-hernandez': {
    year: 2020,
    name: 'José Aponte Hernández',
    votes: 64017,
    pct: 5.54,
    winner: true,
    kind: 'acumulacion',
    district: null,
    comparable: true,
    sourceUrl: CEE_2020_AL,
    sourceLabel: LABEL,
  },
}
