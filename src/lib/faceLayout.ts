/** Producto, 20 Aug 2026: 53 fichas delgadas must scan on one phone screen. */
export const PHONE_VIEWPORT = { width: 390, height: 844 } as const

export const FACE_LAYOUT = {
  phoneColumns: 3,
  cardMaxHeight: 44,
  gap: 3,
} as const

export function faceBoardPhoneHeight(count: number): number {
  const columns = FACE_LAYOUT.phoneColumns
  if (count <= 0 || columns <= 0) return 0
  const rows = Math.ceil(count / columns)
  return rows * FACE_LAYOUT.cardMaxHeight + Math.max(0, rows - 1) * FACE_LAYOUT.gap
}

export function faceBoardFitsPhoneViewport(count = 53): boolean {
  return faceBoardPhoneHeight(count) <= PHONE_VIEWPORT.height
}
