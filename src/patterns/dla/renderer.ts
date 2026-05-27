import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class DLARenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private cols = 0
  private rows = 0
  private cellSize = 0
  private grid!: Uint8Array
  private params!: ParamValues
  private imageData!: ImageData
  private maxRadius = 0

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.allocate()
    this.reset()
  }

  private allocate() {
    this.cellSize = this.params.cellSize as number
    this.cols = Math.floor(this.width / this.cellSize)
    this.rows = Math.floor(this.height / this.cellSize)
    this.grid = new Uint8Array(this.cols * this.rows)
    this.imageData = this.ctx2d.createImageData(this.width, this.height)
  }

  setParams(params: ParamValues): void {
    const realloc = (params.cellSize as number) !== (this.params.cellSize as number)
    const seedChanged = (params.seed as string) !== (this.params.seed as string)
    this.params = { ...params }
    if (realloc) this.allocate()
    if (realloc || seedChanged) this.reset()
  }

  reset(): void {
    this.grid.fill(0)
    const seed = this.params.seed as string
    if (seed === 'point') {
      this.grid[Math.floor(this.rows / 2) * this.cols + Math.floor(this.cols / 2)] = 1
    } else if (seed === 'line') {
      const y = this.rows - 2
      for (let x = 0; x < this.cols; x++) this.grid[y * this.cols + x] = 1
    } else if (seed === 'circle') {
      const cx = this.cols / 2
      const cy = this.rows / 2
      const r = Math.min(this.cols, this.rows) * 0.4
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          const dx = x - cx
          const dy = y - cy
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d > r && d < r + 1) this.grid[y * this.cols + x] = 1
        }
      }
    }
    this.maxRadius = 5
    this.draw()
  }

  step(): void {
    const cols = this.cols
    const rows = this.rows
    const cx = cols / 2
    const cy = rows / 2
    const walkers = this.params.walkers as number
    const stickiness = this.params.stickiness as number
    const seed = this.params.seed as string

    for (let w = 0; w < walkers; w++) {
      // Spawn on a circle just larger than current cluster.
      let x: number, y: number
      if (seed === 'line') {
        x = Math.floor(Math.random() * cols)
        y = 1
      } else {
        const spawnR = Math.min(this.maxRadius + 5, Math.min(cols, rows) / 2 - 1)
        const a = Math.random() * Math.PI * 2
        x = Math.floor(cx + Math.cos(a) * spawnR)
        y = Math.floor(cy + Math.sin(a) * spawnR)
      }
      // Random walk until we touch the cluster.
      const killR = (this.maxRadius + 20) * (this.maxRadius + 20)
      for (let step = 0; step < 5000; step++) {
        const r = Math.random()
        if (r < 0.25) x++
        else if (r < 0.5) x--
        else if (r < 0.75) y++
        else y--
        if (x < 0 || x >= cols || y < 0 || y >= rows) break
        // Killed if too far away.
        const dx = x - cx
        const dy = y - cy
        if (seed !== 'line' && dx * dx + dy * dy > killR) break
        // Check 4-neighbour stick.
        const stuck =
          (x > 0 && this.grid[y * cols + (x - 1)]) ||
          (x < cols - 1 && this.grid[y * cols + (x + 1)]) ||
          (y > 0 && this.grid[(y - 1) * cols + x]) ||
          (y < rows - 1 && this.grid[(y + 1) * cols + x])
        if (stuck && Math.random() < stickiness) {
          this.grid[y * cols + x] = 1
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d > this.maxRadius) this.maxRadius = d
          break
        }
      }
    }
    this.draw()
  }

  draw(): void {
    const data = this.imageData.data
    const cellSize = this.cellSize
    const cols = this.cols
    const rows = this.rows
    const w = this.width
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 11
      data[i + 1] = 13
      data[i + 2] = 18
      data[i + 3] = 255
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!this.grid[y * cols + x]) continue
        const px = x * cellSize
        const py = y * cellSize
        for (let dy = 0; dy < cellSize; dy++) {
          for (let dx = 0; dx < cellSize; dx++) {
            const di = ((py + dy) * w + (px + dx)) * 4
            data[di] = 200
            data[di + 1] = 230
            data[di + 2] = 255
            data[di + 3] = 255
          }
        }
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createDLARenderer(): Renderer {
  return new DLARenderer()
}
