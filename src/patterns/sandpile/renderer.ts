import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class SandpileRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private grid!: Int32Array
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
    if (old.cellSize !== params.cellSize || old.mode !== params.mode) this.reset()
  }

  reset(): void {
    this.cellSize = this.params.cellSize as number
    this.cols = Math.floor(this.width / this.cellSize)
    this.rows = Math.floor(this.height / this.cellSize)
    this.grid = new Int32Array(this.cols * this.rows)
    const mode = this.params.mode as string
    if (mode === 'preload') {
      // Drop a million grains in the center; topple to the unique stable equilibrium.
      const cx = Math.floor(this.cols / 2)
      const cy = Math.floor(this.rows / 2)
      const grains = this.params.preloadGrains as number
      this.grid[cy * this.cols + cx] = grains
      this.relax(50000) // big budget so it always converges in jsdom too.
    }
  }

  private relax(maxToppleEvents: number) {
    const cols = this.cols
    const rows = this.rows
    let events = 0
    let unstable = true
    while (unstable && events < maxToppleEvents) {
      unstable = false
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          while (this.grid[i] >= 4) {
            this.grid[i] -= 4
            if (x > 0) this.grid[i - 1]++
            if (x < cols - 1) this.grid[i + 1]++
            if (y > 0) this.grid[i - cols]++
            if (y < rows - 1) this.grid[i + cols]++
            unstable = true
            events++
            if (events >= maxToppleEvents) return
          }
        }
      }
    }
  }

  step(): void {
    const mode = this.params.mode as string
    if (mode === 'rain') {
      const drops = this.params.dropsPerStep as number
      for (let k = 0; k < drops; k++) {
        const x = Math.floor(Math.random() * this.cols)
        const y = Math.floor(Math.random() * this.rows)
        this.grid[y * this.cols + x]++
      }
      this.relax(20000)
    } else if (mode === 'center') {
      const drops = this.params.dropsPerStep as number
      const cx = Math.floor(this.cols / 2)
      const cy = Math.floor(this.rows / 2)
      this.grid[cy * this.cols + cx] += drops
      this.relax(20000)
    }
  }

  draw(): void {
    const data = this.imageData.data
    const w = this.width
    const h = this.height
    const cs = this.cellSize
    // Map heights 0..3 to 4 distinct hues.
    const palette = [
      [12, 14, 22],
      [80, 130, 200],
      [220, 200, 60],
      [220, 80, 80],
    ]
    for (let py = 0; py < h; py++) {
      const cy = Math.min(this.rows - 1, Math.floor(py / cs))
      for (let px = 0; px < w; px++) {
        const cx = Math.min(this.cols - 1, Math.floor(px / cs))
        const v = Math.min(3, Math.max(0, this.grid[cy * this.cols + cx]))
        const c = palette[v]
        const di = (py * w + px) * 4
        data[di] = c[0]
        data[di + 1] = c[1]
        data[di + 2] = c[2]
        data[di + 3] = 255
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createSandpileRenderer(): Renderer {
  return new SandpileRenderer()
}
