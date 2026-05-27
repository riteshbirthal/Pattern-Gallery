import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

// Metropolis algorithm for the 2D Ising model (square lattice, +/- 1 spins).
export class IsingRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private grid!: Int8Array
  private cols = 0
  private rows = 0
  private cellSize = 0
  private imageData!: ImageData

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.imageData = this.ctx2d.createImageData(this.width, this.height)
    this.reset()
  }

  setParams(params: ParamValues): void {
    const old = this.params
    this.params = { ...params }
    if (old.cellSize !== params.cellSize || old.coldStart !== params.coldStart) this.reset()
  }

  reset(): void {
    this.cellSize = this.params.cellSize as number
    this.cols = Math.floor(this.width / this.cellSize)
    this.rows = Math.floor(this.height / this.cellSize)
    this.grid = new Int8Array(this.cols * this.rows)
    const cold = this.params.coldStart as boolean
    if (cold) {
      this.grid.fill(1)
    } else {
      for (let i = 0; i < this.grid.length; i++) this.grid[i] = Math.random() < 0.5 ? 1 : -1
    }
  }

  step(): void {
    const T = Math.max(0.1, this.params.T as number)
    const h = this.params.h as number
    const cols = this.cols
    const rows = this.rows
    const total = cols * rows
    // One full Monte Carlo sweep = total flips attempted.
    for (let k = 0; k < total; k++) {
      const idx = Math.floor(Math.random() * total)
      const x = idx % cols
      const y = Math.floor(idx / cols)
      const s = this.grid[idx]
      const sum =
        this.grid[((y - 1 + rows) % rows) * cols + x] +
        this.grid[((y + 1) % rows) * cols + x] +
        this.grid[y * cols + ((x - 1 + cols) % cols)] +
        this.grid[y * cols + ((x + 1) % cols)]
      const dE = 2 * s * (sum + h)
      if (dE <= 0 || Math.random() < Math.exp(-dE / T)) this.grid[idx] = -s as 1 | -1
    }
  }

  draw(): void {
    const data = this.imageData.data
    const w = this.width
    const h = this.height
    const cs = this.cellSize
    for (let py = 0; py < h; py++) {
      const cy = Math.min(this.rows - 1, Math.floor(py / cs))
      for (let px = 0; px < w; px++) {
        const cx = Math.min(this.cols - 1, Math.floor(px / cs))
        const v = this.grid[cy * this.cols + cx]
        const di = (py * w + px) * 4
        if (v === 1) {
          data[di] = 230
          data[di + 1] = 235
          data[di + 2] = 245
        } else {
          data[di] = 30
          data[di + 1] = 35
          data[di + 2] = 60
        }
        data[di + 3] = 255
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createIsingRenderer(): Renderer {
  return new IsingRenderer()
}
