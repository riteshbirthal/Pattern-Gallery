import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class PythagorasTreeRenderer implements Renderer {
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

  private drawSquare(
    x: number,
    y: number,
    size: number,
    angle: number,
    depth: number,
    maxDepth: number,
  ) {
    if (depth > maxDepth || size < 0.5) return
    const ctx = this.ctx2d
    // Square vertices: bottom-left at (x, y), oriented by `angle` (0 = upright, +ve = CCW).
    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)
    const corners = [
      [x, y],
      [x + size * cosA, y + size * sinA],
      [x + size * cosA - size * sinA, y + size * sinA + size * cosA],
      [x - size * sinA, y + size * cosA],
    ]
    const t = depth / maxDepth
    const hue = 30 + 80 * t
    const sat = 50 + 30 * t
    const lit = 30 + 35 * (1 - t)
    ctx.fillStyle = `hsl(${hue}, ${sat}%, ${lit}%)`
    ctx.beginPath()
    ctx.moveTo(corners[0][0], corners[0][1])
    for (let i = 1; i < 4; i++) ctx.lineTo(corners[i][0], corners[i][1])
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'
    ctx.lineWidth = 0.5
    ctx.stroke()

    // Children: two squares perched on top of this one, forming a right triangle of given alpha.
    const alpha = ((this.params.angle as number) * Math.PI) / 180
    const leftSize = size * Math.cos(alpha)
    const rightSize = size * Math.sin(alpha)
    // Left child: pivot at top-left corner, rotated +alpha.
    const tl = corners[3]
    this.drawSquare(tl[0], tl[1], leftSize, angle + alpha, depth + 1, maxDepth)
    // Right child: pivot at the apex of the triangle (top-left + leftSize along left direction).
    const apexX = tl[0] + leftSize * Math.cos(angle + alpha)
    const apexY = tl[1] + leftSize * Math.sin(angle + alpha)
    this.drawSquare(apexX, apexY, rightSize, angle + alpha - Math.PI / 2 + alpha, depth + 1, maxDepth)
  }

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    // Flip Y so growth goes upward.
    ctx.save()
    ctx.translate(0, this.height)
    ctx.scale(1, -1)
    const baseSize = (this.params.baseSize as number) * Math.min(this.width, this.height) * 0.15
    const cx = this.width / 2
    this.drawSquare(cx - baseSize / 2, 20, baseSize, 0, 0, this.params.depth as number)
    ctx.restore()
    this.dirty = false
  }

  dispose(): void {}
}

export function createPythagorasTreeRenderer(): Renderer {
  return new PythagorasTreeRenderer()
}
