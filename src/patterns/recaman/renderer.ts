import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class RecamanRenderer implements Renderer {
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
    const terms = this.params.terms as number
    // Build Recaman sequence.
    const seq: number[] = [0]
    const seen = new Set<number>([0])
    let max = 0
    for (let n = 1; n < terms; n++) {
      const a = seq[n - 1]
      let next = a - n
      if (next < 0 || seen.has(next)) next = a + n
      seq.push(next)
      seen.add(next)
      if (next > max) max = next
    }
    const margin = 20
    const usableW = this.width - margin * 2
    const usableH = this.height - margin * 2
    const scale = usableW / Math.max(1, max)
    const baseY = this.height - margin - 4
    ctx.lineWidth = 1.2
    ctx.strokeStyle = '#dde3ee'
    ctx.beginPath()
    ctx.moveTo(margin, baseY)
    ctx.lineTo(this.width - margin, baseY)
    ctx.stroke()
    // Draw arcs.
    for (let i = 1; i < seq.length; i++) {
      const a = seq[i - 1]
      const b = seq[i]
      const x1 = margin + a * scale
      const x2 = margin + b * scale
      const cx = (x1 + x2) / 2
      const r = Math.abs(x2 - x1) / 2
      if (r < 0.5) continue
      const above = i % 2 === 1
      const t = i / seq.length
      const hue = (t * 320 + 200) % 360
      ctx.strokeStyle = `hsl(${hue}, 75%, 65%)`
      ctx.lineWidth = 1
      ctx.beginPath()
      const yScale = Math.min(1, usableH / (max * scale))
      ctx.ellipse(
        cx,
        baseY,
        r,
        r * yScale,
        0,
        above ? Math.PI : 0,
        above ? 2 * Math.PI : Math.PI,
      )
      ctx.stroke()
    }
    this.dirty = false
  }

  dispose(): void {}
}

export function createRecamanRenderer(): Renderer {
  return new RecamanRenderer()
}
