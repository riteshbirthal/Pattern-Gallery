import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Affine {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
  p: number
}

const PRESETS: Record<string, Affine[]> = {
  fern: [
    { a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, p: 0.01 },
    { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, p: 0.85 },
    { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, p: 0.07 },
    { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, p: 0.07 },
  ],
  cyclosorus: [
    { a: 0, b: 0, c: 0, d: 0.25, e: 0, f: -0.4, p: 0.02 },
    { a: 0.95, b: 0.005, c: -0.005, d: 0.93, e: -0.002, f: 0.5, p: 0.84 },
    { a: 0.035, b: -0.2, c: 0.16, d: 0.04, e: -0.09, f: 0.02, p: 0.07 },
    { a: -0.04, b: 0.2, c: 0.16, d: 0.04, e: 0.083, f: 0.12, p: 0.07 },
  ],
  fishbone: [
    { a: 0, b: 0, c: 0, d: 0.25, e: 0, f: -0.14, p: 0.02 },
    { a: 0.95, b: 0.002, c: -0.002, d: 0.93, e: -0.002, f: 0.5, p: 0.84 },
    { a: 0.035, b: -0.11, c: 0.27, d: 0.01, e: -0.05, f: 0.005, p: 0.07 },
    { a: -0.04, b: 0.11, c: 0.27, d: 0.01, e: 0.047, f: 0.06, p: 0.07 },
  ],
}

export class BarnsleyFernRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private x = 0
  private y = 0

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
    const presetChanged = (params.preset as string) !== (this.params.preset as string)
    this.params = { ...params }
    if (presetChanged) this.reset()
  }

  reset(): void {
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
    this.x = 0
    this.y = 0
  }

  step(): void {
    const transforms = PRESETS[this.params.preset as string] ?? PRESETS.fern
    const points = this.params.pointsPerStep as number
    const ctx = this.ctx2d
    const data = ctx.getImageData(0, 0, this.width, this.height)
    const pixels = data.data
    const w = this.width
    const h = this.height

    // Auto-fit projection: shift x ∈ [-3, 3] → [0, w], y ∈ [0, 10] → [h, 0].
    const sx = w / 6
    const sy = h / 10.5
    const ox = w / 2
    const oy = h - 5

    for (let i = 0; i < points; i++) {
      const r = Math.random()
      let cum = 0
      let chosen = transforms[transforms.length - 1]
      for (const t of transforms) {
        cum += t.p
        if (r < cum) {
          chosen = t
          break
        }
      }
      const nx = chosen.a * this.x + chosen.b * this.y + chosen.e
      const ny = chosen.c * this.x + chosen.d * this.y + chosen.f
      this.x = nx
      this.y = ny
      const px = Math.floor(this.x * sx + ox)
      const py = Math.floor(oy - this.y * sy)
      if (px < 0 || px >= w || py < 0 || py >= h) continue
      const di = (py * w + px) * 4
      pixels[di] = Math.min(255, pixels[di] + 30)
      pixels[di + 1] = Math.min(255, pixels[di + 1] + 80)
      pixels[di + 2] = Math.min(255, pixels[di + 2] + 50)
      pixels[di + 3] = 255
    }
    ctx.putImageData(data, 0, 0)
  }

  draw(): void {}

  dispose(): void {}
}

export function createBarnsleyFernRenderer(): Renderer {
  return new BarnsleyFernRenderer()
}
