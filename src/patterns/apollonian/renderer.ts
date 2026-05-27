import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Circle {
  x: number
  y: number
  k: number // signed curvature; negative means enclosing
  depth: number
}

export class ApollonianRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private circles: Circle[] = []
  private dirty = true

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
    const rebuild =
      params.depth !== this.params.depth ||
      params.k1 !== this.params.k1 ||
      params.k2 !== this.params.k2 ||
      params.k3 !== this.params.k3
    this.params = { ...params }
    if (rebuild) this.reset()
    else this.dirty = true
  }

  reset(): void {
    this.circles = []
    const k1 = this.params.k1 as number
    const k2 = this.params.k2 as number
    const k3 = this.params.k3 as number
    // Outer enclosing circle: from Descartes theorem with three internally tangent circles.
    // Use signed curvatures: outer is negative.
    const k4a = k1 + k2 + k3 - 2 * Math.sqrt(k1 * k2 + k2 * k3 + k1 * k3)
    const k4b = k1 + k2 + k3 + 2 * Math.sqrt(k1 * k2 + k2 * k3 + k1 * k3)
    // The smaller (more negative) is the outer enclosing.
    const outerK = Math.min(k4a, k4b)
    const innerK = Math.max(k4a, k4b)
    if (!isFinite(outerK) || !isFinite(innerK)) return

    // Place outer circle centered at origin.
    const outer: Circle = { x: 0, y: 0, k: outerK, depth: 0 }
    // Place three mutually tangent circles inside.
    // c1 on -x axis, c2 on +x axis, c3 above.
    const r1 = 1 / k1
    const r2 = 1 / k2
    const r3 = 1 / k3
    const c1: Circle = { x: -1 / outerK - r1, y: 0, k: k1, depth: 0 }
    // Wait: outer radius = -1/outerK (since outerK negative).
    const R = -1 / outerK
    // c1 inside, tangent to outer on left: center at (-(R - r1), 0)
    c1.x = -(R - r1)
    c1.y = 0
    const c2: Circle = { x: R - r2, y: 0, k: k2, depth: 0 }
    // c3: tangent to outer (so at distance R - r3 from origin) and tangent to c1 and c2.
    // Use Descartes coordinates: complex curvature-coordinate version.
    // Solve: c3 at (cx, cy) with cy > 0
    // |c3 - c1|^2 = (r1 + r3)^2 ; |c3 - c2|^2 = (r2 + r3)^2
    const A = c2.x - c1.x
    const B = (r1 + r3) * (r1 + r3) - (r2 + r3) * (r2 + r3) - c1.x * c1.x + c2.x * c2.x
    const cx3 = B / (2 * A)
    const cy3sq = (r1 + r3) * (r1 + r3) - (cx3 - c1.x) * (cx3 - c1.x)
    if (cy3sq < 0) return
    const cy3 = Math.sqrt(cy3sq)
    const c3: Circle = { x: cx3, y: cy3, k: k3, depth: 0 }

    this.circles.push(outer, c1, c2, c3)

    // Recursively fill the curvilinear triangle gaps.
    const depth = this.params.depth as number
    const minR = 0.002 // skip circles smaller than this in normalized units
    this.recurse(outer, c1, c2, c3, depth, minR)
    this.recurse(outer, c1, c3, c2, depth, minR) // alternate triple
    this.recurse(outer, c2, c3, c1, depth, minR)
    this.recurse(c1, c2, c3, outer, depth, minR)

    this.dirty = true
  }

  private recurse(a: Circle, b: Circle, c: Circle, prev: Circle, depth: number, minR: number) {
    if (depth <= 0) return
    // Find the new circle tangent to a, b, c and *not* equal to prev.
    const sum = a.k + b.k + c.k
    const root = a.k * b.k + b.k * c.k + a.k * c.k
    if (root < 0) return
    const sqrtTerm = 2 * Math.sqrt(root)
    // Two solutions for k4
    const k4a = sum + sqrtTerm
    const k4b = sum - sqrtTerm
    // The new k4 is the one that's NOT prev.k. Check both candidates and pick the one that gives a valid new circle, not prev.
    for (const k4 of [k4a, k4b]) {
      // For the position, use Descartes complex theorem:
      // (k1 z1 + k2 z2 + k3 z3 ± 2 sqrt(k1 k2 z1 z2 + ...))
      const az = { x: a.x, y: a.y }
      const bz = { x: b.x, y: b.y }
      const cz = { x: c.x, y: c.y }
      const term = (z: { x: number; y: number }, k: number) => ({ x: z.x * k, y: z.y * k })
      const cross = csqrt(
        cmul(term(az, a.k), term(bz, b.k))
          .add(cmul(term(bz, b.k), term(cz, c.k)))
          .add(cmul(term(az, a.k), term(cz, c.k))),
      )
      const base = {
        x: az.x * a.k + bz.x * b.k + cz.x * c.k,
        y: az.y * a.k + bz.y * b.k + cz.y * c.k,
      }
      // Two solutions: base ± 2*cross, divided by k4
      for (const sign of [1, -1]) {
        const zk = {
          x: (base.x + sign * 2 * cross.x) / k4,
          y: (base.y + sign * 2 * cross.y) / k4,
        }
        const newCircle: Circle = { x: zk.x, y: zk.y, k: k4, depth: a.depth + 1 }
        // Make sure it isn't (numerically) equal to prev.
        if (
          Math.abs(newCircle.k - prev.k) < 1e-6 &&
          Math.hypot(newCircle.x - prev.x, newCircle.y - prev.y) < 1e-4
        ) {
          continue
        }
        // Bounds check.
        const r = Math.abs(1 / k4)
        if (!isFinite(r) || r < minR || r > 5) continue
        if (Math.hypot(newCircle.x, newCircle.y) > 5) continue
        // Avoid duplicates that are too close to existing circles.
        let dup = false
        for (const ex of this.circles) {
          if (Math.abs(ex.k - newCircle.k) < 1e-4 && Math.hypot(ex.x - newCircle.x, ex.y - newCircle.y) < 1e-4) {
            dup = true
            break
          }
        }
        if (dup) continue
        this.circles.push(newCircle)
        // Recurse into three new triples.
        this.recurse(a, b, newCircle, c, depth - 1, minR)
        this.recurse(b, c, newCircle, a, depth - 1, minR)
        this.recurse(a, c, newCircle, b, depth - 1, minR)
        return
      }
    }
  }

  step(): void {}

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, this.width, this.height)
    const cx = this.width / 2
    const cy = this.height / 2
    const scale = Math.min(this.width, this.height) * 0.46

    const stroke = this.params.stroke as boolean
    const fill = this.params.fill as boolean

    // Sort by depth so smaller go on top.
    const sorted = [...this.circles].sort((a, b) => a.depth - b.depth)
    for (const c of sorted) {
      const r = Math.abs(1 / c.k) * scale
      if (r < 0.5) continue
      const x = cx + c.x * scale
      const y = cy + c.y * scale
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      if (fill) {
        const t = Math.min(1, c.depth / 6)
        const hue = (200 + t * 180) % 360
        ctx.fillStyle = `hsla(${hue.toFixed(0)}, 70%, ${(20 + 35 * (1 - t)).toFixed(0)}%, 0.9)`
        ctx.fill()
      }
      if (stroke) {
        ctx.strokeStyle = c.k < 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.35)'
        ctx.lineWidth = c.k < 0 ? 1.5 : 0.6
        ctx.stroke()
      }
    }
    this.dirty = false
  }

  dispose(): void {}
}

interface CC {
  x: number
  y: number
  add(o: CC): CC
}

function cz(x: number, y: number): CC {
  return {
    x,
    y,
    add(o: CC) {
      return cz(this.x + o.x, this.y + o.y)
    },
  }
}
function cmul(a: { x: number; y: number }, b: { x: number; y: number }): CC {
  return cz(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x)
}
function csqrt(a: { x: number; y: number }): CC {
  const r = Math.hypot(a.x, a.y)
  const re = Math.sqrt((r + a.x) / 2)
  const im = Math.sign(a.y || 1) * Math.sqrt((r - a.x) / 2)
  return cz(re, im)
}

export function createApollonianRenderer(): Renderer {
  return new ApollonianRenderer()
}
