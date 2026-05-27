import type { Pattern } from '../../types/pattern'
import { createSchellingRenderer } from './renderer'

export const schelling: Pattern = {
  id: 'schelling',
  title: 'Schelling Segregation',
  category: 'Cellular Automata',
  blurb:
    "Thomas Schelling 1971 (Nobel 2005). Mildly-tolerant agents who only ask that 30% of their neighbors look like them still produce extreme segregation — a starkly counterintuitive emergent result.",
  params: [
    {
      type: 'number',
      name: 'tolerance',
      label: 'similarity threshold',
      description: 'Fraction of same-type neighbors required for happiness.',
      min: 0,
      max: 0.95,
      step: 0.05,
      default: 0.35,
    },
    {
      type: 'number',
      name: 'density',
      label: 'occupancy density',
      min: 0.5,
      max: 0.95,
      step: 0.05,
      default: 0.85,
    },
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size (px)',
      min: 2,
      max: 12,
      step: 1,
      default: 4,
    },
  ],
  createRenderer: createSchellingRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
