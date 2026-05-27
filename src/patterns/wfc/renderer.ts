import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

// Simple tile-based Wave Function Collapse using a small hand-crafted tileset
// representing roads / paths on a colored background.

interface Tile {
  // Edge codes: top, right, bottom, left.
  edges: [number, number, number, number]
  draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number) => void
}

const TILES: Tile[] = [
  // 0 = empty/grass, 1 = path
  // empty
  {
    edges: [0, 0, 0, 0],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
    },
  },
  // straight horizontal
  {
    edges: [0, 1, 0, 1],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x, y + s * 0.4, s, s * 0.2)
    },
  },
  // straight vertical
  {
    edges: [1, 0, 1, 0],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x + s * 0.4, y, s * 0.2, s)
    },
  },
  // corner top-right
  {
    edges: [1, 1, 0, 0],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x + s * 0.4, y, s * 0.2, s * 0.6)
      ctx.fillRect(x + s * 0.4, y + s * 0.4, s * 0.6, s * 0.2)
    },
  },
  // corner top-left
  {
    edges: [1, 0, 0, 1],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x + s * 0.4, y, s * 0.2, s * 0.6)
      ctx.fillRect(x, y + s * 0.4, s * 0.6, s * 0.2)
    },
  },
  // corner bottom-right
  {
    edges: [0, 1, 1, 0],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x + s * 0.4, y + s * 0.4, s * 0.2, s * 0.6)
      ctx.fillRect(x + s * 0.4, y + s * 0.4, s * 0.6, s * 0.2)
    },
  },
  // corner bottom-left
  {
    edges: [0, 0, 1, 1],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x + s * 0.4, y + s * 0.4, s * 0.2, s * 0.6)
      ctx.fillRect(x, y + s * 0.4, s * 0.6, s * 0.2)
    },
  },
  // T-junction down
  {
    edges: [0, 1, 1, 1],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x, y + s * 0.4, s, s * 0.2)
      ctx.fillRect(x + s * 0.4, y + s * 0.4, s * 0.2, s * 0.6)
    },
  },
  // T-junction up
  {
    edges: [1, 1, 0, 1],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x, y + s * 0.4, s, s * 0.2)
      ctx.fillRect(x + s * 0.4, y, s * 0.2, s * 0.6)
    },
  },
  // T-junction right
  {
    edges: [1, 1, 1, 0],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x + s * 0.4, y, s * 0.2, s)
      ctx.fillRect(x + s * 0.4, y + s * 0.4, s * 0.6, s * 0.2)
    },
  },
  // T-junction left
  {
    edges: [1, 0, 1, 1],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x + s * 0.4, y, s * 0.2, s)
      ctx.fillRect(x, y + s * 0.4, s * 0.6, s * 0.2)
    },
  },
  // cross
  {
    edges: [1, 1, 1, 1],
    draw: (ctx, x, y, s) => {
      ctx.fillStyle = '#1a2330'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#dde3ee'
      ctx.fillRect(x, y + s * 0.4, s, s * 0.2)
      ctx.fillRect(x + s * 0.4, y, s * 0.2, s)
    },
  },
]

const NTILES = TILES.length

function compatible(a: Tile, side: number, b: Tile): boolean {
  // sides: 0 top, 1 right, 2 bottom, 3 left
  const opp = (side + 2) % 4
  return a.edges[side] === b.edges[opp]
}

