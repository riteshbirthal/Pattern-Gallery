import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

// Cell encoding: 4 bits, one per wall (N=1, E=2, S=4, W=8). All walls present = 15.
const N = 1
const E = 2
const S = 4
const W = 8
const VISITED = 16

interface Frontier {
  x: number
  y: number
}

export class MazeRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private cells!: Uint8Array
  private cols = 0
  private rows = 0
  private cellSize = 0
  private dirty = true
  // Algorithm-specific working state.
  private stack: Frontier[] = [] // backtracker
  private frontier: Frontier[] = [] // Prim's
  private wilsonPath: { x: number; y: number; dir: number }[] = []
  private wilsonStart: Frontier | null = null
  private done = false

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
    const cellSize = this.params.cellSize as number
    this.cellSize = cellSize
    this.cols = Math.floor(this.width / cellSize)
    this.rows = Math.floor(this.height / cellSize)
    this.cells = new Uint8Array(this.cols * this.rows)
    for (let i = 0; i < this.cells.length; i++) this.cells[i] = 15 // all walls
    this.stack = []
    this.frontier = []
    this.wilsonPath = []
    this.wilsonStart = null
    this.done = false

    const algo = this.params.algorithm as string
    const sx = Math.floor(this.cols / 2)
    const sy = Math.floor(this.rows / 2)
    if (algo === 'backtracker') {
      this.cells[sy * this.cols + sx] |= VISITED
      this.stack.push({ x: sx, y: sy })
    } else if (algo === 'prim') {
      this.cells[sy * this.cols + sx] |= VISITED
      this.addPrimNeighbors(sx, sy)
    } else if (algo === 'wilson') {
      // Mark a single cell in the maze.
      this.cells[sy * this.cols + sx] |= VISITED
    }

    this.ctx2d.fillStyle = '#0c0e14'
    this.ctx2d.fillRect(0, 0, this.width, this.height)
    this.dirty = true
  }

  private addPrimNeighbors(x: number, y: number) {
    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ]
    for (const d of dirs) {
      const nx = x + d.dx
      const ny = y + d.dy
      if (nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows) continue
      if (this.cells[ny * this.cols + nx] & VISITED) continue
      // Avoid duplicates.
      if (this.frontier.find((f) => f.x === nx && f.y === ny)) continue
      this.frontier.push({ x: nx, y: ny })
    }
  }

  private removeWallBetween(ax: number, ay: number, bx: number, by: number) {
    const ai = ay * this.cols + ax
    const bi = by * this.cols + bx
    if (bx === ax + 1) {
      this.cells[ai] &= ~E
      this.cells[bi] &= ~W
    } else if (bx === ax - 1) {
      this.cells[ai] &= ~W
      this.cells[bi] &= ~E
    } else if (by === ay + 1) {
      this.cells[ai] &= ~S
      this.cells[bi] &= ~N
    } else if (by === ay - 1) {
      this.cells[ai] &= ~N
      this.cells[bi] &= ~S
    }
  }

  step(): void {
    if (this.done) return
    const algo = this.params.algorithm as string
    if (algo === 'backtracker') this.stepBacktracker()
    else if (algo === 'prim') this.stepPrim()
    else if (algo === 'wilson') this.stepWilson()
  }

  private stepBacktracker() {
    if (this.stack.length === 0) {
      this.done = true
      return
    }
    const cur = this.stack[this.stack.length - 1]
    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ]
    // Shuffle.
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[dirs[i], dirs[j]] = [dirs[j], dirs[i]]
    }
    for (const d of dirs) {
      const nx = cur.x + d.dx
      const ny = cur.y + d.dy
      if (nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows) continue
      if (this.cells[ny * this.cols + nx] & VISITED) continue
      this.removeWallBetween(cur.x, cur.y, nx, ny)
      this.cells[ny * this.cols + nx] |= VISITED
      this.stack.push({ x: nx, y: ny })
      this.dirty = true
      return
    }
    // Dead end: backtrack.
    this.stack.pop()
    this.dirty = true
  }

  private stepPrim() {
    if (this.frontier.length === 0) {
      this.done = true
      return
    }
    const idx = Math.floor(Math.random() * this.frontier.length)
    const cell = this.frontier.splice(idx, 1)[0]
    // Pick a random visited neighbor and carve toward it.
    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ]
    const visited = []
    for (const d of dirs) {
      const nx = cell.x + d.dx
      const ny = cell.y + d.dy
      if (nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows) continue
      if (this.cells[ny * this.cols + nx] & VISITED) visited.push({ x: nx, y: ny })
    }
    if (visited.length > 0) {
      const v = visited[Math.floor(Math.random() * visited.length)]
      this.removeWallBetween(cell.x, cell.y, v.x, v.y)
      this.cells[cell.y * this.cols + cell.x] |= VISITED
      this.addPrimNeighbors(cell.x, cell.y)
    }
    this.dirty = true
  }

  private stepWilson() {
    // Loop-erased random walk from an unvisited start until we hit the maze.
    if (!this.wilsonStart) {
      // Find an unvisited cell.
      const unvisited: Frontier[] = []
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          if (!(this.cells[y * this.cols + x] & VISITED)) unvisited.push({ x, y })
        }
      }
      if (unvisited.length === 0) {
        this.done = true
        return
      }
      this.wilsonStart = unvisited[Math.floor(Math.random() * unvisited.length)]
      this.wilsonPath = [{ x: this.wilsonStart.x, y: this.wilsonStart.y, dir: -1 }]
    }
    const head = this.wilsonPath[this.wilsonPath.length - 1]
    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ]
    let nx: number, ny: number
    let attempts = 0
    do {
      const d = dirs[Math.floor(Math.random() * 4)]
      nx = head.x + d.dx
      ny = head.y + d.dy
      attempts++
    } while ((nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows) && attempts < 50)
    if (nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows) return
    // Loop erase: if we revisit a cell already in path, truncate path back to that point.
    const loopIdx = this.wilsonPath.findIndex((p) => p.x === nx && p.y === ny)
    if (loopIdx >= 0) {
      this.wilsonPath = this.wilsonPath.slice(0, loopIdx + 1)
    } else {
      this.wilsonPath.push({ x: nx, y: ny, dir: -1 })
    }
    if (this.cells[ny * this.cols + nx] & VISITED) {
      // Carve the path into the maze.
      for (let i = 0; i < this.wilsonPath.length - 1; i++) {
        const a = this.wilsonPath[i]
        const b = this.wilsonPath[i + 1]
        this.removeWallBetween(a.x, a.y, b.x, b.y)
        this.cells[a.y * this.cols + a.x] |= VISITED
      }
      this.wilsonPath = []
      this.wilsonStart = null
    }
    this.dirty = true
  }

  draw(): void {
    if (!this.dirty) return
    const ctx = this.ctx2d
    const cs = this.cellSize
    ctx.fillStyle = '#0c0e14'
    ctx.fillRect(0, 0, this.width, this.height)
    // Highlight current frontier/stack first.
    const algo = this.params.algorithm as string
    if (algo === 'backtracker') {
      ctx.fillStyle = 'rgba(80, 180, 240, 0.35)'
      for (const s of this.stack) ctx.fillRect(s.x * cs, s.y * cs, cs, cs)
    } else if (algo === 'prim') {
      ctx.fillStyle = 'rgba(240, 180, 80, 0.30)'
      for (const f of this.frontier) ctx.fillRect(f.x * cs, f.y * cs, cs, cs)
    } else if (algo === 'wilson') {
      ctx.fillStyle = 'rgba(200, 100, 220, 0.30)'
      for (const p of this.wilsonPath) ctx.fillRect(p.x * cs, p.y * cs, cs, cs)
    }
    // Visited cells (filled background).
    ctx.fillStyle = 'rgba(40, 60, 90, 0.35)'
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.cells[y * this.cols + x] & VISITED)
          ctx.fillRect(x * cs + 1, y * cs + 1, cs - 2, cs - 2)
      }
    }
    // Walls.
    ctx.strokeStyle = '#dde3ee'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const c = this.cells[y * this.cols + x]
        const px = x * cs
        const py = y * cs
        if (c & N) {
          ctx.moveTo(px, py)
          ctx.lineTo(px + cs, py)
        }
        if (c & W) {
          ctx.moveTo(px, py)
          ctx.lineTo(px, py + cs)
        }
        // Bottom and right of last row/col.
        if (y === this.rows - 1 && c & S) {
          ctx.moveTo(px, py + cs)
          ctx.lineTo(px + cs, py + cs)
        }
        if (x === this.cols - 1 && c & E) {
          ctx.moveTo(px + cs, py)
          ctx.lineTo(px + cs, py + cs)
        }
      }
    }
    ctx.stroke()
    this.dirty = false
  }

  dispose(): void {}
}

export function createMazeRenderer(): Renderer {
  return new MazeRenderer()
}
