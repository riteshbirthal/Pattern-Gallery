import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FlowFieldRenderer } from '../patterns/flow-field/renderer'
import { flowField } from '../patterns/flow-field'
import { buildDefaultParams } from '../patterns/registry'

function fakeCanvas() {
  const stub: any = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
  }
  return {
    width: 400,
    height: 300,
    getContext: () => stub,
  } as unknown as HTMLCanvasElement
}

describe('Flow field renderer', () => {
  let renderer: FlowFieldRenderer
  beforeEach(() => {
    renderer = new FlowFieldRenderer()
  })

  it('initializes and steps without error', () => {
    const canvas = fakeCanvas()
    renderer.init({
      canvas,
      width: 400,
      height: 300,
      params: buildDefaultParams(flowField),
    })
    for (let i = 0; i < 5; i++) renderer.step()
    renderer.dispose()
  })

  it('keeps particle count in sync with the param', () => {
    const canvas = fakeCanvas()
    renderer.init({
      canvas,
      width: 400,
      height: 300,
      params: buildDefaultParams(flowField),
    })
    const initial = (renderer as any).particles.length
    expect(initial).toBe(buildDefaultParams(flowField).particles)

    renderer.setParams({ ...buildDefaultParams(flowField), particles: 500 })
    expect((renderer as any).particles.length).toBe(500)
  })

  it('respawns particles that go off-canvas', () => {
    const canvas = fakeCanvas()
    renderer.init({
      canvas,
      width: 400,
      height: 300,
      params: { ...buildDefaultParams(flowField), particles: 10, speed: 1.5 },
    })
    // Force a particle out-of-bounds, then step.
    const ps: any[] = (renderer as any).particles
    ps[0].x = -100
    ps[0].y = -100
    renderer.step()
    expect(ps[0].x).toBeGreaterThanOrEqual(0)
    expect(ps[0].x).toBeLessThanOrEqual(400)
    expect(ps[0].y).toBeGreaterThanOrEqual(0)
    expect(ps[0].y).toBeLessThanOrEqual(300)
  })
})
