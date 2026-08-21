import type { Dossier } from '../../types'
import { SRC } from './sources'

/** Hechos citados fuera de la mesa / D31 / expresidentes. No inventa biografía. */
export const EXTRAS: Record<string, Partial<Dossier>> = {
  'eddie-charbonier-chinea': {
    career: ['Presidente de Hacienda; también consta en su ficha oficial.'],
    sources: [SRC.camaraEddie, SRC.microjurisComisiones],
  },
  'nelie-lebron-robles': {
    bio: 'Entra por la cláusula constitucional de minorías. Su origen electoral fue el Distrito 40; en el directorio oficial sienta el escaño como acumulación. No se usa el apellido Flores.',
    career: ['Tercer escaño del PIP en la Cámara, por ley de minorías.'],
    connections: [
      {
        toId: 'adriana-gutierrez-colon',
        kind: 'fact',
        label: 'Ambas entraron por ley de minorías (PIP) en 2024',
        sources: [SRC.perlaMinorias, SRC.metroRoster],
      },
    ],
    sources: [SRC.perlaMinorias, SRC.metroRoster],
  },
  'jose-conny-varela': {
    career: [
      'En abril de 2026 dijo que el presidente no puede suspender un mandato de la Cámara (RC 352 / centros de inspección).',
    ],
    connections: [
      {
        toId: 'carlos-johnny-mendez-nunez',
        kind: 'fact',
        label: 'Discrepó cuando Méndez paralizó la pesquisa de la RC 352 (abr 2026)',
        sources: [SRC.metroRC352],
      },
    ],
    sources: [SRC.metroRC352],
  },
}
