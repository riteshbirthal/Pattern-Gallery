import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

const CELL_BORN = 0b1000
const CELL_ALIVE = 0b0001

export class ConwayLifeRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private cols = 0
  private rows = 0
  private cellSize = 0
  private current!: Uint8Array
  private next!: Uint8Array
  private params!: ParamValues
  private generation = 0
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
    const density = this.params.density as number
    const preset = this.params.preset as string
    this.current.fill(0)
    this.generation = 0
    if (preset === 'random') {
      for (let i = 0; i < this.current.length; i++) {
        if (Math.random() < density) this.current[i] = CELL_ALIVE
      }
    } else if (preset === 'glider-gun') {
      this.placeGosperGliderGun()
    } else if (preset === 'pulsar') {
      this.placePulsar()
    }
    this.draw()
  }

  private placeGosperGliderGun() {
    // Coordinates relative to top-left of gun.
    const cells = [
      [0, 4], [0, 5], [1, 4], [1, 5],
      [10, 4], [10, 5], [10, 6], [11, 3], [11, 7], [12, 2], [12, 8],
      [13, 2], [13, 8], [14, 5], [15, 3], [15, 7], [16, 4], [16, 5], [16, 6], [17, 5],
      [20, 2], [20, 3], [20, 4], [21, 2], [21, 3], [21, 4], [22, 1], [22, 5],
      [24, 0], [24, 1], [24, 5], [24, 6],
      [34, 2], [34, 3], [35, 2], [35, 3],
    ]
    const offsetX = 2
    const offsetY = Math.floor(this.rows / 2 - 5)
    for (const [x, y] of cells) {
      const cx = x + offsetX
      const cy = y + offsetY
      if (cx >= 0 && cx < this.cols && cy >= 0 && cy < this.rows) {
        this.current[cy * this.cols + cx] = CELL_ALIVE
      }
    }
  }

  private placePulsar() {
    const pulsar = [
      [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
      [0, 2], [5, 2], [7, 2], [12, 2],
      [0, 3], [5, 3], [7, 3], [12, 3],
      [0, 4], [5, 4], [7, 4], [12, 4],
      [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
      [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
      [0, 8], [5, 8], [7, 8], [12, 8],
      [0, 9], [5, 9], [7, 9], [12, 9],
      [0, 10], [5, 10], [7, 10], [12, 10],
      [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12],
    ]
    const ox = Math.floor(this.cols / 2 - 6)
    const oy = Math.floor(this.rows / 2 - 6)
    for (const [x, y] of pulsar) {
      const cx = x + ox
      const cy = y + oy
      if (cx >= 0 && cx < this.cols && cy >= 0 && cy < this.rows) {
        this.current[cy * this.cols + cx] = CELL_ALIVE
      }
    }
  }

  step(): void {
    const cols = this.cols
    const rows = this.rows
    const cur = this.current
    const nxt = this.next
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let n = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const nx = (x + dx + cols) % cols
            const ny = (y + dy + rows) % rows
            if (cur[ny * cols + nx] & CELL_ALIVE) n++
          }
        }
        const idx = y * cols + x
        const alive = (cur[idx] & CELL_ALIVE) !== 0
        let next = 0
        if (alive && (n === 2 || n === 3)) next = CELL_ALIVE
        else if (!alive && n === 3) next = CELL_ALIVE | CELL_BORN
        nxt[idx] = next
      }
    }
    // Swap.
    const tmp = this.current
    this.current = this.next
    this.next = tmp
    this.generation++
  }

  draw(): void {
    const data = this.imageData.data
    const cellSize = this.cellSize
    const cols = this.cols
    const rows = this.rows
    const w = this.width
    // Clear.
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 11
      data[i + 1] = 13
      data[i + 2] = 18
      data[i + 3] = 255
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = this.current[y * cols + x]
        if (!(cell & CELL_ALIVE)) continue
        const born = (cell & CELL_BORN) !== 0
        const r = born ? 180 : 110
        const g = born ? 230 : 200
        const b = born ? 255 : 240
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

export function createConwayLifeRenderer(): Renderer {
  return new ConwayLifeRenderer()
}
