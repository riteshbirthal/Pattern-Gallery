import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

// States: 0=empty, 1=conductor, 2=electron head, 3=electron tail.
const EMPTY = 0
const COND = 1
const HEAD = 2
const TAIL = 3

export class WireworldRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private grid!: Uint8Array
  private next!: Uint8Array
  private cols = 0
  private rows = 0
  private cellSize = 0

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
    if (old.cellSize !== params.cellSize || old.preset !== params.preset) this.reset()
  }

  reset(): void {
    this.cellSize = this.params.cellSize as number
    this.cols = Math.floor(this.width / this.cellSize)
    this.rows = Math.floor(this.height / this.cellSize)
    this.grid = new Uint8Array(this.cols * this.rows)
    this.next = new Uint8Array(this.cols * this.rows)
    this.seedPreset()
  }

  private seedPreset() {
    const preset = this.params.preset as string
    const cx = Math.floor(this.cols / 2)
    const cy = Math.floor(this.rows / 2)
    const set = (x: number, y: number, v: number) => {
      if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
        this.grid[y * this.cols + x] = v
      }
    }
    if (preset === 'diodes') {
      // Two parallel wires + a XOR-style junction.
      const len = Math.min(this.cols, this.rows) - 8
      for (let i = 0; i < len; i++) {
        set(cx - len / 2 + i, cy - 4, COND)
        set(cx - len / 2 + i, cy + 4, COND)
      }
      // Inject electrons.
      set(cx - len / 2, cy - 4, HEAD)
      set(cx - len / 2 - 1, cy - 4, TAIL)
      set(cx - len / 2, cy + 4, HEAD)
      set(cx - len / 2 - 1, cy + 4, TAIL)
    } else if (preset === 'clock') {
      // A small loop = oscillator.
      const r = 5
      for (let i = -r; i <= r; i++) {
        set(cx + i, cy - r, COND)
        set(cx + i, cy + r, COND)
        set(cx - r, cy + i, COND)
        set(cx + r, cy + i, COND)
      }
      set(cx + 1, cy - r, HEAD)
      set(cx, cy - r, TAIL)
    } else {
      // 'random' — random conductor field with a few electron seeds.
      for (let i = 0; i < this.grid.length; i++) {
        const r = Math.random()
        if (r < 0.35) this.grid[i] = COND
      }
      for (let k = 0; k < 30; k++) {
        const x = Math.floor(Math.random() * this.cols)
        const y = Math.floor(Math.random() * this.rows)
        if (this.grid[y * this.cols + x] === COND) this.grid[y * this.cols + x] = HEAD
      }
    }
  }

  step(): void {
    const cols = this.cols
    const rows = this.rows
    const g = this.grid
    const n = this.next
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x
        const s = g[i]
        if (s === EMPTY) n[i] = EMPTY
        else if (s === HEAD) n[i] = TAIL
        else if (s === TAIL) n[i] = COND
        else {
          // Conductor → head if 1 or 2 head neighbors.
          let h = 0
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue
              const nx = (x + dx + cols) % cols
              const ny = (y + dy + rows) % rows
              if (g[ny * cols + nx] === HEAD) h++
            }
          }
          n[i] = h === 1 || h === 2 ? HEAD : COND
        }
      }
    }
    const tmp = this.grid
    this.grid = this.next
    this.next = tmp
  }

  draw(): void {
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    const cs = this.cellSize
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const s = this.grid[y * this.cols + x]
        if (s === EMPTY) continue
        if (s === COND) ctx.fillStyle = '#5a4020'
        else if (s === HEAD) ctx.fillStyle = '#4ec3ff'
        else ctx.fillStyle = '#c84a4a'
        ctx.fillRect(x * cs, y * cs, cs, cs)
      }
    }
  }

  dispose(): void {}
}

export function createWireworldRenderer(): Renderer {
  return new WireworldRenderer()
}
