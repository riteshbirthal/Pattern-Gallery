import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Body {
  x: number
  y: number
  vx: number
  vy: number
  mass: number
  hue: number
  trail: Array<[number, number]>
}

export class NBodyRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private bodies: Body[] = []
  private rng = mulberry32(1)

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
    const reshape =
      params.bodies !== this.params.bodies || params.preset !== this.params.preset
    this.params = { ...params }
    if (reshape) this.reset()
  }

  reset(): void {
    const preset = this.params.preset as string
    this.rng = mulberry32(42)
    if (preset === 'figure8') this.spawnFigure8()
    else if (preset === 'cluster') this.spawnCluster()
    else this.spawnRandom()
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  private spawnFigure8(): void {
    // Chenciner-Montgomery 2000 figure-eight three-body choreography.
    const x1 = 0.97000436
    const y1 = -0.24308753
    const v1x = 0.4662036850
    const v1y = 0.4323657300
    this.bodies = [
      { x: x1, y: y1, vx: v1x, vy: v1y, mass: 1, hue: 200, trail: [] },
      { x: -x1, y: -y1, vx: v1x, vy: v1y, mass: 1, hue: 30, trail: [] },
      { x: 0, y: 0, vx: -2 * v1x, vy: -2 * v1y, mass: 1, hue: 320, trail: [] },
    ]
  }

  private spawnRandom(): void {
    const n = this.params.bodies as number
    this.bodies = []
    for (let i = 0; i < n; i++) {
      const a = this.rng() * Math.PI * 2
      const r = Math.sqrt(this.rng()) * 1.5
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      const speed = 0.5 / Math.sqrt(r + 0.1)
      this.bodies.push({
        x,
        y,
        vx: -Math.sin(a) * speed,
        vy: Math.cos(a) * speed,
        mass: 0.3 + this.rng() * 0.7,
        hue: (i / n) * 320,
        trail: [],
      })
    }
  }

  private spawnCluster(): void {
    const n = this.params.bodies as number
    this.bodies = []
    // One central heavy body + orbiters.
    this.bodies.push({ x: 0, y: 0, vx: 0, vy: 0, mass: 80, hue: 50, trail: [] })
    for (let i = 1; i < n; i++) {
      const a = this.rng() * Math.PI * 2
      const r = 0.5 + this.rng() * 1.5
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      const speed = Math.sqrt(80 / r)
      this.bodies.push({
        x,
        y,
        vx: -Math.sin(a) * speed,
        vy: Math.cos(a) * speed,
        mass: 0.1 + this.rng() * 0.3,
        hue: 200 + this.rng() * 160,
        trail: [],
      })
    }
  }

  step(): void {
    const G = this.params.G as number
    const dt = 0.005
    const eps2 = 0.01
    const substeps = 4
    for (let s = 0; s < substeps; s++) {
      const ax = new Float64Array(this.bodies.length)
      const ay = new Float64Array(this.bodies.length)
      for (let i = 0; i < this.bodies.length; i++) {
        const bi = this.bodies[i]
        for (let j = i + 1; j < this.bodies.length; j++) {
          const bj = this.bodies[j]
          const dx = bj.x - bi.x
          const dy = bj.y - bi.y
          const r2 = dx * dx + dy * dy + eps2
          const inv = 1 / (r2 * Math.sqrt(r2))
          const fx = G * dx * inv
          const fy = G * dy * inv
          ax[i] += fx * bj.mass
          ay[i] += fy * bj.mass
          ax[j] -= fx * bi.mass
          ay[j] -= fy * bi.mass
        }
      }
      for (let i = 0; i < this.bodies.length; i++) {
        const b = this.bodies[i]
        b.vx += ax[i] * dt
        b.vy += ay[i] * dt
        b.x += b.vx * dt
        b.y += b.vy * dt
      }
    }
    for (const b of this.bodies) {
      b.trail.push([b.x, b.y])
      if (b.trail.length > 400) b.trail.shift()
    }
  }

  draw(): void {
    const ctx = this.ctx2d
    ctx.fillStyle = 'rgba(11, 13, 18, 0.12)'
    ctx.fillRect(0, 0, this.width, this.height)
    const cx = this.width / 2
    const cy = this.height / 2
    const scale = Math.min(this.width, this.height) / 5
    for (const b of this.bodies) {
      ctx.strokeStyle = `hsla(${b.hue}, 80%, 65%, 0.45)`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i < b.trail.length; i++) {
        const [x, y] = b.trail[i]
        const px = cx + x * scale
        const py = cy + y * scale
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.fillStyle = `hsl(${b.hue}, 90%, 75%)`
      ctx.beginPath()
      ctx.arc(cx + b.x * scale, cy + b.y * scale, 1.5 + Math.sqrt(b.mass), 0, Math.PI * 2)
      ctx.fill()
    }
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

export function createNBodyRenderer(): Renderer {
  return new NBodyRenderer()
}
