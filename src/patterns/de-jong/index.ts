import type { Pattern } from '../../types/pattern'
import { createDeJongRenderer } from './renderer'

export const deJong: Pattern = {
  id: 'de-jong',
  title: 'Peter de Jong Attractor',
  category: 'Chaos',
  blurb:
    'Cousin to the Clifford map. Different trig combinations yield very different visual character — woven fabrics, smoke rings, and twisted ropes.',
  params: [
    { type: 'number', name: 'a', label: 'a', min: -3, max: 3, step: 0.01, default: 1.4 },
    { type: 'number', name: 'b', label: 'b', min: -3, max: 3, step: 0.01, default: -2.3 },
    { type: 'number', name: 'c', label: 'c', min: -3, max: 3, step: 0.01, default: 2.4 },
    { type: 'number', name: 'd', label: 'd', min: -3, max: 3, step: 0.01, default: -2.1 },
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
      default: 280,
    },
  ],
  createRenderer: createDeJongRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
