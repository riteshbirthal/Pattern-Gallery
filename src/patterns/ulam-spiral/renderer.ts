import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n < 4) return true
  if (n % 2 === 0) return false
  if (n % 3 === 0) return n === 3
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false
  }
  return true
}

export class UlamSpiralRenderer implements Renderer {
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
    const cellSize = this.params.cellSize as number
    const variant = this.params.variant as string
    const cols = Math.floor(this.width / cellSize)
    const rows = Math.floor(this.height / cellSize)
    const cx = Math.floor(cols / 2)
    const cy = Math.floor(rows / 2)
    const total = Math.min(cols * rows, 1000000)
    // Walk the spiral and plot.
    let x = 0
    let y = 0
    let dx = 0
    let dy = -1
    const limit = Math.max(cols, rows) + 1
    for (let n = 1; n <= total; n++) {
      const px = (cx + x) * cellSize
      const py = (cy + y) * cellSize
      if (px < 0 || px >= this.width || py < 0 || py >= this.height) {
        // Continue walking but skip drawing.
      } else {
        let plot = false
        let color = '#dde3ee'
        if (variant === 'primes') {
          plot = isPrime(n)
          color = '#dde3ee'
        } else if (variant === 'twins') {
          if (isPrime(n) && (isPrime(n - 2) || isPrime(n + 2))) {
            plot = true
            color = '#7af0a0'
          } else if (isPrime(n)) {
            plot = true
            color = '#3d6470'
          }
        } else if (variant === 'sophie') {
          // Sophie Germain primes: p prime and 2p+1 prime.
          if (isPrime(n) && isPrime(2 * n + 1)) {
            plot = true
            color = '#f0a85a'
          } else if (isPrime(n)) {
            plot = true
            color = '#3d6470'
          }
        } else if (variant === 'mod6') {
          if (isPrime(n)) {
            plot = true
            color = n % 6 === 1 ? '#5ab4f0' : n % 6 === 5 ? '#f08560' : '#dde3ee'
          }
        }
        if (plot) {
          ctx.fillStyle = color
          ctx.fillRect(px, py, Math.max(1, cellSize - 1), Math.max(1, cellSize - 1))
        }
      }
      // Advance spiral.
      if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
        const t = dx
        dx = -dy
        dy = t
      }
      x += dx
      y += dy
      if (Math.abs(x) > limit && Math.abs(y) > limit) break
    }
    this.dirty = false
  }

  dispose(): void {}
}

export function createUlamSpiralRenderer(): Renderer {
  return new UlamSpiralRenderer()
}
