import type { Pattern } from '../../types/pattern'
import { createDLARenderer } from './renderer'

export const dla: Pattern = {
  id: 'dla',
  title: 'Diffusion-Limited Aggregation',
  category: 'Crystalline',
  blurb:
    'Random walkers stick to a growing cluster on first contact. Produces lichen, frost-on-window, and mineral dendrite branching — pure stochastic geometry.',
  params: [
    {
      type: 'select',
      name: 'seed',
      label: 'seed',
      options: [
        { value: 'point', label: 'Single point' },
        { value: 'circle', label: 'Circle' },
        { value: 'line', label: 'Bottom line' },
      ],
      default: 'point',
    },
    {
      type: 'number',
      name: 'walkers',
      label: 'walkers per step',
      description: 'Higher = faster growth, more CPU.',
      min: 1,
      max: 50,
      step: 1,
      default: 10,
    },
    {
      type: 'number',
      name: 'stickiness',
      label: 'stickiness',
      description: 'Probability a walker sticks on contact. Lower = denser cluster.',
      min: 0.1,
      max: 1,
      step: 0.05,
      default: 1,
    },
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size (px)',
      min: 1,
      max: 6,
      step: 1,
      default: 2,
    },
  ],
  createRenderer: createDLARenderer,
  explainer: () => import('./Explainer'),
}
