import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

const PHI = (1 + Math.sqrt(5)) / 2
type C = { re: number; im: number }
const c = (re: number, im: number): C => ({ re, im })
const cadd = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im })
const csub = (a: C, b: C): C => ({ re: a.re - b.re, im: a.im - b.im })
const cscale = (a: C, s: number): C => ({ re: a.re * s, im: a.im * s })

interface Tri {
  kind: 0 | 1 // 0 = thin (obtuse), 1 = thick (acute)
  a: C
  b: C
  c: C
}

// Robinson triangle deflation. Reference: Penrose substitution system, P2 variant.
function subdivide(tris: Tri[]): Tri[] {
  const out: Tri[] = []
  for (const t of tris) {
    if (t.kind === 1) {
      const p = cadd(t.a, cscale(csub(t.b, t.a), 1 / PHI))
      out.push({ kind: 1, a: t.c, b: p, c: t.b })
      out.push({ kind: 0, a: p, b: t.c, c: t.a })
    } else {
      const q = cadd(t.b, cscale(csub(t.a, t.b), 1 / PHI))
      const r = cadd(t.b, cscale(csub(t.c, t.b), 1 / PHI))
      out.push({ kind: 0, a: r, b: t.c, c: t.a })
      out.push({ kind: 0, a: q, b: r, c: t.b })
      out.push({ kind: 1, a: r, b: q, c: t.a })
    }
  }
  return out
}

function initialWheel(): Tri[] {
  const tris: Tri[] = []
  for (let i = 0; i < 10; i++) {
    const a1 = (i * 2 * Math.PI) / 10
    const a2 = ((i + 1) * 2 * Math.PI) / 10
    const b: C = c(Math.cos(a1), Math.sin(a1))
    const cc: C = c(Math.cos(a2), Math.sin(a2))
    if (i % 2 === 0) tris.push({ kind: 1, a: c(0, 0), b, c: cc })
    else tris.push({ kind: 1, a: c(0, 0), b: cc, c: b })
  }
  return tris
}

export class PenroseRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private tris: Tri[] = []
  private dirty = true

  init(ctx: RendererContext): void {
    const c2d = ctx.canvas.getContext('2d', { alpha: false })
    if (!c2d) throw new Error('2D context unavailable')
    this.ctx2d = c2d
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.reset()
  }

  setParams(params: ParamValues): void {
    const rebuild = (params.depth as number) !== (this.params.depth as number)
    this.params = { ...params }
    if (rebuild) this.reset()
    else this.dirty = true
  }

  reset(): void {
    let tris = initialWheel()
    const depth = this.params.depth as number
    for (let i = 0; i < depth; i++) tris = subdivide(tris)
    this.tris = tris
    this.dirty = true
  }

  step(): void {}

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, this.width, this.height)
    const cx = this.width / 2
    const cy = this.height / 2
    const scale = Math.min(this.width, this.height) * 0.45
    const showThick = this.params.showThick as boolean
    const showThin = this.params.showThin as boolean
    const stroke = this.params.stroke as boolean

    const project = (z: C): [number, number] => [cx + z.re * scale, cy + z.im * scale]

    for (const t of this.tris) {
      if (t.kind === 1 && !showThick) continue
      if (t.kind === 0 && !showThin) continue
      const [ax, ay] = project(t.a)
      const [bx, by] = project(t.b)
      const [cx2, cy2] = project(t.c)
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.lineTo(cx2, cy2)
      ctx.closePath()
      ctx.fillStyle = t.kind === 1 ? 'rgba(110, 193, 255, 0.85)' : 'rgba(192, 132, 252, 0.75)'
      ctx.fill()
      if (stroke) {
        ctx.strokeStyle = 'rgba(11, 13, 18, 0.6)'
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    }
    this.dirty = false
  }

  dispose(): void {}
}

export function createPenroseRenderer(): Renderer {
  return new PenroseRenderer()
}
