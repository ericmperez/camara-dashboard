import type { DossierSource } from '../../types'
import { SRC } from './sources'

/** Presidencias vigentes. RC0002 / ene 2025 (Microjuris + Radio Isla), con Trabajo actualizado. */
export const COMMISSION_SOURCES: DossierSource[] = [
  SRC.microjurisComisiones,
  SRC.radioIslaComisiones,
]

export const CHAIRS: Record<string, string[]> = {
  'victor-l-pares-otero': ['Gobierno'],
  'eddie-charbonier-chinea': ['Hacienda'],
  'jose-j-perez-cordero': ['lo Jurídico'],
  'pedro-j-pelle-santiago-guzman': ['Asuntos Internos'],
  'joe-joito-colon-rodriguez': ['Agricultura'],
  'wanda-del-valle-correa': ['Asuntos de la Mujer'],
  'ensol-a-rodriguez-torres': ['Juventud'],
  'ricardo-chino-rey-ocasio-ramos': ['Adultos Mayores y Bienestar Social'],
  'tatiana-perez-ramirez': ['Educación'],
  'axel-chino-roque-gracia': ['Turismo', 'Región Central'],
  'christian-muriel-sanchez': ['Cooperativismo'],
  'roberto-lopez-roman': ['Trabajo y Asuntos Laborales'],
  'maria-de-lourdes-ramos-rivera': ['Sistema de Retiro'],
  'jose-f-aponte-hernandez': ['Asuntos Federales y Veteranos'],
  'luis-perez-ortiz': ['Asuntos Municipales'],
  'joel-i-franqui-atiles': ['Desarrollo Económico'],
  'sergio-estevez-velez': ['Pequeños y Medianos Negocios'],
  'luis-josean-jimenez-torres': ['Recreación y Deportes'],
  'elinette-gonzalez-aguayo': ['Recursos Naturales'],
  'gabriel-rodriguez-aguilo': ['Salud'],
  'jose-hernandez-concepcion': ['Transportación e Infraestructura'],
  'omayra-m-martinez-vazquez': ['Vivienda y Desarrollo Urbano'],
  'edgar-robles-rivera': ['Asuntos del Consumidor'],
  'jorge-navarro-suarez': ['Banca, Seguros y Comercio', 'Región Metro'],
  'felix-pacheco-burgos': ['Seguridad Pública'],
  'jose-e-torres-zamora': ['Calendario y Reglas Especiales de Debate'],
  'angel-r-pena-ramirez': ['Ética'],
  'jerry-nieves-rosario': ['Región Norte'],
  'fernando-sanabria-colon': ['Región Sur'],
  'carmen-medina-calderon': ['Región Este'],
  'odalys-gonzalez-gonzalez': ['Región Oeste'],
  'angel-morey-noble': ['Reorganización, Eficiencia y Diligencia'],
}

export const DUAL_CHAIRS = {
  'axel-chino-roque-gracia': ['Turismo', 'Región Central'],
  'jorge-navarro-suarez': ['Banca, Seguros y Comercio', 'Región Metro'],
} as const
