import type { Party, WhipBoard, WhipSeat, WhipStatus } from '../types'
import { WHIP_STATUSES } from '../types'

export const NEED_FOR_MAJORITY = 27
export const DEFAULT_WHIP_STATUS: WhipStatus = 'no-contactado'

export type WhipBreakdown = Record<WhipStatus, number>

export function emptyWhipSeat(): WhipSeat {
  return { status: DEFAULT_WHIP_STATUS, note: null }
}

/** Partido y cargo no marcan sí. El default es siempre no-contactado. */
export function defaultStatusFor(_party: Party): WhipStatus {
  return DEFAULT_WHIP_STATUS
}

export function emptyWhipBoard(
  ids: readonly string[],
  measureCode: string,
  title: string | null = null,
  now: string = new Date().toISOString(),
): WhipBoard {
  const seats: Record<string, WhipSeat> = {}
  for (const id of ids) {
    seats[id] = emptyWhipSeat()
  }
  return { measureCode, title, updatedAt: now, seats }
}

export function setSeatStatus(
  board: WhipBoard,
  id: string,
  status: WhipStatus,
  now: string = new Date().toISOString(),
): WhipBoard {
  const current = board.seats[id] ?? emptyWhipSeat()
  return {
    ...board,
    updatedAt: now,
    seats: {
      ...board.seats,
      [id]: { ...current, status },
    },
  }
}

export function yesCount(board: WhipBoard): number {
  return Object.values(board.seats).filter((seat) => seat.status === 'si').length
}

export function needForMajority(board: WhipBoard): number {
  return Math.max(0, NEED_FOR_MAJORITY - yesCount(board))
}

export function statusBreakdown(board: WhipBoard): WhipBreakdown {
  const counts: WhipBreakdown = {
    'no-contactado': 0,
    'voto-que-puedo-coger': 0,
    indeciso: 0,
    si: 0,
    no: 0,
  }
  for (const seat of Object.values(board.seats)) {
    counts[seat.status] += 1
  }
  return counts
}

export { WHIP_STATUSES }
