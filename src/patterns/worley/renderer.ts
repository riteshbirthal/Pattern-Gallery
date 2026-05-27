import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Site {
  x: number
  y: number
  hue: number
}

export class WorleyRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private sites: Site[] = []
  private imageData!: ImageData
  private rowsDone = 0

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.imageData = this.ctx2d.createImageData(this.width, this.height)
    this.reset()
  }

  setParams(params: ParamValues): void {
    const reseed = params.sites !== this.params.sites || params.seed !== this.params.seed
    this.params = { ...params }
    if (reseed) this.reset()
    else this.rowsDone = 0
  }

  reset(): void {
    const n = this.params.sites as number
    const seed = this.params.seed as number
    const rng = mulberry32(seed * 1009 + 7)
    this.sites = []
    for (let i = 0; i < n; i++) {
      this.sites.push({
        x: rng() * this.width,
        y: rng() * this.height,
        hue: rng() * 360,
      })
    }
    this.rowsDone = 0
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  step(): void {
    if (this.rowsDone >= this.height) return
    const variant = this.params.variant as string
    const data = this.imageData.data
    const sites = this.sites
    const rowsPerStep = 24
    for (let r = 0; r < rowsPerStep && this.rowsDone < this.height; r++, this.rowsDone++) {
      const py = this.rowsDone
      for (let px = 0; px < this.width; px++) {
        let f1 = Infinity
        let f2 = Infinity
        let nearestHue = 0
        for (const s of sites) {
          const dx = s.x - px
          const dy = s.y - py
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < f1) {
            f2 = f1
            f1 = d
            nearestHue = s.hue
          } else if (d < f2) {
            f2 = d
          }
        }
        const di = (py * this.width + px) * 4
        let R = 0
        let G = 0
        let B = 0
        if (variant === 'voronoi') {
          const rgb = hsl(nearestHue, 65, 50)
          R = rgb[0]
          G = rgb[1]
          B = rgb[2]
        } else if (variant === 'f1') {
          const t = Math.min(1, f1 / 80)
          R = Math.round(20 + t * 230)
          G = Math.round(20 + t * 220)
          B = Math.round(40 + t * 200)
        } else if (variant === 'f2-f1') {
          const t = Math.min(1, (f2 - f1) / 60)
          R = Math.round(t * 240)
          G = Math.round(t * 240)
          B = Math.round(20 + t * 220)
        } else if (variant === 'cells') {
          // Voronoi colour with edges darkened where f2 - f1 small.
          const edge = Math.min(1, (f2 - f1) / 4)
          const rgb = hsl(nearestHue, 65, 50)
          R = Math.round(rgb[0] * edge)
          G = Math.round(rgb[1] * edge)
          B = Math.round(rgb[2] * edge)
        }
        data[di] = R
        data[di + 1] = G
        data[di + 2] = B
        data[di + 3] = 255
      }
    }
  }

  draw(): void {
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

function mulberry32(seed: number): () => number {
  let t = seed
  return function () {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function createWorleyRenderer(): Renderer {
  return new WorleyRenderer()
}
