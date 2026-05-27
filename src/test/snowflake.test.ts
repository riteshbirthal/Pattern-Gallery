import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReiterSnowflakeRenderer } from '../patterns/reiter-snowflake/renderer'
import { reiterSnowflake } from '../patterns/reiter-snowflake'
import { buildDefaultParams } from '../patterns/registry'

function fakeCanvas() {
  // jsdom canvas getContext returns null; provide a minimal stub.
  const stub: any = {
    fillStyle: '',
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
  }
  return {
    width: 400,
    height: 300,
    getContext: () => stub,
  } as unknown as HTMLCanvasElement
}

describe('Reiter snowflake renderer', () => {
  let renderer: ReiterSnowflakeRenderer

  beforeEach(() => {
    renderer = new ReiterSnowflakeRenderer()
  })

  it('initializes, steps, and disposes without throwing', () => {
    const canvas = fakeCanvas()
    renderer.init({
      canvas,
      width: 400,
      height: 300,
      params: buildDefaultParams(reiterSnowflake),
    })
    for (let i = 0; i < 5; i++) renderer.step()
    renderer.draw()
    renderer.dispose()
  })

  it('seeds a single frozen cell at the center after reset', () => {
    const canvas = fakeCanvas()
    const params = buildDefaultParams(reiterSnowflake)
    renderer.init({ canvas, width: 400, height: 300, params })
    // Internals: read state via cast.
    const state: Float32Array = (renderer as any).state
    const cols: number = (renderer as any).cols
    const rows: number = (renderer as any).rows
    const c = Math.floor(cols / 2)
    const r = Math.floor(rows / 2)
    expect(state[r * cols + c]).toBe(1)

    let frozenCount = 0
    for (const v of state) if (v >= 1) frozenCount++
    expect(frozenCount).toBe(1)
  })

  it('grows the frozen region over time', () => {
    const canvas = fakeCanvas()
    const params = { ...buildDefaultParams(reiterSnowflake), beta: 0.6, gamma: 0.005 }
    renderer.init({ canvas, width: 400, height: 300, params })
    const state: Float32Array = (renderer as any).state
    const initialFrozen = countFrozen(state)
    for (let i = 0; i < 50; i++) renderer.step()
    const laterFrozen = countFrozen(state)
    expect(laterFrozen).toBeGreaterThan(initialFrozen)
  })
})

function countFrozen(s: Float32Array): number {
  let n = 0
  for (const v of s) if (v >= 1) n++
  return n
}
