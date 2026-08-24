import type { Party, Representative, RosterFilters } from '../types'
import { dossierSearchText } from './dossiers'
import { matchesMeasureCode, measureSearchText } from './measures'
import { profileSearchText } from './profile'
import { curveSearchText } from './curve'
import { playbookSearchText } from './playbook'
import { repeatSearchText } from './repeat'
import { tenureSearchText } from './tenure'
import { normalize } from './text'

const EMPTY_FILTERS: RosterFilters = {
  query: '',
  party: 'all',
  seat: 'all',
}

export function emptyFilters(): RosterFilters {
  return { ...EMPTY_FILTERS }
}

function tokensOf(value: string): string[] {
  return normalize(value).split(' ').filter(Boolean)
}

function identityWords(rep: Representative): string[] {
  return [
    ...tokensOf(rep.name),
    ...tokensOf(rep.districtLabel),
    ...tokensOf(rep.role ?? ''),
    ...tokensOf(rep.party),
    ...tokensOf(rep.email ?? ''),
    ...rep.municipalities.flatMap(tokensOf),
    ...tokensOf(profileSearchText(rep)),
    ...(rep.district === null ? ['acumulacion'] : []),
  ]
}

function searchableWords(rep: Representative): string[] {
  return [
    ...identityWords(rep),
    ...tokensOf(measureSearchText(rep.id)),
    ...tokensOf(dossierSearchText(rep.id)),
    ...tokensOf(repeatSearchText(rep)),
    ...tokensOf(playbookSearchText(rep.id)),
    ...tokensOf(curveSearchText(rep)),
    ...tokensOf(tenureSearchText(rep)),
  ]
}

function matchesToken(words: string[], token: string): boolean {
  return words.some((word) => word === token || (token.length >= 3 && word.startsWith(token)))
}

export function matchesQuery(rep: Representative, query: string): boolean {
  const tokens = tokensOf(query)
  if (tokens.length === 0) return true

  const districtTokenAt = tokens.findIndex(
    (token, index) => token === 'distrito' && /^\d+$/.test(tokens[index + 1] ?? ''),
  )
  if (districtTokenAt >= 0) {
    const number = Number(tokens[districtTokenAt + 1])
    if (rep.district !== number) return false
    const rest = tokens.filter((_, index) => index !== districtTokenAt && index !== districtTokenAt + 1)
    return rest.every((token) => matchesToken(searchableWords(rep), token))
  }

  if (tokens.length === 1 && /^\d+$/.test(tokens[0])) {
    return rep.district === Number(tokens[0])
  }

  if (matchesMeasureCode(rep, query)) return true

  return tokens.every((token) => matchesToken(searchableWords(rep), token))
}

function matchesIdentity(rep: Representative, query: string): boolean {
  const tokens = tokensOf(query)
  if (tokens.length === 0) return true
  return tokens.every((token) => matchesToken(identityWords(rep), token))
}

export function filterRepresentatives(
  reps: Representative[],
  filters: RosterFilters,
): Representative[] {
  const scoped = reps.filter((rep) => {
    if (filters.party !== 'all' && rep.party !== filters.party) return false
    if (filters.seat === 'distrito' && rep.district === null) return false
    if (filters.seat === 'acumulacion' && rep.district !== null) return false
    return true
  })
  if (!filters.query.trim()) return scoped
  if (scoped.some((rep) => matchesMeasureCode(rep, filters.query))) {
    return scoped.filter((rep) => matchesMeasureCode(rep, filters.query) || matchesIdentity(rep, filters.query))
  }
  const byName = scoped.filter((rep) => matchesIdentity(rep, filters.query))
  if (byName.length > 0) return byName
  return scoped.filter((rep) => matchesQuery(rep, filters.query))
}

export function sortRepresentatives(reps: Representative[]): Representative[] {
  return [...reps].sort((a, b) => {
    const aDistrict = a.district ?? 100
    const bDistrict = b.district ?? 100
    if (aDistrict !== bDistrict) return aDistrict - bDistrict
    return a.name.localeCompare(b.name, 'es')
  })
}

export function countByParty(reps: Representative[]): Record<Party, number> {
  return reps.reduce(
    (acc, rep) => {
      acc[rep.party] += 1
      return acc
    },
    { PNP: 0, PPD: 0, PIP: 0, PD: 0 } satisfies Record<Party, number>,
  )
}

export function hasActiveFilters(filters: RosterFilters): boolean {
  return filters.query.trim() !== '' || filters.party !== 'all' || filters.seat !== 'all'
}
