import type { Pattern } from '../../types/pattern'
import { createHenonRenderer } from './renderer'

export const henon: Pattern = {
  id: 'henon',
  title: 'Hénon Map',
  category: 'Chaos',
  blurb:
    "Michel Hénon's 1976 strange attractor. A 2D iterated map with one quadratic term. Zoom in: the apparent line is actually infinitely many parallel curves — Cantor structure made visible.",
  params: [
    { type: 'number', name: 'a', label: 'a', min: 1.0, max: 1.5, step: 0.001, default: 1.4 },
    { type: 'number', name: 'b', label: 'b', min: 0.05, max: 0.4, step: 0.001, default: 0.3 },
    {
      type: 'number',
      name: 'pointsPerStep',
      label: 'points per frame',
      min: 1000,
      max: 30000,
      step: 1000,
      default: 8000,
    },
  ],
  createRenderer: createHenonRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
