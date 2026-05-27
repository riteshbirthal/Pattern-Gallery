import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface CNum {
  re: number
  im: number
}

function cMul(a: CNum, b: CNum): CNum {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }
}

function cDiv(a: CNum, b: CNum): CNum {
  const d = b.re * b.re + b.im * b.im
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }
}

function cAdd(a: CNum, b: CNum): CNum {
  return { re: a.re + b.re, im: a.im + b.im }
}

function cSub(a: CNum, b: CNum): CNum {
  return { re: a.re - b.re, im: a.im - b.im }
}

function cExp(z: CNum): CNum {
  const e = Math.exp(z.re)
  return { re: e * Math.cos(z.im), im: e * Math.sin(z.im) }
}

function cSin(z: CNum): CNum {
  return { re: Math.sin(z.re) * Math.cosh(z.im), im: Math.cos(z.re) * Math.sinh(z.im) }
}

function evaluate(fn: string, z: CNum): CNum {
  const z2 = cMul(z, z)
  if (fn === 'identity') return z
  if (fn === 'square') return z2
  if (fn === 'cube') return cMul(z2, z)
  if (fn === 'inverse') return cDiv({ re: 1, im: 0 }, z)
  if (fn === 'mobius') {
    // (z - 1) / (z + 1)
    return cDiv(cSub(z, { re: 1, im: 0 }), cAdd(z, { re: 1, im: 0 }))
  }
  if (fn === 'rational') {
    // (z^3 - 1) / (z^2 + z + 1)
    const num = cSub(cMul(z2, z), { re: 1, im: 0 })
    const den = cAdd(cAdd(z2, z), { re: 1, im: 0 })
    return cDiv(num, den)
  }
  if (fn === 'sine') return cSin(z)
  if (fn === 'exp') return cExp(z)
  if (fn === 'gamma') {
    // Stirling approximation for visualization (not high-accuracy, but visually rich).
    if (z.re < 0.5) {
      // Reflection formula: Γ(z) = π / (sin(πz) Γ(1-z))
      const piZ = { re: Math.PI * z.re, im: Math.PI * z.im }
      const sinPiZ = cSin(piZ)
      const oneMinus = cSub({ re: 1, im: 0 }, z)
      const g1 = stirling(oneMinus)
      return cDiv({ re: Math.PI, im: 0 }, cMul(sinPiZ, g1))
    }
    return stirling(z)
  }
  return z
}

function stirling(z: CNum): CNum {
  // ln Γ(z) ≈ (z-1/2) ln z - z + (1/2) ln(2π) + 1/(12z) - 1/(360 z^3)
  const half = { re: 0.5, im: 0 }
  const zMinusHalf = cSub(z, half)
  const lnZ = { re: 0.5 * Math.log(z.re * z.re + z.im * z.im), im: Math.atan2(z.im, z.re) }
  const term1 = cMul(zMinusHalf, lnZ)
  const term2 = { re: -z.re + 0.5 * Math.log(2 * Math.PI), im: -z.im }
  const z2 = cMul(z, z)
  const z3 = cMul(z2, z)
  const term3 = cDiv({ re: 1 / 12, im: 0 }, z)
  const term4 = cDiv({ re: -1 / 360, im: 0 }, z3)
  const lnG = cAdd(cAdd(cAdd(term1, term2), term3), term4)
  return cExp(lnG)
}

export class DomainColoringRenderer implements Renderer {
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
    const fn = this.params.fn as string
    const range = this.params.range as number
    const data = this.imageData.data
    const cx = this.width / 2
    const cy = this.height / 2
    const scale = (2 * range) / Math.min(this.width, this.height)
    const rowsPerStep = 16
    for (let r = 0; r < rowsPerStep && this.rowsDone < this.height; r++, this.rowsDone++) {
      const py = this.rowsDone
      for (let px = 0; px < this.width; px++) {
        const re = (px - cx) * scale
        const im = -(py - cy) * scale
        const w = evaluate(fn, { re, im })
        const di = (py * this.width + px) * 4
        if (!isFinite(w.re) || !isFinite(w.im)) {
          data[di] = 11
          data[di + 1] = 13
          data[di + 2] = 18
          data[di + 3] = 255
          continue
        }
        const arg = Math.atan2(w.im, w.re)
        const mag = Math.sqrt(w.re * w.re + w.im * w.im)
        const hue = ((arg / Math.PI) * 0.5 + 0.5) * 360
        // Lightness modulated by log2(magnitude) fractional part for level curves.
        const logMag = Math.log2(mag + 1e-12)
        const fracMag = logMag - Math.floor(logMag)
        const lightness = 0.4 + 0.3 * fracMag
        // Add gridline darkening near integer real or imaginary part of arg.
        const argFrac = (arg / (Math.PI / 6) + 100) % 1
        const gridDim = argFrac < 0.04 || argFrac > 0.96 ? 0.7 : 1
        const rgb = hsl(hue, 75, lightness * 100 * gridDim)
        data[di] = rgb[0]
        data[di + 1] = rgb[1]
        data[di + 2] = rgb[2]
        data[di + 3] = 255
      }
    }
  }

  draw(): void {
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

function hsl(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100
  if (l < 0) l = 0
  if (l > 1) l = 1
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

export function createDomainColoringRenderer(): Renderer {
  return new DomainColoringRenderer()
}
