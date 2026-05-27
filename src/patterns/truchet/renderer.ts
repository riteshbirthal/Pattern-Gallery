import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

export class TruchetRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private orientations: number[] = []
  private cols = 0
  private rows = 0

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.regenerate()
    this.draw()
  }

  setParams(params: ParamValues): void {
    const fullRedraw =
      (params.tileSize as number) !== (this.params.tileSize as number) ||
      (params.style as string) !== (this.params.style as string) ||
      (params.palette as string) !== (this.params.palette as string)
    this.params = { ...params }
    if (fullRedraw) {
      this.regenerate()
    }
    this.draw()
  }

  reset(): void {
    this.regenerate()
    this.draw()
  }

  private regenerate() {
    const tileSize = this.params.tileSize as number
    this.cols = Math.ceil(this.width / tileSize)
    this.rows = Math.ceil(this.height / tileSize)
    this.orientations = []
    const variants = (this.params.style as string) === 'arcs' ? 2 : 4
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.orientations.push(Math.floor(Math.random() * variants))
    }
  }

  step(): void {}

  draw(): void {
    const ctx = this.ctx2d
    const tileSize = this.params.tileSize as number
    const style = this.params.style as string
    const palette = this.params.palette as string
    const colors = paletteFor(palette)
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.strokeStyle = colors.fg
    ctx.lineWidth = Math.max(2, tileSize / 8)
    ctx.lineCap = 'round'

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const orient = this.orientations[row * this.cols + col]
        const x = col * tileSize
        const y = row * tileSize
        if (style === 'arcs') drawArcs(ctx, x, y, tileSize, orient)
        else if (style === 'lines') drawLines(ctx, x, y, tileSize, orient)
        else if (style === 'triangles') drawTriangles(ctx, x, y, tileSize, orient, colors)
      }
    }
  }

  dispose(): void {}
}

function drawArcs(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, o: number) {
  const r = s / 2
  ctx.beginPath()
  if (o === 0) {
    ctx.arc(x, y, r, 0, Math.PI / 2)
    ctx.moveTo(x + s, y + s)
    ctx.arc(x + s, y + s, r, Math.PI, (Math.PI * 3) / 2)
  } else {
    ctx.arc(x + s, y, r, Math.PI / 2, Math.PI)
    ctx.moveTo(x, y + s)
    ctx.arc(x, y + s, r, (Math.PI * 3) / 2, Math.PI * 2)
  }
  ctx.stroke()
}

function drawLines(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, o: number) {
  ctx.beginPath()
  if (o === 0) {
    ctx.moveTo(x, y + s / 2)
    ctx.lineTo(x + s, y + s / 2)
  } else if (o === 1) {
    ctx.moveTo(x + s / 2, y)
    ctx.lineTo(x + s / 2, y + s)
  } else if (o === 2) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + s, y + s)
  } else {
    ctx.moveTo(x + s, y)
    ctx.lineTo(x, y + s)
  }
  ctx.stroke()
}

function drawTriangles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  o: number,
  colors: { bg: string; fg: string },
) {
  ctx.fillStyle = colors.fg
  ctx.beginPath()
  if (o === 0) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + s, y)
    ctx.lineTo(x, y + s)
  } else if (o === 1) {
    ctx.moveTo(x + s, y)
    ctx.lineTo(x + s, y + s)
    ctx.lineTo(x, y)
  } else if (o === 2) {
    ctx.moveTo(x + s, y + s)
    ctx.lineTo(x, y + s)
    ctx.lineTo(x + s, y)
  } else {
    ctx.moveTo(x, y + s)
    ctx.lineTo(x, y)
    ctx.lineTo(x + s, y + s)
  }
  ctx.closePath()
  ctx.fill()
}

function paletteFor(name: string): { bg: string; fg: string } {
  if (name === 'blueprint') return { bg: '#0f1a2e', fg: '#7fb8ff' }
  if (name === 'mono') return { bg: '#0b0d12', fg: '#e0e3ec' }
  if (name === 'rose') return { bg: '#2a0e1c', fg: '#ff8da3' }
  return { bg: '#0b0d12', fg: '#7fdfff' }
}

export function createTruchetRenderer(): Renderer {
  return new TruchetRenderer()
}
