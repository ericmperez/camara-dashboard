import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { emptyWhipBoard, setSeatStatus, yesCount } from './whip'
import {
  WHIP_BANNER,
  WHIP_STORAGE_KEY,
  hydrateBoard,
  loadActiveBoard,
  measureKey,
  memoryStorage,
  parseStore,
  persistBoard,
  serializeStore,
  switchMeasure,
} from './whip-store'

const ids = REPRESENTATIVES.map((r) => r.id)
const johnny = 'carlos-johnny-mendez-nunez'
const hau = 'gretchen-hau'

describe('almacén de whip en el aparato', () => {
  it('normaliza el código de medida y serializa tableros por esa llave', () => {
    expect(measureKey('PC 1302')).toBe('PC1302')
    expect(measureKey(' pc1302 ')).toBe('PC1302')
    const storage = memoryStorage()
    let board = emptyWhipBoard(ids, 'PC 1302', 'Oficina de Ayuda')
    board = setSeatStatus(board, johnny, 'si')
    persistBoard(board, ids, storage)
    const raw = storage.getItem(WHIP_STORAGE_KEY)
    expect(raw).toBeTruthy()
    const store = parseStore(raw, ids)
    expect(store.activeKey).toBe('PC1302')
    expect(store.boards.PC1302?.seats[johnny]?.status).toBe('si')
    expect(yesCount(store.boards.PC1302!)).toBe(1)
    expect(JSON.parse(serializeStore(store)).boards.PC1302.measureCode).toBe('PC 1302')
  })

  it('hidrata asientos faltantes en no-contactado y rechaza estados inventados', () => {
    const raw = JSON.stringify({
      status: 'si',
      party: 'PNP',
      seats: {
        [johnny]: { status: 'maybe', party: 'PNP' },
        [hau]: { status: 'si', note: 'pasillo' },
      },
    })
    const board = hydrateBoard(JSON.parse(raw), ids, 'PC1')
    expect(board.seats[johnny]?.status).toBe('no-contactado')
    expect(board.seats[hau]?.status).toBe('si')
    expect(board.seats[hau]?.note).toBe('pasillo')
    expect(Object.keys(board.seats)).toHaveLength(53)
    expect(
      ids.filter((id) => id !== hau).every((id) => board.seats[id]?.status === 'no-contactado'),
    ).toBe(true)
  })

  it('JSON roto o vacío abre pizarra nueva, nunca sí por partido', () => {
    expect(parseStore('no-es-json', ids).boards).toEqual({})
    expect(parseStore(null, ids).activeKey).toBe('')
    const loaded = loadActiveBoard(ids, memoryStorage())
    expect(loaded.seats[johnny]?.status).toBe('no-contactado')
    expect(yesCount(loaded)).toBe(0)
  })

  it('cambiar de medida carga el tablero guardado y no mezcla escaños', () => {
    const storage = memoryStorage()
    let pc = emptyWhipBoard(ids, 'PC 1302')
    pc = setSeatStatus(pc, johnny, 'si')
    persistBoard(pc, ids, storage)
    let rc = switchMeasure(pc, 'RC 375', ids, storage)
    expect(rc.seats[johnny]?.status).toBe('no-contactado')
    rc = setSeatStatus(rc, hau, 'no')
    persistBoard(rc, ids, storage)
    const back = switchMeasure(rc, 'PC1302', ids, storage)
    expect(back.seats[johnny]?.status).toBe('si')
    expect(back.seats[hau]?.status).toBe('no-contactado')
  })

  it('nombra el aviso de iPad y no deja JSON de whip bajo src/data', () => {
    expect(WHIP_BANNER).toBe(
      'Esto vive en este iPad; no se sube al directorio público.',
    )
    const dataDir = resolve(process.cwd(), 'src/data')
    expect(existsSync(resolve(dataDir, 'whip.json'))).toBe(false)
    expect(existsSync(resolve(dataDir, 'whip-store.json'))).toBe(false)
  })
})
