import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

function collatzPath(n: number, max = 5000): number[] {
  const path: number[] = [n]
  let v = n
  let i = 0
  while (v !== 1 && i < max) {
    v = v % 2 === 0 ? v / 2 : 3 * v + 1
    path.push(v)
    i++
  }
  return path
}

export class CollatzRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
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
    this.params = { ...params }
    this.dirty = true
  }

  reset(): void {
    this.dirty = true
  }

  step(): void {}

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    const variant = this.params.variant as string
    const seeds = this.params.seeds as number
    if (variant === 'tree') {
      this.drawTree(ctx, seeds)
    } else if (variant === 'lines') {
      this.drawLines(ctx, seeds)
    } else {
      this.drawScatter(ctx, seeds)
    }
    this.dirty = false
  }

  private drawLines(ctx: CanvasRenderingContext2D, seeds: number): void {
    let maxLen = 1
    let maxVal = 1
    const paths: number[][] = []
    for (let n = 2; n <= seeds + 1; n++) {
      const p = collatzPath(n)
      paths.push(p)
      if (p.length > maxLen) maxLen = p.length
      for (const v of p) if (v > maxVal) maxVal = v
    }
    const margin = 16
    const yScale = (this.height - margin * 2) / Math.log10(maxVal + 1)
    const xScale = (this.width - margin * 2) / maxLen
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i]
      const hue = (i / paths.length) * 320
      ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.35)`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let k = 0; k < p.length; k++) {
        const x = margin + k * xScale
        const y = this.height - margin - Math.log10(p[k] + 1) * yScale
        if (k === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  private drawScatter(ctx: CanvasRenderingContext2D, seeds: number): void {
    let maxLen = 1
    for (let n = 2; n <= seeds + 1; n++) {
      const p = collatzPath(n)
      if (p.length > maxLen) maxLen = p.length
    }
    const margin = 24
    const xScale = (this.width - margin * 2) / seeds
    const yScale = (this.height - margin * 2) / maxLen
    for (let n = 2; n <= seeds + 1; n++) {
      const p = collatzPath(n)
      const px = margin + (n - 2) * xScale
      const py = this.height - margin - p.length * yScale
      const hue = ((p.length / maxLen) * 280 + 180) % 360
      ctx.fillStyle = `hsl(${hue}, 80%, 65%)`
      ctx.fillRect(px - 0.5, py - 0.5, 1.5, 1.5)
    }
  }

  private drawTree(ctx: CanvasRenderingContext2D, seeds: number): void {
    // Build inverse tree: for each path, draw it back-to-front from 1.
    const cx = this.width / 2
    const cy = this.height / 2
    ctx.lineWidth = 0.8
    for (let n = 2; n <= seeds + 1; n++) {
      const p = collatzPath(n)
      let x = cx
      let y = cy + (this.height / 2 - 30)
      let angle = -Math.PI / 2
      const segLen = Math.min(this.width, this.height) / Math.max(40, p.length)
      const hue = (n / seeds) * 280
      ctx.strokeStyle = `hsla(${hue}, 75%, 60%, 0.18)`
      ctx.beginPath()
      ctx.moveTo(x, y)
      for (let k = p.length - 2; k >= 0; k--) {
        const turn = p[k] % 2 === 0 ? -0.18 : 0.22
        angle += turn
        x += Math.cos(angle) * segLen
        y += Math.sin(angle) * segLen
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  dispose(): void {}
}

export function createCollatzRenderer(): Renderer {
  return new CollatzRenderer()
}
