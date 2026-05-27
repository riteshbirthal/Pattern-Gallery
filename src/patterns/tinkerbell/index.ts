import type { Pattern } from '../../types/pattern'
import { createTinkerbellRenderer } from './renderer'

export const tinkerbell: Pattern = {
  id: 'tinkerbell',
  title: 'Tinkerbell Map',
  category: 'Chaos',
  blurb:
    "A discrete-time 2D map. x' = x² - y² + ax + by, y' = 2xy + cx + dy. The strange attractor sweeps across the plane like a fairy with a glittering trail.",
  params: [
    { type: 'number', name: 'a', label: 'a', min: 0.85, max: 0.95, step: 0.001, default: 0.9 },
    { type: 'number', name: 'b', label: 'b', min: -0.7, max: -0.5, step: 0.001, default: -0.6013 },
    { type: 'number', name: 'c', label: 'c', min: 1.95, max: 2.05, step: 0.001, default: 2.0 },
    { type: 'number', name: 'd', label: 'd', min: 0.45, max: 0.55, step: 0.001, default: 0.5 },
    {
      type: 'number',
      name: 'pointsPerStep',
      label: 'points per frame',
      min: 500,
      max: 20000,
      step: 100,
      default: 5000,
    },
  ],
  createRenderer: createTinkerbellRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
