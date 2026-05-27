import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class KuramotoRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private theta!: Float64Array
  private omega!: Float64Array
  private rOrderHistory: number[] = []
  private rng = mulberry32(7)

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
    const reset = params.N !== this.params.N || params.spread !== this.params.spread
    this.params = { ...params }
    if (reset) this.reset()
  }

  reset(): void {
    const N = this.params.N as number
    const spread = this.params.spread as number
    this.rng = mulberry32(7)
    this.theta = new Float64Array(N)
    this.omega = new Float64Array(N)
    for (let i = 0; i < N; i++) {
      this.theta[i] = this.rng() * Math.PI * 2
      this.omega[i] = (this.rng() - 0.5) * 2 * spread
    }
    this.rOrderHistory = []
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  step(): void {
    const N = this.theta.length
    const K = this.params.K as number
    const dt = 0.05
    let sumSin = 0
    let sumCos = 0
    for (let i = 0; i < N; i++) {
      sumSin += Math.sin(this.theta[i])
      sumCos += Math.cos(this.theta[i])
    }
    const r = Math.sqrt(sumSin * sumSin + sumCos * sumCos) / N
    const psi = Math.atan2(sumSin, sumCos)
    for (let i = 0; i < N; i++) {
      this.theta[i] += dt * (this.omega[i] + K * r * Math.sin(psi - this.theta[i]))
    }
    this.rOrderHistory.push(r)
    if (this.rOrderHistory.length > 400) this.rOrderHistory.shift()
  }

  draw(): void {
    const ctx = this.ctx2d
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, this.width, this.height)
    const N = this.theta.length
    // Left half: phase circle.
    const half = this.width / 2
    const cx = half / 2
    const cy = this.height / 2
    const radius = Math.min(half, this.height) * 0.4
    ctx.strokeStyle = '#3d4a60'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.stroke()
    // Order parameter arrow.
    let sumSin = 0
    let sumCos = 0
    for (let i = 0; i < N; i++) {
      sumSin += Math.sin(this.theta[i])
      sumCos += Math.cos(this.theta[i])
    }
    const r = Math.sqrt(sumSin * sumSin + sumCos * sumCos) / N
    const psi = Math.atan2(sumSin, sumCos)
    ctx.strokeStyle = '#f0a85a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(psi) * radius * r, cy - Math.sin(psi) * radius * r)
    ctx.stroke()
    // Oscillators.
    for (let i = 0; i < N; i++) {
      const hue = ((this.omega[i] + 1) / 2) * 280 + 200
      ctx.fillStyle = `hsl(${hue % 360}, 80%, 65%)`
      const px = cx + Math.cos(this.theta[i]) * radius
      const py = cy - Math.sin(this.theta[i]) * radius
      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = '#8b9bb4'
    ctx.font = '12px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`r = ${r.toFixed(3)}`, cx, cy + radius + 24)
    ctx.fillText(`K = ${(this.params.K as number).toFixed(2)}`, cx, cy + radius + 44)
    // Right half: r history.
    const margin = 24
    const histX = half + margin
    const histW = half - margin * 2
    const histY = this.height - margin
    const histH = this.height - margin * 2
    ctx.strokeStyle = '#3d4a60'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(histX, histY)
    ctx.lineTo(histX + histW, histY)
    ctx.moveTo(histX, histY - histH)
    ctx.lineTo(histX, histY)
    ctx.stroke()
    ctx.fillStyle = '#8b9bb4'
    ctx.font = '11px ui-monospace, monospace'
    ctx.textAlign = 'left'
    ctx.fillText('r(t) — order parameter', histX, histY - histH - 4)
    ctx.textAlign = 'right'
    ctx.fillText('1', histX - 4, histY - histH + 4)
    ctx.fillText('0', histX - 4, histY)
    ctx.strokeStyle = '#7af0a0'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i < this.rOrderHistory.length; i++) {
      const x = histX + (i / Math.max(1, this.rOrderHistory.length - 1)) * histW
      const y = histY - this.rOrderHistory[i] * histH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  dispose(): void {}
}

function mulberry32(seed: number): () => number {
  let t = seed
  return function () {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function createKuramotoRenderer(): Renderer {
  return new KuramotoRenderer()
}