export class WFCRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private cols = 0
  private rows = 0
  // possibilities[i] is bitmask of allowed tiles at cell i.
  private poss: Uint16Array = new Uint16Array(0)
  private collapsed: Int8Array = new Int8Array(0)
  private done = false
  private rng = mulberry32(1)

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
    const reset = params.cellSize !== this.params.cellSize
    this.params = { ...params }
    if (reset) this.reset()
  }

  reset(): void {
    const cellSize = this.params.cellSize as number
    this.cols = Math.floor(this.width / cellSize)
    this.rows = Math.floor(this.height / cellSize)
    const N = this.cols * this.rows
    this.poss = new Uint16Array(N)
    this.collapsed = new Int8Array(N)
    const all = (1 << NTILES) - 1
    for (let i = 0; i < N; i++) {
      this.poss[i] = all
      this.collapsed[i] = -1
    }
    this.done = false
    this.rng = mulberry32(Math.floor(Math.random() * 1e9))
    this.ctx2d.fillStyle = '#0c0e14'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
  }

  step(): void {
    if (this.done) return
    // Collapse a number of cells per step.
    const cellsPerStep = 12
    for (let k = 0; k < cellsPerStep; k++) {
      // Find lowest-entropy uncollapsed cell.
      let bestEntropy = NTILES + 1
      let bestIdx = -1
      let candidates: number[] = []
      for (let i = 0; i < this.poss.length; i++) {
        if (this.collapsed[i] >= 0) continue
        const count = popcount(this.poss[i])
        if (count === 0) {
          // Contradiction: restart.
          this.reset()
          return
        }
        if (count < bestEntropy) {
          bestEntropy = count
          candidates = [i]
        } else if (count === bestEntropy) {
          candidates.push(i)
        }
      }
      if (candidates.length === 0) {
        this.done = true
        return
      }
      bestIdx = candidates[Math.floor(this.rng() * candidates.length)]
      // Pick a random tile from possibilities.
      const mask = this.poss[bestIdx]
      const choices: number[] = []
      for (let t = 0; t < NTILES; t++) if (mask & (1 << t)) choices.push(t)
      const tile = choices[Math.floor(this.rng() * choices.length)]
      this.poss[bestIdx] = 1 << tile
      this.collapsed[bestIdx] = tile
      this.propagate(bestIdx)
    }
  }

  private propagate(start: number): void {
    const stack: number[] = [start]
    while (stack.length > 0) {
      const idx = stack.pop()!
      const cx = idx % this.cols
      const cy = Math.floor(idx / this.cols)
      const myMask = this.poss[idx]
      for (let dir = 0; dir < 4; dir++) {
        const dx = dir === 1 ? 1 : dir === 3 ? -1 : 0
        const dy = dir === 2 ? 1 : dir === 0 ? -1 : 0
        const nx = cx + dx
        const ny = cy + dy
        if (nx < 0 || nx >= this.cols || ny < 0 || ny >= this.rows) continue
        const nIdx = ny * this.cols + nx
        if (this.collapsed[nIdx] >= 0) continue
        // Compute allowed tiles at neighbour given myMask.
        let allowed = 0
        for (let t = 0; t < NTILES; t++) {
          if (!(this.poss[nIdx] & (1 << t))) continue
          let ok = false
          for (let m = 0; m < NTILES; m++) {
            if (!(myMask & (1 << m))) continue
            if (compatible(TILES[m], dir, TILES[t])) {
              ok = true
              break
            }
          }
          if (ok) allowed |= 1 << t
        }
        if (allowed !== this.poss[nIdx]) {
          this.poss[nIdx] = allowed
          stack.push(nIdx)
        }
      }
    }
  }

  draw(): void {
    const ctx = this.ctx2d
    const cellSize = this.params.cellSize as number
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const idx = y * this.cols + x
        const t = this.collapsed[idx]
        if (t >= 0) {
          TILES[t].draw(ctx, x * cellSize, y * cellSize, cellSize)
        } else {
          ctx.fillStyle = '#0c0e14'
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }
    }
  }

  dispose(): void {}
}

function popcount(x: number): number {
  x = x - ((x >> 1) & 0x55555555)
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333)
  x = (x + (x >> 4)) & 0x0f0f0f0f
  return ((x * 0x01010101) >> 24) & 0xff
}

function mulberry32(seed: number): () => number {
  let t = seed
  return function () {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function createWFCRenderer(): Renderer {
  return new WFCRenderer()
}
