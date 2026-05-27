import type { Pattern } from '../../types/pattern'
import { createChaosGameRenderer } from './renderer'

export const chaosGame: Pattern = {
  id: 'chaos-game',
  title: 'Chaos Game',
  category: 'Fractals',
  blurb:
    'Pick a polygon. Drop a point. Repeatedly jump halfway toward a random vertex. After enough jumps the points trace a fractal — including the Sierpinski triangle.',
  params: [
    {
      type: 'number',
      name: 'vertices',
      label: 'vertices',
      min: 3,
      max: 8,
      step: 1,
      default: 3,
    },
    {
      type: 'number',
      name: 'ratio',
      label: 'jump ratio',
      description: '0.5 = halfway. Try 0.4 with 5 vertices.',
      min: 0.3,
      max: 0.7,
      step: 0.01,
      default: 0.5,
    },
    {
      type: 'select',
      name: 'restriction',
      label: 'restriction',
      options: [
        { value: 'none', label: 'No restriction' },
        { value: 'no-repeat', label: 'Same vertex forbidden' },
        { value: 'no-adjacent', label: 'Adjacent vertex forbidden' },
      ],
      default: 'none',
    },
    {
      type: 'number',
      name: 'pointsPerStep',
      label: 'points per frame',
      description: 'Drop more points each frame for faster convergence.',
      min: 100,
      max: 5000,
      step: 100,
      default: 1500,
    },
  ],
  createRenderer: createChaosGameRenderer,
  explainer: () => import('./Explainer'),
}
