import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class CyclicCARenderer implements Renderer {
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
  private palette: [number, number, number][] = []

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
    this.buildPalette()
  }

  private buildPalette() {
    const states = this.params.states as number
    this.palette = []
    for (let i = 0; i < states; i++) {
      const t = i / states
      const h = t * 360
      this.palette.push(hslRgb(h, 70, 55))
    }
  }

  setParams(params: ParamValues): void {
    const realloc = (params.cellSize as number) !== (this.params.cellSize as number)
    const statesChanged = (params.states as number) !== (this.params.states as number)
    this.params = { ...params }
    if (realloc) this.allocate()
    if (statesChanged) {
      this.buildPalette()
      this.reset()
    }
  }

  reset(): void {
    const states = this.params.states as number
    for (let i = 0; i < this.current.length; i++) {
      this.current[i] = Math.floor(Math.random() * states)
    }
    this.draw()
  }

  step(): void {
    const states = this.params.states as number
    const threshold = this.params.threshold as number
    const useMoore = this.params.neighborhood === 'moore'
    const cols = this.cols
    const rows = this.rows
    const cur = this.current
    const nxt = this.next
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const s = cur[y * cols + x]
        const succ = (s + 1) % states
        let count = 0
        if (useMoore) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue
              const nx = (x + dx + cols) % cols
              const ny = (y + dy + rows) % rows
              if (cur[ny * cols + nx] === succ) count++
            }
          }
        } else {
          // von Neumann
          const offsets = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0],
          ]
          for (const [dx, dy] of offsets) {
            const nx = (x + dx + cols) % cols
            const ny = (y + dy + rows) % rows
            if (cur[ny * cols + nx] === succ) count++
          }
        }
        nxt[y * cols + x] = count >= threshold ? succ : s
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
        const c = this.palette[this.current[y * cols + x]]
        const px = x * cellSize
        const py = y * cellSize
        for (let dy = 0; dy < cellSize; dy++) {
          for (let dx = 0; dx < cellSize; dx++) {
            const di = ((py + dy) * w + (px + dx)) * 4
            data[di] = c[0]
            data[di + 1] = c[1]
            data[di + 2] = c[2]
            data[di + 3] = 255
          }
        }
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

function hslRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

export function createCyclicCARenderer(): Renderer {
  return new CyclicCARenderer()
}
