import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Site {
  x: number
  y: number
  vx: number
  vy: number
  hue: number
}

export class VoronoiRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private sites: Site[] = []
  private params!: ParamValues
  private imageData!: ImageData
  private resolution = 2

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.imageData = c.createImageData(this.width, this.height)
    this.spawnSites()
  }

  private spawnSites() {
    const count = this.params.sites as number
    this.sites = []
    for (let i = 0; i < count; i++) {
      this.sites.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hue: i / count,
      })
    }
  }

  setParams(params: ParamValues): void {
    const respawn = (params.sites as number) !== (this.params.sites as number)
    this.params = { ...params }
    if (respawn) this.spawnSites()
  }

  reset(): void {
    this.spawnSites()
    this.draw()
  }

  step(): void {
    if (!this.params.move) return
    for (const s of this.sites) {
      s.x += s.vx
      s.y += s.vy
      if (s.x < 0 || s.x > this.width) s.vx *= -1
      if (s.y < 0 || s.y > this.height) s.vy *= -1
    }
  }

  draw(): void {
    const data = this.imageData.data
    const w = this.width
    const h = this.height
    const metric = this.params.metric as string
    const showEdges = this.params.edges as boolean
    const palette = this.params.palette as string
    const res = this.resolution
    const sites = this.sites

    for (let y = 0; y < h; y += res) {
      for (let x = 0; x < w; x += res) {
        let bestI = 0
        let best = Infinity
        let secondBest = Infinity
        for (let i = 0; i < sites.length; i++) {
          const dx = x - sites[i].x
          const dy = y - sites[i].y
          let d: number
          if (metric === 'manhattan') d = Math.abs(dx) + Math.abs(dy)
          else if (metric === 'chebyshev') d = Math.max(Math.abs(dx), Math.abs(dy))
          else d = dx * dx + dy * dy
          if (d < best) {
            secondBest = best
            best = d
            bestI = i
          } else if (d < secondBest) {
            secondBest = d
          }
        }
        const site = sites[bestI]
        let r: number, g: number, b: number
        if (palette === 'pastel') {
          const c = hslToRgb(site.hue, 0.55, 0.7)
          r = c[0]
          g = c[1]
          b = c[2]
        } else if (palette === 'mono') {
          const v = Math.floor(40 + site.hue * 200)
          r = v
          g = v
          b = v
        } else {
          const c = hslToRgb(site.hue, 0.85, 0.55)
          r = c[0]
          g = c[1]
          b = c[2]
        }
        let edgeFactor = 1
        if (showEdges) {
          const diff = Math.sqrt(secondBest) - Math.sqrt(best)
          if (diff < 1.5) edgeFactor = 0.1
        }
        r = Math.floor(r * edgeFactor)
        g = Math.floor(g * edgeFactor)
        b = Math.floor(b * edgeFactor)
        // Fill block.
        for (let dy = 0; dy < res && y + dy < h; dy++) {
          for (let dx = 0; dx < res && x + dx < w; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4
            data[idx] = r
            data[idx + 1] = g
            data[idx + 2] = b
            data[idx + 3] = 255
          }
        }
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
  }

  dispose(): void {}
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export function createVoronoiRenderer(): Renderer {
  return new VoronoiRenderer()
}
