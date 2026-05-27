import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

// Multi-state Langton ant: rule string e.g. "RL", "LRRRRRLLR", etc.
// Each character is the turn taken when on a cell of that state.
// The cell state then advances to the next index (mod rule.length).
const COLORS: [number, number, number][] = [
  [11, 13, 18],
  [110, 200, 240],
  [240, 110, 200],
  [200, 240, 110],
  [240, 220, 110],
  [180, 110, 240],
  [110, 240, 180],
  [240, 180, 110],
  [200, 200, 200],
  [255, 80, 80],
]

export class LangtonAntRenderer implements Renderer {
  private ctx2d!: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private params!: ParamValues
  private cellSize = 0
  private cols = 0
  private rows = 0
  private grid!: Uint8Array
  private imageData!: ImageData
  private ax = 0
  private ay = 0
  private dir = 0 // 0 N, 1 E, 2 S, 3 W
  private rule = 'RL'
  private dirty = true

  init(ctx: RendererContext): void {
    const c = ctx.canvas.getContext('2d', { alpha: false })
    if (!c) throw new Error('2D context unavailable')
    this.ctx2d = c
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.allocate()
    this.reset()
  }

  private allocate() {
    this.cellSize = this.params.cellSize as number
    this.cols = Math.floor(this.width / this.cellSize)
    this.rows = Math.floor(this.height / this.cellSize)
    this.grid = new Uint8Array(this.cols * this.rows)
    this.imageData = this.ctx2d.createImageData(this.width, this.height)
  }

  setParams(params: ParamValues): void {
    const realloc = (params.cellSize as number) !== (this.params.cellSize as number)
    const ruleChanged = (params.rule as string) !== (this.params.rule as string)
    this.params = { ...params }
    if (realloc) this.allocate()
    if (realloc || ruleChanged) this.reset()
  }

  reset(): void {
    this.grid.fill(0)
    this.ax = Math.floor(this.cols / 2)
    this.ay = Math.floor(this.rows / 2)
    this.dir = 0
    this.rule = (this.params.rule as string).toUpperCase().replace(/[^LR]/g, '') || 'RL'
    this.dirty = true
    this.draw()
  }

  step(): void {
    const stepsPerStep = (this.params.stepsPerStep as number) ?? 200
    const cols = this.cols
    const rows = this.rows
    const ruleLen = this.rule.length
    for (let s = 0; s < stepsPerStep; s++) {
      const idx = this.ay * cols + this.ax
      const state = this.grid[idx]
      const turn = this.rule[state]
      if (turn === 'R') this.dir = (this.dir + 1) & 3
      else this.dir = (this.dir + 3) & 3
      this.grid[idx] = (state + 1) % ruleLen
      // Move forward.
      switch (this.dir) {
        case 0:
          this.ay--
          break
        case 1:
          this.ax++
          break
        case 2:
          this.ay++
          break
        case 3:
          this.ax--
          break
      }
      // Wrap.
      if (this.ax < 0) this.ax = cols - 1
      else if (this.ax >= cols) this.ax = 0
      if (this.ay < 0) this.ay = rows - 1
      else if (this.ay >= rows) this.ay = 0
    }
    this.dirty = true
  }

  draw(): void {
    if (!this.dirty) return
    const data = this.imageData.data
    const cellSize = this.cellSize
    const cols = this.cols
    const rows = this.rows
    const w = this.width
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const state = this.grid[y * cols + x]
        const c = COLORS[state % COLORS.length]
        const px = x * cellSize
        const py = y * cellSize
        for (let dy = 0; dy < cellSize; dy++) {
          for (let dx = 0; dx < cellSize; dx++) {
            const di = ((py + dy) * w + (px + dx)) * 4
            data[di] = c[0]
            data[di + 1] = c[1]
            data[di + 2] = c[2]
            data[di + 3] = 255
          }
        }
      }
    }
    // Draw the ant.
    const px = this.ax * cellSize
    const py = this.ay * cellSize
    for (let dy = 0; dy < cellSize; dy++) {
      for (let dx = 0; dx < cellSize; dx++) {
        const di = ((py + dy) * w + (px + dx)) * 4
        data[di] = 255
        data[di + 1] = 80
        data[di + 2] = 80
        data[di + 3] = 255
      }
    }
    this.ctx2d.putImageData(this.imageData, 0, 0)
    this.dirty = false
  }

  dispose(): void {}
}

export function createLangtonAntRenderer(): Renderer {
  return new LangtonAntRenderer()
}
