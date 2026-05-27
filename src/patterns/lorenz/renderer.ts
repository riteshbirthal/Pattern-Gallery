import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Particle {
  x: number
  y: number
  z: number
  px: number
  py: number
  hue: number
}

export class LorenzRenderer implements Renderer {
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
      const y = (Math.random() - 0.5) * 2 + 1
      const z = (Math.random() - 0.5) * 2 + 20
      const proj = project(x, y, z, this.width, this.height)
      this.particles.push({ x, y, z, px: proj.x, py: proj.y, hue: i / count })
    }
  }

  step(): void {
    const ctx = this.ctx2d
    const sigma = this.params.sigma as number
    const rho = this.params.rho as number
    const beta = this.params.beta as number
    const fade = this.params.fade as number
    const dt = 0.005
    // Trail fade.
    ctx.fillStyle = `rgba(11, 13, 18, ${fade})`
    ctx.fillRect(0, 0, this.width, this.height)

    for (const p of this.particles) {
      // RK4 step.
      const k1 = lorenz(p.x, p.y, p.z, sigma, rho, beta)
      const k2 = lorenz(
        p.x + (k1.dx * dt) / 2,
        p.y + (k1.dy * dt) / 2,
        p.z + (k1.dz * dt) / 2,
        sigma,
        rho,
        beta,
      )
      const k3 = lorenz(
        p.x + (k2.dx * dt) / 2,
        p.y + (k2.dy * dt) / 2,
        p.z + (k2.dz * dt) / 2,
        sigma,
        rho,
        beta,
      )
      const k4 = lorenz(
        p.x + k3.dx * dt,
        p.y + k3.dy * dt,
        p.z + k3.dz * dt,
        sigma,
        rho,
        beta,
      )
      p.x += ((k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx) * dt) / 6
      p.y += ((k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy) * dt) / 6
      p.z += ((k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz) * dt) / 6

      const proj = project(p.x, p.y, p.z, this.width, this.height)
      ctx.strokeStyle = hslString(p.hue * 360, 75, 65)
      ctx.lineWidth = 1.2
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

function lorenz(x: number, y: number, z: number, sigma: number, rho: number, beta: number) {
  return {
    dx: sigma * (y - x),
    dy: x * (rho - z) - y,
    dz: x * y - beta * z,
  }
}

function project(x: number, y: number, z: number, w: number, h: number) {
  // Simple isometric-ish projection of (x, y, z) ∈ ~ [-30, 30] × [-30, 30] × [0, 50]
  const scale = Math.min(w, h) / 60
  return {
    x: w / 2 + x * scale,
    y: h / 2 - (z - 25) * scale * 0.85 + y * scale * 0.15,
  }
}

function hslString(h: number, s: number, l: number): string {
  return `hsl(${h.toFixed(0)},${s}%,${l}%)`
}

export function createLorenzRenderer(): Renderer {
  return new LorenzRenderer()
}
