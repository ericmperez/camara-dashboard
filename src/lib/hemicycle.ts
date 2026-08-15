import type { Representative } from '../types'

export const ROW_SIZES = [8, 12, 15, 18] as const

export type SeatLayout = {
  id: string
  index: number
  row: number
  col: number
  x: number
  y: number
  rep: Representative
}

export function layoutHemicycle(
  reps: Representative[],
  width = 720,
  height = 380,
): SeatLayout[] {
  const cx = width / 2
  const cy = height - 28
  const seats: SeatLayout[] = []
  let index = 0

  ROW_SIZES.forEach((size, row) => {
    const radius = 92 + row * 58
    for (let col = 0; col < size; col += 1) {
      const rep = reps[index]
      if (!rep) return
      const t = col / (size - 1)
      const angle = Math.PI - t * Math.PI
      seats.push({
        id: rep.id,
        index,
        row,
        col,
        x: cx + Math.cos(angle) * radius,
        y: cy - Math.sin(angle) * radius,
        rep,
      })
      index += 1
    }
  })

  return seats
}
