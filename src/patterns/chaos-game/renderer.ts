import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class ChaosGameRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private vertices: { x: number; y: number }[] = []
  private current!: { x: number; y: number }
  private lastVertex = -1
  private params!: ParamValues

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
    const fullReset =
      (params.vertices as number) !== (this.params.vertices as number) ||
      (params.ratio as number) !== (this.params.ratio as number) ||
      (params.restriction as string) !== (this.params.restriction as string)
    this.params = { ...params }
    if (fullReset) this.reset()
  }

  reset(): void {
    const v = this.params.vertices as number
    this.vertices = []
    const cx = this.width / 2
    const cy = this.height / 2
    const radius = Math.min(this.width, this.height) * 0.42
    for (let i = 0; i < v; i++) {
      const a = (i / v) * Math.PI * 2 - Math.PI / 2
      this.vertices.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius })
    }
    this.current = { x: cx, y: cy }
    this.lastVertex = -1
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  step(): void {
    const ratio = this.params.ratio as number
    const restriction = this.params.restriction as string
    const ctx = this.ctx2d
    const points = this.params.pointsPerStep as number
    const v = this.vertices.length

    const data = ctx.getImageData(0, 0, this.width, this.height)
    const pixels = data.data

    for (let i = 0; i < points; i++) {
      let idx: number
      if (restriction === 'no-repeat') {
        do {
          idx = Math.floor(Math.random() * v)
        } while (idx === this.lastVertex && v > 1)
      } else if (restriction === 'no-adjacent') {
        do {
          idx = Math.floor(Math.random() * v)
        } while (
          (idx === (this.lastVertex + 1) % v ||
            idx === (this.lastVertex - 1 + v) % v) &&
          v > 2
        )
      } else {
        idx = Math.floor(Math.random() * v)
      }
      this.lastVertex = idx
      const target = this.vertices[idx]
      this.current.x += (target.x - this.current.x) * ratio
      this.current.y += (target.y - this.current.y) * ratio
      const px = Math.floor(this.current.x)
      const py = Math.floor(this.current.y)
      if (px < 0 || px >= this.width || py < 0 || py >= this.height) continue
      const di = (py * this.width + px) * 4
      const t = idx / v
      const r = Math.floor(120 + 130 * Math.sin(t * 6.28))
      const g = Math.floor(180 + 70 * Math.cos(t * 6.28))
      const b = 255
      pixels[di] = Math.min(255, pixels[di] + r * 0.3)
      pixels[di + 1] = Math.min(255, pixels[di + 1] + g * 0.3)
      pixels[di + 2] = Math.min(255, pixels[di + 2] + b * 0.3)
      pixels[di + 3] = 255
    }
    ctx.putImageData(data, 0, 0)
  }

  draw(): void {
    // step() draws inline.
  }

  dispose(): void {}
}

export function createChaosGameRenderer(): Renderer {
  return new ChaosGameRenderer()
}
