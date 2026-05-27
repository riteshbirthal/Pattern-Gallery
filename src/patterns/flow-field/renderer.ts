import { createNoise3D, type NoiseFunction3D } from 'simplex-noise'
import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Particle {
  x: number
  y: number
  px: number
  py: number
  life: number
}

const MAX_LIFE = 600

export class FlowFieldRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private noise!: NoiseFunction3D
  private particles: Particle[] = []
  private params!: ParamValues
  private z = 0

  init(ctx: RendererContext): void {
    const ctx2d = ctx.canvas.getContext('2d', { alpha: false })
    if (!ctx2d) throw new Error('2D context unavailable')
    this.ctx2d = ctx2d
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.noise = createNoise3D(seededRandom(42))
    this.reset()
  }

  setParams(params: ParamValues): void {
    const countChanged = (params.particles as number) !== (this.params?.particles as number)
    this.params = { ...params }
    if (countChanged) this.spawnParticles()
  }

  reset(): void {
    this.ctx2d.fillStyle = '#0b0d12'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
    this.z = 0
    this.spawnParticles()
  }

  private spawnParticles() {
    const count = this.params.particles as number
    this.particles = []
    for (let i = 0; i < count; i++) {
      this.particles.push(this.makeParticle())
    }
  }

  private makeParticle(): Particle {
    const x = Math.random() * this.width
    const y = Math.random() * this.height
    return { x, y, px: x, py: y, life: Math.random() * MAX_LIFE }
  }

  step(): void {
    const ctx = this.ctx2d
    const w = this.width
    const h = this.height
    const scale = (this.params.noiseScale as number) / 1000
    const speed = this.params.speed as number
    const fade = this.params.fade as number
    const palette = this.params.palette as string

    // Trail fade — overlay translucent dark rect.
    ctx.fillStyle = `rgba(11, 13, 18, ${fade})`
    ctx.fillRect(0, 0, w, h)

    ctx.lineWidth = 1
    for (const p of this.particles) {
      const angle = this.noise(p.x * scale, p.y * scale, this.z) * Math.PI * 2
      p.px = p.x
      p.py = p.y
      p.x += Math.cos(angle) * speed
      p.y += Math.sin(angle) * speed
      p.life++

      const offBounds = p.x < 0 || p.x > w || p.y < 0 || p.y > h
      if (offBounds || p.life > MAX_LIFE) {
        Object.assign(p, this.makeParticle())
        continue
      }

      ctx.strokeStyle = colorAt(angle, p.life / MAX_LIFE, palette)
      ctx.beginPath()
      ctx.moveTo(p.px, p.py)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }

    this.z += 0.001
  }

  draw(): void {
    // step() already draws each frame.
  }

  dispose(): void {
    this.particles = []
  }
}

function colorAt(angle: number, lifeT: number, palette: string): string {
  // Normalize angle to [0,1].
  const t = ((angle / (Math.PI * 2)) + 1) % 1
  const alpha = Math.max(0.05, 0.7 * (1 - lifeT))
  if (palette === 'aurora') {
    const r = Math.floor(40 + 80 * t)
    const g = Math.floor(180 + 60 * (1 - t))
    const b = Math.floor(140 + 100 * t)
    return `rgba(${r},${g},${b},${alpha})`
  }
  if (palette === 'sunset') {
    const r = Math.floor(220 + 30 * Math.sin(angle))
    const g = Math.floor(80 + 100 * t)
    const b = Math.floor(100 + 80 * (1 - t))
    return `rgba(${r},${g},${b},${alpha})`
  }
  // mono
  const v = Math.floor(180 + 50 * t)
  return `rgba(${v},${v},${v},${alpha})`
}

/** Seeded PRNG so initial noise field is reproducible. */
function seededRandom(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

export function createFlowFieldRenderer(): Renderer {
  return new FlowFieldRenderer()
}
