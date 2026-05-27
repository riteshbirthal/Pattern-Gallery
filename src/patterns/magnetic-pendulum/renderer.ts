import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Magnet {
  x: number
  y: number
  hue: number
}

export class MagneticPendulumRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private imageData!: ImageData
  private magnets: Magnet[] = []
  private rowsDone = 0
  private rowsPerStep = 4

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.imageData = this.ctx2d.createImageData(this.width, this.height)
    this.reset()
  }

  setParams(params: ParamValues): void {
    const reshape =
      params.magnets !== this.params.magnets ||
      params.friction !== this.params.friction ||
      params.height !== this.params.height
    this.params = { ...params }
    if (reshape) this.reset()
  }

  reset(): void {
    const n = this.params.magnets as number
    this.magnets = []
    const palette = [0, 130, 250, 50, 200, 320, 90, 280]
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2
      this.magnets.push({ x: Math.cos(a) * 1.0, y: Math.sin(a) * 1.0, hue: palette[i % palette.length] })
    }
    const data = this.imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 11
      data[i + 1] = 13
      data[i + 2] = 18
      data[i + 3] = 255
    }
    this.rowsDone = 0
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  step(): void {
    if (this.rowsDone >= this.height) return
    const k = this.params.friction as number
    const h = this.params.height as number
    const magnets = this.magnets
    const data = this.imageData.data
    const scale = 3 / Math.min(this.width, this.height)
    const cx = this.width / 2
    const cy = this.height / 2
    const dt = 0.05
    const maxSteps = 1500
    const stopVel = 0.05
    for (let row = 0; row < this.rowsPerStep && this.rowsDone < this.height; row++, this.rowsDone++) {
      const py = this.rowsDone
      for (let px = 0; px < this.width; px++) {
        let x = (px - cx) * scale
        let y = (py - cy) * scale
        let vx = 0
        let vy = 0
        let captured = -1
        for (let s = 0; s < maxSteps; s++) {
          // Restoring spring (gravity-like) toward origin.
          let ax = -0.5 * x - k * vx
          let ay = -0.5 * y - k * vy
          for (const m of magnets) {
            const dx = m.x - x
            const dy = m.y - y
            const r2 = dx * dx + dy * dy + h * h
            const r3 = r2 * Math.sqrt(r2)
            ax += dx / r3
            ay += dy / r3
          }
          vx += ax * dt
          vy += ay * dt
          x += vx * dt
          y += vy * dt
          // Check capture.
          if (vx * vx + vy * vy < stopVel * stopVel) {
            let best = -1
            let bestD = Infinity
            for (let mi = 0; mi < magnets.length; mi++) {
              const m = magnets[mi]
              const dd = (m.x - x) ** 2 + (m.y - y) ** 2
              if (dd < bestD) {
                bestD = dd
                best = mi
              }
            }
            if (bestD < 0.05) {
              captured = best
              break
            }
          }
        }
        const di = (py * this.width + px) * 4
        if (captured >= 0) {
          const m = magnets[captured]
          const rgb = hsl(m.hue, 75, 55)
          data[di] = rgb[0]
          data[di + 1] = rgb[1]
          data[di + 2] = rgb[2]
        } else {
          data[di] = 30
          data[di + 1] = 30
          data[di + 2] = 38
        }
        data[di + 3] = 255
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  draw(): void {
    // Overlay magnet markers.
    const ctx = this.ctx2d
    const cx = this.width / 2
    const cy = this.height / 2
    const scale = Math.min(this.width, this.height) / 3
    for (const m of this.magnets) {
      ctx.fillStyle = `hsl(${m.hue}, 90%, 75%)`
      ctx.strokeStyle = '#0b0d12'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx + m.x * scale, cy + m.y * scale, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
  }

  dispose(): void {}
}

function hsl(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

export function createMagneticPendulumRenderer(): Renderer {
  return new MagneticPendulumRenderer()
}
