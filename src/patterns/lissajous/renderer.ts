import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class LissajousRenderer implements Renderer {
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
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
    this.t = 0
  }

  step(): void {
    if (!(this.params.animate as boolean)) return
    this.t += (this.params.driftSpeed as number) * 0.01
  }

  draw(): void {
    const ctx = this.ctx2d
    const a = this.params.a as number
    const b = this.params.b as number
    const delta = ((this.params.delta as number) * Math.PI) / 180 + this.t
    const samples = this.params.samples as number
    const cx = this.width / 2
    const cy = this.height / 2
    const rx = this.width * 0.42
    const ry = this.height * 0.42

    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * Math.PI * 2
      const x = cx + rx * Math.sin(a * t + delta)
      const y = cy + ry * Math.sin(b * t)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    // Hue along the trail.
    const grad = ctx.createLinearGradient(0, 0, this.width, this.height)
    grad.addColorStop(0, '#6ec1ff')
    grad.addColorStop(0.5, '#c084fc')
    grad.addColorStop(1, '#7ed957')
    ctx.strokeStyle = grad
    ctx.stroke()
  }

  dispose(): void {}
}

export function createLissajousRenderer(): Renderer {
  return new LissajousRenderer()
}
