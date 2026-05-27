import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Boid {
  x: number
  y: number
  vx: number
  vy: number
}

export class BoidsRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private boids: Boid[] = []

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
    const respawn = (params.count as number) !== (this.params.count as number)
    this.params = { ...params }
    if (respawn) this.spawn()
  }

  reset(): void {
    this.spawn()
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  private spawn() {
    const n = this.params.count as number
    this.boids = []
    const speed = 1.5
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      this.boids.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
      })
    }
  }

  step(): void {
    const sepRadius = this.params.sepRadius as number
    const visRadius = this.params.visRadius as number
    const sepW = this.params.separation as number
    const aliW = this.params.alignment as number
    const cohW = this.params.cohesion as number
    const maxSpeed = this.params.maxSpeed as number
    const w = this.width
    const h = this.height
    const sepR2 = sepRadius * sepRadius
    const visR2 = visRadius * visRadius
    const N = this.boids.length

    for (let i = 0; i < N; i++) {
      const b = this.boids[i]
      let sx = 0,
        sy = 0
      let avx = 0,
        avy = 0
      let cx = 0,
        cy = 0
      let visN = 0
      let sepN = 0
      for (let j = 0; j < N; j++) {
        if (j === i) continue
        const o = this.boids[j]
        let dx = o.x - b.x
        let dy = o.y - b.y
        // Toroidal wrap.
        if (dx > w / 2) dx -= w
        else if (dx < -w / 2) dx += w
        if (dy > h / 2) dy -= h
        else if (dy < -h / 2) dy += h
        const d2 = dx * dx + dy * dy
        if (d2 < visR2) {
          avx += o.vx
          avy += o.vy
          cx += b.x + dx
          cy += b.y + dy
          visN++
          if (d2 < sepR2 && d2 > 0) {
            sx -= dx / d2
            sy -= dy / d2
            sepN++
          }
        }
      }
      let ax = 0,
        ay = 0
      if (sepN > 0) {
        ax += sx * sepW
        ay += sy * sepW
      }
      if (visN > 0) {
        ax += ((avx / visN) - b.vx) * aliW * 0.05
        ay += ((avy / visN) - b.vy) * aliW * 0.05
        ax += ((cx / visN) - b.x) * cohW * 0.0005
        ay += ((cy / visN) - b.y) * cohW * 0.0005
      }
      b.vx += ax
      b.vy += ay
      const sp = Math.hypot(b.vx, b.vy)
      if (sp > maxSpeed) {
        b.vx = (b.vx / sp) * maxSpeed
        b.vy = (b.vy / sp) * maxSpeed
      }
      b.x += b.vx
      b.y += b.vy
      if (b.x < 0) b.x += w
      else if (b.x >= w) b.x -= w
      if (b.y < 0) b.y += h
      else if (b.y >= h) b.y -= h
    }
  }

  draw(): void {
    const ctx = this.ctx2d
    ctx.fillStyle = 'rgba(11, 13, 18, 0.25)'
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.fillStyle = '#6ec1ff'
    for (const b of this.boids) {
      const a = Math.atan2(b.vy, b.vx)
      const len = 8
      ctx.beginPath()
      ctx.moveTo(b.x + Math.cos(a) * len, b.y + Math.sin(a) * len)
      ctx.lineTo(b.x + Math.cos(a + 2.5) * len * 0.5, b.y + Math.sin(a + 2.5) * len * 0.5)
      ctx.lineTo(b.x + Math.cos(a - 2.5) * len * 0.5, b.y + Math.sin(a - 2.5) * len * 0.5)
      ctx.closePath()
      ctx.fill()
    }
  }

  dispose(): void {
    this.boids = []
  }
}

export function createBoidsRenderer(): Renderer {
  return new BoidsRenderer()
}
