import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Particle {
  x: number
  y: number
  z: number
  px: number
  py: number
  hue: number
}

export class RosslerRenderer implements Renderer {
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
      const x = (Math.random() - 0.5) * 4 - 4
      const y = (Math.random() - 0.5) * 4
      const z = Math.random() * 0.4
      const proj = project(x, y, z, this.width, this.height)
      this.particles.push({ x, y, z, px: proj.x, py: proj.y, hue: i / count })
    }
  }

  step(): void {
    const ctx = this.ctx2d
    const a = this.params.a as number
    const b = this.params.b as number
    const c = this.params.c as number
    const fade = this.params.fade as number
    const dt = 0.02
    ctx.fillStyle = `rgba(11, 13, 18, ${fade})`
    ctx.fillRect(0, 0, this.width, this.height)
    for (const p of this.particles) {
      // RK4
      const k1 = rossler(p.x, p.y, p.z, a, b, c)
      const k2 = rossler(p.x + (k1.dx * dt) / 2, p.y + (k1.dy * dt) / 2, p.z + (k1.dz * dt) / 2, a, b, c)
      const k3 = rossler(p.x + (k2.dx * dt) / 2, p.y + (k2.dy * dt) / 2, p.z + (k2.dz * dt) / 2, a, b, c)
      const k4 = rossler(p.x + k3.dx * dt, p.y + k3.dy * dt, p.z + k3.dz * dt, a, b, c)
      p.x += ((k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx) * dt) / 6
      p.y += ((k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy) * dt) / 6
      p.z += ((k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz) * dt) / 6

      const proj = project(p.x, p.y, p.z, this.width, this.height)
      ctx.strokeStyle = hslString(p.hue * 360, 75, 65)
      ctx.lineWidth = 1.1
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

function rossler(x: number, y: number, z: number, a: number, b: number, c: number) {
  return {
    dx: -y - z,
    dy: x + a * y,
    dz: b + z * (x - c),
  }
}

function project(x: number, y: number, z: number, w: number, h: number) {
  // Rössler typical bounds: x ~ [-10, 12], y ~ [-12, 10], z ~ [0, 25]
  const scale = Math.min(w, h) / 30
  return {
    x: w / 2 + x * scale,
    y: h / 2 - z * scale * 0.5 + y * scale * 0.4,
  }
}

function hslString(h: number, s: number, l: number): string {
  return `hsl(${h.toFixed(0)},${s}%,${l}%)`
}

export function createRosslerRenderer(): Renderer {
  return new RosslerRenderer()
}
