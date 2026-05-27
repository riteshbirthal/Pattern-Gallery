import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class HenonRenderer implements Renderer {
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
    const reset = params.a !== this.params.a || params.b !== this.params.b
    this.params = { ...params }
    if (reset) this.reset()
  }

  reset(): void {
    this.x = 0
    this.y = 0
    this.acc.fill(0)
    this.maxAcc = 0
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  step(): void {
    const a = this.params.a as number
    const b = this.params.b as number
    const points = this.params.pointsPerStep as number
    // Hénon attractor is squashed in y. Stretch it for visibility.
    const sx = (this.width / 3.0) * 0.85
    const sy = (this.height / 0.8) * 0.85
    const cx = this.width / 2 - sx * 0.05
    const cy = this.height / 2
    let x = this.x
    let y = this.y
    for (let i = 0; i < points; i++) {
      const nx = 1 - a * x * x + y
      const ny = b * x
      x = nx
      y = ny
      const px = Math.floor(cx + x * sx * 0.5)
      const py = Math.floor(cy - y * sy * 0.5)
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
    const log = Math.log
    const norm = this.maxAcc > 0 ? 1 / log(1 + this.maxAcc) : 0
    for (let i = 0, di = 0; i < len; i++, di += 4) {
      const v = this.acc[i]
      if (v === 0) {
        data[di] = 11
        data[di + 1] = 13
        data[di + 2] = 18
        data[di + 3] = 255
        continue
      }
      const t = log(1 + v) * norm
      const r = Math.floor(40 + 215 * t)
      const g = Math.floor(140 + 110 * t)
      const b = Math.floor(220 + 35 * (1 - t))
      data[di] = r
      data[di + 1] = g
      data[di + 2] = b
      data[di + 3] = 255
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createHenonRenderer(): Renderer {
  return new HenonRenderer()
}
