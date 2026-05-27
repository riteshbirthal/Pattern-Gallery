import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface LSystemDef {
  axiom: string
  rules: Record<string, string>
  angle: number
  startAngle: number
}

const PRESETS: Record<string, LSystemDef> = {
  koch: {
    axiom: 'F',
    rules: { F: 'F+F-F-F+F' },
    angle: 90,
    startAngle: 0,
  },
  'koch-snowflake': {
    axiom: 'F++F++F',
    rules: { F: 'F-F++F-F' },
    angle: 60,
    startAngle: 0,
  },
  dragon: {
    axiom: 'FX',
    rules: { X: 'X+YF+', Y: '-FX-Y' },
    angle: 90,
    startAngle: 0,
  },
  hilbert: {
    axiom: 'A',
    rules: { A: '+BF-AFA-FB+', B: '-AF+BFB+FA-' },
    angle: 90,
    startAngle: 0,
  },
  'sierpinski-arrowhead': {
    axiom: 'A',
    rules: { A: 'B-A-B', B: 'A+B+A' },
    angle: 60,
    startAngle: 0,
  },
  plant: {
    axiom: 'X',
    rules: {
      X: 'F+[[X]-X]-F[-FX]+X',
      F: 'FF',
    },
    angle: 25,
    startAngle: 90,
  },
}

export class LSystemRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.draw()
  }

  setParams(params: ParamValues): void {
    this.params = { ...params }
    this.draw()
  }

  reset(): void {
    this.draw()
  }

  step(): void {}

  draw(): void {
    const ctx = this.ctx2d
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, this.width, this.height)

    const preset = PRESETS[this.params.preset as string] ?? PRESETS.koch
    const iterations = this.params.iterations as number
    const angleDeg = (this.params.angle as number) || preset.angle

    let s = preset.axiom
    // Cap expansion to prevent runaway memory.
    for (let i = 0; i < iterations; i++) {
      let next = ''
      for (const ch of s) {
        next += preset.rules[ch] ?? ch
      }
      if (next.length > 2_000_000) break
      s = next
    }

    // First pass: compute bounding box.
    const angleRad = (angleDeg * Math.PI) / 180
    const startAngleRad = (preset.startAngle * Math.PI) / 180
    let { minX, maxX, minY, maxY } = walk(s, angleRad, startAngleRad)

    if (minX === maxX) maxX = minX + 1
    if (minY === maxY) maxY = minY + 1

    const padding = 0.05
    const w = this.width * (1 - padding * 2)
    const h = this.height * (1 - padding * 2)
    const scale = Math.min(w / (maxX - minX), h / (maxY - minY))
    const offsetX = this.width * padding + (w - (maxX - minX) * scale) / 2 - minX * scale
    const offsetY = this.height * padding + (h - (maxY - minY) * scale) / 2 - minY * scale

    // Second pass: draw.
    ctx.strokeStyle = colorFor(this.params.color as string)
    ctx.lineWidth = Math.max(0.5, 1.5 - iterations * 0.1)
    let x = 0
    let y = 0
    let angle = startAngleRad
    const stack: { x: number; y: number; angle: number }[] = []
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)

    for (const ch of s) {
      if (ch === 'F' || ch === 'A' || ch === 'B') {
        const nx = x + Math.cos(angle)
        const ny = y + Math.sin(angle)
        ctx.lineTo(nx * scale + offsetX, ny * scale + offsetY)
        x = nx
        y = ny
      } else if (ch === 'f') {
        x += Math.cos(angle)
        y += Math.sin(angle)
        ctx.moveTo(x * scale + offsetX, y * scale + offsetY)
      } else if (ch === '+') {
        angle += angleRad
      } else if (ch === '-') {
        angle -= angleRad
      } else if (ch === '[') {
        stack.push({ x, y, angle })
      } else if (ch === ']') {
        const s = stack.pop()!
        x = s.x
        y = s.y
        angle = s.angle
        ctx.moveTo(x * scale + offsetX, y * scale + offsetY)
      }
    }
    ctx.stroke()
  }

  dispose(): void {}
}

function walk(s: string, angleRad: number, startAngleRad: number) {
  let x = 0
  let y = 0
  let angle = startAngleRad
  let minX = 0
  let maxX = 0
  let minY = 0
  let maxY = 0
  const stack: { x: number; y: number; angle: number }[] = []
  for (const ch of s) {
    if (ch === 'F' || ch === 'A' || ch === 'B' || ch === 'f') {
      x += Math.cos(angle)
      y += Math.sin(angle)
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    } else if (ch === '+') angle += angleRad
    else if (ch === '-') angle -= angleRad
    else if (ch === '[') stack.push({ x, y, angle })
    else if (ch === ']') {
      const s = stack.pop()!
      x = s.x
      y = s.y
      angle = s.angle
    }
  }
  return { minX, maxX, minY, maxY }
}

function colorFor(name: string): string {
  if (name === 'plant') return '#7ed957'
  if (name === 'fire') return '#ff8b3d'
  if (name === 'mono') return '#dfe3eb'
  return '#6ec1ff'
}

export function createLSystemRenderer(): Renderer {
  return new LSystemRenderer()
}
