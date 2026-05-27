import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

// Margolus neighborhood block CA: cells partition into 2x2 blocks, alternating between two
// offset partitions each step. Several classic rules implemented here as 16-entry tables
// indexed by the 4-bit block (NW, NE, SW, SE).
const RULES: Record<string, number[]> = {
  // BBM (Billiard Ball Machine): only 4 states defined, others identity. Standard reflective.
  bbm: [0, 8, 4, 3, 2, 5, 9, 7, 1, 6, 10, 11, 12, 13, 14, 15],
  // Critters (Norman Margolus): T-symmetric, reversible. Beautiful glider zoo.
  critters: [15, 14, 13, 3, 11, 5, 6, 1, 7, 9, 10, 2, 12, 4, 8, 0],
  // TM Gas: simple lattice gas (rotation when 2 diagonal particles).
  tmgas: [0, 8, 4, 12, 2, 10, 9, 14, 1, 6, 5, 13, 3, 11, 7, 15],
  // Tron: each block flipped wholesale. Identity-then-NOT.
  tron: [15, 1, 2, 12, 4, 10, 9, 7, 8, 6, 5, 11, 3, 13, 14, 0],
}

export class MargolusRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private grid!: Uint8Array
  private cols = 0
  private rows = 0
  private cellSize = 0
  private phase = 0

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.reset()
  }

  setParams(params: ParamValues): void {
    const old = this.params
    this.params = { ...params }
    if (
      old.cellSize !== params.cellSize ||
      old.density !== params.density ||
      old.rule !== params.rule
    )
      this.reset()
  }

  reset(): void {
    this.cellSize = this.params.cellSize as number
    // Margolus needs even dimensions so partitions align.
    this.cols = Math.floor(this.width / this.cellSize) & ~1
    this.rows = Math.floor(this.height / this.cellSize) & ~1
    this.grid = new Uint8Array(this.cols * this.rows)
    const density = this.params.density as number
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = Math.random() < density ? 1 : 0
    }
    this.phase = 0
  }

  step(): void {
    const cols = this.cols
    const rows = this.rows
    const ruleName = this.params.rule as string
    const rule = RULES[ruleName] ?? RULES.critters
    const off = this.phase
    for (let y = off; y < rows - 1; y += 2) {
      for (let x = off; x < cols - 1; x += 2) {
        const i00 = y * cols + x
        const i10 = i00 + 1
        const i01 = i00 + cols
        const i11 = i01 + 1
        const block =
          (this.grid[i00] << 3) | (this.grid[i10] << 2) | (this.grid[i01] << 1) | this.grid[i11]
        const out = rule[block]
        this.grid[i00] = (out >> 3) & 1
        this.grid[i10] = (out >> 2) & 1
        this.grid[i01] = (out >> 1) & 1
        this.grid[i11] = out & 1
      }
    }
    this.phase = 1 - this.phase
  }

  draw(): void {
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.fillStyle = '#dde3ee'
    const cs = this.cellSize
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.grid[y * this.cols + x]) ctx.fillRect(x * cs, y * cs, cs, cs)
      }
    }
  }

  dispose(): void {}
}

export function createMargolusRenderer(): Renderer {
  return new MargolusRenderer()
}
