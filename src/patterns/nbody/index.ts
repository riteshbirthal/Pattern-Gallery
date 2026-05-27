import type { Pattern } from '../../types/pattern'
import { createNBodyRenderer } from './renderer'

export const nbody: Pattern = {
  id: 'nbody',
  title: 'N-body Gravity',
  category: 'Physics',
  blurb:
    'Newtonian gravity with three or more bodies. The two-body problem is integrable; the three-body problem is not (Poincaré, 1889). Includes Chenciner-Montgomery\'s figure-eight choreography.',
  params: [
    {
      type: 'select',
      name: 'preset',
      label: 'preset',
      default: 'figure8',
      options: [
        { value: 'figure8', label: 'figure-eight (3-body)' },
        { value: 'cluster', label: 'central cluster' },
        { value: 'random', label: 'random swarm' },
      ],
    },
    { type: 'number', name: 'bodies', label: 'bodies', min: 3, max: 60, step: 1, default: 30 },
    { type: 'number', name: 'G', label: 'G', min: 0.1, max: 3, step: 0.05, default: 1 },
  ],
  createRenderer: createNBodyRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 2,
}
