import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class SierpinskiCarpetRenderer implements Renderer {
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
    const margin = 20
    const sz = Math.min(this.width, this.height) - margin * 2
    const ox = (this.width - sz) / 2
    const oy = (this.height - sz) / 2
    if (variant === 'carpet') this.drawCarpet(ox, oy, sz, order)
    else if (variant === 'tsquare') this.drawTSquare(ox + sz / 2, oy + sz / 2, sz / 2, order)
    else if (variant === 'vicsek') this.drawVicsek(ox, oy, sz, order)
    this.dirty = false
  }

  private drawCarpet(x: number, y: number, size: number, depth: number) {
    const ctx = this.ctx2d
    const t = (this.params.order as number) - depth
    const hue = (t * 50) % 360
    ctx.fillStyle = `hsl(${hue}, 60%, ${65 - depth * 4}%)`
    ctx.fillRect(x, y, size, size)
    if (depth <= 0 || size < 1) return
    const s = size / 3
    // Recurse on the 8 outer subsquares.
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        if (dx === 1 && dy === 1) {
          // Cut the center hole.
          ctx.fillStyle = '#0c0e14'
          ctx.fillRect(x + dx * s, y + dy * s, s, s)
        } else {
          this.drawCarpet(x + dx * s, y + dy * s, s, depth - 1)
        }
      }
    }
  }

  private drawTSquare(cx: number, cy: number, half: number, depth: number) {
    const ctx = this.ctx2d
    if (depth < 0) return
    ctx.fillStyle = `hsl(${(depth * 30 + 200) % 360}, 65%, ${50 + depth * 4}%)`
    ctx.fillRect(cx - half, cy - half, half * 2, half * 2)
    if (depth === 0) return
    const h = half / 2
    this.drawTSquare(cx - half, cy - half, h, depth - 1)
    this.drawTSquare(cx + half, cy - half, h, depth - 1)
    this.drawTSquare(cx - half, cy + half, h, depth - 1)
    this.drawTSquare(cx + half, cy + half, h, depth - 1)
  }

  private drawVicsek(x: number, y: number, size: number, depth: number) {
    const ctx = this.ctx2d
    const total = (this.params.order as number) - depth
    ctx.fillStyle = `hsl(${(total * 40 + 180) % 360}, 70%, ${65 - depth * 3}%)`
    ctx.fillRect(x, y, size, size)
    if (depth <= 0 || size < 1) return
    const s = size / 3
    // Plus-sign (Vicsek): keep center + 4 axial; remove 4 corners.
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        const isAxis = dx === 1 || dy === 1
        if (isAxis) this.drawVicsek(x + dx * s, y + dy * s, s, depth - 1)
        else {
          ctx.fillStyle = '#0c0e14'
          ctx.fillRect(x + dx * s, y + dy * s, s, s)
        }
      }
    }
  }

  dispose(): void {}
}

export function createSierpinskiCarpetRenderer(): Renderer {
  return new SierpinskiCarpetRenderer()
}
