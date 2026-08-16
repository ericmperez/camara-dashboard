import type { DossierSource } from '../../types'

export const SRC = {
  wiprD31: {
    url: 'https://wipr.pr/roberto-lopez-roman-gana-la-eleccion-especial-por-el-distrito-31-de-gurabo-y-caguas/',
    label: 'WIPR · López Román gana la especial del Distrito 31',
    published: '2025-09-28',
  },
  metroD31: {
    url: 'https://www.metro.pr/noticias/2025/09/29/cee-certifica-a-roberto-lopez-roman-como-nuevo-representante-por-el-distrito-31/',
    label: 'Metro · CEE certifica a López Román (D31)',
    published: '2025-09-29',
  },
  ballotpediaLopez: {
    url: 'https://ballotpedia.org/Roberto_L%C3%B3pez_Rom%C3%A1n_(Puerto_Rico)',
    label: 'Ballotpedia · Roberto López Román',
  },
  camaraFerrer: {
    url: 'https://www.camara.pr.gov/team/hector-e-ferrer-santiago/',
    label: 'Cámara · ficha oficial de Héctor E. Ferrer Santiago',
  },
  metroInaugural: {
    url: 'https://www.metro.pr/noticias/2025/01/13/johnny-mendez-asume-la-presidencia-de-la-camara-de-representantes/',
    label: 'Metro · Méndez asume la presidencia (foto de expresidentes)',
    published: '2025-01-13',
  },
  wiprMendez: {
    url: 'https://wipr.pr/carlos-johnny-mendez-juramenta-como-presidente-de-la-camara-de-representantes/',
    label: 'WIPR · Méndez juramenta como presidente (50 votos)',
    published: '2025-01-13',
  },
  voceroPrioridades: {
    url: 'https://www.elvocero.com/gobierno/legislatura/presidente-cameral-establece-prioridades-para-segunda-sesi-n-legislativa/article_ad472bbd-0668-4137-b490-cef5632df20f.html',
    label: 'El Vocero · prioridades de la segunda sesión',
    published: '2026-08-16',
  },
  camaraMendez: {
    url: 'https://www.camara.pr.gov/team/carlos-johnny-mendez-nunez/',
    label: 'Cámara · ficha oficial de Carlos ‘Johnny’ Méndez Núñez',
  },
  wikiAponte: {
    url: 'https://en.wikipedia.org/wiki/Jos%C3%A9_Aponte_Hern%C3%A1ndez',
    label: 'Wikipedia · José Aponte Hernández (Speaker 2005–2008)',
  },
  univisionRivera: {
    url: 'https://www.univision.com/local/puerto-rico-wlii/jaime-perello-renuncia-a-la-presidencia-de-la-camara-de-representantes',
    label: 'Univision · Perelló renuncia; Rivera Ruiz asume la presidencia',
    published: '2016-08-29',
  },
  wikiRivera: {
    url: 'https://en.wikipedia.org/wiki/Roberto_Rivera_Ruiz_de_Porras',
    label: 'Wikipedia · Rivera Ruiz de Porras (presidente interino 2016–2017)',
  },
} as const satisfies Record<string, DossierSource>

export function officialSource(profileUrl: string, name: string): DossierSource {
  return {
    url: profileUrl,
    label: `Cámara · ficha oficial de ${name}`,
  }
}
