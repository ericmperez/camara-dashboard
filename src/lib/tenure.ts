import { TENURE } from '../data/tenure'
import { REPEAT_PROFILES } from '../data/repeat-profiles'
import type { Representative } from '../types'

export const HOUSE_CYCLES = [1997, 2001, 2005, 2009, 2013, 2017, 2021, 2025] as const
const CYCLE_END = 2028

export type TenureBlock = {
  start: number
  end: number
  label: string
  current: boolean
}

export type TenureRead = {
  assumed: number
  cited: boolean
  source: string
  blocks: TenureBlock[]
  count: number
}

function cycleStartOf(year: number): number {
  let start = HOUSE_CYCLES[0]
  for (const cycle of HOUSE_CYCLES) {
    if (cycle <= year) start = cycle
  }
  return start
}

export function blocksFromAssumed(assumed: number): TenureBlock[] {
  const first = cycleStartOf(assumed)
  const blocks: TenureBlock[] = []
  for (const cycle of HOUSE_CYCLES) {
    if (cycle < first) continue
    const start = cycle === first ? assumed : cycle
    const end = Math.min(cycle + 3, CYCLE_END)
    blocks.push({
      start,
      end,
      label: `${start}–${end}`,
      current: cycle === 2025,
    })
  }
  return blocks
}

export function tenureOf(rep: Representative): TenureRead {
  const cite = TENURE[rep.id]
  const fromRepeat = REPEAT_PROFILES[rep.id]?.since ?? null
  const assumed = cite?.assumed ?? fromRepeat
  if (assumed == null) {
    return {
      assumed: 2025,
      cited: false,
      source: 'Solo el cuatrienio en curso (directorio oficial). Sin año de asunción citado.',
      blocks: blocksFromAssumed(2025),
      count: 1,
    }
  }
  const blocks = blocksFromAssumed(assumed)
  return {
    assumed,
    cited: true,
    source: cite?.source ?? `En el escaño desde ${assumed} (ficha de repetidores).`,
    blocks,
    count: blocks.length,
  }
}

export function tenureSearchText(rep: Representative): string {
  const read = tenureOf(rep)
  return ['cuatrienio', 'cuatrienios', String(read.assumed), ...read.blocks.map((b) => b.label)].join(
    ' ',
  )
}
