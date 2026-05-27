import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class QuasicrystalRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
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
    this.params = { ...params }
    this.rowsDone = 0
  }

  reset(): void {
    this.rowsDone = 0
  }

  step(): void {
    if (this.rowsDone >= this.height) return
    const N = this.params.waves as number
    const freq = this.params.frequency as number
    const phase = this.params.phase as number
    const data = this.imageData.data
    const cx = this.width / 2
    const cy = this.height / 2
    const k = freq * 0.04
    const rowsPerStep = 16
    for (let r = 0; r < rowsPerStep && this.rowsDone < this.height; r++, this.rowsDone++) {
      const py = this.rowsDone
      for (let px = 0; px < this.width; px++) {
        const x = px - cx
        const y = py - cy
        let sum = 0
        for (let i = 0; i < N; i++) {
          const a = (Math.PI * i) / N
          sum += Math.cos(k * (x * Math.cos(a) + y * Math.sin(a)) + phase)
        }
        const t = (sum / N + 1) / 2
        const di = (py * this.width + px) * 4
        // Map to a perceptually pleasant gradient.
        const u = t * 6
        let R = 0
        let G = 0
        let B = 0
        if (u < 1) {
          R = 11 + (50 - 11) * u
          G = 13 + (40 - 13) * u
          B = 18 + (90 - 18) * u
        } else if (u < 2) {
          const v = u - 1
          R = 50 + (40 - 50) * v
          G = 40 + (130 - 40) * v
          B = 90 + (180 - 90) * v
        } else if (u < 3) {
          const v = u - 2
          R = 40 + (200 - 40) * v
          G = 130 + (180 - 130) * v
          B = 180 + (90 - 180) * v
        } else if (u < 4) {
          const v = u - 3
          R = 200 + (240 - 200) * v
          G = 180 + (140 - 180) * v
          B = 90 + (60 - 90) * v
        } else if (u < 5) {
          const v = u - 4
          R = 240 + (200 - 240) * v
          G = 140 + (200 - 140) * v
          B = 60 + (200 - 60) * v
        } else {
          const v = u - 5
          R = 200 + (235 - 200) * v
          G = 200 + (235 - 200) * v
          B = 200 + (240 - 200) * v
        }
        data[di] = Math.round(R)
        data[di + 1] = Math.round(G)
        data[di + 2] = Math.round(B)
        data[di + 3] = 255
      }
    }
  }

  draw(): void {
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createQuasicrystalRenderer(): Renderer {
  return new QuasicrystalRenderer()
}
