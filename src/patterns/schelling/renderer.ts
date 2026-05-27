import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

// 0 = empty, 1 = group A, 2 = group B
export class SchellingRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private grid!: Uint8Array
  private cols = 0
  private rows = 0
  private cellSize = 0
  private emptyCells: number[] = []
  private unhappyCells: number[] = []

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
    if (old.cellSize !== params.cellSize || old.density !== params.density) this.reset()
  }

  reset(): void {
    this.cellSize = this.params.cellSize as number
    this.cols = Math.floor(this.width / this.cellSize)
    this.rows = Math.floor(this.height / this.cellSize)
    this.grid = new Uint8Array(this.cols * this.rows)
    const density = this.params.density as number
    for (let i = 0; i < this.grid.length; i++) {
      const r = Math.random()
      if (r < (1 - density) * 0.5) this.grid[i] = 0
      else if (r < (1 - density) * 0.5 + density * 0.5) this.grid[i] = 1
      else this.grid[i] = 2
    }
    this.collectEmpty()
  }

  private collectEmpty() {
    this.emptyCells = []
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] === 0) this.emptyCells.push(i)
    }
  }

  private isHappy(idx: number): boolean {
    const tolerance = this.params.tolerance as number
    const v = this.grid[idx]
    if (v === 0) return true
    const x = idx % this.cols
    const y = Math.floor(idx / this.cols)
    let same = 0
    let diff = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows) continue
        const nv = this.grid[ny * this.cols + nx]
        if (nv === 0) continue
        if (nv === v) same++
        else diff++
      }
    }
    if (same + diff === 0) return true
    return same / (same + diff) >= tolerance
  }

  step(): void {
    // Find unhappy cells.
    this.unhappyCells = []
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] !== 0 && !this.isHappy(i)) this.unhappyCells.push(i)
    }
    if (this.unhappyCells.length === 0 || this.emptyCells.length === 0) return
    // Move some unhappy cells to random empty cells.
    const moves = Math.min(50, this.unhappyCells.length)
    for (let k = 0; k < moves; k++) {
      const u = this.unhappyCells[Math.floor(Math.random() * this.unhappyCells.length)]
      const eIdx = Math.floor(Math.random() * this.emptyCells.length)
      const e = this.emptyCells[eIdx]
      this.grid[e] = this.grid[u]
      this.grid[u] = 0
      this.emptyCells[eIdx] = u
    }
  }

  draw(): void {
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    const cs = this.cellSize
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const v = this.grid[y * this.cols + x]
        if (v === 0) continue
        ctx.fillStyle = v === 1 ? '#5ab4f0' : '#f08550'
        ctx.fillRect(x * cs, y * cs, cs, cs)
      }
    }
  }

  dispose(): void {}
}

export function createSchellingRenderer(): Renderer {
  return new SchellingRenderer()
}
