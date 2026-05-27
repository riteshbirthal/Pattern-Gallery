import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class BuddhabrotRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private hits!: Uint32Array
  private maxHits = 1
  private samples = 0
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
    this.reset()
  }

  reset(): void {
    this.hits = new Uint32Array(this.width * this.height)
    this.maxHits = 1
    this.samples = 0
    this.ctx2d.fillStyle = '#000'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  step(): void {
    const maxIter = this.params.maxIter as number
    const samplesPerStep = this.params.samplesPerStep as number
    // The Buddhabrot is rotated 90° conventionally — view with the gap pointing up.
    // We map screen Y → real (cx ranges left/right), screen X → imag (cy ranges up/down).
    // To draw the Buddhabrot facing forward we just swap during write.
    const w = this.width
    const h = this.height
    for (let s = 0; s < samplesPerStep; s++) {
      // Sample c uniformly in (-2, 1) x (-1.5, 1.5).
      const cx = Math.random() * 3 - 2
      const cy = Math.random() * 3 - 1.5
      // Skip points known to be in the main cardioid / period-2 bulb (huge speedup).
      const q = (cx - 0.25) * (cx - 0.25) + cy * cy
      if (q * (q + (cx - 0.25)) < 0.25 * cy * cy) continue
      if ((cx + 1) * (cx + 1) + cy * cy < 0.0625) continue
      // First check: does it escape?
      let zx = 0
      let zy = 0
      let escaped = false
      for (let i = 0; i < maxIter; i++) {
        const zx2 = zx * zx - zy * zy + cx
        zy = 2 * zx * zy + cy
        zx = zx2
        if (zx * zx + zy * zy > 4) {
          escaped = true
          break
        }
      }
      if (!escaped) continue
      // Replay the orbit and accumulate hits.
      zx = 0
      zy = 0
      for (let i = 0; i < maxIter; i++) {
        const zx2 = zx * zx - zy * zy + cx
        zy = 2 * zx * zy + cy
        zx = zx2
        if (zx * zx + zy * zy > 4) break
        // Map orbit point to screen. Rotate 90°: the orbit point's (x,y) maps to (py, px).
        const py = Math.floor(((zx + 2) / 3) * h)
        const px = Math.floor(((zy + 1.5) / 3) * w)
        if (px >= 0 && px < w && py >= 0 && py < h) {
          const idx = py * w + px
          this.hits[idx]++
          if (this.hits[idx] > this.maxHits) this.maxHits = this.hits[idx]
        }
      }
      this.samples++
    }
  }

  draw(): void {
    const data = this.imageData.data
    const len = this.hits.length
    const lmax = Math.log1p(this.maxHits) || 1
    const tint = this.params.tint as string
    let tr = 1
    let tg = 1
    let tb = 1
    if (tint === 'gold') {
      tr = 1.3
      tg = 1.05
      tb = 0.6
    } else if (tint === 'cool') {
      tr = 0.6
      tg = 0.9
      tb = 1.3
    } else if (tint === 'rose') {
      tr = 1.3
      tg = 0.7
      tb = 0.95
    }
    for (let i = 0; i < len; i++) {
      const v = Math.log1p(this.hits[i]) / lmax
      const r = Math.min(255, v * 255 * tr)
      const g = Math.min(255, v * 255 * tg)
      const b = Math.min(255, v * 255 * tb)
      const di = i * 4
      data[di] = r
      data[di + 1] = g
      data[di + 2] = b
      data[di + 3] = 255
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createBuddhabrotRenderer(): Renderer {
  return new BuddhabrotRenderer()
}
