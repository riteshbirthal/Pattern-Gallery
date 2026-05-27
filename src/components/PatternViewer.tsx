import { useEffect, useRef, useState, useMemo, Suspense, lazy } from 'react'
import type { Pattern, ParamValues, Renderer } from '../types/pattern'
import { ParamControl } from './ParamControl'
import { buildDefaultParams } from '../patterns/registry'

interface Props {
  pattern: Pattern
}

export function PatternViewer({ pattern }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const rafRef = useRef<number | null>(null)
  const frameCountRef = useRef(0)
  const [params, setParams] = useState<ParamValues>(() => buildDefaultParams(pattern))
  const [paused, setPaused] = useState(false)
  const Explainer = useMemo(() => lazy(pattern.explainer), [pattern.explainer])

  // Init renderer once per pattern. Subsequent param changes go through setParams.
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = container.getBoundingClientRect()
    const width = Math.max(200, Math.floor(rect.width))
    const height = Math.max(200, Math.floor(rect.height))
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const renderer = pattern.createRenderer()
    renderer.init({
      canvas,
      width: canvas.width,
      height: canvas.height,
      params: buildDefaultParams(pattern),
    })
    rendererRef.current = renderer

    return () => {
      renderer.dispose()
      rendererRef.current = null
    }
  }, [pattern])

  // Push param changes into renderer.
  useEffect(() => {
    rendererRef.current?.setParams(params)
  }, [params])

  // Animation loop.
  useEffect(() => {
    const stepsPerFrame = pattern.stepsPerFrame ?? 1
    const drawEvery = pattern.drawEvery ?? 1

    const loop = () => {
      const r = rendererRef.current
      if (r && !paused) {
        for (let i = 0; i < stepsPerFrame; i++) r.step()
        frameCountRef.current++
        if (frameCountRef.current % drawEvery === 0) r.draw()
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [pattern, paused])

  const handleReset = () => {
    rendererRef.current?.reset()
    frameCountRef.current = 0
  }

  const handleExport = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${pattern.id}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="viewer">
      <div className="viewer-canvas" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>

      <aside className="viewer-panel">
        <header className="panel-header">
          <h1>{pattern.title}</h1>
          <p className="panel-blurb">{pattern.blurb}</p>
          <div className="panel-actions">
            <button onClick={() => setPaused((p) => !p)}>
              {paused ? 'Play' : 'Pause'}
            </button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleExport}>Save PNG</button>
          </div>
        </header>

        <section className="panel-section">
          <h2>Parameters</h2>
          <div className="params">
            {pattern.params.map((schema) => (
              <ParamControl
                key={schema.name}
                schema={schema}
                value={params[schema.name]}
                onChange={(v) => setParams((prev) => ({ ...prev, [schema.name]: v }))}
              />
            ))}
          </div>
        </section>

        <section className="panel-section">
          <h2>How it works</h2>
          <div className="explainer">
            <Suspense fallback={<p>Loading…</p>}>
              <Explainer />
            </Suspense>
          </div>
        </section>
      </aside>
    </div>
  )
}
