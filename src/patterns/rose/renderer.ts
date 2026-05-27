import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class RoseRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private t = 0

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
  }

  reset(): void {
    this.t = 0
  }

  step(): void {
    if (this.params.animate as boolean) this.t += 0.005
  }

  draw(): void {
    const ctx = this.ctx2d
    const mode = this.params.mode as string
    const samples = this.params.samples as number
    const cx = this.width / 2
    const cy = this.height / 2

    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.lineWidth = 1.2
    ctx.beginPath()

    if (mode === 'rose') {
      const k = this.params.kRose as number
      const r0 = Math.min(this.width, this.height) * 0.45
      for (let i = 0; i <= samples; i++) {
        const theta = (i / samples) * Math.PI * 2 * 4
        const r = r0 * Math.cos(k * theta + this.t)
        const x = cx + r * Math.cos(theta)
        const y = cy + r * Math.sin(theta)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
    } else {
      // Spirograph (hypotrochoid):
      // x(t) = (R - r) cos(t) + d cos(((R - r)/r) t)
      // y(t) = (R - r) sin(t) - d sin(((R - r)/r) t)
      const R = this.params.bigR as number
      const r = this.params.smallR as number
      const d = this.params.d as number
      const scale = Math.min(this.width, this.height) / (2 * (R + Math.abs(d) + 5))
      const rev = lcmTurns(R, r)
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * Math.PI * 2 * rev + this.t
        const x = cx + scale * ((R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t))
        const y = cy + scale * ((R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t))
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
    }

    const grad = ctx.createLinearGradient(0, 0, this.width, this.height)
    grad.addColorStop(0, '#ff9aa2')
    grad.addColorStop(0.5, '#c084fc')
    grad.addColorStop(1, '#6ec1ff')
    ctx.strokeStyle = grad
    ctx.stroke()
  }

  dispose(): void {}
}

function lcmTurns(R: number, r: number): number {
  // Number of complete revolutions of t needed to close the curve.
  const g = gcd(Math.round(R), Math.round(r))
  return Math.round(r / g)
}
function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a || 1
}

export function createRoseRenderer(): Renderer {
  return new RoseRenderer()
}
