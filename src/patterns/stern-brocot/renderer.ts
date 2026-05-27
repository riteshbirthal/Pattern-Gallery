import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

interface Node {
  num: number
  den: number
  x: number
  y: number
  depth: number
}

export class SternBrocotRenderer implements Renderer {
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
    const depth = this.params.depth as number
    if (variant === 'tree') this.drawTree(ctx, depth)
    else this.drawFarey(ctx, depth)
    this.dirty = false
  }

  private drawTree(ctx: CanvasRenderingContext2D, maxDepth: number): void {
    const margin = 30
    const usableW = this.width - margin * 2
    const usableH = this.height - margin * 2
    const root: Node = { num: 1, den: 1, x: this.width / 2, y: margin + 16, depth: 0 }
    const stack: Array<{ node: Node; lo: [number, number]; hi: [number, number] }> = [
      { node: root, lo: [0, 1], hi: [1, 0] },
    ]
    ctx.font = '11px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    while (stack.length > 0) {
      const { node, lo, hi } = stack.pop()!
      // Draw node label.
      const t = node.depth / maxDepth
      ctx.fillStyle = `hsl(${200 + t * 130}, 75%, 70%)`
      ctx.fillText(`${node.num}/${node.den}`, node.x, node.y)
      if (node.depth >= maxDepth) continue
      const childY = margin + ((node.depth + 1) / maxDepth) * usableH
      const halfWidth = usableW / Math.pow(2, node.depth + 2)
      const leftMed: [number, number] = [lo[0] + node.num, lo[1] + node.den]
      const rightMed: [number, number] = [node.num + hi[0], node.den + hi[1]]
      const leftNode: Node = {
        num: leftMed[0],
        den: leftMed[1],
        x: node.x - halfWidth,
        y: childY,
        depth: node.depth + 1,
      }
      const rightNode: Node = {
        num: rightMed[0],
        den: rightMed[1],
        x: node.x + halfWidth,
        y: childY,
        depth: node.depth + 1,
      }
      ctx.strokeStyle = `hsla(${200 + t * 130}, 70%, 55%, 0.5)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(node.x, node.y + 8)
      ctx.lineTo(leftNode.x, leftNode.y - 8)
      ctx.moveTo(node.x, node.y + 8)
      ctx.lineTo(rightNode.x, rightNode.y - 8)
      ctx.stroke()
      stack.push({ node: rightNode, lo: [node.num, node.den], hi })
      stack.push({ node: leftNode, lo, hi: [node.num, node.den] })
    }
  }

  private drawFarey(ctx: CanvasRenderingContext2D, n: number): void {
    // Farey sequence F_n: all reduced fractions in [0,1] with denominator <= n.
    // Draw Ford circles: at p/q, circle of radius 1/(2q^2) tangent to x-axis.
    const margin = 40
    const baseY = this.height - margin
    const usableW = this.width - margin * 2
    const fractions: Array<[number, number]> = []
    for (let q = 1; q <= n; q++) {
      for (let p = 0; p <= q; p++) {
        if (gcd(p, q) === 1) fractions.push([p, q])
      }
    }
    // Ford circles.
    for (const [p, q] of fractions) {
      const cx = margin + (p / q) * usableW
      const r = usableW / (2 * q * q)
      const cy = baseY - r
      const t = 1 / q
      ctx.strokeStyle = `hsla(${200 + t * 160}, 75%, 70%, 0.85)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    // Number line.
    ctx.strokeStyle = '#3d4a60'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(margin, baseY)
    ctx.lineTo(this.width - margin, baseY)
    ctx.stroke()
  }

  dispose(): void {}
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

export function createSternBrocotRenderer(): Renderer {
  return new SternBrocotRenderer()
}
