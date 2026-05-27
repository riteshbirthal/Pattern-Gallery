import type { Pattern } from '../../types/pattern'
import { createRosslerRenderer } from './renderer'

export const rossler: Pattern = {
  id: 'rossler',
  title: 'Rössler Attractor',
  category: 'Chaos',
  blurb:
    "Otto Rössler's 1976 simplification of the Lorenz system. Just one quadratic nonlinearity. Most of the orbit lives in the (x,y) plane, occasionally jumping vertically — a single 'spiral with kicks'.",
  params: [
    { type: 'number', name: 'a', label: 'a', min: 0.05, max: 0.5, step: 0.005, default: 0.2 },
    { type: 'number', name: 'b', label: 'b', min: 0.05, max: 0.5, step: 0.005, default: 0.2 },
    { type: 'number', name: 'c', label: 'c', min: 1, max: 12, step: 0.05, default: 5.7 },
    {
      type: 'number',
      name: 'particles',
      label: 'particles',
      min: 1,
      max: 50,
      step: 1,
      default: 12,
    },
    {
      type: 'number',
      name: 'fade',
      label: 'trail fade',
      description: '0 = no fade (long trails), higher = trails dissolve faster.',
      min: 0,
      max: 0.2,
      step: 0.001,
      default: 0.012,
    },
  ],
  createRenderer: createRosslerRenderer,
  explainer: () => import('./Explainer'),
  stepsPerFrame: 6,
}
