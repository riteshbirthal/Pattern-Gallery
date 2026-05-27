import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class HeighwayDragonRenderer implements Renderer {
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

  private buildTurns(order: number): number[] {
    // Each new level: take previous turns T, and construct T + [+1] + reverse(map(-)(T))
    let turns: number[] = []
    for (let i = 0; i < order; i++) {
      const reversed = []
      for (let k = turns.length - 1; k >= 0; k--) reversed.push(-turns[k])
      turns = [...turns, 1, ...reversed]
    }
    return turns
  }

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    const variant = this.params.variant as string
    const order = this.params.order as number
    const showColor = this.params.colorByT as boolean
    const turns = this.buildTurns(order)
    // Walk and find bounds first.
    let dir = variant === 'twin' ? 0 : 0
    let x = 0
    let y = 0
    let minX = 0
    let maxX = 0
    let minY = 0
    let maxY = 0
    const angle = variant === 'terdragon' ? (2 * Math.PI) / 3 : Math.PI / 2
    const positions: { x: number; y: number }[] = [{ x, y }]
    for (let i = 0; i < turns.length + 1; i++) {
      const dx = Math.cos(dir)
      const dy = Math.sin(dir)
      x += dx
      y += dy
      positions.push({ x, y })
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
      if (i < turns.length) dir += turns[i] * angle
    }
    // Twin dragon: also draw the dragon mirrored from the end.
    if (variant === 'twin') {
      const start = positions[positions.length - 1]
      let tdir = Math.PI
      let tx = start.x
      let ty = start.y
      for (let i = 0; i < turns.length + 1; i++) {
        const dx = Math.cos(tdir)
        const dy = Math.sin(tdir)
        tx += dx
        ty += dy
        positions.push({ x: tx, y: ty })
        if (tx < minX) minX = tx
        if (tx > maxX) maxX = tx
        if (ty < minY) minY = ty
        if (ty > maxY) maxY = ty
        if (i < turns.length) tdir += turns[i] * angle
      }
    }
    const margin = 30
    const sx = (this.width - margin * 2) / (maxX - minX || 1)
    const sy = (this.height - margin * 2) / (maxY - minY || 1)
    const s = Math.min(sx, sy)
    const ox = margin - minX * s + (this.width - margin * 2 - (maxX - minX) * s) / 2
    const oy = margin - minY * s + (this.height - margin * 2 - (maxY - minY) * s) / 2
    if (showColor) {
      for (let i = 1; i < positions.length; i++) {
        const t = i / positions.length
        ctx.strokeStyle = `hsl(${(t * 320) % 360}, 75%, 60%)`
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(positions[i - 1].x * s + ox, positions[i - 1].y * s + oy)
        ctx.lineTo(positions[i].x * s + ox, positions[i].y * s + oy)
        ctx.stroke()
      }
    } else {
      ctx.strokeStyle = '#dde3ee'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(positions[0].x * s + ox, positions[0].y * s + oy)
      for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i].x * s + ox, positions[i].y * s + oy)
      }
      ctx.stroke()
    }
    this.dirty = false
  }

  dispose(): void {}
}

export function createHeighwayDragonRenderer(): Renderer {
  return new HeighwayDragonRenderer()
}
