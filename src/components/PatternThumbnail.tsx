import { useEffect, useRef } from 'react'
import type { Pattern, Renderer } from '../types/pattern'
import { buildDefaultParams } from '../patterns/registry'

interface Props {
  pattern: Pattern
}

/**
 * Live mini-renderer. Runs the pattern at thumbnail resolution and stops after
 * a budget of frames so we don't burn CPU on the gallery.
 */
export function PatternThumbnail({ pattern }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = 320
    const h = 200
    canvas.width = w * dpr
    canvas.height = h * dpr

    let renderer: Renderer | null = null
    let raf = 0
    let frame = 0
    const budget = 600
    const stepsPerFrame = pattern.stepsPerFrame ?? 1

    try {
      renderer = pattern.createRenderer()
      renderer.init({
        canvas,
        width: canvas.width,
        height: canvas.height,
        params: buildDefaultParams(pattern),
      })
    } catch (err) {
      console.warn(`Thumbnail init failed for ${pattern.id}:`, err)
      return
    }

    const r = renderer
    const loop = () => {
      if (!r) return
      for (let i = 0; i < stepsPerFrame; i++) r.step()
      r.draw()
      frame++
      if (frame < budget) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      r?.dispose()
    }
  }, [pattern])

  return <canvas ref={canvasRef} className="thumbnail" />
}
