import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class PascalModRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private dirty = true

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
    this.params = { ...params }
    this.dirty = true
  }

  reset(): void {
    this.dirty = true
  }

  step(): void {}

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    const m = this.params.modulus as number
    const rows = this.params.rows as number
    const cellW = this.width / (rows * 2)
    const cellH = this.height / rows
    const size = Math.min(cellW * 2, cellH)
    const offX = (this.width - size * rows) / 2
    const offY = (this.height - size * rows) / 2
    // Compute Pascal mod m row by row using rolling buffer.
    let prev = new Uint16Array(rows)
    let curr = new Uint16Array(rows)
    prev[0] = 1
    for (let r = 0; r < rows; r++) {
      curr[0] = 1
      for (let k = 1; k <= r; k++) {
        curr[k] = (prev[k - 1] + (prev[k] || 0)) % m
      }
      // Draw row r.
      for (let k = 0; k <= r; k++) {
        const v = curr[k]
        if (v === 0) continue
        const hue = (v / m) * 280
        ctx.fillStyle = `hsl(${hue}, 75%, ${40 + 30 * (v / m)}%)`
        const px = offX + (rows - r) * (size / 2) + k * size
        const py = offY + r * size
        ctx.fillRect(px, py, Math.max(1, size - 1), Math.max(1, size - 1))
      }
      const tmp = prev
      prev = curr
      curr = tmp
    }
    this.dirty = false
  }

  dispose(): void {}
}

export function createPascalModRenderer(): Renderer {
  return new PascalModRenderer()
}
