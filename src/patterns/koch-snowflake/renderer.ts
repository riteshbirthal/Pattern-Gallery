import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class KochRenderer implements Renderer {
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

  // Subdivide segment AB once: A -- A+(B-A)/3 -- peak -- A+2(B-A)/3 -- B
  private subdivideKoch(points: { x: number; y: number }[]): { x: number; y: number }[] {
    const out: { x: number; y: number }[] = []
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i]
      const b = points[i + 1]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const p1 = { x: a.x + dx / 3, y: a.y + dy / 3 }
      const p3 = { x: a.x + (2 * dx) / 3, y: a.y + (2 * dy) / 3 }
      // Bump pointing outward (rotate (p3 - p1) by -60° in screen coords).
      const ex = (p3.x - p1.x) * Math.cos(-Math.PI / 3) - (p3.y - p1.y) * Math.sin(-Math.PI / 3)
      const ey = (p3.x - p1.x) * Math.sin(-Math.PI / 3) + (p3.y - p1.y) * Math.cos(-Math.PI / 3)
      const peak = { x: p1.x + ex, y: p1.y + ey }
      out.push(a, p1, peak, p3)
    }
    out.push(points[points.length - 1])
    return out
  }

  private subdivideAntiKoch(points: { x: number; y: number }[]): { x: number; y: number }[] {
    const out: { x: number; y: number }[] = []
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i]
      const b = points[i + 1]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const p1 = { x: a.x + dx / 3, y: a.y + dy / 3 }
      const p3 = { x: a.x + (2 * dx) / 3, y: a.y + (2 * dy) / 3 }
      // Bump inward (positive rotation).
      const ex = (p3.x - p1.x) * Math.cos(Math.PI / 3) - (p3.y - p1.y) * Math.sin(Math.PI / 3)
      const ey = (p3.x - p1.x) * Math.sin(Math.PI / 3) + (p3.y - p1.y) * Math.cos(Math.PI / 3)
      const peak = { x: p1.x + ex, y: p1.y + ey }
      out.push(a, p1, peak, p3)
    }
    out.push(points[points.length - 1])
    return out
  }

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    const variant = this.params.variant as string
    const order = this.params.order as number
    const margin = 30
    const sz = Math.min(this.width, this.height) - margin * 2
    const cx = this.width / 2
    const cy = this.height / 2
    let pts: { x: number; y: number }[]
    if (variant === 'snowflake') {
      // Equilateral triangle.
      const r = sz / 2
      pts = [
        { x: cx - r, y: cy + (r * Math.sqrt(3)) / 6 },
        { x: cx, y: cy - (r * Math.sqrt(3)) * (2 / 3) },
        { x: cx + r, y: cy + (r * Math.sqrt(3)) / 6 },
        { x: cx - r, y: cy + (r * Math.sqrt(3)) / 6 },
      ]
    } else if (variant === 'antisnowflake') {
      const r = sz / 2
      pts = [
        { x: cx - r, y: cy + (r * Math.sqrt(3)) / 6 },
        { x: cx, y: cy - (r * Math.sqrt(3)) * (2 / 3) },
        { x: cx + r, y: cy + (r * Math.sqrt(3)) / 6 },
        { x: cx - r, y: cy + (r * Math.sqrt(3)) / 6 },
      ]
    } else {
      // 'curve': single segment.
      pts = [
        { x: cx - sz / 2, y: cy },
        { x: cx + sz / 2, y: cy },
      ]
    }
    for (let i = 0; i < order; i++) {
      pts = variant === 'antisnowflake' ? this.subdivideAntiKoch(pts) : this.subdivideKoch(pts)
    }
    if (variant === 'curve') {
      ctx.strokeStyle = '#dde3ee'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.stroke()
    } else {
      ctx.fillStyle = '#1c2440'
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#7ac1f0'
      ctx.lineWidth = 1.2
      ctx.stroke()
    }
    this.dirty = false
  }

  dispose(): void {}
}

export function createKochRenderer(): Renderer {
  return new KochRenderer()
}
