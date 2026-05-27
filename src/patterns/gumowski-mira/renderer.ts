import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class GumowskiMiraRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private x = 0
  private y = 0
  private imageData!: ImageData
  private acc!: Float32Array
  private maxAcc = 0

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.imageData = this.ctx2d.createImageData(this.width, this.height)
    this.acc = new Float32Array(this.width * this.height)
    this.reset()
  }

  setParams(params: ParamValues): void {
    const reset =
      params.a !== this.params.a || params.b !== this.params.b || params.mu !== this.params.mu
    this.params = { ...params }
    if (reset) this.reset()
  }

  reset(): void {
    this.x = 0.1
    this.y = 0.1
    this.acc.fill(0)
    this.maxAcc = 0
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  step(): void {
    const a = this.params.a as number
    const b = this.params.b as number
    const mu = this.params.mu as number
    const points = this.params.pointsPerStep as number
    const scale = this.params.zoom as number
    const cx = this.width / 2
    const cy = this.height / 2
    let x = this.x
    let y = this.y
    for (let i = 0; i < points; i++) {
      const fx = mu * x + (2 * (1 - mu) * x * x) / (1 + x * x)
      const ny = b * y + fx
      const fy = mu * ny + (2 * (1 - mu) * ny * ny) / (1 + ny * ny)
      const nx = -x + a * (1 - 0.0098 * ny * ny) * ny + fy
      x = nx
      y = ny
      if (!isFinite(x) || !isFinite(y) || Math.abs(x) > 100 || Math.abs(y) > 100) {
        x = 0.1 + (Math.random() - 0.5) * 0.01
        y = 0.1 + (Math.random() - 0.5) * 0.01
        continue
      }
      const px = Math.floor(cx + x * scale)
      const py = Math.floor(cy + y * scale)
      if (px < 0 || px >= this.width || py < 0 || py >= this.height) continue
      const idx = py * this.width + px
      this.acc[idx]++
      if (this.acc[idx] > this.maxAcc) this.maxAcc = this.acc[idx]
    }
    this.x = x
    this.y = y
  }

  draw(): void {
    const data = this.imageData.data
    const len = this.acc.length
    const norm = this.maxAcc > 0 ? 1 / Math.log1p(this.maxAcc) : 0
    for (let i = 0, di = 0; i < len; i++, di += 4) {
      const v = this.acc[i]
      if (v === 0) {
        data[di] = 11
        data[di + 1] = 13
        data[di + 2] = 18
        data[di + 3] = 255
        continue
      }
      const t = Math.log1p(v) * norm
      const rgb = hsl(180 + t * 130, 75, 30 + 50 * t)
      data[di] = rgb[0]
      data[di + 1] = rgb[1]
      data[di + 2] = rgb[2]
      data[di + 3] = 255
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

function hsl(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

export function createGumowskiMiraRenderer(): Renderer {
  return new GumowskiMiraRenderer()
}
