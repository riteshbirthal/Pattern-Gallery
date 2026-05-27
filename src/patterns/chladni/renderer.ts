import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Particle {
  x: number
  y: number
}

export class ChladniRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private particles: Particle[] = []
  private renderedField = false
  private fieldImage!: ImageData

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.fieldImage = this.ctx2d.createImageData(this.width, this.height)
    this.reset()
  }

  setParams(params: ParamValues): void {
    const respawn = (params.particles as number) !== (this.params.particles as number)
    const fieldChanged =
      params.m !== this.params.m ||
      params.n !== this.params.n ||
      params.showField !== this.params.showField
    this.params = { ...params }
    if (respawn) this.spawn()
    if (fieldChanged) this.renderedField = false
  }

  reset(): void {
    this.spawn()
    this.renderedField = false
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  private spawn() {
    const n = this.params.particles as number
    this.particles = []
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
      })
    }
  }

  private wave(nx: number, ny: number): number {
    // nx, ny in [0, 1]
    const m = this.params.m as number
    const n = this.params.n as number
    return (
      Math.cos(m * Math.PI * nx) * Math.cos(n * Math.PI * ny) -
      Math.cos(n * Math.PI * nx) * Math.cos(m * Math.PI * ny)
    )
  }

  step(): void {
    const speed = this.params.speed as number
    const noise = this.params.noise as number
    const w = this.width
    const h = this.height
    for (const p of this.particles) {
      const nx = p.x / w
      const ny = p.y / h
      const v = Math.abs(this.wave(nx, ny))
      const motion = speed * (0.02 + v)
      p.x += (Math.random() - 0.5) * motion + (Math.random() - 0.5) * noise
      p.y += (Math.random() - 0.5) * motion + (Math.random() - 0.5) * noise
      if (p.x < 0) p.x += w
      else if (p.x >= w) p.x -= w
      if (p.y < 0) p.y += h
      else if (p.y >= h) p.y -= h
    }
  }

  draw(): void {
    const ctx = this.ctx2d
    const showField = this.params.showField as boolean
    if (showField && !this.renderedField) {
      const data = this.fieldImage.data
      const w = this.width
      const h = this.height
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const v = this.wave(x / w, y / h)
          const t = (v + 2) / 4 // [-2,2] -> [0,1]
          const di = (y * w + x) * 4
          // Steel-blue gradient.
          const r = Math.floor(20 + 80 * t)
          const g = Math.floor(30 + 100 * t)
          const b = Math.floor(50 + 110 * t)
          data[di] = r
          data[di + 1] = g
          data[di + 2] = b
          data[di + 3] = 255
        }
      }
      ctx.putImageData(this.fieldImage, 0, 0)
      this.renderedField = true
    } else if (!showField) {
      ctx.fillStyle = 'rgba(11, 13, 18, 0.18)'
      ctx.fillRect(0, 0, this.width, this.height)
    } else {
      // Re-blit cached field beneath particles each frame for smooth particle motion.
      ctx.putImageData(this.fieldImage, 0, 0)
    }
    ctx.fillStyle = '#f4f6fa'
    for (const p of this.particles) {
      ctx.fillRect(p.x, p.y, 1.5, 1.5)
    }
  }

  dispose(): void {
    this.particles = []
  }
}

export function createChladniRenderer(): Renderer {
  return new ChladniRenderer()
}
