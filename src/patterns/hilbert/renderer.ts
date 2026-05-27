import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class HilbertRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private points: { x: number; y: number }[] = []
  private drawnUpTo = 0
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
    this.reset()
  }

  reset(): void {
    this.points = []
    this.drawnUpTo = 0
    const curve = this.params.curve as string
    const order = this.params.order as number
    if (curve === 'hilbert') this.buildHilbert(order)
    else if (curve === 'peano') this.buildPeano(order)
    else if (curve === 'moore') this.buildMoore(order)
    this.ctx2d.fillStyle = '#0c0e14'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
    this.dirty = true
  }

  private buildHilbert(order: number) {
    const n = 1 << order // 2^order
    const total = n * n
    const margin = 20
    const sz = Math.min(this.width, this.height) - margin * 2
    const cellSize = sz / n
    const ox = (this.width - sz) / 2 + cellSize / 2
    const oy = (this.height - sz) / 2 + cellSize / 2
    // Compute Hilbert d -> (x, y) for d = 0..total-1.
    for (let d = 0; d < total; d++) {
      let rx: number, ry: number
      let x = 0
      let y = 0
      let t = d
      for (let s = 1; s < n; s <<= 1) {
        rx = 1 & (t / 2)
        ry = 1 & (t ^ rx)
        if (ry === 0) {
          if (rx === 1) {
            x = s - 1 - x
            y = s - 1 - y
          }
          // Swap x and y.
          const tmp = x
          x = y
          y = tmp
        }
        x += s * rx
        y += s * ry
        t = Math.floor(t / 4)
      }
      this.points.push({ x: ox + x * cellSize, y: oy + y * cellSize })
    }
  }

  private buildPeano(order: number) {
    const n = Math.pow(3, order)
    const margin = 20
    const sz = Math.min(this.width, this.height) - margin * 2
    const cellSize = sz / n
    const ox = (this.width - sz) / 2 + cellSize / 2
    const oy = (this.height - sz) / 2 + cellSize / 2
    // Peano L-system: variable F, axiom F, rules F → F+F-F-F-F+F+F+F-F at angle 90°.
    // Standard Peano substitution: X → XFYFX+F+YFXFY-F-XFYFX, Y → YFXFY-F-XFYFX+F+YFXFY at 90°.
    let s = 'X'
    for (let i = 0; i < order; i++) {
      let next = ''
      for (const ch of s) {
        if (ch === 'X') next += 'XFYFX+F+YFXFY-F-XFYFX'
        else if (ch === 'Y') next += 'YFXFY-F-XFYFX+F+YFXFY'
        else next += ch
      }
      s = next
    }
    let x = ox
    let y = oy
    let dir = 0 // 0=E, 1=S, 2=W, 3=N (using screen coords, +y down)
    const dxs = [1, 0, -1, 0]
    const dys = [0, 1, 0, -1]
    this.points.push({ x, y })
    for (const ch of s) {
      if (ch === 'F') {
        x += dxs[dir] * cellSize
        y += dys[dir] * cellSize
        this.points.push({ x, y })
      } else if (ch === '+') dir = (dir + 1) & 3
      else if (ch === '-') dir = (dir + 3) & 3
    }
  }

  private buildMoore(order: number) {
    // Moore curve: closed Hilbert variant. For each of 4 quadrants we use a Hilbert subcurve, joined into a loop.
    // For visualization we generate it via L-system: axiom LFL+F+LFL, rules L → -RF+LFL+FR-, R → +LF-RFR-FL+ at 90°.
    const n = 1 << order
    const margin = 20
    const sz = Math.min(this.width, this.height) - margin * 2
    const cellSize = sz / n
    const ox = (this.width - sz) / 2 + cellSize / 2
    const oy = (this.height - sz) / 2 + cellSize / 2
    let s = 'LFL+F+LFL'
    for (let i = 1; i < order; i++) {
      let next = ''
      for (const ch of s) {
        if (ch === 'L') next += '-RF+LFL+FR-'
        else if (ch === 'R') next += '+LF-RFR-FL+'
        else next += ch
      }
      s = next
    }
    let x = ox
    let y = oy + (n - 1) * cellSize
    let dir = 3 // facing up
    const dxs = [1, 0, -1, 0]
    const dys = [0, 1, 0, -1]
    this.points.push({ x, y })
    for (const ch of s) {
      if (ch === 'F') {
        x += dxs[dir] * cellSize
        y += dys[dir] * cellSize
        this.points.push({ x, y })
      } else if (ch === '+') dir = (dir + 1) & 3
      else if (ch === '-') dir = (dir + 3) & 3
    }
  }

  step(): void {
    if (this.drawnUpTo >= this.points.length - 1) return
    const speed = this.params.animSpeed as number
    this.drawnUpTo = Math.min(this.points.length - 1, this.drawnUpTo + Math.max(1, Math.floor(speed)))
    this.dirty = true
  }

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    if (this.points.length < 2) return
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const colorByT = this.params.colorByT as boolean
    if (colorByT) {
      for (let i = 1; i <= this.drawnUpTo; i++) {
        const t = i / (this.points.length - 1)
        const hue = (t * 320) % 360
        ctx.strokeStyle = `hsl(${hue}, 75%, 60%)`
        ctx.beginPath()
        ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y)
        ctx.lineTo(this.points[i].x, this.points[i].y)
        ctx.stroke()
      }
    } else {
      ctx.strokeStyle = '#dde3ee'
      ctx.beginPath()
      ctx.moveTo(this.points[0].x, this.points[0].y)
      for (let i = 1; i <= this.drawnUpTo; i++) ctx.lineTo(this.points[i].x, this.points[i].y)
      ctx.stroke()
    }
    this.dirty = false
  }

  dispose(): void {}
}

export function createHilbertRenderer(): Renderer {
  return new HilbertRenderer()
}
