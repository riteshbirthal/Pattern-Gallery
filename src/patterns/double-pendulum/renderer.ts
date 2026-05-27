import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface State {
  th1: number
  th2: number
  w1: number
  w2: number
  trail: Array<[number, number]>
  hue: number
}

function deriv(s: { th1: number; th2: number; w1: number; w2: number }, l1: number, l2: number, m1: number, m2: number, g: number): { dth1: number; dth2: number; dw1: number; dw2: number } {
  const { th1, th2, w1, w2 } = s
  const d = th1 - th2
  const den1 = (m1 + m2) * l1 - m2 * l1 * Math.cos(d) * Math.cos(d)
  const den2 = (l2 / l1) * den1
  const dth1 = w1
  const dth2 = w2
  const dw1 =
    (m2 * l1 * w1 * w1 * Math.sin(d) * Math.cos(d) +
      m2 * g * Math.sin(th2) * Math.cos(d) +
      m2 * l2 * w2 * w2 * Math.sin(d) -
      (m1 + m2) * g * Math.sin(th1)) /
    den1
  const dw2 =
    (-m2 * l2 * w2 * w2 * Math.sin(d) * Math.cos(d) +
      (m1 + m2) * g * Math.sin(th1) * Math.cos(d) -
      (m1 + m2) * l1 * w1 * w1 * Math.sin(d) -
      (m1 + m2) * g * Math.sin(th2)) /
    den2
  return { dth1, dth2, dw1, dw2 }
}

function rk4Step(s: State, dt: number, l1: number, l2: number, m1: number, m2: number, g: number): void {
  const k1 = deriv(s, l1, l2, m1, m2, g)
  const s2 = { th1: s.th1 + (k1.dth1 * dt) / 2, th2: s.th2 + (k1.dth2 * dt) / 2, w1: s.w1 + (k1.dw1 * dt) / 2, w2: s.w2 + (k1.dw2 * dt) / 2 }
  const k2 = deriv(s2, l1, l2, m1, m2, g)
  const s3 = { th1: s.th1 + (k2.dth1 * dt) / 2, th2: s.th2 + (k2.dth2 * dt) / 2, w1: s.w1 + (k2.dw1 * dt) / 2, w2: s.w2 + (k2.dw2 * dt) / 2 }
  const k3 = deriv(s3, l1, l2, m1, m2, g)
  const s4 = { th1: s.th1 + k3.dth1 * dt, th2: s.th2 + k3.dth2 * dt, w1: s.w1 + k3.dw1 * dt, w2: s.w2 + k3.dw2 * dt }
  const k4 = deriv(s4, l1, l2, m1, m2, g)
  s.th1 += (dt / 6) * (k1.dth1 + 2 * k2.dth1 + 2 * k3.dth1 + k4.dth1)
  s.th2 += (dt / 6) * (k1.dth2 + 2 * k2.dth2 + 2 * k3.dth2 + k4.dth2)
  s.w1 += (dt / 6) * (k1.dw1 + 2 * k2.dw1 + 2 * k3.dw1 + k4.dw1)
  s.w2 += (dt / 6) * (k1.dw2 + 2 * k2.dw2 + 2 * k3.dw2 + k4.dw2)
}

export class DoublePendulumRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private states: State[] = []

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
    const replenish =
      params.copies !== this.params.copies || params.spread !== this.params.spread
    this.params = { ...params }
    if (replenish) this.reset()
  }

  reset(): void {
    const copies = this.params.copies as number
    const spread = this.params.spread as number
    const baseTh1 = (this.params.theta1 as number) * (Math.PI / 180)
    const baseTh2 = (this.params.theta2 as number) * (Math.PI / 180)
    this.states = []
    for (let i = 0; i < copies; i++) {
      const t = copies === 1 ? 0 : i / (copies - 1) - 0.5
      this.states.push({
        th1: baseTh1 + t * spread * 0.001,
        th2: baseTh2,
        w1: 0,
        w2: 0,
        trail: [],
        hue: (i / Math.max(1, copies)) * 320,
      })
    }
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  step(): void {
    const l1 = 1
    const l2 = 1
    const m1 = 1
    const m2 = 1
    const g = 9.81
    const dt = 0.01
    const substeps = 4
    for (const s of this.states) {
      for (let k = 0; k < substeps; k++) rk4Step(s, dt, l1, l2, m1, m2, g)
      const cx = this.width / 2
      const cy = this.height / 2 - 40
      const scale = Math.min(this.width, this.height) / 5
      const x2 = cx + Math.sin(s.th1) * scale + Math.sin(s.th2) * scale
      const y2 = cy + Math.cos(s.th1) * scale + Math.cos(s.th2) * scale
      s.trail.push([x2, y2])
      if (s.trail.length > 600) s.trail.shift()
    }
  }

  draw(): void {
    const ctx = this.ctx2d
    ctx.fillStyle = 'rgba(11, 13, 18, 0.18)'
    ctx.fillRect(0, 0, this.width, this.height)
    const cx = this.width / 2
    const cy = this.height / 2 - 40
    const scale = Math.min(this.width, this.height) / 5
    // Draw trails.
    for (const s of this.states) {
      ctx.strokeStyle = `hsla(${s.hue}, 80%, 65%, 0.35)`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i < s.trail.length; i++) {
        const [x, y] = s.trail[i]
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
    // Draw current arms only for first few copies for clarity.
    const maxArms = Math.min(this.states.length, 6)
    for (let i = 0; i < maxArms; i++) {
      const s = this.states[i]
      const x1 = cx + Math.sin(s.th1) * scale
      const y1 = cy + Math.cos(s.th1) * scale
      const x2 = x1 + Math.sin(s.th2) * scale
      const y2 = y1 + Math.cos(s.th2) * scale
      ctx.strokeStyle = `hsl(${s.hue}, 80%, 75%)`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.fillStyle = `hsl(${s.hue}, 80%, 75%)`
      ctx.beginPath()
      ctx.arc(x2, y2, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  dispose(): void {}
}

export function createDoublePendulumRenderer(): Renderer {
  return new DoublePendulumRenderer()
}
