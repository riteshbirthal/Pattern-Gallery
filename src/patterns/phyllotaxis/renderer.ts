import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class PhyllotaxisRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private n = 0

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
    this.reset()
  }

  reset(): void {
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
    this.n = 0
  }

  step(): void {
    const ctx = this.ctx2d
    const angleDeg = this.params.angle as number
    const angle = (angleDeg * Math.PI) / 180
    const c = this.params.spacing as number
    const dotSize = this.params.dotSize as number
    const palette = this.params.palette as string
    const total = this.params.count as number
    const cx = this.width / 2
    const cy = this.height / 2
    const perStep = Math.min(50, total - this.n)
    if (perStep <= 0) return

    for (let i = 0; i < perStep; i++) {
      const k = this.n + i
      const r = c * Math.sqrt(k)
      const theta = k * angle
      const x = cx + r * Math.cos(theta)
      const y = cy + r * Math.sin(theta)
      ctx.fillStyle = colorAt(k, total, palette)
      ctx.beginPath()
      ctx.arc(x, y, dotSize, 0, Math.PI * 2)
      ctx.fill()
    }
    this.n += perStep
  }

  draw(): void {}

  dispose(): void {}
}

function colorAt(i: number, total: number, palette: string): string {
  const t = i / Math.max(1, total)
  if (palette === 'sunset') {
    const r = Math.floor(255 - 50 * t)
    const g = Math.floor(80 + 100 * t)
    const b = Math.floor(120 + 60 * (1 - t))
    return `rgb(${r},${g},${b})`
  }
  if (palette === 'forest') {
    const r = Math.floor(40 + 80 * t)
    const g = Math.floor(160 + 60 * (1 - t))
    const b = Math.floor(60 + 40 * t)
    return `rgb(${r},${g},${b})`
  }
  // rainbow
  const h = t * 360
  return hslString(h, 70, 60)
}

function hslString(h: number, s: number, l: number): string {
  return `hsl(${h.toFixed(0)},${s}%,${l}%)`
}

export function createPhyllotaxisRenderer(): Renderer {
  return new PhyllotaxisRenderer()
}
