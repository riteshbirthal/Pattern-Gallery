import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

const SIZE = 96 // grid resolution
const R = 13 // kernel radius

export class LeniaRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private grid!: Float32Array
  private next!: Float32Array
  private kernel!: Float32Array
  private kernelSum = 0
  private imageData!: ImageData

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.grid = new Float32Array(SIZE * SIZE)
    this.next = new Float32Array(SIZE * SIZE)
    this.imageData = this.ctx2d.createImageData(this.width, this.height)
    this.buildKernel()
    this.reset()
  }

  setParams(params: ParamValues): void {
    this.params = { ...params }
  }

  reset(): void {
    this.grid.fill(0)
    // Random patch in the center.
    const cx = SIZE / 2
    const cy = SIZE / 2
    const r = SIZE / 4
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = x - cx
        const dy = y - cy
        if (dx * dx + dy * dy < r * r) {
          this.grid[y * SIZE + x] = Math.random()
        }
      }
    }
  }

  private buildKernel() {
    const kw = R * 2 + 1
    this.kernel = new Float32Array(kw * kw)
    let sum = 0
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy) / R
        // Concentric ring kernel: peaks at r ~ 0.5
        let k = 0
        if (dist > 0 && dist < 1) {
          k = Math.exp(4 - 1 / (dist * (1 - dist)))
        }
        this.kernel[(dy + R) * kw + (dx + R)] = k
        sum += k
      }
    }
    this.kernelSum = sum
  }

  step(): void {
    const mu = this.params.mu as number
    const sigma = this.params.sigma as number
    const dt = this.params.dt as number
    const grid = this.grid
    const next = this.next
    const kernel = this.kernel
    const ks = this.kernelSum
    const kw = R * 2 + 1
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        // Convolve.
        let s = 0
        for (let dy = -R; dy <= R; dy++) {
          const yy = (y + dy + SIZE) % SIZE
          for (let dx = -R; dx <= R; dx++) {
            const xx = (x + dx + SIZE) % SIZE
            const k = kernel[(dy + R) * kw + (dx + R)]
            s += k * grid[yy * SIZE + xx]
          }
        }
        const u = s / ks
        // Growth: bell curve centered at mu, width sigma.
        const g = 2 * Math.exp(-((u - mu) * (u - mu)) / (2 * sigma * sigma)) - 1
        const v = grid[y * SIZE + x] + dt * g
        next[y * SIZE + x] = Math.max(0, Math.min(1, v))
      }
    }
    // Swap.
    this.grid = next
    this.next = grid
  }

  draw(): void {
    const data = this.imageData.data
    const cellW = this.width / SIZE
    const cellH = this.height / SIZE
    const w = this.width
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const v = this.grid[y * SIZE + x]
        // Color: dark green to magenta gradient through cyan.
        const t = v
        const r = Math.floor(20 + 200 * Math.pow(t, 1.4))
        const g = Math.floor(40 + 220 * t * (1 - t * 0.5))
        const b = Math.floor(60 + 200 * Math.sqrt(t))
        const px0 = Math.floor(x * cellW)
        const py0 = Math.floor(y * cellH)
        const px1 = Math.floor((x + 1) * cellW)
        const py1 = Math.floor((y + 1) * cellH)
        for (let py = py0; py < py1; py++) {
          for (let pxi = px0; pxi < px1; pxi++) {
            const di = (py * w + pxi) * 4
            data[di] = r
            data[di + 1] = g
            data[di + 2] = b
            data[di + 3] = 255
          }
        }
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createLeniaRenderer(): Renderer {
  return new LeniaRenderer()
}
