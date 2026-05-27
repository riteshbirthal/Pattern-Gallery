import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'
import { hexCenter, neighbourOffsets } from './hex'

/**
 * Reiter (2005) snowflake cellular automaton.
 *
 * Each hex cell carries a scalar s. The rule:
 *   - "Receptive" cells: s ≥ 1 OR any neighbour has s ≥ 1.
 *   - Non-receptive store diffusing water vapor; receptive store locked ice + constant addition γ.
 *   - Diffusion: u'_i = u_i + (α/2)(<u>_neighbours − u_i)
 *   - Update: s'_i = u'_i + v_i
 */
export class ReiterSnowflakeRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private cols = 0
  private rows = 0
  private radius = 0
  private state!: Float32Array
  private receptive!: Uint8Array
  private u!: Float32Array
  private v!: Float32Array
  private params!: ParamValues

  init(ctx: RendererContext): void {
    const { canvas, width, height, params } = ctx
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) throw new Error('2D context unavailable')
    this.ctx2d = ctx2d
    this.width = width
    this.height = height
    this.params = { ...params }
    this.allocateGrid()
    this.reset()
  }

  private allocateGrid() {
    const size = (this.params.gridSize as number) ?? 160
    this.cols = size
    this.rows = size
    // Choose radius so the whole grid fits on the canvas.
    const w = this.width
    const h = this.height
    const radiusByWidth = w / (Math.sqrt(3) * (this.cols + 0.5))
    const radiusByHeight = h / (1.5 * this.rows + 0.5)
    this.radius = Math.min(radiusByWidth, radiusByHeight)
    const n = this.cols * this.rows
    this.state = new Float32Array(n)
    this.receptive = new Uint8Array(n)
    this.u = new Float32Array(n)
    this.v = new Float32Array(n)
  }

  setParams(params: ParamValues): void {
    const reallocate = (params.gridSize as number) !== (this.params.gridSize as number)
    this.params = { ...params }
    if (reallocate) {
      this.allocateGrid()
      this.reset()
    }
  }

  reset(): void {
    const beta = this.params.beta as number
    this.state.fill(beta)
    // Seed: single ice crystal at center.
    const c = Math.floor(this.cols / 2)
    const r = Math.floor(this.rows / 2)
    this.state[r * this.cols + c] = 1
    this.draw()
  }

  step(): void {
    const cols = this.cols
    const rows = this.rows
    const s = this.state
    const u = this.u
    const v = this.v
    const recv = this.receptive
    const alpha = this.params.alpha as number
    const gamma = this.params.gamma as number

    // 1. Determine receptivity: cell is frozen, or any neighbour is.
    for (let row = 0; row < rows; row++) {
      const offsets = neighbourOffsets(row)
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col
        let isRec = s[idx] >= 1 ? 1 : 0
        if (!isRec) {
          for (let k = 0; k < 6; k++) {
            const dc = offsets[k][0]
            const dr = offsets[k][1]
            const nc = col + dc
            const nr = row + dr
            if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue
            if (s[nr * cols + nc] >= 1) {
              isRec = 1
              break
            }
          }
        }
        recv[idx] = isRec
        if (isRec) {
          u[idx] = 0
          v[idx] = s[idx] + gamma
        } else {
          u[idx] = s[idx]
          v[idx] = 0
        }
      }
    }

    // 2. Diffuse u (non-receptive field). Boundary: treat off-grid neighbours as the same cell (reflective).
    const next = new Float32Array(u.length)
    for (let row = 0; row < rows; row++) {
      const offsets = neighbourOffsets(row)
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col
        let sum = 0
        for (let k = 0; k < 6; k++) {
          const nc = col + offsets[k][0]
          const nr = row + offsets[k][1]
          if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) {
            sum += u[idx]
          } else {
            sum += u[nr * cols + nc]
          }
        }
        const avg = sum / 6
        next[idx] = u[idx] + (alpha / 2) * (avg - u[idx])
      }
    }
    // 3. s = u' + v
    for (let i = 0; i < s.length; i++) s[i] = next[i] + v[i]
  }

  draw(): void {
    const ctx = this.ctx2d
    const w = this.width
    const h = this.height
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, w, h)

    const cols = this.cols
    const rows = this.rows
    const r = this.radius
    const offsetX = (w - Math.sqrt(3) * r * (cols + 0.5)) / 2 + Math.sqrt(3) * r * 0.5
    const offsetY = (h - 1.5 * r * rows) / 2 + r

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const s = this.state[row * cols + col]
        if (s < 0.001) continue
        const { x, y } = hexCenter(col, row, r)
        const cx = x + offsetX
        const cy = y + offsetY
        ctx.fillStyle = colorFor(s)
        drawHex(ctx, cx, cy, r)
      }
    }
  }

  dispose(): void {
    // Nothing to release.
  }
}

function drawHex(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = ((Math.PI / 3) * i) - Math.PI / 2
    const px = x + r * Math.cos(a)
    const py = y + r * Math.sin(a)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
}

function colorFor(s: number): string {
  if (s >= 1) {
    // Frozen: bright icy blue → white at higher densities.
    const t = Math.min(1, (s - 1) / 1.0)
    const r = Math.floor(180 + 75 * t)
    const g = Math.floor(220 + 35 * t)
    const b = 255
    return `rgb(${r},${g},${b})`
  }
  // Vapor: faint blue gradient.
  const t = Math.min(1, s)
  const v = Math.floor(20 + 80 * t)
  return `rgb(${v},${v + 20},${v + 60})`
}

export function createReiterSnowflakeRenderer(): Renderer {
  return new ReiterSnowflakeRenderer()
}
