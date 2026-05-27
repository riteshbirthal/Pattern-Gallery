import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class WolframCARenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private cols = 0
  private rows = 0
  private cellSize = 0
  private grid!: Uint8Array
  private currentRow = 0
  private params!: ParamValues
  private imageData!: ImageData

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
    const ruleChanged = (params.rule as number) !== (this.params.rule as number)
    const initChanged = (params.init as string) !== (this.params.init as string)
    this.params = { ...params }
    if (realloc) this.allocate()
    if (realloc || ruleChanged || initChanged) this.reset()
  }

  reset(): void {
    this.grid.fill(0)
    const cols = this.cols
    const init = this.params.init as string
    if (init === 'single') {
      this.grid[Math.floor(cols / 2)] = 1
    } else {
      for (let x = 0; x < cols; x++) {
        if (Math.random() < 0.5) this.grid[x] = 1
      }
    }
    this.currentRow = 0
    this.draw()
  }

  step(): void {
    if (this.currentRow >= this.rows - 1) {
      this.reset()
      return
    }
    const cols = this.cols
    const rule = this.params.rule as number
    const row = this.currentRow
    const next = row + 1
    for (let x = 0; x < cols; x++) {
      const left = this.grid[row * cols + ((x - 1 + cols) % cols)]
      const center = this.grid[row * cols + x]
      const right = this.grid[row * cols + ((x + 1) % cols)]
      const idx = (left << 2) | (center << 1) | right
      this.grid[next * cols + x] = (rule >> idx) & 1
    }
    this.currentRow = next
    this.drawRow(next)
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  private drawRow(row: number) {
    const data = this.imageData.data
    const cellSize = this.cellSize
    const cols = this.cols
    const w = this.width
    const py = row * cellSize
    for (let x = 0; x < cols; x++) {
      const alive = this.grid[row * cols + x]
      const r = alive ? 200 : 11
      const g = alive ? 230 : 13
      const b = alive ? 255 : 18
      const px = x * cellSize
      for (let dy = 0; dy < cellSize; dy++) {
        for (let dx = 0; dx < cellSize; dx++) {
          const di = ((py + dy) * w + (px + dx)) * 4
          data[di] = r
          data[di + 1] = g
          data[di + 2] = b
          data[di + 3] = 255
        }
      }
    }
  }

  draw(): void {
    const data = this.imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 11
      data[i + 1] = 13
      data[i + 2] = 18
      data[i + 3] = 255
    }
    for (let row = 0; row <= this.currentRow; row++) this.drawRow(row)
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createWolframCARenderer(): Renderer {
  return new WolframCARenderer()
}
