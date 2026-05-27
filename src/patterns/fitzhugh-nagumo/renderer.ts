import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class FitzHughNagumoRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private gridW = 0
  private gridH = 0
  private u!: Float32Array
  private v!: Float32Array
  private uNext!: Float32Array
  private vNext!: Float32Array
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
    const reset = params.gridSize !== this.params.gridSize || params.preset !== this.params.preset
    this.params = { ...params }
    if (reset) this.reset()
  }

  reset(): void {
    const gridSize = this.params.gridSize as number
    this.gridW = Math.floor(this.width / gridSize)
    this.gridH = Math.floor(this.height / gridSize)
    const N = this.gridW * this.gridH
    this.u = new Float32Array(N)
    this.v = new Float32Array(N)
    this.uNext = new Float32Array(N)
    this.vNext = new Float32Array(N)
    const preset = this.params.preset as string
    if (preset === 'spiral') {
      // Asymmetric initial conditions trigger a spiral.
      for (let y = 0; y < this.gridH; y++) {
        for (let x = 0; x < this.gridW; x++) {
          const idx = y * this.gridW + x
          if (x < this.gridW / 2) this.u[idx] = 1
          if (y < this.gridH / 2) this.v[idx] = 0.5
        }
      }
    } else if (preset === 'pulse') {
      // Single pulse at left edge.
      for (let y = 0; y < this.gridH; y++) {
        for (let x = 0; x < 5; x++) {
          this.u[y * this.gridW + x] = 1
        }
      }
    } else {
      // Random.
      for (let i = 0; i < N; i++) {
        this.u[i] = Math.random() * 0.4
        this.v[i] = Math.random() * 0.2
      }
    }
  }

  step(): void {
    const a = this.params.a as number
    const b = this.params.b as number
    const eps = this.params.epsilon as number
    const D = 0.00006
    const dt = 0.5
    const u = this.u
    const v = this.v
    const u2 = this.uNext
    const v2 = this.vNext
    const W = this.gridW
    const H = this.gridH
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = y * W + x
        const ul = u[y * W + ((x - 1 + W) % W)]
        const ur = u[y * W + ((x + 1) % W)]
        const uu = u[((y - 1 + H) % H) * W + x]
        const ud = u[((y + 1) % H) * W + x]
        const lap = ul + ur + uu + ud - 4 * u[idx]
        const uv = u[idx]
        const vv = v[idx]
        const du = uv - (uv * uv * uv) / 3 - vv + D * lap * 1000
        const dv = eps * (uv + a - b * vv)
        u2[idx] = uv + dt * du
        v2[idx] = vv + dt * dv
      }
    }
    // Swap.
    this.u = u2
    this.v = v2
    this.uNext = u
    this.vNext = v
  }

  draw(): void {
    const data = this.imageData.data
    const cellSize = this.params.gridSize as number
    const W = this.gridW
    const H = this.gridH
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const u = this.u[y * W + x]
        const v = this.v[y * W + x]
        // Map u to red-yellow, v to blue.
        const t = Math.max(-2, Math.min(2, u))
        const t01 = (t + 2) / 4
        const sv = Math.max(-1, Math.min(1, v))
        const sv01 = (sv + 1) / 2
        const r = Math.round(40 + t01 * 215)
        const g = Math.round(20 + t01 * 120 + sv01 * 80)
        const bl = Math.round(50 + sv01 * 180 - t01 * 30)
        for (let dy = 0; dy < cellSize; dy++) {
          for (let dx = 0; dx < cellSize; dx++) {
            const px = x * cellSize + dx
            const py = y * cellSize + dy
            if (px >= this.width || py >= this.height) continue
            const di = (py * this.width + px) * 4
            data[di] = r
            data[di + 1] = g
            data[di + 2] = bl
            data[di + 3] = 255
          }
        }
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

export function createFitzHughNagumoRenderer(): Renderer {
  return new FitzHughNagumoRenderer()
}
