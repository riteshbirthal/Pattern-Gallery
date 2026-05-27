import type { Pattern } from '../../types/pattern'
import { createMagneticPendulumRenderer } from './renderer'

export const magneticPendulum: Pattern = {
  id: 'magnetic-pendulum',
  title: 'Magnetic Pendulum (Basins)',
  category: 'Physics',
  blurb:
    "A pendulum hovers over magnets. The basins of attraction — which magnet captures each starting position — form a Wada-style fractal whose boundary is famously infinitely intertwined.",
  params: [
    { type: 'number', name: 'magnets', label: 'magnets', min: 3, max: 7, step: 1, default: 3 },
    {
      type: 'number',
      name: 'friction',
      label: 'friction',
      min: 0.05,
      max: 0.5,
      step: 0.01,
      default: 0.18,
    },
    {
      type: 'number',
      name: 'height',
      label: 'pendulum height',
      min: 0.1,
      max: 0.8,
      step: 0.02,
      default: 0.25,
    },
  ],
  createRenderer: createMagneticPendulumRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
