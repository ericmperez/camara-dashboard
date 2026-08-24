export type TenureCite = {
  assumed: number
  source: string
}

/** Año en que asumió el escaño actual. Solo años citados (Ballotpedia, Wikipedia, ficha, especial). */
export const TENURE: Record<string, TenureCite> = {
  'carlos-johnny-mendez-nunez': { assumed: 2005, source: 'Wikipedia · asunción 1 ene 2005' },
  'yashira-lebron-rodriguez': { assumed: 2014, source: 'Repeat / ficha · primera mujer D8' },
  'angel-r-pena-ramirez': { assumed: 2009, source: 'Análisis de repetidores' },
  'jorge-navarro-suarez': { assumed: 2005, source: 'Wikipedia · 2 ene 2005' },
  'joel-i-franqui-atiles': { assumed: 2017, source: 'Análisis de repetidores · tercer cuatrienio' },
  'eddie-charbonier-chinea': { assumed: 2017, source: 'Análisis de repetidores' },
  'angel-morey-noble': { assumed: 2021, source: 'Ballotpedia · 1 jun 2021' },
  'luis-perez-ortiz': { assumed: 1998, source: 'Ballotpedia · asumió 1998' },
  'wanda-del-valle-correa': { assumed: 2021, source: 'Análisis de repetidores' },
  'gretchen-hau': { assumed: 2023, source: 'D29 desde 2023 (Cayey / Ortiz)' },
  'victor-l-pares-otero': { assumed: 2017, source: 'Ballotpedia · 2 ene 2017' },
  'jose-hernandez-concepcion': { assumed: 2022, source: 'Ballotpedia · 12 dic 2022' },
  'ricardo-chino-rey-ocasio-ramos': { assumed: 2025, source: 'Ballotpedia · 2 ene 2025' },
  'christian-muriel-sanchez': { assumed: 2025, source: 'Ballotpedia · 2 ene 2025' },
  'roberto-lopez-roman': { assumed: 2025, source: 'Especial D31 · asumió 7 oct 2025' },
}
