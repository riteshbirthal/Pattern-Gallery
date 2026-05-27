/**
 * Hexagonal grid math used by the Reiter snowflake CA.
 * We use "odd-r" offset coordinates: rows are offset horizontally on odd indices.
 * Neighbour offsets differ by row parity.
 */

export const NEIGHBOUR_OFFSETS_EVEN_ROW: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
]

export const NEIGHBOUR_OFFSETS_ODD_ROW: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 1],
]

export function neighbourOffsets(row: number) {
  return row % 2 === 0 ? NEIGHBOUR_OFFSETS_EVEN_ROW : NEIGHBOUR_OFFSETS_ODD_ROW
}

/** Center pixel of a flat-top hex at offset (col, row) given hex radius r. */
export function hexCenter(col: number, row: number, radius: number) {
  const w = Math.sqrt(3) * radius
  const h = 1.5 * radius
  const x = w * col + (row % 2 === 0 ? 0 : w / 2)
  const y = h * row
  return { x, y }
}
