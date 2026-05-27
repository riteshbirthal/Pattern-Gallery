import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class SierpinskiTriangleRenderer implements Renderer {
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
    const variant = this.params.variant as string
    const order = this.params.order as number
    const margin = 30
    const sz = Math.min(this.width - margin * 2, this.height - margin * 2)
    const ox = (this.width - sz) / 2
    const oy = (this.height - sz) / 2 + sz
    if (variant === 'sierpinski') {
      // Equilateral; corners A bottom-left, B bottom-right, C top.
      const A = [ox, oy]
      const B = [ox + sz, oy]
      const C = [ox + sz / 2, oy - (sz * Math.sqrt(3)) / 2]
      this.recurseSierpinski(A, B, C, order)
    } else if (variant === 'pascal') {
      // Pascal's triangle mod 2 — the same fractal pattern.
      const rows = 1 << order
      const cellSize = sz / rows
      let row = new Uint8Array(rows + 1)
      row[0] = 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= r; c++) {
          if (row[c]) {
            const x = ox + sz / 2 - (r * cellSize) / 2 + c * cellSize
            const y = oy - sz + r * cellSize * (Math.sqrt(3) / 2)
            ctx.fillStyle = `hsl(${(r * 4) % 360}, 70%, 60%)`
            ctx.fillRect(x, y, cellSize - 0.5, cellSize - 0.5)
          }
        }
        const next = new Uint8Array(rows + 1)
        for (let c = 0; c <= r + 1; c++) next[c] = (row[c - 1] ?? 0) ^ (row[c] ?? 0)
        row = next
      }
    }
    this.dirty = false
  }

  private recurseSierpinski(A: number[], B: number[], C: number[], depth: number) {
    const ctx = this.ctx2d
    if (depth <= 0) {
      ctx.fillStyle = `hsl(${((this.params.order as number) * 30 + 200) % 360}, 60%, 60%)`
      ctx.beginPath()
      ctx.moveTo(A[0], A[1])
      ctx.lineTo(B[0], B[1])
      ctx.lineTo(C[0], C[1])
      ctx.closePath()
      ctx.fill()
      return
    }
    const AB = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
    const BC = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2]
    const CA = [(C[0] + A[0]) / 2, (C[1] + A[1]) / 2]
    this.recurseSierpinski(A, AB, CA, depth - 1)
    this.recurseSierpinski(AB, B, BC, depth - 1)
    this.recurseSierpinski(CA, BC, C, depth - 1)
  }

  dispose(): void {}
}

export function createSierpinskiTriangleRenderer(): Renderer {
  return new SierpinskiTriangleRenderer()
}
