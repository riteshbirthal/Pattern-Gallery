import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

// "Hodgepodge" CA model of the Belousov-Zhabotinsky reaction (Gerhardt & Schuster 1989).
// Each cell has a state s in 0..N (healthy=0, sick=N, partially infected in between).
// Per step:
//   - if s == 0:        s' = floor(A / k1) + floor(B / k2)
//   - if 0 < s < N:     s' = floor(S / (A + B + 1)) + g
//   - if s == N:        s' = 0
// where A = #neighbors with 0 < state < N, B = #neighbors with state == N, S = sum(neighbor states + own).

export class BZRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private grid!: Uint16Array
  private next!: Uint16Array
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
    const oldCell = this.params?.cellSize
    this.params = { ...params }
    if (oldCell !== params.cellSize) this.reset()
  }

  reset(): void {
    this.cellSize = this.params.cellSize as number
    this.cols = Math.ceil(this.width / this.cellSize)
    this.rows = Math.ceil(this.height / this.cellSize)
    const N = this.params.N as number
    this.grid = new Uint16Array(this.cols * this.rows)
    this.next = new Uint16Array(this.cols * this.rows)
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = Math.floor(Math.random() * (N + 1))
    }
  }

  step(): void {
    const cols = this.cols
    const rows = this.rows
    const N = this.params.N as number
    const k1 = this.params.k1 as number
    const k2 = this.params.k2 as number
    const g = this.params.g as number
    const grid = this.grid
    const next = this.next
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x
        const self = grid[idx]
        let A = 0
        let B = 0
        let S = self
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const nx = (x + dx + cols) % cols
            const ny = (y + dy + rows) % rows
            const v = grid[ny * cols + nx]
            S += v
            if (v === N) B++
            else if (v > 0) A++
          }
        }
        let nv: number
        if (self === 0) {
          nv = Math.floor(A / k1) + Math.floor(B / k2)
        } else if (self < N) {
          nv = Math.floor(S / (A + B + 1)) + g
        } else {
          nv = 0
        }
        if (nv > N) nv = N
        if (nv < 0) nv = 0
        next[idx] = nv
      }
    }
    // Swap buffers.
    const tmp = this.grid
    this.grid = this.next
    this.next = tmp
  }

  draw(): void {
    const data = this.imageData.data
    const w = this.width
    const h = this.height
    const cs = this.cellSize
    const N = this.params.N as number
    const palette = this.params.palette as string
    for (let py = 0; py < h; py++) {
      const cy = Math.min(this.rows - 1, Math.floor(py / cs))
      for (let px = 0; px < w; px++) {
        const cx = Math.min(this.cols - 1, Math.floor(px / cs))
        const v = this.grid[cy * this.cols + cx]
        const t = v / N
        let r: number, g: number, b: number
        if (palette === 'classic') {
          // Reds → purples → blues, like a real BZ reaction.
          r = Math.floor(255 * Math.min(1, 1.4 - 1.5 * t))
          g = Math.floor(255 * Math.max(0, 0.2 - Math.abs(t - 0.5) * 0.4))
          b = Math.floor(255 * Math.min(1, 0.2 + 1.6 * t))
        } else if (palette === 'fire') {
          r = Math.floor(255 * Math.min(1, t * 2))
          g = Math.floor(255 * Math.max(0, t * 2 - 0.6))
          b = Math.floor(255 * Math.max(0, t * 2 - 1.5))
        } else {
          // 'mono'
          const c = Math.floor(255 * t)
          r = g = b = c
        }
        const di = (py * w + px) * 4
        data[di] = r
        data[di + 1] = g
        data[di + 2] = b
        data[di + 3] = 255
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createBZRenderer(): Renderer {
  return new BZRenderer()
}
