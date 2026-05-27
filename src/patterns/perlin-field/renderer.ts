import { createNoise3D, type NoiseFunction3D } from 'simplex-noise'
import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

function seededRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0x100000000
  }
}

export class PerlinFieldRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private noise!: NoiseFunction3D
  private imageData!: ImageData
  private z = 0
  private dirty = true

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.imageData = this.ctx2d.createImageData(this.width, this.height)
    this.noise = createNoise3D(seededRandom(1337))
    this.reset()
  }

  setParams(params: ParamValues): void {
    const reseed = (params.seed as number) !== (this.params?.seed as number)
    this.params = { ...params }
    if (reseed) this.noise = createNoise3D(seededRandom(this.params.seed as number))
    this.dirty = true
  }

  reset(): void {
    this.z = 0
    this.dirty = true
  }

  step(): void {
    const animSpeed = this.params.animSpeed as number
    if (animSpeed > 0) {
      this.z += animSpeed * 0.005
      this.dirty = true
    }
  }

  private fbm(x: number, y: number, z: number, octaves: number, persistence: number, lacunarity: number): number {
    let amp = 1
    let freq = 1
    let sum = 0
    let max = 0
    for (let i = 0; i < octaves; i++) {
      sum += amp * this.noise(x * freq, y * freq, z)
      max += amp
      amp *= persistence
      freq *= lacunarity
    }
    return sum / max
  }

  draw(): void {
    if (!this.dirty) return
    const data = this.imageData.data
    const w = this.width
    const h = this.height
    const scale = this.params.scale as number
    const octaves = this.params.octaves as number
    const persistence = this.params.persistence as number
    const lacunarity = this.params.lacunarity as number
    const palette = this.params.palette as string
    const contour = this.params.contour as boolean
    const invScale = 1 / scale
    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const v = this.fbm(px * invScale, py * invScale, this.z, octaves, persistence, lacunarity)
        // Map from approx [-1, 1] to [0, 1].
        let t = (v + 1) * 0.5
        if (t < 0) t = 0
        else if (t > 1) t = 1
        let r: number, g: number, b: number
        if (palette === 'grayscale') {
          const c = Math.floor(t * 255)
          r = g = b = c
        } else if (palette === 'terrain') {
          if (t < 0.4) {
            const tt = t / 0.4
            r = 20 + 40 * tt
            g = 50 + 80 * tt
            b = 110 + 100 * tt
          } else if (t < 0.45) {
            r = 220
            g = 200
            b = 150
          } else if (t < 0.7) {
            const tt = (t - 0.45) / 0.25
            r = 60 + 100 * tt
            g = 130 + 60 * tt
            b = 60 + 40 * tt
          } else if (t < 0.88) {
            const tt = (t - 0.7) / 0.18
            r = 130 + 50 * tt
            g = 100 + 20 * tt
            b = 60 + 10 * tt
          } else {
            r = 230
            g = 235
            b = 245
          }
        } else if (palette === 'fire') {
          r = Math.min(255, t * 510)
          g = Math.min(255, Math.max(0, t * 510 - 200))
          b = Math.min(255, Math.max(0, t * 510 - 400))
        } else {
          // 'plasma'
          r = Math.floor(255 * Math.max(0, Math.sin(t * Math.PI)))
          g = Math.floor(255 * Math.max(0, Math.sin(t * Math.PI * 2)))
          b = Math.floor(255 * Math.max(0, Math.cos(t * Math.PI * 0.7)))
        }
        if (contour) {
          // Draw 8 contour bands.
          const bandT = (t * 8) % 1
          if (bandT < 0.04 || bandT > 0.96) {
            r = Math.min(255, r * 0.4 + 30)
            g = Math.min(255, g * 0.4 + 30)
            b = Math.min(255, b * 0.4 + 30)
          }
        }
        const di = (py * w + px) * 4
        data[di] = r
        data[di + 1] = g
        data[di + 2] = b
        data[di + 3] = 255
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
    this.dirty = false
  }

  dispose(): void {}
}

export function createPerlinFieldRenderer(): Renderer {
  return new PerlinFieldRenderer()
}
