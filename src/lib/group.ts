import { PARTIES } from '../types'
import type { Party, Representative } from '../types'
import { sortRepresentatives } from './filter'

export type PartyGroup = {
  party: Party
  members: Representative[]
}

export function districtOnly(reps: Representative[]): Representative[] {
  return reps.filter((rep) => rep.district !== null)
}

export function splitDistrictsByParty(reps: Representative[]): PartyGroup[] {
  const seats = districtOnly(reps)
  return PARTIES.map((party) => ({
    party,
    members: sortRepresentatives(seats.filter((rep) => rep.party === party)),
  }))
}

export function groupByParty(reps: Representative[]): PartyGroup[] {
  return PARTIES.map((party) => ({
    party,
    members: reps.filter((rep) => rep.party === party),
  })).filter((group) => group.members.length > 0)
}

export function countDistrictsByParty(reps: Representative[]): Record<Party, number> {
  return splitDistrictsByParty(reps).reduce(
    (acc, group) => {
      acc[group.party] = group.members.length
      return acc
    },
    { PNP: 0, PPD: 0, PIP: 0, PD: 0 } satisfies Record<Party, number>,
  )
}
