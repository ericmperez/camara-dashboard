import oceFile from '../data/oce.json'

export type OceReport = {
  committeeId: string
  committeeName: string
  reportId: number
  reportNumber: string
  period: string
  event: string
  filedAt: string | null
  income: number
  expenses: number
  sourceUrl: string
}

type OceFile = {
  checkedAt: string
  searchUrl: string
  balancesUrl: string
  note: string
  byId: Record<string, OceReport>
}

const OCE = oceFile as OceFile

export function oceCheckedAt(): string {
  return OCE.checkedAt
}

export function oceNote(): string {
  return OCE.note
}

export function oceSearchUrl(): string {
  return OCE.searchUrl
}

export function oceBalancesUrl(): string {
  return OCE.balancesUrl
}

export function oceFor(id: string): OceReport | null {
  return OCE.byId[id] ?? null
}

export function formatUsd(value: number): string {
  const negative = value < 0
  const [whole, frac] = Math.abs(value).toFixed(2).split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${negative ? '-' : ''}$${grouped}.${frac}`
}
