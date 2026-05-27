import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class DiamondSquareRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private heightmap!: Float32Array
  private size = 0
  private imageData!: ImageData
  private dirty = true

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
    const detail = this.params.detail as number
    this.size = (1 << detail) + 1 // 2^detail + 1
    this.heightmap = new Float32Array(this.size * this.size)
    this.diamondSquare()
    this.dirty = true
  }

  private get(x: number, y: number): number {
    return this.heightmap[y * this.size + x]
  }
  private set(x: number, y: number, v: number) {
    this.heightmap[y * this.size + x] = v
  }

  private diamondSquare() {
    const n = this.size - 1
    const roughness = this.params.roughness as number
    const seedRange = this.params.seedRange as number
    // Seed corners.
    this.set(0, 0, (Math.random() * 2 - 1) * seedRange)
    this.set(n, 0, (Math.random() * 2 - 1) * seedRange)
    this.set(0, n, (Math.random() * 2 - 1) * seedRange)
    this.set(n, n, (Math.random() * 2 - 1) * seedRange)

    let step = n
    let scale = seedRange
    while (step > 1) {
      const half = step / 2
      // Diamond step: midpoint of each square is average of its 4 corners + noise.
      for (let y = half; y < n; y += step) {
        for (let x = half; x < n; x += step) {
          const avg =
            (this.get(x - half, y - half) +
              this.get(x + half, y - half) +
              this.get(x - half, y + half) +
              this.get(x + half, y + half)) /
            4
          this.set(x, y, avg + (Math.random() * 2 - 1) * scale)
        }
      }
      // Square step: midpoint of each diamond.
      for (let y = 0; y <= n; y += half) {
        for (let x = (y + half) % step; x <= n; x += step) {
          let sum = 0
          let cnt = 0
          if (x - half >= 0) {
            sum += this.get(x - half, y)
            cnt++
          }
          if (x + half <= n) {
            sum += this.get(x + half, y)
            cnt++
          }
          if (y - half >= 0) {
            sum += this.get(x, y - half)
            cnt++
          }
          if (y + half <= n) {
            sum += this.get(x, y + half)
            cnt++
          }
          this.set(x, y, sum / cnt + (Math.random() * 2 - 1) * scale)
        }
      }
      step = half
      scale *= Math.pow(2, -roughness)
    }
  }

  step(): void {}

  draw(): void {
    if (!this.dirty) return
    const data = this.imageData.data
    const w = this.width
    const h = this.height
    const n = this.size
    // Find min/max for normalization.
    let mn = Infinity
    let mx = -Infinity
    for (let i = 0; i < this.heightmap.length; i++) {
      const v = this.heightmap[i]
      if (v < mn) mn = v
      if (v > mx) mx = v
    }
    const range = mx - mn || 1
    const seaLevel = this.params.seaLevel as number
    const showShading = this.params.shading as boolean
    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const sx = (px / w) * (n - 1)
        const sy = (py / h) * (n - 1)
        const sxi = Math.floor(sx)
        const syi = Math.floor(sy)
        const fx = sx - sxi
        const fy = sy - syi
        const sxi1 = Math.min(n - 1, sxi + 1)
        const syi1 = Math.min(n - 1, syi + 1)
        const a = this.heightmap[syi * n + sxi]
        const b = this.heightmap[syi * n + sxi1]
        const c = this.heightmap[syi1 * n + sxi]
        const d = this.heightmap[syi1 * n + sxi1]
        const v = (1 - fy) * ((1 - fx) * a + fx * b) + fy * ((1 - fx) * c + fx * d)
        const t = (v - mn) / range
        let r: number, g: number, blu: number
        if (t < seaLevel) {
          // Deep to shallow water.
          const tt = t / seaLevel
          r = 20 + 40 * tt
          g = 50 + 80 * tt
          blu = 100 + 100 * tt
        } else if (t < seaLevel + 0.05) {
          // Sand.
          r = 220
          g = 200
          blu = 150
        } else if (t < seaLevel + 0.4) {
          // Lowland green.
          const tt = (t - seaLevel - 0.05) / 0.35
          r = 60 + 100 * tt
          g = 130 + 60 * tt
          blu = 60 + 40 * tt
        } else if (t < seaLevel + 0.65) {
          // Highland brown.
          const tt = (t - seaLevel - 0.4) / 0.25
          r = 130 + 60 * tt
          g = 100 + 30 * tt
          blu = 60 + 20 * tt
        } else if (t < 0.92) {
          // Rock gray.
          const tt = (t - seaLevel - 0.65) / 0.25
          r = 130 - 20 * tt
          g = 130 - 20 * tt
          blu = 130 - 20 * tt
        } else {
          // Snow.
          r = 240
          g = 245
          blu = 250
        }
        if (showShading && t > seaLevel) {
          // Lambert-ish: slope from x derivative.
          const dx = (this.heightmap[syi * n + sxi1] - this.heightmap[syi * n + sxi]) / range
          const dy = (this.heightmap[syi1 * n + sxi] - this.heightmap[syi * n + sxi]) / range
          const lit = Math.max(0, Math.min(1.4, 1 - dx * 6 + dy * 2))
          r *= lit
          g *= lit
          blu *= lit
        }
        const di = (py * w + px) * 4
        data[di] = Math.min(255, Math.max(0, r))
        data[di + 1] = Math.min(255, Math.max(0, g))
        data[di + 2] = Math.min(255, Math.max(0, blu))
        data[di + 3] = 255
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
    this.dirty = false
  }

  dispose(): void {}
}

export function createDiamondSquareRenderer(): Renderer {
  return new DiamondSquareRenderer()
}
