import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class LogisticRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private rendered = false
  private imageData!: ImageData

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
    this.rendered = false
  }

  reset(): void {
    this.rendered = false
  }

  step(): void {}

  draw(): void {
    if (this.rendered) return
    const data = this.imageData.data
    const w = this.width
    const h = this.height
    // Clear.
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 11
      data[i + 1] = 13
      data[i + 2] = 18
      data[i + 3] = 255
    }
    const rMin = this.params.rMin as number
    const rMax = this.params.rMax as number
    const transient = this.params.transient as number
    const samples = this.params.samples as number
    const yMin = 0
    const yMax = 1
    for (let px = 0; px < w; px++) {
      const r = rMin + ((rMax - rMin) * px) / (w - 1)
      let x = 0.5
      // Discard transient.
      for (let i = 0; i < transient; i++) {
        x = r * x * (1 - x)
      }
      // Plot the next 'samples' iterates.
      for (let i = 0; i < samples; i++) {
        x = r * x * (1 - x)
        const py = Math.floor(((yMax - x) / (yMax - yMin)) * (h - 1))
        if (py < 0 || py >= h) continue
        const di = (py * w + px) * 4
        data[di] = Math.min(255, data[di] + 18)
        data[di + 1] = Math.min(255, data[di + 1] + 25)
        data[di + 2] = Math.min(255, data[di + 2] + 35)
        data[di + 3] = 255
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
    this.rendered = true
  }

  dispose(): void {}
}

export function createLogisticRenderer(): Renderer {
  return new LogisticRenderer()
}
