import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class LevyCRenderer implements Renderer {
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

  private subdivide(
    points: { x: number; y: number }[],
    angleDeg: number,
  ): { x: number; y: number }[] {
    const out: { x: number; y: number }[] = []
    const a = (angleDeg * Math.PI) / 180
    // Each segment AB → A → midpoint-perpendicular peak → B.
    // For Lévy C, peak is the apex of an isoceles triangle on AB with angle 90° at apex (i.e. legs at 45°).
    const halfAngle = a / 2
    const lenScale = 1 / (2 * Math.cos(halfAngle))
    for (let i = 0; i < points.length - 1; i++) {
      const A = points[i]
      const B = points[i + 1]
      const dx = B.x - A.x
      const dy = B.y - A.y
      const ang = Math.atan2(dy, dx)
      const len = Math.hypot(dx, dy) * lenScale
      const peakAng = ang - halfAngle
      const peak = {
        x: A.x + len * Math.cos(peakAng),
        y: A.y + len * Math.sin(peakAng),
      }
      out.push(A, peak)
    }
    out.push(points[points.length - 1])
    return out
  }

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    const order = this.params.order as number
    const angle = this.params.angle as number
    let pts = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ]
    for (let i = 0; i < order; i++) pts = this.subdivide(pts, angle)
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (const p of pts) {
      if (p.x < minX) minX = p.x
      if (p.x > maxX) maxX = p.x
      if (p.y < minY) minY = p.y
      if (p.y > maxY) maxY = p.y
    }
    const margin = 30
    const sx = (this.width - margin * 2) / (maxX - minX || 1)
    const sy = (this.height - margin * 2) / (maxY - minY || 1)
    const s = Math.min(sx, sy)
    const ox = margin - minX * s + (this.width - margin * 2 - (maxX - minX) * s) / 2
    const oy = margin - minY * s + (this.height - margin * 2 - (maxY - minY) * s) / 2
    const rainbow = this.params.colorByT as boolean
    if (rainbow) {
      for (let i = 1; i < pts.length; i++) {
        const t = i / pts.length
        ctx.strokeStyle = `hsl(${(t * 320) % 360}, 75%, 60%)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(pts[i - 1].x * s + ox, pts[i - 1].y * s + oy)
        ctx.lineTo(pts[i].x * s + ox, pts[i].y * s + oy)
        ctx.stroke()
      }
    } else {
      ctx.strokeStyle = '#dde3ee'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pts[0].x * s + ox, pts[0].y * s + oy)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x * s + ox, pts[i].y * s + oy)
      ctx.stroke()
    }
    this.dirty = false
  }

  dispose(): void {}
}

export function createLevyCRenderer(): Renderer {
  return new LevyCRenderer()
}
