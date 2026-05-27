import { describe, it, expect } from 'vitest'
import {
  NEIGHBOUR_OFFSETS_EVEN_ROW,
  NEIGHBOUR_OFFSETS_ODD_ROW,
  hexCenter,
  neighbourOffsets,
} from '../patterns/reiter-snowflake/hex'

describe('hex grid', () => {
  it('every cell has exactly six neighbours (both parities)', () => {
    expect(NEIGHBOUR_OFFSETS_EVEN_ROW).toHaveLength(6)
    expect(NEIGHBOUR_OFFSETS_ODD_ROW).toHaveLength(6)
  })

  it('neighbour relation is symmetric: A is B\'s neighbour iff B is A\'s', () => {
    // For each (col, row), check every neighbour and verify reciprocity.
    const check = (col: number, row: number) => {
      const offsets = neighbourOffsets(row)
      for (const [dc, dr] of offsets) {
        const nc = col + dc
        const nr = row + dr
        const backOffsets = neighbourOffsets(nr)
        const back = backOffsets.find(
          ([bdc, bdr]) => nc + bdc === col && nr + bdr === row,
        )
        expect(back, `(${col},${row}) → (${nc},${nr}) must be reciprocal`).toBeTruthy()
      }
    }
    // Mix of even and odd rows.
    for (const col of [0, 5, 10]) {
      for (const row of [0, 1, 2, 3, 4, 5]) {
        check(col, row)
      }
    }
  })

  it('hexCenter staggers odd rows horizontally', () => {
    const r = 10
    const a = hexCenter(0, 0, r) // even row
    const b = hexCenter(0, 1, r) // odd row
    expect(b.x).toBeCloseTo(a.x + (Math.sqrt(3) * r) / 2)
    expect(b.y).toBeCloseTo(a.y + 1.5 * r)
  })

  it('neighbourOffsets returns the right set for parity', () => {
    expect(neighbourOffsets(0)).toBe(NEIGHBOUR_OFFSETS_EVEN_ROW)
    expect(neighbourOffsets(2)).toBe(NEIGHBOUR_OFFSETS_EVEN_ROW)
    expect(neighbourOffsets(1)).toBe(NEIGHBOUR_OFFSETS_ODD_ROW)
    expect(neighbourOffsets(3)).toBe(NEIGHBOUR_OFFSETS_ODD_ROW)
  })
})
