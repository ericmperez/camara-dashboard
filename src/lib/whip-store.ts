import type { WhipBoard, WhipSeat, WhipStatus } from '../types'
import { WHIP_STATUSES } from '../types'
import { DEFAULT_WHIP_STATUS, emptyWhipBoard, emptyWhipSeat } from './whip'

export const WHIP_STORAGE_KEY = 'camara-whip-store'
export const WHIP_BANNER =
  'Esto vive en este iPad; no se sube al directorio público.'

export type StorageLike = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export type WhipStore = {
  version: 1
  activeKey: string
  boards: Record<string, WhipBoard>
}

export function measureKey(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, '')
}

export function memoryStorage(initial: Record<string, string> = {}): StorageLike {
  const data = { ...initial }
  return {
    getItem(key: string) {
      return data[key] ?? null
    },
    setItem(key: string, value: string) {
      data[key] = value
    },
  }
}

function isStatus(value: unknown): value is WhipStatus {
  return typeof value === 'string' && (WHIP_STATUSES as readonly string[]).includes(value)
}

function hydrateSeat(raw: unknown): WhipSeat {
  if (!raw || typeof raw !== 'object') return emptyWhipSeat()
  const seat = raw as Record<string, unknown>
  return {
    status: isStatus(seat.status) ? seat.status : DEFAULT_WHIP_STATUS,
    note: typeof seat.note === 'string' ? seat.note : null,
  }
}

export function hydrateBoard(
  raw: unknown,
  ids: readonly string[],
  fallbackCode = '',
): WhipBoard {
  const empty = emptyWhipBoard(ids, fallbackCode)
  if (!raw || typeof raw !== 'object') return empty
  const value = raw as Record<string, unknown>
  const measureCode = typeof value.measureCode === 'string' ? value.measureCode : fallbackCode
  const title = typeof value.title === 'string' && value.title.trim() ? value.title : null
  const updatedAt = typeof value.updatedAt === 'string' ? value.updatedAt : empty.updatedAt
  const rawSeats =
    value.seats && typeof value.seats === 'object'
      ? (value.seats as Record<string, unknown>)
      : {}
  const seats: Record<string, WhipSeat> = {}
  for (const id of ids) {
    seats[id] = hydrateSeat(rawSeats[id])
  }
  return { measureCode, title, updatedAt, seats }
}

export function emptyStore(): WhipStore {
  return { version: 1, activeKey: '', boards: {} }
}

export function parseStore(raw: string | null, ids: readonly string[]): WhipStore {
  if (!raw) return emptyStore()
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const value = parsed as Record<string, unknown>
    const boardsIn =
      value.boards && typeof value.boards === 'object'
        ? (value.boards as Record<string, unknown>)
        : {}
    const boards: Record<string, WhipBoard> = {}
    for (const [key, board] of Object.entries(boardsIn)) {
      const hydrated = hydrateBoard(board, ids, key)
      boards[measureKey(key)] = hydrated
    }
    const activeKey =
      typeof value.activeKey === 'string' ? measureKey(value.activeKey) : ''
    return {
      version: 1,
      activeKey: activeKey in boards || activeKey === '' ? activeKey : '',
      boards,
    }
  } catch {
    return emptyStore()
  }
}

export function serializeStore(store: WhipStore): string {
  return JSON.stringify({
    version: 1,
    activeKey: store.activeKey,
    boards: store.boards,
  })
}

export function readStore(ids: readonly string[], storage: StorageLike): WhipStore {
  return parseStore(storage.getItem(WHIP_STORAGE_KEY), ids)
}

export function writeStore(store: WhipStore, storage: StorageLike): void {
  storage.setItem(WHIP_STORAGE_KEY, serializeStore(store))
}

export function loadActiveBoard(ids: readonly string[], storage: StorageLike): WhipBoard {
  const store = readStore(ids, storage)
  const saved = store.boards[store.activeKey]
  if (!saved) return emptyWhipBoard(ids, '')
  return hydrateBoard(saved, ids, saved.measureCode)
}

export function persistBoard(
  board: WhipBoard,
  ids: readonly string[],
  storage: StorageLike,
  key = measureKey(board.measureCode),
): WhipStore {
  const store = readStore(ids, storage)
  const next: WhipStore = {
    version: 1,
    activeKey: key,
    boards: { ...store.boards, [key]: hydrateBoard(board, ids, board.measureCode) },
  }
  writeStore(next, storage)
  return next
}

export function switchMeasure(
  current: WhipBoard,
  nextCode: string,
  ids: readonly string[],
  storage: StorageLike,
): WhipBoard {
  const prevKey = measureKey(current.measureCode)
  const nextKey = measureKey(nextCode)
  persistBoard(current, ids, storage, prevKey)
  if (nextKey === prevKey) {
    const renamed = { ...current, measureCode: nextCode }
    persistBoard(renamed, ids, storage, nextKey)
    return renamed
  }
  const store = readStore(ids, storage)
  const existing = store.boards[nextKey]
  let board: WhipBoard
  if (existing) {
    board = hydrateBoard(existing, ids, nextCode)
  } else if (prevKey === '') {
    board = { ...current, measureCode: nextCode }
  } else {
    board = emptyWhipBoard(ids, nextCode)
  }
  persistBoard(board, ids, storage, nextKey)
  return board
}

export function browserStorage(): StorageLike | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const probe = '__camara_whip__'
    localStorage.setItem(probe, probe)
    localStorage.removeItem(probe)
    return localStorage
  } catch {
    return null
  }
}
