import type { Pattern } from '../../types/pattern'
import { createNewtonRenderer } from './renderer'

export const newton: Pattern = {
  id: 'newton',
  title: "Newton's Fractal",
  category: 'Fractals',
  blurb:
    "Apply Newton's method to z^n - 1 = 0. Each pixel is colored by which root it converges to. The boundaries between basins of attraction are fractal.",
  params: [
    {
      type: 'number',
      name: 'degree',
      label: 'polynomial degree (n)',
      min: 3,
      max: 8,
      step: 1,
      default: 3,
    },
    {
      type: 'number',
      name: 'relaxation',
      label: 'relaxation',
      description: '1.0 = standard Newton. <1 = damped, >1 = over-relaxed (chaotic).',
      min: 0.5,
      max: 2.0,
      step: 0.05,
      default: 1.0,
    },
    {
      type: 'number',
      name: 'iterations',
      label: 'max iterations',
      min: 16,
      max: 200,
      step: 8,
      default: 64,
    },
    { type: 'number', name: 'cx', label: 'center x', min: -2, max: 2, step: 0.01, default: 0 },
    { type: 'number', name: 'cy', label: 'center y', min: -2, max: 2, step: 0.01, default: 0 },
    {
      type: 'number',
      name: 'zoom',
      label: 'zoom',
      min: 0.3,
      max: 200,
      step: 0.1,
      default: 0.7,
    },
  ],
  createRenderer: createNewtonRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
