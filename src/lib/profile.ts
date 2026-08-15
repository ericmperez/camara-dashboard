import type { Party, Representative } from '../types'

export type Bloc = 'mayoría' | 'minoría'

export type PartyMeta = {
  name: string
  colloquial: string
  statusLabel: string
  statusLine: string
  bloc: Bloc
}

export const PARTY_META: Record<Party, PartyMeta> = {
  PNP: {
    name: 'Partido Nuevo Progresista',
    colloquial: 'estadistas',
    statusLabel: 'Estadidad',
    statusLine:
      'Línea de partido: estadidad. El PNP quiere que Puerto Rico sea un estado de Estados Unidos.',
    bloc: 'mayoría',
  },
  PPD: {
    name: 'Partido Popular Democrático',
    colloquial: 'populares',
    statusLabel: 'ELA / autonomismo',
    statusLine:
      'Línea de partido: Estado Libre Asociado. Los populares defienden el ELA y un autonomismo, no la anexión ni la independencia.',
    bloc: 'minoría',
  },
  PIP: {
    name: 'Partido Independentista Puertorriqueño',
    colloquial: 'independentistas',
    statusLabel: 'Independencia',
    statusLine:
      'Línea de partido: independencia. El PIP quiere una república soberana, fuera de la relación territorial con EE.UU.',
    bloc: 'minoría',
  },
  PD: {
    name: 'Proyecto Dignidad',
    colloquial: 'Proyecto Dignidad',
    statusLabel: 'Conservadurismo social',
    statusLine:
      'Línea de partido: conservadurismo social y religioso. Proyecto Dignidad no nace como partido de estatus; su eje es la agenda moral y familiar.',
    bloc: 'minoría',
  },
}

const NOTES: Record<string, string> = {
  'carlos-johnny-mendez-nunez':
    'Preside la Cámara: fija el calendario y la mesa de la mayoría PNP.',
  'yashira-lebron-rodriguez':
    'Vicepresidenta del cuerpo; parte del liderato de la mayoría estadista.',
  'angel-r-pena-ramirez':
    'Vicepresidente del cuerpo; parte del liderato de la mayoría estadista.',
  'wilson-j-roman-lopez':
    'Portavoz alterno de la mayoría PNP en el hemiciclo.',
  'domingo-j-torres-garcia':
    'Portavoz alterno de la delegación popular en el hemiciclo.',
  'gretchen-hau':
    'Abogada. Exsenadora del PPD; pasó del Senado a la Cámara y hoy cubre Cidra y Cayey.',
  'jose-conny-varela':
    'Popular de Caguas de larga data en la Cámara; fue figura de mayoría cuando el PPD controlaba el cuerpo.',
  'roberto-rivera-ruiz-de-porras':
    'Popular veterano de Carolina y Trujillo Alto; de los más antiguos de la delegación.',
  'hector-e-ferrer-santiago':
    'Portavoz de la minoría popular. Hijo de Héctor Ferrer; no tiene distrito propio (acumulación).',
  'denis-marquez-lebron':
    'Portavoz independentista. Es el rostro del PIP en la Cámara desde cuatrienios anteriores.',
  'adriana-gutierrez-colon':
    'Portavoz alterna del PIP. Entró por la cláusula constitucional de minorías.',
  'nelie-lebron-robles':
    'Tercer escaño del PIP en la Cámara, añadido por la ley de minorías.',
  'lisie-j-burgos-muniz':
    'Única representante de Proyecto Dignidad. Es el voto conservador-cristiano del hemiciclo.',
  'jose-e-torres-zamora':
    'Portavoz de la mayoría PNP. Escaño por acumulación, no por distrito.',
}

export type PoliticalProfile = {
  partyName: string
  colloquial: string
  statusLabel: string
  bloc: Bloc
  text: string
}

export function politicalProfile(rep: Representative): PoliticalProfile {
  const meta = PARTY_META[rep.party]
  const seat =
    rep.district !== null
      ? `Titular del ${rep.districtLabel}${
          rep.municipalities.length > 0 ? ` (${rep.municipalities.join(', ')})` : ''
        }.`
      : 'Representante por acumulación: sale de la lista isleña, no de un solo distrito.'
  const role = rep.role
    ? `En el hemiciclo es ${rep.role}.`
    : `No ocupa la mesa directiva; vota con la delegación ${meta.colloquial}.`
  const note = NOTES[rep.id]
  return {
    partyName: meta.name,
    colloquial: meta.colloquial,
    statusLabel: meta.statusLabel,
    bloc: meta.bloc,
    text: [seat, role, meta.statusLine, note].filter(Boolean).join(' '),
  }
}

export function profileSearchText(rep: Representative): string {
  const profile = politicalProfile(rep)
  return [profile.partyName, profile.colloquial, profile.statusLabel, profile.bloc, profile.text].join(
    ' ',
  )
}
