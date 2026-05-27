import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Particle {
  x: number
  y: number
  z: number
  px: number
  py: number
  hue: number
}

export class HalvorsenRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private particles: Particle[] = []

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
    const respawn = (params.particles as number) !== (this.params.particles as number)
    this.params = { ...params }
    if (respawn) this.spawn()
  }

  reset(): void {
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
    this.spawn()
  }

  private spawn() {
    const count = this.params.particles as number
    this.particles = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 2
      const y = (Math.random() - 0.5) * 2
      const z = (Math.random() - 0.5) * 2
      const proj = project(x, y, z, this.width, this.height)
      this.particles.push({ x, y, z, px: proj.x, py: proj.y, hue: i / count })
    }
  }

  step(): void {
    const ctx = this.ctx2d
    const a = this.params.a as number
    const fade = this.params.fade as number
    const dt = 0.005
    ctx.fillStyle = `rgba(11, 13, 18, ${fade})`
    ctx.fillRect(0, 0, this.width, this.height)
    for (const p of this.particles) {
      const k1 = halvorsen(p.x, p.y, p.z, a)
      const k2 = halvorsen(p.x + (k1.dx * dt) / 2, p.y + (k1.dy * dt) / 2, p.z + (k1.dz * dt) / 2, a)
      const k3 = halvorsen(p.x + (k2.dx * dt) / 2, p.y + (k2.dy * dt) / 2, p.z + (k2.dz * dt) / 2, a)
      const k4 = halvorsen(p.x + k3.dx * dt, p.y + k3.dy * dt, p.z + k3.dz * dt, a)
      p.x += ((k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx) * dt) / 6
      p.y += ((k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy) * dt) / 6
      p.z += ((k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz) * dt) / 6
      const proj = project(p.x, p.y, p.z, this.width, this.height)
      ctx.strokeStyle = `hsl(${(p.hue * 360).toFixed(0)},75%,62%)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(p.px, p.py)
      ctx.lineTo(proj.x, proj.y)
      ctx.stroke()
      p.px = proj.x
      p.py = proj.y
    }
  }

  draw(): void {}

  dispose(): void {
    this.particles = []
  }
}

function halvorsen(x: number, y: number, z: number, a: number) {
  return {
    dx: -a * x - 4 * y - 4 * z - y * y,
    dy: -a * y - 4 * z - 4 * x - z * z,
    dz: -a * z - 4 * x - 4 * y - x * x,
  }
}

function project(x: number, y: number, z: number, w: number, h: number) {
  const scale = Math.min(w, h) / 22
  // Slight isometric view.
  return {
    x: w / 2 + (x - z) * scale * 0.7,
    y: h / 2 + (y * 0.8 + (x + z) * 0.3) * scale,
  }
}

export function createHalvorsenRenderer(): Renderer {
  return new HalvorsenRenderer()
}
