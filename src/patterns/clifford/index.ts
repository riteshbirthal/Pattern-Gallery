import type { Pattern } from '../../types/pattern'
import { createCliffordRenderer } from './renderer'

export const clifford: Pattern = {
  id: 'clifford',
  title: 'Clifford Attractor',
  category: 'Chaos',
  blurb:
    'A 2D iterated map by Clifford Pickover. Four parameters carve a strange attractor — wispy, organic, and infinitely detailed.',
  params: [
    { type: 'number', name: 'a', label: 'a', min: -3, max: 3, step: 0.01, default: -1.4 },
    { type: 'number', name: 'b', label: 'b', min: -3, max: 3, step: 0.01, default: 1.6 },
    { type: 'number', name: 'c', label: 'c', min: -3, max: 3, step: 0.01, default: 1.0 },
    { type: 'number', name: 'd', label: 'd', min: -3, max: 3, step: 0.01, default: 0.7 },
    {
      type: 'number',
      name: 'pointsPerStep',
      label: 'points per frame',
      min: 1000,
      max: 50000,
      step: 1000,
      default: 10000,
    },
    {
      type: 'number',
      name: 'hue',
      label: 'hue shift',
      min: 0,
      max: 360,
      step: 1,
      default: 200,
    },
  ],
  createRenderer: createCliffordRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
