import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

const EMPTY = 0
const TREE = 1
const BURNING = 2

export class ForestFireRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private cellSize = 0
  private cols = 0
  private rows = 0
  private current!: Uint8Array
  private next!: Uint8Array
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
    this.current = new Uint8Array(this.cols * this.rows)
    this.next = new Uint8Array(this.cols * this.rows)
    this.imageData = this.ctx2d.createImageData(this.width, this.height)
  }

  setParams(params: ParamValues): void {
    const realloc = (params.cellSize as number) !== (this.params.cellSize as number)
    this.params = { ...params }
    if (realloc) {
      this.allocate()
      this.reset()
    }
  }

  reset(): void {
    const initialDensity = this.params.initialDensity as number
    for (let i = 0; i < this.current.length; i++) {
      this.current[i] = Math.random() < initialDensity ? TREE : EMPTY
    }
    this.draw()
  }

  step(): void {
    const cols = this.cols
    const rows = this.rows
    const cur = this.current
    const nxt = this.next
    const growth = this.params.growth as number
    const lightning = this.params.lightning as number
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const s = cur[y * cols + x]
        if (s === BURNING) {
          nxt[y * cols + x] = EMPTY
        } else if (s === TREE) {
          // Burns if any Moore neighbor is burning, or by lightning.
          let burns = false
          for (let dy = -1; dy <= 1 && !burns; dy++) {
            for (let dx = -1; dx <= 1 && !burns; dx++) {
              if (dx === 0 && dy === 0) continue
              const nx = (x + dx + cols) % cols
              const ny = (y + dy + rows) % rows
              if (cur[ny * cols + nx] === BURNING) burns = true
            }
          }
          if (!burns && Math.random() < lightning) burns = true
          nxt[y * cols + x] = burns ? BURNING : TREE
        } else {
          // EMPTY: grows tree with probability `growth`.
          nxt[y * cols + x] = Math.random() < growth ? TREE : EMPTY
        }
      }
    }
    const tmp = this.current
    this.current = this.next
    this.next = tmp
  }

  draw(): void {
    const data = this.imageData.data
    const cellSize = this.cellSize
    const cols = this.cols
    const rows = this.rows
    const w = this.width
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const s = this.current[y * cols + x]
        let r: number, g: number, b: number
        if (s === BURNING) {
          r = 255
          g = 90
          b = 30
        } else if (s === TREE) {
          r = 60
          g = 160
          b = 80
        } else {
          r = 22
          g = 18
          b = 12
        }
        const px = x * cellSize
        const py = y * cellSize
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
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createForestFireRenderer(): Renderer {
  return new ForestFireRenderer()
}
