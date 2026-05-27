import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'

/**
 * Animated hero background: a subtle flow-field-style render at very low opacity,
 * matching the gallery's aesthetic.
 */
export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return
    const noise = createNoise3D(seeded(7))

    const particleCount = 600
    type P = { x: number; y: number; px: number; py: number; life: number }
    const particles: P[] = []
    const reset = (p: P) => {
      p.x = Math.random() * canvas.width
      p.y = Math.random() * canvas.height
      p.px = p.x
      p.py = p.y
      p.life = 0
    }
    for (let i = 0; i < particleCount; i++) {
      const p: P = { x: 0, y: 0, px: 0, py: 0, life: 0 }
      reset(p)
      particles.push(p)
    }

    let z = 0
    const loop = () => {
      ctx.fillStyle = 'rgba(11, 13, 18, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 1
      const scale = 0.0015
      for (const p of particles) {
        const angle = noise(p.x * scale, p.y * scale, z) * Math.PI * 2
        p.px = p.x
        p.py = p.y
        p.x += Math.cos(angle) * 1.2 * dpr
        p.y += Math.sin(angle) * 1.2 * dpr
        p.life++
        if (
          p.x < 0 ||
          p.x > canvas.width ||
          p.y < 0 ||
          p.y > canvas.height ||
          p.life > 400
        ) {
          reset(p)
          continue
        }
        const t = ((angle / (Math.PI * 2)) + 1) % 1
        const r = Math.floor(60 + 80 * t)
        const g = Math.floor(120 + 80 * (1 - t))
        const b = Math.floor(180 + 60 * t)
        ctx.strokeStyle = `rgba(${r},${g},${b},0.08)`
        ctx.beginPath()
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
      z += 0.0008
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-bg-canvas" aria-hidden="true" />
}

function seeded(s: number): () => number {
  let x = s >>> 0
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0
    return x / 0xffffffff
  }
}
